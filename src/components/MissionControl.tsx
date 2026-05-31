/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCw, 
  SkipForward, 
  XOctagon, 
  Network, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  Search,
  Eye
} from 'lucide-react';
import { PortalConnection, MissionAutomationStep } from '../types';

interface MissionControlProps {
  portalConnections: PortalConnection[];
  initialMissionSteps: MissionAutomationStep[];
  isDarkMode?: boolean;
}

export default function MissionControl({
  portalConnections,
  initialMissionSteps,
  isDarkMode = true
}: MissionControlProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'portal' | 'activity'>('live');
  const [isPause, setIsPause] = useState(false);
  const [missionProgress, setMissionProgress] = useState(65);
  const [processedParts, setProcessedParts] = useState(198);
  const [isStopped, setIsStopped] = useState(false);
  const [refreshingScreenshot, setRefreshingScreenshot] = useState(false);
  const [screenshotTime, setScreenshotTime] = useState('30s ago');
  const [missionSteps, setMissionSteps] = useState<MissionAutomationStep[]>(initialMissionSteps);

  // Periodic simulated automation progression
  useEffect(() => {
    if (isPause || isStopped) return;

    const interval = setInterval(() => {
      // Advance progress slowly
      setProcessedParts(prevParts => {
        if (prevParts >= 412) {
          return 412;
        }
        const nextParts = prevParts + Math.floor(Math.random() * 5) + 1;
        // recalculate progress
        const nextProg = Math.min(100, Math.floor((nextParts / 412) * 100));
        setMissionProgress(nextProg);
        return nextParts;
      });

      // Update Step 6 progress label dynamically
      setMissionSteps(prevSteps => 
        prevSteps.map(step => {
          if (step.id === 6 && step.status === 'In Progress') {
            const currentParts = processedParts;
            if (currentParts >= 412) {
              return { ...step, status: 'Completed', processed: 'Done', time: '10:25:20' };
            }
            return { ...step, processed: `${currentParts} / 412 parts` };
          }
          return step;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isPause, isStopped, processedParts]);

  const handlePauseToggle = () => {
    setIsPause(!isPause);
  };

  const handleStopMission = () => {
    setIsStopped(true);
    setIsPause(true);
  };

  const handleRestartMission = () => {
    setIsStopped(false);
    setIsPause(false);
    setProcessedParts(198);
    setMissionProgress(65);
    setMissionSteps(initialMissionSteps);
  };

  const forceRefreshScreenshot = () => {
    setRefreshingScreenshot(true);
    setTimeout(() => {
      setRefreshingScreenshot(false);
      setScreenshotTime('just now');
    }, 1200);
  };

  return (
    <section id="mission" className={`rounded-2xl border p-5 shadow-sm scroll-mt-20 transition-all duration-300
      ${isDarkMode ? 'bg-[#1A1D27] border-slate-800/80 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-indigo-100/30'}`}>
      
      {/* Title block */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between pb-4 border-b gap-4
        ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">3</span>
          <h2 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Mission Control</h2>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Vendor Portal Automation</span>
        </div>

        {/* Tabs switcher */}
        <div className={`flex p-1 rounded-lg text-xs gap-1 ${isDarkMode ? 'bg-slate-900/60' : 'bg-slate-100'}`}>
          <button 
            id="tab-live-mission"
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer
              ${activeTab === 'live' 
                ? (isDarkMode ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-600 shadow-sm') 
                : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800')}`}
          >
            Live Mission
          </button>
          <button 
            id="tab-portal-status"
            onClick={() => setActiveTab('portal')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer
              ${activeTab === 'portal' 
                ? (isDarkMode ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-600 shadow-sm') 
                : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800')}`}
          >
            Portal Status
          </button>
          <button 
            id="tab-activity-log"
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer
              ${activeTab === 'activity' 
                ? (isDarkMode ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-600 shadow-sm') 
                : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800')}`}
          >
            Activity Log
          </button>
        </div>
      </div>

      {isStopped && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 my-4 flex items-center justify-between text-xs text-red-800">
          <div className="flex items-center gap-2">
            <XOctagon className="w-4 h-4 text-red-600 flex-shrink-0 animate-bounce" />
            <span><strong>MISSION STOPPED:</strong> Automation loop has been terminated by operator. Portals isolated safely.</span>
          </div>
          <button 
            id="mission-restart-btn2"
            onClick={handleRestartMission}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded font-bold cursor-pointer"
          >
            Restart Sourcing Mission
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
        
        {/* Columns 1 & 2: Mission Orchestration & Step Progress */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Mission Orchestrators */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Orchestration Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* UCID-A Progress Item */}
              <div className={`transition-colors duration-300 border rounded-2xl p-3.5 space-y-3
                ${isDarkMode ? 'bg-[#151821] border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-indigo-400' : 'text-slate-800'}`}>UCID-A</span>
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full
                    ${isDarkMode ? 'text-indigo-455 bg-indigo-950/40 border border-indigo-900/40' : 'text-indigo-755 bg-indigo-50'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" /> Running
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">HPE-DL380-GEN12-001</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-707'}`}>{isStopped ? 'Stopped' : '60%'}</span>
                    <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div className="bg-indigo-600 h-full rounded-full animate-pulse" style={{ width: isStopped ? '0%' : '60%' }} />
                    </div>
                  </div>
                </div>
                <div className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sequential (2 of 3 configs)</div>
              </div>

              {/* UCID-B Progress Item with Auto-Healed Event */}
              <div className={`transition-colors duration-300 border rounded-2xl p-3.5 space-y-3 relative
                ${isDarkMode ? 'bg-[#151821] border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-emerald-400' : 'text-slate-800'}`}>UCID-B</span>
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full
                    ${isDarkMode ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/40' : 'text-emerald-805 bg-emerald-50/70'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Running
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">HPE-DL380-GEN12-002</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-707'}`}>{isStopped ? 'Stopped' : '48%'}</span>
                    <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: isStopped ? '0%' : '48%' }} />
                    </div>
                  </div>
                </div>
                <div className={`text-[9px] font-bold rounded px-1.5 py-0.5 flex items-center gap-1 border
                  ${isDarkMode ? 'text-amber-450 bg-amber-950/25 border-amber-900/35' : 'text-amber-700 bg-amber-50 border-amber-100'}`}>
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-550" /> Auto-healed (resolved connection block)
                </div>
              </div>

              {/* UCID-C Progress Item (Queued) */}
              <div className={`transition-colors duration-300 border rounded-2xl p-3.5 space-y-3 opacity-80
                ${isDarkMode ? 'bg-[#151821] border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>UCID-C</span>
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full
                    ${isDarkMode ? 'text-amber-450 bg-amber-950/20 border-amber-900/30' : 'text-amber-700 bg-amber-50'}`}>
                    Queued
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">HPE-APOLLO-6500-003</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-slate-450">31%</span>
                    <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div className="bg-slate-600 h-full rounded-full" style={{ width: '31%' }} />
                    </div>
                  </div>
                </div>
                <div className={`text-[10px] font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>Queued — waiting for slot</div>
              </div>

            </div>
          </div>

          {/* Sourcing Timeline progress step */}
          <div className={`border rounded-2xl p-5 space-y-4 transition-all duration-300
            ${isDarkMode ? 'bg-[#151821] border-slate-800/80' : 'bg-slate-50 border-slate-200'}`}>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step Execution Progress</span>
                <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}><strong>{processedParts}</strong> of 412 core configuration parts parsed</p>
              </div>
              <span className={`text-2xl font-extrabold font-mono ${isDarkMode ? 'text-indigo-405 shadow-glow' : 'text-indigo-605'}`}>
                {isStopped ? '0' : missionProgress}%
              </span>
            </div>

            {/* Stepper Timeline Graphics */}
            <div className="relative pt-2 pb-4">
              <div className={`absolute top-5 left-4 right-4 h-0.5 z-0 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-202'}`} />
              <div 
                className="absolute top-5 left-4 h-0.5 bg-indigo-600 z-0 transition-all duration-500" 
                style={{ width: `${isStopped ? 0 : missionProgress}%` }}
              />

              <div className="grid grid-cols-6 relative z-10 text-center">
                
                {[
                  { label: 'Login', activeAt: 10 },
                  { label: 'Load UCID', activeAt: 30 },
                  { label: 'Configure', activeAt: 50 },
                  { label: 'Extract', activeAt: 75 },
                  { label: 'Validate', activeAt: 90 },
                  { label: 'Complete', activeAt: 100 }
                ].map((step, idx) => {
                  const checkValue = isStopped ? 0 : missionProgress;
                  const stepIsComplete = checkValue >= step.activeAt;
                  const stepIsActive = !isStopped && checkValue >= (step.activeAt - 20) && checkValue < step.activeAt;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                        ${stepIsComplete 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : stepIsActive 
                            ? (isDarkMode ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-700 shadow-md animate-pulse' : 'bg-indigo-50 text-indigo-650 border border-indigo-405 shadow-md animate-pulse') 
                            : (isDarkMode ? 'bg-[#0F1117] border-slate-800 text-slate-500' : 'bg-white border text-slate-400')}`}>
                        {stepIsComplete ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] font-semibold mt-2 truncate max-w-full ${isDarkMode ? 'text-slate-400' : 'text-slate-650'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}

              </div>
            </div>

            {/* Mission Steering Control buttons */}
            <div className={`flex flex-wrap items-center gap-2 pt-2 border-t ${isDarkMode ? 'border-slate-805' : 'border-slate-200/50'}`}>
              <button
                id="mission-pause-btn"
                onClick={handlePauseToggle}
                disabled={isStopped}
                className={`px-4 py-2 border rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm disabled:opacity-50 cursor-pointer
                  ${isDarkMode 
                    ? 'bg-[#0F1117] hover:bg-[#1A1D27] border-slate-800 text-slate-300' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                {isPause ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-505 fill-emerald-500" /> Resume Mission
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-500" /> Pause Mission
                  </>
                )}
              </button>

              <button
                id="mission-retry-btn"
                onClick={() => {
                  setProcessedParts(198);
                  setMissionProgress(65);
                  setIsPause(false);
                  setIsStopped(false);
                }}
                className={`px-4 py-2 border rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm cursor-pointer
                  ${isDarkMode 
                    ? 'bg-[#0F1117] hover:bg-[#1A1D27] border-slate-800 text-slate-300' 
                    : 'bg-white hover:bg-slate-50 border'}`}
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-505" /> Retry Step
              </button>

              <button
                id="mission-skip-btn"
                onClick={() => {
                  setProcessedParts(p => Math.min(412, p + 50));
                }}
                disabled={isStopped}
                className={`px-4 py-2 border rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm disabled:opacity-50 cursor-pointer
                  ${isDarkMode 
                    ? 'bg-[#0F1117] hover:bg-[#1A1D27] border-slate-800 text-slate-300' 
                    : 'bg-white hover:bg-slate-50 border'}`}
              >
                <SkipForward className="w-3.5 h-3.5 text-purple-500" /> Skip Step
              </button>

              <div className="flex-1" />

              {isStopped ? (
                <button
                  id="mission-restart-primary"
                  onClick={handleRestartMission}
                  className="px-5 py-2 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition shadow cursor-pointer animate-pulse"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Start Sourcing
                </button>
              ) : (
                <button
                  id="mission-stop-btn"
                  onClick={handleStopMission}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition shadow cursor-pointer"
                >
                  <XOctagon className="w-3.5 h-3.5" /> Stop Mission
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Column 3: Automation lists, connections, and Live Screenshot */}
        <div className="space-y-5">
          
          {/* Automation Steps list card */}
          <div className={`border rounded-2xl p-4 transition-colors duration-300
            ${isDarkMode ? 'bg-[#151821] border-slate-800/80' : 'bg-slate-50 border border-slate-200'}`}>
            <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Automation Steps</span>
              <span className="text-[10px] font-mono text-slate-400">Sequence logs</span>
            </div>

            <div className="mt-3.5 space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {missionSteps.map((step) => (
                <div key={step.id} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-mono font-bold
                      ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200/80 text-slate-600'}`}>
                      {step.id}
                    </span>
                    <span className={`truncate ${step.status === 'Completed' 
                      ? 'text-slate-500 line-through' 
                      : (isDarkMode ? 'text-slate-200 font-medium' : 'text-slate-800 font-medium')}`}>
                      {step.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {step.status === 'Completed' ? (
                      <span className={`text-[10px] font-mono font-bold flex items-center gap-1 px-1.5 py-0.2 rounded
                        ${isDarkMode ? 'text-emerald-400 bg-emerald-950/30' : 'text-emerald-600 bg-emerald-50'}`}>
                        ✓ {step.time}
                      </span>
                    ) : step.status === 'In Progress' && !isStopped ? (
                      <span className={`text-[10px] font-mono font-bold flex items-center gap-1.5 px-1.5 py-0.2 rounded animate-pulse
                        ${isDarkMode ? 'text-indigo-400 bg-indigo-950/40 border border-indigo-900/30' : 'text-indigo-705 bg-indigo-50'}`}>
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping" /> {step.processed}
                      </span>
                    ) : (
                      <span className={`text-[10px] font-medium px-1.5 rounded
                        ${isDarkMode ? 'text-slate-400 bg-slate-800' : 'text-slate-400 bg-slate-100'}`}>
                        {isStopped ? 'Canceled' : 'Pending'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portal Connections and Live Screenshot view */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            
            {/* Connections */}
            <div className={`border rounded-2xl p-4 transition-colors duration-300
              ${isDarkMode ? 'bg-[#151821] border-slate-800/80' : 'bg-slate-50/50 border border-slate-200'}`}>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Portal Connections</span>
              <div className="grid grid-cols-2 gap-2">
                {portalConnections.map((conn) => (
                  <div key={conn.name} className={`flex items-center justify-between p-2 rounded-lg text-xs border transition-colors duration-300
                    ${isDarkMode ? 'bg-[#0F1117] border-slate-850 text-slate-200' : 'bg-white border border-slate-100 text-slate-700'}`}>
                    <span className="font-semibold">{conn.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded
                      ${conn.status === 'Connected' 
                        ? (isDarkMode ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-700') 
                        : conn.status === 'Delayed' 
                          ? (isDarkMode ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-50 text-amber-700') 
                          : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500')}`}>
                      {conn.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Screenshot preview Card */}
            <div className={`border rounded-2xl p-4 space-y-3 relative overflow-hidden group transition-all duration-300
              ${isDarkMode ? 'bg-[#151821] border-slate-800/80 text-slate-200' : 'bg-slate-900 border border-slate-200 text-slate-200'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Eye className="w-3 h-3 text-indigo-400" /> Live Screenshot
                </span>
                <button 
                  id="refresh-screenshot-btn"
                  onClick={forceRefreshScreenshot}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Force re-render active selenium container screenshot"
                >
                  <RefreshCw className={`w-3 h-3 ${refreshingScreenshot ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Mock screenshot image node */}
              <div className="h-28 bg-slate-950 rounded-lg border border-slate-850 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
                {refreshingScreenshot ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
                    <span className="text-[10px] text-slate-500 font-mono">Capturing container view...</span>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#111c34]/20 to-[#070b14]/90 z-0" />
                    {/* Visual schematic representation of configurator interface */}
                    <div className="w-full h-full flex flex-col justify-between text-left font-mono text-[8px] text-emerald-400 leading-snug z-10 select-none pb-0.5">
                      <div className="flex justify-between text-slate-550 border-b border-slate-900 pb-1">
                        <span>HTTPS://PARTNERS.HPE.COM/CONFIG/UCID-A</span>
                        <span className="text-emerald-500">SECURE:SSL</span>
                      </div>
                      <div className="space-y-0.5 py-1">
                        <div className="text-slate-450">&gt; Loading DL380 Gen12 baseline chassis...</div>
                        <div className="text-indigo-400">&gt; Sourcing configs matching model HPE-DL380-GEN12-001</div>
                        <div className="text-emerald-505">&gt; OK: Loaded 3 server chassis maps successfully.</div>
                      </div>
                      <div className="flex justify-between text-slate-550 border-t border-slate-900 pt-1 text-[7px]">
                        <span>REFRESH RATE: 30S</span>
                        <span>STATUS: ACTIVE SOURCING LOOP</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-1">
                <span>HPE Configurator — Live View</span>
                <span>Refreshed {screenshotTime}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
