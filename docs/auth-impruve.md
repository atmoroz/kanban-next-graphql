Архитектура
src
├ app
│ ├ layout.tsx
│ └ providers.tsx
│
├ shared
│ ├ providers
│ │ └ auth-provider.tsx
│ │
│ ├ lib
│ │ └ auth
│ │ └ get-current-user.ts
│ │
│ └ hooks
│ └ use-user.ts

1.  Получаем user на сервере

shared/lib/auth/get-current-user.ts
import { cookies } from "next/headers";

export async function getCurrentUser() {
const cookieStore = await cookies();
const token = cookieStore.get("session")?.value;

if (!token) return null;

// например GraphQL запрос
const res = await fetch(process.env.API_URL!, {
method: "POST",
});

return res.json();
}

2. Auth Provider (client)

shared/providers/auth-provider.tsx
"use client";

import { createContext, useContext } from "react";

type User = {
id: string;
email: string;
} | null;

const AuthContext = createContext<User>(null);

export function AuthProvider({
user,
children,
}: {
user: User;
children: React.ReactNode;
}) {
return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useUser() {
return useContext(AuthContext);
}
Теперь любой компонент может получить пользователя.

3. Apollo Providers

app/providers.tsx

"use client";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/shared/api/apollo-client";

export function Providers({ children }: { children: React.ReactNode }) {
return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

4. Layout (главная магия)

app/layout.tsx

import { getCurrentUser } from "@/shared/lib/auth/get-current-user";
import { AuthProvider } from "@/shared/providers/auth-provider";
import { Providers } from "./providers";

export default async function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
const user = await getCurrentUser();

return (
<html lang="en">
<body>
<Providers>
<AuthProvider user={user}>
{children}
</AuthProvider>
</Providers>
</body>
</html>
);
}

Теперь:

user SSR

user доступен везде

нет лишних запросов

5. Использование

В любом client component:

"use client";

import { useUser } from "@/shared/providers/auth-provider";

export function Profile() {
const user = useUser();

if (!user) return <div>Not logged</div>;

return <div>{user.email}</div>;
}

6. Бонус — синхронизация с Apollo cache

Очень мощная фишка.

Если у тебя есть query:

query Me {
me {
id
email
}
}

можно сразу положить user в Apollo cache, чтобы useQuery(Me) не делал запрос.
client.cache.writeQuery({
query: MeDocument,
data: {
me: user,
},
});

Тогда:
useQuery(MeDocument)

Почему это лучший паттерн

✔ SSR user
✔ нет loading state
✔ нет двойных запросов
✔ работает с Apollo
✔ работает с subscriptions
✔ идеально для Next.js App Router
