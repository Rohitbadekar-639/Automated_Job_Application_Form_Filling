function detectFields() {
  const fieldMap = {
    firstName: ['first[_-]?name', 'given[_-]?name'],
    lastName: ['last[_-]?name', 'family[_-]?name', 'surname'],
    email: ['email', 'e[_-]?mail'],
    phone: ['phone', 'telephone', 'mobile', 'cell'],
    address: ['address', 'street'],
    city: ['city', 'town'],
    state: ['state', 'province', 'region'],
    zipCode: ['zip', 'postal[_-]?code'],
    country: ['country', 'nation'],
    highestDegree: ['degree', 'education[_-]?level'],
    fieldOfStudy: ['major', 'field[_-]?of[_-]?study', 'course'],
    university: ['university', 'college', 'school', 'institution'],
    graduationYear: ['graduation[_-]?year', 'year[_-]?of[_-]?graduation'],
    currentJobTitle: ['job[_-]?title', 'position', 'role'],
    currentCompany: ['company', 'employer', 'organization'],
    workStartDate: ['start[_-]?date', 'from[_-]?date'],
    workEndDate: ['end[_-]?date', 'to[_-]?date'],
    jobResponsibilities: ['responsibilities', 'duties', 'job[_-]?description'],
    skills: ['skills', 'abilities', 'competencies'],
    linkedIn: ['linkedin', 'linked[_-]?in'],
    portfolio: ['portfolio', 'personal[_-]?website'],
    githubUsername: ['github', 'git[_-]?hub']
  };

  const detectedFields = {};

  for (const [key, patterns] of Object.entries(fieldMap)) {
    const regex = new RegExp(patterns.join('|'), 'i');
    const fields = [...document.querySelectorAll('input, textarea, select')]
      .filter(el => regex.test(el.name) || regex.test(el.id) || regex.test(el.placeholder));
    if (fields.length > 0) {
      detectedFields[key] = fields;
    }
  }

  return detectedFields;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillFields') {
    for (const [key, element] of Object.entries(request.fields)) {
      const value = request.userDetails[key];
      
      if (element.tagName === 'INPUT') {
        if (element.type === 'radio' || element.type === 'checkbox') {
          const options = document.querySelectorAll(`input[name="${element.name}"]`);
          for (const option of options) {
            if (option.value.toLowerCase() === value.toLowerCase()) {
              option.checked = true;
              break;
            }
          }
        } else {
          element.value = value;
        }
      } else if (element.tagName === 'SELECT') {
        for (const option of element.options) {
          if (option.text.toLowerCase() === value.toLowerCase()) {
            option.selected = true;
            break;
          }
        }
      } else if (element.tagName === 'TEXTAREA') {
        element.value = value;
      }
      
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
});