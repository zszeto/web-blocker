// options.js

// Saves options to chrome.storage
const saveOptions = () => {
    var topic = document.getElementById('topic').value;
    var domains = document.getElementById('domains').value.split(',').map(s => s.trim());
    var websites = document.getElementById('websites').value.split(',').map(s => s.trim());
    var apiKey = document.getElementById('apiKey').value;

    chrome.storage.sync.set({
        'topic': topic,
        'domainsToIgnore': domains,
        'websitesToIgnore': websites,
        'apiKey': apiKey,
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get({
        'topic': '',
        'domainsToIgnore': [],
        'websitesToIgnore': [],
        'apiKey': '',
        'blocked': ''
    }, function (items) {
        document.getElementById('topic').value = items.topic;
        document.getElementById('domains').value = items.domainsToIgnore.join(', ');
        document.getElementById('websites').value = items.websitesToIgnore.join(', ');
        document.getElementById('apiKey').value = items.apiKey;
        document.getElementById('blocked').textContent = items.blocked || 0;
    });
};

// Resets number of sites blocked
document.getElementById('resetCount').addEventListener('click', function () {
    chrome.storage.sync.set({ 'blocked': 0 }, function () {
        document.getElementById('blocked').textContent = 0;
    });
});

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);