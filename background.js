//background.js

chrome.runtime.onInstalled.addListener(function () {
    // Default list of allowed domains
    const defaultAllowedDomains = ["id.pausd.org", "pausdca.infinitecampus.org", "pausd.schoology.com", "www.google.com", "drive.google.com", "mail.google.com", "docs.google.com"];

    chrome.storage.sync.get({ 'domainsToIgnore': [] }, function (data) {
        if (data.domainsToIgnore.length === 0) {
            chrome.storage.sync.set({ 'domainsToIgnore': defaultAllowedDomains });
        }
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ("icon" in changes) {
        chrome.action.setIcon({ path: changes.icon.newValue });
    }
});