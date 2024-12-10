import { JOB_POST_FIELDS } from '@injector/constants';
import { get } from 'lodash';

const JobPostScrapper = () => {
  const formFields: { [key: string]: string } = {};

  JOB_POST_FIELDS.forEach(({ field, cssKey, accessTo }) => {
    // Define the base element
    let targetElement = document.querySelector(cssKey);

    // Check if the element exists
    if (!targetElement) return;

    // Access to the pointed element from the base element
    if (accessTo) {
      targetElement = get(targetElement, accessTo, targetElement);
    }

    // Check if the element has content
    if (!targetElement?.textContent) return;
    const content = targetElement.textContent.replace(/\s+/g, ' ').trim();
    formFields[field] = content;
  });

  return formFields;
};

export default JobPostScrapper;
