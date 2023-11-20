const {Builder, Browser, By, until} = require('selenium-webdriver');
const chromeDriver = require('selenium-webdriver/chrome'); 

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
  await new Promise(resolve => setTimeout(resolve, 3000)); 

  let element = null;
  for (let i = 0; i < 50; i++) {
    try {
      element = await driver.findElement(By.xpath(xpath));
      if (element) {
        let isDisplayed = await element.isDisplayed();
        if (isDisplayed) {
          break; 
        }
      }
    } catch (error) {
      await driver.executeScript('window.scrollBy(0, 500);'); 
      await new Promise(resolve => setTimeout(resolve, 3000)); 
    }
  }

  if (!element) {
    throw new Error(`Element with xpath ${xpath} not found after scrolling`);
  }

  return element;
}


async function getTranscript(link) {
  let transcript = []; //storage for transcript
  let chromeOptions = new chromeDriver.Options();
  chromeOptions.addArguments('--headless=new');
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--disable-dev-shm-usage');

  let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(chromeOptions)
    .build();
  
  try{
    console.log('Starting getTranscript function');
    console.log('Navigating to link:', link);
    await driver.get(link);
    console.log('Page loaded');
    // updateStatus("Page Loaded");

    console.log('Waiting for description container...');
    await driver.wait(until.elementLocated(By.xpath('//*[@id="expand"]')), 30000);
    console.log('Description container loaded');

    // updateStatus("Navigating to Description....");
    console.log('Clicking on description container...');
    await driver.findElement(By.xpath('//*[@id="expand"]')).click();
    console.log('Clicked description container');


    console.log('Waiting after click...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // updateStatus("Scrolling to transcript...");
    await scrollUntilElement(driver, '//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button');
    console.log('Scrolled to transcript');

    console.log('Clicking "show transcript" button...');
    let button = await driver.findElement(By.xpath('//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button'));
    await driver.executeScript("arguments[0].click();", button);
    console.log('Clicked "show transcript" button');
    // updateStatus("Loading Transcript....");


    console.log('Waiting after click...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Fetching transcript lines...');
    // updateStatus("Reading in Transcript....");
    let transcriptElements = await driver.findElements(By.className('segment style-scope ytd-transcript-segment-renderer'));
    for(let i = 0; i < transcriptElements.length; i++){
      let line = formatTranscript(await transcriptElements[i].getAttribute('aria-label'));
      transcript.push(line);
    }
    console.log('Transcript lines fetched');
  } 
  catch (error) {
    console.error('Error occurred while fetching the transcript:', error);
  }
  finally {
    console.log('Quitting driver');
    await driver.quit();
  }
    
  return transcript;
}

module.exports = getTranscript;