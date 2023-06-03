const puppeteer = require('puppeteer');

async function runTest() {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Go to Google Flights website
    await page.goto('https://www.google.com/flights');

    // Enter the origin and destination airports
    await page.type('input[name="origin"]', 'Delhi');
    await page.type('input[name="destination"]', 'Jaipur');

    // Select the departure date
    await page.click('input[aria-label="Departure date"]');
    await page.click('div[data-day="2023-04-15"]');

    // Click the search button
    await page.click('button[aria-label="Search"]');

    // Wait for the flight results to load
    await page.waitForSelector('div[data-flt-ve="flt"]');

    // Get the prices of the flights
    const prices = await page.$$eval('div[data-flt-ve="flt"]', (elements) => {
      const flightPrices = {};

      elements.forEach((el) => {
        const airline = el.querySelector('div.gws-flights-results__carriers').textContent.trim();
        const price = el.querySelector('span.IHreh').textContent.trim();

        flightPrices[airline] = price;
      });

      return flightPrices;
    });

    // Print the prices
    console.log('Flight Prices:');
    console.log(prices);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

runTest();
