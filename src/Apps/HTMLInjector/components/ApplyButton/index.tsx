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
    <button className={styles.button} onClick={handleClick}>
      <img
        src="https://media.licdn.com/dms/image/v2/D560BAQFLyUQ1LDN7Zg/company-logo_100_100/company-logo_100_100/0/1729685244919?e=1741219200&v=beta&t=6TBfhen0KWu_7ozM8RbpBnqS-T7G8x2ISfEstezzm1Q"
        style={{
          height: '2.5rem',
        }}
      />
      <span className={styles.label}>Extraer datos</span>
    </button>
  );
};

export default App;
