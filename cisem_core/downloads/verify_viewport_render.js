const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testRender() {
  console.log("=== Running Playwright Pre-Render Screenshot, Console & Dead Script Audit ===");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let uncaughtErrors = [];

  // TRAP 1: Uncaught Page Exception (SyntaxError, ReferenceError)
  page.on('pageerror', (exception) => {
    console.error(`[UNCAUGHT PAGE ERROR DETECTED]: ${exception.message}`);
    uncaughtErrors.push(`PAGE_ERROR: ${exception.message}`);
  });

  // TRAP 2: Console Error Messages
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error(`[CONSOLE ERROR DETECTED]: ${msg.text()}`);
      uncaughtErrors.push(`CONSOLE_ERROR: ${msg.text()}`);
    }
  });

  const routesToTest = [{ route: '/inquiry-intake', name: 'inquiry_intake_snapshot.png' }];
  const snapshotDir = path.join(__dirname, '..', 'cisem_core', 'snapshots');
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }

  for (const item of routesToTest) {
    const targetUrl = `http://localhost:4321/#${item.route}`;
    console.log(`Pinging route: ${targetUrl}...`);
    try {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 5000 });
      await page.waitForTimeout(1000);

      // TRAP 3: Dead Handler & Missing Element Reference DOM Check
      const deadReferenceCount = await page.evaluate(() => {
        let deadRefs = 0;
        // Check inline onclick references
        const elementsWithOnClick = document.querySelectorAll('[onclick]');
        elementsWithOnClick.forEach(el => {
          const handlerStr = el.getAttribute('onclick') || '';
          const match = handlerStr.match(/^([a-zA-Z0-9_$]+)\s*\(/);
          if (match && typeof window[match[1]] !== 'function') {
            console.error(`[DEAD HANDLER DETECTED]: onclick names '${match[1]}' which is undefined on window!`);
            deadRefs++;
          }
        });
        return deadRefs;
      });

      if (deadReferenceCount > 0) {
        uncaughtErrors.push(`DEAD_HANDLER_ERROR: Found ${deadReferenceCount} dead onclick event handlers on page.`);
      }

      const snapshotPath = path.join(snapshotDir, item.name);
      await page.screenshot({ path: snapshotPath, fullPage: true });
      console.log(`[SNAPSHOT CAPTURED SUCCESS]: ${snapshotPath}`);
    } catch (err) {
      console.error(`[NAVIGATION ERROR]: ${err.message}`);
      uncaughtErrors.push(`NAV_ERROR: ${err.message}`);
    }
  }

  await browser.close();

  if (uncaughtErrors.length > 0) {
    console.error(`\n[CRITICAL FAILURE]: Playwright detected ${uncaughtErrors.length} uncaught console or dead script errors!`);
    uncaughtErrors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log("SUCCESS: Zero console errors, zero dead handlers, screenshot complete.");
  process.exit(0);
}

testRender();
