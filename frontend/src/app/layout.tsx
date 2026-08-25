import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "SovereignAI Workbench — SIH 2026 (PS 26117 | MRPL)",
  description: "Smart India Hackathon 2026: Sovereign on-premise agentic AI workbench using open-weight multimodal LLMs for confidential industrial work (Mangalore Refinery & Petrochemicals Ltd).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#070D18",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('sovereign_theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#070D18] text-slate-100 flex flex-col antialiased selection:bg-teal-500 selection:text-white transition-colors">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6">{children}</main>
        <footer className="border-t border-slate-800/80 bg-[#050A14] py-5 text-center text-xs text-slate-500 transition-colors">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-left">
            <div>
              <div className="text-white font-semibold text-[11px] sm:text-xs flex items-center gap-2">
                <span>Smart India Hackathon 2026 (Software Edition)</span>
                <span className="rounded bg-teal-500/20 text-teal-300 font-mono text-[9px] px-1.5 py-0.5 border border-teal-500/30">
                  PS ID: 26117
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                Mangalore Refinery and Petrochemicals Limited (MRPL) • Ministry of Petroleum & Natural Gas (MoPNG)
              </p>
            </div>
            <div className="text-right flex flex-col items-start md:items-end">
              <span className="text-emerald-400 font-mono text-[10px] sm:text-xs font-bold">
                100% Air-Gapped On-Premise GPU Execution • 0 External Egress
              </span>
              <span className="text-slate-500 text-[10px] mt-0.5">
                Compliant with CERT-In Air-Gap Guidelines & DPDP Act 2023
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
