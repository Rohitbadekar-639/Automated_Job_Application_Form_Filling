function showFeedback(message, type = 'info') {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'showFeedback',
      message: message,
      type: type
    });
  });
}

// Content script injection for feedback
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: injectFeedbackDiv
    });
  }
});

function injectFeedbackDiv() {
  if (!document.getElementById('autofiller-feedback')) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'autofiller-feedback';
    feedbackDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border-radius: 5px;
      z-index: 9999;
      display: none;
    `;
    document.body.appendChild(feedbackDiv);
  }

  // Listen for feedback messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showFeedback') {
      const feedbackDiv = document.getElementById('autofiller-feedback');
      feedbackDiv.textContent = request.message;
      feedbackDiv.style.backgroundColor = request.type === 'error' ? '#f44336' : '#4CAF50';
      feedbackDiv.style.display = 'block';
      setTimeout(() => {
        feedbackDiv.style.display = 'none';
      }, 3000);
    }
  });
}

export { showFeedback };