/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  ArrowRightLeft, 
  HelpCircle, 
  AlertCircle,
  TrendingUp,
  Cpu, 
  CheckCircle2, 
  Play, 
  UploadCloud,
  ChevronDown,
  Info
} from 'lucide-react';
import { UCIDConfig } from '../types';

interface SolutionWorkspaceProps {
  ucidConfigs: UCIDConfig[];
  metrics: {
    totalParts: number;
    matched: number;
    qtyDiff: number;
    missing: number;
    extra: number;
    riskScore: string;
  };
  onUploadFile: (type: 'BOQ' | 'BOM', fileName: string, rowCount: number) => void;
}

export default function SolutionWorkspace({
  ucidConfigs,
  metrics,
  onUploadFile
}: SolutionWorkspaceProps) {
  const [dragActiveBoq, setDragActiveBoq] = useState(false);
  const [dragActiveBom, setDragActiveBom] = useState(false);
  const [boqFile, setBoqFile] = useState({ name: 'Enterprise_Boq.xlsx', rows: 4827, configs: 3 });
  const [bomFile, setBomFile] = useState({ name: 'HPE_Portal_BOM.xlsx', rows: 4212, configs: 3, progress: 60 });
  const [showConfidenceDetails, setShowConfidenceDetails] = useState(false);

  const boqInputRef = useRef<HTMLInputElement>(null);
  const bomInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, type: 'BOQ' | 'BOM') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      if (type === 'BOQ') setDragActiveBoq(true);
      else setDragActiveBom(true);
    } else if (e.type === "dragleave") {
      if (type === 'BOQ') setDragActiveBoq(false);
      else setDragActiveBom(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'BOQ' | 'BOM') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'BOQ') {
      setDragActiveBoq(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        const rows = Math.floor(Math.random() * 3000) + 1500;
        setBoqFile({ name: file.name, rows, configs: Math.floor(Math.random() * 3) + 1 });
        onUploadFile('BOQ', file.name, rows);
      }
    } else {
      setDragActiveBom(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        const rows = Math.floor(Math.random() * 3000) + 1500;
        setBomFile({ name: file.name, rows, configs: Math.floor(Math.random() * 3) + 1, progress: 100 });
        onUploadFile('BOM', file.name, rows);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'BOQ' | 'BOM') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const rows = Math.floor(Math.random() * 3000) + 1500;
      if (type === 'BOQ') {
        setBoqFile({ name: file.name, rows, configs: Math.floor(Math.random() * 3) + 1 });
        onUploadFile('BOQ', file.name, rows);
      } else {
        setBomFile({ name: file.name, rows, configs: Math.floor(Math.random() * 3) + 1, progress: 100 });
        onUploadFile('BOM', file.name, rows);
      }
    }
  };

  const pctMatched = ((metrics.matched / metrics.totalParts) * 100).toFixed(1);

  return (
    <section id="workspace" className="space-y-6 scroll-mt-20">
      
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Solution Workspace</h2>
          <span className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer ml-2">Overview</span>
        </div>
        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Source Files: Ingested & Verified • Auto-matching Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Parsing flow */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
          
          <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 relative p-5">
            
            {/* BOQ Card */}
            <div 
              id="dropzone-boq"
              onDragEnter={(e) => handleDrag(e, 'BOQ')}
              onDragOver={(e) => handleDrag(e, 'BOQ')}
              onDragLeave={(e) => handleDrag(e, 'BOQ')}
              onDrop={(e) => handleDrop(e, 'BOQ')}
              onClick={() => boqInputRef.current?.click()}
              className={`md:col-span-3 border-2 border-dashed rounded-xl p-4 transition-all text-left cursor-pointer flex items-start gap-3.5 group
                ${dragActiveBoq 
                  ? 'border-indigo-500 bg-indigo-50/30' 
                  : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'}`}
            >
              <input 
                ref={boqInputRef}
                type="file" 
                className="hidden" 
                onChange={(e) => handleFileInput(e, 'BOQ')}
                accept=".xlsx,.xls,.csv"
              />
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform duration-200">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">BOQ (Bill of Quantities)</span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-semibold">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Ingested
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-indigo-600 truncate mt-1 group-hover:underline">
                  {boqFile.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  <strong>{boqFile.rows.toLocaleString()}</strong> rows • <strong>{boqFile.configs}</strong> Configs
                </p>
                <span className="text-[10px] text-indigo-500 hover:text-indigo-600 underline mt-2 block opacity-0 group-hover:opacity-100 transition-opacity">
                  Upload new version
                </span>
              </div>
            </div>

            {/* AI Mid Processor Animation */}
            <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
              <div className="relative flex items-center justify-center">
                {/* Visual links anims */}
                <div className="absolute w-24 h-0.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-sky-500 animate-pulse hidden md:block" />
                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center border-2 border-indigo-500 shadow-md shadow-indigo-100 relative z-10">
                  <Cpu className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-455 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 text-[8px] text-white items-center justify-center font-bold">AI</span>
                  </span>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-2 tracking-widest uppercase font-semibold">Auto-sourced</span>
            </div>

            {/* BOM Card */}
            <div 
              id="dropzone-bom"
              onDragEnter={(e) => handleDrag(e, 'BOM')}
              onDragOver={(e) => handleDrag(e, 'BOM')}
              onDragLeave={(e) => handleDrag(e, 'BOM')}
              onDrop={(e) => handleDrop(e, 'BOM')}
              onClick={() => bomInputRef.current?.click()}
              className={`md:col-span-3 border-2 border-dashed rounded-xl p-4 transition-all text-left cursor-pointer flex items-start gap-3.5 group
                ${dragActiveBom 
                  ? 'border-indigo-500 bg-indigo-50/30' 
                  : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50'}`}
            >
              <input 
                ref={bomInputRef}
                type="file" 
                className="hidden" 
                onChange={(e) => handleFileInput(e, 'BOM')}
                accept=".xlsx,.xls,.csv"
              />
              <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform duration-200">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">BOM (Bill of Materials)</span>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-750 px-1.5 py-0.5 rounded-full font-semibold">
                    Sourcing {bomFile.progress}%
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-indigo-650 truncate mt-1 group-hover:underline">
                  {bomFile.name}
                </h4>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 relative overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${bomFile.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  <strong>{bomFile.rows.toLocaleString()}</strong> rows • <strong>{bomFile.configs}</strong> Configs
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Pre-Analysis Confidence Score Circle */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col justify-between relative p-5">
          <div className="flex items-center justify-between ml-1 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pre-Analysis Confidence</span>
            <button 
              id="confidence-info-btn"
              onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          <div className="relative my-3 flex justify-center">
            {/* SVG Ring Graph */}
            <svg id="confidence-score-svg" className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-slate-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="46"
                className="stroke-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * 0.96)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">96%</span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase mt-0.5">High Confidence</span>
            </div>
          </div>

          <div className="mb-1">
            <p className="text-[11px] text-slate-500">AI Quality Score aligned across 3 catalogs</p>
            <button 
              id="view-details-confidence-btn"
              onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold mt-1 inline-flex items-center gap-1 cursor-pointer"
            >
              View details &rarr;
            </button>
          </div>

          {/* Details Overlay */}
          {showConfidenceDetails && (
            <div className="absolute inset-0 bg-slate-900/95 text-white rounded-2xl p-4 flex flex-col justify-between text-left z-20 transition-all">
              <div>
                <h5 className="font-bold text-xs text-indigo-400 uppercase tracking-wider mb-2">Metrics Integrity</h5>
                <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <li className="flex justify-between border-b border-slate-850 pb-1">
                    <span className="font-sans">SKU Integrity</span>
                    <span className="text-emerald-400 font-semibold">100%</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-850 pb-1">
                    <span className="font-sans">Category Parsing</span>
                    <span className="text-emerald-400 font-semibold">98.2%</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-850 pb-1">
                    <span className="font-sans">Multiplier Alignment</span>
                    <span className="text-amber-400 font-semibold">94.0%</span>
                  </li>
                </ul>
              </div>
              <button 
                id="close-confidence-overlay-btn"
                onClick={() => setShowConfidenceDetails(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Metrics Overview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Numerical Metrics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow transition-shadow">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Parts</span>
          <div className="my-2.5">
            <span className="text-2xl font-bold font-mono text-slate-800">{metrics.totalParts.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Across all configs</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Matched</span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">{pctMatched}%</span>
          </div>
          <div className="my-2.5">
            <span className="text-2xl font-bold font-mono text-emerald-600">{metrics.matched.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{pctMatched}% matching rate</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qty Diff</span>
            <span className="text-[10px] text-red-600 font-bold font-mono">{((metrics.qtyDiff / metrics.totalParts) * 100).toFixed(1)}%</span>
          </div>
          <div className="my-2.5">
            <span className="text-2xl font-bold font-mono text-amber-500">{metrics.qtyDiff}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Units deviation</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Missing</span>
            <span className="text-[10px] text-red-600 font-bold font-mono">{((metrics.missing / metrics.totalParts) * 100).toFixed(1)}%</span>
          </div>
          <div className="my-2.5">
            <span className="text-2xl font-bold font-mono text-rose-500">{metrics.missing}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Omitted in BOM</span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Extra</span>
            <span className="text-[10px] text-indigo-600 font-bold font-mono">{((metrics.extra / metrics.totalParts) * 100).toFixed(1)}%</span>
          </div>
          <div className="my-2.5">
            <span className="text-2xl font-bold font-mono text-sky-500">{metrics.extra}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Superfluous parts</span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between hover:shadow transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Risk Score</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="my-2.5">
            <span className="text-xl font-bold text-amber-600 uppercase tracking-tight">{metrics.riskScore}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium underline cursor-pointer">Review recommended</span>
        </div>

      </div>

      {/* Solution Execution Map */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Solution Execution Map <span className="text-slate-450 font-normal lowercase">(UCIDs and Configs)</span>
          </h4>
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Live Status Map
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {ucidConfigs.map((cfg, index) => (
            <div 
              key={cfg.id}
              id={`execution-map-cfg-${cfg.id}`}
              className={`border rounded-2xl p-4 relative overflow-hidden transition-all duration-300
                ${cfg.status === 'Running' 
                  ? 'border-indigo-300 bg-indigo-50/20 ring-1 ring-indigo-100' 
                  : cfg.status === 'Queued'
                    ? 'border-slate-200 bg-slate-50/40 opacity-75'
                    : 'border-slate-200 bg-white'}`}
            >
              {/* Box Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5 mb-3.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-800">{cfg.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded
                      ${cfg.priority === 'HIGH' ? 'bg-red-50 text-red-600' : cfg.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      {cfg.priority}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 tracking-tight mt-0.5 block">{cfg.machineModel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${cfg.status === 'Running' ? 'bg-indigo-500 animate-pulse' : cfg.status === 'Queued' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                  <span className="text-xs text-slate-500 font-medium">{cfg.status}</span>
                </div>
              </div>

              {/* Sub Configs steps list */}
              <div className="space-y-3">
                {cfg.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono font-bold text-[10px]">{sIdx + 1}.</span>
                      <span className="text-slate-700">{step.name}</span>
                    </div>
                    {step.status === 'Matched' && (
                      <span className="text-emerald-650 font-bold inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        Matched
                      </span>
                    )}
                    {step.status === 'In Progress' && (
                      <span className="text-indigo-600 font-bold inline-flex items-center gap-1.5 bg-indigo-50 px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                        In Progress
                      </span>
                    )}
                    {step.status === 'Pending' && (
                      <span className="text-slate-400 font-bold inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full text-[10px]">
                        Pending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

        {/* Footer info bars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span><strong>WITHIN a UCID:</strong> Configs run SEQUENTIALLY (one at a time, in order)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span><strong>ACROSS UCIDs:</strong> UCIDs run in PARALLEL (independent sandbox threads)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span><strong>Max 2 concurrent UCIDs:</strong> UCID-C is queued until UCID-A completes</span>
          </div>
        </div>

      </div>

    </section>
  );
}
