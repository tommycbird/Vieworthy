

//CODE TO FETCH VIDEO DATA FROM YOUTUBE API
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
                        comments: [] // initializing comments as an empty array
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
                            resolve(details); // Resolve the promise even if fetching comments fails
                        });
                } else {
                    console.log('Video not found.');
                    reject('Video not found.');
                }
            })
            .catch(error => {
                console.error("Failed to fetch video data:", error);
                reject(error);
            });
    });
}




// SUPPLEMENTAL FUNCTIONS EXECUTED BY DRIVER() ========================================

//function also check
function extractVideoID(url) {
    // Regular expression to extract video ID from a YouTube URL
    const regex = /(?:v=)([a-zA-Z0-9_-]{11})/;
    const result = url.match(regex);
    return result ? result[1] : null;
}

// //function to get transcription using selenium
// function getTranscription(url) {
//     fetch('http://localhost:3000/getTranscription', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ url })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Transcription:', data.transcription);
//         // Update the UI with the transcription
//     })
//     .catch(error => {
//         console.error('Error getting transcription:', error);
//     });
// }
// //function to get dislikes using selenium
// function getDislikes(url) {
//     fetch('http://localhost:3000/getDislikes', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ url })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Dislikes:', data.dislikes);
//         // Update the UI with the dislikes
//     })
//     .catch(error => {
//         console.error('Error getting dislikes:', error);
//     });
// }


//function to display popup and video metadata (FOR TESTING PURPOSES))
function displayPopup() {
    var popup = document.getElementsByClassName("popup")[0];
    var span = document.getElementsByClassName("close")[0];
    popup.style.display = "block";
    span.onclick = function() {
        popup.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }
}

// DRIVER FUNCTION ========================================
function compute() {
    var url = document.querySelector(".form").value.trim().toLowerCase();

    if(url === "test") {
        url = "https://www.youtube.com/watch?v=enR58PYHaWw"; 
    }
    
    const videoID = extractVideoID(url);
    if (!videoID) {
        console.log("Invalid URL input");
        return;
    }
    
    fetchVideoData(url)
        .then(details => {
            console.log("HERE ARE THE DETAILS", details);

            document.getElementById('title').innerText = details.title;
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

            // Display the popup
            displayPopup();
        })
        .catch(error => {
            console.error('Error fetching video data:', error);
        });
}




// EVENT LISTENERS ========================================

// Enter pressed
const textarea = document.querySelector('.form');
textarea.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();  
    compute();
  }
});