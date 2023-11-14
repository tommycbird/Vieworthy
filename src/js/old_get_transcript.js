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
  let transcript = []; //storage for transcript
  let chromeOptions = new chrome.Options();
  chromeOptions.addArguments('--headless=new');
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--disable-dev-shm-usage');

  let driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(chromeOptions)
    .build();
  
  try{
    await driver.get(link); 

    //wait for description container to load
    await driver.wait(until.elementLocated(By.xpath('//*[@id="expand"]')), 10000);
    await new Promise(resolve => setTimeout(resolve, 1000));

    //xpath click on description container
    await driver.findElement(By.xpath('//*[@id="expand"]')).click();

    // scroll till 'show transcript' visible
    await scrollUntilElement(driver, '//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button');
    console.log('scorlled to transcript');

    //click "show transcipt" to load the actual transcript
    await driver.findElement(By.xpath('//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button')).click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    //get all elements with transcript text
    let transcriptElements = await driver.findElements(By.className('segment style-scope ytd-transcript-segment-renderer'));

    // get the text of each element
    for(let i = 0; i < transcriptElements.length; i++){
      let line = formatTranscript(await transcriptElements[i].getAttribute('aria-label'));
      transcript.push(line);
    }
  } 
  catch (error) {
    //quit if error
    await driver.quit();
    console.error('error in fetching link', error.message);
  }
    
    await driver.quit();
    return transcript;
};

module.exports = getTranscript;
