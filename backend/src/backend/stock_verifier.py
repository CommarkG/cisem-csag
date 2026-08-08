# stock_verifier.py
import asyncio
from typing import Dict, Any

async def verify_supplier_stock(supplier_url: str, required_qty: int) -> Dict[str, Any]:
    """
    On-demand Playwright worker checking live stock for certified SKUs.
    Gracefully handles CAPTCHA or timeouts, falling back to 'cached_unverified'.
    """
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        # Fallback if playwright is not installed/configured yet in local environment
        return {
            "status": "cached_unverified",
            "verified": False,
            "reason": "playwright_not_installed"
        }

    try:
        async with async_playwright() as p:
            # Launch Chromium in headless mode
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            try:
                # Set a tight timeout to trigger fallback early if page is unresponsive (e.g. 12 seconds)
                await page.goto(supplier_url, timeout=12000)
                
                # Detect typical anti-bot indicators or CAPTCHA elements
                captcha_indicators = [
                    "iframe[src*='recaptcha']", 
                    "#cf-challenge", 
                    ".g-recaptcha",
                    "iframe[src*='hcaptcha']"
                ]
                for selector in captcha_indicators:
                    if await page.is_visible(selector):
                        await browser.close()
                        return {
                            "status": "cached_unverified", 
                            "verified": False, 
                            "reason": "anti_bot_detected"
                        }
                
                # Check for generic "Out of Stock" indicators
                # Translates to Hebrew out-of-stock messages common on Polo/Wave2
                out_of_stock_selectors = [
                    ".out-of-stock", 
                    "text='אזל מהמלאי'", 
                    "text='Out of stock'",
                    "text='לא קיים במלאי'"
                ]
                for selector in out_of_stock_selectors:
                    if await page.is_visible(selector):
                        await browser.close()
                        return {
                            "status": "out_of_stock", 
                            "verified": True
                        }
                
                await browser.close()
                return {
                    "status": "verified_in_stock", 
                    "verified": True
                }
                
            except Exception as e:
                await browser.close()
                return {
                    "status": "cached_unverified", 
                    "error": str(e), 
                    "verified": False
                }
    except Exception as e:
        return {
            "status": "cached_unverified", 
            "error": f"Playwright launcher error: {str(e)}", 
            "verified": False
        }
