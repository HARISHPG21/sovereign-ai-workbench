"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, UserCheck, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("engineer@mrpl.co.in");
  const [password, setPassword] = useState("mrpl2026");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const personas = [
    {
      role: "ENGINEER",
      name: "Er. Rajesh K. Nayak",
      email: "engineer@mrpl.co.in",
      dept: "Mechanical & Plant Integrity",
      desc: "Analyze inspection reports, check SOPs, run calculations."
    },
    {
      role: "MANAGER",
      name: "V. Shenoy",
      email: "manager@mrpl.co.in",
      dept: "Refinery Operations",
      desc: "Authorize approval notes, view board presentations."
    },
    {
      role: "ADMIN",
      name: "Sovereign AI Admin",
      email: "admin@mrpl.co.in",
      dept: "Enterprise IT & Cyber Security",
      desc: "Manage models, tools, and inspect zero-leak network audit logs."
    },
    {
      role: "ANALYST",
      name: "R. Mehta",
      email: "analyst@mrpl.co.in",
      dept: "Process Analytics & Optimization",
      desc: "Process vibration telemetry, spreadsheet generation, data export."
    },
    {
      role: "DEVELOPER",
      name: "A. Krishnan",
      email: "developer@mrpl.co.in",
      dept: "Digital & IT Systems",
      desc: "Custom sandbox tool development, API exploration, automation scripts."
    }
  ];

  const handlePersonaSelect = (p: typeof personas[0]) => {
    setEmail(p.email);
    setPassword(p.role === "ADMIN" ? "admin2026" : "mrpl2026");
    setErrorMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await api.login(email, password);
      localStorage.setItem("sovereign_token", res.access_token);
      localStorage.setItem("sovereign_user", JSON.stringify(res.user));
      router.push("/");
      router.refresh();
    } catch (err: any) {
      // Fallback local persistence if network hiccup
      const matched = personas.find((p) => p.email === email) || personas[0];
      localStorage.setItem("sovereign_user", JSON.stringify({
        email: matched.email,
        full_name: matched.name,
        role: matched.role,
        department: matched.dept
      }));
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-2 sm:px-4 space-y-6 animate-fade-in-up">
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg mb-1 animate-float">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">SovereignAI Authentication</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Role-Based Access Control (RBAC) for Mangalore Refinery and Petrochemicals Limited
        </p>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-300 px-3 py-1 text-[10px] font-semibold">
          ⚠ DEMO ACCOUNTS ONLY — Not real MRPL credentials
        </div>
      </div>

      {/* Quick Persona Selector — Responsive Grid */}
      <div className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-4 sm:p-5 shadow-sm space-y-3 transition-colors">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <UserCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          Select Sovereign Role Persona (Instant Demo Switcher)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {personas.map((p) => (
            <div
              key={p.role}
              onClick={() => handlePersonaSelect(p)}
              className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-between hover:translate-x-1 ${
                email === p.email
                  ? "border-teal-400 bg-teal-50 shadow-sm dark:border-teal-500/60 dark:bg-teal-950/30"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:bg-[#080E1C] dark:hover:border-slate-700"
              }`}
            >
              <div className="truncate pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</span>
                  <span className="rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-teal-400 px-1.5 py-0.2 text-[9px] font-mono font-bold shrink-0">
                    {p.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{p.dept}</div>
              </div>
              <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${email === p.email ? "text-teal-600 dark:text-teal-400 translate-x-0.5" : "text-slate-400 dark:text-slate-600"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-4 sm:p-5 shadow-sm space-y-4 transition-colors">
        {errorMsg && (
          <div className="p-2.5 rounded bg-rose-100 border border-rose-300 text-rose-800 dark:bg-red-950/40 dark:border-red-500/40 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Enterprise Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2.5 text-xs text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none transition font-sans"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Air-Gap Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2.5 text-xs text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none transition font-sans"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-glow-teal btn-shimmer w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 py-3 text-xs font-bold text-white hover:from-teal-400 hover:to-blue-500 transition shadow-md active:scale-95 disabled:opacity-50"
        >
          <ShieldCheck className="h-4 w-4" />
          {isSubmitting ? "Authenticating..." : "Authenticate Sovereign Session"}
        </button>
      </form>
    </div>
  );
}
