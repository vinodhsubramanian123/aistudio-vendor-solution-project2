/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  HelpCircle, 
  User, 
  Search, 
  Settings, 
  Flame, 
  Zap, 
  RefreshCw,
  GitCompare,
  Sliders,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import SolutionWorkspace from './components/SolutionWorkspace';
import MissionControl from './components/MissionControl';
import CompareOverview from './components/CompareOverview';
import InvestigateForensics from './components/InvestigateForensics';
import BottomBento from './components/BottomBento';
import { 
  INITIAL_DISCREPANCIES, 
  INITIAL_UCID_CONFIGS, 
  PORTAL_CONNECTIONS, 
  MISSION_STEPS, 
  FORENSIC_CHECKLISTS, 
  INITIAL_HEALING_TASKS, 
  SUGGESTED_QUERIES, 
  SYSTEM_QUERY_LOGS 
} from './data/mockData';
import { DiscrepancyItem, HealingTask } from './types';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false); // client-facing theme mode flag

  // Core stateful representations
  const [discrepancies, setDiscrepancies] = useState<DiscrepancyItem[]>(INITIAL_DISCREPANCIES);
  const [ucidConfigs, setUcidConfigs] = useState(INITIAL_UCID_CONFIGS);
  const [healingTasks, setHealingTasks] = useState<HealingTask[]>(INITIAL_HEALING_TASKS);
  
  // Selected discrepancy focal SKU
  const [selectedSku, setSelectedSku] = useState('PS0775-B21');

  // Trigger metrics calculations dynamically on active states
  const totalParts = 4827; // Baseline BOQ units
  const matchedParts = discrepancies.filter(item => item.status === 'Matched').length * 150 + 2712; 
  const qtyDiffCount = discrepancies.filter(item => item.status === 'Qty Diff').length * 20 + 78;
  const missingCount = discrepancies.filter(item => item.status === 'Missing').length * 10 + 47;
  const extraCount = discrepancies.filter(item => item.status === 'Extra').length * 50 + 260;

  const currentMetrics = {
    totalParts,
    matched: Math.min(totalParts, matchedParts),
    qtyDiff: qtyDiffCount,
    missing: Math.max(0, missingCount),
    extra: extraCount,
    riskScore: missingCount > 25 ? 'Medium' : 'Low'
  };

  // Reconcilation flow: Click to apply SKU patching triggers state updates
  const handlePatchSku = (sku: string) => {
    // 1. Update discrepancy item status to Matched
    setDiscrepancies(prev => 
      prev.map(item => 
        item.sku === sku ? { ...item, status: 'Matched', insight: 'Resolved and Matched' } : item
      )
    );

    // 2. Resolve correspondings healing task if any
    setHealingTasks(prev => 
      prev.map(task => 
        task.title.includes(sku) ? { ...task, status: 'Fixed' } : task
      )
    );
  };

  const handleIgnoreSku = (sku: string) => {
    // 1. Update discrepancies status to Matched as an exception
    setDiscrepancies(prev => 
      prev.map(item => 
        item.sku === sku ? { ...item, status: 'Matched', insight: 'Exception Ignored' } : item
      )
    );

    // 2. Clean corresponds heal item
    setHealingTasks(prev => 
      prev.map(task => 
        task.title.includes(sku) ? { ...task, status: 'Fixed' } : task
      )
    );
  };

  const handleResolveHeal = (id: string) => {
    // Healing click in Fix center
    setHealingTasks(prev => 
      prev.map(task => {
        if (task.id === id) {
          // identify sku associated with title
          const skuMatch = task.title.match(/P[A-Z0-9]+-B21/);
          if (skuMatch && skuMatch[0]) {
            handlePatchSku(skuMatch[0]);
          }
          return { ...task, status: 'Fixed' };
        }
        return task;
      })
    );
  };

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'upload-boq') {
      const el = document.getElementById('dropzone-boq');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (actionId === 'upload-bom') {
      const el = document.getElementById('dropzone-bom');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (actionId === 'query-studio') {
      const el = document.getElementById('query');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Funnel items click navigation highlights
  const funnels = [
    { title: 'Upload', desc: 'Ingest your data', active: true, targetId: 'workspace' },
    { title: 'Understand', desc: 'AI pre-analysis', active: true, targetId: 'workspace' },
    { title: 'Automated Sourcing', desc: 'Vendor portals', active: true, targetId: 'mission' },
    { title: 'Compare', desc: 'Find differences', active: true, targetId: 'compare' },
    { title: 'Investigate', desc: 'Root cause', active: true, targetId: 'investigate' },
    { title: 'Fix / Heal', desc: 'Resolve & learn', active: true, targetId: 'governance' },
    { title: 'Export', desc: 'Deliverables', active: true, targetId: 'exports' }
  ];

  const handleFunnelJump = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} font-sans antialiased flex`}>
      
      {/* 1. Sidebar Nav */}
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onQuickAction={handleQuickAction}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* 2. Main content canvas panel */}
      <main className={`flex-1 transition-all duration-300 min-w-0 pb-12
        ${sidebarCollapsed ? 'pl-20' : 'pl-68'} pr-6 pt-6 space-y-6`}>
        
        {/* Sticky top-level bar summary */}
        <header id="top" className="flex items-center justify-between pb-4 border-b border-slate-200/60 sticky top-0 bg-[#F8FAFC]/70 backdrop-blur-sm z-30">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs select-all">PORT: 3000 // STABLE</span>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Solution Workspace</h1>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Logged in as: <strong className="text-slate-700">vinodhsubramanian@gmail.com</strong></span>
            </div>
          </div>

          {/* Quick settings elements */}
          <div className="flex items-center gap-3.5">
            {/* mock search bar representing generic NLP inquiry */}
            <div className="relative hidden md:block w-72">
              <input 
                type="text" 
                placeholder="Search NLP / SKU / Config / UCID..."
                onClick={() => handleQuickAction('query-studio')}
                className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>

            <button 
              id="top-bell-btn"
              className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 relative text-slate-600 transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center font-mono">
                9
              </span>
            </button>

            <button 
              id="top-help-btn"
              className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-l pl-3.5 border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-sm select-none">
                VS
              </div>
              <div className="hidden lg:block text-left text-xs leading-none">
                <span className="font-extrabold text-slate-800">vinodhsubramanian</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Enterprise Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Funnel Progress Tracker Breadcrumbs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm shadow-slate-100/40">
          <div className="flex items-center justify-between overflow-x-auto gap-4 py-1 scrollbar-none">
            {funnels.map((node, id) => (
              <button
                key={id}
                id={`funnel-node-jump-${node.targetId}`}
                onClick={() => handleFunnelJump(node.targetId)}
                className="flex items-center gap-2.5 text-left min-w-max hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold font-mono text-xs flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                  {id + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-none group-hover:text-indigo-600">{node.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium block mt-1">{node.desc}</span>
                </div>
                {id < funnels.length - 1 && (
                  <span className="text-slate-300 font-semibold font-mono text-xs select-none pl-3">&gt;</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sections Blocks */}
        
        {/* (1) Solution Workspace (Doc uploads, score, KPIs, status map) */}
        <SolutionWorkspace 
          ucidConfigs={ucidConfigs}
          metrics={currentMetrics}
          onUploadFile={(type, name, rows) => {
            // update items to trigger calculations
            setDiscrepancies(prev => [
              ...prev,
              {
                id: Math.random().toString(),
                sku: `S-${Math.floor(Math.random()*10000)}`,
                description: `Sourced elements representing uploaded sheet ${name}`,
                category: 'Others',
                boqQty: type === 'BOQ' ? 4 : 0,
                bomQty: type === 'BOM' ? 4 : 0,
                status: 'Matched',
                insight: 'Fully synchronized'
              }
            ]);
          }}
        />

        {/* (3) Mission Control (Tab controllers, stepper, browser live snapshots) */}
        <MissionControl 
          portalConnections={PORTAL_CONNECTIONS}
          initialMissionSteps={MISSION_STEPS}
        />

        {/* (4) Compare Overview (Hierarchies, Parts discrepancies lists, Category Donut charts) */}
        <CompareOverview 
          discrepancies={discrepancies}
          ucidConfigs={ucidConfigs}
          selectedSku={selectedSku}
          setSelectedSku={setSelectedSku}
          onAutoHealSku={handlePatchSku}
        />

        {/* (5) Investigate Forensic details card */}
        <InvestigateForensics 
          selectedSku={selectedSku}
          discrepancies={discrepancies}
          forensicChecklist={FORENSIC_CHECKLISTS}
          onPatchSku={handlePatchSku}
          onIgnoreSku={handleIgnoreSku}
        />

        {/* (6 to 10) Underneath Bento grid (Query NLP, Catalog, Fix center, Gov logs, Exporters) */}
        <BottomBento 
          healingTasks={healingTasks}
          onResolveHeal={handleResolveHeal}
          queryLogs={SYSTEM_QUERY_LOGS}
          suggestedQueries={SUGGESTED_QUERIES}
        />

        {/* App Footer */}
        <footer className="pt-8 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between text-xs text-slate-400 font-medium">
          <span>&copy; 2026 Vendor Solution Intelligence Platform. All rights reserved. • Protected under EU-889 specifications.</span>
          <div className="flex gap-4 mt-2 md:mt-0 font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Real-time status sync active
            </span>
            <span className="hover:underline cursor-pointer">Security Compliance</span>
            <span className="hover:underline cursor-pointer">Privacy Charter</span>
          </div>
        </footer>

      </main>

    </div>
  );
}
