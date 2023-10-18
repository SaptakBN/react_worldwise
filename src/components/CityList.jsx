import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../context/CityContext";

export default function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) {
    return <Spinner />;
  } else {
    if (!cities.length)
      return (
        <Message message={"Add your first City by clicking on city map."} />
      );
    return (
      <ul className={styles.cityList}>
        {cities.map((city) => (
          <CityItem key={city.id} data={city} />
        ))}
      </ul>
    );
  }
}
