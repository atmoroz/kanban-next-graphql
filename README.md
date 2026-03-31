# Kanban Next GraphQL

**Language / Мова:** [Українська](#readme-ua) | [English](#readme-en)

<a id="readme-ua"></a>
## Українська

### Опис
Kanban-дошка на `Next.js` + `GraphQL` з архітектурою `Feature-Sliced Design (FSD)`, SSR-автентифікацією через `httpOnly` cookie та realtime-оновленнями через WebSocket subscriptions.

### Технології
- `Next.js 16` (App Router), `React 19`, `TypeScript`
- `Apollo Client 4`, `GraphQL`, `graphql-ws`
- `Tailwind CSS 4`
- `Zustand`
- `GraphQL Code Generator`

### Як скопіювати і запустити
1. Клонувати репозиторій:
   ```bash
   git clone git@github.com:atmoroz/kanban-next-graphql.git
   cd kanban-next-graphql
   ```
2. Встановити залежності:
   ```bash
   npm install
   ```
3. Створити локальний env:
   ```bash
   cp .env.example .env.local
   ```
   Якщо `.env.example` відсутній, створіть `.env.local` вручну.
4. Заповнити мінімальні змінні:
   ```env
   NEXT_PUBLIC_API_URL=https://kanban-graphql-api.onrender.com/graphql
   GRAPHQL_API_URL=https://kanban-graphql-api.onrender.com/graphql
   ```
5. Запустити застосунок:
   ```bash
   npm run dev
   ```
6. Відкрити: [http://localhost:3000](http://localhost:3000)

### Корисні команди
```bash
npm run dev            # локальна розробка
npm run build          # production build
npm run start          # запуск production build
npm run lint           # ESLint
npm run format         # перевірка Prettier
npm run format:fix     # автоформатування
npm run codegen        # згенерувати GraphQL типи
npm run codegen:watch  # codegen у watch-режимі
```

### Структура проєкту (FSD)
```text
src/
├── app/         # маршрути Next.js, layout, route handlers
├── widgets/     # великі блоки сторінок
├── features/    # дії користувача (create/update/move/filter...)
├── entities/    # доменні сутності (board, column, task...)
├── shared/      # спільні ui/lib/api/config
├── graphql/     # queries/mutations/subscriptions/fragments/generated
└── stores/      # Zustand-стан
```

### Як працювати з WebSocket
У проєкті subscriptions вже інтегровані через Apollo:

1. `apolloLinks` розділяє трафік:
   - `query/mutation` -> HTTP (`/api/graphql`)
   - `subscription` -> WebSocket (`graphql-ws`)
2. Токен для WS береться з `httpOnly` cookie через `GET /api/ws-token`.
3. Клієнт відкриває WS-з’єднання до `NEXT_PUBLIC_API_URL` (протокол автоматично змінюється на `ws/wss`).
4. Синхронізація борду виконується у `useBoardSubscriptionsSync`:
   - `TaskCreated`
   - `TaskUpdated`
   - `TaskDeleted`
5. Обробники оновлюють Apollo cache (`tasksByBoard`), тому UI оновлюється без ручного рефрешу.

Що перевірити, якщо realtime не працює:
- `NEXT_PUBLIC_API_URL` вказує на GraphQL endpoint
- бекенд підтримує GraphQL subscriptions по WebSocket
- авторизаційний cookie присутній у браузері

### GraphQL посилання
- API endpoint: [https://kanban-graphql-api.onrender.com/graphql](https://kanban-graphql-api.onrender.com/graphql)
- API query URL: [https://kanban-graphql-api.onrender.com/graphql?query](https://kanban-graphql-api.onrender.com/graphql?query)
- Документація: [https://kanban-graphql-document-platform-xh.vercel.app/api](https://kanban-graphql-document-platform-xh.vercel.app/api)

---

<a id="readme-en"></a>
## English

### Overview
A Kanban board built with `Next.js` + `GraphQL`, following `Feature-Sliced Design (FSD)`, SSR auth via `httpOnly` cookies, and realtime updates via WebSocket subscriptions.

### Tech Stack
- `Next.js 16` (App Router), `React 19`, `TypeScript`
- `Apollo Client 4`, `GraphQL`, `graphql-ws`
- `Tailwind CSS 4`
- `Zustand`
- `GraphQL Code Generator`

### Clone and Run
1. Clone the repository:
   ```bash
   git clone git@github.com:atmoroz/kanban-next-graphql.git
   cd kanban-next-graphql
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create local env:
   ```bash
   cp .env.example .env.local
   ```
   If `.env.example` is missing, create `.env.local` manually.
4. Add minimum required variables:
   ```env
   NEXT_PUBLIC_API_URL=https://kanban-graphql-api.onrender.com/graphql
   GRAPHQL_API_URL=https://kanban-graphql-api.onrender.com/graphql
   ```
5. Start the app:
   ```bash
   npm run dev
   ```
6. Open: [http://localhost:3000](http://localhost:3000)

### Useful Scripts
```bash
npm run dev            # local development
npm run build          # production build
npm run start          # run production build
npm run lint           # ESLint
npm run format         # Prettier check
npm run format:fix     # auto-format
npm run codegen        # generate GraphQL types
npm run codegen:watch  # watch mode for codegen
```

### Project Structure (FSD)
```text
src/
├── app/         # Next.js routing, layout, route handlers
├── widgets/     # large page-level UI blocks
├── features/    # user actions (create/update/move/filter...)
├── entities/    # domain entities (board, column, task...)
├── shared/      # reusable ui/lib/api/config
├── graphql/     # queries/mutations/subscriptions/fragments/generated
└── stores/      # Zustand state
```

### Working with WebSocket
Subscriptions are already wired through Apollo:

1. `apolloLinks` splits operations:
   - `query/mutation` -> HTTP (`/api/graphql`)
   - `subscription` -> WebSocket (`graphql-ws`)
2. WS auth token is read from `httpOnly` cookie via `GET /api/ws-token`.
3. The client builds WS URL from `NEXT_PUBLIC_API_URL` and auto-switches protocol to `ws/wss`.
4. Board realtime sync is handled in `useBoardSubscriptionsSync` for:
   - `TaskCreated`
   - `TaskUpdated`
   - `TaskDeleted`
5. Handlers update Apollo cache (`tasksByBoard`), so UI stays in sync without manual refresh.

If realtime is not working, verify:
- `NEXT_PUBLIC_API_URL` points to the GraphQL endpoint
- backend supports GraphQL subscriptions over WebSocket
- auth cookie is present in the browser

### GraphQL Links
- API endpoint: [https://kanban-graphql-api.onrender.com/graphql](https://kanban-graphql-api.onrender.com/graphql)
- API query URL: [https://kanban-graphql-api.onrender.com/graphql?query](https://kanban-graphql-api.onrender.com/graphql?query)
- Documentation: [https://kanban-graphql-document-platform-xh.vercel.app/api](https://kanban-graphql-document-platform-xh.vercel.app/api)
