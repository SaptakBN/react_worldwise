import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../context/CityContext";

export default function CountryList() {
  const { cities, isLoading } = useCities();
  const countries = cities.reduce((acc, curr) => {
    if (acc.map((el) => el.country).includes(curr.country)) {
      return acc;
    } else {
      return [...acc, { country: curr.country, emoji: curr.emoji }];
    }
  }, []);

  if (isLoading) {
    return <Spinner />;
  } else {
    if (!countries.length)
      return (
        <Message message={"Add your first Country by clicking on the map."} />
      );
    return (
      <ul className={styles.countryList}>
        {countries.map((country) => (
          <CountryItem country={country} key={country.country} />
        ))}
      </ul>
    );
  }
}
