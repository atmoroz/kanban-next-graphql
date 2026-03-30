# Kanban Board Search Architecture

## Context

We have two GraphQL endpoints for loading tasks in a Kanban board.

### 1. Default board loading

```graphql
tasksByColumn(
  columnId: ID!
  first: Int
  after: String
  last: Int
  before: String
): TaskConnection!
```

This endpoint loads tasks per column.

UI structure:

Board
├ Column A → tasksByColumn
├ Column B → tasksByColumn
├ Column C → tasksByColumn

This allows pagination per column.

---

### 2. Search / filtering mode

When search or filters are applied we use:

```graphql
tasksByBoard(
  boardId: ID!
  query: String
  statusIds: [ID!]
  priority: [TaskPriority!]
  assigneeId: ID
  labelIds: [ID!]
  dueFilter: DueFilter
  sortBy: TaskSortBy
  sortOrder: SortOrder
  first: Int
  after: String
  last: Int
  before: String
): TaskConnection!
```

This endpoint returns a **flat list of tasks**, not grouped by columns.

Example response:

task
task
task
task

Each task has the following fields:

```
id
columnId
title
description
priority
dueDate
assigneeId
position
statusId
overrideStatusId
labelIds
createdAt
updatedAt
```

Because the tasks are returned as a **flat list**, the frontend must **group them by columnId** before rendering the board.

---

# Goal

Transform the flat list into this structure:

```
Record<columnId, Task[]>
```

So the board can render like this:

```tsx
columns.map((column) => {
  const tasks = tasksByColumn[column.id];

  return <Column tasks={tasks} />;
});
```

---

# Step 1 — Create helper to group tasks

Create a helper function to group tasks by column.

```ts
export function groupTasksByColumn(tasks: Task[]) {
  const map: Record<string, Task[]> = {};

  for (const task of tasks) {
    if (!map[task.columnId]) {
      map[task.columnId] = [];
    }

    map[task.columnId].push(task);
  }

  return map;
}
```

---

# Step 2 — Sort tasks by position

Tasks inside a column should respect their position order.

Update the helper:

```ts
export function groupTasksByColumn(tasks: Task[]) {
  const map: Record<string, Task[]> = {};

  for (const task of tasks) {
    const columnId = task.columnId;

    if (!map[columnId]) {
      map[columnId] = [];
    }

    map[columnId].push(task);
  }

  for (const columnId in map) {
    map[columnId].sort((a, b) => a.position - b.position);
  }

  return map;
}
```

---

# Step 3 — Use it when search is active

Example usage:

```ts
const groupedTasks = groupTasksByColumn(tasks);
```

Then render the board:

```tsx
columns.map((column) => {
  const tasks = groupedTasks[column.id] ?? [];

  return <Column key={column.id} column={column} tasks={tasks} />;
});
```

---

# UX Behavior

When search is active:

- tasks are loaded using `tasksByBoard`
- columns remain visible
- columns without matching tasks are empty

Example:

Todo
└ Task A

In Progress
(empty)

Done
└ Task B

This matches behavior used in:

- Jira
- Linear
- Trello

---

# Search Mode vs Default Mode (Switching Logic)

When search or filters are active, the board must switch to **"search mode"**.

In this mode:

- tasks are fetched using `tasksByBoard`
- tasks are **NOT** fetched per column (no `tasksByColumn` calls)
- UI may group tasks by `columnId` on the client
- drag & drop is **disabled or limited**

Do **not** mix `tasksByColumn` and `tasksByBoard` at the same time for the same board view.

Recommended pattern (in a widget, e.g. `widgets/board-view`):

```ts
const isSearchMode = Boolean(searchQuery) || filtersActive;

if (!isSearchMode) {
  // DEFAULT MODE
  // → useTasksByColumn(column.id) per column
} else {
  // SEARCH MODE
  // → useTasksByBoard({ boardId, query, filters })
}
```

`features/filters` is responsible for search/filter state.  
`widgets/board-view` is responsible for **orchestrating** which query is used based on that state.

---

# Drag & Drop in Search Mode

In search mode:

- ❌ drag & drop is generally **disabled**
  - or
- ⚠ works in a **very limited** way (not recommended)

Reasons:

- the visual order does not correspond to `column.position`
- data is not local to a single column (flat list, cross-filtered)

Best UX (similar to Linear):

| Mode        | Behavior      |
|------------|---------------|
| Default    | drag enabled  |
| Search     | drag disabled |

---

# Recommended Hook Architecture

Instead of handling logic inside UI components, create a hook:

```
useBoardTasks()
```

This hook decides which query to use.

Logic:

```
if search is active → tasksByBoard
else → tasksByColumn
```

The hook must always return the same structure:

```
Record<columnId, Task[]>
```

Example type:

```ts
type TasksByColumn = Record<string, Task[]>;
```

---

# Final Data Flow

Normal board mode:

tasksByColumn  
↓  
tasks already grouped  
↓  
render board

Search mode:

tasksByBoard  
↓  
flat list  
↓  
groupTasksByColumn()  
↓  
render board

---

# Expected Result

The UI should not care which query was used.

Both modes must produce the same structure:

```
Record<columnId, Task[]>
```

This keeps the board rendering simple and predictable.
