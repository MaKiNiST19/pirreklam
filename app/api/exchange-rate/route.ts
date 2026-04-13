import { NextResponse } from "next/server";
import { getUsdTryRate } from "@/lib/exchange-rate";

export async function GET() {
  try {
    const rate = await getUsdTryRate();
    return NextResponse.json({ rate });
  } catch (error) {
    console.error("GET /api/exchange-rate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
