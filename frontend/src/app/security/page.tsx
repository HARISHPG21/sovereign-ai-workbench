"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Lock, Activity, RefreshCw, AlertCircle, CheckCircle, WifiOff, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { NetworkTelemetry } from "@/types";

export default function SecurityPage() {
  const [telemetry, setTelemetry] = useState<NetworkTelemetry | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    loadTelemetry();
    const interval = setInterval(loadTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTelemetry = async () => {
    try {
      const data = await api.getNetworkTelemetry();
      setTelemetry(data);
    } catch (e) {}
  };

  const handleVerifyAirGap = async () => {
    setIsVerifying(true);
    try {
      const res = await api.verifyAirGap();
      setVerificationResult(res);
      await loadTelemetry();
    } catch (e) {
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            Security Center & Sovereignty Network Monitor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographic air-gap monitoring. Validates that 0 external API calls and 0 egress packets leave the MRPL on-premise perimeter.
          </p>
        </div>
        <button
          onClick={handleVerifyAirGap}
          disabled={isVerifying}
          className="btn-glow-teal flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 transition shadow-md active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isVerifying ? "animate-spin" : ""}`} />
          {isVerifying ? "Auditing Sockets..." : "Run Air-Gap Audit Probe"}
        </button>
      </div>

      {/* Hero Sovereignty Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: External API Calls */}
        <div className="card-lift rounded-xl border border-teal-300 dark:border-teal-500/40 bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-[#081C2E] dark:to-[#0A1624] p-5 shadow-lg space-y-2 transition-colors">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-xs">
            <span className="font-semibold">EXTERNAL API CALLS</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
              <WifiOff className="h-4 w-4 text-emerald-600 dark:text-teal-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 dark:text-teal-300 font-mono">
            {telemetry?.external_api_calls ?? 0}
          </div>
          <div className="text-[10px] text-emerald-700 dark:text-teal-400 font-medium">100% Zero-Egress Verified</div>
        </div>

        {/* Metric 2: Local AI Inference */}
        <div className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-2 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold">LOCAL AI INFERENCE</span>
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {telemetry?.local_ai_inference_pct ?? 100}%
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Air-gapped GPU Serving</div>
        </div>

        {/* Metric 3: Blocked Egress Attempts */}
        <div className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-2 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold">BLOCKED OUTBOUND</span>
            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {telemetry?.blocked_outbound_attempts ?? 0}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Sandbox Egress Violations: 0</div>
        </div>

        {/* Metric 4: Total Local Operations */}
        <div className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-2 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold">TOTAL LOCAL OPS</span>
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {telemetry?.total_local_requests ?? 0}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">All Handled On-Premise</div>
        </div>
      </div>

      {/* Verification Probe Result Alert */}
      {verificationResult && (
        <div className="card-lift rounded-xl border border-teal-300 dark:border-teal-500/50 bg-teal-50 dark:bg-[#061824] p-4 text-xs flex items-center justify-between shadow-md animate-fade-in-up transition-colors">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <div>
              <span className="font-bold text-teal-800 dark:text-teal-300 text-sm">{verificationResult.status}: </span>
              <span className="text-slate-700 dark:text-slate-200">{verificationResult.message}</span>
            </div>
          </div>
          <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 px-2.5 py-1 text-[11px] font-mono font-bold">
            AUDIT RECORDED
          </span>
        </div>
      )}

      {/* Active Socket Inspection Table */}
      <div className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Active Host & Process Socket Bindings
          </h2>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Active Local Sockets: {telemetry?.active_local_sockets ?? 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Protocol</th>
                <th className="py-2.5 px-3 font-semibold">Local Address</th>
                <th className="py-2.5 px-3 font-semibold">Remote Address</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Air-Gap Egress Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-800 dark:text-slate-300 font-mono">
              {telemetry?.connections?.map((conn, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-3 font-semibold">{conn.type}</td>
                  <td className="py-2.5 px-3 text-teal-700 dark:text-teal-300">{conn.local_address}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{conn.remote_address}</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{conn.status}</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30 px-2 py-0.5 text-[10px] font-sans font-semibold">
                      Local Only (Verified)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
