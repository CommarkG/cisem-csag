// Ratified Plan: CISEM-IP-20260808-SALES-AGENT
// Architectural Reasoning: Payload CMS Collection configuration binding beforeChange image enrichment hook and localized fields.
// Parent Principles: PR-98000 (SIPI), PR-84900 (Naming Conventions)

import type { CollectionConfig } from 'payload'
import { enrichProductMedia } from '../hooks/enrichProductMedia'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeChange: [enrichProductMedia],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true, // Native Payload locale dictionary mapping (en, he, ar)
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'extractedAttributes',
      type: 'array',
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'suggestedCategory',
      type: 'text',
    },
    {
      name: 'aiEnriched',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}
