---
plan_id: CISEM-IP-20260809-OPENROUTER-INTEGRATION
version: '1.0'
status: DRAFT
blast_radius: MEDIUM
governor_signature: PENDING-REVIEW
axioms_linked:
- AX-10000
- PR-99000
pre_review_status: DRAFT
---

# Implementation Plan: Cloud-Hosted OpenRouter Integration

This plan details the backend integration of **OpenRouter** as our cloud-hosted multi-LLM router. It enables our Next.js portal to route queries directly to external cloud-hosted model providers (Gemini, Claude, OpenAI) without any local laptop hosting dependencies.

## User Review Required

> [!IMPORTANT]
> This integration requires setting a new environment variable `OPENROUTER_API_KEY` in the local and Vercel cloud environment config. 

## Open Questions

- **Model Selection Preference**: What should be the default cloud model routed via OpenRouter? (We recommend falling back to active systems models like `google/gemini-2.5-pro` or `anthropic/claude-3.7-sonnet`).

## Proposed Changes

### Component: Backend Router API

#### [NEW] [route.ts](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/src/app/api/agent/route.ts)
- Create a server-side route `/api/agent` that:
  1. Accepts user chat history/prompts.
  2. Forwards the request securely to `https://openrouter.ai/api/v1/chat/completions` using the `OPENROUTER_API_KEY`.
  3. Translates responses back to our frontend interface.

### Component: Environment Configuration

#### [MODIFY] [.env.example](file:///C:/Users/finky/Desktop/AntiGravity/Cisem%20CsAg/.env.example)
- Append `OPENROUTER_API_KEY=` placeholder variable.

## Verification Plan

### Automated Tests
- Run `npm run build` to confirm Next.js build soundness.
- Run `python cisem_core/cisem_gate.py` to confirm compiler gate remains green.

### Manual Verification
- Test the endpoint locally via curl/Postman to verify successful cloud-routed LLM completions.
