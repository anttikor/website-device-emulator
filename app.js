// Load environment variables from .env file
require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Read pages and URL from .env file
const subpages = process.env.SUBPAGES ? process.env.SUBPAGES.split(',') : [];
const baseURL = process.env.BASE_URL || '';

// Create a root directory for screenshots if it doesn't exist
const screenshotsDir = 'screenshots';
if (!fs.existsSync(screenshotsDir)){
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
    if (!fs.existsSync(pageFolder)){
        fs.mkdirSync(pageFolder);
    }

    for (const deviceName in devices) {
      currentView++;
      console.log(`Progress: ${currentView}/${totalViews} - Device: ${deviceName}, Page: ${sanitizedPageName || 'index'}`);

      const device = devices[deviceName];
      const page = await browser.newPage();
      await page.emulate(device);

      await page.goto(`${baseURL}/${pageName}`, { waitUntil: 'load' });  // Wait until the page has loaded

      // Take a screenshot and save it
      const screenshotPath = path.join(pageFolder, `${deviceName}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      await page.close();
    }
  }

  await browser.close();
  console.log("Screenshots have been taken.");
})();
