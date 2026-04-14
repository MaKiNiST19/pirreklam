import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

// Temporary debug endpoint — REMOVE after fixing login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ step: "user_lookup", error: "User not found", email });
    }

    const hashPreview = user.passwordHash.substring(0, 20) + "...";

    let isValidSync = false;
    let syncError = null;
    try {
      isValidSync = bcrypt.compareSync(password, user.passwordHash);
    } catch (e) {
      syncError = String(e);
    }

    let isValidAsync = false;
    let asyncError = null;
    try {
      isValidAsync = await bcrypt.compare(password, user.passwordHash);
    } catch (e) {
      asyncError = String(e);
    }

    return NextResponse.json({
      step: "password_check",
      userFound: true,
      email: user.email,
      hashPreview,
      isValidSync,
      syncError,
      isValidAsync,
      asyncError,
      bcryptjs: "v3",
    });
  } catch (error) {
    return NextResponse.json({ step: "exception", error: String(error) });
  }
}
