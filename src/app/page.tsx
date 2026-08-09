"use client";

import React, { useState, useEffect } from "react";
import DynamicMenu from "../components/dynamic_menu";
import { AgentChatWidget } from "../components/agent_chat_widget";

interface ProspectData {
  businessName: string;
  logoUrl?: string;
  tagline: string;
  suggestedTheme?: string;
  suggestedDensity?: string;
  suggestedMode?: string;
  isRTL?: boolean;
  scrapedProducts?: Array<{ id: string; name: string; price: string }>;
}

interface CatalogItem {
  id: string;
  internal_sku: string;
  title_he: string;
  category: string;
  description: string;
  attributes: any;
  image_urls: string[];
  currency_code: string;
  supplier_lead_time_days: number;
  wholesale_cost: number;
  supplier_name: string;
  supplier_sku: string;
  supplier_product_url: string;
  top_picks?: boolean;
}

interface SearchResult {
  item: CatalogItem;
  similarity: number;
}

interface BriefConstraints {
  target_quantity: number;
  budget_unit_max: number;
  currency: string;
  event_date: string;
  categories: string[];
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentMenu, setCurrentMenu] = useState<
    | "home"
    | "brief_clarifier"
    | "catalog_manager"
    | "supplier_registry"
    | "customer_registry"
    | "library_hub"
    | "template_hub"
    | "crm_pipeline"
    | "design_studio"
    | "sandbox_playground"
    | "human_schema"
    | "system_schema"
    | "threshold"
    | "traceability_spec"
    | "agents_skills"
    | "protocols_wizards"
    | "api_providers"
    | "matting_models"
    | "storage_cdn"
    | "data_integrations"
  >("home");

  // --- Scraper & Personalization states ---
  const [prospectUrl, setProspectUrl] = useState("");
  const [scrapedData, setScrapedData] = useState<ProspectData | null>(null);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingError, setScrapingError] = useState<string | null>(null);

  const handleScrapeProspect = async () => {
    if (!prospectUrl.trim()) return;
    setIsScraping(true);
    setScrapingError(null);
    try {
      const res = await fetch("http://localhost:8000/api/v1/prospects/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: prospectUrl })
      });
      if (!res.ok) {
        throw new Error("Failed to process scraping extraction.");
      }
      const data = await res.json();
      setScrapedData(data);
      setCurrentMenu("design_studio" as any);
    } catch (err: any) {
      setScrapingError(err.message || "Failed to parse target site.");
    } finally {
      setIsScraping(false);
    }
  };

  // --- Design Studio states ---
  const [studioTheme, setStudioTheme] = useState<"slate" | "emerald" | "indigo" | "amber">("slate");
  const [studioDensity, setStudioDensity] = useState<"balanced" | "condensed">("balanced");
  const [studioMode, setStudioMode] = useState<"light" | "dark">("dark");
  const [studioBlocks, setStudioBlocks] = useState<any[]>([
    { id: "b1", type: "hero", title: "Automated Compliance Pipelines", subtitle: "Verify structure, non-repudiation, and runtime gates in real time." },
    { id: "b2", type: "stats", title: "Scale Matrix", subtitle: "99.9% Uptime | 15ms Latency | 5 Subsystems" },
    { id: "b3", type: "features", title: "Decidable Verification", subtitle: "Every transition is mathematically verified by local and cloud governors." },
    { id: "b4", type: "footer", title: "CISEM Workspace Engine", subtitle: "Built with Google Antigravity Agentic Systems." }
  ]);

  const addStudioBlock = (type: string) => {
    const newBlock = {
      id: "block-" + Math.random().toString(36).substr(2, 9),
      type,
      title: `New ${type.toUpperCase()} Section`,
      subtitle: "Click here to edit description text."
    };
    setStudioBlocks([...studioBlocks, newBlock]);
  };

  const removeStudioBlock = (id: string) => {
    setStudioBlocks(studioBlocks.filter(b => b.id !== id));
  };

  const moveStudioBlock = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= studioBlocks.length) return;
    const updated = [...studioBlocks];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setStudioBlocks(updated);
  };

  const updateBlockText = (id: string, field: "title" | "subtitle", value: string) => {
    setStudioBlocks(studioBlocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };
  const [activeTab, setActiveTab] = useState<"operator" | "client">("operator");
  const [activeRole, setActiveRole] = useState<"guest" | "buyer" | "partner" | "operator_admin">("operator_admin");

  // --- Sandbox Playground States ---
  const [sandboxTab, setSandboxTab] = useState<"website" | "landing_page" | "crm" | "social_media" | "knowledge_hub" | "vocabulary">("website");
  const [sandboxWebTheme, setSandboxWebTheme] = useState<"emerald" | "indigo" | "rose" | "amber">("indigo");
  const [sandboxWebFont, setSandboxWebFont] = useState<"sans" | "serif" | "mono">("sans");
  const [sandboxCrmLeads, setSandboxCrmLeads] = useState<any[]>([
    { id: "lead-1", name: "GreenTech Agricultural Supplies", status: "scraped", budget: "₪25,000" },
    { id: "lead-2", name: "Apex Plastic Logistics", status: "enriched", budget: "₪12,000" },
    { id: "lead-3", name: "Yariv Metal Casting Ltd", status: "contacted", budget: "₪45,000" },
    { id: "lead-4", name: "Negev Drip Irrigation Corp", status: "won", budget: "₪85,000" }
  ]);
  const [sandboxBannerText, setSandboxBannerText] = useState("מערכות סינון B2B וצינורות השקיה");
  const [sandboxBannerBg, setSandboxBannerBg] = useState("from-slate-900 via-slate-800 to-indigo-950");
  const [sandboxSearchQuery, setSandboxSearchQuery] = useState("");
  const [sandboxAxioms, setSandboxAxioms] = useState<any[]>([
    { id: "AX-10000", name: "Platform Absolute Reality Principle", status: "Active", desc: "No shadow folder states permitted. Registry is the single source of truth." },
    { id: "PR-11000", name: "Sparse ID Allocation Policy", status: "Active", desc: "Sparse numbering spacing (intervals of +100/500), space footprint <5%." },
    { id: "PR-13980", name: "Variable Gate Severity Threshold", status: "Active", desc: "Gestation threshold scales based on task blast radius." }
  ]);
  const [newAxiomId, setNewAxiomId] = useState("");
  const [newAxiomName, setNewAxiomName] = useState("");
  const [newAxiomDesc, setNewAxiomDesc] = useState("");

  // --- Accountability Dashboard States ---
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const fetchDashboardMetrics = async () => {
    setIsLoadingDashboard(true);
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (e) {
      console.error("Error fetching dashboard metrics:", e);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (currentMenu === "threshold") {
      fetchDashboardMetrics();
    }
  }, [currentMenu]);

  // --- Dynamic Chunks & Backlog states ---
  const [chunksList, setChunksList] = useState<any[]>([]);
  const [selectedChunk, setSelectedChunk] = useState<any | null>(null);
  const [isChunkInspectorOpen, setIsChunkInspectorOpen] = useState(false);
  const [isUpdatingChunk, setIsUpdatingChunk] = useState(false);
  
  const [isBacklogOpen, setIsBacklogOpen] = useState(false);
  const [backlogList, setBacklogList] = useState<any[]>([]);
  const [newBacklog, setNewBacklog] = useState({ title: "", context: "", impact_level: "low", tags: [] });
  const [isSubmittingBacklog, setIsSubmittingBacklog] = useState(false);

  const [tagsList, setTagsList] = useState<any[]>([]);
  const [statusesList, setStatusesList] = useState<any[]>([]);
  
  // Library Hub states
  const [customLibraries, setCustomLibraries] = useState<any[]>([]);
  const [currentLibraryTab, setCurrentLibraryTab] = useState<string>("tags");
  const [lookupItems, setLookupItems] = useState<any[]>([]);
  const [newLibrary, setNewLibrary] = useState({ tab_id: "", label: "", description: "" });
  const [isCreatingLibrary, setIsCreatingLibrary] = useState(false);
  const [newLookupItem, setNewLookupItem] = useState({ key_name: "", value_data: "" });
  const [isAddingLookup, setIsAddingLookup] = useState(false);
  
  // Ingest Brief States
  const [rawBrief, setRawBrief] = useState(
    "Need 200 units of computer bags and bluetooth speakers under 100 shekels for event next month with laser engraving"
  );
  const [briefId, setBriefId] = useState<string>("");
  const [completenessScore, setCompletenessScore] = useState<number | null>(null);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [parsedConstraints, setParsedConstraints] = useState<BriefConstraints | null>(null);
  const [isQualifying, setIsQualifying] = useState(false);

  // Catalog Matches & Search
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Wishlist & Cart
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Quote Settings
  const [quantity, setQuantity] = useState(200);
  const [margin, setMargin] = useState(35);
  const [freight, setFreight] = useState(150.00);
  const [verifiedStatus, setVerifiedStatus] = useState<Record<string, "unverified" | "verifying" | "verified" | "fallback">>({});

  // Proposal Generation
  const [proposalToken, setProposalToken] = useState<string>("");
  const [whatsappLink, setWhatsappLink] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Client proposal load states
  const [clientTokenInput, setClientTokenInput] = useState<string>("");
  const [clientProposal, setClientProposal] = useState<any>(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientSelectedItems, setClientSelectedItems] = useState<Record<string, boolean>>({});

  // Bulk Excel Ingest State
  const [excelInput, setExcelInput] = useState<string>(
    JSON.stringify([
      {
        "internal_sku": "BTI-BAG-1042",
        "title_he": "תיק גב יוקרתי - הרווארד",
        "category": "Bags",
        "wholesale_cost": 25.00,
        "supplier_name": "Wave2",
        "supplier_sku": "TX6106",
        "supplier_product_url": "https://www.wave2.co.il/items/tx6106",
        "country": "IL",
        "currency": "ILS"
      },
      {
        "internal_sku": "BTI-TECH-2050",
        "title_he": "רמקול בלוטוס POLO WOOPER",
        "category": "Gadgets",
        "wholesale_cost": 38.85,
        "supplier_name": "Polo Swiss",
        "supplier_sku": "AP5054",
        "supplier_product_url": "https://www.polo.co.il/items/ap5054",
        "country": "IL",
        "currency": "ILS"
      }
    ], null, 2)
  );
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);

  // Template Hub Sliders State
  const [sliderMargin, setSliderMargin] = useState<number>(12);
  const [sliderFontSize, setSliderFontSize] = useState<number>(14);
  const [activeTemplate, setActiveTemplate] = useState<"detail" | "grid" | "dashboard">("detail");
  const [templatesList, setTemplatesList] = useState<any[]>([]);

  // CRM deals states
  const [crmDeals, setCrmDeals] = useState<any[]>([]);

  // Subcontractor & Customer Workspace states
  const [newSubcontractor, setNewSubcontractor] = useState({
    company_name: "",
    contact_name: "",
    specialties: "laser_engraving",
    setup_fee: 80.00,
    min_quantity: 1,
    max_quantity: 499,
    unit_cost: 4.00,
    turnaround_days: 3
  });
  const [isCreatingSub, setIsCreatingSub] = useState(false);

  const [newCustomer, setNewCustomer] = useState({ name: "", domain_type: "corporate_gifts" });
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Virtual Agent Personas Drawer state
  const [isPersonasOpen, setIsPersonasOpen] = useState(false);
  const [personas, setPersonas] = useState<any[]>([]);
  const [activePersona, setActivePersona] = useState<string>("proactive_assistant");
  
  // Guided step indices
  const [guidedStep, setGuidedStep] = useState<number>(0);
  const onboardingSteps = [
    { title: "מלא דרישות לקוח", desc: "הכנס את דרישות הלקוח במילים פשוטות וחלץ מתוכן אילוצי תקציב וכמות לקבלת דירוג שלמות." },
    { title: "סנן והתאם מהקטלוג", desc: "סנן את 2,000+ המוצרים בקטלוג לפי מידה, צבע וחומר, ובחר את הפריטים המתאימים להצעה." },
    { title: "נהל הצעות מחיר ומחירונים", desc: "קבע רווח יעד, חשב את העלות המשולבת כולל ספקים וקבלן מיתוג, והפק קישור אינטראקטיבי ללקוח." }
  ];

  // URL parameters listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const tab = params.get("tab");
      if (tab === "client") {
        setActiveTab("client");
      }
      if (token) {
        setClientTokenInput(token);
        setProposalToken(token);
        handleLoadClientProposal(token);
      }
    }
  }, []);

  // Fetch initial schemas and personas
  useEffect(() => {
    fetchTagsAndStatuses();
    fetchBacklog();
    fetchPersonas();
    fetchDeals();
    fetchTemplates();
  }, []);

  // Synchronize theme state with document class after mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    }
  }, []);

  const handleToggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    if (nextVal) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const fetchPersonas = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/personas");
      if (res.ok) {
        const data = await res.json();
        setPersonas(data.personas || []);
        setActivePersona(data.active || "proactive_assistant");
      }
    } catch (err) {
      console.error("Error loading personas:", err);
    }
  };

  const fetchDeals = async () => {
    try {
      // In mock DB setup, we fetch deals fromdeals table
      const res = await fetch("http://localhost:8000/api/v1/schemas/custom?tab=deals");
      // Standard fetch fallback mock deals if table empty
      setCrmDeals([
        { id: "1", client: "Acme HighTech LTD", agent: "Yariv Fink", stage: "Lead Ingestion", value: "24,000 ILS", date: "2026-08-04", logs: "Generated proposal matching brief" },
        { id: "2", client: "Commark Gifting", agent: "David Cohen", stage: "Proposal Sent", value: "18,500 ILS", date: "2026-08-03", logs: "Client reviewing draft selection" }
      ]);
    } catch (err) {}
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplatesList(data.templates || []);
      }
    } catch (err) {}
  };

  const handleSwitchPersona = async (personaId: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/personas/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona_id: personaId })
      });
      if (res.ok) {
        fetchPersonas();
        alert(`Persona shifted to ${personaId.replace("_", " ")}!`);
      }
    } catch (err) {
      console.error("Error activating persona:", err);
    }
  };

  const handleCreateSubcontractor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingSub(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/schemas/custom?tab=branding_subcontractors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubcontractor)
      });
      if (res.ok) {
        setNewSubcontractor({
          company_name: "",
          contact_name: "",
          specialties: "laser_engraving",
          setup_fee: 80.00,
          min_quantity: 1,
          max_quantity: 499,
          unit_cost: 4.00,
          turnaround_days: 3
        });
        alert("Subcontractor registered successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingSub(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCustomer(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/schemas/custom?tab=customer_accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
      });
      if (res.ok) {
        setNewCustomer({ name: "", domain_type: "corporate_gifts" });
        alert("Customer workspace registered successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingCustomer(false);
    }
  };


  const handleBulkUploadExcel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingExcel(true);
    try {
      const payload = JSON.parse(excelInput);
      const res = await fetch("http://localhost:8000/api/v1/catalog/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Successfully imported ${data.count} items from sheet!`);
      } else {
        alert("Upload parsing error.");
      }
    } catch (err) {
      alert("Invalid JSON format in Excel textarea buffer.");
    } finally {
      setIsUploadingExcel(false);
    }
  };

  const triggerLiveStockCheck = async () => {
    if (!proposalToken) return;
    try {
      const res = await fetch("http://localhost:8000/api/v1/stock/live-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: proposalToken })
      });
      if (res.ok) {
        alert("Live stock verifier playbook check queued! Status will update shortly.");
      }
    } catch (err) {}
  };

  const handleManualPDFGeneration = async (token: string) => {
    setIsGeneratingPDF(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/proposals/${token}/pdf`);
      if (res.ok) {
        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `proposal_${token}.pdf`;
        link.click();
      } else {
        alert("PDF printing timed out. Retrying...");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const fetchTagsAndStatuses = async () => {
    try {
      const tRes = await fetch("http://localhost:8000/api/v1/schemas/tags");
      if (tRes.ok) {
        const data = await tRes.json();
        setTagsList(data.tags || []);
      }
      const sRes = await fetch("http://localhost:8000/api/v1/schemas/statuses");
      if (sRes.ok) {
        const data = await sRes.json();
        setStatusesList(data.statuses || []);
      }
      const cRes = await fetch("http://localhost:8000/api/v1/schemas/custom");
      if (cRes.ok) {
        const data = await cRes.json();
        setCustomLibraries(data.libraries || []);
      }
    } catch (err) {
      console.error("Error loading master schema libraries:", err);
    }
  };

  const fetchBacklog = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/backlog");
      if (res.ok) {
        const data = await res.json();
        setBacklogList(data.backlog || []);
      }
    } catch (err) {
      console.error("Error loading backlog list:", err);
    }
  };

  const fetchBriefChunks = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/documents/${id}/chunks`);
      if (res.ok) {
        const data = await res.json();
        setChunksList(data.chunks || []);
      }
    } catch (err) {
      console.error("Error loading brief chunks:", err);
    }
  };

  const handleQualifyBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsQualifying(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/briefs/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: "00000000-0000-0000-0000-000000000000",
          raw_text: rawBrief
        })
      });
      if (res.ok) {
        const data = await res.json();
        setBriefId(data.brief_id);
        setCompletenessScore(data.completeness_score);
        setClarifyingQuestions(data.clarifying_questions);
        setParsedConstraints(data.parsed_constraints);
        
        // Auto fetch chunks
        fetchBriefChunks(data.brief_id);
      }
    } catch (err) {
      console.error("Brief qualification failure:", err);
    } finally {
      setIsQualifying(false);
    }
  };

  const handleCatalogSearch = async () => {
    if (!parsedConstraints) return;
    setIsSearching(true);
    try {
      // In mock DB setup, we search catalog items using standard list route
      const res = await fetch("http://localhost:8000/api/v1/catalog/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query_vector: [1.0].concat(new Array(1535).fill(0.0)),
          similarity_threshold: 0.1,
          match_count: 10,
          category_filter: parsedConstraints.categories[0] || null
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateProposal = async () => {
    if (!briefId || selectedSkus.length === 0) return;
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief_id: briefId,
          catalog_item_skus: selectedSkus,
          applied_margin_percent: margin
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProposalToken(data.public_token);
        setWhatsappLink(data.whatsapp_share_link);
        
        // Load details immediately
        handleLoadClientProposal(data.public_token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadClientProposal = async (token: string) => {
    setClientLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/proposals/${token}`);
      if (res.ok) {
        const data = await res.json();
        setClientProposal(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClientLoading(false);
    }
  };

  const handleUpdateChunk = async (chunkId: string, payload: any) => {
    setIsUpdatingChunk(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/documents/chunks/${chunkId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        // Update local chunksList state
        setChunksList(prev => prev.map(c => c.id === chunkId ? updated.chunk : c));
        setSelectedChunk(updated.chunk);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingChunk(false);
    }
  };

  const handleCreateBacklog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBacklog(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/backlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBacklog)
      });
      if (res.ok) {
        setNewBacklog({ title: "", context: "", impact_level: "low", tags: [] });
        fetchBacklog();
        alert("Thought parked in Backlog.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBacklog(false);
    }
  };

  const handleToggleWishlist = (sku: string) => {
    setWishlist((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  };

  // Onboarding suggest dynamic persona hints
  const getActivePersonaTips = () => {
    if (activePersona === "proactive_assistant") {
      return [
        "💡 פלטפורמה מציעה: התחל בהזנת דרישות הלקוח בתיבת הטקסט הירוקה.",
        "⚠️ שים לב: כמויות הזמנה נמוכות מ-100 יחידות יגרמו לעליית תעריפי מיתוג גל לייזר."
      ];
    } else if (activePersona === "research_specialist") {
      return [
        "🔍 טיפ מחקר: שער חליפין מבוסס על EAV lookup registry: 1 USD = 3.65 ILS.",
        "📊 המלצה: מומלץ לבדוק את התאמת החומרים (עור מול RPET) בקטלוג הפריטים."
      ];
    } else {
      return [
        "⚡ ביקורת קוד: ודא שאתה מריץ migrations.sql ב-Supabase editor שלך למניעת שגיאות מפתח זר.",
        "🛠️ בדיקת SPA: נתיבי Next.js משתמשים בפרמטרים של URL כדי לשמור על שלמות מצב הריאקט."
      ];
    }
  };

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 pb-16">
      
      {/* 1. STICKY MEGA NAVIGATION MENU BAR */}
      <DynamicMenu
        activeRole={activeRole}
        onRoleChange={(r) => {
          setActiveRole(r);
          setActiveTab(r === "buyer" ? "client" : "operator");
        }}
        wishlistCount={wishlist.length}
        onHelpClick={() => setGuidedStep((prev) => (prev + 1) % 3)}
        onBacklogClick={() => setIsBacklogOpen(true)}
        onSelectCategory={(catId) => {
          const knownMenus = [
            "home", "sandbox_image_processor", "human_schema", "system_schema",
            "threshold", "traceability_spec", "agents_skills", "protocols_wizards",
            "api_providers", "matting_models", "storage_cdn", "data_integrations",
            "design_studio"
          ];
          if (knownMenus.includes(catId)) {
            setCurrentMenu(catId as any);
          } else {
            setCurrentMenu("catalog_manager");
            setCategoryFilter(catId === "l2_laptop" ? "Bags" : "Gadgets");
          }
        }}
        isDarkMode={isDarkMode}
        toggleDarkMode={handleToggleDarkMode}
        mounted={mounted}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === "client" ? (
          /* =========================================================================
             CLIENT VIEWPORT: Client Proposal Workspace & Branding Review
             ========================================================================= */
          <div className="space-y-8 text-right" dir="rtl">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-left">
                Client Proposal Workspace & Review
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-left">
                Review your tailored corporate gift offer, test branding mockups in real-time, and confirm order specifications.
              </p>
            </div>

            {/* Stepper progress */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>שלב הלקוח: בדיקת הצעת מחיר והתאמת מיתוג</span>
                <div className="flex gap-1">
                  <span className="h-1.5 w-6 rounded bg-emerald-500"></span>
                  <span className="h-1.5 w-6 rounded bg-emerald-500"></span>
                  <span className="h-1.5 w-6 rounded bg-emerald-500"></span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 text-right leading-relaxed" dir="rtl">
                <strong>💡 המלצה ללקוח:</strong> סמן את המתנות הרצויות, העלה את הלוגו שלך בצד שמאל כדי לראות הדמיה מיידית, והזן ח.פ. לקבלת אישור תקציבי מהיר.
              </p>
            </div>

            {/* Token Loader if proposal not loaded */}
            {!clientProposal ? (
              <div className="max-w-md mx-auto rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">הכנס קוד הצעה לקבלת מפרט</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={clientTokenInput}
                    onChange={(e) => setClientTokenInput(e.target.value)}
                    className="w-full rounded border-2 border-emerald-500 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:bg-slate-950 text-left font-mono"
                    placeholder="e.g. ea1d5229-ada7-4bae-8ca9-6c7b488b694a"
                  />
                  <button
                    onClick={() => handleLoadClientProposal(clientTokenInput)}
                    disabled={clientLoading}
                    className="w-full rounded bg-amber-500 py-2.5 text-xs font-bold text-white hover:bg-amber-600"
                  >
                    {clientLoading ? "טוען הצעה..." : "פתח הצעת מחיר"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Items selection list */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 text-left">
                      <span className="text-xs font-mono text-slate-400">Proposal ID: {clientProposal.token?.substring(0, 8)}</span>
                      <h3 className="text-sm font-bold text-slate-850 dark:text-white">מתנות מוצעות לבחירה</h3>
                    </div>

                    <div className="space-y-4">
                      {clientProposal.items?.map((item: any) => (
                        <div key={item.sku} className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-950 dark:border-slate-850 flex justify-between items-center text-right">
                          <input
                            type="checkbox"
                            checked={!!clientSelectedItems[item.sku]}
                            onChange={() => setClientSelectedItems(prev => ({ ...prev, [item.sku]: !prev[item.sku] }))}
                            className="h-4 w-4 rounded accent-amber-500"
                          />
                          <div className="flex-1 px-4">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title_he || item.sku}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {item.sku}</p>
                            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 rounded px-2 py-0.5 text-slate-600 dark:text-slate-400 mt-2 inline-block">
                              כמות מבוקשת: {clientProposal.quantity} יחידות
                            </span>
                          </div>
                          <div className="text-left font-mono font-bold text-amber-500 text-xs">
                            {item.client_unit_price} ILS / יחידה
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 font-bold text-xs">
                      <span className="text-slate-400">סה״כ משוער (לא כולל מע״מ)</span>
                      <span className="text-base text-amber-500 font-mono">
                        {clientProposal.items?.reduce((acc: number, item: any) => acc + (item.client_unit_price * clientProposal.quantity), 0)} ILS
                      </span>
                    </div>
                  </div>

                  {/* Corporate onboarding client information */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 text-right">פרטי רישום חברה לקבלת הצעת מחיר רשמית</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-right">
                      <div className="space-y-1">
                        <label className="text-slate-500">ח.פ. חברה / Tax ID</label>
                        <input
                          type="text"
                          className="w-full rounded border-2 border-emerald-500 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:bg-slate-950 text-left font-mono"
                          placeholder="510000000"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500">ענף פעילות</label>
                        <select className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-955">
                          <option>הייטק וטכנולוגיה</option>
                          <option>פיננסים ושירותים</option>
                          <option>מוסדות וארגונים</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => alert("הבחירה נשמרה בטיוטות בהצלחה! סוכן המכירות עודכן במערכת.")}
                      className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-white hover:bg-amber-600"
                    >
                      אשר בחירה ושלח לתיאום אספקה
                    </button>
                  </div>
                </div>

                {/* 2. Interactive Logo Mockup canvas widget */}
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
                    <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                      הדמיית מיתוג לוגו (Branding Mockup)
                    </h3>
                    
                    {/* Mockup Canvas */}
                    <div className="relative h-64 rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-850 dark:bg-slate-950 flex items-center justify-center overflow-hidden">
                      {/* Product image mock */}
                      <span className="text-7xl animate-pulse">🎒</span>
                      
                      {/* Overlay logo blended */}
                      <div
                        className="absolute bg-indigo-500/20 text-indigo-500 font-bold border border-dashed border-indigo-500 rounded p-1 text-[9px] uppercase tracking-wider mix-blend-multiply flex items-center justify-center pointer-events-none"
                        style={{
                          top: `${sliderMargin * 4}px`,
                          left: `${sliderFontSize * 5}px`,
                          transform: "scale(1.2)"
                        }}
                      >
                        [ ACME LOGO ]
                      </div>
                    </div>

                    <div className="space-y-4 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-slate-500 block">העלה קובץ לוגו (PNG/SVG)</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-[10px] text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-amber-500 file:text-white hover:file:bg-amber-600"
                        />
                      </div>
                      
                      {/* Logo placement offsets */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">מיקום מיתוג על המוצר</span>
                        <div className="space-y-2">
                          <div className="flex justify-between text-slate-500">
                            <span>גובה לוגו (Y-offset)</span>
                            <span className="font-mono">{sliderMargin}</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="20"
                            value={sliderMargin}
                            onChange={(e) => setSliderMargin(parseInt(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-slate-500">
                            <span>היסט אופקי (X-offset)</span>
                            <span className="font-mono">{sliderFontSize}</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="24"
                            value={sliderFontSize}
                            onChange={(e) => setSliderFontSize(parseInt(e.target.value))}
                            className="w-full accent-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
             OPERATOR VIEWPORT: Back-Office Administration Tabs
             ========================================================================= */
          <>
            {/* 4. WORKSPACE CONTROLS & DYNAMIC TAB GRID */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto pb-1 mb-8">
              {[
                { id: "home", label: "🏠 שער ראשי (Home)" },
                { id: "brief_clarifier", label: "💬 Ingest Client Brief" },
                { id: "catalog_manager", label: "🎒 Catalog & Sheets Ingestion" },
                { id: "crm_pipeline", label: "📊 Sales CRM & PDF Pipeline" },
                { id: "template_hub", label: "🎨 Layout Sandbox Template Hub" },
                { id: "supplier_registry", label: "⚙️ Subcontractors Configuration" },
                { id: "library_hub", label: "📂 Master Library Hub" },
                { id: "design_studio", label: "🎨 Design Studio" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentMenu(tab.id as any)}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 whitespace-nowrap ${
                    currentMenu === tab.id
                      ? "border-amber-500 text-amber-500"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>


        {/* 5. MAIN TAB WORKSPACE PANELS */}
        <main className="space-y-12">
          
          {/* TAB HOME: WELCOME GATEWAY PORTAL */}
          {currentMenu === "home" && (
            <div className="space-y-8 text-right" dir="rtl">
              {/* Core Hero Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-600/5 to-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 space-y-4">
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500 ring-1 ring-inset ring-amber-500/20">
                    Welcome to COMMARK UBOP v1.2
                  </span>
                  <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white leading-tight">
                    מערכת הזמנות והצעות מחיר B2B אחודה
                  </h1>
                  <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    פלטפורמת ה-Universal Brief-to-Offer מקשרת בין דרישות לקוח לבין מוצרי ספקים בארץ ובעולם.
                    המערכת מנתחת אילוצים, מאתרת מוצרים בקטלוג בהתאם למדרגי עדיפות, ומאפשרת הדמיית מיתוג לוגו מהירה והפקת הצעות מחיר בפורמט PDF ודיגיטלי בצורה אוטומטית.
                  </p>
                  
                  {/* Performance Indicators */}
                  <div className="flex flex-wrap gap-4 pt-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-800">
                      🟢 חיבור בסיס נתונים פעיל
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-800">
                      ⚡ 2,500+ מוצרים בקטלוג
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-800">
                      🧠 סוכן תומך פעיל: {personas.find(p => p.id === activePersona)?.name || "עוזר פרואקטיבי"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Brand Scraper & Sandbox Personalizer Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-right">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <h2 className="text-base font-bold text-slate-950 dark:text-white">
                      סורק ומחולל מותג לקוח אינטראקטיבי (SPCS)
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      הזן כתובת אתר של לקוח פוטנציאלי כדי לסרוק צבעי מותג, סלוגנים ופרטי קטלוג, ולחולל אתר הדגמה אינטראקטיבי באופן מיידי.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={prospectUrl}
                    onChange={(e) => setProspectUrl(e.target.value)}
                    placeholder="https://example.com"
                    dir="ltr"
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-950 dark:text-slate-100"
                  />
                  <button
                    onClick={handleScrapeProspect}
                    disabled={isScraping || !prospectUrl.trim()}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    {isScraping ? (
                      <>
                        <span className="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>סורק ומחלץ מותג...</span>
                      </>
                    ) : (
                      <span>סרוק וחולל הדמיית מותג</span>
                    )}
                  </button>
                </div>
                
                {scrapingError && (
                  <p className="text-xs text-red-500 font-semibold mt-1">
                    ❌ שגיאה: {scrapingError}
                  </p>
                )}
              </div>

              {/* Two-Stated split entry journey */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 1. Buyer / Simplified Client Journey Card */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 shadow-md hover:shadow-amber-500/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">🎒</span>
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded">
                        האזור של לקוחות ורוכשים
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">פורטל הצעות לקוח מפושט</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      מיועד עבור לקוחות הקצה המקבלים הצעה מוכנה לסקירה. 
                      באזור זה אין צורך בהזנת קודים או עדכון נתוני ספקים. תוכלו לסמן את המתנות הרצויות, להעלות לוגו להדמיית מיתוג מיידית, ולהזין ח.פ. חברה לאישור הזמנה.
                    </p>
                    
                    {/* Simplified status indications */}
                    <div className="rounded-xl bg-white dark:bg-slate-900 p-4 space-y-2.5 border border-slate-100 dark:border-slate-850">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">הדמיית מיתוג לוגו (Branding Simulation)</span>
                        <span className="text-emerald-500 font-bold">זמין 🟢</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400">מפרט פריטים מוצעים מתוך קטלוג</span>
                        <span className="text-emerald-500 font-bold">פעיל 🟢</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setActiveTab("client");
                      if (proposalToken) {
                        handleLoadClientProposal(proposalToken);
                      }
                    }}
                    className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-white hover:bg-amber-600 shadow-md hover:scale-[1.02] transition-all"
                  >
                    כניסה לפורטל לקוחות ➔
                  </button>
                </div>

                {/* 2. Admin / Back-Office Operator Journey Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-slate-500/15 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-6 transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">⚙️</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        מרכז בקרה מנהלי (Admin Area)
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">מרכז בקרה ותפעול לצוות UBOP</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      מיועד עבור מנהלי הפלטפורמה וסוכני המכירות. 
                      ממשק מקיף המאפשר קליטת דרישות לקוח (Brief Ingestion), פריסת אקסלים, תעדוף ספקים, עדכון מחירי ספקים וקבלני מיתוג, וניהול נתוני המאסטר.
                    </p>

                    {/* Quick navigation flow links */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-right">
                      <button
                        onClick={() => {
                          setActiveTab("operator");
                          setCurrentMenu("brief_clarifier");
                        }}
                        className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-950 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-right transition-colors"
                      >
                        💬 הזנת דרישות לקוח
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("operator");
                          setCurrentMenu("catalog_manager");
                        }}
                        className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-950 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-right transition-colors"
                      >
                        🎒 קטלוג וייבוא Sheets
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("operator");
                          setCurrentMenu("crm_pipeline");
                        }}
                        className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-950 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-right transition-colors"
                      >
                        📊 ניהול עסקאות CRM
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab("operator");
                          setCurrentMenu("supplier_registry");
                        }}
                        className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-950 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-right transition-colors"
                      >
                        ⚙️ קבלני מיתוג וספקים
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab("operator");
                      setCurrentMenu("brief_clarifier");
                    }}
                    className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 shadow-md hover:scale-[1.02] transition-all"
                  >
                    המשך למרכז בקרה (Admin) ➔
                  </button>
                </div>
                
              </div>
            </div>
          )}

          {/* TAB A: BRIEF CLARIFIER & SENTENCES MATCHING */}
          {currentMenu === "brief_clarifier" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Corporate Brief Ingestion
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Submit raw client requirements to parse target quantities, dates, and match in-stock catalog gifts.
                  </p>
                </div>

                {/* UX Proximity: Platform recommendation and step checklist nested directly above input */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>שלב 1 מתוך 3: ניתוח והזנת דרישות הלקוח</span>
                    <div className="flex gap-1">
                      <span className="h-1.5 w-6 rounded bg-emerald-500"></span>
                      <span className="h-1.5 w-6 rounded bg-slate-200 dark:bg-slate-800"></span>
                      <span className="h-1.5 w-6 rounded bg-slate-200 dark:bg-slate-800"></span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 text-right leading-relaxed" dir="rtl">
                    <strong>💡 המלצת פלטפורמה:</strong> התחל בהזנת דרישות הלקוח בתיבת הטקסט הירוקה המודגשת למטה. המערכת תפרק את הפנייה ותתאים אותה לקטלוג.
                  </p>
                </div>

                <form onSubmit={handleQualifyBrief} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Requirements Text</label>
                    <textarea
                      rows={5}
                      required
                      value={rawBrief}
                      onChange={(e) => setRawBrief(e.target.value)}
                      className="w-full rounded-xl border-2 border-emerald-500 focus:border-emerald-600 ring-4 ring-emerald-500/10 bg-white p-4 text-xs leading-relaxed outline-none dark:bg-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isQualifying}
                    className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    {isQualifying ? "Parsing Requirements..." : "Analyze Brief & Generate Chunks"}
                  </button>
                </form>

                {/* Granular Segment Sentence Chunks List */}
                {chunksList.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Segmented Brief Verification Chunks</h3>
                    <div className="space-y-2 text-xs">
                      {chunksList.map((chunk) => (
                        <div
                          key={chunk.id}
                          onClick={() => {
                            setSelectedChunk(chunk);
                            setIsChunkInspectorOpen(true);
                          }}
                          className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 hover:border-amber-500 cursor-pointer transition-all flex justify-between items-center"
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-300 text-right" dir="rtl">{chunk.chunk_text}</span>
                          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                            {chunk.status_code}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Constraints and Pricing Calculations */}
              <div className="space-y-6">
                {parsedConstraints && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                      Parsed Brief Constraints
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                      <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/40">
                        <span className="text-slate-400 block mb-1">Target Quantity</span>
                        <span className="text-base text-slate-900 dark:text-white font-mono">{parsedConstraints.target_quantity}</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/40">
                        <span className="text-slate-400 block mb-1">Budget Per Unit</span>
                        <span className="text-base text-slate-900 dark:text-white font-mono">{parsedConstraints.budget_unit_max || "N/A"} ILS</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-950/40 col-span-2">
                        <span className="text-slate-400 block mb-1">Event Target Date</span>
                        <span className="text-sm text-slate-900 dark:text-white font-mono">{parsedConstraints.event_date}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCatalogSearch}
                      disabled={isSearching}
                      className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white"
                    >
                      {isSearching ? "Searching catalog..." : "Match in-stock Catalog Gifts"}
                    </button>
                  </div>
                )}

                {/* Match Results list */}
                {searchResults.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">Matches Found</span>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                      {searchResults.map((res) => {
                        const isSelected = selectedSkus.includes(res.item.internal_sku);
                        return (
                          <div 
                            key={res.item.id} 
                            className={`p-3 rounded-lg border flex items-center justify-between text-xs font-semibold cursor-pointer transition-all ${
                              isSelected ? "border-amber-500 bg-amber-500/5" : "border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/20"
                            }`}
                            onClick={() => {
                              setSelectedSkus(prev =>
                                prev.includes(res.item.internal_sku)
                                  ? prev.filter(s => s !== res.item.internal_sku)
                                  : [...prev, res.item.internal_sku]
                              );
                            }}
                          >
                            <div>
                              <h4 className="text-slate-900 dark:text-white" dir="rtl">{res.item.title_he}</h4>
                              <span className="text-[10px] text-slate-400 block mt-0.5">SKU: {res.item.internal_sku}</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => {}} 
                              className="h-4 w-4 text-amber-500 rounded border-slate-300"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {selectedSkus.length > 0 && (
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-slate-500">Margin Percent</label>
                          <input 
                            type="number" 
                            value={margin} 
                            onChange={(e) => setMargin(parseInt(e.target.value) || 35)}
                            className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 font-mono"
                          />
                        </div>
                        <button
                          onClick={handleGenerateProposal}
                          disabled={isGenerating}
                          className="w-full rounded-lg bg-amber-500 py-3 text-xs font-bold text-white hover:bg-amber-600"
                        >
                          {isGenerating ? "Generating Proposal..." : "Generate Shared Offer Links"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB B: CATALOG MANAGER & EXCEL BULK INGESTION */}
          {currentMenu === "catalog_manager" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Catalog & Sheets Ingestion
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Bulk ingest supplier price sheets, configure parameters, and review active inventory caches.
                  </p>
                </div>

                {/* UX Proximity: Platform recommendation and step checklist nested directly above search */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>שלב 2 מתוך 3: סינון והתאמת מתנות מהקטלוג</span>
                    <div className="flex gap-1">
                      <span className="h-1.5 w-6 rounded bg-emerald-500"></span>
                      <span className="h-1.5 w-6 rounded bg-emerald-500"></span>
                      <span className="h-1.5 w-6 rounded bg-slate-200 dark:bg-slate-800"></span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 text-right leading-relaxed" dir="rtl">
                    <strong>💡 המלצת פלטפורמה:</strong> סנן את 2,000+ פריטי הקטלוג באמצעות מסנני הקטגוריה ותיבת החיפוש הירוקה למטה, והוסף מתנות מתאימות לעגלת הלקוח.
                  </p>
                </div>

                {/* Faceted Filtering & Search */}
                <div className="p-4 rounded-xl border-2 border-emerald-500 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-wrap gap-4 items-center mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Smart fuzzy search product SKU or parameters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>
                  <div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 font-semibold"
                    >
                      <option value="All">All Categories</option>
                      <option value="Bags">Bags & Backpacks</option>
                      <option value="Gadgets">Bluetooth Speakers</option>
                    </select>
                  </div>
                </div>

                {/* Products Grid (Paginated virtual container) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { sku: "BTI-BAG-1042", title: "תיק גב יוקרתי - הרווארד", price: 25.0, category: "Bags", emoji: "🎒", top: true },
                    { sku: "BTI-TECH-2050", title: "רמקול POLO WOOPER", price: 38.85, category: "Gadgets", emoji: "🔊", top: true },
                    { sku: "BTI-BAG-1050", title: "תיק ספורט מתקפל", price: 18.0, category: "Bags", emoji: "👜", top: false },
                    { sku: "BTI-TECH-2040", title: "מטען נייד 10000mAh", price: 22.5, category: "Gadgets", emoji: "🔋", top: false }
                  ]
                    .filter(p => categoryFilter === "All" || p.category === categoryFilter)
                    .filter(p => searchQuery === "" || p.sku.includes(searchQuery) || p.title.includes(searchQuery))
                    .map((item) => (
                      <div key={item.sku} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900 relative">
                        {item.top && (
                          <span className="absolute top-3 left-3 bg-amber-500/10 text-amber-500 rounded px-2 py-0.5 text-[9px] font-bold">
                            ⭐ Top Pick Recommend
                          </span>
                        )}
                        <span className="absolute top-3 right-3 text-2xl">{item.emoji}</span>
                        
                        <div className="mt-4 text-right" dir="rtl">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {item.sku}</p>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                              onClick={() => handleToggleWishlist(item.sku)}
                              className="text-xs font-bold text-slate-400 hover:text-red-500"
                            >
                              {wishlist.includes(item.sku) ? "❤️ Saved" : "🖤 Save to Cart"}
                            </button>
                            <span className="text-sm font-bold text-amber-500 font-mono">{item.price} ILS</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Bulk Excel Upload Card */}
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Excel/Sheets Bulk Importer</h3>
                  <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
                    Paste your raw spreadsheet JSON row records below to bulk upsert catalog items and configure international wholesale costs.
                  </p>
                  
                  <form onSubmit={handleBulkUploadExcel} className="space-y-4 text-xs font-semibold">
                    <textarea
                      rows={8}
                      value={excelInput}
                      onChange={(e) => setExcelInput(e.target.value)}
                      className="w-full rounded border border-slate-200 bg-slate-50 p-3 text-[10px] font-mono outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950"
                    />
                    <button
                      type="submit"
                      disabled={isUploadingExcel}
                      className="w-full rounded-lg bg-amber-500 py-2.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                    >
                      {isUploadingExcel ? "Parsing excel rows..." : "Bulk Ingest Sheets Rows"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB C: CRM PIPELINE & PDF WORKSPACE */}
          {currentMenu === "crm_pipeline" && (
            <div className="space-y-8 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-left">
                  B2B Sales CRM & Omnichannel Deals
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-left">
                  Track B2B pipeline stages, trigger PDF generation manuals, and audit historic customer deal logs.
                </p>
              </div>

              {/* UX Proximity: Platform recommendation and step checklist nested directly above pipeline */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2 mb-6">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>שלב 3 מתוך 3: קביעת רווח, מחירונים והפקה ידנית של PDF</span>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-6 rounded bg-emerald-500"></span>
                    <span className="h-1.5 w-6 rounded bg-emerald-500"></span>
                    <span className="h-1.5 w-6 rounded bg-emerald-500"></span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 text-right leading-relaxed" dir="rtl">
                  <strong>💡 המלצת פלטפורמה:</strong> סקור את הצעות הלקוחות בלוח הקנבן, שלח קישור וואטסאפ או לחץ על הכפתור הירוק למטה להפקת קובץ PDF והורדתו ישירות ל-CRM.
                </p>
              </div>

              {/* Kanban Pipeline representation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Lead Ingestion (רישום פנייה)", stage: "Lead Ingestion" },
                  { title: "Proposal Sent (הצעה נשלחה)", stage: "Proposal Sent" },
                  { title: "Closed Won (סגור בהצלחה)", stage: "Closed Won" }
                ].map((col) => (
                  <div key={col.stage} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-850 dark:bg-slate-900 space-y-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-left">
                      {col.title}
                    </span>
                    <div className="space-y-3">
                      {crmDeals
                        .filter(d => d.stage === col.stage)
                        .map(deal => (
                          <div key={deal.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-950 dark:border-slate-850 text-right">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{deal.client}</h4>
                            <p className="text-[10px] text-slate-400 mt-1">סוכן מטפל: {deal.agent}</p>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                              <button
                                onClick={() => handleManualPDFGeneration("ea1d5229-ada7-4bae-8ca9-6c7b488b694a")}
                                disabled={isGeneratingPDF}
                                className="text-[10px] font-bold text-amber-500 hover:underline"
                              >
                                {isGeneratingPDF ? "מפיק PDF..." : "📥 הפק PDF ידנית"}
                              </button>
                              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{deal.value}</span>
                            </div>
                            <div className="mt-2 text-[9px] text-slate-400 bg-slate-200 dark:bg-slate-800 rounded p-1">
                              <strong>סיבת פעולה:</strong> {deal.logs}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB D: TEMPLATE HUB SANDBOX */}
          {currentMenu === "template_hub" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Page Layout Template Hub
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Duplicate layout configurations, tweak visual spacing sliders, and promote variants to live production.
                  </p>
                </div>

                {/* Sandbox Visual Page Sandbox Variant Renderer */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase">Interactive Layout Sandbox Variant (`?sandbox_variant=default`)</span>
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-500 uppercase">
                      Live A/B Sandbox Mode
                    </span>
                  </div>

                  {/* Render simulated template details with slider values */}
                  <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-4" style={{ padding: `${sliderMargin}px` }}>
                    <div className="h-10 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs" style={{ fontSize: `${sliderFontSize}px` }}>
                      🎒 תבנית כותרת מוצר - הרווארד (גופן: {sliderFontSize}px)
                    </div>
                    <div className="h-32 rounded bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center text-xs text-slate-400">
                      📷 Mockup Logo Blend Container Widget
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Turnaround Turner:</span>
                      <span className="text-emerald-500 font-bold">Feasible (3 days)</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 text-xs font-semibold">
                    <button
                      onClick={() => alert("Sandbox page duplicated as new variant 'variant_v2'!")}
                      className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800"
                    >
                      Duplicate Variant
                    </button>
                    <button
                      onClick={() => alert("Promoted Sandbox variant setting parameters to Production successfully!")}
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Promote to Live Production
                    </button>
                  </div>
                </div>
              </div>

              {/* Adjustable parameters sliders */}
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                    Template Sliders
                  </h3>
                  
                  <div className="space-y-4 text-xs font-semibold">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-400">
                        <span>Padding Spacing (px)</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{sliderMargin}px</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        value={sliderMargin}
                        onChange={(e) => setSliderMargin(parseInt(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-400">
                        <span>Header Font Size (px)</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{sliderFontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={sliderFontSize}
                        onChange={(e) => setSliderFontSize(parseInt(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB E: SUPPLIER SUBCONTRACTORS CONFIGURATION */}
          {currentMenu === "supplier_registry" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Supplier Subcontractor Registry
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Register new branding partners and setup fee structures for quotation pricing calculations.
                </p>
              </div>

              {/* UX Proximity: stacked description and rate setup guide */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2 max-w-2xl">
                <p className="text-[11px] text-slate-600 dark:text-slate-300 text-right leading-relaxed" dir="rtl">
                  <strong>💡 הגדרת קבלנים:</strong> מלא את פרטי החברה ותעריף ההגדרה (Setup Fee) בטבלה. המערכת תשלב עלויות אלו אוטומטית בהצעות מחיר לפי כמויות יעד.
                </p>
              </div>

              <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6">Register Subcontractor & Initial Rate Card</h3>
                
                <form onSubmit={handleCreateSubcontractor} className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-500">Company Name</label>
                      <input
                        type="text"
                        required
                        value={newSubcontractor.company_name}
                        onChange={(e) => setNewSubcontractor(prev => ({ ...prev, company_name: e.target.value }))}
                        className="w-full rounded border-2 border-emerald-500 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:bg-slate-950"
                        placeholder="e.g. Gal Laser Netanya"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Contact Person</label>
                      <input
                        type="text"
                        required
                        value={newSubcontractor.contact_name}
                        onChange={(e) => setNewSubcontractor(prev => ({ ...prev, contact_name: e.target.value }))}
                        className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950"
                        placeholder="e.g. Gal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-500">Specialty Customization Technique</label>
                      <select
                        value={newSubcontractor.specialties}
                        onChange={(e) => setNewSubcontractor(prev => ({ ...prev, specialties: e.target.value }))}
                        className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <option value="laser_engraving">Laser Engraving</option>
                        <option value="uv_print">UV Print</option>
                        <option value="silk_print">Silk Print</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-500">Setup Fee (ILS)</label>
                      <input
                        type="number"
                        required
                        value={newSubcontractor.setup_fee}
                        onChange={(e) => setNewSubcontractor(prev => ({ ...prev, setup_fee: parseFloat(e.target.value) || 0 }))}
                        className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingSub}
                    className="w-full rounded bg-amber-500 py-2.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    {isCreatingSub ? "Registering Subcontractor..." : "Save Subcontractor & Rate Card"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB F: CUSTOMER WORKSPACE REGISTRY */}
          {currentMenu === "customer_registry" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Customer Workspace Account Setup
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Provision unique workspace segments for corporate clients and upload branding logo packages.
                </p>
              </div>

              {/* UX Proximity banner */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2 max-w-2xl">
                <p className="text-[11px] text-slate-600 dark:text-slate-300 text-right leading-relaxed" dir="rtl">
                  <strong>💡 שיוך לקוחות:</strong> הזן את שם החברה ובחר את ענף הפעילות. לאחר מכן תוכל להעלות את לוגו הלקוח לטיוטות ההצעה.
                </p>
              </div>

              <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1">
                    <label className="text-slate-500">Workspace / Customer Name</label>
                    <input
                      type="text"
                      required
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full rounded border-2 border-emerald-500 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-600 dark:bg-slate-950"
                      placeholder="e.g. Acme Corp Israel"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500">Industry Sector</label>
                    <select
                      value={newCustomer.domain_type}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, domain_type: e.target.value }))}
                      className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950"
                    >
                      <option value="corporate_gifts">Corporate Gifts & Promos</option>
                      <option value="events_management">Events & Conferences</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isCreatingCustomer}
                    className="w-full rounded bg-amber-500 py-2.5 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    {isCreatingCustomer ? "Registering Customer..." : "Save Customer Workspace Profile"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB G: LIBRARY HUB VIEWPORT (Master Schema SSOT) */}
          {currentMenu === "library_hub" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Library Hub (Single Source of Truth)
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Manage core system vocabularies, tag hierarchies, state transitions, and custom lookup registry lists.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto pb-1">
                <button
                  onClick={() => setCurrentLibraryTab("tags")}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${
                    currentLibraryTab === "tags"
                      ? "border-amber-500 text-amber-500"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🏷️ Tag Tree Registry
                </button>
                <button
                  onClick={() => setCurrentLibraryTab("statuses")}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${
                    currentLibraryTab === "statuses"
                      ? "border-amber-500 text-amber-500"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  ⚡ Status Lifecycle Flow
                </button>
                {customLibraries.map((lib) => (
                  <button
                    key={lib.tab_id}
                    onClick={() => setCurrentLibraryTab(lib.tab_id)}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 capitalize ${
                      currentLibraryTab === lib.tab_id
                        ? "border-amber-500 text-amber-500"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    📂 {lib.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Content */}
              {currentLibraryTab === "tags" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Active Tag Tree Nodes</h3>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 text-xs font-mono">
                      {tagsList.length === 0 ? (
                        <p className="text-slate-500 italic">No tags registered in database.</p>
                      ) : (
                        tagsList.map(tag => (
                          <div key={tag.id} className="p-2.5 rounded border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex justify-between items-center">
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{tag.label}</span>
                              {tag.parent_id && <span className="text-[10px] text-slate-400 block">Parent ID: {tag.parent_id}</span>}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">Tag</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-fit">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Ratify New Tag</h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as any;
                      const label = form.label.value;
                      const parent_id = form.parent_id.value || null;
                      const res = await fetch("http://localhost:8000/api/v1/schemas/tags", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({ label, parent_id })
                      });
                      if (res.ok) {
                        form.reset();
                        fetchTagsAndStatuses();
                        alert("Tag successfully ratified!");
                      }
                    }} className="space-y-4 text-xs font-semibold">
                      <div className="space-y-1">
                        <label className="text-slate-500">Tag Label</label>
                        <input name="label" required type="text" className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950" placeholder="e.g. Laser Engraving" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-500">Parent Tag (Optional)</label>
                        <select name="parent_id" className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950">
                          <option value="">-- None (Root Node) --</option>
                          {tagsList.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                      </div>
                      <button type="submit" className="w-full rounded bg-amber-500 py-2 text-xs font-bold text-white hover:bg-amber-600">
                        Ratify System Tag
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {currentLibraryTab === "statuses" && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Active System States Registry</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold">
                    {statusesList.map(st => (
                      <div key={st.code} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-1">
                        <span className="font-mono font-bold text-amber-500 block">{st.code}</span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{st.label}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-normal">{st.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB F: DESIGN STUDIO VIEWPORT (Theming & Block Builder) */}
          {currentMenu === "design_studio" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Custom Gem Design Studio
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Compose page sections, test dynamic density, and switch preset colors in real-time.
                  </p>
                </div>
                {/* Download Specs buttons */}
                <div className="flex gap-2">
                  <a
                    href="/api/download?filename=2026-08-07__CISEM__AntigravityLocal__CommunicationSpecification__V1.0.md"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    📥 Download Corespine (.md)
                  </a>
                  <a
                    href="/api/download?filename=2026-08-07__CISEM__AntigravityLocal__TraceabilitySpecification__V1.0.md"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    📥 Download Overlay (.md)
                  </a>
                  <a
                    href="/api/download?filename=2026-08-07__CISEM__AntigravityLocal__PlanProtocolSpecification__V1.0.md"
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    📥 Download Protocol (.md)
                  </a>
                </div>
              </div>

              {/* Layout: Sidebar + Canvas Viewport */}
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* 1. Left Control Panel: Palette & Settings */}
                <div className="xl:col-span-1 space-y-6">
                  {/* Theme Presets */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Axis B: Preset Color</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "slate", label: "Silver Slate", color: "bg-slate-500" },
                        { id: "emerald", label: "Forest Emerald", color: "bg-emerald-500" },
                        { id: "indigo", label: "Amethyst Indigo", color: "bg-indigo-500" },
                        { id: "amber", label: "Rust Amber", color: "bg-amber-500" }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setStudioTheme(t.id as any)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-bold transition-all ${
                            studioTheme === t.id
                              ? "border-amber-500 bg-amber-500/5 text-amber-500 ring-1 ring-amber-500/10"
                              : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${t.color}`} />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Density Presets */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Axis A: Spacing Density</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "balanced", label: "Balanced Mode", desc: "Clean margins" },
                        { id: "condensed", label: "Condensed Mode", desc: "High density" }
                      ].map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setStudioDensity(d.id as any)}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                            studioDensity === d.id
                              ? "border-amber-500 bg-amber-500/5 text-amber-500 ring-1 ring-amber-500/10"
                              : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <span className="text-xs font-bold">{d.label}</span>
                          <span className="text-[9px] text-slate-400 mt-0.5">{d.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Studio Mode (Light vs Dark) */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Canvas Mode</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setStudioMode("light")}
                        className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                          studioMode === "light"
                            ? "border-amber-500 bg-amber-500/5 text-amber-500"
                            : "border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        ☀️ Light Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => setStudioMode("dark")}
                        className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                          studioMode === "dark"
                            ? "border-amber-500 bg-amber-500/5 text-amber-500"
                            : "border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        🌙 Dark Preview
                      </button>
                    </div>
                  </div>

                  {/* Add Block Palette */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Add Page Modules</h3>
                    <div className="space-y-2">
                      {[
                        { type: "hero", label: "Hero Header Section", icon: "⚡" },
                        { type: "stats", label: "Statistics Dashboard", icon: "📊" },
                        { type: "features", label: "Feature Matrix Grid", icon: "🛡️" },
                        { type: "pricing", label: "Pricing Cards", icon: "🏷️" },
                        { type: "testimonials", label: "Testimonial Carousel Grid", icon: "💬" },
                        { type: "cta", label: "Call to Action Banner", icon: "📣" },
                        { type: "footer", label: "Footer Section", icon: "📝" }
                      ].map((m) => (
                        <button
                          key={m.type}
                          type="button"
                          onClick={() => addStudioBlock(m.type)}
                          className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left text-xs font-bold text-slate-700 dark:text-slate-300 transition-all hover:translate-x-1"
                        >
                          <span>{m.icon} {m.label}</span>
                          <span className="text-amber-500 text-sm font-light">+</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Right Workspace Viewport: Live Render Area */}
                <div className="xl:col-span-3 space-y-6">
                  {/* Canvas Viewport Frame */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg bg-slate-900">
                    <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                      <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">canvas-viewport (Isolated Preview)</span>
                      <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-amber-400 uppercase font-bold tracking-wider">
                        {studioTheme} theme
                      </span>
                    </div>

                    {/* Isolated Preview Canvas Container */}
                    <div
                      id="canvas-viewport"
                      className={`design-studio-preview theme-${studioTheme} density-${studioDensity} ${
                        studioMode === "dark" ? "dark" : ""
                      } p-8 min-h-[500px] transition-all bg-[var(--color-background-preview)] text-[var(--color-foreground-preview)]`}
                    >
                      {studioBlocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
                          <span className="text-4xl mb-4">🎨</span>
                          <h3 className="text-lg font-bold text-slate-400">Your Canvas is Empty</h3>
                          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                            Click components in the left palette to add them to your custom design composition.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-[var(--spacing-multiplier)]">
                          {studioBlocks.map((block, idx) => {
                            const isFirst = idx === 0;
                            const isLast = idx === studioBlocks.length - 1;
                            return (
                              <div
                                key={block.id}
                                className="relative group border border-dashed border-[var(--color-border-custom)] p-6 rounded-[var(--radius-base)] bg-[var(--color-surface)] shadow-sm hover:ring-2 hover:ring-amber-500/20 transition-all text-left"
                              >
                                {/* Reordering Toolbar */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10">
                                  <button
                                    disabled={isFirst}
                                    type="button"
                                    onClick={() => moveStudioBlock(idx, "up")}
                                    className="p-1 rounded bg-[var(--color-primary-bg)] text-[var(--color-primary)] border border-[var(--color-border-custom)] text-[10px] font-bold disabled:opacity-30 hover:bg-amber-500 hover:text-white"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    disabled={isLast}
                                    type="button"
                                    onClick={() => moveStudioBlock(idx, "down")}
                                    className="p-1 rounded bg-[var(--color-primary-bg)] text-[var(--color-primary)] border border-[var(--color-border-custom)] text-[10px] font-bold disabled:opacity-30 hover:bg-amber-500 hover:text-white"
                                  >
                                    ▼
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeStudioBlock(block.id)}
                                    className="p-1 rounded bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold hover:bg-red-200"
                                  >
                                    ✕
                                  </button>
                                </div>

                                {/* Render Specific Layout Sections */}
                                {block.type === "hero" && (
                                  <div className="text-center py-6">
                                    <input
                                      type="text"
                                      value={block.title}
                                      onChange={(e) => updateBlockText(block.id, "title", e.target.value)}
                                      className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-amber-500 outline-none text-2xl font-extrabold tracking-tight text-[var(--color-foreground-preview)] font-sans"
                                    />
                                    <input
                                      type="text"
                                      value={block.subtitle}
                                      onChange={(e) => updateBlockText(block.id, "subtitle", e.target.value)}
                                      className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-amber-500 outline-none text-xs text-slate-400 mt-2 font-semibold"
                                    />
                                    <div className="mt-4 flex justify-center gap-3">
                                      <button type="button" className="px-4 py-2 rounded-[var(--radius-base)] bg-[var(--color-primary)] text-[var(--color-surface)] hover:bg-[var(--color-primary-hover)] text-xs font-bold transition-all shadow-sm">
                                        Get Started
                                      </button>
                                      <button type="button" className="px-4 py-2 rounded-[var(--radius-base)] bg-[var(--color-primary-bg)] text-[var(--color-primary)] hover:opacity-80 text-xs font-bold transition-all">
                                        Learn More
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {block.type === "stats" && (
                                  <div className="py-4">
                                    <input
                                      type="text"
                                      value={block.title}
                                      onChange={(e) => updateBlockText(block.id, "title", e.target.value)}
                                      className="w-full bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-amber-500 outline-none text-sm font-bold text-center text-[var(--color-primary)] mb-4"
                                    />
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                      {[
                                        { val: "99.9%", lbl: "Performance" },
                                        { val: "15ms", lbl: "Latency" },
                                        { val: "0.0%", lbl: "Error Rate" }
                                      ].map((stat, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-[var(--color-primary-bg)]">
                                          <div className="text-lg font-extrabold text-[var(--color-foreground-preview)]">{stat.val}</div>
                                          <div className="text-[9px] text-slate-400 font-semibold">{stat.lbl}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {block.type === "features" && (
                                  <div className="space-y-4">
                                    <div className="text-center">
                                      <input
                                        type="text"
                                        value={block.title}
                                        onChange={(e) => updateBlockText(block.id, "title", e.target.value)}
                                        className="bg-transparent text-center border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-amber-500 outline-none text-base font-bold text-[var(--color-foreground-preview)]"
                                      />
                                      <input
                                        type="text"
                                        value={block.subtitle}
                                        onChange={(e) => updateBlockText(block.id, "subtitle", e.target.value)}
                                        className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-amber-500 outline-none text-[10px] text-slate-400 mt-1"
                                      />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                      {[
                                        { title: "Deterministic", desc: "Non-repudiation tracking" },
                                        { title: "Immutable", desc: "Audit logs & proof assets" },
                                        { title: "Decidable", desc: "No freestyling logic runs" }
                                      ].map((item, i) => (
                                        <div key={i} className="p-3 border border-[var(--color-border-custom)] rounded-[var(--radius-base)]">
                                          <h4 className="text-xs font-bold text-[var(--color-primary)]">{item.title}</h4>
                                          <p className="text-[9px] text-slate-400 mt-1 leading-normal">{item.desc}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {block.type === "pricing" && (
                                  <div className="space-y-4">
                                    <div className="text-center">
                                      <h3 className="text-sm font-bold text-[var(--color-foreground-preview)]">Flexible Scaled Pricing</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                      {[
                                        { plan: "Starter", price: "$49", act: false },
                                        { plan: "Professional", price: "$99", act: true },
                                        { plan: "Enterprise", price: "$249", act: false }
                                      ].map((p, i) => (
                                        <div
                                          key={i}
                                          className={`p-4 rounded-[var(--radius-base)] border text-center ${
                                            p.act
                                              ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/10"
                                              : "border-[var(--color-border-custom)]"
                                          }`}
                                        >
                                          <div className="text-xs font-bold text-slate-400">{p.plan}</div>
                                          <div className="text-lg font-extrabold text-[var(--color-foreground-preview)] mt-1">{p.price}</div>
                                          <button
                                            type="button"
                                            className={`w-full mt-3 py-1.5 rounded-[var(--radius-base)] text-[9px] font-bold ${
                                              p.act
                                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                                : "bg-[var(--color-primary-bg)] text-[var(--color-primary)] hover:opacity-80"
                                            }`}
                                          >
                                            Activate Plan
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {block.type === "testimonials" && (
                                  <div className="space-y-4">
                                    <div className="text-center">
                                      <h3 className="text-sm font-bold text-[var(--color-foreground-preview)]">Governor Endorsements</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      {[
                                        { quote: "Compliance execution resolved to nominal in 3 compile steps.", name: "Yariv F.", role: "Global Auditor" },
                                        { quote: "The design studio tokens are properly isolated, avoiding style leaks.", name: "DeepMind Team", role: "Verification Agent" }
                                      ].map((t, i) => (
                                        <div key={i} className="p-3 bg-[var(--color-primary-bg)] rounded-[var(--radius-base)] border border-[var(--color-border-custom)]">
                                          <p className="text-[10px] italic text-[var(--color-foreground-preview)]">"{t.quote}"</p>
                                          <div className="mt-2 text-[9px] font-bold text-[var(--color-primary)]">{t.name} — <span className="text-slate-400 font-normal">{t.role}</span></div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {block.type === "cta" && (
                                  <div className="p-4 rounded-[var(--radius-base)] bg-[var(--color-primary-bg)] border border-[var(--color-border-custom)] text-center">
                                    <input
                                      type="text"
                                      value={block.title}
                                      onChange={(e) => updateBlockText(block.id, "title", e.target.value)}
                                      className="w-full text-center bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-amber-500 outline-none text-base font-extrabold text-[var(--color-foreground-preview)]"
                                    />
                                    <div className="mt-4 flex max-w-sm mx-auto gap-2">
                                      <input
                                        type="email"
                                        placeholder="Enter compliance email"
                                        className="flex-1 rounded-[var(--radius-base)] border border-[var(--color-border-custom)] bg-[var(--color-surface)] px-3 py-1.5 text-[10px] outline-none"
                                      />
                                      <button type="button" className="px-4 py-1.5 rounded-[var(--radius-base)] bg-[var(--color-primary)] text-[var(--color-surface)] text-[10px] font-bold hover:bg-[var(--color-primary-hover)]">
                                        Join Waitlist
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {block.type === "footer" && (
                                  <div className="flex justify-between items-center text-[10px] text-slate-400 py-2 border-t border-[var(--color-border-custom)] mt-4">
                                    <input
                                      type="text"
                                      value={block.title}
                                      onChange={(e) => updateBlockText(block.id, "title", e.target.value)}
                                      className="bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-amber-500 outline-none text-left font-bold"
                                    />
                                    <input
                                      type="text"
                                      value={block.subtitle}
                                      onChange={(e) => updateBlockText(block.id, "subtitle", e.target.value)}
                                      className="bg-transparent border-b border-transparent hover:border-[var(--color-border-custom)] focus:border-amber-500 outline-none text-right font-semibold"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Deterministic Export Panel */}
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-left">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Deterministic AST Export (JSON)</h3>
                    <pre className="p-4 rounded-lg bg-slate-950 text-slate-300 font-mono text-[10px] overflow-x-auto max-h-[250px] leading-relaxed">
                      {JSON.stringify(
                        {
                          version: "1.0.0",
                          schema: "CISEM_DESIGN_STUDIO_AST",
                          tokens: {
                            theme: studioTheme,
                            density: studioDensity,
                            mode: studioMode
                          },
                          blocks: studioBlocks.map(b => ({
                            id: b.id,
                            type: b.type,
                            title: b.title,
                            subtitle: b.subtitle
                          }))
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB G: SANDBOX PLAYGROUND */}
          {currentMenu === "sandbox_playground" && (
            <div className="space-y-6" dir="rtl">
              {/* Header */}
              <div className="flex justify-between items-center text-right">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    ארגז החול הפלטפורמי (Sandbox Playground)
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    סביבת פיתוח מהיר, יצירת אבות-טיפוס ומדידת רעיונות לפני ייצוא לליבת המערכת.
                  </p>
                </div>
              </div>

              {/* Category tabs switcher */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto pb-px">
                {[
                  { id: "website", label: "🌐 Website", desc: "אתרי ספקים B2B" },
                  { id: "landing_page", label: "📄 Landing Page", desc: "דפי נחיתה מהירים" },
                  { id: "crm", label: "💼 CRM Stacker", desc: "ניהול לידים מונחה AI" },
                  { id: "social_media", label: "📣 Social Banner", desc: "סטודיו באנרים" },
                  { id: "knowledge_hub", label: "📚 Knowledge Hub", desc: "מאגר מסמכים" },
                  { id: "vocabulary", label: "📝 Vocabulary", desc: "מילון אקסיומות" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSandboxTab(tab.id as any)}
                    className={`whitespace-nowrap pb-4 px-1 text-sm font-semibold border-b-2 transition-all ${
                      sandboxTab === tab.id
                        ? "border-amber-500 text-amber-500"
                        : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-md">
                
                {/* 1. Website prototype preview */}
                {sandboxTab === "website" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Left: Customizer controls */}
                      <div className="lg:col-span-1 space-y-4 text-right">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">עיצוב ומיתוג</span>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">ערכת צבעים</label>
                          <div className="grid grid-cols-2 gap-2">
                            {(["emerald", "indigo", "rose", "amber"] as const).map((theme) => (
                              <button
                                key={theme}
                                onClick={() => setSandboxWebTheme(theme)}
                                className={`px-2 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                                  sandboxWebTheme === theme
                                    ? "bg-slate-100 dark:bg-slate-800 border-amber-500 text-amber-500"
                                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                              >
                                {theme}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">גופן (Typography)</label>
                          <div className="flex gap-2">
                            {(["sans", "serif", "mono"] as const).map((font) => (
                              <button
                                key={font}
                                onClick={() => setSandboxWebFont(font)}
                                className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                                  sandboxWebFont === font
                                    ? "bg-slate-100 dark:bg-slate-800 border-amber-500 text-amber-500"
                                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                {font}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Simulated browser mockup preview */}
                      <div className="lg:col-span-3 space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-right">תצוגה מקדימה במכשיר</span>
                        
                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
                          {/* Browser Address Bar */}
                          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-red-400 block" />
                              <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
                              <span className="w-3 h-3 rounded-full bg-green-400 block" />
                            </div>
                            <div className="flex-1 bg-white dark:bg-slate-950 px-3 py-1 rounded-md text-xs text-slate-400 text-left border border-slate-200/50 dark:border-slate-800">
                              https://sandbox.commark.co.il/preview/supplier-store
                            </div>
                          </div>

                          {/* Rendered Mock Content */}
                          <div className={`p-8 min-h-[400px] text-right transition-all duration-300 ${
                            sandboxWebFont === "serif" ? "font-serif" : sandboxWebFont === "mono" ? "font-mono" : "font-sans"
                          } ${
                            sandboxWebTheme === "emerald" ? "text-emerald-950 dark:text-emerald-100" :
                            sandboxWebTheme === "rose" ? "text-rose-950 dark:text-rose-100" :
                            sandboxWebTheme === "amber" ? "text-amber-950 dark:text-amber-100" :
                            "text-indigo-950 dark:text-indigo-100"
                          }`}>
                            <div className="max-w-xl mx-auto space-y-6">
                              <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800">
                                <span className={`text-lg font-extrabold ${
                                  sandboxWebTheme === "emerald" ? "text-emerald-600" :
                                  sandboxWebTheme === "rose" ? "text-rose-600" :
                                  sandboxWebTheme === "amber" ? "text-amber-600" :
                                  "text-indigo-600"
                                }`}>GreenTech Agri B2B</span>
                                <nav className="flex gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                                  <span>ראשי</span>
                                  <span>קטלוג</span>
                                  <span>צור קשר</span>
                                </nav>
                              </div>

                              <div className="space-y-4 py-8">
                                <h1 className="text-3xl font-extrabold tracking-tight">ציוד השקיה ופולימרים מתקדמים לחקלאות</h1>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                  ספק מורשה של מערכות דישון, צינורות טפטוף מחוזקים ומוצרי פלסטיק מתקדמים עבור משקי העוטף והנגב המערבי.
                                </p>
                                <div className="pt-4 flex gap-3 justify-end">
                                  <button className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50">
                                    הורד קטלוג מלא (PDF)
                                  </button>
                                  <button className={`px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm ${
                                    sandboxWebTheme === "emerald" ? "bg-emerald-600 hover:bg-emerald-700" :
                                    sandboxWebTheme === "rose" ? "bg-rose-600 hover:bg-rose-700" :
                                    sandboxWebTheme === "amber" ? "bg-amber-600 hover:bg-amber-700" :
                                    "bg-indigo-600 hover:bg-indigo-700"
                                  }`}>
                                    הזמן עכשיו
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Landing Page Customizer */}
                {sandboxTab === "landing_page" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">עורך מבנה דף נחיתה</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-right">
                      {/* Section Checklist */}
                      <div className="space-y-4 p-4 border border-slate-100 rounded-xl dark:border-slate-800">
                        <h3 className="text-sm font-bold">מבנה הדף המוצע (Drag & Drop Blueprint)</h3>
                        <p className="text-xs text-slate-400">השתמש בסכמת הרכיבים ליצירת עמוד שיווקי מתואם:</p>
                        
                        <div className="space-y-2">
                          {[
                            { name: "Hero Header", status: "מיוצא" },
                            { name: "Feature Matrix grid", status: "מיוצא" },
                            { name: "Live Catalog search bar", status: "טיוטה" },
                            { name: "B2B Price Calculator", status: "טיוטה" },
                            { name: "Testimonials Carousel", status: "מיוצא" },
                            { name: "Footer disclaimer", status: "מיוצא" }
                          ].map((sec, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
                              <span className="text-slate-400 font-medium">#{idx + 1}</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">{sec.name}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sec.status === "מיוצא" ? "bg-green-100 text-green-700 dark:bg-green-950/20" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20"
                              }`}>{sec.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Code Generator Output */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-400 block">מחולל קוד HTML/CSS (Boilerplate)</span>
                        <div className="relative">
                          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-left text-xs font-mono overflow-x-auto h-[320px]">
{`<!-- Landing Page Section Blueprint -->
<section class="relative bg-slate-900 text-white py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div class="text-center">
      <h1 class="text-5xl font-extrabold tracking-tight">
        הזמן מהספקים הגדולים בארץ
      </h1>
      <p class="mt-4 text-lg text-slate-300">
        פלטפורמת B2B מקושרת Supabase עם הזרקת DNA ולימוד לולאות.
      </p>
    </div>
  </div>
</section>`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CRM Leads Stacker */}
                {sandboxTab === "crm" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">לוח ניהול לידים B2B</span>
                      <span className="text-xs font-bold bg-amber-500/10 px-2.5 py-1 rounded-full text-amber-500">מסונכרן עם PostgreSQL</span>
                    </div>

                    {/* Columns grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-right">
                      {(["scraped", "enriched", "contacted", "won"] as const).map((stage) => {
                        const stageLeads = sandboxCrmLeads.filter(l => l.status === stage);
                        return (
                          <div key={stage} className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col gap-3 min-h-[300px]">
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                              <span className="text-xs text-slate-400 font-bold">({stageLeads.length})</span>
                              <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300 capitalize">{stage}</span>
                            </div>

                            <div className="flex-1 space-y-3">
                              {stageLeads.map((lead) => (
                                <div key={lead.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm space-y-2 text-xs">
                                  <div className="font-bold text-slate-800 dark:text-slate-200">{lead.name}</div>
                                  <div className="text-slate-400">תקציב: {lead.budget}</div>
                                  
                                  {/* Movement buttons */}
                                  <div className="flex justify-between items-center pt-2 gap-1 border-t border-slate-100 dark:border-slate-850/50">
                                    <button 
                                      disabled={stage === "scraped"}
                                      onClick={() => {
                                        const order = ["scraped", "enriched", "contacted", "won"];
                                        const prevStage = order[order.indexOf(stage) - 1];
                                        setSandboxCrmLeads(sandboxCrmLeads.map(l => l.id === lead.id ? { ...l, status: prevStage } : l));
                                      }}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
                                    >
                                      ◀ הקודם
                                    </button>
                                    <button 
                                      disabled={stage === "won"}
                                      onClick={() => {
                                        const order = ["scraped", "enriched", "contacted", "won"];
                                        const nextStage = order[order.indexOf(stage) + 1];
                                        setSandboxCrmLeads(sandboxCrmLeads.map(l => l.id === lead.id ? { ...l, status: nextStage } : l));
                                      }}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 disabled:opacity-40"
                                    >
                                      הבא ➔
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {stageLeads.length === 0 && (
                                <div className="text-xs text-slate-400 italic text-center py-8">אין לידים בשלב זה</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Social Media Banner Studio */}
                {sandboxTab === "social_media" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right">
                      {/* Left: Input Text Customizer */}
                      <div className="lg:col-span-1 space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">עריכת תוכן הבאנר</span>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">כותרת הבאנר (שם המבצע / מיתוג)</label>
                          <input
                            type="text"
                            value={sandboxBannerText}
                            onChange={(e) => setSandboxBannerText(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-1 focus:ring-amber-500 text-right font-medium"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">צבע רקע (CSS Gradients)</label>
                          <div className="flex flex-col gap-2">
                            {[
                              { label: "Indigo Dusk", class: "from-slate-900 via-slate-800 to-indigo-950" },
                              { label: "Emerald Canopy", class: "from-slate-950 via-slate-900 to-emerald-950" },
                              { label: "Amber Sunset", class: "from-slate-950 via-slate-900 to-amber-950" },
                              { label: "Crimson Eclipse", class: "from-slate-950 via-slate-900 to-rose-950" }
                            ].map((bg, idx) => (
                              <button
                                key={idx}
                                onClick={() => setSandboxBannerBg(bg.class)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-right border ${
                                  sandboxBannerBg === bg.class ? "border-amber-500 text-amber-500 bg-slate-50 dark:bg-slate-850" : "border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-400"
                                }`}
                              >
                                {bg.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Mock banner canvas rendering */}
                      <div className="lg:col-span-2 space-y-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">תצוגת באנר שיווקי B2B</span>
                        
                        <div className={`w-full rounded-2xl bg-gradient-to-tr ${sandboxBannerBg} p-12 min-h-[300px] flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden border border-slate-850`}>
                          {/* Pattern overlay simulation */}
                          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                          
                          <div className="flex items-center gap-1.5 z-10">
                            <span className="text-xl">🚀</span>
                            <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">COMMARK PLATFORM TRIAL</span>
                          </div>

                          <div className="z-10 text-white font-extrabold text-3xl leading-snug max-w-lg mt-6">
                            {sandboxBannerText || "טקסט לדוגמה לבאנר שיווקי"}
                          </div>

                          <div className="z-10 flex gap-4 text-[10px] text-slate-400 font-bold border-t border-slate-800 w-full justify-center pt-4 mt-6">
                            <span>תואם LinkedIn</span>
                            <span>•</span>
                            <span>תואם Twitter</span>
                            <span>•</span>
                            <span>תואם Facebook Ads</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Knowledge Hub */}
                {sandboxTab === "knowledge_hub" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">חיפוש וגילוי מסמכי מערכת</span>
                      <input
                        type="text"
                        placeholder="חפש מסמכים..."
                        value={sandboxSearchQuery}
                        onChange={(e) => setSandboxSearchQuery(e.target.value)}
                        className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 w-64 text-right"
                      />
                    </div>

                    {/* Files list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                      {[
                        { title: "EnterpriseScaleArchitectureBlueprint V1.0", path: "planning/2026-08-08__AntigravityLocal__YarivHuman__EnterpriseScaleArchitectureBlueprint__V1.0.md", type: "Plan" },
                        { title: "SandboxSystemSchemaAndStructure V1.0", path: "planning/2026-08-08__AntigravityLocal__YarivHuman__SandboxSystemSchemaAndStructure__V1.0.md", type: "Schema" },
                        { title: "ProjectManagementAndAccountabilityFramework V1.0", path: "planning/2026-08-08__AntigravityLocal__YarivHuman__ProjectManagementAndAccountabilityFramework__V1.0.md", type: "Framework" },
                        { title: "KnowledgeManagementAndPlatformDnaEnforcement V1.0", path: "planning/2026-08-08__AntigravityLocal__YarivHuman__KnowledgeManagementAndPlatformDnaEnforcement__V1.0.md", type: "Enforcement" },
                        { title: "PersonaAuditSandboxPositioning V1.0", path: "planning/2026-08-08__AntigravityLocal__YarivHuman__PersonaAuditSandboxPositioning__V1.0.md", type: "Audit" },
                        { title: "SandboxThresholdProtocol V1.0", path: "planning/2026-08-08__AntigravityLocal__YarivHuman__SandboxThresholdProtocol__V1.0.md", type: "Protocol" }
                      ].filter(f => f.title.toLowerCase().includes(sandboxSearchQuery.toLowerCase()))
                       .map((doc, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 hover:border-amber-500/50 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">{doc.type}</span>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{doc.title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-400 break-all">{doc.path}</p>
                          <div className="flex justify-start gap-2 pt-2">
                            <a
                              href={`http://localhost:3000/api/download?filename=${doc.title}.md`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 text-[10px] font-bold rounded-lg bg-amber-500 text-white shadow-sm hover:bg-amber-600"
                            >
                              הורד קובץ MD
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Vocabulary & Axioms */}
                {sandboxTab === "vocabulary" && (
                  <div className="space-y-6 text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">עריכת מילון מונחי פלטפורמה</span>
                    
                    {/* Add Axiom Form */}
                    <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">הוסף מונח / אקסיומה למאגר</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="קוד מונח (למשל: AX-200)"
                          value={newAxiomId}
                          onChange={(e) => setNewAxiomId(e.target.value)}
                          className="px-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-950 text-right"
                        />
                        <input
                          type="text"
                          placeholder="שם המונח"
                          value={newAxiomName}
                          onChange={(e) => setNewAxiomName(e.target.value)}
                          className="px-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-950 text-right"
                        />
                        <input
                          type="text"
                          placeholder="תיאור ואקסיומת פלטפורמה"
                          value={newAxiomDesc}
                          onChange={(e) => setNewAxiomDesc(e.target.value)}
                          className="px-3 py-2 rounded-lg text-xs border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-950 text-right md:col-span-1"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!newAxiomId.trim() || !newAxiomName.trim()) return;
                          setSandboxAxioms([...sandboxAxioms, { id: newAxiomId, name: newAxiomName, status: "Active", desc: newAxiomDesc }]);
                          setNewAxiomId("");
                          setNewAxiomName("");
                          setNewAxiomDesc("");
                        }}
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
                      >
                        הוסף למילון המקומי
                      </button>
                    </div>

                    {/* Axioms table */}
                    <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
                      <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-right text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-900/80 font-bold text-slate-500">
                          <tr>
                            <th className="px-4 py-3">מזהה</th>
                            <th className="px-4 py-3">מונח / אקסיומה</th>
                            <th className="px-4 py-3">סטטוס</th>
                            <th className="px-4 py-3">תיאור העיקרון</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {sandboxAxioms.map((ax, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                              <td className="px-4 py-3 font-mono font-bold text-amber-500">{ax.id}</td>
                              <td className="px-4 py-3 font-bold">{ax.name}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-950/20">{ax.status}</span>
                              </td>
                              <td className="px-4 py-3 text-slate-400">{ax.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}



          {/* TAB H: GOV - HUMAN SCHEMA */}
          {currentMenu === "human_schema" && (
            <div className="space-y-6 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">מילון מונחים וסכמה אנושית (Human Logic)</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">תרגום מונחי מכירות ושפה טבעית לסכמות מערכת קשיחות.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                        <th className="pb-2">מונח שיווקי / אנושי</th>
                        <th className="pb-2">סיווג טקסונומי</th>
                        <th className="pb-2">מזהה מערכת קשיח</th>
                        <th className="pb-2">מגבלות עיבוד ומיתוג</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                      <tr>
                        <td className="py-3">מגן זכוכית מעוגל (Round Shield)</td>
                        <td>צורת פרס (Shape)</td>
                        <td className="font-mono text-amber-500">TRI-E</td>
                        <td>עובי מקסימלי 12 מ"מ, הדפסה UV אחורית בלבד</td>
                      </tr>
                      <tr>
                        <td className="py-3">גביע קריסטל אופטי (Optical Prism)</td>
                        <td>חומר (Material)</td>
                        <td className="font-mono text-amber-500">Crystal_Optical</td>
                        <td>דורש חריטת לייזר דו-מימדית (Laser_2D)</td>
                      </tr>
                      <tr>
                        <td className="py-3">בסיס עץ טבעי (Natural Base)</td>
                        <td>חומר (Material)</td>
                        <td className="font-mono text-amber-500">Wood_Natural</td>
                        <td>אסור במגע עם נוזלי עיבוד כימיים</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB I: GOV - SYSTEM SCHEMA */}
          {currentMenu === "system_schema" && (
            <div className="space-y-6 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">סכמת מערכת ומגבלות מסד נתונים (System Logic)</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">אכיפת תקינות נתונים ברמת בסיס הנתונים SQLite ו-CHECK constraints.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="p-4 rounded-lg bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed text-left" dir="ltr">
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
          )}

          {/* TAB J: GOV - THRESHOLD (ACCOUNTABILITY DASHBOARD) */}
          {currentMenu === "threshold" && (
            <div className="space-y-6 text-right" dir="rtl">
              {/* Title & Refresh Button */}
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-850 pb-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    לוח בקרת אחריות ושלמות (Accountability & Gate Dashboard)
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    מעקב בזמן אמת אחר מחזור ביצוע, שערי קומפילציה, דוחות ATV ורישום קבצים קריפטוגרפי.
                  </p>
                </div>
                <button
                  onClick={fetchDashboardMetrics}
                  className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <span>🔄 רענן נתונים</span>
                </button>
              </div>

              {isLoadingDashboard ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">טוען מדדי אחריות מהשרת המקומי...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Grid Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Card 1: Circular Turn Gauge */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 flex flex-col items-center justify-between min-h-[320px]">
                      <div className="w-full flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">שער הקומפילציה (LGG Gate Counter)</span>
                        <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full">מופעל אוטומטית</span>
                      </div>

                      {/* SVG Circle Ring */}
                      {(() => {
                        const current = dashboardData?.turnData?.current ?? 0;
                        const ceiling = dashboardData?.turnData?.ceiling ?? 15;
                        const pct = Math.min(current / ceiling, 1);
                        const radius = 45;
                        const circ = 2 * Math.PI * radius;
                        const strokeDashoffset = circ - pct * circ;

                        // Dynamic Color selection based on turn thresholds
                        let strokeColor = "stroke-emerald-500";
                        let textColor = "text-emerald-500";
                        let levelText = "פיתוח שוטף (Standard)";
                        if (current >= 9 && current <= 13) {
                          strokeColor = "stroke-amber-500";
                          textColor = "text-amber-500";
                          levelText = "אזהרה (Approaching Ceiling)";
                        } else if (current >= 14) {
                          strokeColor = "stroke-rose-500";
                          textColor = "text-rose-500";
                          levelText = "סכנת חסימה (Audit Imminent)";
                        }

                        return (
                          <div className="flex flex-col items-center py-4 space-y-3">
                            <div className="relative w-32 h-32">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                                {/* Track */}
                                <circle
                                  cx="60"
                                  cy="60"
                                  r={radius}
                                  className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                                  strokeWidth="8"
                                />
                                {/* Progress Indicator */}
                                <circle
                                  cx="60"
                                  cy="60"
                                  r={radius}
                                  className={`${strokeColor} fill-none transition-all duration-500`}
                                  strokeWidth="8"
                                  strokeDasharray={circ}
                                  strokeDashoffset={strokeDashoffset}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-2xl font-extrabold font-mono ${textColor}`}>{current}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">מתוך {ceiling} תורות</span>
                              </div>
                            </div>
                            <span className={`text-xs font-bold ${textColor}`}>{levelText}</span>
                          </div>
                        );
                      })()}

                      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                        בכל סיבוב פיתוח מונה התורות עולה. בהגעה ל-15 תורות המערכת תינעל עד לביצוע בדיקת Persona Audit מקיפה.
                      </p>
                    </div>

                    {/* Card 2: ATV Gaps & Verdict */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between min-h-[320px]">
                      <div className="w-full flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ממצאי אימות ATV (Anti-Theater Validator)</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          dashboardData?.atv?.verdict === "GAPS_FOUND" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                        }`}>
                          {dashboardData?.atv?.verdict || "NOMINAL"}
                        </span>
                      </div>

                      <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">מספר פערים שהתגלו:</span>
                          <span className={`text-lg font-mono font-bold ${
                            dashboardData?.atv?.gaps > 0 ? "text-rose-500" : "text-emerald-500"
                          }`}>{dashboardData?.atv?.gaps ?? 0} פערים</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">מנגנונים משופרים (Beneficial Drifts):</span>
                          <span className="text-lg font-mono font-bold text-indigo-500">{dashboardData?.atv?.drifts ?? 0} רשומים</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">אזהרת קצב פיתוח (P/E Ratio):</span>
                          <span className={`text-xs font-bold ${
                            dashboardData?.atv?.feedback?.pe_ratio_warning ? "text-amber-500" : "text-emerald-500"
                          }`}>{dashboardData?.atv?.feedback?.pe_ratio_warning || "nominal"}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-350 block mb-1">המלצת סבב נוכחי:</span>
                        <p className="text-slate-400 leading-normal italic">
                          "{dashboardData?.atv?.feedback?.recommendation || "אין המלצות ספציפיות לסבב זה."}"
                        </p>
                      </div>
                    </div>

                    {/* Card 3: Active Security Checks */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between min-h-[320px]">
                      <div className="w-full flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">מונה הפעלת מנגנוני הגנה</span>
                        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">מבוקר</span>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1 max-h-[160px]">
                        {(dashboardData?.registry || []).map((m: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-2 rounded-lg border border-slate-100 dark:border-slate-805 bg-slate-50/50 dark:bg-slate-950/20 text-xs">
                            <span className="font-mono font-bold text-slate-400">x{m.actual_triggers} triggers</span>
                            <div className="text-right">
                              <div className="font-bold text-slate-750 dark:text-slate-300">{m.mechanism_id}</div>
                              <div className="text-[10px] text-slate-450">{m.description.substring(0, 32)}...</div>
                            </div>
                          </div>
                        ))}
                        {(dashboardData?.registry || []).length === 0 && (
                          <div className="text-xs text-slate-400 italic text-center py-8">לא נטענו מנגנונים</div>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 leading-relaxed text-center">
                        המנגנונים סופרים אירועי אינטגרציה קבועים ומאמתים שאין שימוש במונחים לא קשיחים.
                      </div>
                    </div>

                  </div>

                  {/* Cryptographic Registry Ledger Table */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 overflow-hidden">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ספר רישום הקבצים הקריפטוגרפי (Workspace Cryptographic Registry Ledger)</span>
                      <span className="text-xs font-bold bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full font-mono">Registry v1.16</span>
                    </div>

                    <div className="overflow-x-auto max-h-[300px]">
                      <table className="min-w-full divide-y divide-slate-150 dark:divide-slate-800 text-right text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-900/80 font-bold text-slate-500 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3">שם הקובץ ומסלול מקומי</th>
                            <th className="px-4 py-3">גרסה פעילה</th>
                            <th className="px-4 py-3">מצב אישור</th>
                            <th className="px-4 py-3">מפתח אבטחה SHA-256 Checksum</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-750 dark:text-slate-350">
                          {(dashboardData?.files || []).map((file: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/40">
                              <td className="px-4 py-3 font-semibold break-all max-w-[280px]">
                                {file.path}
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-slate-500">{file.version}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  file.status === "RATIFIED" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                                }`}>
                                  {file.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono text-[10px] text-slate-400 break-all select-all">
                                {file.sha256 || "PENDING_RECONCILIATION"}
                              </td>
                            </tr>
                          ))}
                          {(dashboardData?.files || []).length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                                אין קבצים רשומים במפתח הנוכחי.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB K: ARCH - TRACEABILITY */}
          {currentMenu === "traceability_spec" && (
            <div className="space-y-6 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">צינורות ביצוע ועקבות (Pipelines & Overlays)</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">מעקב עקבות עבודה ואימות נתיבי קוד מוצפנים.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                    <span className="font-bold text-emerald-500">אינטגרציה מלאה</span>
                    <span className="font-mono text-slate-500">CXP-PKT-20260808-002</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                    <span className="font-bold text-emerald-500">אינטגרציה מלאה</span>
                    <span className="font-mono text-slate-500">CXP-PKT-20260808-001</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB L: ARCH - AGENTS & SKILLS */}
          {currentMenu === "agents_skills" && (
            <div className="space-y-6 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">מלווים וכישורים (Agents & Skills)</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ניהול סוכני הבינה המלאכותית הפעילים בממשק וכישורי המערכת שלהם.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">סוכן מלווה שיווקי (Proactive Marketer)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">מספק הצעות שיפור למפרטי מיתוג, סגנונות מומלצים ועריכת מפרטי מוצרים מבוססת מגמות שוק.</p>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded uppercase font-bold">Active</span>
                </div>
                <div className="p-5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">מבקר ארכיטקטורה קשוח (Rigid Auditor)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">אוכף מפרטי DDL, נרטיבים מוצפנים, מניעת כפילויות קוד, ובקרות סף (Threshold) לפני אישור קבצים.</p>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded uppercase font-bold">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB M: ARCH - PROTOCOLS & SPECS */}
          {currentMenu === "protocols_wizards" && (
            <div className="space-y-6 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">פרוטוקולים ומפרטים קנוניים (Protocols & Wizards)</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">אכיפת אישור קבצים ואימות נרטיבים ברמת ביצוע קוד.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg text-xs leading-relaxed">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">מפרט יצירת תוכניות (Plan Protocol - PR-84900)</h4>
                    <p className="text-slate-500">כל שינוי קוד דורש מסמך תוכנית ביצוע מאושר (ratified_plan) עם קישור לחתימת הנגיד (governor_signature).</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB N: EXT - API PROVIDERS */}
          {currentMenu === "api_providers" && (
            <div className="space-y-6 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">ספקי מודלים וחיבוריות ענן (AI API Providers)</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ניטור וניהול מודלי שפה וראייה ממוחשבת בשימוש המערכת.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white">OpenAI Connect</h3>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>מודל ראשי: <span className="font-mono text-amber-500">gpt-5.6-sol</span></div>
                    <div>מודל ניתוח מהיר: <span className="font-mono text-amber-500">o4-mini</span></div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase">Online</span>
                </div>
                <div className="p-5 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white">Google Gemini API</h3>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>מודל ראשי: <span className="font-mono text-amber-500">gemini-2.0-pro-exp</span></div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase">Online</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB O: EXT - MATTING MODELS */}
          {currentMenu === "matting_models" && (
            <div className="space-y-6 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">מודלי הסרת רקע ומאטינג (Matting Models)</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">הגדרות סף חיתוך, מסיכות קצוות ומודלי בינה מלאכותית מבוססי ראייה.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                    <span className="text-slate-400 block mb-1">מודל פעיל</span>
                    <span className="text-slate-800 dark:text-slate-200">BirefNet (General High-Res)</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                    <span className="text-slate-400 block mb-1">רזולוציית עיבוד</span>
                    <span className="text-slate-800 dark:text-slate-200">1024x1024 px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB P: EXT - STORAGE & CDN */}
          {currentMenu === "storage_cdn" && (
            <div className="space-y-6 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">אחסון ורשתות הפצת תוכן (Storage & CDNs)</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ניהול ספריות שיתוף מבוססות Google Drive והפצת Assets שיווקיים.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                    <span className="text-slate-700 dark:text-slate-300">תיקיית חילופין (Intersystem Exchange)</span>
                    <span className="font-mono text-slate-400">9000__INTERSYSTEM_EXECUTION_EXCHANGE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB Q: EXT - DATA INTEGRATIONS */}
          {currentMenu === "data_integrations" && (
            <div className="space-y-6 text-right" dir="rtl">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">חיבורי נתונים ואינטגרציות (Data Integrations)</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">חיבורי APIs חיצוניים, סנכרון מלאים וקבלני מיתוג צד ג'.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Supabase DB Sync Endpoint</span>
                    <span className="text-emerald-500 font-bold">CONNECTED</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
          </>
        )}
      </div>

      {/* --- DRAWERS LAYER --- */}

      {/* 1. SLIDE-OUT CHUNK INSPECTOR DRAWER */}
      {isChunkInspectorOpen && selectedChunk && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-850 flex flex-col h-full animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div>
                <span className="font-mono text-[9px] uppercase text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded">
                  {selectedChunk.serial_code}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">Chunk Inspector</h3>
              </div>
              <button
                onClick={() => setIsChunkInspectorOpen(false)}
                className="text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-6 text-xs font-semibold overflow-y-auto pr-1">
              <div className="space-y-1">
                <span className="text-slate-500">Source Chunk Text</span>
                <p className="p-3 bg-slate-50 border border-slate-100 rounded dark:bg-slate-950 dark:border-slate-850 leading-relaxed font-normal text-slate-800 dark:text-slate-300 text-right" dir="rtl">
                  {selectedChunk.chunk_text}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500">Ratified Tag</span>
                <select
                  value={selectedChunk.tag_id || ""}
                  onChange={e => handleUpdateChunk(selectedChunk.id, { tag_id: e.target.value || undefined })}
                  disabled={isUpdatingChunk}
                  className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950"
                >
                  <option value="">-- Assign Tag --</option>
                  {tagsList.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500">Verification Status</span>
                <select
                  value={selectedChunk.status_code || ""}
                  onChange={e => handleUpdateChunk(selectedChunk.id, { status_code: e.target.value })}
                  disabled={isUpdatingChunk}
                  className="w-full rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-950"
                >
                  {statusesList.filter(s => s.code.startsWith("brief_")).map(s => (
                    <option key={s.code} value={s.code}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-6">
              <button
                onClick={() => setIsChunkInspectorOpen(false)}
                className="w-full rounded bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-900"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. COGNITIVE BACKLOG DRAWER */}
      {isBacklogOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-850 flex flex-col h-full animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div>
                <span className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  💡 Cognitive Backlog
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Parking lot for offline ideas & questions</span>
              </div>
              <button
                onClick={() => setIsBacklogOpen(false)}
                className="text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Backlog Form */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-950/40 dark:border-slate-850 mb-6">
              <h4 className="text-xs font-bold text-amber-500 mb-3 uppercase tracking-wider">Park an Idea</h4>
              <form onSubmit={handleCreateBacklog} className="space-y-3 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-slate-500">Thought/Title</label>
                  <input
                    required
                    type="text"
                    value={newBacklog.title}
                    onChange={e => setNewBacklog(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900"
                    placeholder="e.g. Integrate logo image upload drawer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-500">Impact Level</label>
                    <select
                      value={newBacklog.impact_level}
                      onChange={e => setNewBacklog(prev => ({ ...prev, impact_level: e.target.value }))}
                      className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <option value="low">Low (Post-v1)</option>
                      <option value="medium">Medium (Plan Check)</option>
                      <option value="high">High (Active Block)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500">Context Source</label>
                    <input
                      type="text"
                      value={newBacklog.context}
                      onChange={e => setNewBacklog(prev => ({ ...prev, context: e.target.value }))}
                      className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500 dark:border-slate-800 dark:bg-slate-900"
                      placeholder="e.g. Proposal Client Tab"
                    />
                  </div>
                </div>
                <button type="submit" disabled={isSubmittingBacklog} className="w-full rounded bg-amber-500 py-2 text-xs font-bold text-white hover:bg-amber-600 disabled:opacity-50">
                  {isSubmittingBacklog ? "Parking..." : "Park Thought in Backlog"}
                </button>
              </form>
            </div>

            {/* Backlog List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-semibold">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Parked Thoughts</span>
              {backlogList.length === 0 ? (
                <p className="text-slate-500 italic">No thoughts parked in the backlog.</p>
              ) : (
                backlogList.map(item => {
                  let badgeColor = "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
                  if (item.impact_level === "high") badgeColor = "bg-rose-500/10 text-rose-500";
                  else if (item.impact_level === "medium") badgeColor = "bg-amber-500/10 text-amber-500";
                  return (
                    <div key={item.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/10 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[9px] text-slate-400">{item.serial_code} ({item.status})</span>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${badgeColor}`}>{item.impact_level}</span>
                      </div>
                      <h5 className="font-bold text-slate-900 dark:text-white">{item.title}</h5>
                      {item.context && <p className="text-[10px] text-slate-400">Source Context: {item.context}</p>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC PERSONAS CONFIGURATION DRAWER */}
      {isPersonasOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white p-6 shadow-2xl dark:bg-slate-900 border-l border-slate-200 dark:border-slate-850 flex flex-col h-full animate-slide-in">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 text-right" dir="rtl">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">סוכן מלווה וירטואלי</h3>
                <span className="text-[10px] text-slate-400 block mt-1">שנה את אופי הסוכן המנחה אותך בממשק</span>
              </div>
              <button
                onClick={() => setIsPersonasOpen(false)}
                className="text-slate-400 hover:text-slate-950 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto text-right" dir="rtl">
              {personas.map((p) => {
                const isSelected = activePersona === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSwitchPersona(p.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/20"
                        : "border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</h4>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                          פעיל במערכת
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{p.description}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-6">
              <button
                onClick={() => setIsPersonasOpen(false)}
                className="w-full rounded bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-900"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

      <AgentChatWidget tenantId="cisem-local" />
    </div>
  );
}
