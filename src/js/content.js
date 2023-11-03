function injectButton() {
  console.log("Checking for injection...");

  if (window.location.hostname === 'www.youtube.com') {
      const timeElements = document.querySelectorAll('span[id="text"].style-scope.ytd-thumbnail-overlay-time-status-renderer');

      console.log(`Found ${timeElements.length} time elements.`);

      timeElements.forEach(timeElement => {
          let totalMinutes = 0;

          // Extract the video duration
          const timeParts = timeElement.textContent.trim().split(':').map(Number);

          if (timeParts.length === 2) {
              totalMinutes = timeParts[0] + timeParts[1] / 60;
          } else if (timeParts.length === 3) {
              totalMinutes = timeParts[0] * 60 + timeParts[1] + timeParts[2] / 60;
          }

          // If the video duration is less than 5 minutes, skip to the next iteration
          if (totalMinutes < 5) return;

          // Move upwards to find the nearest parent with id="content"
          let contentParent = timeElement.parentElement;
          while (contentParent && contentParent.id !== "content") {
              contentParent = contentParent.parentElement;
          }

          if (contentParent && !contentParent.querySelector(':scope > .summarize-button')) {              
              // Create the button
              const sumButton = document.createElement('button');
              sumButton.innerText = 'Assess';
              sumButton.className = 'summarize-button';

              // Round the rectangle
              sumButton.style.borderRadius = '12px';
              sumButton.style.padding = '8px 16px'; 
              sumButton.style.display = 'flex';      
              sumButton.style.alignItems = 'center'; 

              // Positioning and other styles
              sumButton.style.position = 'absolute'; 
              sumButton.style.bottom = '10px';       
              sumButton.style.right = '10px';       
              sumButton.style.backgroundColor = 'black';
              sumButton.style.color = 'white';
              sumButton.style.zIndex = '10';        
              sumButton.style.border = 'none';     
              sumButton.style.cursor = 'pointer';  

              // Create the logo element
              const img = document.createElement('img');
              img.src = chrome.runtime.getURL('src/img/favicon.png');
              img.width = 24;
              img.height = 24;
              img.style.marginRight = '10px'; 

              // Append the image to the button before the text
              sumButton.prepend(img);

              // Make meta relative
              if (getComputedStyle(contentParent).position === 'static') {
                  contentParent.style.position = 'relative';
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
