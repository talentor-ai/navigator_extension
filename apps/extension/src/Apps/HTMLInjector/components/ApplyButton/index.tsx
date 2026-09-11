import { JobPostScrapper } from '@injector:helpers';
import styles from './styles.module.css';
import { JOB_POST_SCRAPPED_ACTION } from '@all/constants';

const App = () => {
  // Hendlers
  const handleClick = () => {
    const formScrappedValues = JobPostScrapper();
    chrome.runtime.sendMessage({
      action: JOB_POST_SCRAPPED_ACTION,
      text: JSON.stringify(formScrappedValues),
    });
  };

  return (
    <button
      className={`${styles.button} tai:active:scale-95`}
      onClick={handleClick}
    >
      <img
        src="https://raw.githubusercontent.com/talentor-ai/navigator_extension/refs/heads/main/public/48.png"
        style={{
          height: '2.5rem',
        }}
      />
      <span className={styles.label}>Extraer datos</span>
    </button>
  );
};

export default App;
