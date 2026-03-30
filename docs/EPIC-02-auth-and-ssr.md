# EPIC-02 — Authentication & SSR

## Goal

Implement secure authentication with SSR using httpOnly cookies.

## Tasks

1. Setup JWT auth via cookies
2. Implement register/login pages
3. Implement `me` SSR query
4. Auth-aware header and routes
5. Public dashboard access

## Files & Folders

- src/app/login/page.tsx
- src/app/register/page.tsx
- src/processes/auth/
- src/features/auth/
- src/middleware.ts

## Acceptance Criteria

- Auth persists on refresh
- SSR correctly detects user
- Unauthorized users see public boards
