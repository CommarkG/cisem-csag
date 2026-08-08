import React, { useState, useEffect } from "react";

interface MenuItem {
  id: string;
  name: string;
  children?: MenuItem[];
}

interface DynamicMenuProps {
  activeRole: "guest" | "buyer" | "partner" | "operator_admin";
  onRoleChange: (role: "guest" | "buyer" | "partner" | "operator_admin") => void;
  wishlistCount: number;
  onHelpClick: () => void;
  onBacklogClick: () => void;
  onSelectCategory: (groupId: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  mounted: boolean;
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
  mounted
}: DynamicMenuProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/menu/dynamic")
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left branding */}
          <div className="flex items-center gap-2">
            <span
              onClick={() => onSelectCategory("home")}
              className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              COMMARK UBOP
            </span>
            <span className="hidden md:inline-flex items-center rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">
              B2B Portal
            </span>
          </div>

          {/* Center Category navigation links */}
          <nav className="hidden md:flex space-x-6 items-center" dir="rtl">

            {/* 🎮 Sandbox Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-500 transition-colors py-5 gap-1"
              >
                <span>🎮 Sandbox</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[240px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 flex flex-col gap-2 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-1 text-right">
                  ארגז חול (Sandbox)
                </span>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  🌐 Website Prototype
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  📄 Landing Page
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  💼 CRM Stacker
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  📣 Social Banner Studio
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  📚 Knowledge Hub
                </button>
                <button
                  onClick={() => onSelectCategory("sandbox_playground")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                >
                  📝 Vocabulary & Axioms
                </button>
              </div>
            </div>
            
            {/* 1. 🛠️ Tools Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-500 transition-colors py-5 gap-1"
              >
                <span>🛠️ Tools</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[540px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 grid grid-cols-2 gap-6 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
                {/* Column 1: Image Processing Suite */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-1">
                    Marketing ➔ Studio ➔ Image
                  </span>
                  <button
                    onClick={() => onSelectCategory("sandbox_playground")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    💎 Normalizer
                  </button>
                  <button
                    onClick={() => onSelectCategory("sandbox_playground")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    📊 Batch Auditor
                  </button>
                  <button
                    onClick={() => onSelectCategory("sandbox_playground")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    📐 Shape Library
                  </button>
                  <button
                    onClick={() => onSelectCategory("sandbox_playground")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    📁 Folder Manager
                  </button>
                  <button
                    onClick={() => onSelectCategory("sandbox_playground")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    💡 Learning Lab
                  </button>
                  <button
                    onClick={() => onSelectCategory("sandbox_playground")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    🛠️ Diagnostics
                  </button>
                </div>

                {/* Column 2: B2B Catalog (Supabase Dynamic) */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-1">
                    B2B Catalog Groups
                  </span>
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectCategory(item.id)}
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                    >
                      🎁 {item.name}
                    </button>
                  ))}
                  {menuItems.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No groups loaded.</span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. 🏛️ Gov Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-500 transition-colors py-5 gap-1"
              >
                <span>🏛️ Gov</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[480px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 grid grid-cols-2 gap-6 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
                {/* Column 1: Schema & Rules */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-1">
                    Schemas & Audits
                  </span>
                  <button
                    onClick={() => onSelectCategory("human_schema")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    📋 Schema (Human Logic)
                  </button>
                  <button
                    onClick={() => onSelectCategory("system_schema")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    💾 Schema (System Logic)
                  </button>
                  <button
                    onClick={onHelpClick}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    🤖 AI Behavior & Personas
                  </button>
                </div>

                {/* Column 2: Accountability & Guides */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-1">
                    Loops & Safety
                  </span>
                  <button
                    onClick={onBacklogClick}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    🔄 Learning Loops (Backlog)
                  </button>
                  <button
                    onClick={() => onSelectCategory("threshold")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    🚦 Threshold Input Gate
                  </button>
                  <button
                    onClick={onHelpClick}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    ❓ Help & Tutorials
                  </button>
                </div>
              </div>
            </div>

            {/* 3. 📐 Arch Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-500 transition-colors py-5 gap-1"
              >
                <span>📐 Arch</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[400px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 grid grid-cols-2 gap-6 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
                {/* Column 1: UI & Flow */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-1">
                    Design & Diffs
                  </span>
                  <button
                    onClick={() => onSelectCategory("design_studio")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    🎨 UX UI Studio
                  </button>
                  <button
                    onClick={() => onSelectCategory("traceability_spec")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    🧬 Pipelines & Trace
                  </button>
                </div>

                {/* Column 2: Capabilities */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-1">
                    Trunks & Adapt
                  </span>
                  <button
                    onClick={() => onSelectCategory("agents_skills")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    🔌 Agents & Skills
                  </button>
                  <button
                    onClick={() => onSelectCategory("protocols_wizards")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    ⚙️ Protocols & specs
                  </button>
                </div>
              </div>
            </div>

            {/* 4. 🔌 Ext Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-500 transition-colors py-5 gap-1"
              >
                <span>🔌 Ext</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute right-0 top-full w-[400px] rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 grid grid-cols-2 gap-6 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
                {/* Column 1: Models */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-1">
                    AI Solutions
                  </span>
                  <button
                    onClick={() => onSelectCategory("api_providers")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    ☁️ AI Providers
                  </button>
                  <button
                    onClick={() => onSelectCategory("matting_models")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    ✂️ Matting Models
                  </button>
                </div>

                {/* Column 2: Storage & Sync */}
                <div className="flex flex-col gap-2 text-right">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-1">
                    Infrastructure
                  </span>
                  <button
                    onClick={() => onSelectCategory("storage_cdn")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    📦 Storage & CDNs
                  </button>
                  <button
                    onClick={() => onSelectCategory("data_integrations")}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-500 text-right py-1 transition-all hover:translate-x-[-4px]"
                  >
                    🔌 Data Integrations
                  </button>
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
              <span className="text-sm font-medium flex items-center gap-1">
                ❓ <span className="hidden sm:inline">מדריכים</span>
              </span>
            </button>

            {/* Backlog Button */}
            <button
              onClick={onBacklogClick}
              className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
              title="Backlog Feedback Hub"
            >
              <span className="text-sm font-medium flex items-center gap-1">
                💡 <span className="hidden sm:inline">רעיונות</span>
              </span>
            </button>

            {/* Wishlist Button */}
            <div className="relative">
              <span className="text-lg cursor-pointer hover:scale-110 transition-transform block">
                ❤️
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </div>

            {/* Theme switcher */}
            <button
              onClick={toggleDarkMode}
              className="text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors text-lg"
            >
              {!mounted ? "" : (isDarkMode ? "☀️" : "🌙")}
            </button>

            {/* Dynamic Role Switcher Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 p-1 bg-slate-50 dark:bg-slate-900 hover:ring-2 hover:ring-amber-500/50 transition-all duration-300">
                <span className="h-7 w-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {activeRole.substring(0, 2)}
                </span>
                <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-300 px-1 capitalize">
                  {activeRole.replace("_", " ")}
                </span>
              </button>

              <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 hidden group-hover:block z-50">
                {[
                  { id: "guest", label: "Anonymous Guest" },
                  { id: "buyer", label: "Standard Client" },
                  { id: "partner", label: "Partner Tenant" },
                  { id: "operator_admin", label: "Operator Admin" }
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => onRoleChange(role.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      activeRole === role.id
                        ? "bg-amber-500/10 text-amber-500"
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
