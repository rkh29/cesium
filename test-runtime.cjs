const express = require('express');
const path = require('path');
const { JSDOM } = require('jsdom');

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));

const server = app.listen(0, async () => {
  const port = server.address().port;
  const url = `http://localhost:${port}/`;
  
  console.log(`Server listening on ${url}`);

  const virtualConsole = new (require('jsdom').VirtualConsole)();
  
  virtualConsole.on("error", (err) => {
    console.error("JSDOM Error:", err);
  });
  
  virtualConsole.on("jsdomError", (err) => {
    console.error("JSDOM jsdomError:", err);
  });

  virtualConsole.on("log", (msg) => {
    console.log("JSDOM Log:", msg);
  });

  try {
    const dom = await JSDOM.fromURL(url, {
      runScripts: "dangerously",
      resources: "usable",
      virtualConsole
    });

    console.log("Page loaded. Waiting for scripts to execute...");
    
    // Wait a bit for Vue to mount
    setTimeout(() => {
      console.log("Done waiting. Shutting down.");
      server.close();
      process.exit(0);
    }, 5000);

  } catch (err) {
    console.error("Failed to load JSDOM:", err);
    server.close();
    process.exit(1);
  }
});
