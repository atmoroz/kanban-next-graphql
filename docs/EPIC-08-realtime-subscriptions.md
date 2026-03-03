# EPIC-08 — Realtime Subscriptions

## Goal

Sync data across clients using GraphQL subscriptions.

## Tasks

1. Subscribe to taskCreated
2. Subscribe to taskUpdated
3. Subscribe to taskMoved
4. Subscribe to columnMoved
5. Update Apollo cache

## Files & Folders

- src/graphql/subscriptions/
- src/features/subscriptions-sync/
- src/processes/realtime/

## Acceptance Criteria

- No duplicate tasks
- Realtime updates visible
- No race conditions
