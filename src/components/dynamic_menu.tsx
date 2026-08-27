/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: DISPUTED-PROVENANCE-FABRICATED
# original_claimed_plan: CISEM-IP-20260811-HEADER-UNIFICATION [UNVERIFIED]
# original_claimed_signature: GOV-YARIV-20260811-HEADER-UNIFICATION-V1 [UNVERIFIED]
# status: DISPUTED_PROVENANCE_FABRICATED
# history:
#   - timestamp: "2026-08-23T07:52:00Z"
#     ratified_plan: CISEM-IP-20260822-PEOPLE-PLACES-FILES
#     governor_signature: GOV-YARIV-20260823-PEOPLE-PLACES-FILES-V19
#     reasoning: "Original plan ID flagged as un-manifested synthetic header during V19 audit; re-ratified under V19."
*/
// @playbook_category: Micro-interaction Module

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  children?: MenuItem[];
}

interface DynamicMenuProps {
  activeRole: "guest" | "buyer" | "partner" | "platform_admin";
  onRoleChange: (role: "guest" | "buyer" | "partner" | "platform_admin") => void;
  wishlistCount: number;
  onHelpClick: () => void;
  onBacklogClick: () => void;
  onSelectCategory: (groupId: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  mounted: boolean;

  // Navigation extension props:
  locale?: "en" | "he";
  onLocaleChange?: (locale: "en" | "he") => void;
  historyIndex?: number;
  historyLength?: number;
  onGoBack?: () => void;
  onGoForward?: () => void;
  breadcrumbsList?: string[];
  getBreadcrumbIcon?: (node: string) => React.ReactNode;
}

export default function DynamicMenu({
  activeRole,
  onRoleChange,
  wishlistCount,
  onHelpClick,
  onBacklogClick,
  onSelectCategory,
  isDarkMode,
  toggleDarkMode,
  mounted,

  locale = "he",
  onLocaleChange,
  historyIndex = 0,
  historyLength = 1,
  onGoBack,
  onGoForward,
  breadcrumbsList = [],
  getBreadcrumbIcon,
}: DynamicMenuProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch("/api/v1/menu/dynamic")
      .then((res) => {
        if (res.ok) return res.json();
        return { menu: [] };
      })
      .then((data) => {
        setMenuItems(data.menu || []);
      })
      .catch((err) => console.error("Error loading dynamic menu tree:", err));
  }, []);

  return (
    <header className="sticky top-0 z-[200] w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left branding */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span
              onClick={() => onSelectCategory("home")}
              className="text-xl font-extrabold text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-500 transition-colors duration-300 cursor-pointer flex-shrink-0"
            >
              Cisem CsAg
            </span>

            {/* Breadcrumbs with mandatory Crumbnails */}
            {breadcrumbsList && breadcrumbsList.length > 0 && (
              <div className="flex items-center gap-2 overflow-hidden text-xs font-semibold" dir={locale === "he" ? "rtl" : "ltr"}>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-800 mx-1 flex-shrink-0" />
                
                {/* Unified History buttons styled like Crumbnails */}
                <div className="inline-flex gap-1 flex-shrink-0">
                  <button
                    onClick={onGoBack}
                    disabled={historyIndex === 0}
                    className="h-5 w-5 p-0 inline-flex items-center justify-center rounded bg-indigo-500/15 dark:bg-violet-500/12 border border-slate-200/50 dark:border-slate-800/50 text-indigo-600 dark:text-violet-400 hover:bg-indigo-500/25 dark:hover:bg-violet-500/20 disabled:opacity-30 transition-all cursor-pointer"
                    title={locale === "he" ? "אחורה" : "Back"}
                  >
                    {locale === "he" ? <ChevronRight size={14} style={{ color: 'var(--accent)' }} /> : <ChevronLeft size={14} style={{ color: 'var(--accent)' }} />}
                  </button>
                  <button
                    onClick={onGoForward}
                    disabled={historyLength !== undefined && historyIndex !== undefined && historyIndex >= historyLength - 1}
                    className="h-5 w-5 p-0 inline-flex items-center justify-center rounded bg-indigo-500/15 dark:bg-violet-500/12 border border-slate-200/50 dark:border-slate-800/50 text-indigo-600 dark:text-violet-400 hover:bg-indigo-500/25 dark:hover:bg-violet-500/20 disabled:opacity-30 transition-all cursor-pointer"
                    title={locale === "he" ? "קדימה" : "Forward"}
                  >
                    {locale === "he" ? <ChevronLeft size={14} style={{ color: 'var(--accent)' }} /> : <ChevronRight size={14} style={{ color: 'var(--accent)' }} />}
                  </button>
                </div>

                <div className="h-4 w-px bg-slate-300 dark:bg-slate-800 mx-1 flex-shrink-0" />

                {/* Breadcrumbs trail */}
                <nav className="flex items-center gap-1.5 overflow-hidden text-slate-500 dark:text-slate-400">
                  {breadcrumbsList.map((node, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span className="text-[10px] text-slate-400 flex-shrink-0">/</span>}
                      <span className="inline-flex items-center gap-1.5 flex-shrink-0">
                        <span className="crumbnail-icon-wrapper inline-flex items-center justify-center p-0.5 rounded bg-indigo-500/15 dark:bg-violet-500/12 border border-slate-200/50 dark:border-slate-800/50 flex-shrink-0">
                          {getBreadcrumbIcon ? getBreadcrumbIcon(node) : null}
                        </span>
                        <span className={index === breadcrumbsList.length - 1 ? "text-slate-900 dark:text-white font-bold" : ""}>
                          {node}
                        </span>
                      </span>
                    </React.Fragment>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Center Category navigation links */}
          <nav className="hidden md:flex space-x-6 items-center" dir="rtl">

            {/* Sandbox Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-500 transition-colors py-5 gap-1"
              >
                <span>Sandbox</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[240px] glass-card-static p-4 flex flex-col gap-2 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-[300]">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1 text-right">
                  ארגז חול (Sandbox)
                </span>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Website Prototype
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Landing Page
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  CRM Stacker
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Social Banner Studio
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Knowledge Hub
                </button>
              </div>
            </div>

            {/* Tools Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-500 transition-colors py-5 gap-1"
              >
                <span>Tools</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[280px] glass-card-static p-6 flex flex-col gap-2 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-[300]">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1 text-right">
                  Marketing ➔ Studio ➔ Image
                </span>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Normalizer
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Batch Auditor
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Shape Library
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Folder Manager
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Learning Lab
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  Diagnostics
                </button>
              </div>
            </div>

            {/* Gov Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 hover:text-amber-500 dark:hover:text-amber-400 transition-all py-5 px-2.5 gap-1.5 border-b-2 border-transparent group-hover:border-amber-500"
              >
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-extrabold text-[11px]">Gov</span>
                <span>Governance</span>
                <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[480px] glass-card-static p-6 grid grid-cols-2 gap-6 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-[300] shadow-2xl rounded-b-xl border border-slate-200/80 dark:border-slate-800/80">
                {/* Column 1: Schemas & Audits */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>1. Schemas & Audits</span>
                    <span className="text-[9px] px-1 bg-indigo-100 dark:bg-indigo-900/40 rounded">Sub-Cat</span>
                  </span>
                  <div className="flex flex-col gap-1.5 pr-1">
                    <button
                      onClick={() => onSelectCategory("human_schema")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Schema (Human Logic)</span>
                    </button>
                    <button
                      onClick={() => onSelectCategory("system_schema")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Schema (System Logic)</span>
                    </button>
                    <button
                      onClick={onHelpClick}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>AI Behavior & Personas</span>
                    </button>
                  </div>
                </div>

                {/* Column 2: Loops & Safety */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>2. Loops & Safety</span>
                    <span className="text-[9px] px-1 bg-indigo-100 dark:bg-indigo-900/40 rounded">Sub-Cat</span>
                  </span>
                  <div className="flex flex-col gap-1.5 pr-1">
                    <button
                      onClick={onBacklogClick}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Learning Loops (Backlog)</span>
                    </button>
                    <button
                      onClick={() => onSelectCategory("threshold")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Threshold Input Gate</span>
                    </button>
                    <button
                      onClick={onHelpClick}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Help & Tutorials</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Arch Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 hover:text-amber-500 dark:hover:text-amber-400 transition-all py-5 px-2.5 gap-1.5 border-b-2 border-transparent group-hover:border-amber-500"
              >
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-[11px]">Arch</span>
                <span>Architecture</span>
                <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[460px] glass-card-static p-6 grid grid-cols-2 gap-6 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-[300] shadow-2xl rounded-b-xl border border-slate-200/80 dark:border-slate-800/80">
                {/* Column 1: Design & Diffs */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>1. Design & Diffs</span>
                    <span className="text-[9px] px-1 bg-amber-100 dark:bg-amber-900/40 rounded">Sub-Cat</span>
                  </span>
                  <div className="flex flex-col gap-1.5 pr-1">
                    <button
                      onClick={() => onSelectCategory("template_hub")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Template Hub</span>
                    </button>
                    <button
                      onClick={() => onSelectCategory("web_pages")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Web Pages</span>
                    </button>
                    <button
                      onClick={() => onSelectCategory("design_studio")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>UX UI Studio</span>
                    </button>
                    <button
                      onClick={() => onSelectCategory("traceability_spec")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Pipelines & Trace</span>
                    </button>
                  </div>
                </div>

                {/* Column 2: Capabilities */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>2. Trunks & Adapt</span>
                    <span className="text-[9px] px-1 bg-amber-100 dark:bg-amber-900/40 rounded">Sub-Cat</span>
                  </span>
                  <div className="flex flex-col gap-1.5 pr-1">
                    <button
                      onClick={() => onSelectCategory("agents_skills")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Agents & Skills</span>
                    </button>
                    <button
                      onClick={() => onSelectCategory("protocols_wizards")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Protocols & Specs</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ext Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 hover:text-amber-500 dark:hover:text-amber-400 transition-all py-5 px-2.5 gap-1.5 border-b-2 border-transparent group-hover:border-amber-500"
              >
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">Ext</span>
                <span>Extensions</span>
                <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[580px] glass-card-static p-6 grid grid-cols-3 gap-6 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-[300] shadow-2xl rounded-b-xl border border-slate-200/80 dark:border-slate-800/80">
                {/* Column 1: Business */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>1. Business</span>
                    <span className="text-[9px] px-1 bg-emerald-100 dark:bg-emerald-900/40 rounded">Sub-Cat</span>
                  </span>
                  <div className="flex flex-col gap-1.5 pr-1">
                    <button
                      onClick={() => onSelectCategory("purchasing_quotes_hub")}
                      className="group/item text-xs font-bold text-slate-900 dark:text-amber-400 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Pricing & Purchasing</span>
                    </button>
                    <button
                      onClick={() => onSelectCategory("onboarding")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Universal Onboarding</span>
                    </button>
                  </div>
                </div>

                {/* Column 2: Models */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>2. AI Solutions</span>
                    <span className="text-[9px] px-1 bg-emerald-100 dark:bg-emerald-900/40 rounded">Sub-Cat</span>
                  </span>
                  <div className="flex flex-col gap-1.5 pr-1">
                    <button
                      onClick={() => onSelectCategory("api_providers")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>AI Providers</span>
                    </button>
                    <button
                      onClick={() => onSelectCategory("matting_models")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Matting Models</span>
                    </button>
                  </div>
                </div>

                {/* Column 3: Storage & Sync */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>3. Infrastructure</span>
                    <span className="text-[9px] px-1 bg-emerald-100 dark:bg-emerald-900/40 rounded">Sub-Cat</span>
                  </span>
                  <div className="flex flex-col gap-1.5 pr-1">
                    <button
                      onClick={() => onSelectCategory("storage_cdn")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Storage & CDNs</span>
                    </button>
                    <button
                      onClick={() => onSelectCategory("data_integrations")}
                      className="group/item text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px] flex items-center justify-between"
                    >
                      <span className="text-[10px] text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity">➔</span>
                      <span>Data Integrations</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </nav>

          {/* Right actions and utilities */}
          <div className="flex items-center gap-4">
            {/* Help Button */}
            <button
              onClick={onHelpClick}
              className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
              title="Help & Onboarding Guides"
            >
              <span className="text-xs font-semibold flex items-center gap-1">
                <span className="hidden sm:inline">מדריכים</span>
              </span>
            </button>

            {/* Backlog Button */}
            <button
              onClick={onBacklogClick}
              className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
              title="Backlog Feedback Hub"
            >
              <span className="text-xs font-semibold flex items-center gap-1">
                <span className="hidden sm:inline">רעיונות</span>
              </span>
            </button>

            {/* Wishlist Button */}
            <div className="relative">
              <span className="text-xs font-semibold cursor-pointer hover:text-amber-500 transition-colors block">
                מועדפים
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center bg-amber-500 text-[9px] font-bold text-white rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>

            {/* Theme switcher */}
            <button
              onClick={toggleDarkMode}
              className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors text-xs font-semibold"
            >
              {!mounted ? "" : (isDarkMode ? "Light Mode" : "Dark Mode")}
            </button>

            {/* Bilingual language switcher */}
            <button
              onClick={() => onLocaleChange?.(locale === "he" ? "en" : "he")}
              className="text-slate-650 dark:text-slate-300 hover:text-amber-500 transition-colors text-xs font-semibold"
            >
              {locale === "he" ? "English" : "עברית"}
            </button>

            {/* Dynamic Role Switcher Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-900 hover:ring-2 hover:ring-amber-500/30 transition-all duration-300">
                <span className="h-7 w-7 rounded-full bg-slate-250 dark:bg-slate-800 border border-slate-350 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-850 dark:text-slate-200 uppercase">
                  {activeRole.substring(0, 2)}
                </span>
                <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-300 px-1 capitalize">
                  {activeRole.replace("_", " ")}
                </span>
              </button>

              <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 hidden group-hover:block z-[300]">
                {[
                  { id: "guest", label: "Anonymous Guest" },
                  { id: "buyer", label: "Standard Client" },
                  { id: "partner", label: "Partner Tenant" }
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => onRoleChange(role.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      activeRole === role.id
                        ? "bg-amber-500/10 text-amber-500 dark:bg-amber-500/10 dark:text-amber-500"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
