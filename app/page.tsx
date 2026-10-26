"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw, Zap } from "lucide-react";

interface Opportunity {
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spreadPct: number;
  netProfitPct: number;
  volume: number;
  estimatedProfit: number;
}

export default function Home() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [coin, setCoin] = useState("USDT");
  const [fiat, setFiat] = useState("ARS");
  const [volume, setVolume] = useState(100);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/arbitrage?coin=${coin}&fiat=${fiat}&volume=${volume}`
      );
      const data = await res.json();
      if (data.success) setOpps(data.opportunities);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60_000);
    return () => clearInterval(id);
  }, [coin, fiat, volume]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Zap className="text-emerald-400" />
            CryptoYa Omnichaín Arbitrage
          </h1>
          <p className="text-zinc-400 mt-1">
            Scanner en tiempo real • LatAm CEX/P2P • Powered by CryptoYa
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition"
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
          Refresh
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="text-sm text-zinc-400">Coin</label>
          <select
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2"
          >
            <option>USDT</option>
            <option>USDC</option>
            <option>BTC</option>
            <option>ETH</option>
            <option>DAI</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-zinc-400">Fiat</label>
          <select
            value={fiat}
            onChange={(e) => setFiat(e.target.value)}
            className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2"
          >
            <option>ARS</option>
            <option>USD</option>
            <option>BRL</option>
            <option>MXN</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-zinc-400">Volumen</label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="text-left p-4">Comprar en</th>
              <th className="text-left p-4">Vender en</th>
              <th className="text-right p-4">Buy</th>
              <th className="text-right p-4">Sell</th>
              <th className="text-right p-4">Spread %</th>
              <th className="text-right p-4">Net %</th>
              <th className="text-right p-4">Profit est.</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500">
                  Escaneando oportunidades...
                </td>
              </tr>
            )}
            {!loading && opps.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500">
                  No hay oportunidades con spread > 0.3% en este momento
                </td>
              </tr>
            )}
            {opps.map((o, i) => (
              <tr key={i} className="border-t border-zinc-800 hover:bg-zinc-800/40">
                <td className="p-4 font-medium">{o.buyExchange}</td>
                <td className="p-4 font-medium flex items-center gap-1">
                  {o.sellExchange}
                  <ArrowUpRight size={14} className="text-emerald-400" />
                </td>
                <td className="p-4 text-right">{o.buyPrice.toFixed(2)}</td>
                <td className="p-4 text-right">{o.sellPrice.toFixed(2)}</td>
                <td className="p-4 text-right text-amber-400">{o.spreadPct}%</td>
                <td className="p-4 text-right text-emerald-400 font-semibold">
                  {o.netProfitPct}%
                </td>
                <td className="p-4 text-right text-emerald-300">
                  ${o.estimatedProfit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-12 text-center text-zinc-500 text-sm">
        Datos en tiempo real de{" "}
        <a href="https://criptoya.com" className="text-emerald-400 hover:underline">
          CryptoYa
        </a>{" "}
        • Arquitectura omnichaín by Elcryptoboy • Listo para LayerZero / CCTP settlement
      </footer>
    </main>
  );
}