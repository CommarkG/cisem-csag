/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: PRE-RATIFICATION-LEGACY
# governor_signature: GOV-LEGACY-BASELINE
# status: PRE_RATIFICATION_LEGACY
# reasoning: |
#   File created prior to formal plan ratification governance. Preserved as legacy baseline.
*/
// Ratified Plan: CISEM-IP-20260810-FRONTEND-PLAYBOOK-REFACTOR
// Architectural Reasoning: Modular SQLite database schemas and CHECK constraints display viewport.
// Parent Principles: PR-13990 (Sandbox Boundaries), AX-50000

"use client";

import React from "react";

interface SystemSchemaViewProps {
  isDarkMode: boolean;
  locale: "en" | "he";
  dict: any;
}

export default function SystemSchemaView({ isDarkMode, locale, dict }: SystemSchemaViewProps) {
  const isRTL = locale === "he";

  return (
    <div className="space-y-6 text-right" dir={isRTL ? "rtl" : "ltr"}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {isRTL ? "סכמת מערכת ומגבלות מסד נתונים" : "System Database Schema Constraints"}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isRTL 
            ? "אכיפת תקינות נתונים ברמת בסיס הנתונים SQLite ו-CHECK constraints."
            : "Enforcing relational data integrity inside the SQLite database using SQL check constraints."}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800 pb-2 text-right">
          SQLite Table DDL Schema
        </h3>
        <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed text-left" dir="ltr">
          {`CREATE TABLE award_assets (
    id TEXT PRIMARY KEY,
    internal_sku TEXT UNIQUE NOT NULL,
    material TEXT NOT NULL,
    branding_tech TEXT NOT NULL,
    CONSTRAINT chk_branding_tech CHECK (
        branding_tech IN ('Surface_Etching', 'Laser_2D_Engraving', 'UV_Print_Back', 'Laser_3D_Engraving')
    ),
    CONSTRAINT chk_material CHECK (
        material IN ('Crystal_Optical', 'Acrylic_Clear', 'Wood_Natural', 'Metal_Gold_Plated')
    )
);`}
        </div>
      </div>
    </div>
  );
}
