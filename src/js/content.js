var s = document.createElement("script");
s.src = chrome.runtime.getURL("src/js/script.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

function injectCSS() {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("src/css/extension.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

function killPopup() {
  console.log("Killing Popup...");
  var popup = document.getElementById("popup");
  // Check if the element actually exists
  if (popup != null) {
    popup.remove();
    console.log("Popup removed.");
  } else {
    // If the element is null, log an error message
    console.log("Error: Tried to remove a popup that does not exist.");
  }
}

function insertPopup(key, sentence, entryID) {
  console.log("Rendering Popup...");
  // Fetch the content of popup.html
  fetch(chrome.runtime.getURL("../popup.html"))
    .then((response) => response.text())
    .then((data) => {
      // Create a new div element
      const popup = document.createElement("div");
      //popup.className = 'popup-container';

      // Set the innerHTML of the div to the fetched data
      popup.innerHTML = data;

      // Append the popup to the body
      document.body.appendChild(popup);

      popup.id = "popup";

      // Make popup visible and on the forefront
      popup.style.zIndex = 2147483647;
      popup.style.width = "100vw";
      popup.style.height = "100vh";
      popup.style.position = "fixed"; // So that it stays in the viewport
      popup.style.backdropFilter = "blur(10px)";
      popup.style.display = "flex";
      popup.style.justifyContent = "center";
      popup.style.alignItems = "center";

      // Add event listeners to the close button and toggle button
      popup.querySelector(".close-button").addEventListener("click", killPopup);
    })
    .catch((error) => {
      // Handle any errors that occurred during fetch
      console.error("Error loading the popup:", error);
    });
}

function injectButton() {
  injectCSS();

  if (window.location.hostname === "www.youtube.com") {
    const timeElements = document.querySelectorAll(
      'span[id="text"].style-scope.ytd-thumbnail-overlay-time-status-renderer',
    );

    //console.log(`Found ${timeElements.length} time elements.`);

    timeElements.forEach((timeElement) => {
      let totalMinutes = 0;

      // Extract the video duration
      const timeParts = timeElement.textContent.trim().split(":").map(Number);

      if (timeParts.length === 2) {
        totalMinutes = timeParts[0] + timeParts[1] / 60;
      } else if (timeParts.length === 3) {
        totalMinutes = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
      }

          // If the video duration is less than 5 minutes, skip to the next iteration
          if (totalMinutes < 5 || totalMinutes > 30) return;

      //Move upwards to find the nearest parent with id="thumbnail" to get video link
      let thumbnail = timeElement.parentElement;
      while (thumbnail && thumbnail.id !== "thumbnail") {
        thumbnail = thumbnail.parentElement;
      }

      // Move upwards to find the nearest parent with id="content"
      let contentParent = timeElement.parentElement;
      while (contentParent && contentParent.id !== "content") {
        contentParent = contentParent.parentElement;
      }

      if (
        contentParent &&
        !contentParent.querySelector(":scope > .assess-button")
      ) {
        // Create the button
        const sumButton = document.createElement("button");
        sumButton.innerText = "Assess";
        sumButton.className = "assess-button";

        // Button event listener
        sumButton.addEventListener("click", function (event) {
          console.log("Summarize button clicked");
          // Call insertPopupContainer when the button is clicked
          insertPopup();
          compute(thumbnail.href);
        });

        // Create the logo element
        const img = document.createElement("img");
        img.src = chrome.runtime.getURL("src/img/favicon.png");
        img.width = 24;
        img.height = 24;
        img.style.marginRight = "10px";

        // Append the image to the button before the text
        sumButton.prepend(img);

        // Make meta relative
        if (getComputedStyle(contentParent).position === "static") {
          contentParent.style.position = "relative";
        }

        // Append the button to the content parent
        contentParent.appendChild(sumButton);
      }
    });
  }
}

// Run the function to inject the summarize button
injectButton();

// Since YouTube uses a lot of AJAX, run the function every time the DOM changes
const observer = new MutationObserver(injectButton);
observer.observe(document.body, { childList: true, subtree: true });
