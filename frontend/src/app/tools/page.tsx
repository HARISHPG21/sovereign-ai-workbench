"use client";

import React, { useState, useEffect } from "react";
import { Wrench, Terminal, FileText, Code2, FileSpreadsheet, Presentation, ShieldCheck, CheckCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const data = await api.listTools();
      setTools(data);
    } catch (e) {}
  };

  const getToolIcon = (cat: string) => {
    switch (cat) {
      case "DOCUMENT":
        return FileText;
      case "EXECUTION":
        return Code2;
      case "GENERATOR":
        return FileSpreadsheet;
      default:
        return Wrench;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Wrench className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          Air-Gapped Tool Registry & Sandboxes
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Deterministic local tools called autonomously by agents without host filesystem violation or external network access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((t, idx) => {
          const Icon = getToolIcon(t.category);
          return (
            <div
              key={idx}
              className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-3 transition-colors group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h3>
                    <span className="rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 px-1.5 py-0.2 text-[9px] font-mono font-semibold">
                      CATEGORY: {t.category}
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-300 dark:border-teal-500/30">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Sandboxed
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{t.description}</p>

              <div className="rounded-lg bg-slate-50 dark:bg-[#070D18] p-3 text-[11px] font-mono space-y-1 border border-slate-100 dark:border-transparent">
                <div className="text-slate-500 font-semibold">Parameters Schema:</div>
                <pre className="text-teal-700 dark:text-teal-300 overflow-x-auto text-[10px]">{JSON.stringify(t.parameters, null, 2)}</pre>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
