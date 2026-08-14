// Ratified Plan: CISEM-IP-20260810-FRONTEND-PLAYBOOK-REFACTOR
// Architectural Reasoning: Consolidated B2B quotes and purchasing hub view with segregated right column glassmorphic sidebar and clean sub-tabs.
// Parent Principles: PR-13990 (Sandbox Boundaries), AX-50000

"use client";

import React, { useState } from "react";

interface B2bHubViewProps {
  isDarkMode: boolean;
  locale: "en" | "he";
  dict: any;
  initialTab?: "brief" | "catalog" | "crm" | "suppliers" | "design";
}

export default function B2bHubView({ isDarkMode, locale, dict, initialTab = "brief" }: B2bHubViewProps) {
  const [b2bTab, setB2bTab] = useState<"brief" | "catalog" | "crm" | "suppliers" | "design">(initialTab);
  const isRTL = locale === "he";

  // --- States for Brief Clarifier ---
  const [rawBrief, setRawBrief] = useState("");
  const [isQualifying, setIsQualifying] = useState(false);
  const [chunksList, setChunksList] = useState<any[]>([]);
  const [parsedConstraints, setParsedConstraints] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [margin, setMargin] = useState(35);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- States for Catalog Ingestion ---
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [excelInput, setExcelInput] = useState(`[
  {"sku": "BTI-BAG-1042", "title": "Luxurious Backpack Harvard", "price": 25.0, "category": "Bags"},
  {"sku": "BTI-TECH-2050", "title": "Polo Wooper Bluetooth Speaker", "price": 38.85, "category": "Gadgets"}
]`);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);

  // --- States for CRM Pipeline ---
  const [crmDeals, setCrmDeals] = useState<any[]>([
    { id: "deal-1", client: "High-Tech Solutions Netanya", agent: "Agent Droid", value: "₪18,500", stage: "Lead Ingestion", logs: "Scraped successfully" },
    { id: "deal-2", client: "Gal Casting Industries", agent: "Supervisor Droid", value: "₪32,400", stage: "Proposal Sent", logs: "Shared link sent" },
    { id: "deal-3", client: "Sderot Agriculture Labs", agent: "Agent Droid", value: "₪45,000", stage: "Closed Won", logs: "PDF generated and ratified" }
  ]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // --- States for Subcontractor Registry ---
  const [subcontractors, setSubcontractors] = useState<any[]>([
    { id: "sub-1", company_name: "Gal Laser Netanya", contact_name: "Gal", specialties: "laser_engraving", setup_fee: 150 },
    { id: "sub-2", company_name: "Silk Print Jerusalem", contact_name: "Rachel", specialties: "silk_print", setup_fee: 200 }
  ]);
  const [newSubcontractor, setNewSubcontractor] = useState({ company_name: "", contact_name: "", specialties: "laser_engraving", setup_fee: 150 });
  const [isCreatingSub, setIsCreatingSub] = useState(false);

  // --- States for Design Studio ---
  const [studioTheme, setStudioTheme] = useState<"slate" | "emerald" | "indigo" | "amber">("indigo");
  const [studioDensity, setStudioDensity] = useState<"balanced" | "condensed">("balanced");
  const [studioMode, setStudioMode] = useState<"light" | "dark">("dark");
  const [studioBlocks, setStudioBlocks] = useState<any[]>([
    { id: "b1", type: "hero", title: "Automated Compliance Pipelines", subtitle: "Verify structure, non-repudiation, and runtime gates in real time." },
    { id: "b2", type: "stats", title: "Scale Matrix", subtitle: "99.9% Uptime | 15ms Latency | 5 Subsystems" }
  ]);

  // --- Handlers ---
  const handleQualifyBrief = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawBrief.trim()) return;
    setIsQualifying(true);
    setTimeout(() => {
      setChunksList([
        { id: "c1", chunk_text: isRTL ? "דרושים 100 יחידות כוסות ממותגות" : "Required 100 branded cups", status_code: "PARSED" },
        { id: "c2", chunk_text: isRTL ? "אספקה מבוקשת עד תאריך 15/09/2026" : "Delivery requested by 15/09/2026", status_code: "MATCHED" }
      ]);
      setParsedConstraints({
        target_quantity: 100,
        budget_unit_max: 50,
        event_date: "15/09/2026",
        categories: ["Cups", "Branded"]
      });
      setIsQualifying(false);
    }, 1500);
  };

  const handleCatalogSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setSearchResults([
        { item: { id: "p1", internal_sku: "BTI-BAG-1042", title_he: "תיק גב יוקרתי - הרווארד", price: "25.0", category: "Bags", currency_code: "ILS" }, similarity: 0.95 },
        { item: { id: "p2", internal_sku: "BTI-TECH-2050", title_he: "רמקול POLO WOOPER", price: "38.85", category: "Gadgets", currency_code: "ILS" }, similarity: 0.88 }
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const handleGenerateProposal = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert(isRTL ? "קישור הצעה נוצר וסונכרן ל-CRM בהצלחה!" : "Proposal link created and synchronized with CRM successfully!");
    }, 1500);
  };

  const handleToggleWishlist = (sku: string) => {
    setWishlist(prev => prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]);
  };

  const handleBulkUploadExcel = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingExcel(true);
    setTimeout(() => {
      setIsUploadingExcel(false);
      alert(isRTL ? "גיליון נקלט בהצלחה בקטגוריות הקטלוג!" : "Price sheet ingested successfully!");
    }, 1000);
  };

  const handleCreateSubcontractor = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingSub(true);
    setTimeout(() => {
      setSubcontractors(prev => [...prev, { id: `sub-${Date.now()}`, ...newSubcontractor }]);
      setNewSubcontractor({ company_name: "", contact_name: "", specialties: "laser_engraving", setup_fee: 150 });
      setIsCreatingSub(false);
    }, 1000);
  };

  const addStudioBlock = (type: string) => {
    setStudioBlocks(prev => [
      ...prev,
      { id: `b-${Date.now()}`, type, title: `New ${type.toUpperCase()} Section`, subtitle: "Click to edit descriptions." }
    ]);
  };

  const removeStudioBlock = (id: string) => {
    setStudioBlocks(prev => prev.filter(b => b.id !== id));
  };

  const moveStudioBlock = (index: number, direction: "up" | "down") => {
    const nextIdx = direction === "up" ? index - 1 : index + 1;
    if (nextIdx < 0 || nextIdx >= studioBlocks.length) return;
    const updated = [...studioBlocks];
    const temp = updated[index];
    updated[index] = updated[nextIdx];
    updated[nextIdx] = temp;
    setStudioBlocks(updated);
  };

  const sidebarMenu = [
    { id: "brief", label: isRTL ? "קליטת בריף לקוח" : "Brief Clarifier", icon: "📝" },
    { id: "catalog", label: isRTL ? "ניהול קטלוג וחיפוש" : "Catalog Manager", icon: "📦" },
    { id: "crm", label: isRTL ? "צינור מכירות CRM" : "CRM & PDF Pipeline", icon: "💼" },
    { id: "suppliers", label: isRTL ? "קבלני משנה לעיצוב" : "Subcontractor Registry", icon: "🛠️" },
    { id: "design", label: isRTL ? "סטודיו לעיצוב מותג" : "Custom Design Studio", icon: "🎨" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* 1. Glassmorphic Navigation Sidebar - Right Column */}
      <aside className="lg:col-span-1 space-y-4">
        <div className="glass-card-static p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800/60 block text-right">
            {dict.purchasing_quotes_hub || "Pricing and Purchasing"}
          </span>
          {sidebarMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setB2bTab(item.id as any)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                b2bTab === item.id
                  ? "bg-amber-500 text-slate-950 shadow-md transform translate-x-[-4px]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. Sub-viewport Display Column - Left Column */}
      <main className="lg:col-span-3 space-y-6">
        
        {/* VIEWPORT: BRIEF CLARIFIER */}
        {b2bTab === "brief" && (
          <div className="space-y-6 text-right">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isRTL ? "קליטת בריף לקוח (Corporate Brief Ingestion)" : "Corporate Brief Ingestion"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL ? "הזן דרישות לקוח לניתוח כמויות, תאריכי יעד והתאמת מוצרים." : "Submit raw requirements to parse quantities, dates, and match gifts."}
              </p>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-right text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <strong>💡 {isRTL ? "המלצת פלטפורמה:" : "Platform Tip:"}</strong>{" "}
              {isRTL ? "הזן בריף לקוח לתוך תיבת הטקסט הירוקה המודגשת כדי לחתוך למשפטים מוגדרים." : "Input the client's raw brief text below to begin extraction."}
            </div>

            <form onSubmit={handleQualifyBrief} className="space-y-4">
              <textarea
                rows={5}
                required
                value={rawBrief}
                onChange={(e) => setRawBrief(e.target.value)}
                className="w-full rounded-xl border-2 border-emerald-500 focus:border-emerald-600 bg-white dark:bg-slate-950 p-4 text-xs outline-none text-slate-950 dark:text-white"
                placeholder={isRTL ? "למשל: אנו זקוקים ל-100 תיקים עם לוגו כסף לחלוקה בתאריך 15.09" : "e.g. We need 100 bags with silver engraving by 15.09..."}
              />
              <button
                type="submit"
                disabled={isQualifying}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 py-3 text-xs font-bold text-slate-950 transition-all disabled:opacity-50"
              >
                {isQualifying ? (isRTL ? "מנתח נתונים..." : "Parsing...") : (isRTL ? "נתח דרישות והפק סגמנטים" : "Analyze Brief & Generate Chunks")}
              </button>
            </form>

            {chunksList.length > 0 && (
              <div className="glass-card-static p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isRTL ? "חלקי סגמנטים מנותחים" : "Segmented Brief Chunks"}</h3>
                <div className="space-y-2">
                  {chunksList.map((chunk) => (
                    <div key={chunk.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 flex justify-between items-center text-xs">
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-mono">{chunk.status_code}</span>
                      <span className="text-slate-800 dark:text-slate-200">{chunk.chunk_text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedConstraints && (
              <div className="glass-card-static p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isRTL ? "אילוצי רכש שחולצו" : "Extracted Brief Constraints"}</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-850">
                    <span className="text-slate-400 block mb-1">{isRTL ? "כמות יעד" : "Target Qty"}</span>
                    <span className="text-base font-bold font-mono">{parsedConstraints.target_quantity}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-850">
                    <span className="text-slate-400 block mb-1">{isRTL ? "תאריך יעד" : "Target Date"}</span>
                    <span className="text-sm font-bold font-mono">{parsedConstraints.event_date}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCatalogSearch}
                  disabled={isSearching}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                >
                  {isSearching ? (isRTL ? "מבצע התאמה..." : "Matching...") : (isRTL ? "בצע התאמה מושכלת לקטלוג" : "Match in-stock Catalog Gifts")}
                </button>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="glass-card-static p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isRTL ? "מתנות מתאימות" : "Matched Product Options"}</span>
                <div className="space-y-3">
                  {searchResults.map((res) => {
                    const isSelected = selectedSkus.includes(res.item.internal_sku);
                    return (
                      <div
                        key={res.item.id}
                        onClick={() => setSelectedSkus(prev => prev.includes(res.item.internal_sku) ? prev.filter(s => s !== res.item.internal_sku) : [...prev, res.item.internal_sku])}
                        className={`p-3 rounded-lg border flex items-center justify-between text-xs font-semibold cursor-pointer transition-all ${
                          isSelected ? "border-amber-500 bg-amber-500/10" : "border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/10"
                        }`}
                      >
                        <input type="checkbox" checked={isSelected} onChange={() => {}} className="h-4 w-4 accent-amber-500" />
                        <div className="text-right">
                          <h4 className="text-slate-900 dark:text-white">{res.item.title_he}</h4>
                          <span className="text-[10px] text-slate-400 block mt-0.5">SKU: {res.item.internal_sku} | {res.item.price} ILS</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedSkus.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <input
                        type="number"
                        value={margin}
                        onChange={(e) => setMargin(parseInt(e.target.value) || 35)}
                        className="rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-center font-mono w-24"
                      />
                      <span className="text-slate-400">{isRTL ? "אחוז מרווח רצוי (Margin %):" : "Margin Percentage:"}</span>
                    </div>
                    <button
                      onClick={handleGenerateProposal}
                      disabled={isGenerating}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-all"
                    >
                      {isGenerating ? (isRTL ? "מפיק הצעה..." : "Generating...") : (isRTL ? "הפק והעבר קישור דיגיטלי ללקוח" : "Generate Shared Offer Links")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEWPORT: CATALOG MANAGER */}
        {b2bTab === "catalog" && (
          <div className="space-y-6 text-right">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isRTL ? "ניהול קטלוג וגיליונות מחיר" : "Catalog & Price Sheets Ingestion"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL ? "העלה קובצי מחיר של ספקים וסקור את המלאי הזמין." : "Ingest price sheets and review current inventory records."}
              </p>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-xs text-right text-slate-600 dark:text-slate-300">
              <strong>💡 {isRTL ? "המלצת פלטפורמה:" : "Platform Tip:"}</strong>{" "}
              {isRTL ? "סנן את הפריטים באמצעות תיבת החיפוש הירוקה להלן." : "Faceted filtering is bound to fuzzy search indicators."}
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-xl border-2 border-emerald-500 bg-white dark:bg-slate-900 flex justify-between items-center gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-bold outline-none"
              >
                <option value="All">{isRTL ? "כל הקטגוריות" : "All Categories"}</option>
                <option value="Bags">{isRTL ? "תיקים ומזוודות" : "Bags"}</option>
                <option value="Gadgets">{isRTL ? "גאדג'טים וטכנולוגיה" : "Gadgets"}</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? "חפש מוצרים לפי מק'ט או כותרת..." : "Search catalog items..."}
                className="flex-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs outline-none text-right"
              />
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { sku: "BTI-BAG-1042", title: "תיק גב יוקרתי - הרווארד", price: 25.0, category: "Bags", emoji: "🎒", top: true },
                { sku: "BTI-TECH-2050", title: "רמקול POLO WOOPER", price: 38.85, category: "Gadgets", emoji: "🔊", top: true },
                { sku: "BTI-BAG-1050", title: "תיק ספורט מתקפל", price: 18.0, category: "Bags", emoji: "👜", top: false }
              ]
                .filter(p => categoryFilter === "All" || p.category === categoryFilter)
                .filter(p => searchQuery === "" || p.sku.includes(searchQuery) || p.title.includes(searchQuery))
                .map((item) => (
                  <div key={item.sku} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-5 relative text-right shadow-sm">
                    {item.top && (
                      <span className="absolute top-3 left-3 bg-amber-500/10 text-amber-500 rounded px-2 py-0.5 text-[9px] font-bold">
                        ⭐ Top Pick
                      </span>
                    )}
                    <span className="text-2xl block mb-2">{item.emoji}</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {item.sku}</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                      <button
                        onClick={() => handleToggleWishlist(item.sku)}
                        className="text-xs font-bold hover:text-red-500 text-slate-400"
                      >
                        {wishlist.includes(item.sku) ? "❤️ Saved" : "🖤 Save to Cart"}
                      </button>
                      <span className="text-sm font-bold text-amber-500 font-mono">{item.price} ILS</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Importer */}
            <div className="glass-card-static p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{isRTL ? "ממשק קליטה מהיר (JSON Rows)" : "Spreadsheet Importer (JSON Rows)"}</h3>
              <form onSubmit={handleBulkUploadExcel} className="space-y-4">
                <textarea
                  rows={6}
                  value={excelInput}
                  onChange={(e) => setExcelInput(e.target.value)}
                  className="w-full rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-[10px] font-mono outline-none text-left"
                  dir="ltr"
                />
                <button
                  type="submit"
                  disabled={isUploadingExcel}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
                >
                  {isUploadingExcel ? (isRTL ? "מעבד..." : "Uploading...") : (isRTL ? "קלוט שורות מגיליון מחירים" : "Bulk Ingest Sheets Rows")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEWPORT: CRM PIPELINE */}
        {b2bTab === "crm" && (
          <div className="space-y-6 text-right">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isRTL ? "צינור מכירות והפקת הצעות (CRM Deals)" : "Sales CRM & PDF Deals"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL ? "מעקב אחר שלבי המכירה והפקת הצעות מחיר PDF חתומות." : "Track stages, trigger WhatsApp shares, and export contracts."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: isRTL ? "פניות נכנסות" : "Inbound Lead", stage: "Lead Ingestion" },
                { title: isRTL ? "הצעה נשלחה" : "Proposal Sent", stage: "Proposal Sent" },
                { title: isRTL ? "נסגר בהצלחה" : "Closed Won", stage: "Closed Won" }
              ].map((col) => (
                <div key={col.stage} className="glass-card-static p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800 pb-2">
                    {col.title}
                  </span>
                  <div className="space-y-3">
                    {crmDeals
                      .filter(d => d.stage === col.stage)
                      .map(deal => (
                        <div key={deal.id} className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-lg text-right text-xs">
                          <h4 className="font-bold text-slate-900 dark:text-white">{deal.client}</h4>
                          <p className="text-[10px] text-slate-400 mt-1">{isRTL ? `סוכן: ${deal.agent}` : `Agent: ${deal.agent}`}</p>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                            <button
                              onClick={() => {
                                setIsGeneratingPDF(true);
                                setTimeout(() => {
                                  setIsGeneratingPDF(false);
                                  alert(isRTL ? "קובץ PDF הופק והורד אוטומטית!" : "PDF generated!");
                                }, 1200);
                              }}
                              disabled={isGeneratingPDF}
                              className="text-[10px] font-bold text-amber-500 hover:underline"
                            >
                              {isGeneratingPDF ? (isRTL ? "מפיק..." : "Building...") : "📥 PDF"}
                            </button>
                            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{deal.value}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEWPORT: SUBCONTRACTOR REGISTRY */}
        {b2bTab === "suppliers" && (
          <div className="space-y-6 text-right">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isRTL ? "קבלני משנה לעיצוב ומיתוג" : "Supplier Subcontractor Registry"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL ? "הגדר עלויות גלופות, הדפסות UV ותעריפי קבלנים." : "Manage specialties setup fees, engraving techniques, and subcontractors lists."}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className="lg:col-span-2 glass-card-static p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{isRTL ? "רישום קבלן חדש" : "Register Subcontractor"}</h3>
                <form onSubmit={handleCreateSubcontractor} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="text-slate-400">{isRTL ? "שם החברה" : "Company Name"}</label>
                    <input
                      type="text"
                      required
                      value={newSubcontractor.company_name}
                      onChange={(e) => setNewSubcontractor(prev => ({ ...prev, company_name: e.target.value }))}
                      className="w-full rounded border-2 border-emerald-500 bg-slate-50 dark:bg-slate-950 p-2.5 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400">{isRTL ? "איש קשר" : "Contact Person"}</label>
                      <input
                        type="text"
                        required
                        value={newSubcontractor.contact_name}
                        onChange={(e) => setNewSubcontractor(prev => ({ ...prev, contact_name: e.target.value }))}
                        className="w-full rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">{isRTL ? "עלות גלופה (ILS)" : "Setup Fee (ILS)"}</label>
                      <input
                        type="number"
                        required
                        value={newSubcontractor.setup_fee}
                        onChange={(e) => setNewSubcontractor(prev => ({ ...prev, setup_fee: parseFloat(e.target.value) || 0 }))}
                        className="w-full rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 outline-none font-mono"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isCreatingSub}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors"
                  >
                    {isCreatingSub ? (isRTL ? "שומר..." : "Registering...") : (isRTL ? "שמור קבלן במערכת" : "Save Subcontractor & Rate Card")}
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-1 glass-card-static p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 dark:border-slate-800 pb-2">
                  {isRTL ? "קבלנים פעילים" : "Active Suppliers"}
                </span>
                <div className="space-y-2">
                  {subcontractors.map((sub) => (
                    <div key={sub.id} className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{sub.company_name}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{sub.specialties}</div>
                      <div className="text-[10px] font-bold font-mono text-indigo-500 mt-1">Setup: {sub.setup_fee} ILS</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEWPORT: DESIGN STUDIO */}
        {b2bTab === "design" && (
          <div className="space-y-6 text-right">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isRTL ? "סטודיו אינטראקטיבי לעיצוב מותג (Design Studio)" : "Custom Gem Design Studio"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isRTL ? "הדמיית מיתוג, ניהול מרווחי שורות ושינוי צבעי מותג." : "Switch presets, configure densities, and build layout grids in real-time."}
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Controls */}
              <div className="xl:col-span-1 space-y-4">
                <div className="glass-card-static p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{isRTL ? "צבע מותג" : "Brand Color Preset"}</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(["slate", "emerald", "indigo", "amber"] as const).map(color => (
                      <button
                        key={color}
                        onClick={() => setStudioTheme(color)}
                        className={`p-2 rounded border font-bold transition-all text-center ${
                          studioTheme === color ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-slate-100 dark:border-slate-800"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card-static p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{isRTL ? "צפיפות עימוד" : "Density Mode"}</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(["balanced", "condensed"] as const).map(dense => (
                      <button
                        key={dense}
                        onClick={() => setStudioDensity(dense)}
                        className={`p-2 rounded border font-bold transition-all text-center ${
                          studioDensity === dense ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-slate-100 dark:border-slate-800"
                        }`}
                      >
                        {dense}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Layout Editor Canvas */}
              <div className="xl:col-span-3 glass-card-static p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex gap-2">
                    <button onClick={() => addStudioBlock("hero")} className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded text-xs font-bold">+ Hero</button>
                    <button onClick={() => addStudioBlock("features")} className="px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded text-xs font-bold">+ Features</button>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{isRTL ? "קנבס הדמיית מותג" : "Branding Simulation Canvas"}</span>
                </div>

                <div className={`space-y-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800/50 min-h-[300px] ${
                  studioDensity === "condensed" ? "space-y-1.5 p-2" : ""
                }`}>
                  {studioBlocks.map((block, idx) => (
                    <div key={block.id} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center gap-4 text-xs shadow-sm">
                      <div className="flex gap-2">
                        <button onClick={() => moveStudioBlock(idx, "up")} className="text-slate-400 hover:text-slate-200">▲</button>
                        <button onClick={() => moveStudioBlock(idx, "down")} className="text-slate-400 hover:text-slate-200">▼</button>
                        <button onClick={() => removeStudioBlock(block.id)} className="text-red-500 font-bold">✕</button>
                      </div>
                      <div className="text-right flex-1">
                        <h5 className="font-extrabold text-slate-900 dark:text-white">{block.title}</h5>
                        <p className="text-[10px] text-slate-400 mt-1">{block.subtitle}</p>
                      </div>
                    </div>
                  ))}
                  {studioBlocks.length === 0 && (
                    <div className="h-[200px] flex items-center justify-center text-slate-450 italic">{isRTL ? "הקנבס ריק. הוסף רכיב למיתוג." : "Canvas is empty. Add a module to begin."}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
