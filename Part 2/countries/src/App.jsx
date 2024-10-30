import { useState, useEffect } from "react";
import Countries from "./components/Countries";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const filterCountries = (filter) => {
    if (filter === "") {
      return countries
    }
    return countries.filter((country) => {
      
      return country.name.common.toLowerCase().includes(filter.toLowerCase());
    });
  };
  return (
    <div>
      <form>
        find countries{" "}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </form>
      <Countries countries={filterCountries(filter)} />
    </div>
  );
};

export default App;
