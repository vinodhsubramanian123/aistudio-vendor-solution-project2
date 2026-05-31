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
  isDarkMode?: boolean;
}

export default function CompareOverview({
  discrepancies,
  ucidConfigs,
  selectedSku,
  setSelectedSku,
  onAutoHealSku,
  isDarkMode = true
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
    { label: 'Others', pct: 14, color: 'stroke-slate-405', fillBg: 'bg-slate-400', count: 86 }
  ];

  // Map out angles for SVG arcs
  let currentOffset = 0;

  return (
    <section id="compare" className={`rounded-2xl border p-5 shadow-sm scroll-mt-20 transition-all duration-300
      ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-indigo-100/30'}`}>
      
      {/* Header bar top */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between pb-4 border-b gap-4
        ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">4</span>
          <h2 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Compare Overview</h2>
          <span className="text-xs text-slate-400 font-medium font-semibold">Reconciling files across 3 UCID Sandboxes</span>
        </div>

        {/* View toggle tabs */}
        <div className={`flex p-1 rounded-lg text-xs gap-1 self-start ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-100'}`}>
          <button 
            id="btn-view-config"
            onClick={() => setActiveView('config')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer
              ${activeView === 'config' 
                ? (isDarkMode ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-600 shadow-sm') 
                : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800')}`}
          >
            Config View
          </button>
          <button 
            id="btn-view-ucid"
            onClick={() => setActiveView('ucid')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer
              ${activeView === 'ucid' 
                ? (isDarkMode ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-600 shadow-sm') 
                : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800')}`}
          >
            UCID View
          </button>
          <button 
            id="btn-view-solution"
            onClick={() => setActiveView('solution')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer
              ${activeView === 'solution' 
                ? (isDarkMode ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-600 shadow-sm') 
                : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800')}`}
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
              ${activeFilter === 'all' 
                ? (isDarkMode ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-white') 
                : (isDarkMode ? 'bg-[#0F1117] text-slate-400 hover:bg-slate-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100')}`}
          >
            All <span className="ml-1 opacity-60 font-mono">({counts.all + 4820})</span>
          </button>

          <button 
            id="filter-matched"
            onClick={() => setActiveFilter('Matched')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer
              ${activeFilter === 'Matched' 
                ? 'bg-emerald-600 text-white shadow' 
                : (isDarkMode ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/35 hover:bg-emerald-900/30' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70')}`}
          >
            Matched <span className="ml-1 opacity-60 font-mono">({counts.matched + 4208})</span>
          </button>

          <button 
            id="filter-qtydiff"
            onClick={() => setActiveFilter('Qty Diff')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer
              ${activeFilter === 'Qty Diff' 
                ? 'bg-amber-500 text-white shadow' 
                : (isDarkMode ? 'bg-amber-950/20 text-amber-500 border border-amber-900/35 hover:bg-amber-900/30' : 'bg-amber-50 text-amber-800 hover:bg-amber-100/70')}`}
          >
            Qty Diff <span className="ml-1 opacity-60 font-mono">({counts.qtyDiff + 135})</span>
          </button>

          <button 
            id="filter-missing"
            onClick={() => setActiveFilter('Missing')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer
              ${activeFilter === 'Missing' 
                ? 'bg-rose-500 text-white shadow' 
                : (isDarkMode ? 'bg-rose-950/25 text-rose-400 border border-rose-900/35 hover:bg-rose-900/30' : 'bg-rose-50 text-rose-800 hover:bg-rose-100/60')}`}
          >
            Missing <span className="ml-1 opacity-60 font-mono">({counts.missing + 65})</span>
          </button>

          <button 
            id="filter-extra"
            onClick={() => setActiveFilter('Extra')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer
              ${activeFilter === 'Extra' 
                ? 'bg-indigo-650 text-white shadow' 
                : (isDarkMode ? 'bg-indigo-950/25 text-indigo-400 border border-indigo-900/35 hover:bg-indigo-900/30' : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100/60')}`}
          >
            Extra <span className="ml-1 opacity-60 font-mono">({counts.extra + 408})</span>
          </button>

          <button 
            id="filter-aireview"
            onClick={() => setActiveFilter('AI Review')}
            className={`px-3 py-2 rounded-lg font-semibold border transition-all cursor-pointer flex items-center gap-1
              ${activeFilter === 'AI Review' 
                ? 'bg-red-500 text-white border-red-400 shadow' 
                : (isDarkMode ? 'bg-red-950/25 text-red-400 border-red-900/40 hover:bg-red-900/30' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100/75')}`}
          >
            AI Review <span className="font-bold text-[10px] bg-red-650 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono">28</span>
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
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium transition-all
              ${isDarkMode ? 'bg-[#0F1117] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
          />
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left column: Hierarchy View (Span 3) */}
        <div className={`lg:col-span-3 border rounded-2xl p-4 transition-colors duration-300 space-y-4
          ${isDarkMode ? 'bg-[#151821] border-slate-800/80 shadow-inner' : 'bg-slate-50/50 border-slate-200/80'}`}>
          <div className="flex items-center justify-between pb-1 ">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hierarchy View</span>
            <span className={`text-[10px] font-semibold cursor-pointer ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>By Config</span>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* UCID-A Node */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className={`truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>UCID-A: DL380 Gen12</span>
                <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">3 configs • 1,381 pts</span>
              </div>
              <div className="pl-2 space-y-1.5">
                <div className={`flex items-center justify-between p-1.5 rounded transition
                  ${isDarkMode ? 'hover:bg-[#1A1D27] hover:shadow-slate-950/20' : 'hover:bg-white hover:shadow-xs'}`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>1. Base Server Config</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold
                    ${isDarkMode ? 'bg-emerald-950/50 text-emerald-450 border border-emerald-900/30' : 'bg-emerald-50 text-emerald-700'}`}>Matched</span>
                </div>
                <div className={`flex items-center justify-between p-1.5 rounded transition
                  ${isDarkMode ? 'bg-amber-950/20 font-bold' : 'bg-amber-50/50'}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span className={isDarkMode ? 'text-white' : 'text-slate-800'}>2. Storage Config</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold
                    ${isDarkMode ? 'bg-amber-950/50 text-amber-500 border border-amber-900/40' : 'bg-amber-50 text-amber-700'}`}>Diff</span>
                </div>
                <div className={`flex items-center justify-between p-1.5 rounded transition
                  ${isDarkMode ? 'hover:bg-[#1A1D27]' : 'hover:bg-white hover:shadow-xs'}`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className={isDarkMode ? 'text-slate-400 font-medium' : 'text-slate-600'}>3. Networking Config</span>
                  </div>
                  <span className={`text-[9px] px-1 rounded font-medium ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>Pending</span>
                </div>
              </div>
            </div>

            {/* UCID-B Node */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className={`truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>UCID-B: DL380 Gen12</span>
                <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">2 configs • 600 pts</span>
              </div>
              <div className="pl-2 space-y-1.5">
                <div className={`flex items-center justify-between p-1.5 rounded transition
                  ${isDarkMode ? 'hover:bg-[#1A1D27] hover:shadow-slate-950/20' : 'hover:bg-white hover:shadow-xs'}`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>1. Compute Config</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold
                    ${isDarkMode ? 'bg-emerald-950/50 text-emerald-450 border border-emerald-900/30' : 'bg-emerald-50 text-emerald-700'}`}>Matched</span>
                </div>
                <div className={`flex items-center justify-between p-1.5 rounded transition
                  ${isDarkMode ? 'hover:bg-[#1A1D27]' : 'hover:bg-white hover:shadow-xs'}`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className={isDarkMode ? 'text-slate-400 font-medium' : 'text-slate-600'}>2. GPU Config</span>
                  </div>
                  <span className={`text-[9px] px-1 rounded font-medium ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>Pending</span>
                </div>
              </div>
            </div>

            {/* UCID-C Node */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className={`truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>UCID-C: Apollo 6500</span>
                <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">1 config • 348 pts</span>
              </div>
              <div className="pl-2">
                <div className={`flex items-center justify-between p-1.5 rounded transition
                  ${isDarkMode ? 'hover:bg-[#1A1D27]' : 'hover:bg-white'}`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className={isDarkMode ? 'text-slate-400 font-medium' : 'text-slate-500'}>1. Solution Config</span>
                  </div>
                  <span className={`text-[9px] px-1 rounded font-medium ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>Pending</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Center column: Discrepancy table list (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`overflow-x-auto border rounded-xl transition-all duration-300
            ${isDarkMode ? 'bg-[#151821] border-slate-800/80' : 'bg-white border-slate-200/80 shadow-xs'}`}>
            <table id="discrepancy-parts-table" className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b text-[10px] uppercase font-bold tracking-wider
                  ${isDarkMode ? 'bg-slate-950/50 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200/80'}`}>
                  <th className="p-3">Part/Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">BOQ Qty</th>
                  <th className="p-3 text-center">BOM Qty</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">AI Insight</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
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
                        className={`hover:bg-indigo-50/10 cursor-pointer transition relative group
                          ${isSelected 
                            ? (isDarkMode ? 'bg-indigo-950/20 ring-1 ring-indigo-900/40' : 'bg-indigo-50/40 ring-1 ring-indigo-100') 
                            : ''}`}
                      >
                        {/* Selector indicator */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
                        )}

                        <td className="p-3">
                          <div className="max-w-[200px] sm:max-w-[280px]">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold font-mono tracking-tight text-xs transition-colors
                                ${isDarkMode 
                                  ? 'text-white group-hover:text-indigo-400' 
                                  : 'text-slate-800 group-hover:text-indigo-600'}`}>
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

                        <td className={`p-3 whitespace-nowrap font-medium ${isDarkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                          {item.category}
                        </td>

                        <td className={`p-3 text-center font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          {item.boqQty}
                        </td>

                        <td className={`p-3 text-center font-bold font-mono ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          {item.bomQty}
                        </td>

                        <td className="p-3 text-center whitespace-nowrap">
                          {item.status === 'Matched' ? (
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold
                              ${isDarkMode ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-900/40' : 'bg-emerald-50 text-emerald-700'}`}>
                              ✓ Matched
                            </span>
                          ) : item.status === 'Qty Diff' ? (
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold
                              ${isDarkMode ? 'bg-amber-950/45 text-amber-500 border border-amber-900/40' : 'bg-amber-50 text-amber-700'}`}>
                              ⚠️ Qty Diff
                            </span>
                          ) : item.status === 'Missing' ? (
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold
                              ${isDarkMode ? 'bg-rose-950/45 text-rose-400 border border-rose-900/40' : 'bg-rose-50 text-rose-700'}`}>
                              ✕ Missing
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold
                              ${isDarkMode ? 'bg-indigo-950/45 text-indigo-400 border border-indigo-900/40' : 'bg-indigo-50 text-indigo-705'}`}>
                              + Extra
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <div className={`text-[11px] font-medium max-w-[130px] truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} title={item.insight}>
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
          <div className="flex items-center justify-between text-xs text-slate-505 pt-1">
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Showing 1 to {filteredDiscrepancies.length} of {(filteredDiscrepancies.length + 4820).toLocaleString()} parts</span>
            
            <div className="flex gap-1 font-mono">
              <button className={`px-2 py-1 rounded border text-[11px] disabled:opacity-50 transition
                ${isDarkMode ? 'bg-[#151821] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100'}`} disabled>&lt;</button>
              <button className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[11px] font-bold shadow-sm">1</button>
              <button className={`px-2.5 py-1 rounded border text-[11px] transition
                ${isDarkMode ? 'bg-[#151821] border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-600'}`}>2</button>
              <button className={`px-2.5 py-1 rounded border text-[11px] transition
                ${isDarkMode ? 'bg-[#151821] border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-600'}`}>3</button>
              <span className={`px-1.5 py-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>...</span>
              <button className={`px-2 py-1 rounded border text-[11px] transition
                ${isDarkMode ? 'bg-[#151821] border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-600'}`}>966</button>
              <button className={`px-2 py-1 rounded border text-[11px] transition
                ${isDarkMode ? 'bg-[#151821] border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-600'}`}>&gt;</button>
            </div>
          </div>
        </div>

        {/* Right column: Differences Category Donut Chart (Span 3) */}
        <div className={`lg:col-span-3 border rounded-2xl p-4 flex flex-col justify-between text-center relative hover:shadow-xs transition-all duration-300
          ${isDarkMode ? 'bg-[#151821] border-slate-800/80' : 'bg-white border-slate-200/80'}`}>
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
                className={isDarkMode ? 'stroke-slate-800/90' : 'stroke-slate-50'}
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
              <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>615</span>
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
                  ${hoveredSlice === cat.label 
                    ? (isDarkMode ? 'bg-[#1A1D27] font-bold text-white' : 'bg-slate-100 font-bold text-slate-900') 
                    : (isDarkMode ? 'text-slate-350 hover:text-white' : 'text-slate-600')}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${cat.fillBg}`} />
                  <span className="text-[11px] font-medium">{cat.label}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-slate-400">({cat.count})</span>
                  <span className={`font-bold select-all ${isDarkMode ? 'text-slate-200' : 'text-slate-705'}`}>{cat.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            id="view-full-breakdown-btn"
            onClick={() => setShowCategoryBreakdownModal(true)}
            className={`w-full py-2 rounded-xl text-xs font-bold tracking-tight mt-4 transition cursor-pointer border
              ${isDarkMode 
                ? 'bg-[#0F1117] hover:bg-[#1A1D27] text-slate-300 border-slate-800' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-707 border-slate-200'}`}
          >
            View full breakdown
          </button>
        </div>

      </div>

      {/* Category Breakdown Overlay modal */}
      {showCategoryBreakdownModal && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className={`rounded-2xl max-w-md w-full border p-6 space-y-4 shadow-2xl transition-all duration-300
            ${isDarkMode ? 'bg-[#1A1D27] border-slate-800 text-white shadow-slate-950/50' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="font-extrabold text-lg">Detailed Differences Breakdown</h3>
            <p className="text-xs text-slate-400">Full audit classifications of mismatched inventory models sourcing pipelines</p>
            
            <div className="space-y-3.5 pt-2">
              {[
                { label: 'Storage', count: 258, reason: 'Mainly due to SATA vs NVMe speed variance omissions on Ingram portal.' },
                { label: 'Network', count: 86, reason: 'RJ45 connectivity components classified under auxiliary headers.' },
                { label: 'Processor', count: 111, reason: 'Standard core count multiplier mismatch on sub-configs.' },
                { label: 'Memory', count: 74, reason: 'Unregistered RAM modules flagged directly by schema rules.' },
                { label: 'Others', count: 86, reason: 'Power cords, rack rail kits, brackets lack accurate serial codes.' }
              ].map((item, id) => (
                <div key={id} className="text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{item.label} ({item.count} units)</span>
                    <span className={`font-mono ${isDarkMode ? 'text-indigo-400' : 'text-indigo-650'}`}>{((item.count/615)*100).toFixed(1)}%</span>
                  </div>
                  <p className={`italic text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.reason}</p>
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
