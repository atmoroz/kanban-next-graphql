# Site Structure — Next.js Kanban (FSD)

src/
├── app/ # ТОЛЬКО routing (Next.js App Router)
│ ├── layout.tsx
│ ├── page.tsx # Public dashboard
│ ├── login/page.tsx
│ ├── register/page.tsx
│ ├── board/[boardId]/page.tsx
│ ├── api/ # если нужен route handler
│ ├── sitemap.ts
│ ├── robots.ts
│ └── favicon.ico
│
├── widgets/ # Крупные UI-блоки страниц
│ ├── header/
│ ├── sidebar/
│ ├── kanban-board/
│ ├── activity-feed/
│ └── auth-form/
│
├── features/ # Действия пользователя
│ ├── auth/
│ ├── create-board/
│ ├── create-task/
│ ├── move-task/
│ ├── update-task/
│ ├── filters/
│ └── subscriptions/
│
├── entities/ # Бизнес-сущности
│ ├── board/
│ ├── column/
│ ├── task/
│ ├── activity/
│ └── user/
│
├── shared/ # Инфраструктура
│ ├── ui/ # Button, Input, Modal
│ ├── lib/ # helpers, hooks
│ ├── api/ # Apollo client setup
│ ├── config/ # env.ts, constants
│ ├── types/
│ └── styles/
│
├── graphql/ # GraphQL слой
│ ├── queries/
│ ├── mutations/
│ ├── subscriptions/
│ ├── fragments/
│ └── generated/
│
├── stores/ # Zustand (если нужен)
│ ├── ui.store.ts
│ └── filters.store.ts
│
middleware.ts # В КОРНЕ
