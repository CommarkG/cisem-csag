/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260811-HEADER-UNIFICATION
# governor_signature: GOV-YARIV-20260811-HEADER-UNIFICATION-V1.0
# version: V1.3
# reasoning: |
#   Integrate navigation stack history indices, custom breadcrumb icon mappings, and bilingual
#   locales directly into DynamicMenu, eliminating the redundant second-row breadcrumbs list.
#   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >PR-13500.
# */

"use client";

import React, { useState, useEffect } from "react";
import DynamicMenu from "../../components/dynamic_menu";
import { AgentChatWidget } from "../../components/agent_chat_widget";
import { Home, Layers, Shield, Briefcase, ShoppingBag, Database } from "lucide-react";

// Import modular view components
import HomeView from "../../components/views/HomeView";
import B2bHubView from "../../components/views/B2bHubView";
import WhitelabelView from "../../components/views/WhitelabelView";
import SystemSchemaView from "../../components/views/SystemSchemaView";

// Import locales
import en from "../../locales/en.json";
import he from "../../locales/he.json";

export default function OldB2bPage() {
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<"en" | "he">("he");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentMenu, setCurrentMenu] = useState<string>("home");

  // History stack states for back/forward navigation
  const [historyStack, setHistoryStack] = useState<string[]>(["home"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Initialize theme and mounted state, and parse query parameters
  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const menuParam = params.get("menu");
      if (menuParam) {
        setCurrentMenu(menuParam);
        setHistoryStack(["home", menuParam]);
        setHistoryIndex(1);
      }
    }
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  if (!mounted) return null;

  const dict = locale === "he" ? he : en;
  const isRTL = locale === "he";

  // Handle menu selection and update navigation history stack
  const handleSelectCategory = (groupId: string) => {
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(groupId);
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);
    setCurrentMenu(groupId);
  };

  // History navigation buttons click handlers
  const handleGoBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentMenu(historyStack[newIndex]);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < historyStack.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentMenu(historyStack[newIndex]);
    }
  };

  const getBreadcrumbIcon = (name: string) => {
    const s = "w-3 h-3 text-slate-500 dark:text-slate-400";
    if (name === "Home" || name === "בית" || name === (dict.breadcrumb_home || "Home")) return <Home className={s} />;
    if (name === "Ext" || name === (dict.breadcrumb_ext || "Ext")) return <Layers className={s} />;
    if (name === "Arch") return <Database className={s} />;
    if (name === "Gov") return <Shield className={s} />;
    if (name === "Business" || name === (dict.breadcrumb_business || "Business")) return <Briefcase className={s} />;
    if (name === "Pricing and Purchasing" || name === "תמחור ורכש" || name === (dict.purchasing_quotes_hub || "Pricing and Purchasing")) return <ShoppingBag className={s} />;
    if (name === "Storefront Whitelabel") return <Layers className={s} />;
    if (name === "Schema & DDL") return <Database className={s} />;
    if (name === "Threshold & LGG") return <Shield className={s} />;
    return <Layers className={s} />;
  };

  // Determine active breadcrumb path list
  const getBreadcrumbs = () => {
    const list = [dict.breadcrumb_home || "Home"];
    const isB2B = [
      "purchasing_quotes_hub",
      "brief_clarifier",
      "catalog_manager",
      "crm_pipeline",
      "supplier_registry",
      "design_studio"
    ].includes(currentMenu);

    if (isB2B) {
      list.push(dict.breadcrumb_ext || "Ext");
      list.push(dict.breadcrumb_business || "Business");
      list.push(dict.purchasing_quotes_hub || "Pricing and Purchasing");
    } else if (currentMenu === "whitelabel") {
      list.push(dict.breadcrumb_ext || "Ext");
      list.push("Storefront Whitelabel");
    } else if (currentMenu === "system_schema") {
      list.push("Arch");
      list.push("Schema & DDL");
    } else if (currentMenu === "threshold") {
      list.push("Gov");
      list.push("Threshold & LGG");
    }
    return list;
  };

  const breadcrumbsList = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/20 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      <DynamicMenu
        activeRole="operator_admin"
        onRoleChange={() => {}}
        wishlistCount={0}
        onHelpClick={() => {}}
        onBacklogClick={() => {}}
        onSelectCategory={handleSelectCategory}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        mounted={mounted}
        locale={locale}
        onLocaleChange={setLocale}
        historyIndex={historyIndex}
        historyLength={historyStack.length}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        breadcrumbsList={breadcrumbsList}
        getBreadcrumbIcon={getBreadcrumbIcon}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dynamic viewport renderer based on menu selection */}
        <div className="fade-in duration-300">
          {currentMenu === "home" && (
            <HomeView isDarkMode={isDarkMode} activeRole="operator_admin" locale={locale} dict={dict} />
          )}

          {currentMenu === "threshold" && (
            <HomeView isDarkMode={isDarkMode} activeRole="operator_admin" locale={locale} dict={dict} />
          )}

          {[
            "purchasing_quotes_hub",
            "brief_clarifier",
            "catalog_manager",
            "crm_pipeline",
            "supplier_registry",
            "design_studio"
          ].includes(currentMenu) && (
            <B2bHubView
              isDarkMode={isDarkMode}
              locale={locale}
              dict={dict}
              initialTab={
                (currentMenu === "purchasing_quotes_hub"
                  ? "brief"
                  : currentMenu === "brief_clarifier"
                  ? "brief"
                  : currentMenu === "catalog_manager"
                  ? "catalog"
                  : currentMenu === "crm_pipeline"
                  ? "crm"
                  : currentMenu === "supplier_registry"
                  ? "suppliers"
                  : "design") as any
              }
            />
          )}

          {currentMenu === "whitelabel" && (
            <WhitelabelView isDarkMode={isDarkMode} locale={locale} dict={dict} />
          )}

          {currentMenu === "system_schema" && (
            <SystemSchemaView isDarkMode={isDarkMode} locale={locale} dict={dict} />
          )}
        </div>
      </main>

      <AgentChatWidget tenantId="cisem-local" />
    </div>
  );
}
