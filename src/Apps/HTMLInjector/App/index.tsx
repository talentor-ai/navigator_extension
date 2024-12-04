import styles from './styles.module.css';

const App = () => {
  return (
    <button className={styles.button}>
      <img
        src="https://media.licdn.com/dms/image/v2/D560BAQFLyUQ1LDN7Zg/company-logo_100_100/company-logo_100_100/0/1729685244919?e=1741219200&v=beta&t=6TBfhen0KWu_7ozM8RbpBnqS-T7G8x2ISfEstezzm1Q"
        style={{
          height: '2.5rem',
        }}
      />
      <span className={styles.label}>Aplicar ahora</span>
    </button>
  );
};

export default App;
