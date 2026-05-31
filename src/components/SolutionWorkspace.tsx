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
  isDarkMode?: boolean;
}

export default function SolutionWorkspace({
  ucidConfigs,
  metrics,
  onUploadFile,
  isDarkMode = true
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
          <h2 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Solution Workspace</h2>
          <span className={`text-xs font-bold hover:underline cursor-pointer ml-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Overview</span>
        </div>
        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
          Source Files: Ingested & Verified • Auto-matching Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document Parsing flow */}
        <div className={`lg:col-span-3 rounded-2xl border p-1 shadow-sm relative overflow-hidden flex flex-col justify-between transition-colors duration-300
          ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 shadow-slate-950/20' : 'bg-white border-slate-200'}`}>
          
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
                  ? 'border-indigo-500 bg-indigo-950/20' 
                  : (isDarkMode 
                      ? 'border-slate-800 hover:border-indigo-505 hover:bg-slate-800/40' 
                      : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50')}`}
            >
              <input 
                ref={boqInputRef}
                type="file" 
                className="hidden" 
                onChange={(e) => handleFileInput(e, 'BOQ')}
                accept=".xlsx,.xls,.csv"
              />
              <div className={`p-2.5 rounded-lg group-hover:scale-105 transition-all duration-205
                ${isDarkMode ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">BOQ (Bill of Quantities)</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                    ${isDarkMode ? 'bg-emerald-955/40 text-emerald-400 border border-emerald-900/30' : 'bg-emerald-100 text-emerald-800'}`}>
                    <CheckCircle2 className="w-2.5 h-2.5 animate-pulse" /> Ingested
                  </span>
                </div>
                <h4 className={`text-sm font-semibold truncate mt-1 group-hover:underline ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {boqFile.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  <strong>{boqFile.rows.toLocaleString()}</strong> rows • <strong>{boqFile.configs}</strong> Configs
                </p>
                <span className={`text-[10px] underline mt-2 block opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`}>
                  Upload new version
                </span>
              </div>
            </div>

            {/* AI Mid Processor Animation */}
            <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
              <div className="relative flex items-center justify-center">
                {/* Visual links anims */}
                <div className="absolute w-24 h-0.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-sky-500 animate-pulse hidden md:block" />
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-indigo-500 z-10 relative
                  ${isDarkMode ? 'bg-[#0F1117] shadow-slate-950/50' : 'bg-slate-900 shadow-indigo-100'}`}>
                  <Cpu className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-duration-1000"></span>
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
                  ? 'border-indigo-555 bg-indigo-950/20' 
                  : (isDarkMode 
                      ? 'border-slate-800 hover:border-indigo-500 hover:bg-slate-850/30' 
                      : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50')}`}
            >
              <input 
                ref={bomInputRef}
                type="file" 
                className="hidden" 
                onChange={(e) => handleFileInput(e, 'BOM')}
                accept=".xlsx,.xls,.csv"
              />
              <div className={`p-2.5 rounded-lg group-hover:scale-105 transition-all duration-200
                ${isDarkMode ? 'bg-indigo-950/50 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">BOM (Bill of Materials)</span>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                    ${isDarkMode ? 'bg-indigo-950/50 text-indigo-300' : 'bg-[#E0E7FF] text-indigo-750'}`}>
                    Sourcing {bomFile.progress}%
                  </span>
                </div>
                <h4 className={`text-sm font-semibold truncate mt-1 group-hover:underline ${isDarkMode ? 'text-indigo-405' : 'text-indigo-650'}`}>
                  {bomFile.name}
                </h4>
                <div className={`w-full h-1.5 rounded-full mt-2 relative overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
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
        <div className={`rounded-2xl border text-center flex flex-col justify-between relative p-5 transition-colors duration-350
          ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 text-white shadow-slate-950/20' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between ml-1 text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pre-Analysis Confidence</span>
            <button 
              id="confidence-info-btn"
              onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
              className={`transition-colors cursor-pointer ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
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
                className={isDarkMode ? 'stroke-slate-800' : 'stroke-slate-100'}
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
              <span className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>96%</span>
              <span className="text-[10px] font-bold text-emerald-500 tracking-wider uppercase mt-0.5">High Confidence</span>
            </div>
          </div>

          <div className="mb-1">
            <p className="text-[11px] text-slate-400">AI Quality Score aligned across 3 catalogs</p>
            <button 
              id="view-details-confidence-btn"
              onClick={() => setShowConfidenceDetails(!showConfidenceDetails)}
              className={`text-xs font-bold mt-1 inline-flex items-center gap-1 cursor-pointer transition-colors
                ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-650 hover:text-indigo-700'}`}
            >
              View details &rarr;
            </button>
          </div>

          {/* Details Overlay */}
          {showConfidenceDetails && (
            <div className={`absolute inset-0 rounded-2xl p-4 flex flex-col justify-between text-left z-20 transition-all
              ${isDarkMode ? 'bg-[#151821] border border-slate-800 text-white' : 'bg-slate-900/95 text-white'}`}>
              <div>
                <h5 className="font-bold text-xs text-indigo-400 uppercase tracking-wider mb-2">Metrics Integrity</h5>
                <ul className="space-y-1.5 text-xs text-slate-305 font-mono">
                  <li className={`flex justify-between border-b pb-1 ${isDarkMode ? 'border-slate-800' : 'border-slate-850/40'}`}>
                    <span className="font-sans">SKU Integrity</span>
                    <span className="text-emerald-450 font-semibold">100%</span>
                  </li>
                  <li className={`flex justify-between border-b pb-1 ${isDarkMode ? 'border-slate-800' : 'border-slate-855/40'}`}>
                    <span className="font-sans">Category Parsing</span>
                    <span className="text-emerald-450 font-semibold">98.2%</span>
                  </li>
                  <li className={`flex justify-between border-b pb-1 ${isDarkMode ? 'border-slate-800' : 'border-slate-855/40'}`}>
                    <span className="font-sans">Multiplier Alignment</span>
                    <span className="text-emerald-450 font-semibold">94.0%</span>
                  </li>
                </ul>
              </div>
              <button 
                id="close-confidence-overlay-btn"
                onClick={() => setShowConfidenceDetails(false)}
                className="w-full bg-indigo-650 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
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
        <div className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between hover:shadow transition-all duration-305
          ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 text-white shadow-slate-950/10' : 'bg-white border-slate-200 text-slate-800'}`}>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Parts</span>
          <div className="my-2.5">
            <span className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{metrics.totalParts.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Across all configs</span>
        </div>

        {/* Metric 2 */}
        <div className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between hover:shadow transition-all duration-305
          ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 text-white shadow-slate-950/10' : 'bg-white border-slate-200 text-slate-800'}`}>
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Matched</span>
            <span className="text-[10px] text-emerald-500 font-bold font-mono">{pctMatched}%</span>
          </div>
          <div className="my-2.5">
            <span className="text-2xl font-bold font-mono text-emerald-500">{metrics.matched.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{pctMatched}% matching rate</span>
        </div>

        {/* Metric 3 */}
        <div className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between hover:shadow transition-all duration-305
          ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 text-white shadow-slate-950/10' : 'bg-white border-slate-200 text-slate-800'}`}>
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Qty Diff</span>
            <span className="text-[10px] text-amber-500 font-bold font-mono">{((metrics.qtyDiff / metrics.totalParts) * 100).toFixed(1)}%</span>
          </div>
          <div className="my-2.5">
            <span className="text-2xl font-bold font-mono text-amber-500">{metrics.qtyDiff}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Units deviation</span>
        </div>

        {/* Metric 4 */}
        <div className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between hover:shadow transition-all duration-305
          ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 text-white shadow-slate-950/10' : 'bg-white border-slate-200 text-slate-800'}`}>
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Missing</span>
            <span className="text-[10px] text-rose-500 font-bold font-mono">{((metrics.missing / metrics.totalParts) * 100).toFixed(1)}%</span>
          </div>
          <div className="my-2.5">
            <span className="text-2xl font-bold font-mono text-rose-500">{metrics.missing}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Omitted in BOM</span>
        </div>

        {/* Metric 5 */}
        <div className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between hover:shadow transition-all duration-305
          ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 text-white shadow-slate-950/10' : 'bg-white border-slate-200 text-slate-800'}`}>
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Extra</span>
            <span className="text-[10px] text-indigo-400 font-bold font-mono">{((metrics.extra / metrics.totalParts) * 100).toFixed(1)}%</span>
          </div>
          <div className="my-2.5">
            <span className="text-2xl font-bold font-mono text-indigo-400">{metrics.extra}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Superfluous parts</span>
        </div>

        {/* Metric 6 */}
        <div className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between hover:shadow transition-all duration-305
          ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 text-white shadow-slate-950/10' : 'bg-white border-slate-200 text-slate-800'}`}>
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Risk Score</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="my-2.5">
            <span className="text-xl font-bold text-amber-500 uppercase tracking-tight">{metrics.riskScore}</span>
          </div>
          <span className={`text-[11px] font-medium underline cursor-pointer hover:text-amber-450 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Review recommended</span>
        </div>

      </div>

      {/* Solution Execution Map */}
      <div className={`rounded-2xl border p-5 shadow-sm space-y-4 transition-colors duration-300
        ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 text-white shadow-slate-950/20' : 'bg-white border-slate-200'}`}>
        
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
            Solution Execution Map <span className="text-slate-400 font-normal lowercase">(UCIDs and Configs)</span>
          </h4>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5
            ${isDarkMode ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-900/40' : 'bg-indigo-50 text-indigo-600'}`}>
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
                  ? (isDarkMode 
                      ? 'border-indigo-500 bg-indigo-950/15 ring-1 ring-indigo-900/35' 
                      : 'border-indigo-300 bg-indigo-50/20 ring-1 ring-indigo-100')
                  : cfg.status === 'Queued'
                    ? (isDarkMode 
                        ? 'border-slate-800/80 bg-slate-900/40 opacity-75' 
                        : 'border-slate-200 bg-slate-50/40 opacity-75')
                    : (isDarkMode 
                        ? 'border-slate-800 bg-[#12141D]' 
                        : 'border-slate-200 bg-white')}`}
            >
              {/* Box Header */}
              <div className={`flex items-start justify-between border-b pb-2.5 mb-3.5 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{cfg.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded
                      ${cfg.priority === 'HIGH' 
                        ? (isDarkMode ? 'bg-red-950/60 text-red-400 border border-red-900/30' : 'bg-red-50 text-red-650') 
                        : cfg.priority === 'MEDIUM' 
                          ? (isDarkMode ? 'bg-amber-950/60 text-amber-400 border border-amber-900/30' : 'bg-amber-50 text-amber-600') 
                          : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>
                      {cfg.priority}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 tracking-tight mt-0.5 block">{cfg.machineModel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${cfg.status === 'Running' ? 'bg-indigo-500 animate-pulse' : cfg.status === 'Queued' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                  <span className="text-xs text-slate-400 font-medium">{cfg.status}</span>
                </div>
              </div>

              {/* Sub Configs steps list */}
              <div className="space-y-3">
                {cfg.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono font-bold text-[10px]">{sIdx + 1}.</span>
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{step.name}</span>
                    </div>
                    {step.status === 'Matched' && (
                      <span className={`font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
                        ${isDarkMode ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'text-emerald-750 bg-emerald-50'}`}>
                        Matched
                      </span>
                    )}
                    {step.status === 'In Progress' && (
                      <span className={`font-bold inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] animate-pulse
                        ${isDarkMode ? 'bg-indigo-950/50 text-indigo-300 border border-indigo-900/30' : 'text-indigo-600 bg-indigo-50'}`}>
                        In Progress
                      </span>
                    )}
                    {step.status === 'Pending' && (
                      <span className={`font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
                        ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'text-slate-405 bg-slate-50'}`}>
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
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <div className={`flex items-center gap-2 p-2.5 rounded-xl border
            ${isDarkMode ? 'bg-[#151821] border-slate-800/80 shadow-inner' : 'bg-slate-50 border-slate-100'}`}>
            <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span><strong>WITHIN a UCID:</strong> Configs run SEQUENTIALLY (one at a time, in order)</span>
          </div>
          <div className={`flex items-center gap-2 p-2.5 rounded-xl border
            ${isDarkMode ? 'bg-[#151821] border-slate-800/80 shadow-inner' : 'bg-slate-50 border-slate-100'}`}>
            <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span><strong>ACROSS UCIDs:</strong> UCIDs run in PARALLEL (independent sandbox threads)</span>
          </div>
          <div className={`flex items-center gap-2 p-2.5 rounded-xl border
            ${isDarkMode ? 'bg-[#151821] border-slate-800/80 shadow-inner' : 'bg-slate-50 border-slate-100'}`}>
            <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span><strong>Max 2 concurrent UCIDs:</strong> UCID-C is queued until UCID-A completes</span>
          </div>
        </div>

      </div>

    </section>
  );
}
