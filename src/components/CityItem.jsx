import { useCities } from "../context/CityContext";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";

export default function CityItem({ data }) {
  const { cityName, emoji, date, id, position } = data;
  const { lat, lng } = position;
  const { currentCity, deleteCity } = useCities();

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  function handleDelete(e) {
    e.preventDefault();
    deleteCity(id);
  }
  return (
    <li>
      <div>
        <Link
          to={`${id}?lat=${lat}&lng=${lng}`}
          className={`${styles.cityItem} ${
            id === currentCity.id ? styles["cityItem--active"] : null
          }`}
        >
          <span className={styles.emoji}>{emoji}</span>
          <h3 className={styles.name}>{cityName}</h3>
          <time className={styles.date}>{formatDate(date)}</time>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            &times;
          </button>
        </Link>
      </div>
    </li>
  );
}
