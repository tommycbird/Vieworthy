function getVideoTitle() {
    // Assuming your textarea has a class of "form"
    let videoURL = document.querySelector(".form").value;

    // If user input is "test", use the default link
    if (videoURL.trim().toLowerCase() === "test") {
        videoURL = "https://www.youtube.com/watch?v=enR58PYHaWw";
    }

    // Extract the video ID from the URL
    const videoID = extractVideoID(videoURL);

    if (!videoID) {
        console.error("Invalid YouTube URL");
        return;
    }

    const API_KEY = "AIzaSyCe3jBxqhacGmezpofd5olN3Cv5Qmjy_mE";
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoID}&key=${API_KEY}&part=snippet`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items.length > 0) {
                const videoTitle = data.items[0].snippet.title;
                document.getElementById('videoTitle').innerText = videoTitle; // Set the video title
                showpopup(); // Show the popup
            } else {
                console.log('Video not found.');
            }
        })
        .catch(error => {
            console.error("Failed to fetch video title:", error);
        });
}

function extractVideoID(url) {
    // Regular expression to extract video ID from a YouTube URL
    const regex = /(?:v=)([a-zA-Z0-9_-]{11})/;
    const result = url.match(regex);
    return result ? result[1] : null;
}



function showpopup() {
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

document.querySelector('.summarize-button').addEventListener('click', getVideoTitle);
