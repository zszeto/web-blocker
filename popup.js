
document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('saveButton').addEventListener('click', saveTopic);
document.getElementById('ignoreDomain').addEventListener('click', ignoreDomain);
document.getElementById('ignoreURL').addEventListener('click', ignoreURL);
document.querySelector('#options').addEventListener('click', function () {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options.html'));
    }
});


function saveTopic() {
    console.log("options saved");
    var topic = document.getElementById('topic').value;

    chrome.storage.sync.set({
        'topic': topic,
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Focus saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function loadOptions() {
    chrome.storage.sync.get({
        'topic': '',
    }, function (items) {
        document.getElementById('topic').value = items.topic;
    });
}

function ignoreDomain() {
    chrome.storage.sync.get(['domainsToIgnore'], function (result) {
        const currentDomain = window.location.hostname;
        const updatedList = [...result.domainsToIgnore, currentDomain];
        chrome.storage.sync.set({ 'domainsToIgnore': updatedList }, function () {
            var status = document.getElementById('status');
            status.textContent = 'Domain saved';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
        });
    });
}

function ignoreURL() {
    chrome.storage.sync.get(['websitesToIgnore'], function (result) {
        const currentURL = window.location.href;
        const updatedList = [...result.websitesToIgnore, currentURL];
        chrome.storage.sync.set({ 'websitesToIgnore': updatedList }, function () {
            var status = document.getElementById('status');
            status.textContent = 'URL saved';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
        });
    });
}
