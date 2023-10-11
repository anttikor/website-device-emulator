

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Luettelo alasivuista
const subpages = ["", "keita-olemme", "palvelut/painotuotteet", "suurkuvat-ja-teippaukset", "myymala-ja-nayttelymateriaalit", "yhteystiedot", "jata-tarjouspyynto", "aineisto-ohjeita"];

// Luo yläkansio kuvakaappauksille, jos sitä ei ole olemassa
const screenshotsDir = 'screenshots';
if (!fs.existsSync(screenshotsDir)){
    fs.mkdirSync(screenshotsDir);
}

(async () => {
  const browser = await puppeteer.launch();
  const devices = puppeteer.devices;

  // Lasketaan montako näkymää haetaan
  const totalViews = subpages.length * Object.keys(devices).length;
  let currentView = 0;

  for (const pageName of subpages) {
    const pageFolder = path.join(screenshotsDir, pageName || 'index');
    if (!fs.existsSync(pageFolder)){
        fs.mkdirSync(pageFolder);
    }

    for (const deviceName in devices) {
      currentView++;
      console.log(`Eteneminen: ${currentView}/${totalViews} - Laitteella: ${deviceName}, Sivulla: ${pageName || 'index'}`);

      const device = devices[deviceName];
      const page = await browser.newPage();
      await page.emulate(device);

      await page.goto(`https://demo.tuovinen.eu/${pageName}`);

      // Ota kuvakaappaus ja tallenna se
      const screenshotPath = path.join(pageFolder, `${deviceName}.png`);
      await page.screenshot({ path: screenshotPath });

      await page.close();
    }
  }

  await browser.close();
  console.log("Kuvakaappaukset on otettu.");
})();
