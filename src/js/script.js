
//For using with endpoints later in the program
const API_BASE_URL = 'http://13.58.229.43:3000';

// Fetches title, description, likes and comments using YouTube API
function fetchVideoData(url) {
    const videoID = extractVideoID(url);
    if (!videoID) {
        console.error("Invalid YouTube URL");
        return;
    }

    const API_KEY = "AIzaSyCe3jBxqhacGmezpofd5olN3Cv5Qmjy_mE";
    const videoApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${API_KEY}&part=snippet,statistics`;

    // Constructing the API URL for fetching comments
    const commentApiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoID}&key=${API_KEY}&maxResults=100`;

    return new Promise((resolve, reject) => {
        fetch(videoApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const snippet = data.items[0].snippet;
                    const statistics = data.items[0].statistics;

                    const details = {
                        title: snippet.title,
                        description: snippet.description,
                        likes: statistics.likeCount,
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

                            resolve(details);
                        })
                        .catch(commentError => {
                            console.error("Failed to fetch comments:", commentError);
                            resolve(details);  
                        });
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

//Shows the popup
function displayPopup() {
    const popupElement = document.querySelector('.popup');
    if (popupElement) {
        popupElement.style.display = 'block'; 
    }
}

//======================================================================================================================================================

//Closes the popup
function closePopup() {
    document.querySelector('.popup').style.display = 'none';
    clearChatHistory();
}

//======================================================================================================================================================

function clearChatHistory() {
    const chatContainer = document.querySelector('.chat-container');
    while (chatContainer.firstChild) {
        chatContainer.removeChild(chatContainer.firstChild);
    }
}

//======================================================================================================================================================

//Current driver function  for OpenAI API
function compute() {
    displayPopup();
    const urlInput = document.getElementById('url');
    const url = urlInput.value;

    
    //for testing purposes
    if (url === "test") {
        fetch(`${API_BASE_URL}/askGPT`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: "I am going to pass in text data about a given youtube video and I will ask you questions from the data" }) 
        })
        .then(response => response.json())
        .then(data => {
            console.log('GPT Response:', data.answer);  
        })
        .catch(error => {
            console.error('Error getting response from GPT:', error);
        });
        //reset the input field
        urlInput.value = '';
        return; 
    }
    
    //Actual method when we are ready to use the API with real URL's
    else{
        const videoID = extractVideoID(url);
        if (!videoID) {
            console.log("Invalid URL input");
            return;
        }
        fetchVideoData(url)
            .then(details => {
                console.log("HERE ARE THE DETAILS", details);
                document.querySelector(".loading-status p").innerText = "Response Grabbed Successfully";
                document.querySelector(".loader").style.display = "none";
                document.getElementById('description').innerText = details.description;
                document.getElementById('likes').innerText = details.likes;
                
                let commentsDiv = document.getElementById('comments');
                if (details.comments && details.comments.length > 0) {
                    let commentList = '<ul style="max-height:200px; overflow-y:scroll;">';
                    details.comments.forEach(comment => {
                        commentList += '<li>' + comment + '</li>';
                    });
                    commentList += '</ul>';
                    commentsDiv.innerHTML = commentList;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }
    
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
    fetch(`${API_BASE_URL}/askGPT`, {
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
        
        console.log('GPT CHAT Response:', data.answer);
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
        logo.src = "/src/img/Logo.png";
        logo.className = "message-logo";
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
