// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlLocation } from "../hooks/UrlLocation";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../context/CityContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

// eslint-disable-next-line react-refresh/only-export-components
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function reducer(state, action) {
  switch (action.type) {
    case "formLoading/start":
      return { ...state, formLoading: true };
    case "formLoading/end":
      return { ...state, formLoading: false };
    case "set/cityName":
      return { ...state, cityName: action.payload };
    case "set/country":
      return { ...state, country: action.payload };
    case "set/date":
      return { ...state, date: action.payload };
    case "set/notes":
      return { ...state, notes: action.payload };
    case "set/emoji":
      return { ...state, emoji: action.payload };
    case "set/locationErr":
      return { ...state, locationErr: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
const initialState = {
  cityName: "",
  country: "",
  date: new Date(),
  notes: "",
  formLoading: false,
  emoji: "",
  locationErr: "",
};

function Form() {
  const [
    { cityName, country, date, notes, formLoading, emoji, locationErr },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { addNewCity, isLoading } = useCities();
  const { lat, lng } = useUrlLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCityData() {
      dispatch({ type: "set/locationErr", payload: "" });
      try {
        dispatch({ type: "formLoading/start" });
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode)
          throw new Error("This is not a valid counry please click elsewhere.");

        dispatch({
          type: "set/cityName",
          payload: data.city || data.locality || "",
        });
        dispatch({
          type: "set/country",
          payload: data.countryName,
        });
        dispatch({
          type: "set/emoji",
          payload: convertToEmoji(data.countryCode),
        });
      } catch (error) {
        dispatch({ type: "set/locationErr", payload: error.message });
      } finally {
        dispatch({ type: "formLoading/end" });
      }
    }
    if (lat && lng) fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;
    const newCity = {
      cityName,
      date,
      country,
      emoji,
      position: { lat, lng },
      notes,
    };
    await addNewCity(newCity);
    navigate("/app");
  }

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map." />;
  if (locationErr) return <Message message={locationErr} />;
  return formLoading ? (
    <Spinner />
  ) : (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({
              type: "set/cityName",
              payload: e.target.value,
            })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) =>
            dispatch({
              type: "set/date",
              payload: date,
            })
          }
          dateFormat="MMMM dd, yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({
              type: "set/notes",
              payload: e.target.value,
            })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>

        <BackButton />
      </div>
    </form>
  );
}

export default Form;
