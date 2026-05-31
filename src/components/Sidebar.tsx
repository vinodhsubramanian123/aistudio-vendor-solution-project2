/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  Layers, 
  GitCompare, 
  ShieldAlert, 
  Search, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Download, 
  FileUp, 
  PlusCircle,
  HelpCircle,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onQuickAction: (action: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
}

export default function Sidebar({
  activeSection,
  setActiveSection,
  onQuickAction,
  collapsed,
  setCollapsed,
  isDarkMode,
  setIsDarkMode
}: SidebarProps) {
  
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, refSection: 'top' },
    { id: 'workspace', label: 'Workspace', icon: Layers, refSection: 'workspace' },
    { id: 'compare', label: 'Compare', icon: GitCompare, refSection: 'compare' },
    { id: 'investigate', label: 'Investigate', icon: ShieldAlert, refSection: 'investigate' },
    { id: 'query', label: 'Query Studio', icon: Search, refSection: 'query' },
    { id: 'catalog', label: 'Catalog Intel', icon: Database, refSection: 'catalog' },
    { id: 'mission', label: 'Mission Control', icon: Cpu, refSection: 'mission' },
    { id: 'governance', label: 'Governance', icon: ShieldCheck, refSection: 'governance' },
    { id: 'exports', label: 'Exports', icon: Download, refSection: 'exports' }
  ];

  const quickActions = [
    { id: 'upload-boq', label: 'Upload BOQ', icon: FileUp },
    { id: 'upload-bom', label: 'Upload BOM', icon: FileUp },
    { id: 'new-workspace', label: 'New Workspace', icon: PlusCircle },
    { id: 'query-studio', label: 'Query Studio', icon: Search }
  ];

  const handleNavClick = (itemId: string, refSection: string) => {
    setActiveSection(itemId);
    const element = document.getElementById(refSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside 
      id="app-sidebar"
      className={`fixed top-0 left-0 h-screen z-50 flex flex-col justify-between 
        bg-white border-r border-slate-200 text-slate-600 transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Top Brand Logo */}
      <div>
        <div className="flex items-center gap-3 p-4 border-b border-slate-100 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
            <div className="w-3.5 h-3.5 bg-white rounded-sm rotate-45"></div>
          </div>
          {!collapsed && (
            <div className="flex flex-col whitespace-nowrap">
              <span className="text-slate-800 font-bold text-sm tracking-tight">STRATOS</span>
              <span className="text-[10px] text-slate-400 font-medium">Intelligence Platform</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id, item.refSection)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative cursor-pointer
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-indigo-600" />
                )}
                <IconComponent className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-100">
            <h5 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-3">
              Quick Actions
            </h5>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const ActIcon = action.icon;
                return (
                  <button
                    key={action.id}
                    id={`action-${action.id}`}
                    onClick={() => onQuickAction(action.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border border-slate-100 hover:border-indigo-500 hover:text-indigo-700 hover:bg-indigo-50/50 text-slate-500 transition-all text-left cursor-pointer"
                  >
                    <ActIcon className="w-3.5 h-3.5 text-indigo-600/70" />
                    <span className="truncate">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        {/* Toggle Dark/Light Accent (Only shows on sidebar collapse/expand nicely) */}
        {!collapsed && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
            <span className="text-slate-500 font-medium font-sans">Theme Mode</span>
            <button 
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1 rounded bg-slate-200/60 text-indigo-600 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Toggle Accent Accent Scheme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        <button 
          id="sidebar-help-btn"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-50 hover:text-slate-800 transition-colors text-left cursor-pointer"
        >
          <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
          {!collapsed && <span className="text-xs text-slate-500">Help & Docs</span>}
        </button>

        <button 
          id="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-4.5 h-4.5" />
          ) : (
            <div className="flex items-center gap-3">
              <ChevronLeft className="w-4.5 h-4.5" />
              <span className="text-xs">Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
