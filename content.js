// content.js

chrome.storage.sync.get(['domainsToIgnore', 'websitesToIgnore'], function (data) {
    const currentUrl = window.location.href;
    const currentDomain = new URL(currentUrl).hostname;

    if (data.domainsToIgnore.includes(currentDomain) || data.websitesToIgnore.includes(currentUrl)) {
        return; // Do nothing if the URL or domain is in the ignore list
    }

    checkRelevance();
});

async function checkRelevance() {
    chrome.storage.sync.get(['topic', 'apiKey'], async function (result) {
        let pageContent = document.body.innerText;
        if (pageContent.length > 5000) {
            pageContent = pageContent.substring(0, 5000);
        }
        const url = window.location.href;
        const topic = result.topic;
        const apiKey = result.apiKey;
        const prompt = `Is the following text on ${url} relevant to ${topic}? Begin your response with “Yes” or “No” and follow with a justification. \n\n${pageContent}`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 50,
                })
            });

            const data = await response.json();
            console.log(data);
            if (data.choices && data.choices[0] && data.choices[0].message.content.trim().startsWith("No")) {
                showOverlay();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

function showOverlay() {
    const overlay = document.createElement('div');
    overlay.innerHTML = `
        <div id="edublock-overlay" style="${overlayStyle}">
            <div style="${popupStyle}">
                <h2>This site has been blocked as it is not relevant to your current focus.</h2>
                <button style="${buttonStyle}" id="ignoreDomain">Ignore Domain</button>
                <button style="${buttonStyle}" id="ignoreURL">Ignore URL</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('ignoreDomain').addEventListener('click', () => ignoreDomain());
    document.getElementById('ignoreURL').addEventListener('click', () => ignoreURL());
}

function ignoreDomain() {
    chrome.storage.sync.get(['domainsToIgnore'], function (result) {
        const currentDomain = window.location.hostname;
        const updatedList = [...result.domainsToIgnore, currentDomain];
        chrome.storage.sync.set({ 'domainsToIgnore': updatedList });
        console.log("Added " + currentDomain + " to ignored domains");
    });
    document.getElementById('edublock-overlay').remove();
}

function ignoreURL() {
    chrome.storage.sync.get(['websitesToIgnore'], function (result) {
        const currentURL = window.location.href;
        const updatedList = [...result.websitesToIgnore, currentURL];
        chrome.storage.sync.set({ 'websitesToIgnore': updatedList });
        console.log("Added " + currentUrl + " to ignored URLs");
    });
    document.getElementById('edublock-overlay').remove();
}

const overlayStyle = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const popupStyle = `
    font-family: Arial, sans-serif;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    text-align: center;
    width: 300px;
`;

const buttonStyle = `
    background: #3f51b5;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;
    max-width: 200px;
`;
