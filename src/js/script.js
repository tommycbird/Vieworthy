
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
}

//======================================================================================================================================================

//Current driver function  for OpenAI API
function compute() {
    displayPopup();
    const urlInput = document.getElementById('url');
    const url = urlInput.value;
    
    //for testing purposes
    if (url === "test") {
        fetch('http://localhost:3000/askGPT', {
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
                console.error('Error fetching video data:', error);
            });
    }
    
}

//======================================================================================================================================================

//This function handles the "chat" with the GPT API
function handleChatSubmit() {
    const chatInput = document.querySelector(".input-container textarea");
    const userInput = chatInput.value;
    if (userInput.trim() === "") return;  

    // Clear text input as soon as the submit button is clicked
    chatInput.value = ''; 
    console.log("Chat input cleared.");

    // Add user input to "chat" window
    addMessageToChat('user', userInput);

    // Send the userInput to server for processing by GPT
    fetch('http://localhost:3000/askGPT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: userInput }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log('GPT CHAT Response:', data.answer);
        //add GPT response to "chat" window
        addMessageToChat('gpt', data.answer);
    })
    .catch(error => {
        console.error('Error getting response from GPT:', error);
    });
}

//======================================================================================================================================================

//Shows the specified message "chat" on the correct side w/ correct color
function addMessageToChat(role, content) {
    const chatContainer = document.querySelector('.chat-container');
    const message = document.createElement('div');
    message.className = `message ${role}-message`;
    message.innerText = content;
    chatContainer.appendChild(message);
    chatContainer.scrollTop = chatContainer.scrollHeight; 
}

document.querySelector('.input-container button').addEventListener('click', handleChatSubmit);

// EVENT LISTENERS ======================================================================================================================================
// Enter button pressed
const textarea = document.querySelector('.form');
textarea.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        e.preventDefault();  
        compute();
    }
});
