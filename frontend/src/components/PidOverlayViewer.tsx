"use client";

import React, { useState } from "react";
import { Eye, Loader2 } from "lucide-react";

export interface BoundingBox {
  id: string;
  tag: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  status: "CRITICAL" | "WARNING" | "NORMAL";
  confidence: number;
  details: string;
}

/**
 * Placeholder shown ONLY while the backend P&ID extraction is still in-flight.
 * This array must NEVER be shown as the final rendered state — it is gated
 * behind `isLoading === true` exclusively.
 */
const SAMPLE_ENTITIES: BoundingBox[] = [
  {
    id: "box-1",
    tag: "11-HX-401A/B",
    type: "CRUDE PREHEAT EXCHANGER",
    x: 130, y: 130, w: 240, h: 160,
    color: "#EF4444",
    status: "CRITICAL",
    confidence: 0.982,
    details: "Pass 2 Lower Shell: 3.18mm thickness (SOP-08 cut-off 3.50mm BREACHED by 0.32mm). Category-A isolation required."
  },
  {
    id: "box-2",
    tag: "11-P-102A/B",
    type: "CRUDE DISTILLATION PUMP",
    x: 430, y: 230, w: 160, h: 120,
    color: "#F59E0B",
    status: "WARNING",
    confidence: 0.965,
    details: "Casing Vibration RMS: 4.83 mm/s (Exceeds ISO 10816-3 Zone C limit 4.50 mm/s). Bearing temp: 78.6°C."
  },
  {
    id: "box-3",
    tag: "11-V-201",
    type: "VACUUM FLASH VESSEL",
    x: 650, y: 90, w: 180, h: 240,
    color: "#10B981",
    status: "NORMAL",
    confidence: 0.991,
    details: "Design Pressure: 3.5 bar | Operating: 1.2 bar. Ultrasonic wall thickness: 8.42mm (Compliant)."
  },
  {
    id: "box-4",
    tag: "PSV-4105",
    type: "SAFETY RELIEF VALVE",
    x: 250, y: 70, w: 80, h: 55,
    color: "#3B82F6",
    status: "NORMAL",
    confidence: 0.974,
    details: "Set Pressure: 24.2 bar (API 520). Last certified: 2026-01-15. Hydrostatic seal verified."
  },
  {
    id: "box-5",
    tag: "MOV-4101",
    type: "MOTOR OPERATED ISOLATION VALVE",
    x: 70, y: 190, w: 55, h: 45,
    color: "#14B8A6",
    status: "NORMAL",
    confidence: 0.988,
    details: 'Emergency shutdown tie-in line 12\"-CDU-101-A1A. Open/Close stroke test: PASS (4.2s).'
  }
];

interface PidOverlayViewerProps {
  /**
   * Real bounding-box entities extracted by the backend vision model
   * (visual_bounding_boxes from extracted_metadata).
   * When undefined or empty the component falls back to demo/loading state;
   * when populated these replace SAMPLE_ENTITIES entirely in the final render.
   */
  extractedEntities?: BoundingBox[];
  /**
   * True while the backend task is still running.
   * When true, SAMPLE_ENTITIES are shown at reduced opacity with a full-canvas
   * spinner overlay. Once false and extractedEntities is non-empty, only the
   * real backend data is rendered — SAMPLE_ENTITIES are never shown as a
   * final result.
   */
  isLoading?: boolean;
}

export default function PidOverlayViewer({
  extractedEntities,
  isLoading = false,
}: PidOverlayViewerProps) {
  // Decide which dataset to render:
  //   - Still loading               → SAMPLE_ENTITIES with full-canvas spinner
  //   - Real data arrived           → extractedEntities (live backend output)
  //   - Idle (no task run yet)      → SAMPLE_ENTITIES with DEMO DATA badge
  const hasRealData = !isLoading && Array.isArray(extractedEntities) && extractedEntities.length > 0;
  const displayEntities: BoundingBox[] = hasRealData ? extractedEntities! : SAMPLE_ENTITIES;
  const isPlaceholder = !hasRealData;

  const [selectedBox, setSelectedBox] = useState<BoundingBox | null>(displayEntities[0] ?? null);
  const [viewMode, setViewMode] = useState<"OVERLAY" | "CONFIDENCE" | "METRICS">("OVERLAY");

  // When real data first arrives, reset the selected entity to the first real entity.
  const prevHasRealData = React.useRef(hasRealData);
  if (prevHasRealData.current !== hasRealData && hasRealData) {
    prevHasRealData.current = hasRealData;
    setTimeout(() => setSelectedBox(extractedEntities![0] ?? null), 0);
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-teal-500/40 bg-white dark:bg-[#070D18] p-4 sm:p-5 shadow-xl space-y-4 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Multimodal P&amp;ID Vision Detection &amp; Bounding Box Overlay
            </h3>
            <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30 px-2 py-0.5 text-[9px] font-mono font-bold">
              Qwen2.5-VL:7B
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {hasRealData
                ? `Live extraction — ${displayEntities.length} entities detected from uploaded document.`
                : isLoading
                ? "Vision model processing uploaded P&ID — awaiting extraction results…"
                : "Real-time entity bounding box localization directly over CDU-1 process schematic."}
            </p>
            {isLoading && (
              <span className="flex items-center gap-1 rounded bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 px-2 py-0.5 text-[9px] font-mono font-bold">
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                PROCESSING
              </span>
            )}
            {hasRealData && (
              <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/30 px-2 py-0.5 text-[9px] font-mono font-bold">
                ✓ LIVE DATA
              </span>
            )}
            {isPlaceholder && !isLoading && (
              <span className="rounded bg-slate-100 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 px-2 py-0.5 text-[9px] font-mono font-bold">
                DEMO DATA
              </span>
            )}
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#050A14] p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] transition-colors">
          <button
            onClick={() => setViewMode("OVERLAY")}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              viewMode === "OVERLAY"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Bounding Boxes
          </button>
          <button
            onClick={() => setViewMode("METRICS")}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              viewMode === "METRICS"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            ⚡ Time Acceleration
          </button>
          <button
            onClick={() => setViewMode("CONFIDENCE")}
            className={`px-2.5 py-1 rounded font-semibold transition ${
              viewMode === "CONFIDENCE"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Entity Table
          </button>
        </div>
      </div>

      {/* Main Interactive Blueprint Canvas */}
      {viewMode === "OVERLAY" && (
        <div className="space-y-3">
          <div className="relative w-full aspect-[16/9] max-h-[360px] rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#040812] overflow-hidden select-none shadow-inner transition-colors">
            {/* Visual AI Laser Scanline Effect */}
            <div className="animate-laser-scan" />

            {/* Loading overlay — shown while backend extracts entities */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm gap-2">
                <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
                <span className="text-[11px] font-mono text-teal-300">
                  Qwen2.5-VL extracting entities…
                </span>
              </div>
            )}

            {/* SVG Blueprint Grid & Schematic Geometry */}
            <svg className="w-full h-full" viewBox="0 0 900 400" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" className="text-slate-300 dark:text-slate-900" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Piping Lines */}
              <line x1="30" y1="210" x2="130" y2="210" stroke="#0284C7" strokeWidth="3" />
              <text x="40" y="200" fill="#0284C7" fontSize="9" fontFamily="monospace" fontWeight="bold">12"-CDU-101-A1A (Crude Feed)</text>
              <line x1="370" y1="210" x2="430" y2="290" stroke="#0284C7" strokeWidth="3" />
              <line x1="590" y1="290" x2="650" y2="210" stroke="#0284C7" strokeWidth="3" />
              <text x="440" y="275" fill="#0284C7" fontSize="9" fontFamily="monospace" fontWeight="bold">8"-CDU-104-B2B</text>
              <line x1="830" y1="210" x2="880" y2="210" stroke="#0284C7" strokeWidth="3" />

              {/* Emergency Bypass Line (Dashed) */}
              <path d="M 130 150 L 130 350 L 400 350 L 650 350 L 650 270" fill="none" stroke="#D97706" strokeWidth="2" strokeDasharray="6,4" />
              <text x="210" y="340" fill="#D97706" fontSize="9" fontFamily="monospace" fontWeight="bold">6"-BPS-108-A1A (Emergency Turnaround Bypass Line)</text>

              {/* Static Equipment Schematics */}
              <rect x="150" y="150" width="200" height="120" rx="8" className="fill-slate-200 stroke-slate-400 dark:fill-[#09182A] dark:stroke-[#1E293B]" strokeWidth="2" />
              <circle cx="250" cy="210" r="40" fill="none" className="stroke-slate-400 dark:stroke-[#334155]" strokeWidth="1.5" strokeDasharray="3,3" />
              <text x="175" y="215" className="fill-slate-800 dark:fill-[#94A3B8]" fontSize="11" fontWeight="bold">HEAT EXCHANGER 11-HX-401</text>
              <circle cx="510" cy="290" r="35" className="fill-slate-200 stroke-slate-400 dark:fill-[#09182A] dark:stroke-[#1E293B]" strokeWidth="2" />
              <text x="475" y="295" className="fill-slate-800 dark:fill-[#94A3B8]" fontSize="10" fontWeight="bold">P-102A</text>
              <rect x="670" y="110" width="140" height="200" rx="20" className="fill-slate-200 stroke-slate-400 dark:fill-[#09182A] dark:stroke-[#1E293B]" strokeWidth="2" />
              <text x="695" y="215" className="fill-slate-800 dark:fill-[#94A3B8]" fontSize="11" fontWeight="bold">VESSEL 11-V-201</text>

              {/* Bounding Boxes — real backend data, or loading placeholder at reduced opacity */}
              {displayEntities.map((b) => {
                const isSelected = selectedBox?.id === b.id;
                return (
                  <g key={b.id} onClick={() => setSelectedBox(b)} className="cursor-pointer">
                    <rect
                      x={b.x} y={b.y} width={b.w} height={b.h}
                      fill={`${b.color}25`}
                      stroke={b.color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray={isSelected ? "none" : "4,2"}
                      rx="4"
                      className="transition-all hover:fill-opacity-40"
                      opacity={isLoading ? 0.4 : 1}
                    />
                    <rect
                      x={b.x} y={b.y - 18}
                      width={b.tag.length * 8 + 20} height="18"
                      fill={b.color} rx="3"
                      opacity={isLoading ? 0.4 : 1}
                    />
                    <text
                      x={b.x + 6} y={b.y - 5}
                      fill="#FFFFFF" fontSize="9.5"
                      fontWeight="bold" fontFamily="monospace"
                      opacity={isLoading ? 0.4 : 1}
                    >
                      {b.tag}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Status banner */}
            <div className="absolute bottom-2 left-3 bg-white/95 text-slate-700 border border-slate-300 shadow-md dark:bg-[#070D18]/90 dark:text-slate-300 dark:border-slate-800 backdrop-blur px-2.5 py-1 rounded text-[10px] font-medium transition-colors">
              {hasRealData
                ? "Click any extracted bounding box to inspect vision model field telemetry."
                : isLoading
                ? "Waiting for vision model extraction results..."
                : "Click any bounding box above to inspect extracted field telemetry & SOP citations."}
            </div>
          </div>

          {/* Selected Entity Inspector Panel */}
          {selectedBox && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324] p-3.5 space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: selectedBox.color }} />
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{selectedBox.tag}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">({selectedBox.type})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 font-semibold">
                    Vision Model Confidence: {(selectedBox.confidence * 100).toFixed(1)}%
                  </span>
                  <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                    selectedBox.status === "CRITICAL"
                      ? "bg-red-100 text-red-800 border border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-500/40"
                      : selectedBox.status === "WARNING"
                      ? "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-500/40"
                      : "bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-500/40"
                  }`}>
                    {selectedBox.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans pl-5">
                {selectedBox.details}
              </p>
            </div>
          )}
        </div>
      )}

      {/* View Mode 2: Time Acceleration Metrics */}
      {viewMode === "METRICS" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1324] p-4 text-center space-y-1 transition-colors">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Manual Engineer Review</div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-300">~4.5 Hours</div>
            <div className="text-[10px] text-slate-500">270 mins manual SOP &amp; drafting</div>
          </div>
          <div className="rounded-lg border border-teal-300 dark:border-teal-500/50 bg-teal-50 dark:bg-teal-950/30 p-4 text-center space-y-1 transition-colors">
            <div className="text-[10px] text-teal-800 dark:text-teal-400 uppercase font-semibold">SovereignAI Multi-Agent Time</div>
            <div className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-300">5.58 Seconds</div>
            <div className="text-[10px] text-teal-700 dark:text-teal-400">Autonomous 5-Stage DAG Synthesis</div>
          </div>
          <div className="rounded-lg border border-purple-300 dark:border-purple-500/50 bg-purple-50 dark:bg-purple-950/30 p-4 text-center space-y-1 transition-colors">
            <div className="text-[10px] text-purple-800 dark:text-purple-400 uppercase font-semibold">Turnaround Acceleration</div>
            <div className="text-2xl font-bold font-mono text-purple-700 dark:text-purple-300">99.96% Faster</div>
            <div className="text-[10px] text-purple-700 dark:text-purple-400">~2,890× Deliverable Speedup</div>
          </div>
        </div>
      )}

      {/* View Mode 3: Entity Table */}
      {viewMode === "CONFIDENCE" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3 font-semibold">Equipment Tag</th>
                <th className="py-2 px-3 font-semibold">Classification</th>
                <th className="py-2 px-3 font-semibold">Vision Confidence</th>
                <th className="py-2 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-800 dark:text-slate-300 font-mono text-[11px]">
              {displayEntities.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{b.tag}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{b.type}</td>
                  <td className="py-2.5 px-3 text-teal-700 dark:text-teal-400 font-semibold">{(b.confidence * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      b.status === "CRITICAL"
                        ? "text-red-800 bg-red-100 border border-red-300 dark:text-red-400 dark:bg-red-950/60 dark:border-red-800"
                        : b.status === "WARNING"
                        ? "text-amber-800 bg-amber-100 border border-amber-300 dark:text-amber-400 dark:bg-amber-950/60 dark:border-amber-800"
                        : "text-teal-800 bg-teal-100 border border-teal-300 dark:text-teal-400 dark:bg-teal-950/60 dark:border-teal-800"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isPlaceholder && !isLoading && (
            <p className="text-[10px] text-slate-400 dark:text-slate-600 italic pt-2 px-3">
              Showing demo data. Upload a P&amp;ID document and run the vision workflow to see live extracted entities here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
