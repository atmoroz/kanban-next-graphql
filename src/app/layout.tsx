import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { getCurrentUser } from "@/features/auth/server/get-current-user";
import { cookies } from "next/headers";
import { DEFAULT_THEME, THEME_COOKIE_NAME, type Theme } from "@/shared/config/theme";
import { TopLoader } from "@/shared/ui/top-loader";
import { AppProviders } from "./providers";

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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get(THEME_COOKIE_NAME)?.value;

  const theme: Theme =
    cookieTheme === "dark" || cookieTheme === "light" ? cookieTheme : DEFAULT_THEME;
  return (
    <html lang="en" data-theme={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-screen overflow-hidden`}
      >
        <AppProviders user={user}>
          <div className="flex h-screen flex-col">
            <TopLoader />
            <Header />
            <main className="flex flex-1 overflow-hidden">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
