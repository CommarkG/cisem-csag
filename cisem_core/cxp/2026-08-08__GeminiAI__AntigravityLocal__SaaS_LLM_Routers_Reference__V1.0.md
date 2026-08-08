# Gemini AI SaaS LLM API Routers Reference

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\cxp\\2026-08-08__GeminiAI__AntigravityLocal__SaaS_LLM_Routers_Reference__V1.0.md"
  artifact_status: "RAW"
  maturity: "RELEASED"
  version: "1.0"
  tags: ["LLM_Routers", "OmniRoute", "9Router", "pi-antigravity-rotator", "OpenRouter", "Model_Proxy"]
  inherited_authorities: []
  related_implementation_adapter: "GOOGLE_ANTIGRAVITY_ADAPTER"
  local_edits_allowed: false
  role_type: "CANONICAL_REFERENCE"
---

## 1. Google Antigravity LLM API Routers Overview

The best API routers recommended for Google Antigravity depend entirely on whether you want to route external LLMs into Antigravity or load-balance multiple Antigravity/Gemini accounts out to other coding tools.

### 1.1. Free/Open-Source Multi-Provider Routing: OmniRoute or 9Router
If your goal is to route third-party AI models (like Claude, OpenAI, or DeepSeek) into the Antigravity IDE using an OpenAI-compatible endpoint, these two local gateways are currently the most popular community recommendations.
- **OmniRoute**: Heavily recommended in recent community tutorials for providing free, unlimited AI routing into Antigravity. It serves as a local gateway (localhost) that aggregates free-tier providers and optimizes tokens via extensions like Cline or Kilo Code.
- **9Router**: An excellent alternative that features a smart 3-tier routing system (Subscription, Cheap, and Free tiers). It provides seamless format translation between OpenAI, Anthropic, Gemini, and Antigravity protocols, complete with automatic fallback routing if a specific quota fills up.

### 1.2. Enterprise & Multi-Account Load Balancing: `pi-antigravity-rotator`
If you are managing a large-scale setup or a multi-agent workforce and need to route out of Google Antigravity accounts without running into rate limits, `pi-antigravity-rotator` is the gold standard.
- **Smart Account Rotation**: Automatically rotates requests across a pool of multiple Google accounts to avoid 429 Too Many Requests errors.
- **Advanced Metrics**: Includes a web dashboard featuring real-time quota tracking, latency scoring (p50/p95), and protective pausing if an account faces abuse flags.
- **Drop-in Replacement**: Operates locally via an OpenAI/Anthropic-compatible format to split traffic seamlessly.

### 1.3. Managed External Commercial Routing: OpenRouter (via One CLI)
If you want to completely bypass local hosting and pull from over 500+ cloud-hosted models, OpenRouter paired with the WithOne AI (One CLI) platform is the most structured approach.
- It eliminates credential management by allowing you to authenticate OpenRouter directly inside your Antigravity environment via an automated `one add open-router` command.
