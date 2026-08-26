"use client";

import React, { useState, useEffect } from "react";
import { Cpu, CheckCircle, HardDrive, Zap, RefreshCw, Plus, X, AlertCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { ModelRegistryItem } from "@/types";

export default function ModelsPage() {
  const [models, setModels] = useState<ModelRegistryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [testPrompt, setTestPrompt] = useState<string>("Extract corrosion pitting from ultrasonic scan");
  const [hasFile, setHasFile] = useState<boolean>(true);
  const [routeResult, setRouteResult] = useState<any>(null);

  // New Model Registration Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newModel, setNewModel] = useState({
    id: "mistral-nemo:12b",
    name: "Mistral NeMo 12B (Air-Gapped)",
    provider: "Ollama (On-Premise Local)",
    capability: "REASONING",
    quantization: "Q4_K_M",
    vram_required_gb: 7.2,
    context_length: 32768,
    description: "High-parameter reasoning model for multi-department safety cross-checks and turnaround planning.",
  });
  const [registering, setRegistering] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await api.listModels();
      setModels(data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleTestRoute = async () => {
    try {
      const res = await api.dryRunRoute(testPrompt, hasFile);
      setRouteResult(res);
    } catch (e) {}
  };

  const handleRegisterModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      setRegistering(true);
      await api.registerModel(newModel);
      setSuccessMsg(`Model '${newModel.name}' registered successfully into on-premise catalog.`);
      await loadModels();
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register model.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Cpu className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            Open-Weight Model Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Self-hosted local models running via Ollama/vLLM. Extensible architecture — add new weights dynamically without code modifications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn-glow-teal flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 transition shadow-sm active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            + Register New Model
          </button>
          <button
            onClick={loadModels}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Model Cards Grid with Staggered Fade-in & Lift on Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((m, idx) => (
          <div
            key={m.id}
            className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-4 transition-colors"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</h3>
                  {m.is_default && (
                    <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30 px-1.5 py-0.2 text-[9px] font-bold">
                      DEFAULT
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.id}</div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded border border-teal-300 dark:border-teal-500/30">
                <CheckCircle className="h-3.5 w-3.5" />
                Active
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{m.description}</p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] transition-colors">
              <div className="rounded bg-slate-50 dark:bg-[#070D18] p-2 border border-slate-100 dark:border-transparent">
                <div className="text-slate-500">Capability</div>
                <div className="font-semibold text-teal-700 dark:text-teal-300 mt-0.5">{m.capability}</div>
              </div>
              <div className="rounded bg-slate-50 dark:bg-[#070D18] p-2 border border-slate-100 dark:border-transparent">
                <div className="text-slate-500">Quantization</div>
                <div className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{m.quantization}</div>
              </div>
              <div className="rounded bg-slate-50 dark:bg-[#070D18] p-2 border border-slate-100 dark:border-transparent">
                <div className="text-slate-500">Est. VRAM</div>
                <div className="font-mono font-semibold text-blue-700 dark:text-blue-400 mt-0.5">{m.vram_required_gb} GB</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Model Router Interactive Simulator */}
      <div className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-4 transition-colors">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Zap className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          Autonomous Model Router Simulator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Test how the intelligent classifier maps incoming industrial tasks to specialized open-weight models.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-8">
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Test Task Query</label>
            <input
              type="text"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none transition"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 pb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasFile}
                onChange={(e) => setHasFile(e.target.checked)}
                className="rounded border-slate-300 bg-slate-100 text-teal-600"
              />
              Has Attachment
            </label>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={handleTestRoute}
              className="btn-glow-teal w-full rounded-lg bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-500 transition shadow-sm active:scale-95"
            >
              Simulate Route
            </button>
          </div>
        </div>

        {routeResult && (
          <div className="mt-3 rounded-lg border border-teal-300 dark:border-teal-500/30 bg-teal-50 dark:bg-[#081524] p-4 text-xs space-y-2 animate-fade-in-up transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-800 dark:text-teal-300 text-sm">Routed Model: {routeResult.selected_model}</span>
              <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 px-2 py-0.5 text-[10px] font-mono font-bold">
                {routeResult.task_type}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{routeResult.reasoning}</p>
          </div>
        )}
      </div>

      {/* Register New Model Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                Register New Open-Weight Model
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="rounded bg-rose-100 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/30 p-2.5 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="rounded bg-teal-100 dark:bg-teal-500/10 border border-teal-300 dark:border-teal-500/30 p-2.5 text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {successMsg}
              </div>
            )}

            <form onSubmit={handleRegisterModel} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium">Model ID (Ollama tag / local path)</label>
                <input
                  type="text"
                  required
                  value={newModel.id}
                  onChange={(e) => setNewModel({ ...newModel, id: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2 text-slate-900 dark:text-white font-mono text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium">Display Name</label>
                <input
                  type="text"
                  required
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2 text-slate-900 dark:text-white text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium">Capability</label>
                  <select
                    value={newModel.capability}
                    onChange={(e) => setNewModel({ ...newModel, capability: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2 text-slate-900 dark:text-white text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="REASONING">REASONING</option>
                    <option value="CODE">CODE</option>
                    <option value="VISION">VISION</option>
                    <option value="GENERAL">GENERAL</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium">Quantization</label>
                  <select
                    value={newModel.quantization}
                    onChange={(e) => setNewModel({ ...newModel, quantization: e.target.value })}
                    className="mt-1 w-full rounded border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2 text-slate-900 dark:text-white font-mono text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Q4_K_M">Q4_K_M (4-bit)</option>
                    <option value="Q8_0">Q8_0 (8-bit)</option>
                    <option value="FP16">FP16 (Half)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium">Est. VRAM (GB)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newModel.vram_required_gb}
                    onChange={(e) => setNewModel({ ...newModel, vram_required_gb: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2 text-slate-900 dark:text-white font-mono text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium">Context Window</label>
                  <input
                    type="number"
                    required
                    value={newModel.context_length}
                    onChange={(e) => setNewModel({ ...newModel, context_length: parseInt(e.target.value) || 32768 })}
                    className="mt-1 w-full rounded border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2 text-slate-900 dark:text-white font-mono text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={newModel.description}
                  onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
                  className="mt-1 w-full rounded border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2 text-slate-900 dark:text-white text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="btn-glow-teal rounded bg-teal-600 px-4 py-1.5 font-bold text-white hover:bg-teal-500 disabled:opacity-50 transition shadow-sm active:scale-95"
                >
                  {registering ? "Registering..." : "Add to Registry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
