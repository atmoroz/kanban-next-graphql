# EPIC-06 — Tasks Management & Optimistic UI

## Goal

Implement the full lifecycle of tasks inside the Kanban board with **Optimistic UI updates**.

Tasks must support:

- creation
- editing
- deletion
- movement between columns
- label assignment
- priority management
- status override

The UI must update **instantly** using Apollo optimistic updates without waiting for the server response.

All task operations must update the **Apollo cache** instead of refetching queries.

---

# Functional Overview

A task represents a work item inside a board column.

Each task contains:

- id
- title
- description
- columnId
- boardId
- priority
- statusId
- labelIds
- dueDate
- assigneeId
- position
- createdAt
- updatedAt

Tasks belong to a **column**, and columns belong to a **board**.

---

# GraphQL Operations Used

## Queries

task(id)

tasksByColumn(columnId)

tasksByBoard(boardId)

---

## Mutations

createTask

updateTask

deleteTask

moveTask

updateTaskLabels

updateTaskStatus

clearTaskStatusOverride

---

# Tasks Implementation

---

# 1. Fetch Tasks for Columns

Tasks must be loaded for each column using:

tasksByColumn(columnId)

Requirements:

- load tasks when board loads
- load tasks when column appears
- tasks must be ordered by `position`
- tasks must be stored in Apollo cache

---

# 2. Task Rendering

Each column must display its tasks list.

Each task card must show:

- title
- priority indicator
- labels
- due date (optional)
- assignee avatar (optional)

Task cards must be draggable.

Tasks must be rendered using:

src/entities/task/ui/TaskCard.tsx

---

# 3. Create Task

Users must be able to create a task inside a column.

UI entry points:

- "+ Add Task" button inside column
- task creation modal or inline form

---

## Task Creation Fields

The form must contain:

title (required)

description (optional)

priority (LOW / MEDIUM / HIGH)

status (derived from column)

labels (multi select)

dueDate (optional)

assignee (optional)

---

## Mutation

createTask

---

## Optimistic UI

When a task is created:

1. task appears instantly in the column
2. task receives a temporary id
3. Apollo cache inserts the task into tasksByColumn list
4. server response replaces temporary id

---

## Optimistic Cache Update

Insert task into:

tasksByColumn(columnId)

at position = 0

---

# 4. Update Task

Users must be able to edit task details.

Editable fields:

title

description

priority

labels

dueDate

assignee

status override

---

## Mutation

updateTask

---

## Optimistic Update

Update task fields immediately in cache.

No full refetch allowed.

---

# 5. Delete Task

Users must be able to delete tasks.

UI:

delete button in task modal

---

## Mutation

deleteTask

---

## Optimistic Behavior

Remove task from Apollo cache immediately.

Rollback if mutation fails.

---

# 6. Move Task Between Columns

Tasks must support drag & drop between columns.

Movement must update:

columnId

position

statusId

---

## Drag Source

TaskCard

---

## Drop Target

Column

---

## Mutation

moveTask

---

## Optimistic Movement

When a task is dragged:

1. remove task from source column
2. insert task into destination column
3. update position locally
4. send mutation

---

## Cache Updates

Update:

tasksByColumn(sourceColumnId)

tasksByColumn(destinationColumnId)

---

# 7. Update Task Labels

Tasks must support label assignment.

Labels come from:

boardLabels(boardId)

---

## Mutation

updateTaskLabels

---

## Optimistic Update

Update labelIds immediately in Apollo cache.

---

# 8. Status Override

Tasks normally inherit status from column.

However users can override task status manually.

---

## Mutation

updateTaskStatus

clearTaskStatusOverride

---

## Behavior

If override exists:

display override status

otherwise:

use column status

---

# Files & Folders to Create

---

# Entities

src/entities/task/

api/
useTasksByColumn.ts
useTask.ts

model/
task.types.ts
task.mapper.ts

ui/
TaskCard.tsx

index.ts

---

# Features

src/features/create-task/

model/
useCreateTask.ts

ui/
CreateTaskModal.tsx

---

src/features/update-task/

model/
useUpdateTask.ts

ui/
EditTaskModal.tsx

---

src/features/delete-task/

model/
useDeleteTask.ts

---

src/features/move-task/

model/
useMoveTask.ts

---

src/features/update-task-labels/

model/
useUpdateTaskLabels.ts

---

src/features/update-task-status/

model/
useUpdateTaskStatus.ts

---

# Widgets

src/widgets/board-view/

ui/
TasksList.tsx

TasksList renders tasks inside columns.

---

# GraphQL Files

src/graphql/queries/task.graphql

src/graphql/queries/tasksByColumn.graphql

src/graphql/queries/tasksByBoard.graphql

src/graphql/mutations/createTask.graphql

src/graphql/mutations/updateTask.graphql

src/graphql/mutations/deleteTask.graphql

src/graphql/mutations/moveTask.graphql

src/graphql/mutations/updateTaskLabels.graphql

src/graphql/mutations/updateTaskStatus.graphql

src/graphql/mutations/clearTaskStatusOverride.graphql

All files must be used by GraphQL Codegen.

---

# Error Handling

All mutation errors must be handled by the global error system implemented in **EPIC-03.5**.

Behavior:

show error toast

rollback optimistic updates

---

# Success Feedback

Optional success messages:

Task created

Task updated

Task deleted

---

# Acceptance Criteria

Tasks load correctly inside columns.

Users can create tasks inside columns.

New tasks appear instantly (optimistic UI).

Users can edit task details.

Users can delete tasks.

Users can drag tasks between columns.

Column task lists update immediately.

Optimistic updates rollback correctly on failure.

Apollo cache updates without full refetch.
