
//variables for Selenium
const express = require('express');
const { Builder, By, Key, until } = require('selenium-webdriver');

const app = express();
const port = 3000;

app.use(express.json());

//function to get transcription
app.get('/getTranscription/:videoId', async (req, res) => {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get(`https://www.youtube.com/watch?v=${req.params.videoId}`);
        
        //USE SELENIUM TO GET PROPER INFORMATION

        let transcription = await driver.findElement(By.id('transcription')).getText();
        res.send({ transcription });
    } finally {
        driver.quit();
    }
});

//function to get dislikes
app.get('/getDislikes/:videoId', async (req, res) => {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get(`https://www.youtube.com/watch?v=${req.params.videoId}`);
        
        //USE SELENIUM TO GET PROPER INFORMATION

        let dislikes = await driver.findElement(By.id('dislikes')).getText();
        res.send({ dislikes });
    } finally {
        driver.quit();
    }
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
