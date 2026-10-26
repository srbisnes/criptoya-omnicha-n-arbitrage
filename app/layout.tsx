import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CryptoYa Omnichaín Arbitrage | Elcryptoboy",
  description: "Real-time LatAm crypto arbitrage scanner powered by CryptoYa API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">{children}</body>
    </html>
  );
}