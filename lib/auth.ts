import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret"
);

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function auth(): Promise<{ user: AuthUser } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    if (!payload.email || !payload.role) return null;

    return {
      user: {
        id: payload.id as string || payload.sub as string,
        email: payload.email as string,
        name: payload.name as string || "",
        role: payload.role as string,
      },
    };
  } catch {
    return null;
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
