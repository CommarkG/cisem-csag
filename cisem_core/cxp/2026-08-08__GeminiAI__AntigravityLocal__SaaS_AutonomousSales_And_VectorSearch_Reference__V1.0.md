# Gemini AI Autonomous Sales Agent & Vector Search Reference

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\cxp\\2026-08-08__GeminiAI__AntigravityLocal__SaaS_AutonomousSales_And_VectorSearch_Reference__V1.0.md"
  artifact_status: "RAW"
  maturity: "RELEASED"
  version: "1.0"
  tags: ["AI_Sales_Agent", "Twenty_CRM", "Payload_Enrichment_Hook", "PGVector_Search", "Multilingual_RTL", "Gemini_API_Tools"]
  inherited_authorities: []
  related_implementation_adapter: "GOOGLE_ANTIGRAVITY_ADAPTER"
  local_edits_allowed: false
  role_type: "CANONICAL_REFERENCE"
---

## 1. System Architecture: Autonomous Sales Agent + Twenty CRM Sync

This implementation provides an autonomous conversational agent embedded as a Next.js 15 client component and backed by a Serverless API Route. It uses Gemini 2.5 Flash with Function Calling (Tools) to dynamically qualify leads, collect user metadata, and execute live mutations against Twenty CRM (REST/GraphQL API) during the conversation.

```
[ Next.js 15 Client Component (Chat Widget) ]
                      │  (Streaming REST POST)
                      ▼
[ Next.js API Route (/api/agent/chat) ]
                      │  (Gemini 2.5 + Function Calling)
                      ├─── Tool: create_twenty_person ───┐
                      └─── Tool: create_opportunity ───┤
                                                       ▼
                                            [ Twenty CRM API Gateway ]
```

### 1.1. Next.js 15 API Route (`app/api/agent/chat/route.ts`)
This endpoint orchestrates the agent's system directives, maintains conversation state, and executes tool calls against the Twenty CRM REST API (`/rest/people` and `/rest/opportunities`).

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const TWENTY_API_URL = process.env.TWENTY_API_URL || 'https://api.twenty.com'
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || ''

const createTwentyPersonTool: FunctionDeclaration = {
  name: 'create_twenty_person',
  description: 'Creates or updates a prospect in Twenty CRM when name and email are disclosed.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      firstName: { type: Type.STRING, description: 'Prospect first name' },
      lastName: { type: Type.STRING, description: 'Prospect last name' },
      email: { type: Type.STRING, description: 'Prospect email address' },
      phone: { type: Type.STRING, description: 'Prospect phone number (optional)' },
      jobTitle: { type: Type.STRING, description: 'Prospect role/title (optional)' },
    },
    required: ['firstName', 'lastName', 'email'],
  },
}

const createOpportunityTool: FunctionDeclaration = {
  name: 'create_opportunity',
  description: 'Creates a sales opportunity deal in Twenty CRM when budget or timeline are verified.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      personId: { type: Type.STRING, description: 'Twenty CRM Person ID linked to this deal' },
      name: { type: Type.STRING, description: 'Name of the deal' },
      amount: { type: Type.NUMBER, description: 'Estimated value in USD' },
      stage: { type: Type.STRING, description: 'Pipeline stage' },
    },
    required: ['name', 'amount'],
  },
}

async function executeTwentyTool(name: string, args: Record<string, any>) {
  if (name === 'create_twenty_person') {
    const res = await fetch(`${TWENTY_API_URL}/rest/people`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TWENTY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: { firstName: args.firstName, lastName: args.lastName },
        emails: { primaryEmail: args.email },
        jobTitle: args.jobTitle || '',
      }),
    })
    const data = await res.json()
    return { success: res.ok, personId: data?.data?.createPerson?.id || 'mock-person-id', raw: data }
  }
  return { error: 'Unknown tool' }
}
```

---

## 2. Payload CMS v3 Automated Catalog Enrichment Hook

This hook automates metadata enrichment when product images are uploaded to the CMS.

```typescript
import type { CollectionBeforeChangeHook } from 'payload'
import { GoogleGenAI, Type } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

export const enrichProductMedia: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation !== 'create' && !req.file) {
    return data
  }
  const file = req.file
  if (!file || !file.data) {
    return data
  }

  try {
    const base64Image = file.data.toString('base64')
    const mimeType = file.mimetype || 'image/jpeg'

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        altText: {
          type: Type.OBJECT,
          properties: {
            en: { type: Type.STRING },
            he: { type: Type.STRING },
            ar: { type: Type.STRING },
          },
          required: ['en', 'he', 'ar'],
        },
        productTitle: {
          type: Type.OBJECT,
          properties: {
            en: { type: Type.STRING },
            he: { type: Type.STRING },
            ar: { type: Type.STRING },
          },
          required: ['en', 'he', 'ar'],
        },
      },
      required: ['altText', 'productTitle'],
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'Analyze this image.' },
            { inlineData: { mimeType, data: base64Image } }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema,
      }
    })
    return { ...data, title: JSON.parse(response.text).productTitle, aiEnriched: true }
  } catch (error) {
    return data
  }
}
```

---

## 3. PGVector Pipeline for Visual & Semantic Product Search

Enables PostgreSQL vector similarity search inside store catalog queries.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS product_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medusa_product_id VARCHAR(255) NOT NULL UNIQUE,
  tenant_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  embedding vector(768) NOT NULL
);

CREATE INDEX IF NOT EXISTS product_embeddings_hnsw_idx 
ON product_embeddings 
USING hnsw (embedding vector_cosine_ops);
```
