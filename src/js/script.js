
//For using with endpoints later in the program
const CONFIG = {
    API_ENDPOINT: 'http://13.58.229.43:3000'
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

                    const details = {
                        title: snippet.title,
                        description: snippet.description,
                        likes: statistics.likeCount,
                        dislikes: -1,
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
                    
                    //Fetch dislikes
                    fetch(dislikeApiUrl,  {
                        method: 'GET',
                        headers: { apiheaders} })
                    .then(response => response.json())
                    .catch(error => console.log(error))
                    .then(data => {
                        details.dislikes = data.dislikes;
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
//Resets GPT comve
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
    
    if(data.comments && data.comments.length) {
        result += 'Comments:\n';
        for(let i = 0; i < data.comments.length; i++) {
            result += `${i + 1}. ${data.comments[i]}\n`;
        }
    }
    result += `Transcript: ${transcript}\n\n`;


    return result;
}

//======================================================================================================================================================

//Current driver function  for OpenAI API
function compute() {
    displayPopup();
    clearConversationHistory()
    const urlInput = document.getElementById('url');
    const url = urlInput.value;
    hardcodedTranscript = [
        '0:00; - All right, so today I got a hold of',
        '0:01; and got to poke around the new iPhone 15',
        '0:04; and the iPhone 15 Pros.',
        "0:05; I do remember flying here and I'm thinking",
        '0:07; what could Apple possibly do?',
        '0:09; Like what could they possibly\nintroduce with a new iPhone,',
        "0:11; the 23rd iPhone that's\nactually interesting?",
        '0:14; Now, there is more stuff',
        '0:15; than just the iPhone that was mentioned',
        '0:17; at this Wonderlust event that Apple hosted!',
        '0:19; including some stuff that straight up',
        "0:20; wasn't mentioned on stage at",
        '0:24; But this is just the new iPhone stuff.',
        '0:25; So stay tuned and get',
        '0:27; But let\'s just talk about',
        '0:30; So here\'s a lens to look',
        '0:32; Coming into this, basically',
        '0:35; to their newest flagship',
        '0:38; It\'s either something we\'ve already seen',
        '0:40; in some other phone for years,',
        '0:42; or it\'s some ecosystem feature',
        '0:44; that only works with other iPhones,',
        '0:46; which is not necessarily a bad thing,',
        '0:47; but it\'s just a lens to',
        '0:50; just to keep an eye on it.',
        '0:51; So this is the iPhone 15.',
        '0:53; There\'s the same two sizes, again,',
        '0:54; iPhone 15 and iPhone 15 Plus.',
        '0:57; And yeah, you know there\'s',
        '1:00; like the slight soft corner',
        '1:04; and the one piece glass back',
        '1:06; fading between a lighter',
        '1:08; and darker version',
        '1:10; of the same color, like this new pink one.',
        '1:12; It\'s pretty seamless.',
        '1:13; Also, satin soft touch backs',
        '1:15; across the whole lineup instead of glossy.',
        '1:17; I definitely like that.',
        '1:21; Lightning is officially dead.',
        '1:23; These new iPhones are all',
        '1:26; Now on one hand, this is a huge deal,',
        '1:28; like there\'s only ever',
        '1:30; in the iPhone ever.',
        '1:31; Back in 2012, it went from',
        '1:35; to this new lightning thing,',
        '1:38; And now the second one ever is USB type C.',
        '1:41; But on the other hand it\'s, I don\'t know, it\'s just USB.',
        '1:43; Like it\'s the same port',
        '1:44; all these other laptops',
        '1:46; and tablets all over the planet have had',
        '1:48; for the past couple years.',
        '1:49; I imagine that might',
        '1:51; before the whole lineup,',
        '1:54; and everything else gets USB-C.',
        '1:57; But yeah, I don\'t know.',
        '1:58; We knew it was coming, but',
        '2:00; to look at an iPhone and',
        '2:04; So what does this enable',
        '2:06; First of all, it\'s the one',
        '2:09; to charge all your stuff,',
        '2:13; your iPhone, your friend\'s Android phone,',
        '2:16; the new AirPods which',
        '2:19; All that stuff, one cable.',
        '2:21; Oh, and now you can charge accessories',
        '2:23; like the new AirPods with the wire.',
        '2:25; So there\'s no wireless',
        '2:27; but that C to C cable',
        '2:30; to the AirPods',
        '2:31; from the iPhone battery.',
        '2:35; So that\'s pretty cool.',
        '2:36; But they did hold back',
        '2:39; and they saved it for the iPhone 15 Pro.',
        '2:42; So I\'ll get to that in a',
        '2:45; Aside from that, really it\'s',
        '2:48; It\'s a little bit of a new display.',
        '2:49; You know, you get the Dynamic',
        '2:51; and there\'s also now a',
        '2:54; 2,000 nits now',
        '2:55; which is twice as bright',
        '2:58; And there\'s a new camera.',
        '2:59; The primary camera is',
        '3:02; presumably the same one',
        '3:03; that was in the iPhone 14 Pro last year',
        '3:06; and all the benefits that come with that.',
        '3:07; And then the rest of the phone',
        '3:08; really follows that same formula.',
        '3:10; They do this thing where',
        '3:12; is basically last year\'s',
        '3:15; so it inherits the same A16 Bionic chip',
        '3:18; from last year\'s Pro phone.',
        '3:20; The coolest feature of this phone though,',
        '3:22; and you know, it\'s also on the Pro phone',
        '3:23; but I still think it\'s pretty solid,',
        '3:25; is the camera has this new',
        '3:29; but basically it automatically detects',
        '3:31; when there\'s a subject in a photo',
        '3:32; and captures all of the',
        '3:35; to be able to turn it into',
        '3:39; So you don\'t have to remember',
        '3:40; to switch it to portrait',
        '3:43; you can do it with high quality results.',
        '3:48; So that\'s cool.',
        '3:49; Aside from that, the rest of the phone,',
        '3:50; I mean it\'s the same thing, right?',
        '3:52; Same sizes, guys, same ceramic shield,',
        '3:54; same dust and water resistance',
        '3:57; and same starting prices, 799 for the 15',
        '4:00; You know, honestly that\'s kind of the',
        '4:02; of the non Pro iPhone.',
        '4:05; This year especially, this',
        '4:08; that are basically equivalent.',
        '4:10; And the only difference is',
        '4:11; one is slightly better',
        '4:14; And then there\'s the Pro phones, right?',
        '4:17; There\'s the iPhone 15 Pro and',
        '4:18; and then the big boy, the',
        '4:21; It\'s not called a Max this year,',
        '4:23; it\'s just the 15 Pro Plus,',
        '4:24; and those are still 6.1',
        '4:27; But anyway, like I said',
        '4:29; these things are sort of the',
        '4:30; I mean obviously more expensive,',
        '4:32; but you know, they\'re kind of the',
        '4:34; The Pro phone has all the good stuff,',
        '4:36; right?',
        '4:37; And then the regular phone is just, you know,',
        '4:39; the same thing from last year with a few',
        '4:42; So again, everything on the',
        '4:44; is the same, okay?',
        '4:45; And the only difference',
        '4:47; is the ProMotion display.',
        '4:49; It\'s a new OLED panel',
        '4:51; so it goes from 10 to 120 Hertz',
        '4:53; which is nice and snappy,',
        '4:55; and then the touch response',
        '4:56; goes from 60 to 240 Hertz,',
        '5:00; The panel also gets brighter, 800 nits',
        '5:02; and 1,200 nits for HDR,',
        '5:04; and it has the same ProMotion adaptive refresh rate',
        '5:07; that can go down to 10 Hertz',
        '5:10; So just the overall smoothness,',
        '5:12; and I\'ve been using the',
        '5:14; with 120 Hertz and it\'s just',
        '5:16; It\'s one of those things that,',
        '5:18; you know, you might not really notice,',
        '5:19; but it\'s nice to have.',
        '5:21; And for the first time ever,',
        '5:23; this phone gets the same',
        '5:25; and same sensors as the Pro phone',
        '5:28; so that\'s super cool.',
        '5:29; And oh, there\'s also more cameras,',
        '5:31; and more lenses to look at.',
        '5:33; There\'s now a new ultrawide camera,',
        '5:35; an upgrade from the previous one',
        '5:36; and the 12 megapixel',
        '5:37; so it\'s got a much larger sensor,',
        '5:40; I think like 70% larger sensor',
        '5:41; and bigger pixels for more light',
        '5:43; And then there\'s a new',
        '5:46; It\'s the first periscope zoom',
        '5:48; It\'s 10x optical zoom',
        '5:50; with optical image stabilization.',
        '5:52; It\'s pretty cool',
        '5:53; and it does things like this,',
        '5:54; And I believe it also does this.',
        '5:56; Yeah, it also does that.',
        '5:58; So all that stuff is on both Pro models',
        '6:00; and honestly I kind of like',
        '6:01; But then the 15 Pro Plus,',
        '6:03; the big boy, gets an extra',
        '6:05; It gets the macro lens back',
        '6:07; and the regular wide camera.',
        '6:09; The regular wide camera now has',
        '6:12; so that\'s pretty nice',
        '6:13; and the macro lens is 2 megapixels',
        '6:15; but it is a 1:1',
        '6:17; So yeah, you can get',
        '6:19; It\'s still using a 12 megapixel sensor,',
        '6:21; but it does 8k now.',
        '6:24; And this is where I',
        '6:26; so that all these new',
        '6:28; It\'s this new cinematic mode',
        '6:30; and it shoots Dolby Vision HDR',
        '6:33; at 60 frames a second',
        '6:35; and you can do it',
        '6:36; So I\'ve been using it a',
        '6:39; So far it seems like it\'s',
        '6:41; But it does what it\'s supposed to do,',
        '6:43; and that\'s the most important part',
        '6:44; but anyway, the quality, I don\'t know.',
        '6:46; I mean you guys can be the judge of',
        '6:48; but I mean, it looks decent to me',
        '6:51; and I think the depth of field,',
        '6:53; It\'s better than',
        '6:54; and it does this better',
        '6:56; and it can automatically',
        '6:58; or you can manually do it',
        '7:01; It\'s got this cool little',
        '7:03; It follows the subject really well,',
        '7:06; and it even works',
        '7:07; So that\'s pretty cool',
        '7:09; and honestly, like that\'s',
        '7:10; And that cinematic mode stuff,',
        '7:12; it\'s on all four of the rear cameras,',
        '7:14; the regular wide one, the',
        '7:15; and the selfie camera.',
        '7:16; And you can adjust all this stuff after',
        '7:18; after the video is shot.',
        '7:21; And I think the coolest part',
        '7:23; is that it also works in 8k',
        '7:25; so it\'s like',
        '7:26; and like I said earlier,',
        '7:28; and this phone can shoot',
        '7:30; And so far, like that stuff seems',
        '7:33; I think it\'s pretty sweet,',
        '7:35; So far, like that stuff seems',
        '7:37; I think it\'s pretty sweet,',
        '7:39; and I think you\'re going to like it.',
        '7:41; Another cool thing that this phone has',
        '7:43; is this new all glass design.',
        '7:45; It\'s using the same',
        '7:47; that you\'ve probably seen before',
        '7:49; where the camera bump,',
        '7:51; it blends into the frame',
        '7:52; of the phone now.',
        '7:54; So it\'s a pretty seamless transition',
        '7:56; from the glass back to the',
        '7:58; and it\'s actually kind of nice',
        '8:00; like the old one',
        '8:01; and then the glass camera bump',
        '8:03; it was kind of like, you know,',
        '8:05; So I definitely like this look more.',
        '8:08; It\'s also got this new',
        '8:10; it comes in this pink color,',
        '8:13; a new darker version of blue,',
        '8:16; and a green color as well.',
        '8:19; And the darker colors,',
        '8:20; they do look pretty sharp',
        '8:22; especially with that satin back',
        '8:24; with the glass to frame transition,',
        '8:26; it looks pretty cool.',
        '8:27; And it still comes in 128GB,',
        '8:30; The charging stuff is really cool.',
        '8:33; So the iPhone 15 Pro Plus',
        '8:34; now supports this new MagSafe Duo,',
        '8:37; which is the smaller MagSafe puck',
        '8:39; that also charges an Apple watch',
        '8:41; or any other device that',
        '8:42; but now it also works',
        '8:44; and you can charge it',
        '8:45; like the AirPods Pro.',
        '8:47; And then also, the iPhone 15',
        '8:49; has this new thing called',
        '8:51; So it\'s this magnetic battery pack',
        '8:54; and it charges on the back',
        '8:56; and you know, it\'s a battery pack.',
        '8:57; And then when it\'s attached to',
        '9:00; and you need some extra juice,',
        '9:01; you can pop it on the back',
        '9:03; and it\'ll start charging your phone.',
        '9:04; So that\'s pretty cool.',
        '9:06; It\'s not the first time',
        '9:07; you know, we\'ve seen stuff like this before,',
        '9:10; but it\'s nice to have.',
        '9:11; And then there\'s this new thing',
        '9:13; called \"Rainbow Panning\"',
        '9:14; which is essentially a way',
        '9:16; to take panorama photos',
        '9:17; but it captures the entire',
        '9:19; so that\'s a new thing',
        '9:21; and then I think you\'re going to like it.',
        '9:23; And then the video quality,',
        '9:25; I think it\'s pretty great.',
        '9:26; It\'s like probably the best',
        '9:28; that you can get right now,',
        '9:29; and I think you\'re going to love it.',
        '9:31; You know, I think for a lot',
        '9:32; this is probably going to be',
        '9:34; and it\'s definitely the best one',
        '9:35; that you can get on an iPhone.',
        '9:37; So yeah, that\'s really all',
        '9:39; I can say about the iPhone 15.',
        '9:41; It\'s got a few new',
        '9:43; camera features, the new charging stuff,',
        '9:45; the same performance,',
        '9:46; the same sizes, the same display.',
        '9:48; So you know, if you have',
        '9:50; And if you don\'t, well',
        '9:52; it\'s pretty much the same as last year',
        '9:53; with a few new things here and there.',
        '9:55; But anyway, that\'s it',
        '9:57; and I hope you guys enjoyed',
        '9:59; I\'ll have some more videos',
        '10:00; Thanks for watching, guys,',
        "10:02; and I\'ll see you in the next one."
    ]
        
    //for testing purposes
    if (url === "test") {
        fetch(`${CONFIG.API_ENDPOINT}/askGPT`, {
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

                const prompt = constructPrompt(details, hardcodedTranscript);
                fetchGPT(prompt);
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }
    
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
    .then(data => {
        console.log('GPT Response:', data.answer);
    })
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
