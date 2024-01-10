chrome.storage.sync.get(['topic', 'websitesToIgnore', 'apiKey'], function(data) {
    const currentDomain = window.location.hostname;
    if (data.websitesToIgnore.includes(currentDomain)) {
        console.log("Ignored" + currentDomain);
        return; // Do nothing if the domain is in the ignore list
    }

    // Extract the text content of the page
    const pageContent = document.body.innerText;

    // Function to check relevance with OpenAI API
    function checkRelevance(content) {
        if (window.location.hostname === "www.google.com") {
            replacePageContent();
        }
        // API call to OpenAI
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.apiKey}`
            },
            body: JSON.stringify({text: content}) //finish API call
        })
        .then(response => response.json())
        .then(data => {
            if (data.choices[0] === 'true') {
                replacePageContent();
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Function to replace page content
    function replacePageContent() {
        console.log("testing it")
        document.body.innerHTML = `
            <div style="text-align: center; margin-top: 20%;">
                <h1>This site has been blocked as it is not relevant to your current focus.</h1>
                <button id="overrideButton">Override and Allow This Site</button>
            </div>
        `;

        document.getElementById('overrideButton').addEventListener('click', function() {
            chrome.storage.sync.get(['websitesToIgnore'], function(result) {
                const updatedList = [...result.websitesToIgnore, currentDomain];
                chrome.storage.sync.set({ 'websitesToIgnore': updatedList }, function() {
                    location.reload(); // Reload the page to view the original content
                });
            });
        });
    }

    // Check if the page is relevant
    checkRelevance(pageContent);
});
