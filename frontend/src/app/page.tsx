"use client";

import React, { useState, useEffect } from "react";
import {
  Terminal,
  Upload,
  FileText,
  Play,
  CheckCircle2,
  Clock,
  Cpu,
  ShieldCheck,
  Download,
  Sparkles,
  Database,
  Code2,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Zap,
  Activity,
  Presentation,
  Award,
  Flame,
  Info,
  X,
  Layers,
  Check,
  ExternalLink,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { api } from "@/lib/api";
import { Task } from "@/types";
import PidOverlayViewer from "@/components/PidOverlayViewer";

export default function AIWorkbenchPage() {
  const [prompt, setPrompt] = useState<string>("Analyze the attached scanned ultrasonic thickness report for Heat Exchanger HX-401.");
  const [taskType, setTaskType] = useState<string>("AUTO");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeDemo, setActiveDemo] = useState<number | null>(null);
  const [routingPreview, setRoutingPreview] = useState<any>(null);
  const [execError, setExecError] = useState<string | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [showSpecModal, setShowSpecModal] = useState<boolean>(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const list = await api.listTasks();
      setRecentTasks(list);
    } catch (e) {}
  };

  useEffect(() => {
    if (!prompt.trim()) {
      setRoutingPreview(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const preview = await api.dryRunRoute(prompt, !!selectedFile);
        setRoutingPreview(preview);
      } catch (e) {}
    }, 200);
    return () => clearTimeout(timer);
  }, [prompt, selectedFile, taskType]);

  const runTask = async (taskPrompt: string, taskTypeVal: string, fileToAttach: File | null) => {
    setIsExecuting(true);
    setExecError(null);
    const formData = new FormData();
    formData.append("prompt", taskPrompt);
    if (taskTypeVal !== "AUTO") {
      formData.append("task_type", taskTypeVal);
    }
    if (fileToAttach) {
      formData.append("file", fileToAttach);
    }

    try {
      const task = await api.createTask(formData);
      setCurrentTask(task);

      const pollInterval = setInterval(async () => {
        try {
          const updated = await api.getTask(task.id);
          setCurrentTask(updated);
          if (updated.status === "COMPLETED" || updated.status === "FAILED") {
            clearInterval(pollInterval);
            setIsExecuting(false);
            setActiveDemo(null);
            loadTasks();
          }
        } catch (e) {
          clearInterval(pollInterval);
          setIsExecuting(false);
          setActiveDemo(null);
        }
      }, 1000);
    } catch (err: any) {
      setIsExecuting(false);
      setActiveDemo(null);
      setExecError(err.message || "Cannot connect to backend server. Make sure the FastAPI backend is running at http://127.0.0.1:8000");
    }
  };

  const handleLaunchDemo1 = () => {
    const p =
      "Analyze this scanned inspection report for Heat Exchanger 11-HX-401, cross-reference findings with MRPL Refinery Safety SOP-08 (Minimum Shell & Tube Thickness), identify critical structural hazards, and synthesize an executive Approval Note (.docx) and board presentation (.pptx) for turnaround retubing.";
    const sampleFile = new File(
      ["MRPL REFINERY HEAT EXCHANGER HX-401 INSPECTION REPORT (SCANNED)"],
      "MRPL_HX401_Inspection_Report.pdf",
      { type: "application/pdf" }
    );
    setActiveDemo(1);
    setTaskType("MULTIMODAL_DOC");
    setPrompt(p);
    setSelectedFile(sampleFile);
    runTask(p, "MULTIMODAL_DOC", sampleFile);
  };

  const handleLaunchDemo2 = () => {
    const p =
      "Process the refinery pump vibration and bearing temperature log 'pump_p102_telemetry.csv', apply ISO 10816-3 vibration severity thresholds in Python sandbox, identify operational anomaly hours, and generate an Excel analysis workbook (.xlsx).";
    const sampleCsv = new File(
      ["Timestamp,Pump_Tag,Vibration_RMS_mm_s,Bearing_Temp_C\n2026-08-25 08:00,P-102A,4.8,78.5"],
      "pump_p102_telemetry.csv",
      { type: "text/csv" }
    );
    setActiveDemo(2);
    setTaskType("CODE_EXEC");
    setPrompt(p);
    setSelectedFile(sampleCsv);
    runTask(p, "CODE_EXEC", sampleCsv);
  };

  const handleLaunchDemo3 = () => {
    const p =
      "Synthesize a Python script to compute refinery heat transfer coefficients (U-value) for crude preheat train exchangers and verify calculations in the sandbox.";
    setActiveDemo(3);
    setTaskType("AUTO");
    setPrompt(p);
    setSelectedFile(null);
    runTask(p, "AUTO", null);
  };

  const handleManualExecute = () => {
    if (!prompt.trim()) return;
    runTask(prompt, taskType, selectedFile);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* SIH 2026 Problem Statement Modal with Smooth Backdrop & Zoom Animation */}
      {showSpecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-teal-500/40 bg-white dark:bg-[#071322] p-6 shadow-2xl text-slate-800 dark:text-slate-200 space-y-4 animate-in zoom-in-95 duration-200 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500 dark:text-amber-400 animate-bounce" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                  Smart India Hackathon 2026 — PS 26117 Specifications
                </h3>
              </div>
              <button
                onClick={() => setShowSpecModal(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-2.5 card-lift">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Problem ID</span>
                <div className="font-mono font-bold text-teal-600 dark:text-teal-400">26117</div>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-2.5 card-lift">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Organization</span>
                <div className="font-bold text-slate-900 dark:text-white truncate">MRPL (MoPNG)</div>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-2.5 card-lift">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Air-Gap Egress</span>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0.00 Bytes</div>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-2.5 card-lift">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Models Ready</span>
                <div className="font-mono font-bold text-blue-600 dark:text-blue-400">8 Open-Weight</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500" />
                Problem Statement Summary:
              </h4>
              <p className="bg-slate-50 dark:bg-[#0A1728] p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                Refineries and defence manufacturing units generate highly sensitive knowledge work (P&ID drawings, corrosion inspection reports, vendor negotiations, engineering calculations). Company policy forbids sending this data to public cloud AI (Claude/ChatGPT). This solution delivers a 100% on-premise, self-hosted agentic AI workbench running on open-weight multimodal LLMs with zero external egress.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Expected Solutions Mapping:</h4>
              <div className="space-y-2">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-teal-300 dark:border-teal-500/30 p-3 flex items-start gap-2.5 card-lift">
                  <span className="rounded bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 font-bold px-2 py-0.5 text-[10px] shrink-0">Demo 1</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Scanned Report → Approval Note (.docx) & Presentation (.pptx)</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">Reads ultrasonic report for HX-401, verifies against MRPL SOP-08 §4.2, and generates official signed Word note and executive slides.</p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-blue-300 dark:border-blue-500/30 p-3 flex items-start gap-2.5 card-lift">
                  <span className="rounded bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 font-bold px-2 py-0.5 text-[10px] shrink-0">Demo 2</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Coding Task & Verification in Sandbox → Telemetry (.xlsx)</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">Executes Python vibration calculations in an isolated sub-process sandbox and compiles an Excel sheet with ISO 10816-3 formulas.</p>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/90 border border-purple-300 dark:border-purple-500/30 p-3 flex items-start gap-2.5 card-lift">
                  <span className="rounded bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 font-bold px-2 py-0.5 text-[10px] shrink-0">Demo 3</span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Dynamic Model Auto-Routing & Extensible Model Registry</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">Auto-selects across 8 open-weight models (Qwen, DeepSeek, Google Gemma, StarCoder, Mistral) without restarting the server.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSpecModal(false)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-500 transition shadow-md active:scale-95"
              >
                Close Specifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner — Fully Responsive with Gradient Glow */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-teal-50/50 dark:from-[#0C1A2E] dark:to-[#0A1626] p-4 sm:p-5 shadow-lg card-lift transition-colors">
        <div className="w-full xl:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse shrink-0" />
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              MRPL Sovereign AI Agentic Studio
            </h1>
            <span className="rounded bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/40 dark:border-blue-600/40 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono dark:text-blue-300 font-semibold">
              PS 26117
            </span>
            <button
              onClick={() => setShowSpecModal(true)}
              className="flex items-center gap-1 rounded bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30 px-2.5 py-0.5 text-[9px] font-semibold dark:text-amber-300 hover:scale-105 active:scale-95 transition-transform"
            >
              <Info className="h-3 w-3" />
              <span>SIH 2026 Specs</span>
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Air-gapped on-premise multimodal intelligence for Mangalore Refinery. Scanned NDT parsing, sandboxed code execution, real deliverable synthesis.
          </p>
        </div>

        {/* 3 Killer Demo Quick Launchers — Interactive with Shimmer & Glow Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:flex xl:flex-wrap items-center gap-2 w-full xl:w-auto">
          <button
            type="button"
            onClick={handleLaunchDemo1}
            disabled={isExecuting}
            className={`btn-shimmer btn-glow-teal flex items-center justify-center sm:justify-start gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-bold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
              activeDemo === 1
                ? "border-teal-400 bg-teal-600 text-white animate-pulse shadow-lg shadow-teal-500/30"
                : "border-teal-400 bg-teal-50 text-teal-800 hover:bg-teal-100 dark:border-teal-500/50 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900 dark:hover:text-white"
            }`}
          >
            {activeDemo === 1 ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0 transition-transform group-hover:scale-110" />
            )}
            <span className="truncate">⭐ Demo 1: Approval Note (.docx)</span>
          </button>

          <button
            type="button"
            onClick={handleLaunchDemo2}
            disabled={isExecuting}
            className={`btn-shimmer btn-glow-blue flex items-center justify-center sm:justify-start gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-bold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
              activeDemo === 2
                ? "border-blue-400 bg-blue-600 text-white animate-pulse shadow-lg shadow-blue-500/30"
                : "border-blue-400 bg-blue-50 text-blue-800 hover:bg-blue-100 dark:border-blue-500/50 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900 dark:hover:text-white"
            }`}
          >
            {activeDemo === 2 ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
            ) : (
              <Code2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 transition-transform group-hover:scale-110" />
            )}
            <span className="truncate">⭐ Demo 2: Telemetry (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={handleLaunchDemo3}
            disabled={isExecuting}
            className={`btn-shimmer btn-glow-purple flex items-center justify-center sm:justify-start gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-bold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
              activeDemo === 3
                ? "border-purple-400 bg-purple-600 text-white animate-pulse shadow-lg shadow-purple-500/30"
                : "border-purple-400 bg-purple-50 text-purple-800 hover:bg-purple-100 dark:border-purple-500/50 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900 dark:hover:text-white"
            }`}
          >
            {activeDemo === 3 ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
            ) : (
              <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400 shrink-0 transition-transform group-hover:scale-110" />
            )}
            <span className="truncate">⭐ Demo 3: Auto-Routing</span>
          </button>
        </div>
      </div>

      {/* Official SIH 2026 Evaluation Metric Strip with Lift on Hover */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-3 shadow-sm flex items-center gap-3 card-lift transition-colors">
          <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Air-Gap Egress</div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">0.00 Bytes (Verified)</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-3 shadow-sm flex items-center gap-3 card-lift transition-colors">
          <div className="h-9 w-9 rounded-lg bg-teal-100 dark:bg-teal-500/10 border border-teal-300 dark:border-teal-500/30 flex items-center justify-center shrink-0">
            <Cpu className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Router Accuracy</div>
            <div className="text-xs font-bold text-teal-700 dark:text-teal-300 font-mono">100.0% (24/24 Paraphrased)</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-3 shadow-sm flex items-center gap-3 card-lift transition-colors">
          <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center shrink-0">
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Multimodal Recall</div>
            <div className="text-xs font-bold text-blue-700 dark:text-blue-300 font-mono">100.0% (NDT & P&ID)</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-3 shadow-sm flex items-center gap-3 card-lift transition-colors">
          <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Turnaround Speedup</div>
            <div className="text-xs font-bold text-amber-700 dark:text-amber-300 font-mono">~2,890× (4.5h → 5.58s)</div>
          </div>
        </div>
      </div>

      {/* Main Error Banner if Backend is Unreachable */}
      {execError && (
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-600/50 text-rose-800 dark:text-rose-200 text-xs shadow-md animate-fade-in-up">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{execError}</span>
          </div>
          <button
            onClick={() => setExecError(null)}
            className="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900/60 hover:bg-rose-300 dark:hover:bg-rose-800 text-[11px] font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Input + DAG Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Column: Task Formulation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-4 sm:p-5 shadow-sm space-y-4 card-lift transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                Task Formulation
              </h2>
              {routingPreview && (
                <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono truncate max-w-[160px] sm:max-w-none">
                  {routingPreview.selected_model}
                </span>
              )}
            </div>

            {/* Task Type Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Execution Strategy</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none transition font-sans"
              >
                <option value="AUTO">🤖 Auto-Select Open-Weight Model (Router)</option>
                <option value="MULTIMODAL_DOC">👁️ Vision Document Parsing (Qwen 2.5-VL:7B)</option>
                <option value="CODE_EXEC">💻 Code Synthesis & Sandbox (Qwen 2.5-Coder:7B)</option>
                <option value="REASONING">🧠 Deep Chain-of-Thought (DeepSeek-R1 / Gemma 2)</option>
                <option value="SOP_SEARCH">⚡ High-Speed SOP RAG (Llama-3.2 / Phi-3.5)</option>
              </select>
            </div>

            {/* Prompt Textarea */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Industrial Engineering Objective</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Analyze scanned inspection report for Heat Exchanger 11-HX-401, verify compliance against MRPL SOP-08, and synthesize a formal Word approval note with calculation proofs."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition font-sans"
              />
            </div>

            {/* File Dropzone */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Attach Technical Artifact (PDF, P&ID, CSV, Photo)
              </label>
              <div className="relative flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D18] p-4 text-center hover:border-teal-500 dark:hover:border-slate-500 transition cursor-pointer group">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="h-5 w-5 text-slate-500 dark:text-slate-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-full px-2">
                  {selectedFile ? selectedFile.name : "Drop inspection PDF, P&ID drawing, or telemetry CSV"}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {selectedFile
                    ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                    : "Processed 100% on-premise — zero external leak"}
                </span>
              </div>
            </div>

            {/* Router Preview */}
            {routingPreview && (
              <div className="rounded-lg border border-teal-200 dark:border-slate-800 bg-teal-50/50 dark:bg-[#080E1C] p-3 text-xs space-y-1 animate-fade-in-up">
                <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-semibold text-[11px]">
                  <Cpu className="h-3.5 w-3.5 shrink-0" />
                  Model Router Rationale
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">{routingPreview.reasoning}</p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 font-mono">
                  <span>Capability: {routingPreview.model_capability}</span>
                  <span>Est. VRAM: {routingPreview.estimated_vram_gb} GB</span>
                </div>
              </div>
            )}

            {/* Execute Button */}
            <button
              type="button"
              onClick={handleManualExecute}
              disabled={isExecuting || !prompt.trim()}
              className={`w-full flex items-center justify-center gap-2 rounded-lg py-3 text-xs font-bold transition-all shadow-md active:scale-[0.98] ${
                isExecuting || !prompt.trim()
                  ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                  : "btn-shimmer btn-glow-teal bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-400 hover:to-blue-500 shadow-lg shadow-teal-500/25"
              }`}
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
                  Executing Multi-Agent DAG...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current shrink-0" />
                  Launch Sovereign Workflow
                </>
              )}
            </button>
          </div>

          {/* Recent Tasks */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-4 shadow-sm space-y-3 card-lift transition-colors">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Recent Executions
            </h3>
            {recentTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No recent executions recorded.</p>
            ) : (
              <div className="space-y-2">
                {recentTasks.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setCurrentTask(t)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition hover:translate-x-1 duration-200 ${
                      currentTask?.id === t.id
                        ? "border-teal-400 bg-teal-50 dark:border-teal-500/50 dark:bg-teal-950/20 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-slate-800/80 dark:bg-[#060B14] dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {t.task_type} • {t.execution_time_seconds.toFixed(2)}s
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        t.status === "COMPLETED"
                          ? "bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30"
                          : t.status === "FAILED"
                          ? "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30"
                          : "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Execution DAG & Live Canvas */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          {/* Agent Execution Timeline */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-4 sm:p-5 shadow-sm space-y-4 card-lift transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Agentic Execution Graph (DAG)
                </h2>
              </div>
              {currentTask && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    Time: {currentTask.execution_time_seconds.toFixed(2)}s
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      currentTask.status === "COMPLETED"
                        ? "bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30"
                        : currentTask.status === "FAILED"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 animate-pulse"
                    }`}
                  >
                    {currentTask.status}
                  </span>
                </div>
              )}
            </div>

            {!currentTask ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-800/80 bg-slate-50 dark:bg-[#060B14] transition-colors">
                <Cpu className="h-10 w-10 text-slate-400 dark:text-slate-600 animate-float" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-400">No Active Agent Workflow</p>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    Select a killer demo launcher above or formulate an engineering prompt to trigger the 5-stage agentic DAG.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {currentTask.steps.map((step, idx) => {
                  const isRetry = step.status === "RETRY";
                  const isDone = step.status === "COMPLETED";

                  return (
                    <div
                      key={step.id}
                      className={`animate-fade-in-up card-lift rounded-lg border p-3 text-xs space-y-2 transition-all duration-200 ${
                        isRetry
                          ? "border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-950/20 border-l-4 border-l-amber-500"
                          : isDone
                          ? "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#060B14] border-l-4 border-l-teal-500"
                          : "border-teal-300 bg-teal-50 dark:border-teal-500/40 dark:bg-teal-950/20 animate-pulse border-l-4 border-l-blue-500"
                      }`}
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                              isDone
                                ? "bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/40"
                                : isRetry
                                ? "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40"
                                : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {step.step_order}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-200">{step.agent_name}</span>
                          {step.model_used && (
                            <span className="rounded bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 px-1.5 py-0.5 text-[9px] font-mono">
                              {step.model_used}
                            </span>
                          )}
                        </div>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            isDone
                              ? "text-teal-700 dark:text-teal-400"
                              : isRetry
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>

                      {step.thought_trace && (
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans pl-7">
                          {step.thought_trace}
                        </p>
                      )}

                      {step.tool_called && (
                        <div className="flex items-center gap-2 pl-7 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          <span className="text-teal-700 dark:text-teal-400">Tool: {step.tool_called}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Computer Vision P&ID Process Schematic Detection Overlay */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-4 sm:p-5 shadow-sm space-y-3 card-lift transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                Live Multimodal P&ID Computer Vision Canvas
              </h3>
              <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                100.0% Entity Recall
              </span>
            </div>
            <PidOverlayViewer />
          </div>

          {/* Generated Deliverables Artifact Box */}
          {currentTask && currentTask.generated_files.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-4 sm:p-5 shadow-sm space-y-4 card-lift animate-fade-in-up transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400 animate-pulse" />
                  Generated Engineering Deliverables
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {currentTask.generated_files.length} Files Released
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentTask.generated_files.map((file) => {
                  const Icon =
                    file.file_type === "DOCX"
                      ? FileText
                      : file.file_type === "PPTX"
                      ? Presentation
                      : file.file_type === "XLSX"
                      ? FileSpreadsheet
                      : FileText;

                  const color =
                    file.file_type === "DOCX"
                      ? "text-blue-600 dark:text-blue-400"
                      : file.file_type === "PPTX"
                      ? "text-amber-600 dark:text-amber-400"
                      : file.file_type === "XLSX"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-blue-600 dark:text-blue-400";

                  return (
                    <div
                      key={file.id}
                      className="card-lift flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 hover:border-teal-400 dark:border-slate-800 dark:bg-[#070D18] dark:hover:border-teal-500/50 transition duration-200 group"
                    >
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <Icon className={`h-6 w-6 shrink-0 ${color} group-hover:scale-110 transition-transform`} />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{file.filename}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {(file.file_size_bytes / 1024).toFixed(1)} KB • {file.file_type}
                          </div>
                        </div>
                      </div>
                      <a
                        href={api.getDownloadUrl(file.filename)}
                        download
                        className="flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-teal-500 shadow-sm hover:shadow-teal-500/30 transition shrink-0 active:scale-95"
                      >
                        <Download className="h-3 w-3" />
                        <span className="hidden xs:inline">Download</span>
                      </a>
                    </div>
                  );
                })}
              </div>

              {currentTask.result_summary && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-3 text-xs text-slate-700 dark:text-slate-300 space-y-1 overflow-x-auto">
                  <div className="font-semibold text-slate-900 dark:text-slate-200">Execution Summary</div>
                  <p className="whitespace-pre-wrap leading-relaxed text-[11px] break-words">
                    {currentTask.result_summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
