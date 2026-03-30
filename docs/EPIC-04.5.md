# EPIC-04.5 — Boards CRUD

## Goal

Implement full CRUD functionality for Boards.

Users must be able to:

- create boards
- update board metadata
- delete boards
- view board details

Board operations must use **Apollo Client**, **GraphQL mutations**, and **Optimistic UI** where appropriate.

Board list must stay consistent with Apollo cache and update automatically after mutations.

---

## GraphQL Operations Used

From API contract:

### Queries

- `boards(...)`
- `board(id)`

### Mutations

- `createBoard`
- `updateBoard`
- `deleteBoard`

---

## Tasks

### 1. Fetch Boards List

Use `boards` query with cursor pagination.

Responsibilities:

- fetch boards
- display in sidebar
- highlight active board

---

### 2. Create Board

Implement board creation flow.

Requirements:

- create board modal
- form fields:
  - title
  - description
  - visibility (PUBLIC / PRIVATE)

Mutation used:
//createBoard
UI behavior:

- board appears immediately in sidebar (optimistic update)
- created board becomes the active board
- boardId is written to URL
- board content loads in the main board area

---

### 3. Update Board

Requirements:

- edit board modal
- Apollo cache update

---

### 4. Delete Board

equirements:

- confirmation modal
- remove board from sidebar immediately
- redirect to dashboard

---

### 5. Apollo Cache Handling

After mutations:

- update boards list
- remove deleted boards
- update board metadata

Avoid full refetch where possible.

---

## Files & Folders to Create

### Entities
