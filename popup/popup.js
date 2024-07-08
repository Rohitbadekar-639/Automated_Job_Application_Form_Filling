import { showFeedback } from '../scripts/feedback.js';

document.getElementById('userDetailsForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const userDetails = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    zipCode: document.getElementById('zipCode').value,
    country: document.getElementById('country').value,
    highestDegree: document.getElementById('highestDegree').value,
    fieldOfStudy: document.getElementById('fieldOfStudy').value,
    university: document.getElementById('university').value,
    graduationYear: document.getElementById('graduationYear').value,
    currentJobTitle: document.getElementById('currentJobTitle').value,
    currentCompany: document.getElementById('currentCompany').value,
    workStartDate: document.getElementById('workStartDate').value,
    workEndDate: document.getElementById('workEndDate').value,
    jobResponsibilities: document.getElementById('jobResponsibilities').value,
    skills: document.getElementById('skills').value,
    linkedIn: document.getElementById('linkedIn').value,
    portfolio: document.getElementById('portfolio').value,
    githubUsername: document.getElementById('githubUsername').value
  };
  chrome.storage.sync.set({userDetails: userDetails}, function() {
    showFeedback('User details saved successfully');
  });
});

document.getElementById('deleteData').addEventListener('click', function() {
  chrome.storage.sync.remove('userDetails', function() {
    showFeedback('Your data has been deleted');
    document.getElementById('userDetailsForm').reset();
  });
});

// Load saved data when popup opens
chrome.storage.sync.get('userDetails', function(data) {
  if (data.userDetails) {
    for (const [key, value] of Object.entries(data.userDetails)) {
      const element = document.getElementById(key);
      if (element) {
        element.value = value || '';
      }
    }
  }
});