# Ratified Plan: CISEM-IP-20260808-SALES-AGENT
# Architectural Reasoning: Multi-modal embedding coordinator ensuring image visual descriptions are projected back into 768-dim text-embedding-004 space.
# Parent Principles: PR-98000 (SIPI), PR-84900 (Naming Conventions)

import os
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class EmbeddingService:
    @staticmethod
    def get_text_embedding(text: str) -> list:
        """
        Generate 768-dim vector embedding using Google text-embedding-004 model via REST.
        """
        gemini_key = os.environ.get("GEMINI_API_KEY")
        if not gemini_key:
            # Fallback mock vector (768 dimensions)
            print("[Embedding] Warning: GEMINI_API_KEY not found. Returning mock 768-dim vector.")
            return [0.1] * 768

        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={gemini_key}"
        
        payload = {
            "model": "models/text-embedding-004",
            "content": {
                "parts": [{"text": text}]
            }
        }

        try:
            res = requests.post(api_url, json=payload, timeout=15, verify=False)
            res.raise_for_status()
            res_json = res.json()
            return res_json["embedding"]["values"]
        except Exception as e:
            print(f"[Embedding] Text embedding failed: {e}. Returning mock vector.")
            return [0.1] * 768

    @staticmethod
    def get_image_embedding(image_bytes: bytes, mime_type: str) -> list:
        """
        Generate 768-dim embedding from image. Uses Gemini 2.5 Flash to extract dense key phrases,
        then feeds those descriptions directly back into text-embedding-004 (Gemini Brain Feedback 2).
        """
        import base64
        base64_data = base64.b64encode(image_bytes).decode("utf-8")
        
        gemini_key = os.environ.get("GEMINI_API_KEY")
        if not gemini_key:
            return [0.1] * 768

        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
        
        prompt = "Describe the visual features, style, color, pattern, material, and category of this product in dense key phrases for semantic indexing."
        
        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": base64_data
                        }
                    }
                ]
            }]
        }

        try:
            res = requests.post(api_url, json=payload, timeout=15, verify=False)
            res.raise_for_status()
            res_json = res.json()
            visual_description = res_json["candidates"][0]["content"]["parts"][0]["text"]
            
            # Project description text back into the identical coordinate space
            return EmbeddingService.get_text_embedding(visual_description)
        except Exception as e:
            print(f"[Embedding] Image visual processing failed: {e}. Returning mock vector.")
            return [0.1] * 768
