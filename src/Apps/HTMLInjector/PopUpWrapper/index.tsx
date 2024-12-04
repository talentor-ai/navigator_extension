import App from '@popup/App';
import styles from './styles.module.css';

const PopUpWrapper = () => {
  return (
    <div
      className={styles.menu}
      style={{
        position: 'fixed',
        top: '10rem',
        right: 0,
        zIndex: 99999,
      }}
    >
      <p>Something</p>
      {/* <App /> */}
    </div>
  );
};

export default PopUpWrapper;
