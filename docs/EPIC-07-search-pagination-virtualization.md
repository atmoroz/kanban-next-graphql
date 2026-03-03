# EPIC-07 — Search, Pagination & Virtualization

## Goal

Ensure performance with large datasets.

## Tasks

1. Implement search & filters
2. Cursor pagination
3. Virtualize task lists
4. Virtualize activity feed

## Files & Folders

- src/features/filters/
- src/stores/filters.store.ts
- src/shared/lib/virtualization/

## Acceptance Criteria

- 1000+ tasks without lag
- Search does not reset state
- Smooth scrolling
