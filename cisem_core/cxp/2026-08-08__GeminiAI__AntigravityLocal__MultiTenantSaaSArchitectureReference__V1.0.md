# Gemini AI Multi-Tenant SaaS Architecture Reference

---
metadata:
  owner: "CISEM_GOVERNOR"
  canonical_location: "C:\\Users\\finky\\Desktop\\AntiGravity\\Cisem CsAg\\cisem_core\\cxp\\2026-08-08__GeminiAI__AntigravityLocal__MultiTenantSaaSArchitectureReference__V1.0.md"
  artifact_status: "RATIFIED"
  maturity: "RELEASED"
  version: "1.0"
  inherited_authorities: []
  related_implementation_adapter: "GOOGLE_ANTIGRAVITY_ADAPTER"
  local_edits_allowed: false
  role_type: "CANONICAL_REFERENCE"
---

## 1. Executive Summary & System Positioning

To deliver enterprise-grade multi-tenant web applications, landing pages, and e-commerce funnels—while enabling real-time site scraping, live visual personalization, and modular monetization inside Google Antigravity—a single monolithic "plug and play" platform (like WordPress or traditional SaaS builders) is suboptimal. 

The optimal approach is a Composable Monolith / Modular Full-Stack Architecture. This provides plug-and-play developer velocity, full operational control, and native integration with Antigravity’s terminal, browser, and code-analysis agents.

```
[ Antigravity Platform (Orchestrator & Agentic Layer) ]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[ Next.js 15 Frontend (App Router) ] ─── [ Engine & API Gateways ]
   ├─ TailAdmin / Shadcn UI                 ├─ Payload CMS v3 / Strapi v5 (Headless Multi-tenant)
   ├─ Tailwind CSS v4 + RTL (dir="rtl")     ├─ MedusaJS v2 (Headless E-Commerce)
   └─ Custom Staging & Scraping Sandbox     └─ Twenty CRM / Activepieces (CRM & Automation)
```

---

## 2. Payload CMS v3 Multi-Tenant, RBAC & Tiering Schema

### 2.1. Tenants Collection Schema (`collections/Tenants.ts`)
Defines tenant identity, custom domain mapping, tier levels, and granular feature flags.

```typescript
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'domain', 'tier', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      return {
        id: {
          equals: typeof user.tenant === 'object' ? user.tenant.id : user.tenant,
        },
      }
    },
    create: ({ req: { user } }) => user?.role === 'super-admin',
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      return {
        id: {
          equals: typeof user.tenant === 'object' ? user.tenant.id : user.tenant,
        },
      }
    },
    delete: ({ req: { user } }) => user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'basic',
      options: [
        { label: 'Basic (Landings & Sites)', value: 'basic' },
        { label: 'Pro (E-Commerce & Funnels)', value: 'pro' },
        { label: 'Enterprise (Full Stack & CRM)', value: 'enterprise' },
      ],
    },
    {
      name: 'featureFlags',
      type: 'group',
      fields: [
        { name: 'enableEcommerce', type: 'checkbox', defaultValue: false },
        { name: 'enableFunnels', type: 'checkbox', defaultValue: false },
        { name: 'enableCrmSync', type: 'checkbox', defaultValue: false },
        { name: 'enableRtl', type: 'checkbox', defaultValue: true },
      ],
    },
  ],
}
```

### 2.2. Users Collection Schema (`collections/Users.ts`)
Links users to tenants with RBAC access limits.

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'tenant'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      return {
        tenant: {
          equals: typeof user.tenant === 'object' ? user.tenant.id : user.tenant,
        },
      }
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Tenant Admin', value: 'tenant-admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
      admin: {
        condition: (data) => data?.role !== 'super-admin',
      },
    },
  ],
}
```

### 2.3. Tenant-Scoped Pages Collection Schema (`collections/Pages.ts`)
Scopes pages automatically to the active tenant.

```typescript
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return true // Public read access
      if (user.role === 'super-admin') return true
      return {
        tenant: {
          equals: user.tenant,
        },
      }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return ['super-admin', 'tenant-admin', 'editor'].includes(user.role)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      return {
        tenant: {
          equals: user.tenant,
        },
      }
    },
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user && req.user.role !== 'super-admin' && req.user.tenant) {
          data.tenant = typeof req.user.tenant === 'object' ? req.user.tenant.id : req.user.tenant
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      index: true,
    },
    {
      name: 'isFunnelStep',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
```

---

## 3. Next.js 15 App Router Middleware & Tenant Routing

```typescript
import { NextResponse, type NextRequest } from 'next/server'

const PLATFORM_DOMAINS = [
  'localhost:3000',
  'antigravity.io',
  'app.antigravity.io',
  process.env.NEXT_PUBLIC_ROOT_DOMAIN,
].filter(Boolean) as string[]

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get('host') || ''
  const currentHost = hostname.replace(/:\d+$/, '')
  const path = url.pathname

  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/admin') ||
    path.includes('.')
  ) {
    return NextResponse.next()
  }

  let tenantIdentifier: string | null = null
  const isPlatformDomain = PLATFORM_DOMAINS.some(domain => 
    currentHost === domain.replace(/:\d+$/, '')
  )

  if (!isPlatformDomain) {
    const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'antigravity.io').replace(/:\d+$/, '')
    if (currentHost.endsWith(`.${rootDomain}`)) {
      tenantIdentifier = currentHost.replace(`.${rootDomain}`, '')
    } else {
      tenantIdentifier = currentHost
    }
  }

  if (tenantIdentifier) {
    const rewriteUrl = new URL(`/${tenantIdentifier}${path}`, req.url)
    const response = NextResponse.rewrite(rewriteUrl)
    response.headers.set('x-tenant-identifier', tenantIdentifier)
    response.headers.set('x-original-host', hostname)
    return response
  }

  return NextResponse.next()
}
```

---

## 4. Prospect Scraper Script (Puppeteer + Gemini)

```typescript
import puppeteer from 'puppeteer'
import { GoogleGenAI, Type } from '@google/genai'
import 'dotenv/config'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

async function scrapeTargetPage(targetUrl: string) {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(targetUrl, { waitUntil: 'networkidle2' })

  const rawDOM = await page.evaluate(() => {
    return {
      title: document.title,
      headings: Array.from(document.querySelectorAll('h1, h2')).map(h => h.textContent?.trim()).slice(0, 10),
      bodyText: Array.from(document.querySelectorAll('p')).map(p => p.textContent?.trim()).slice(0, 8),
    }
  })
  await browser.close()
  return rawDOM
}
```
