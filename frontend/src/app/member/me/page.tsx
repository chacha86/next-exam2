import client from "@/lib/backend/client";
import ClientPage from "./ClientPage";
import { cookies } from "next/headers";

function parseAccessToken(accessToken: string | undefined) {
  let isExpired = true;
  let payload = null;

  if (accessToken) {
    try {
      const tokenParts = accessToken.split(".");
      payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());
      const expTimestamp = payload.exp * 1000; // exp는 초 단위이므로 밀리초로 변환
      isExpired = Date.now() > expTimestamp;
    } catch (e) {
      console.error("토큰 파싱 중 오류 발생:", e);
    }
  }

  let isLogin = payload !== null;

  return { isLogin, isExpired, payload };
}

export default async function Page() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { isLogin, payload } = parseAccessToken(accessToken);

  const me = isLogin
    ? {
        id: payload.id,
        nickname: payload.nickname,
      }
    : {
        id: 0,
        nickname: "",
      };

  return <ClientPage me={me} />;
}
