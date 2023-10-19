const {Builder, Browser, By} = require('selenium-webdriver');

async function getTranscript(link) {

    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    //const link = 'https://www.youtube.com/watch?v=JOiGEI9pQBs';  // some video
      
    await driver.get(link); 

    //delay was needed to get the webpage to load completely
    //edit to maybe detect when the webpage loads?
    await new Promise(resolve => setTimeout(resolve, 4000));

    //xpath click on 3 dots
    await driver.findElement(By.xpath('//*[@id="button-shape"]/button')).click();
    await new Promise(resolve => setTimeout(resolve, 100)); 


    //click on "show transcript"
    await driver.findElement(By.xpath('//*[@id="items"]/ytd-menu-service-item-renderer[2]')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    //click "show transcipt" to load the actual transcript
    driver.executeScript('window.scrollBy(0, 200);'); // sometext bubble blocks element
    await driver.findElement(By.xpath('//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button')).click();
    await new Promise(resolve => setTimeout(resolve, 500));

    //get all elements with transcript text
    let transcriptElements = await driver.findElements(By.className('segment style-scope ytd-transcript-segment-renderer'));
    let transcript = []

    // get the text of each element
    for(let i = 0; i < transcriptElements.length; i++){
      transcript.push(await transcriptElements[i].getAttribute('aria-label'));
    }

    console.log(transcript);
  
  
    await driver.quit();
};


const link = 'https://www.youtube.com/watch?v=JOiGEI9pQBs';
getTranscript(link);

