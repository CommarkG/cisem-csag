// Ratified Plan: CISEM-IP-20260810-FRONTEND-PLAYBOOK-REFACTOR
// Architectural Reasoning: Master tab routing and viewport rendering engine for the B2B supplier management platform.
// Parent Principles: PR-13990 (Sandbox Boundaries), AX-50000.
// @playbook_category: Design Token

"use client";

import dynamic from "next/dynamic";

const DimaApp = dynamic(() => import("../components/DimaAppWrapper"), {
  ssr: false,
});

export default function Page() {
  return <DimaApp />;
}
