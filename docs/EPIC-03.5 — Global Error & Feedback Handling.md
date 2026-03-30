# EPIC-03.5 — Global Error & Feedback Handling

## Goal
Implement a global, consistent mechanism to handle GraphQL and network errors and display user feedback via toast notifications for both success and failure cases.

## Scope
This epic introduces a centralized error and feedback system used by all queries, mutations, and subscriptions.

## Responsibilities
- Capture GraphQL errors
- Capture network errors
- Handle optimistic update rollbacks
- Show success and error toasts
- Prevent duplicated notifications

---

## Architecture Decisions

- Apollo Client is the single source for request lifecycle
- Toasts are triggered centrally, not per feature
- Zustand is used for toast state management
- UI feedback must be declarative and reusable

---

## Tasks

### 1. Toast Infrastructure
- Implement toast queue using Zustand
- Support types: `success | error | info | warning`
- Auto-dismiss with timeout
- Deduplicate identical messages

### 2. Toast UI
- Create reusable Toast component
- Position globally (top-right)
- Animate enter/exit
- Accessible (ARIA)

### 3. Apollo Error Handling
- Setup Apollo `errorLink`
- Catch:
  - GraphQL errors
  - Network errors
- Map errors to user-friendly messages
- Trigger error toasts

### 4. Success Feedback
- Add optional `meta.successMessage` for mutations
- Trigger success toast on mutation completion
- Ensure no double-toast on optimistic updates

### 5. Subscription Error Handling
- Handle WebSocket disconnects
- Show connection lost / reconnected toasts

---

## Files & Folders to Create

- src/shared/ui/toast/
- src/shared/lib/toast/
- src/shared/lib/apollo/errorLink.ts
- src/stores/toast.store.ts
- src/shared/api/apolloClient.ts (update)

---

## Usage Rules

- Features MUST NOT call toast directly
- Toasts are triggered via:
  - Apollo middleware
  - Explicit success metadata
- No UI logic inside entities

---

## Acceptance Criteria

- Any GraphQL error shows a toast
- Network errors show a generic fallback toast
- Successful mutations can show success toast
- No duplicated toasts
- Subscriptions reconnect feedback works