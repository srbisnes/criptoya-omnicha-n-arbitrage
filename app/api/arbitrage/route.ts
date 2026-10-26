import { NextResponse } from "next/server";
import { getAggregatedQuotes, findArbitrageOpportunities } from "@/lib/criptoya";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coin = searchParams.get("coin") || "USDT";
  const fiat = searchParams.get("fiat") || "ARS";
  const volume = Number(searchParams.get("volume") || 100);

  try {
    const quotes = await getAggregatedQuotes(coin, fiat, volume);
    const opportunities = findArbitrageOpportunities(quotes, volume);
    return NextResponse.json({
      success: true,
      coin,
      fiat,
      volume,
      opportunities,
      timestamp: Date.now(),
      source: "CryptoYa",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}