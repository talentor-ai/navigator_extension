import {
  JOB_POST_SCRAPPED_ACTION,
  POPUP_PORT_NAME,
  UPDATE_JOB_SCRAPPED_ACTION,
  UPDATE_JOB_SCRAPPED_CONFIRMATION_ACTION,
} from '@all/constants';

let popupPort: chrome.runtime.Port | null = null;
let jobPostFormQueueContent: any = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === POPUP_PORT_NAME) {
    popupPort = port;

    if (jobPostFormQueueContent) {
      popupPort.postMessage({
        action: UPDATE_JOB_SCRAPPED_ACTION,
        text: jobPostFormQueueContent,
      });
      setTimeout(() => {
        jobPostFormQueueContent = null;
      }, 350);
    }

    // Handle disconnection
    port.onDisconnect.addListener(() => {
      popupPort = null;
    });
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === JOB_POST_SCRAPPED_ACTION) {
    if (popupPort) {
      // Forward the message to the extension app
      popupPort.postMessage({
        action: UPDATE_JOB_SCRAPPED_ACTION,
        text: message.text,
      });
    } else {
      // Store the message in a queue
      jobPostFormQueueContent = message.text;
    }
  }
  if (message.action === UPDATE_JOB_SCRAPPED_CONFIRMATION_ACTION) {
    console.log('removing jobPostFormQueueContent');
    jobPostFormQueueContent = null;
  }
});
