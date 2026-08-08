# Ratified Plan: CISEM-IP-20260808-SPCS
# Architectural Reasoning: python-native website scraper using requests, bs4, and Gemini REST API to avoid package overhead.
# Parent Principles: PR-98000 (SIPI), PR-84900 (Plan Creation Protocol)

import os
import re
import urllib.parse
import requests
from bs4 import BeautifulSoup

def scrape_and_extract_brand(target_url: str) -> dict:
    print(f"[Scraper] Scraping target URL: {target_url}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    try:
        response = requests.get(target_url, headers=headers, timeout=15, verify=False)
        response.raise_for_status()
        html = response.text
    except Exception as e:
        print(f"[Scraper] Error downloading page: {e}")
        return {
            "businessName": urllib.parse.urlparse(target_url).netloc,
            "tagline": "Premium Tailored Solutions",
            "suggestedTheme": "corporate",
            "suggestedDensity": "balanced",
            "suggestedMode": "landing",
            "isRTL": False,
            "scrapedProducts": []
        }

    soup = BeautifulSoup(html, "html.parser")
    
    # 1. Extacted Headings and Paragraphs
    headings = [h.get_text().strip() for h in soup.find_all(["h1", "h2", "h3"]) if h.get_text().strip()]
    headings = headings[:12]
    
    paragraphs = [p.get_text().strip() for p in soup.find_all("p") if p.get_text().strip() and len(p.get_text().strip()) > 15]
    paragraphs = paragraphs[:8]
    
    title = soup.title.string.strip() if soup.title else ""
    
    # 2. Extract Color Hex-codes
    color_candidates = set()
    hex_pattern = re.compile(r'#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})')
    # Search inside styles and inline style attributes
    for style_tag in soup.find_all("style"):
        for m in hex_pattern.finditer(style_tag.get_text()):
            color_candidates.add(m.group(0))
            if len(color_candidates) > 20:
                break
                
    for tag in soup.find_all(style=True):
        for m in hex_pattern.finditer(tag["style"]):
            color_candidates.add(m.group(0))
            if len(color_candidates) > 30:
                break

    # 3. Compile Raw DOM Structure
    raw_payload = {
        "title": title,
        "headings": headings,
        "bodyText": paragraphs,
        "detectedColors": list(color_candidates)[:15]
    }
    
    # 4. Call Gemini REST API for Structured Normalization
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_key:
        print("[Scraper] Warning: GEMINI_API_KEY not found in environment. Returning fallback mockup.")
        return {
            "businessName": title.split("|")[0].strip() if title else "Custom Client Portal",
            "tagline": headings[0] if headings else "Smart Solutions and Integration Engine",
            "suggestedTheme": "corporate",
            "suggestedDensity": "balanced",
            "suggestedMode": "landing",
            "isRTL": False,
            "scrapedProducts": [
                {"id": "1", "name": "Standard Plan", "price": "$199/mo"},
                {"id": "2", "name": "Growth Bundle", "price": "$399/mo"},
                {"id": "3", "name": "Enterprise Suite", "price": "Custom"}
            ]
        }
        
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
    
    prompt = f"""
You are an expert design systems architect. Analyze the scraped raw DOM data from a prospect's website and transform it into a normalized JSON payload for a website preview sandbox.

Raw Scraped Data:
{raw_payload}

Rules:
1. Determine the best matching color palette theme ('corporate', 'emerald', 'amber', 'violet') based on detected colors or brand vibe.
2. Select an appropriate initial density style ('condensed', 'balanced', 'minimal').
3. Suggest the optimal template mode ('landing', 'catalog', 'ecommerce') based on scraped content.
4. Extract 3-6 product/service items from headings or generate reasonable sample catalog items based on the business type.
5. Identify if the primary language appears to be RTL (Hebrew/Arabic) or LTR (English).

Respond ONLY with a valid JSON matching this schema:
{{
  "businessName": "Name of the business",
  "tagline": "High converting tagline or motto",
  "suggestedTheme": "corporate" | "emerald" | "amber" | "violet",
  "suggestedDensity": "condensed" | "balanced" | "minimal",
  "suggestedMode": "landing" | "catalog" | "ecommerce",
  "isRTL": true | false,
  "scrapedProducts": [
    {{
      "id": "unique-id-string",
      "name": "Product or service name",
      "price": "Price label (e.g. $49 or Custom)"
    }}
  ]
}}
"""
    
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    try:
        res = requests.post(api_url, json=payload, timeout=15, verify=False)
        res.raise_for_status()
        res_json = res.json()
        raw_text = res_json["candidates"][0]["content"]["parts"][0]["text"]
        
        # Clean response text from code blocks if present
        raw_text = re.sub(r"^```json\s*", "", raw_text, flags=re.IGNORECASE)
        raw_text = re.sub(r"\s*```$", "", raw_text, flags=re.IGNORECASE)
        
        import json
        return json.loads(raw_text)
    except Exception as e:
        print(f"[Scraper] Gemini API extraction failed: {e}")
        return {
            "businessName": title.split("|")[0].strip() if title else "Custom Client Portal",
            "tagline": headings[0] if headings else "Smart Solutions and Integration Engine",
            "suggestedTheme": "corporate",
            "suggestedDensity": "balanced",
            "suggestedMode": "landing",
            "isRTL": False,
            "scrapedProducts": []
        }
