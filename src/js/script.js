
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
    const contentDetailsApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${API_KEY}&part=contentDetails`;
    const commentApiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoID}&key=${API_KEY}&maxResults=100`;

     //Data for Dislike API
     const dislikeApiUrl = `https://returnyoutubedislikeapi.com/votes?videoId=${videoID}`;
     const dislikeheaders = {
         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
             'Pragma': 'no-cache',
             'Cache-Control': 'no-cache',
             'Connection': 'keep-alive'
     };

    showSpinner("Loading Basic Video Data....")
    return new Promise((resolve, reject) => {
        fetch(videoApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    var details = {
                        title: data.items[0].snippet.title,
                        views: data.items[0].statistics.viewCount,
                        likes: data.items[0].statistics.likeCount,
                        dislikes: 0,
                        comments: []
                    };

                    // Fetch content details for duration
                    fetch(contentDetailsApiUrl)
                        .then(response => response.json())
                        .then(contentData => {
                            if (contentData.items && contentData.items.length > 0) {
                                details.duration = contentData.items[0].contentDetails.duration;
                                resolve(details);
                            } else {
                                reject("Failed to fetch content details");
                            }
                        })
                        .catch(error => {
                            console.error("Failed to fetch content details:", error);
                            reject(error);
                        });

                        updateStatus("Loading Comments....")
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
                    
                    updateStatus("Loading Dislikes....")
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
                    reject("Failed to fetch video data");
                }
            })
            .catch(error => {
                console.error("Failed to fetch video data:", error);
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
//Driver function for Vieworthy Website: Extracts url and calls main compute function
function computeWeb(){
    toggleDisplay('chatbox');
    clearChatHistory();
    clearConversationHistory();
    const urlInput = document.getElementById('url');
    const url = urlInput.value;
    document.getElementById('url').value = '';
    compute(url);
}

//======================================================================================================================================================

//Current driver function  for OpenAI API
function compute(url) {
    console.log("URL:", url);
    console.log("Extracting data from URL");
    const videoID = extractVideoID(url);
    if (!videoID) {
        console.log("Invalid URL input");
        return;
    }

    let prompt = "I am going to pass in text data about a given YouTube video and I will ask you questions from the data";

    // First, fetch the video data to check the duration
    fetchVideoData(url)
        .then(details => {
            // Check video duration
            if (isVideoTooLong(details.duration)) {
                console.log("Video is too long (over 15 minutes).");
                return; 
            }
            console.log("Video details", details);

            updateStatus("Fetching Transcript....")
            // If duration is okay, fetch the transcript
            getSeleniumInfo(url)
                .then(transcript => {
                    if (transcript) {
                        prompt += constructPrompt(details, transcript);
                        console.log("Prompt", prompt);
                        fetchGPT(prompt);
                    } else {
                        console.error("Failed to retrieve transcript from server.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching transcript:", error);
                });
        })
        .catch(error => {
            console.error('Error fetching video data:', error);
        });
}

//======================================================================================================================================================

function isVideoTooLong(duration) {
    // Convert ISO 8601 duration format (e.g., 'PT15M33S') to total minutes
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1]) ? parseInt(match[1].slice(0, -1)) : 0;
    const minutes = (match[2]) ? parseInt(match[2].slice(0, -1)) : 0;
    const seconds = (match[3]) ? parseInt(match[3].slice(0, -1)) : 0;

    const totalMinutes = hours * 60 + minutes + seconds / 60;
    return totalMinutes > 15;
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
        hideSpinner();
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
        if (updatedTypingIndicator) {
            updatedTypingIndicator.style.display = 'none';
        }
        if (updatedGptMessage){
        updatedGptMessage.style.display = 'block';
        }

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

document.querySelector('.input-container textarea').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        handleChatSubmit();
    }
});

function showSpinner(message) {
    document.getElementById('spinner-wrapper').style.display = 'flex';
    updateStatus(message);
}

function hideSpinner() {
    document.getElementById('spinner-wrapper').style.display = 'none';
}

function updateStatus(message) {
    document.getElementById('status-text').textContent = message;
}
// module.exports = { updateStatus };


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

