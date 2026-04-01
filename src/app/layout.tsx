import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { getCurrentUser } from "@/features/auth/server/get-current-user";
import { cookies } from "next/headers";
import { THEME_COOKIE_NAME, type Theme } from "@/shared/config/theme";
import { env } from "@/shared/config/env";
import { TopLoader } from "@/shared/ui/top-loader";
import { AppProviders } from "./providers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kanban Next GraphQL",
  description: "Kanban board with Next.js, GraphQL and Apollo",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(THEME_COOKIE_NAME)?.value;

  const theme: Theme | undefined =
    cookieTheme === "dark" || cookieTheme === "light" ? cookieTheme : undefined;

  const themeInitScript = `
    (() => {
      try {
        const key = "${THEME_COOKIE_NAME}";
        const stored = window.localStorage.getItem(key);
        const isStoredValid = stored === "light" || stored === "dark";
        const isCookieValid = document.documentElement.dataset.theme === "light" || document.documentElement.dataset.theme === "dark";
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const nextTheme = isStoredValid ? stored : isCookieValid ? document.documentElement.dataset.theme : systemTheme;

        if (!nextTheme) return;

        document.documentElement.dataset.theme = nextTheme;
        if (!isStoredValid) window.localStorage.setItem(key, nextTheme);
        if (!isCookieValid) {
          document.cookie = key + "=" + nextTheme + "; path=/; max-age=31536000; samesite=lax";
        }
      } catch {}
    })();
  `;
  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-screen overflow-hidden`}
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <AppProviders user={user}>
          <div className="flex h-screen flex-col">
            <TopLoader />
            <Header />
            <main className="flex flex-1 overflow-hidden">{children}</main>
            <Footer />
          </div>
        </AppProviders>
        {env.public.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? (
          <Script
            id="umami-analytics"
            strategy="afterInteractive"
            src="https://cloud.umami.is/script.js"
            data-website-id={env.public.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          ></Script>
        ) : null}
      </body>
    </html>
  );
}
