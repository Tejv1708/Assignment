
import { launch } from 'puppeteer';

async function runTest() {
  // Launch a headless browser
  const browser = await launch();
  const page = await browser.newPage();

  try {
    // Go to Google Flights website
    await page.goto('https://www.google.com/flights');

    // Wait for the input field to appear
    await page.waitForSelector('input[placeholder="Where from?"]');
    
    // Enter the origin and destination airports
    await page.type('input[placeholder="Where from?"]', 'Delhi');
    await page.type('input[placeholder="Where to?"]', 'Jaipur');

    // Select the departure date
    await page.click('input[aria-label = "Departure"]');
    await page.keyboard.type('Date ➝ 12 April 2023');

    // Click the search button
    await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('span'));
        const exploreElement = elements.find(element => element.textContent.includes('Explore'));
        if (exploreElement) {
          exploreElement.click();
        }
      });

    // Wait for the flight results to load

    await page.waitForSelector('body');

    

    // Get the prices of the flights
    const prices = await page.$$eval('ul.Rk10dc', (elements) => {
        const flightPrices = {};
        elements.forEach((el) => {
          const airline = el.querySelector('div.sSHqwe tPgKwe ogfYpf');
          const price = el.querySelector('div.U3gSDe');
      
          if (airline && price) {
            flightPrices[airline.textContent.trim()] = price.textContent.trim();
          }
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

