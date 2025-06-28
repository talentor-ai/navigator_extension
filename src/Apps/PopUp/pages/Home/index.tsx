import {
  POPUP_PORT_NAME,
  UPDATE_JOB_SCRAPPED_ACTION,
  UPDATE_JOB_SCRAPPED_CONFIRMATION_ACTION,
} from '@all/constants';
import { useJobPostFormStore } from '@popup:store';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  const { formData, setFormData } = useJobPostFormStore();

  useEffect(() => {
    // Open a connection to the background script
    const port = chrome.runtime.connect({ name: POPUP_PORT_NAME });

    // Listen for messages from the background script
    port.onMessage.addListener((message) => {
      const action = message.action;
      if (action === UPDATE_JOB_SCRAPPED_ACTION) {
        const data = JSON.parse(message.text);
        console.log('receiving data...', message);
        // Confirming the message
        port.postMessage({ action: UPDATE_JOB_SCRAPPED_CONFIRMATION_ACTION });
        setFormData({ ...formData, ...data });
      }
    });

    return () => {
      port.disconnect(); // Cleanup on component unmount
    };
  }, []);

  return <Outlet />;
};

export default Home;
