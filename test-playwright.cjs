const { chromium } = require('playwright');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));

const server = app.listen(0, async () => {
  const port = server.address().port;
  const url = `http://localhost:${port}/`;
  console.log(`Server listening on ${url}`);

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
    console.log("Page loaded successfully.");
  } catch (err) {
    console.error("Failed to load page:", err);
  }

  await browser.close();
  server.close();
});
