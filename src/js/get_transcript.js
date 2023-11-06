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
  for (let i = 0; i < 50; i++) {
    try {
      driver.findElement(By.xpath(xpath));
      break;
    }
    catch (error) {
      driver.executeScript('window.scrollBy(0, 500);');
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

}

async function getTranscript(link) {
    // Set up Chrome in headless mode
    let options = new chrome.Options();
    options.addArguments('--headless');
    options.addArguments('--no-sandbox'); // NOTE: Use this flag if you understand the security implications.
    options.addArguments('--disable-dev-shm-usage');

    let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

    let transcript = []; //storage for transcript

    try {
      await driver.get(link);

      // Wait for the description container to be clickable
      let expandButton = await driver.wait(until.elementLocated(By.xpath('//*[@id="expand"]')), 10000);
      await driver.wait(until.elementIsEnabled(expandButton), 10000); // Wait until the button is enabled

      // Click on the description container
      await expandButton.click();

      // Scroll until 'show transcript' is visible and clickable
      await scrollUntilElement(driver, '//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button');

      let showTranscriptButton = await driver.findElement(By.xpath('//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button'));
      await driver.wait(until.elementIsEnabled(showTranscriptButton), 10000); // Wait until the button is enabled

      // Click "show transcript" to load the actual transcript
      await showTranscriptButton.click();

      // Get all elements with transcript text
      let transcriptElements = await driver.findElements(By.className('segment style-scope ytd-transcript-segment-renderer'));

      // Get the text of each element
      for (let i = 0; i < transcriptElements.length; i++) {
          let line = formatTranscript(await transcriptElements[i].getAttribute('aria-label'));
          transcript.push(line);
      }
    } catch (error) {
        console.error('Error occurred while fetching the transcript:', error);
    } finally {
        // Quit the driver in the finally block to ensure it quits in both success and error cases
        await driver.quit();
    }

  return transcript;
};

module.exports = getTranscript;
