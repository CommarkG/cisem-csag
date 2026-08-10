"use client";
/**
 * # CISEM CODE HEADER > MANDATORY
 * # ratified_plan: CISEM-IP-20260810-CONSOLIDATED-MASTER-V17
 * # governor_signature: GOV-YARIV-20260810-GOVERNANCE-HARDENING-RATIFIED
 * # version: V1.0
 * # reasoning: |
 * #   Isolated sandbox preview routing page for displaying UI design templates
 * #   with theme, spacing, and dark mode configuration controls.
 * #   Parent principles: AxiomsAndPrinciples V1.30 >AX-10000, >AX-50000.
 */

import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Block {
  id: string;
  type: "hero" | "features" | "stats" | "pricing" | "cta" | "footer";
  title: string;
  subtitle: string;
  content?: string;
  items?: Array<{ title: string; desc: string; val?: string }>;
}

export default function Page({ params }: { params: Promise<{ sample: string }> }) {
  const resolvedParams = use(params);
  const sample = resolvedParams.sample;

  const [mounted, setMounted] = useState(false);
  const [studioTheme, setStudioTheme] = useState<"slate" | "emerald" | "indigo" | "amber" | "ruby">("indigo");
  const [studioDensity, setStudioDensity] = useState<"balanced" | "condensed">("balanced");
  const [studioMode, setStudioMode] = useState<"light" | "dark">("dark");
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Default block setups based on the sample layout
  useEffect(() => {
    setMounted(true);
    // Initialize default templates based on sample name
    if (sample === "marketing-hub") {
      setBlocks([
        {
          id: "hero-1",
          type: "hero",
          title: "SaaS Ingestion Pipeline Portal",
          subtitle: "Streamline multi-tenant data absorption and dynamic compliance reporting.",
        },
        {
          id: "stats-1",
          type: "stats",
          title: "Real-time Verification Metrics",
          subtitle: "Continuous verification engine status and latency logs.",
          items: [
            { title: "Performance", val: "99.99%", desc: "Compilation gate success" },
            { title: "Latency", val: "8ms", desc: "Average response window" },
            { title: "Blast Radius", val: "0.0%", desc: "Zero unintended registry drift" }
          ]
        },
        {
          id: "features-1",
          type: "features",
          title: "Platform Capability Matrices",
          subtitle: "Hardened compiler guarantees enforcing mechanical consensus.",
          items: [
            { title: "Asymmetric Verification", desc: "Ed25519 signature checks validating tenant payloads without storing keys." },
            { title: "Continuous Auditing", desc: "Non-blocking background daemons executing validation tasks on change." },
            { title: "Registry Ingestion", desc: "Federated registry structures decoupling template files from root registry bloat." }
          ]
        },
        {
          id: "cta-1",
          type: "cta",
          title: "Start Automating Your Compliance Gating",
          subtitle: "Deploy the continuous audit daemon to resolve all workspace conflicts automatically.",
        }
      ]);
    } else {
      // General Fallback Layout
      setBlocks([
        {
          id: "hero-gen",
          type: "hero",
          title: "Custom UI Component Workspace",
          subtitle: `Isolated preview mode running sample: '${sample}'`,
        },
        {
          id: "features-gen",
          type: "features",
          title: "Custom Grid Component",
          subtitle: "A modern three-column grid layout for visual blocks.",
          items: [
            { title: "Flexible Density", desc: "Dynamic spacing rules responsive to balance or condensed modifiers." },
            { title: "Visual Preset Preserves", desc: "Apply bespoke color themes directly to CSS variables." },
            { title: "Animation Engine", desc: "Powered by Framer Motion for rich interactions and micro-animations." }
          ]
        },
        {
          id: "footer-gen",
          type: "footer",
          title: "CISEM AntiGravity © 2026",
          subtitle: "Continuous compliance tracking platform."
        }
      ]);
    }
  }, [sample]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-red-500 mx-auto"></div>
          <p className="text-xs font-mono tracking-widest text-zinc-400">LOADING SANDBOX CANVAS...</p>
        </div>
      </div>
    );
  }

  const addBlock = (type: Block["type"]) => {
    const newId = `${type}-${Date.now()}`;
    const newBlock: Block = {
      id: newId,
      type,
      title: `New ${type.toUpperCase()} Section`,
      subtitle: "Click text to edit or rearrange positioning.",
      items: type === "features" || type === "stats" ? [
        { title: "Sample Title 1", desc: "Sample description text for visual proof.", val: "100%" },
        { title: "Sample Title 2", desc: "Sample description text for visual proof.", val: "24/7" },
        { title: "Sample Title 3", desc: "Sample description text for visual proof.", val: "0ms" }
      ] : undefined
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= blocks.length) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setBlocks(updated);
  };

  const updateBlockValue = (id: string, key: "title" | "subtitle", val: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [key]: val } : b));
  };

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans transition-all`}>
      {/* Top Banner Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white font-black text-xs px-2.5 py-1 uppercase tracking-widest">
            CISEM SANDBOX
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-200">
              [sample: {sample}]
            </h1>
            <p className="text-[10px] text-zinc-400 font-mono">
              CISEM-IP-20260810-CONSOLIDATED-MASTER-V17
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-xs font-bold text-zinc-400 hover:text-white transition-all"
          >
            ← Back to Dashboard
          </a>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 p-6 max-w-7xl mx-auto w-full">
        {/* Left Side: Control Panel */}
        <div className="xl:col-span-1 space-y-6">
          {/* Preset Colors */}
          <div className="border border-zinc-800 bg-zinc-900/40 p-5 rounded-none shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Theme Presets (Axis B)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "slate", label: "Silver Slate", color: "bg-slate-500" },
                { id: "emerald", label: "Forest Emerald", color: "bg-emerald-500" },
                { id: "indigo", label: "Amethyst Indigo", color: "bg-indigo-500" },
                { id: "amber", label: "Rust Amber", color: "bg-amber-500" },
                { id: "ruby", label: "Delicate Ruby", color: "bg-red-500" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setStudioTheme(t.id as any)}
                  className={`flex items-center gap-2 p-2 border text-xs font-bold transition-all ${
                    studioTheme === t.id
                      ? "border-red-600 bg-red-600/10 text-red-500"
                      : "border-zinc-800 hover:bg-zinc-800/40 text-zinc-300"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Density Presets */}
          <div className="border border-zinc-800 bg-zinc-900/40 p-5 rounded-none shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Density Scale (Axis A)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "balanced", label: "Balanced Mode" },
                { id: "condensed", label: "Condensed Mode" }
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setStudioDensity(d.id as any)}
                  className={`p-2 border text-xs font-bold text-center transition-all ${
                    studioDensity === d.id
                      ? "border-red-600 bg-red-600/10 text-red-500"
                      : "border-zinc-800 hover:bg-zinc-800/40 text-zinc-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Mode */}
          <div className="border border-zinc-800 bg-zinc-900/40 p-5 rounded-none shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Visual Mode
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "light", label: "☀️ Light" },
                { id: "dark", label: "🌙 Dark" }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setStudioMode(m.id as any)}
                  className={`p-2 border text-xs font-bold text-center transition-all ${
                    studioMode === m.id
                      ? "border-red-600 bg-red-600/10 text-red-500"
                      : "border-zinc-800 hover:bg-zinc-800/40 text-zinc-300"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add Components Palette */}
          <div className="border border-zinc-800 bg-zinc-900/40 p-5 rounded-none shadow-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Add Layout Block
            </h3>
            <div className="space-y-2">
              {[
                { type: "hero", label: "Hero Banner" },
                { type: "features", label: "Features Grid" },
                { type: "stats", label: "Stats Counter" },
                { type: "cta", label: "Call-to-Action" },
                { type: "footer", label: "Simple Footer" }
              ].map((b) => (
                <button
                  key={b.type}
                  onClick={() => addBlock(b.type as any)}
                  className="w-full text-left p-2 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/20 text-xs font-bold flex justify-between items-center transition-all"
                >
                  <span>{b.label}</span>
                  <span className="text-red-500 font-extrabold">+</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Sandbox Viewport Canvas */}
        <div className="xl:col-span-3 flex flex-col border border-zinc-800 bg-zinc-900/20 shadow-xl min-h-[600px]">
          {/* Viewport Top Bar */}
          <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
              isolated-canvas-viewport ({studioTheme} / {studioDensity})
            </span>
          </div>

          {/* Canvas Output Container */}
          <div
            id="canvas-viewport"
            className={`design-studio-preview theme-${studioTheme} density-${studioDensity} ${
              studioMode === "dark" ? "dark" : ""
            } p-8 flex-1 transition-all bg-[var(--color-background-preview)] text-[var(--color-foreground-preview)]`}
          >
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border border-dashed border-zinc-800 rounded-none">
                <span className="text-4xl mb-4">🎨</span>
                <h3 className="text-sm font-bold text-zinc-400">Your Canvas is Empty</h3>
                <p className="text-[10px] text-zinc-500 mt-1 max-w-xs leading-relaxed">
                  Select visual blocks from the left palette to compose your dynamic interface.
                </p>
              </div>
            ) : (
              <div className="space-y-[var(--spacing-multiplier)]">
                <AnimatePresence initial={false}>
                  {blocks.map((block, idx) => {
                    const isFirst = idx === 0;
                    const isLast = idx === blocks.length - 1;
                    return (
                      <motion.div
                        key={block.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="relative group border border-dashed border-[var(--color-border-custom)] p-6 rounded-[var(--radius-base)] bg-[var(--color-surface)] shadow-sm hover:ring-1 hover:ring-red-500/30 transition-all text-left"
                      >
                        {/* Control actions for rearranging */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                          <button
                            disabled={isFirst}
                            onClick={() => moveBlock(idx, "up")}
                            className="p-1 rounded bg-[var(--color-primary-bg)] text-[var(--color-primary)] border border-[var(--color-border-custom)] text-[10px] font-bold disabled:opacity-30 hover:bg-red-600 hover:text-white"
                          >
                            ▲
                          </button>
                          <button
                            disabled={isLast}
                            onClick={() => moveBlock(idx, "down")}
                            className="p-1 rounded bg-[var(--color-primary-bg)] text-[var(--color-primary)] border border-[var(--color-border-custom)] text-[10px] font-bold disabled:opacity-30 hover:bg-red-600 hover:text-white"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => removeBlock(block.id)}
                            className="p-1 rounded bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold hover:bg-red-200"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Rendering Blocks */}
                        {block.type === "hero" && (
                          <div className="text-center py-6">
                            <input
                              type="text"
                              value={block.title}
                              onChange={(e) => updateBlockValue(block.id, "title", e.target.value)}
                              className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-red-600 outline-none text-xl font-extrabold tracking-tight text-[var(--color-foreground-preview)] font-sans"
                            />
                            <input
                              type="text"
                              value={block.subtitle}
                              onChange={(e) => updateBlockValue(block.id, "subtitle", e.target.value)}
                              className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-red-600 outline-none text-[10px] text-slate-400 mt-2 font-semibold"
                            />
                            <div className="mt-4 flex justify-center gap-3">
                              <button className="px-4 py-2 rounded-[var(--radius-base)] bg-[var(--color-primary)] text-[var(--color-surface)] hover:bg-[var(--color-primary-hover)] text-[10px] font-bold transition-all shadow-sm">
                                Get Started
                              </button>
                              <button className="px-4 py-2 rounded-[var(--radius-base)] bg-[var(--color-primary-bg)] text-[var(--color-primary)] hover:opacity-85 text-[10px] font-bold transition-all">
                                Learn More
                              </button>
                            </div>
                          </div>
                        )}

                        {block.type === "features" && (
                          <div className="space-y-4">
                            <div className="text-center">
                              <input
                                type="text"
                                value={block.title}
                                onChange={(e) => updateBlockValue(block.id, "title", e.target.value)}
                                className="bg-transparent text-center border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-red-600 outline-none text-sm font-bold text-[var(--color-foreground-preview)]"
                              />
                              <input
                                type="text"
                                value={block.subtitle}
                                onChange={(e) => updateBlockValue(block.id, "subtitle", e.target.value)}
                                className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-red-600 outline-none text-[10px] text-slate-400 mt-1"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {(block.items || []).map((item, i) => (
                                <div key={i} className="p-3 border border-[var(--color-border-custom)] rounded-[var(--radius-base)]">
                                  <h4 className="text-xs font-bold text-[var(--color-primary)]">{item.title}</h4>
                                  <p className="text-[9px] text-slate-400 mt-1 leading-normal">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {block.type === "stats" && (
                          <div className="py-4">
                            <input
                              type="text"
                              value={block.title}
                              onChange={(e) => updateBlockValue(block.id, "title", e.target.value)}
                              className="w-full bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-red-600 outline-none text-xs font-bold text-center text-[var(--color-primary)] mb-4 uppercase tracking-wider"
                            />
                            <div className="grid grid-cols-3 gap-4 text-center">
                              {(block.items || []).map((stat, i) => (
                                <div key={i} className="p-3 rounded-none bg-[var(--color-primary-bg)]">
                                  <div className="text-lg font-extrabold text-[var(--color-foreground-preview)]">{stat.val}</div>
                                  <div className="text-[9px] text-slate-400 font-semibold">{stat.title}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {block.type === "cta" && (
                          <div className="text-center py-6 bg-[var(--color-primary-bg)] rounded-[var(--radius-base)] p-6">
                            <input
                              type="text"
                              value={block.title}
                              onChange={(e) => updateBlockValue(block.id, "title", e.target.value)}
                              className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-red-600 outline-none text-base font-bold text-[var(--color-foreground-preview)]"
                            />
                            <input
                              type="text"
                              value={block.subtitle}
                              onChange={(e) => updateBlockValue(block.id, "subtitle", e.target.value)}
                              className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-red-600 outline-none text-[10px] text-slate-400 mt-1"
                            />
                            <button className="mt-4 px-5 py-2.5 rounded-[var(--radius-base)] bg-[var(--color-primary)] text-[var(--color-surface)] hover:bg-[var(--color-primary-hover)] text-xs font-bold transition-all shadow-md">
                              Action Authorization Ingestion
                            </button>
                          </div>
                        )}

                        {block.type === "footer" && (
                          <div className="text-center py-4 border-t border-[var(--color-border-custom)]">
                            <input
                              type="text"
                              value={block.title}
                              onChange={(e) => updateBlockValue(block.id, "title", e.target.value)}
                              className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-red-600 outline-none text-[10px] font-bold text-[var(--color-foreground-preview)]"
                            />
                            <input
                              type="text"
                              value={block.subtitle}
                              onChange={(e) => updateBlockValue(block.id, "subtitle", e.target.value)}
                              className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-red-600 outline-none text-[8px] text-slate-400 mt-1"
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
