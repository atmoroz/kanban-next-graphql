# Site Structure — Next.js Kanban (FSD)

src/
├── app/ # Next.js routing (NO business logic)
│ ├── layout.tsx
│ ├── page.tsx # Public dashboard
│ ├── login/
│ ├── register/
│ └── board/[boardId]/
│
├── processes/ # Long-running flows
│ ├── auth/
│ └── realtime/
│
├── widgets/ # Page-level UI blocks
│ ├── header/
│ ├── sidebar/
│ ├── kanban-board/
│ ├── column/
│ └── activity-feed/
│
├── features/ # User actions
│ ├── auth/
│ ├── create-board/
│ ├── create-task/
│ ├── move-task/
│ ├── update-task/
│ ├── filters/
│ └── subscriptions-sync/
│
├── entities/ # Business entities
│ ├── board/
│ ├── column/
│ ├── task/
│ ├── activity/
│ └── user/
│
├── shared/
│ ├── ui/ # Reusable UI components
│ ├── lib/ # Helpers, hooks
│ ├── api/ # Apollo client, links
│ ├── config/ # Env, constants
│ └── types/
│
├── graphql/
│ ├── queries/
│ ├── mutations/
│ ├── subscriptions/
│ ├── fragments/
│ └── generated/ # Codegen output
│
├── stores/ # Zustand stores
│ ├── ui.store.ts
│ └── filters.store.ts
│
└── middleware.ts # Auth / SSR cookies
