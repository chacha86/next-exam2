import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import client from "./lib/backend/client";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const myCookies = await cookies();
  const accessToken = myCookies.get("accessToken");
  const apiKey = myCookies.get("apiKey");
  let isExpired = true;
  let payload = null;

  if (accessToken && apiKey) {
    try {
      const tokenParts = accessToken.value.split(".");
      payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());
      const expTimestamp = payload.exp * 1000; // exp는 초 단위이므로 밀리초로 변환
      isExpired = Date.now() > expTimestamp;
    } catch (e) {
      console.error("토큰 파싱 중 오류 발생:", e);
    }
  }
  console.log("payload", payload);
  let isLogin = payload !== null;
  console.log("isLogin", isLogin);
  if (isLogin && isExpired) {
    const response = await refreshAccessToken(myCookies);
    return response;
  }

  if (!isLogin && isProtectedRoute(request.nextUrl.pathname)) {
    return createUnauthorizedResponse();
  }
}

export const config = {
  matcher: "/((?!.*\\.|api\\/).*)",
};

async function refreshAccessToken(cookies: ReadonlyRequestCookies) {
  const nextResponse = NextResponse.next();

  const response = await client.GET("/api/v1/members/me", {
    headers: {
      cookie: cookies.toString(),
    },
  });

  if (!response.error) {
    const setCookie2 = response.response.headers.getSetCookie();

    setCookie2.forEach((cookie) => {
      console.log("------------");
      console.log(cookie);
    });

    nextResponse.headers.set("Set-Cookie", String(setCookie2));

    return nextResponse;
  }
}

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/post/write") ||
    pathname.match(/^\/post\/\d+\/edit$/) !== null
  );
}

function createUnauthorizedResponse(): NextResponse {
  return new NextResponse("로그인이 필요합니다.", {
    status: 401,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
