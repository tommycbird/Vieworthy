

//CODE TO FETCH VIDEO DATA FROM YOUTUBE API
function fetchVideoData(url) {
    // Extract the video ID from the URL
    const videoID = extractVideoID(url);

    if (!videoID) {
        console.error("Invalid YouTube URL");
        return;
    }
    const API_KEY = "AIzaSyCe3jBxqhacGmezpofd5olN3Cv5Qmjy_mE";
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${API_KEY}&part=snippet,statistics`;
    return new Promise((resolve, reject) => {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    const snippet = data.items[0].snippet;
                    const statistics = data.items[0].statistics;
                    
                    // Access various data points
                    const details = {
                        title: snippet.title,
                        description: snippet.description,
                        likes: statistics.likeCount,
                    };
                    // Update the UI elements individually
                    document.getElementById('title').innerText = details.title;
                    document.getElementById('description').innerText = details.description;
                    document.getElementById('likes').innerText = 'Likes: ' + details.likes;

                    // Display the popup once the data is fetched
                    displayPopup();

                    resolve(details);
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

            // // Fetch the additional data using Selenium after fetching the video data
            // getTranscription(url).then(transcription => {
            //     console.log("HERE IS THE TRANSCRIPTION", transcription);
            //     details.transcription = transcription; // add transcription to details object
                
            //     getDislikes(url).then(dislikes => {
            //         console.log("HERE ARE THE DISLIKES", dislikes);
            //         details.dislikes = dislikes; // add dislikes to details object

            //         console.log("HERE ARE THE FINAL DETAILS", details);
            //         // Here, you have a details object containing all the data you fetched
            //     });
            // });
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