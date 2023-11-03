const {Builder, Browser, By, chrome} = require('selenium-webdriver');

async function getTranscript(link) {
    let transcript = [];
    let chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless');
    chromeOptions.addArguments('--no-sandbox');

    let driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(chromeOptions)
        .build();

    try {
        await driver.get(link);

        // Use a dynamic wait to ensure the page is loaded
        await driver.wait(() => driver.executeScript('return document.readyState').then(state => state === 'complete'));

        // xpath click on 3 dots
        await driver.findElement(By.xpath('//*[@id="button-shape"]/button')).click();
        await driver.sleep(100);

        // click on "show transcript"
        await driver.findElement(By.xpath('//*[@id="items"]/ytd-menu-service-item-renderer[2]')).click();
        await driver.sleep(500);

        // click "show transcipt" to load the actual transcript
        driver.executeScript('window.scrollBy(0, 200);');
        await driver.findElement(By.xpath('//*[@id="primary-button"]/ytd-button-renderer/yt-button-shape/button')).click();
        await driver.sleep(500);

        // get all elements with transcript text
        let transcriptElements = await driver.findElements(By.className('segment style-scope ytd-transcript-segment-renderer'));

        // get the text of each element
        for(let element of transcriptElements) {
            transcript.push(await element.getAttribute('aria-label'));
        }

    } catch (error) {
        console.error("Error occurred: ", error);
    } finally {
        await driver.quit();
    }
    
    await driver.quit();
    return transcript;
};

// Test the function (remove this part if you don't want to run the function immediately upon executing the script)
getTranscript('https://www.youtube.com/watch?v=JOiGEI9pQBs').then(console.log);
