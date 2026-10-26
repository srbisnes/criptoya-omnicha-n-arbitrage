export const BASE_URL = "https://criptoya.com/api";

export interface Quote {
  ask: number;
  totalAsk: number;
  bid: number;
  totalBid: number;
  time: number;
}

export interface AggregatedQuotes {
  [exchange: string]: Quote;
}

export async function getAggregatedQuotes(
  coin: string = "USDT",
  fiat: string = "ARS",
  volume: number = 100
): Promise<AggregatedQuotes> {
  const url = `${BASE_URL}/${coin}/${fiat}/${volume}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`CryptoYa error: ${res.status}`);
  return res.json();
}

export interface Opportunity {
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spreadPct: number;
  netProfitPct: number;
  volume: number;
  estimatedProfit: number;
}

export function findArbitrageOpportunities(
  quotes: AggregatedQuotes,
  volume: number = 100,
  minSpread: number = 0.3
): Opportunity[] {
  const exchanges = Object.entries(quotes).filter(
    ([, q]) => q.totalAsk > 0 && q.totalBid > 0
  );

  const opps: Opportunity[] = [];

  for (const [buyEx, buyQ] of exchanges) {
    for (const [sellEx, sellQ] of exchanges) {
      if (buyEx === sellEx) continue;
      const buyPrice = buyQ.totalAsk;
      const sellPrice = sellQ.totalBid;
      if (sellPrice <= buyPrice) continue;

      const spreadPct = ((sellPrice - buyPrice) / buyPrice) * 100;
      // Rough fee buffer 0.4% each side + transfer
      const netProfitPct = spreadPct - 0.8;
      if (netProfitPct < minSpread) continue;

      const estimatedProfit = (volume * netProfitPct) / 100;

      opps.push({
        buyExchange: buyEx,
        sellExchange: sellEx,
        buyPrice,
        sellPrice,
        spreadPct: Number(spreadPct.toFixed(2)),
        netProfitPct: Number(netProfitPct.toFixed(2)),
        volume,
        estimatedProfit: Number(estimatedProfit.toFixed(2)),
      });
    }
  }

  return opps.sort((a, b) => b.netProfitPct - a.netProfitPct).slice(0, 20);
}