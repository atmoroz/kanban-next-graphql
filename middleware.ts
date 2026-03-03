import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  // Заглушка для EPIC-02: здесь позже будет проверка JWT в httpOnly cookie
  // и редиректы в зависимости от того, авторизован пользователь или нет.
  return NextResponse.next();
}

export const config = {
  matcher: ["/board/:path*"],
};

