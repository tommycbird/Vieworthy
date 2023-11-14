
//For using with endpoints later in the program
const CONFIG = {
    API_ENDPOINT: 'http://3.23.48.138:3000'
};
// Fetches title, description, likes and comments using YouTube API
function fetchVideoData(url) {
    const videoID = extractVideoID(url);
    if (!videoID) {
        console.error("Invalid YouTube URL");
        return;
    }

    const API_KEY = "AIzaSyCe3jBxqhacGmezpofd5olN3Cv5Qmjy_mE";
    const videoApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${API_KEY}&part=snippet,statistics`;

    //https://www.youtube.com/watch?v=t4ejFV6n4b8
    // Constructing the API URL for fetching comments
    const commentApiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoID}&key=${API_KEY}&maxResults=100`;


    //Data for Dislike API
    const dislikeApiUrl = `https://returnyoutubedislikeapi.com/votes?videoId=${videoID}`;
    const dislikeheaders = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
    };

    return new Promise((resolve, reject) => {
        fetch(videoApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const snippet = data.items[0].snippet;
                    const statistics = data.items[0].statistics;

                    var details = {
                        title: snippet.title,
                        description: snippet.description,
                        likes: statistics.likeCount,
                        dislikes: 0,
                        comments: []
                    };

                    // Fetch comments
                    fetch(commentApiUrl)
                        .then(commentResponse => commentResponse.json())
                        .then(commentData => {
                            if (commentData.items) {
                                commentData.items.forEach(item => {
                                    const comment = item.snippet.topLevelComment.snippet.textDisplay;
                                    details.comments.push(comment);
                                });
                            }

                        })
                        .catch(commentError => {
                            console.error("Failed to fetch comments:", commentError);
                            resolve(details);  
                    });
                    
                    //Fetch dislikes
                    fetch(dislikeApiUrl,  {
                        method: 'GET',
                        headers: dislikeheaders})
                    .then(response => response.json())
                    .catch(error => console.log(error))
                    .then(data => {
                        const dislikes = data.dislikes;
                        details.dislikes = dislikes
                        resolve(details);
                    })

                } else {
                    reject("Failed to fetch video details");
                }
            })
            .catch(error => {
                console.error("Failed to fetch video details:", error);
                reject(error);
            });
    });
}

//======================================================================================================================================================

function extractVideoID(url) {
    const videoIDRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(videoIDRegex);
    if (match && match[7].length === 11) {
        return match[7];
    }
    return null;
}

//======================================================================================================================================================

//Switches between form and popup
function toggleDisplay(elemID) {
    // To switch tabs
    var elems = document.getElementsByClassName('active-element');
    for (var i = 0; i < elems.length; i++) {
        elems[i].style.display = 'none';
    }
    document.getElementById(elemID).style.display = 'block';
}


//======================================================================================================================================================
//Resets GPT convo
function clearConversationHistory() {
    // Make an HTTP request to clear the conversation history on the server.
    fetch(`${CONFIG.API_ENDPOINT}/clearConversationHistory`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error clearing conversation history on the server:', error);
    });
}

//======================================================================================================================================================
//Clears the UI
function clearChatHistory() {
    const chatContainer = document.querySelector('.chat-container');
    while (chatContainer.firstChild) {
        chatContainer.removeChild(chatContainer.firstChild);
    }
}

//======================================================================================================================================================

function constructPrompt(data, transcript) {
    let result = '';

    result += `Title: ${data.title}\n`;
    result += `Description: ${data.description}\n`;
    result += `Likes: ${data.likes}\n`;
    result += `Dislikes: ${data.dislikes}\n`
    
    if(data.comments && data.comments.length) {
        result += 'Comments:\n';
        for(let i = 0; i < data.comments.length; i++) {
            result += `${i + 1}. ${data.comments[i]}\n`;
        }
    }
    result += `Transcript: ${transcript}\n\n`;

    // Fill in the score roudned to 1 decimal place
    const score = ((+data.likes) / ((+data.likes) + (+data.dislikes)) * 10.0);
    updateVideoScoreColor();
    // Change text element of score circle
    const scoreElement = document.querySelector('.video-score');
    scoreElement.textContent = score.toFixed(1);

    return result;
}

//======================================================================================================================================================

//Current driver function  for OpenAI API
function compute() {
    toggleDisplay('chatbox');
    clearConversationHistory();
    const urlInput = document.getElementById('url');
    const url = urlInput.value;
    
    console.log("URL:", url);
    console.log("Extracting data from URL");
    const videoID = extractVideoID(url);
    if (!videoID) {
        console.log("Invalid URL input");
        return;
    }

    let prompt = "I am going to pass in text data about a given YouTube video and I will ask you questions from the data";

    // Use the getSeleniumInfo function to fetch the transcript
    getSeleniumInfo(url)
        .then(transcript => {
            if (transcript) {
                fetchVideoData(url)
                    .then(details => {
                        prompt += constructPrompt(details, transcript);
                        fetchGPT(prompt);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            } else {
                console.error("Failed to retrieve transcript from server.");
            }
        })
        .catch(error => {
            console.error("Error fetching transcript:", error);
        });
}


//======================================================================================================================================================


async function getSeleniumInfo(url) {
    return fetch(`${CONFIG.API_ENDPOINT}/getTranscript`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url }) 
    })
    .then(response => response.json())
    .then(data => {
        return data.transcript;
    });
}

//======================================================================================================================================================

function fetchGPT(prompt) {
    fetch(`${CONFIG.API_ENDPOINT}/askGPT`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: "I am now going to pass in metadata associated with a youtube video. I do not need any information back on this please respond 'ok got it' to this query" + prompt })
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error getting response from GPT:', error);
    });
}

//======================================================================================================================================================

//This function handles the "chat" with the GPT API
function handleChatSubmit() {
    const chatInput = document.querySelector(".input-container textarea");
    const userInput = chatInput.value;

    const title = document.querySelector('.chat-title');
    const promptContainer = document.querySelector('.prompt-container');

    if (title) title.style.display = 'none';
    if (promptContainer) promptContainer.style.display = 'none';

    if (userInput.trim() === "") return;  

    // Clear text input as soon as the submit button is clicked
    chatInput.value = ''; 
    console.log("Chat input cleared.");

    // Add user input to "chat" window
    addMessageToChat('user', userInput);

    // Add a placeholder message for GPT's response with typing dots
    addMessageToChat('gpt', '', true);

    // Send the userInput to server for processing by GPT
    fetch(`${CONFIG.API_ENDPOINT}/askGPT`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userInput }) 
    })
    .then(response => response.json())
    .then(data => {
        const gptMessageContainer = document.querySelector('.gpt-message-container:last-child');
        if (gptMessageContainer) {
            gptMessageContainer.remove();
        }
    
        const updatedTypingIndicator = document.querySelector('.typing-indicator');
        const updatedGptMessage = document.querySelector('.gpt-message:not(.typing-indicator)');
        updatedTypingIndicator.style.display = 'none';
        updatedGptMessage.style.display = 'block';
        
        addMessageToChat('gpt', data.answer);
        
        // Hide the typing indicator
        const currentTypingIndicator = document.querySelector('.typing-indicator');
        if (currentTypingIndicator) {
            currentTypingIndicator.style.display = 'none';
        }
    })
    
    
    .catch(error => {
        console.error('Error getting response from GPT:', error);
    });
}

//======================================================================================================================================================

//Shows the specified message "chat" on the correct side w/ correct color
function addMessageToChat(role, content, isPlaceholder = false) {
    const chatContainer = document.querySelector('.chat-container');
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-container ${role}-message-container`;
    
    if (role === 'gpt') {
        const logo = document.createElement('img');
        logo.src = "/src/img/logo_light.png";
        logo.className = "message-logo";
        logo.style.width = '30px';
        logo.style.height = '24px';
        messageContainer.appendChild(logo);
    
        if (isPlaceholder) {
            const typingDots = document.createElement('div');
            typingDots.className = 'typing-indicator'; 
            
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('span');
                typingDots.appendChild(dot);
            }
        
            messageContainer.appendChild(typingDots);
            chatContainer.appendChild(messageContainer);
        
            // Display the typing indicator now
            typingDots.style.display = 'block';
        
            // Ensure the chat scrolls to the bottom when a new message is added
            chatContainer.scrollTop = chatContainer.scrollHeight;
            return; 
        } 
    }

    const message = document.createElement('div');
    message.className = `message ${role}-message`;
    message.innerText = content;
    messageContainer.appendChild(message);
    chatContainer.appendChild(messageContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight; 
}
document.querySelector('.input-container button').addEventListener('click', handleChatSubmit);

//======================================================================================================================================================


// EVENT LISTENERS ======================================================================================================================================
// Enter button pressed
const textarea = document.querySelector('.form');
textarea.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();  
        compute();
    }
});

//Change score circle color
function updateVideoScoreColor() {
    const scoreElement = document.querySelector('.video-score');
    const score = parseFloat(scoreElement.textContent);
    let color = 'lightgrey'; // Fallback color

    if (score <= 10.0 && score >= 0.0) {
        // Calculate the color based on the score: 0.0 = red, 10.0 = green
        const greenValue = Math.round((score / 10) * 255);
        const redValue = 255 - greenValue;
        color = `rgb(${redValue}, ${greenValue}, 0)`;
    }

    scoreElement.style.backgroundColor = color;
}

