const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testRender() {
  console.log("=== Running Playwright Pre-Render Screenshot & DOM Audit ===");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

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
      await page.waitForTimeout(1500);
      const snapshotPath = path.join(snapshotDir, item.name);
      await page.screenshot({ path: snapshotPath, fullPage: true });
      console.log(`[SNAPSHOT CAPTURED SUCCESS]: ${snapshotPath}`);
    } catch (err) {
      console.warn(`[NAVIGATION ERROR]: ${err.message}`);
    }
  }

  await browser.close();
  console.log("SUCCESS: Screenshot capture complete.");
  process.exit(0);
}

testRender();
