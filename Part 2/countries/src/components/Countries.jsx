import { useState, useEffect } from "react";
const api_key = import.meta.env.VITE_SOME_KEY;
import axios from "axios";

const Countries = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const handleShowCountry = (country) => {
    setSelectedCountry(country);
    setWeatherData(null);
  };

  useEffect(() => {
    console.log("selectedCountry:", selectedCountry);
    if (selectedCountry) {
      axios
        .get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${selectedCountry.capital}&limit=1&appid=${api_key}`
        )
        .then((geoResponse) => {
          const { lat, lon } = geoResponse.data[0];
          return axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
          );
        })
        .then((weatherResponse) => {
          console.log(weatherResponse.data);
          setWeatherData(weatherResponse.data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (countries.length === 1) {
      setSelectedCountry(countries[0]);
    }
  }, [countries]);

  const showCountry = (country) => {
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h3>Languages: </h3>
        <ul>
          {Object.entries(country.languages).map(([code, language]) => (
            <li key={code}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt="" />
        {weatherData === null ? null : showWeather(country)}
      </div>
    );
  };

  const showWeather = (country) => {
    return (
      <div>
        <h3>Weather in {country.capital}</h3>
        <p>Temperature: {weatherData.main.temp}</p>
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt=""
        />
        <p>Wind speed: {weatherData.wind.speed}</p>
      </div>
    );
  };
  
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length < 10 && countries.length > 1) {
    return (
      <ul>
        {countries.map((country) => (
          <div key={country.name.common}>
            <li>{country.name.common}</li>
            <button
              onClick={() =>
                selectedCountry === country
                  ? handleShowCountry(null)
                  : handleShowCountry(country)
              }
            >
              show
            </button>
            {selectedCountry === country ? showCountry(country) : null}
          </div>
        ))}
      </ul>
    );
  } else if (countries.length === 0) {
    return <p>No matches, specify another filter</p>;
  } else if (countries.length === 1) {
    return showCountry(countries[0]);
  }
};

export default Countries;
