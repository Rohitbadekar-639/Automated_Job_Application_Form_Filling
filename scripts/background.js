import { stringSimilarity } from './nlp.js';
import { showFeedback } from './feedback.js';

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: initiateAutofill
  });
});

function initiateAutofill() {
  chrome.runtime.sendMessage({action: 'fieldsDetected', fields: detectFields()});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fieldsDetected') {
    chrome.storage.sync.get('userDetails', (data) => {
      const userDetails = data.userDetails;
      const filledFields = {};

      for (const [key, fields] of Object.entries(request.fields)) {
        const bestMatch = fields.reduce((best, field) => {
          const similarity = stringSimilarity(key, field.name || field.id || field.placeholder);
          return similarity > best.similarity ? { element: field, similarity } : best;
        }, { similarity: 0 });

        if (bestMatch.similarity > 0.7) {  // Threshold for considering it a match
          filledFields[key] = bestMatch.element;
        }
      }

      if (Object.keys(filledFields).length === 0) {
        showFeedback('No matching fields found', 'error');
      } else {
        showFeedback(`Filled ${Object.keys(filledFields).length} fields`);
        chrome.tabs.sendMessage(sender.tab.id, { action: 'fillFields', fields: filledFields, userDetails });
      }
    });
  }
});