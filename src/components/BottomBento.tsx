/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Sparkles, 
  Database, 
  Wrench, 
  ShieldCheck, 
  Download, 
  FileCheck, 
  Play, 
  Check, 
  AlertTriangle,
  Flame,
  Globe,
  Loader2
} from 'lucide-react';
import { HealingTask, QueryLog } from '../types';

interface BottomBentoProps {
  healingTasks: HealingTask[];
  onResolveHeal: (id: string) => void;
  queryLogs: QueryLog[];
  suggestedQueries: string[];
}

export default function BottomBento({
  healingTasks,
  onResolveHeal,
  queryLogs,
  suggestedQueries
}: BottomBentoProps) {
  
  // Query state
  const [activeQuery, setActiveQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState<QueryLog[]>(queryLogs);
  const [searching, setSearching] = useState(false);

  // Catalog tab state
  const [catalogTab, setCatalogTab] = useState<'Search' | 'Relationships' | 'Alternatives' | 'Compliance'>('Search');

  // Governance state
  const [gActiveTab, setGActiveTab] = useState<'health' | 'learning' | 'audit'>('health');

  // Export states
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv' | 'json'>('pdf');
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeDetailed, setIncludeDetailed] = useState(true);
  const [includeAudit, setIncludeAudit] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportedFile, setExportedFile] = useState<string | null>(null);

  // Healing animation states
  const [healingId, setHealingId] = useState<string | null>(null);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeQuery.trim() === '') return;
    triggerSearch(activeQuery);
  };

  const triggerSearch = (query: string) => {
    setSearching(true);
    setActiveQuery(query);
    setTimeout(() => {
      setSearching(false);
      let answer = 'Analyzing catalogs and discrepancies database... Unclassified query returned. Refine SKU coordinate or search within context.';
      if (query.toLowerCase().includes('ps0775-b21') || query.toLowerCase().includes('rail')) {
        answer = 'The rail kit PS0775-B21 was present in the BOQ (Qty: 2) but omitted from the BOM during execution on the HPE portal. This is likely because the automatic portal sourcing script was queue-blocked. Recommended Action: Click Add to BOM, or execute Auto-Heal to trigger a background patch.';
      } else if (query.toLowerCase().includes('diff') || query.toLowerCase().includes('qty')) {
        answer = 'There are two main quantity differences active: Part P57706-B21 (SATA SSD) has BOQ Qty: 12 but BOM Qty: 10 (mismatch of 2). Part P55123-B21 (NVIDIA GPU) has BOQ Qty: 1 but BOM Qty: 2 (mismatch of 1).';
      } else if (query.toLowerCase().includes('risk') || query.toLowerCase().includes('score')) {
        answer = 'Risk level is MEDIUM because the quantity mismatches in memory modules and SSD components can compromise performance baselines. We recommend auto-healing all missing parts before compiling deliverables.';
      } else if (query.toLowerCase().includes('p47810') || query.toLowerCase().includes('ram')) {
        answer = 'P47810-B21 is standard 32GB DDR5 RDIMM 4800. Compatible equivalents include Micron MTC20C2085S1RC48BA or Samsung M321R4GA3BB6-CQKOG. Both are certified for DL380 Gen12 with full safety compliance ratings.';
      }

      const newLog: QueryLog = {
        id: Math.random().toString(),
        query,
        answer,
        timestamp: new Date().toTimeString().split(' ')[0],
        isRecent: true
      };
      setQueryHistory([newLog, ...queryHistory]);
    }, 1000);
  };

  const executeHeal = (id: string) => {
    setHealingId(id);
    setTimeout(() => {
      setHealingId(null);
      onResolveHeal(id);
    }, 1200);
  };

  const handleGenerateReport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      const randomId = Math.floor(Math.random() * 90000) + 10000;
      setExportedFile(`VENDOR_SOLUTION_REPORT_${randomId}.${selectedFormat.toUpperCase()}`);
    }, 1500);
  };

  return (
    <div id="bottom-bento-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      
      {/* 6. Query Studio (Wide-screen NLP engine, span 2) */}
      <div id="query" className="lg:col-span-2 bg-[#0F172A] rounded-2xl border border-slate-800 p-5 text-slate-200 flex flex-col justify-between scroll-mt-20 shadow-sm shadow-slate-900/10">
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">6</span>
            <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
              Query Studio <span className="font-mono text-[9px] text-slate-500 font-semibold uppercase tracking-wider select-none">Unified Search & NLP</span>
            </h3>
          </div>

          <form onSubmit={handleQuerySubmit} className="relative mt-2">
            <input 
              type="text"
              id="nlp-query-input"
              value={activeQuery}
              onChange={(e) => setActiveQuery(e.target.value)}
              placeholder="Ask anything about your parts, portals, rules..."
              className="w-full bg-[#1E293B] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-450 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
            />
            <button 
              type="submit"
              id="nlp-query-submit-btn"
              className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Sugg query chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Suggested Questions</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQueries.map((q, id) => (
                <button 
                  key={id}
                  id={`suggested-query-${id}`}
                  onClick={() => triggerSearch(q)}
                  className="text-[10px] text-indigo-305 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-900/60 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer text-left truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Query Answers stream log */}
          <div className="pt-2 border-t border-slate-800/60 space-y-3 max-h-[160px] overflow-y-auto pr-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Query Studio Answer Log</span>
            
            {searching ? (
              <div className="flex items-center gap-2 text-xs text-indigo-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Slicing Models parsing catalogs schemas...</span>
              </div>
            ) : (
              <div className="space-y-3 divide-y divide-slate-805/40">
                {queryHistory.slice(0, 2).map((item) => (
                  <div key={item.id} className="text-xs pt-2 first:pt-0 leading-relaxed">
                    <div className="flex justify-between font-mono text-[9px] text-slate-550 font-semibold mb-1">
                      <span className="text-indigo-300">Q: "{item.query}"</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <p className="text-slate-300 font-medium pl-1.5 border-l-2 border-indigo-500">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono mt-3 text-right">
          INTELLIGENT NATURAL LANGUAGE ENGINE ACTIVE • 2026-05-31
        </div>
      </div>

      {/* 7. Catalog Intelligence (Span 1) */}
      <div id="catalog" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm shadow-indigo-100/30 flex flex-col justify-between scroll-mt-20">
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">7</span>
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              Catalog Intel <span className="p-1 bg-indigo-50 text-indigo-605 rounded text-[9px] font-mono font-semibold uppercase tracking-wider">active</span>
            </h3>
          </div>

          {/* mini catalog tabs */}
          <div className="grid grid-cols-4 gap-0.5 border-b border-slate-100 text-[10px] font-semibold text-slate-500">
            {['Search', 'Links', 'Alts', 'Rules'].map((tab) => (
              <button 
                key={tab}
                id={`catalog-tab-${tab}`}
                onClick={() => setCatalogTab(tab as any)}
                className={`pb-1 border-b-2 text-center cursor-pointer transition
                  ${catalogTab.startsWith(tab.slice(0,3)) ? 'border-indigo-500 text-indigo-600 font-bold' : 'border-transparent hover:text-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* catalog list */}
          <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
            {[
              { sku: 'P56156-B21', name: 'Intel Xeon 6430', rate: 'MSRP: $1,654', state: 'Compliance Pass' },
              { sku: 'P47810-B21', name: '32GB DDR5 RAM', rate: 'MSRP: $445', state: 'Compliance Pass' },
              { sku: 'PS0775-B21', name: 'HPE Rail Kit', rate: 'MSRP: $125', state: 'Exception' }
            ].map((part, idx) => (
              <div key={idx} className="p-2 border border-slate-100 rounded-lg bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-600 relative">
                <div className="flex justify-between font-mono font-bold text-slate-850 mb-0.5">
                  <span className="text-[11px] text-indigo-650">{part.sku}</span>
                  <span className="text-[10px]">{part.rate}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>{part.name}</span>
                  <span className="text-emerald-600 font-bold">{part.state}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          id="view-full-catalog-btn"
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-xl text-xs font-bold text-slate-700 tracking-tight transition cursor-pointer mt-3"
        >
          View Full Catalog Intel
        </button>
      </div>      {/* 8. Fix / Heal Center (Span 1) */}
      <div id="governance" className="bg-white rounded-2xl border border-slate-205 p-5 shadow-sm shadow-indigo-100/30 flex flex-col justify-between scroll-mt-20">
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">8</span>
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              Fix / Heal Center <span className="animate-pulse w-2 h-2 rounded-full bg-indigo-600" />
            </h3>
          </div>

          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unresolved Discrepancies ({healingTasks.filter(t => t.status === 'To Be Fixed').length})</div>

          {/* Healing list tasks */}
          <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
            {healingTasks.map((task) => (
              <div key={task.id} className="p-2.5 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col justify-between text-xs space-y-2">
                <div className="flex items-start justify-between min-w-0">
                  <div className="min-w-0">
                    <h5 className="font-bold text-slate-800 truncate" title={task.title}>{task.title}</h5>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{task.subtitle}</span>
                  </div>
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded flex-shrink-0
                    ${task.priority === 'High' ? 'bg-red-50 text-red-650' : 'bg-amber-50 text-amber-700'}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex justify-end pt-1">
                  {task.status === 'Fixed' ? (
                    <span className="text-[10.5px] font-bold text-emerald-600 inline-flex items-center gap-1">
                      ✓ Resolved Sourced
                    </span>
                  ) : (
                    <button 
                      id={`heal-task-btn-${task.id}`}
                      onClick={() => executeHeal(task.id)}
                      disabled={healingId === task.id}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] tracking-tight transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                    >
                      {healingId === task.id ? (
                        <>
                          <Loader2 className="w-2.5 h-2.5 animate-spin" /> Healing...
                        </>
                      ) : (
                        'Auto-Heal'
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-medium italic mt-3 text-center block">AI diagnostics runs on background loop</span>
      </div>

      {/* 9. Governance & Learning (Span 1) */}
      <div id="exports" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm shadow-indigo-100/30 flex flex-col justify-between scroll-mt-20">
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">9</span>
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
              Governance <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Health & learning</span>
            </h3>
          </div>

          <div className="flex bg-slate-50 p-0.5 rounded-lg text-[9px] font-semibold border border-slate-100">
            <button 
              id="gov-sub-tab-health"
              onClick={() => setGActiveTab('health')} 
              className={`flex-1 py-1 rounded cursor-pointer ${gActiveTab === 'health' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
            >
              Health
            </button>
            <button 
              id="gov-sub-tab-learning"
              onClick={() => setGActiveTab('learning')} 
              className={`flex-1 py-1 rounded cursor-pointer ${gActiveTab === 'learning' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
            >
              Learning
            </button>
            <button 
              id="gov-sub-tab-audit"
              onClick={() => setGActiveTab('audit')} 
              className={`flex-1 py-1 rounded cursor-pointer ${gActiveTab === 'audit' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
            >
              Audit
            </button>
          </div>

          {gActiveTab === 'health' ? (
            <div id="gov-health-screen" className="space-y-3 pt-1">
              {[
                { title: 'Schema Health', pct: '98%', status: 'Excellent', color: 'text-emerald-600' },
                { title: 'Catalog Integrity', pct: '96%', status: 'Excellent', color: 'text-emerald-600' },
                { title: 'Violations Stream', pct: '4', status: 'Needs Attention', color: 'text-rose-500' }
              ].map((h, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-slate-500 font-medium">{h.title}</span>
                  <div className="text-right">
                    <span className={`block font-bold leading-none ${h.color}`}>{h.pct}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">{h.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : gActiveTab === 'learning' ? (
            <div id="gov-learning-screen" className="space-y-2 pt-1 text-[11px] leading-relaxed max-h-[143px] overflow-y-auto pr-1">
              <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                <span className="block font-bold text-slate-700">New Rule Learned:</span>
                <span className="text-slate-550 block">Mapped DL380 rail kit configuration baseline PS0775-B21 with 99% accuracy.</span>
              </div>
              <div className="p-1.5 bg-slate-50 rounded border border-slate-100">
                <span className="block font-bold text-slate-700">Audit feedback loop:</span>
                <span className="text-slate-550 block">Operator verified alternative RAM replacement profiles.</span>
              </div>
            </div>
          ) : (
            <div id="gov-audit-screen" className="space-y-2 pt-1 text-[11px] text-slate-500">
              <div className="flex justify-between border-b pb-1">
                <span>Audited Tasks</span>
                <span className="font-bold text-slate-700">156 active</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Compliance Flags</span>
                <span className="font-bold text-red-500">4 active</span>
              </div>
              <p className="text-[10px] leading-relaxed italic text-slate-400">Compliance score adheres strictly to GS-889 European commerce directives.</p>
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-400 font-semibold text-center border-t border-slate-100 pt-2 shrink-0">
          Last learning audit: 2h ago
        </div>
      </div>

      {/* 10. Export Center (Span 1) */}
      <div id="exports-tab" className="bg-[#0F172A] rounded-2xl border border-slate-800 p-5 text-slate-200 flex flex-col justify-between scroll-mt-20 shadow-sm shadow-slate-900/10">
        <div className="space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold font-semibold">10</span>
            <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
              Export Center <span className="text-[10px] bg-indigo-950/40 text-indigo-300 font-mono font-bold px-1 rounded">active</span>
            </h3>
          </div>

          {/* Checklist checkboxes */}
          <div className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Select Deliverables</div>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeSummary} 
                onChange={(e) => setIncludeSummary(e.target.checked)}
                className="accent-indigo-505"
              />
              <span className="font-medium">Executive Summary</span>
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeDetailed} 
                onChange={(e) => setIncludeDetailed(e.target.checked)}
                className="accent-indigo-505"
              />
              <span className="font-medium">Detailed Comparison</span>
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={includeAudit} 
                onChange={(e) => setIncludeAudit(e.target.checked)}
                className="accent-indigo-505"
              />
              <span className="font-medium">Audit Trail Logs</span>
            </label>
          </div>

          {/* Formats picker */}
          <div className="space-y-2 border-t border-slate-800 pt-2.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Format Selection</div>
            <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
              {['pdf', 'excel', 'csv', 'json'].map((fmt) => (
                <button
                  key={fmt}
                  id={`export-format-btn-${fmt}`}
                  type="button"
                  onClick={() => {
                    setSelectedFormat(fmt as any);
                    setExportedFile(null);
                  }}
                  className={`py-1 rounded cursor-pointer uppercase transition-colors
                    ${selectedFormat === fmt ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate actions */}
        <div className="pt-3.5 space-y-2">
          {exportedFile && (
            <div className="p-2 border border-indigo-500/30 bg-indigo-500/10 rounded-lg text-left text-[11px] leading-tight text-indigo-300">
              <span className="block font-bold">Ready for download:</span>
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()} 
                className="underline hover:text-white truncate font-mono block mt-0.5"
                title="Click to fetch"
              >
                {exportedFile}
              </a>
            </div>
          )}

          <button
            id="generate-report-btn"
            onClick={handleGenerateReport}
            disabled={exporting || (!includeSummary && !includeDetailed && !includeAudit)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-805 text-white py-2.5 rounded-xl cursor-pointer text-xs font-semibold tracking-tight transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            {exporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compiling Files...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Generate Report
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
