/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  XOctagon, 
  Trash2, 
  Check, 
  HelpCircle,
  FileSearch,
  UserCheck,
  Award,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import { ForensicStep, DiscrepancyItem } from '../types';

interface InvestigateForensicsProps {
  selectedSku: string;
  discrepancies: DiscrepancyItem[];
  forensicChecklist: Record<string, ForensicStep[]>;
  onPatchSku: (sku: string) => void;
  onIgnoreSku: (sku: string) => void;
}

export default function InvestigateForensics({
  selectedSku,
  discrepancies,
  forensicChecklist,
  onPatchSku,
  onIgnoreSku
}: InvestigateForensicsProps) {
  const currentDiscrepancy = discrepancies.find(item => item.sku === selectedSku) || discrepancies[2]; // fallback to Rail Kit
  const steps = forensicChecklist[selectedSku] || forensicChecklist['PS0775-B21'];

  const [hasPatched, setHasPatched] = useState(false);
  const [hasIgnored, setHasIgnored] = useState(false);

  const handleAddAction = () => {
    setHasPatched(true);
    setTimeout(() => {
      onPatchSku(currentDiscrepancy.sku);
    }, 800);
  };

  const handleIgnoreAction = () => {
    setHasIgnored(true);
    setTimeout(() => {
      onIgnoreSku(currentDiscrepancy.sku);
    }, 800);
  };

  const isRailKit = currentDiscrepancy.sku === 'PS0775-B21';

  return (
    <section id="investigate" className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm scroll-mt-20">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">5</span>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Investigate</h2>
          <span className="text-xs text-slate-400 font-medium">Forensic Evidence & Root Cause ANALYSIS</span>
        </div>

        {/* Path breadcrumbs indicators */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span>Solution</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600">UCID-A: DL380 Gen12</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Storage Config</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded font-bold">{currentDiscrepancy.sku}</span>
        </div>
      </div>

      {hasPatched && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3.5 rounded-lg flex items-center gap-2.5 my-3.5 animate-pulse">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span><strong>RECONCILIATION APPLIED:</strong> Sku {currentDiscrepancy.sku} patched in BOM workspace memory. Slicing ratios recalculated.</span>
        </div>
      )}

      {hasIgnored && (
        <div className="bg-slate-50 border border-slate-200 text-slate-700 text-xs px-4 py-3.5 rounded-lg flex items-center gap-2.5 my-3.5">
          <Check className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span><strong>EXCEPTION RECORDED:</strong> Sku {currentDiscrepancy.sku} dismissed with low margin impact logic. Slicing ratios recalculated.</span>
        </div>
      )}

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
        
        {/* Step 1: Forensics Slicing Pipeline (Left Column, Span 4) */}
        <div className="lg:col-span-4 border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audit Slicing Pipeline</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block bg-blue-50 px-1.5 py-0.2 rounded font-mono">OK</span>
          </div>

          <div className="space-y-3">
            {steps.map((s, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all text-xs
                  ${s.status === 'Matched' 
                    ? 'bg-emerald-50/20 border-emerald-100' 
                    : s.status === 'Diff' 
                      ? 'bg-amber-50/30 border-amber-200/60'
                      : 'bg-rose-50/20 border-rose-100'}`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5
                  ${s.status === 'Matched' 
                    ? 'bg-emerald-500 text-white' 
                    : s.status === 'Diff' 
                      ? 'bg-amber-500 text-white'
                      : 'bg-rose-500 text-white'}`}>
                  {s.stepNumber}
                </div>
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{s.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Aligned</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Compare parameters BOQ vs BOM Target (Middle Column, Span 4) */}
        <div className="lg:col-span-4 grid grid-rows-2 gap-4">
          
          {/* BOQ parameters */}
          <div className="border border-slate-200/80 rounded-xl p-4 bg-white space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">BOQ source properties</span>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-xs leading-none">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">SKU</span>
                <span className="font-mono font-bold text-slate-800">{currentDiscrepancy.sku}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Catalog Category</span>
                <span className="font-semibold text-slate-700">{currentDiscrepancy.category}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Asset Description</span>
                <span className="font-medium text-slate-600 leading-normal line-clamp-2 block">{currentDiscrepancy.description}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Declared BOQ Qty</span>
                <span className="font-bold text-slate-800 text-sm font-mono">{currentDiscrepancy.boqQty}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Source Sheet Path</span>
                <span className="text-slate-500 font-semibold font-mono text-[10px] leading-relaxed truncate block">Enterprise_Boq.xlsx [Row: 2546]</span>
              </div>
            </div>
          </div>

          {/* BOM target parameters (Not Found / Difference details) */}
          <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">BOM catalog target</span>
            
            {currentDiscrepancy.status === 'Missing' ? (
              <div id="target-notfound-state" className="flex flex-col items-center justify-center text-center py-4 space-y-2">
                <div className="p-3 bg-red-50 text-red-500 rounded-full animate-pulse shadow-sm">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Part Not Found</h4>
                  <p className="text-[10px] text-slate-500 italic mt-0.5 max-w-[200px]">This required SKU is completely missing in the portal sourced BOM logs.</p>
                </div>
              </div>
            ) : currentDiscrepancy.status === 'Qty Diff' ? (
              <div id="target-mismatch-state" className="space-y-2 text-xs">
                <div className="flex items-center gap-2 bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200/70 text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span><strong>Deviation Detected:</strong> Sourced {currentDiscrepancy.bomQty} instead of expected {currentDiscrepancy.boqQty}.</span>
                </div>
                <div className="grid grid-cols-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Active BOM Qty</span>
                    <span className="text-base font-black font-mono text-slate-800">{currentDiscrepancy.bomQty}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Target BOM File</span>
                    <span className="text-xs font-mono text-slate-500 truncate block mt-0.5">HPE_Portal_BOM.xlsx</span>
                  </div>
                </div>
              </div>
            ) : (
              <div id="target-matched-state" className="space-y-2 text-xs text-center py-4">
                <div className="inline-flex p-2 bg-emerald-50 text-emerald-600 rounded-full">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-800">Perfect Reconciliation Match</h4>
                <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">Quantities aligned seamlessly (Qty: {currentDiscrepancy.boqQty}). Core compliance verified.</p>
              </div>
            )}
          </div>

        </div>

        {/* Step 3: AI Explanation, actions, quick forensic triggers (Right Column, Span 4) */}
        <div className="lg:col-span-4 border border-slate-200/80 rounded-xl p-4 bg-white flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* AI Explanation Card */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Technical Insight</span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {isRailKit 
                  ? 'This rail kit is required for the DL380 Gen12 chassis based on HPE compatibility rules. Since the automation script timed out on Ingram portal, this SKU was completely omitted from the final BOM.' 
                  : `SKU ${currentDiscrepancy.sku} shows a discrepancy in the sourcing file because the portal configurator defaulted to the base multiplier template, missing the custom volume specification overrides.`
                }
              </p>
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 border-t border-slate-200/50 pt-2.5 mt-2">
                <span>Impact Class: <strong className="text-red-500">HIGH IMPEDANCE</strong></span>
                <span>AI Confidence: <strong className="text-emerald-600 font-mono">99%</strong></span>
              </div>
            </div>

            {/* Practical Actions */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Recommended Action</span>
              <p className="text-xs text-slate-600">
                {isRailKit 
                  ? 'Add PS0775-B21 (Qty: 2) to BOM, or verify alternate modular rail bracket configurations.' 
                  : `Accept expected baseline BOQ count ${currentDiscrepancy.boqQty} as authoritative and patch BOM.`
                }
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  id="action-add-to-bom"
                  onClick={handleAddAction}
                  disabled={hasPatched || hasIgnored || currentDiscrepancy.status === 'Matched'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 cursor-pointer text-xs font-bold font-semibold tracking-tight transition disabled:opacity-50"
                >
                  {hasPatched ? 'Patched ✓' : 'Add to BOM'}
                </button>
                <button 
                  id="action-mark-exception"
                  onClick={handleIgnoreAction}
                  disabled={hasPatched || hasIgnored || currentDiscrepancy.status === 'Matched'}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border rounded-xl py-2 cursor-pointer text-xs font-semibold tracking-tight transition disabled:opacity-50"
                >
                  {hasIgnored ? 'Ignored' : 'Mark Exception'}
                </button>
              </div>
            </div>

          </div>

          {/* Underneath quick forensic triggers link row */}
          <div className="grid grid-cols-5 text-center gap-1 border-t border-slate-100 pt-3.5 mt-4 text-[9px] font-bold text-slate-500">
            
            <button 
              id="forensic-trigger-auto"
              onClick={handleAddAction}
              className="flex flex-col items-center gap-1 hover:text-blue-600 transition cursor-pointer"
            >
              <FileSearch className="w-4.5 h-4.5 text-blue-500" />
              <span>Fix Auto</span>
            </button>

            <button 
              id="forensic-trigger-manual"
              className="flex flex-col items-center gap-1 hover:text-blue-600 transition cursor-pointer"
            >
              <UserCheck className="w-4.5 h-4.5 text-amber-500" />
              <span>Ask Help</span>
            </button>

            <button 
              id="forensic-trigger-promote"
              className="flex flex-col items-center gap-1 hover:text-blue-600 transition cursor-pointer"
            >
              <Award className="w-4.5 h-4.5 text-emerald-500" />
              <span>Promote</span>
            </button>

            <button 
              id="forensic-trigger-learn"
              className="flex flex-col items-center gap-1 hover:text-blue-600 transition cursor-pointer"
            >
              <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
              <span>Explain</span>
            </button>

            <button 
              id="forensic-trigger-replay"
              className="flex flex-col items-center gap-1 hover:text-blue-600 transition cursor-pointer"
            >
              <RotateCcw className="w-4.5 h-4.5 text-slate-400" />
              <span>Replay</span>
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}
