const {Builder, Browser, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); 

function formatTranscript(istring) {
  const parts = istring.split(' ');

  let minutes = '0';
  let seconds = '00';

  if (parts[1] === 'second' || parts[1] === 'seconds') {
    seconds = parts[0];
    parts.splice(0,2);
    if(parseInt(seconds) < 10 ) {
      seconds = '0' + seconds;
    }
  } 
  else if (parts[3] === 'second' || parts[3] === 'seconds') {
    seconds = parts[2];
    parts.splice(2,2);
    if(parseInt(seconds) < 10 ) {
      seconds = '0' + seconds;
    }
  }
  if (parts[1] === 'minute' || parts[1] === 'minutes' || parts[1] === 'minute,' || parts[1] === 'minutes,') {
    minutes = parts[0];
    parts.splice(0,2);
  } 

  const ostring = minutes +':'+seconds +'; '+ parts.join(' ');
  return ostring;
}

async function scrollUntilElement(driver, xpath) {
  // Scroll to the top of the page first.
  await driver.executeScript('window.scrollTo(0, 0);');
  await new Promise(resolve => setTimeout(resolve, 1000)); // Short pause after scrolling to top

  let element = null;
  for (let i = 0; i < 50; i++) {
    try {
      element = await driver.findElement(By.xpath(xpath));
      if (element) {
        let isDisplayed = await element.isDisplayed();
        if (isDisplayed) {
          break; // If the element is displayed, we can break out of the loop
        }
      }
    } catch (error) {
      await driver.executeScript('window.scrollBy(0, 500);'); 
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for dynamic content to load
    }
  }

  if (!element) {
    throw new Error(`Element with xpath ${xpath} not found after scrolling`);
  }

  return element;
}


async function getTranscript(link) {
    // Set up Chrome in headless mode
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

    let transcript = [];

    await driver.get(link);

    try {
      
      // CLICK THE EXPAND BUTTON
      let expandButton = await scrollUntilElement(driver, '//*[@id="expand"]');
      await expandButton.click();

      await new Promise(resolve => setTimeout(resolve, 2000)); // Short pause after clicking expand

      // CLICK THE SHOW TRANSCRIPT BUTTON
      let showTranscriptButton = await scrollUntilElement(driver, '//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button');
      await showTranscriptButton.click();

      // SCRAPE THE TRANSCRIPT
      let transcriptElements = await driver.findElements(By.className('segment style-scope ytd-transcript-segment-renderer'));

      // Get the text of each element
      for (let i = 0; i < transcriptElements.length; i++) {
          let line = formatTranscript(await transcriptElements[i].getAttribute('aria-label'));
          transcript.push(line);
      }
    } catch (error) {
        console.error('Error occurred while fetching the transcript:', error);
    } finally {
        // Close the browser
        await driver.quit();
    }

  return transcript;
};

module.exports = getTranscript;
