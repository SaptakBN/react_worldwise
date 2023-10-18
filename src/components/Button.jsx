import styles from "./Button.module.css";

export default function Button({ children, onClickFun, type }) {
  return (
    <button className={`${styles.btn} ${styles[type]}`} onClick={onClickFun}>
      {children}
    </button>
  );
}
