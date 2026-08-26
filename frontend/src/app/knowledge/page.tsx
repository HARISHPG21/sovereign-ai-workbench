"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Search, FileText, Layers, Database, ShieldAlert, Check, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { KnowledgeDocument } from "@/types";

export default function KnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("heat exchanger minimum tube thickness SOP-08");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const data = await api.listDocuments();
      setDocs(data);
    } catch (e) {}
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await api.searchKnowledge(searchQuery);
      setSearchResults(results);
    } catch (e) {
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 transition-colors">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          Enterprise Knowledge Base (On-Premise RAG)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Local refinery SOPs, equipment manuals, and statutory safety directives indexed into sovereign vector chunks.
        </p>
      </div>

      {/* Semantic Search Bar */}
      <div className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-4 transition-colors">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Search className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          Hybrid Semantic & BM25 Knowledge Retrieval
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search refinery standards (e.g. minimum allowable tube thickness SOP-08)..."
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#060B14] p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-teal-500 focus:outline-none transition font-sans"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="btn-glow-teal rounded-lg bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-500 transition shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Query RAG"}
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 transition-colors animate-fade-in-up">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Matching Grounded Chunks</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {searchResults.map((res, idx) => (
                <div
                  key={idx}
                  className="card-lift rounded-lg border border-teal-200 dark:border-slate-800 bg-teal-50/40 dark:bg-[#070D18] p-4 text-xs space-y-2 hover:border-teal-400 dark:hover:border-teal-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-800 dark:text-teal-300">{res.source_citation}</span>
                    <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/10 dark:text-teal-400 px-2 py-0.5 text-[10px] font-mono font-bold">
                      Relevance Score: {res.score}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px] font-sans">{res.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Indexed Documents Table */}
      <div className="card-lift rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1324] p-5 shadow-sm space-y-4 transition-colors">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Database className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          Indexed Sovereign Documents ({docs.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {docs.map((doc, idx) => (
            <div
              key={doc.id}
              className="card-lift flex items-center justify-between p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D18] hover:border-teal-400 dark:hover:border-teal-500/40 transition"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-teal-100 dark:bg-teal-500/10 border border-teal-300 dark:border-teal-500/30 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{doc.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    Category: {doc.category} • Chunks: {doc.chunk_count}
                  </div>
                </div>
              </div>
              <span className="rounded bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/30 px-2 py-0.5 text-[9px] font-mono font-bold">
                INDEXED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
