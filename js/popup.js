document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('saveButton').addEventListener('click', saveOptions);

function saveOptions() {
    console.log("options saved");
    var topic = document.getElementById('topic').value;
    var websites = document.getElementById('websites').value.split(',').map(s => s.trim());
    var apiKey = document.getElementById('apiKey').value;

    chrome.storage.sync.set({
        'topic': topic,
        'websitesToIgnore': websites,
        'apiKey': apiKey
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function loadOptions() {
    chrome.storage.sync.get({
        'topic': ',',
        'websitesToIgnore': [],
        'apiKey': ''
    }, function(items) {
        document.getElementById('topic').value = items.topic;
        document.getElementById('websites').value = items.websitesToIgnore.join(', ');
        document.getElementById('apiKey').value = items.apiKey;
    });
}
