// Load environment variables from .env file
require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Initialize HTML content
let htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <title>Screenshots</title>
    <link rel="stylesheet" type="text/css" href="../styles.css">
  </head>
  <body>`;

// Read pages and URL from .env file
const subpages = process.env.SUBPAGES ? process.env.SUBPAGES.split(',') : [];
const baseURL = process.env.BASE_URL || '';

// Create a root directory for screenshots if it doesn't exist
const screenshotsDir = 'screenshots';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

(async () => {
  const browser = await puppeteer.launch();
  const devices = puppeteer.devices;

  // Calculate the total number of views to fetch
  const totalViews = subpages.length * Object.keys(devices).length;
  let currentView = 0;

  for (const pageName of subpages) {
    // Replace slashes with hyphens
    const sanitizedPageName = pageName.replace('/', '-');
    const pageFolder = path.join(screenshotsDir, sanitizedPageName || 'index');

    if (!fs.existsSync(pageFolder)) {
      fs.mkdirSync(pageFolder);
    }

    const page = await browser.newPage();
    await page.goto(`${baseURL}/${pageName}`, { waitUntil: 'domcontentloaded' });  // Wait until the DOM content is loaded

    // Wait for a certain period to ensure all resources are loaded
    await new Promise(r => setTimeout(r, 2000)); // Adjust this time as needed
    
    // Add page title to HTML content
    const pageTitle = await page.title();
    htmlContent += `<h1>${pageTitle}</h1>`;

    for (const deviceName in devices) {
      currentView++;
      console.log(`Progress: ${currentView}/${totalViews} - Device: ${deviceName}, Page: ${sanitizedPageName || 'index'}`);

      const device = devices[deviceName];
      await page.emulate(device);
      // Take a screenshot and save it
      const screenshotPath = path.join(pageFolder, `${deviceName}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      // Add to HTML content
      htmlContent += `<h2>${deviceName}</h2><img src="${path.relative(screenshotsDir, screenshotPath)}" alt="${deviceName}">`;
    }

    await page.close();
  }

  // Finalize HTML content
  htmlContent += '</body></html>';

  // Write HTML content to index.html
  fs.writeFileSync(path.join(screenshotsDir, 'index.html'), htmlContent);

  await browser.close();
  console.log("Screenshots have been taken.");
})();
