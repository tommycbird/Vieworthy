
const express = require('express');
const { Builder, By, Key, until } = require('selenium-webdriver');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAIApi = require('openai');
const app = express();
const port = 3000;
const path = require('path');

// Configuration
const CONFIG = {
    API_ENDPOINT: 'http://13.58.229.43:3000'
};

// Middleware variables
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'Vieworthy' directory
app.use(express.static(path.join(__dirname, '../../')));

//API Key for OpenAI
process.env.OPENAI_API_KEY = 'aaaaa';
const openai = new OpenAIApi({ key: process.env.OPENAI_API_KEY });


//List to save the conversation history into
let conversationHistory = [];

//======================================================================================================================================================

//Method to query the openAI API
app.post('/askGPT', async (req, res) => {
    try {
        console.log("Received request for /askGPT:", req.body);
        const userMessage = req.body.prompt;
        
        const queryMessage = { "role": "user", "content": userMessage };
        conversationHistory.push(queryMessage);

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-16k",
            messages: conversationHistory,
        });

        console.log("OpenAI API Response:", response); 
        const answer = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content;
        if (answer) {
            // response from GPT is added to the history of the convo
            conversationHistory.push({ "role": "assistant", "content": answer });
            
            // Check for token limit and manage the conversationHistory if needed
            if (response.usage && response.usage.total_tokens > 20000) {
                // If the total tokens exceed a threshold pop old messages
                conversationHistory.shift();
                console.warn("Token usage exceeded threshold. Removing oldest message.");
            }
            res.json({ answer: answer });
        } else {
            res.json({ error: "Failed to get an answer from GPT." });
        }
    } catch (error) {
        console.error("Error while processing /askGPT:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//======================================================================================================================================================

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

app.post('/clearConversationHistory', (req, res) => {
    conversationHistory = [];  
    res.status(200).send({message: "Conversation history cleared"});
});

