# EPIC-05 — Columns Management

## Goal

Implement board columns as status containers for tasks.

Columns must be:

- fetched for a board
- displayed in correct order
- creatable by users

Columns themselves **cannot be reordered by drag & drop**.

They serve as **task containers** and **drop targets** for task movement between columns.

---

## GraphQL Operations Used

### Queries

columns(boardId)

Returns all columns for the selected board ordered by `position`.

### Mutations

createColumn

Creates a new column inside a board.

---

## Tasks

### 1. Fetch Columns

Load columns for the active board.

Requirements:

- use `columns(boardId)` query
- fetch columns when board changes
- render columns ordered by `position`

---

### 2. Render Columns

Each column must display:

- column title
- task count
- tasks list (placeholder for now)

Columns must be rendered horizontally in the board view.

---

### 3. Create Column

Allow users to add new columns to the board.

UI requirements:

- "+ Add Column" button at the end of the board
- modal or inline input for column title

Mutation used:

createColumn

---

### 4. Optimistic Column Creation

When a column is created:

- column appears immediately in UI
- temporary ID can be used until server response
- Apollo cache must update without full refetch

---

### 5. Column as Task Drop Target

Columns must support **task drop events**.

Actual task movement logic is implemented in **EPIC-06 (Tasks Management)**.

Column responsibilities:

- accept dropped tasks
- trigger `moveTask` mutation

---

## Files & Folders to Create

### Entities

src/entities/column/
├── api/
│ ├── columns.query.ts
│ └── createColumn.mutation.ts
│
├── model/
│ └── column.types.ts
│
└── ui/
└── Column.tsx

---

### Features

src/features/create-column/
├── model/
│ └── useCreateColumn.ts
└── ui/
└── CreateColumnModal.tsx

---

### Widgets

Columns are rendered inside the board view widget.

src/widgets/board-view/
├── ui/
│ ├── BoardView.tsx
│ └── ColumnsContainer.tsx

---

### GraphQL

src/graphql/queries/columns.graphql
src/graphql/mutations/createColumn.graphql

These files are used by GraphQL Codegen.

---

## Error Handling

All errors must be handled by the global error system implemented in **EPIC-03.5**.

Behavior:

- show error toast
- rollback optimistic update if mutation fails

---

## Success Feedback

Optional success toast:

Column created

---

## Acceptance Criteria

- Columns load correctly for selected board.
- Columns render ordered by `position`.
- Users can create a new column.
- New column appears instantly (optimistic UI).
- Apollo cache updates without full refetch.
- Columns serve as containers for tasks.
- Columns themselves **cannot be reordered**.

---

## Out of Scope

The following are implemented in other epics:

- Task drag & drop → **EPIC-06**
- Task optimistic movement → **EPIC-06**
- Realtime task updates → **EPIC-08**
