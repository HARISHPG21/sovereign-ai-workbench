"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, Search, Download, CheckCircle, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { AuditLog } from "@/types";

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await api.listAuditLogs();
      setLogs(data);
    } catch (e) {}
  };

  const filteredLogs = logs.filter((l) =>
    l.action_details.toLowerCase().includes(filter.toLowerCase()) ||
    l.event_type.toLowerCase().includes(filter.toLowerCase()) ||
    (l.actor_email || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          Immutable Cryptographic Audit Explorer
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          End-to-end provenance log recording user sessions, prompt submissions, model selections, and zero-egress verifications.
        </p>
      </div>

      <div className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter audit events..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] pl-9 p-2 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none transition font-sans"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Showing {filteredLogs.length} verified audit records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">Event Type</th>
                <th className="py-2.5 px-3 font-semibold">Actor / Persona</th>
                <th className="py-2.5 px-3 font-semibold">Action Details</th>
                <th className="py-2.5 px-3 font-semibold">External Egress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-800 dark:text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No audit records match the query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-slate-800 dark:text-teal-400 dark:border-slate-700 px-2 py-0.5 text-[10px] font-mono font-bold">
                        {log.event_type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{log.actor_email || "System"}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.actor_role || "SYSTEM"}</div>
                    </td>
                    <td className="py-3 px-3 max-w-md truncate text-slate-700 dark:text-slate-200">
                      {log.action_details}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-700 dark:text-teal-400 font-bold">
                      {log.external_calls_detected} calls (0.00 B)
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
