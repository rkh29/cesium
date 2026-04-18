const { chromium } = require('playwright');

(async () => {
  const url = `http://localhost:3000/`;
  console.log(`Connecting to ${url}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`Browser Error: ${msg.text()}`);
    } else {
      console.log(`Browser Log: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.error(`Browser Uncaught Exception: ${err.message}`);
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log("Page loaded successfully. Waiting 3 seconds...");
    await page.waitForTimeout(3000);
  } catch (err) {
    console.error("Failed to load page:", err);
  }

  await browser.close();
  process.exit(0);
})();
