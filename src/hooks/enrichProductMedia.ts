// Ratified Plan: CISEM-IP-20260808-SALES-AGENT
// Architectural Reasoning: Payload CMS beforeChange collection hook executing base64 image checks and metadata enrichment via Gemini Vision.
// Parent Principles: PR-98000 (SIPI), PR-84900 (Naming Conventions)

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
    const imageBuffer = file.data

    // 1. Buffer Size Check (Bypass Sharp dependency to stop installer popups)
    if (imageBuffer.length > 3 * 1024 * 1024) {
      req.payload.logger.warn('[AI Hook] Image size exceeds 3MB limit. Skipping enrichment.')
      return data
    }

    const base64Image = imageBuffer.toString('base64')
    const mimeType = file.mimetype || 'image/jpeg'

    const prompt = `
Analyze this product image carefully.
Extract structural attributes, detailed product specifications, alt text, and translated marketing descriptions.
Ensure translations are natural, high-converting, and accurately rendered in Hebrew (עברית) and Arabic (العربية).
`

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
        description: {
          type: Type.OBJECT,
          properties: {
            en: { type: Type.STRING },
            he: { type: Type.STRING },
            ar: { type: Type.STRING },
          },
          required: ['en', 'he', 'ar'],
        },
        attributes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              key: { type: Type.STRING, description: 'e.g. Primary Color, Material, Dimensions' },
              value: { type: Type.STRING, description: 'Attribute value' },
            },
            required: ['key', 'value'],
          },
        },
        categorySuggestion: { type: Type.STRING },
      },
      required: ['altText', 'productTitle', 'description', 'attributes', 'categorySuggestion'],
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.1,
      },
    })

    const extracted = JSON.parse(response.text || '{}')

    return {
      ...data,
      alt: extracted.altText,
      title: extracted.productTitle,
      description: extracted.description,
      extractedAttributes: extracted.attributes,
      suggestedCategory: extracted.categorySuggestion,
      aiEnriched: true,
    }
  } catch (error) {
    req.payload.logger.error(`[AI Hook Error] Media enrichment failed: ${error}`)
    return data
  }
}
