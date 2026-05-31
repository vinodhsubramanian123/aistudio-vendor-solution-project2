/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  LayoutGrid, 
  Layers, 
  ChevronRight, 
  HelpCircle,
  Eye
} from 'lucide-react';
import { DiscrepancyItem, UCIDConfig } from '../types';

interface CompareOverviewProps {
  discrepancies: DiscrepancyItem[];
  ucidConfigs: UCIDConfig[];
  selectedSku: string;
  setSelectedSku: (sku: string) => void;
  onAutoHealSku?: (sku: string) => void;
}

export default function CompareOverview({
  discrepancies,
  ucidConfigs,
  selectedSku,
  setSelectedSku,
  onAutoHealSku
}: CompareOverviewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'Matched' | 'Qty Diff' | 'Missing' | 'Extra' | 'AI Review'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'solution' | 'ucid' | 'config'>('solution');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [showCategoryBreakdownModal, setShowCategoryBreakdownModal] = useState(false);

  // Filter and search discrepancies
  const filteredDiscrepancies = discrepancies.filter(item => {
    // 1. apply tab filters
    if (activeFilter === 'Matched' && item.status !== 'Matched') return false;
    if (activeFilter === 'Qty Diff' && item.status !== 'Qty Diff') return false;
    if (activeFilter === 'Missing' && item.status !== 'Missing') return false;
    if (activeFilter === 'Extra' && item.status !== 'Extra') return false;
    if (activeFilter === 'AI Review' && !['Missing', 'Qty Diff'].includes(item.status)) return false;

    // 2. apply search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.sku.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate status counts for filter buttons
  const counts = {
    all: discrepancies.length,
    matched: discrepancies.filter(i => i.status === 'Matched').length,
    qtyDiff: discrepancies.filter(i => i.status === 'Qty Diff').length,
    missing: discrepancies.filter(i => i.status === 'Missing').length,
    extra: discrepancies.filter(i => i.status === 'Extra').length,
    aiReview: discrepancies.filter(i => ['Missing', 'Qty Diff'].includes(i.status)).length
  };

  // SVGs parameters for Donut Chart (615 differences)
  // Categories: Storage (42%), Network (14%), Processor (18%), Memory (12%), Others (14%)
  const categories = [
    { label: 'Storage', pct: 42, color: 'stroke-indigo-650', fillBg: 'bg-indigo-650', count: 258 },
    { label: 'Network', pct: 14, color: 'stroke-indigo-400', fillBg: 'bg-indigo-400', count: 86 },
    { label: 'Processor', pct: 18, color: 'stroke-teal-500', fillBg: 'bg-teal-500', count: 111 },
    { label: 'Memory', pct: 12, color: 'stroke-amber-500', fillBg: 'bg-amber-500', count: 74 },
    { label: 'Others', pct: 14, color: 'stroke-slate-400', fillBg: 'bg-slate-400', count: 86 }
  ];

  // Map out angles for SVG arcs
  let currentOffset = 0;

  return (
    <section id="compare" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm shadow-indigo-100/30 scroll-mt-20">
      
      {/* Header bar top */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">4</span>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Compare Overview</h2>
          <span className="text-xs text-slate-400 font-medium font-semibold">Reconciling files across 3 UCID Sandboxes</span>
        </div>

        {/* View toggle tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg text-xs gap-1 self-start">
          <button 
            id="btn-view-config"
            onClick={() => setActiveView('config')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer
              ${activeView === 'config' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Config View
          </button>
          <button 
            id="btn-view-ucid"
            onClick={() => setActiveView('ucid')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer
              ${activeView === 'ucid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            UCID View
          </button>
          <button 
            id="btn-view-solution"
            onClick={() => setActiveView('solution')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer
              ${activeView === 'solution' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Solution (All)
          </button>
        </div>
      </div>

      {/* Filter and Search Bar row */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 justify-between pt-4 pb-2.5">
        
        {/* Filters pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          
          <button 
            id="filter-all"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer
              ${activeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            All <span className="ml-1 opacity-60 font-mono">({counts.all + 4820})</span>
          </button>

          <button 
            id="filter-matched"
            onClick={() => setActiveFilter('Matched')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer
              ${activeFilter === 'Matched' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70'}`}
          >
            Matched <span className="ml-1 opacity-60 font-mono">({counts.matched + 4208})</span>
          </button>

          <button 
            id="filter-qtydiff"
            onClick={() => setActiveFilter('Qty Diff')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer
              ${activeFilter === 'Qty Diff' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100/70'}`}
          >
            Qty Diff <span className="ml-1 opacity-60 font-mono">({counts.qtyDiff + 135})</span>
          </button>

          <button 
            id="filter-missing"
            onClick={() => setActiveFilter('Missing')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer
              ${activeFilter === 'Missing' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100/60'}`}
          >
            Missing <span className="ml-1 opacity-60 font-mono">({counts.missing + 65})</span>
          </button>

          <button 
            id="filter-extra"
            onClick={() => setActiveFilter('Extra')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer
              ${activeFilter === 'Extra' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100/60'}`}
          >
            Extra <span className="ml-1 opacity-60 font-mono">({counts.extra + 408})</span>
          </button>

          <button 
            id="filter-aireview"
            onClick={() => setActiveFilter('AI Review')}
            className={`px-3 py-2 rounded-lg font-semibold border border-red-200 transition-all cursor-pointer flex items-center gap-1
              ${activeFilter === 'AI Review' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100/75'}`}
          >
            AI Review <span className="font-bold text-[10px] bg-red-600 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono">28</span>
          </button>

        </div>

        {/* Configurations Search input */}
        <div className="relative xl:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text"
            id="compare-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search part, sku, or description..."
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left column: Hierarchy View (Span 3) */}
        <div className="lg:col-span-3 border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between pb-1 ">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hierarchy View</span>
            <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">By Config</span>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* UCID-A Node */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="truncate">UCID-A: DL380 Gen12</span>
                <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">3 configs • 1,381 pts</span>
              </div>
              <div className="pl-2 space-y-1.5">
                <div className="flex items-center justify-between p-1.5 rounded hover:bg-white hover:shadow-xs transition">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-slate-600 font-semibold">1. Base Server Config</span>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded">Matched</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-amber-50/50 hover:bg-white transition">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-slate-800 font-bold">2. Storage Config</span>
                  </div>
                  <span className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.2 rounded">Diff</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded hover:bg-white hover:shadow-xs transition">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600">3. Networking Config</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium bg-slate-100 px-1 rounded">Pending</span>
                </div>
              </div>
            </div>

            {/* UCID-B Node */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="truncate">UCID-B: DL380 Gen12</span>
                <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">2 configs • 600 pts</span>
              </div>
              <div className="pl-2 space-y-1.5">
                <div className="flex items-center justify-between p-1.5 rounded hover:bg-white hover:shadow-xs transition">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-slate-600 font-semibold">1. Compute Config</span>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded">Matched</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded hover:bg-white hover:shadow-xs transition">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600">2. GPU Config</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium bg-slate-100 px-1 rounded">Pending</span>
                </div>
              </div>
            </div>

            {/* UCID-C Node */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="truncate">UCID-C: Apollo 6500</span>
                <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">1 config • 348 pts</span>
              </div>
              <div className="pl-2">
                <div className="flex items-center justify-between p-1.5 rounded hover:bg-white hover:shadow-xs transition">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500">1. Solution Config</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium bg-slate-100 px-1 rounded">Pending</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Center column: Discrepancy table list (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="overflow-x-auto border border-slate-200/80 rounded-xl bg-white shadow-xs">
            <table id="discrepancy-parts-table" className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Part/Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">BOQ Qty</th>
                  <th className="p-3 text-center">BOM Qty</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">AI Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDiscrepancies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-400 italic">
                      Zero matching records found based on active filters and inquiry coordinates.
                    </td>
                  </tr>
                ) : (
                  filteredDiscrepancies.map((item) => {
                    const isSelected = selectedSku === item.sku;
                    return (
                      <tr 
                        key={item.id}
                        id={`compare-row-sku-${item.sku}`}
                        onClick={() => setSelectedSku(item.sku)}
                        className={`hover:bg-indigo-50/20 cursor-pointer transition relative group
                          ${isSelected ? 'bg-indigo-50/40 ring-1 ring-indigo-100' : ''}`}
                      >
                        {/* Selector indicator */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                        )}

                        <td className="p-3">
                          <div className="max-w-[200px] sm:max-w-[280px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 font-mono tracking-tight text-xs group-hover:text-indigo-600 transition-colors">
                                {item.sku}
                              </span>
                              {isSelected && (
                                <span className="bg-indigo-600 text-white text-[8px] font-bold px-1 rounded">INSID</span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate mt-0.5" title={item.description}>
                              {item.description}
                            </div>
                          </div>
                        </td>

                        <td className="p-3 text-slate-600 whitespace-nowrap font-medium">
                          {item.category}
                        </td>

                        <td className="p-3 text-center font-bold font-mono text-slate-700">
                          {item.boqQty}
                        </td>

                        <td className="p-3 text-center font-bold font-mono text-slate-700">
                          {item.bomQty}
                        </td>

                        <td className="p-3 text-center whitespace-nowrap">
                          {item.status === 'Matched' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold font-semibold">
                              ✓ Matched
                            </span>
                          ) : item.status === 'Qty Diff' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold font-semibold">
                              ⚠️ Qty Diff
                            </span>
                          ) : item.status === 'Missing' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold font-semibold">
                              ✕ Missing
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-705 px-2 py-0.5 rounded-full font-bold font-semibold">
                              + Extra
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <div className="text-[11px] font-medium text-slate-600 max-w-[130px] truncate" title={item.insight}>
                            {item.insight}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Showing 1 to {filteredDiscrepancies.length} of {(filteredDiscrepancies.length + 4820).toLocaleString()} parts</span>
            
            <div className="flex gap-1 font-mono">
              <button className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 text-[11px] disabled:opacity-50" disabled>&lt;</button>
              <button className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[11px] font-bold shadow-sm">1</button>
              <button className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 text-[11px]">2</button>
              <button className="px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 text-[11px]">3</button>
              <span className="px-1.5 py-1">...</span>
              <button className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 text-[11px]">966</button>
              <button className="px-2 py-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 text-[11px]">&gt;</button>
            </div>
          </div>
        </div>

        {/* Right column: Differences Category Donut Chart (Span 3) */}
        <div className="lg:col-span-3 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between text-center relative hover:shadow-xs transition">
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Differences by Category</span>
            <p className="text-[10px] text-slate-500 mt-0.5">Discrepancies spread split</p>
          </div>

          {/* Slices representation circle */}
          <div id="donut-breakdown-panel" className="relative my-4 flex justify-center">
            <svg id="differences-donut-svg" className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="50"
                className="stroke-slate-50"
                strokeWidth="15"
                fill="transparent"
              />
              {/* Loop and render category wedges using precise math offsets */}
              {categories.map((cat, idx) => {
                const strokeDashValue = (cat.pct / 100) * 314; // circumference for dev 2 * PI * r = 314 approx
                const strokeOffset = 314 - strokeDashValue;
                const prevOffset = currentOffset;
                currentOffset += strokeDashValue;

                return (
                  <circle
                    key={idx}
                    cx="72"
                    cy="72"
                    r="50"
                    className={`${cat.color} transition-all duration-300 hover:stroke-size cursor-pointer`}
                    strokeWidth={hoveredSlice === cat.label ? '20' : '15'}
                    fill="transparent"
                    strokeDasharray="314"
                    strokeDashoffset={314 - strokeDashValue}
                    transform={`rotate(${prevOffset * (360 / 314)} 72 72)`}
                    onMouseEnter={() => setHoveredSlice(cat.label)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl font-black text-slate-800">615</span>
              <span className="text-[8px] font-bold text-rose-500 tracking-wider uppercase mt-0.5">Total Diffs</span>
            </div>
          </div>

          {/* Interactive Legend with highlights */}
          <div className="space-y-1.5 text-xs text-left pt-2">
            {categories.map((cat) => (
              <div 
                key={cat.label}
                onMouseEnter={() => setHoveredSlice(cat.label)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`flex items-center justify-between p-1 rounded-md transition
                  ${hoveredSlice === cat.label ? 'bg-slate-100 font-bold text-slate-900' : 'text-slate-600'}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${cat.fillBg}`} />
                  <span className="text-[11px] font-medium">{cat.label}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-slate-400">({cat.count})</span>
                  <span className="font-bold select-all">{cat.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            id="view-full-breakdown-btn"
            onClick={() => setShowCategoryBreakdownModal(true)}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 rounded-xl text-xs font-bold text-slate-700 tracking-tight mt-4 transition cursor-pointer"
          >
            View full breakdown
          </button>
        </div>

      </div>

      {/* Category Breakdown Overlay modal */}
      {showCategoryBreakdownModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-slate-900 text-lg">Detailed Differences Breakdown</h3>
            <p className="text-xs text-slate-500">Full audit classifications of mismatched inventory models sourcing pipelines</p>
            
            <div className="space-y-3.5 pt-2">
              {[
                { label: 'Storage', count: 258, reason: 'Mainly due to SATA vs NVMe speed variance omissions on Ingram portal.' },
                { label: 'Network', count: 86, reason: 'RJ45 connectivity components classified under auxiliary headers.' },
                { label: 'Processor', count: 111, reason: 'Standard core count multiplier mismatch on sub-configs.' },
                { label: 'Memory', count: 74, reason: 'Unregistered RAM modules flagged directly by schema rules.' },
                { label: 'Others', count: 86, reason: 'Power cords, rack rail kits, brackets lack accurate serial codes.' }
              ].map((item, id) => (
                <div key={id} className="text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{item.label} ({item.count} units)</span>
                    <span className="font-mono text-indigo-600">{((item.count/615)*100).toFixed(1)}%</span>
                  </div>
                  <p className="text-slate-500 italic text-[11px] leading-relaxed">{item.reason}</p>
                </div>
              ))}
            </div>

            <button 
              id="close-breakdown-modal-btn"
              onClick={() => setShowCategoryBreakdownModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold text-xs py-2.5 text-white rounded-xl cursor-pointer"
            >
              Back to Workspace
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
