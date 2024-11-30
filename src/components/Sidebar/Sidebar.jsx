import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ setWeatherData, cities }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);
  const [fetchedCities, setFetchedCities] = useState(new Set()); // Track fetched cities
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const fetchWeather = async (city) => {
    if (fetchedCities.has(city)) return; // Prevent refetching

    try {
      const response = await fetch(
        `https://python3-dot-parul-arena-2.appspot.com/test?cityname=${city}`
      );
      const data = await response.json();
      setWeatherData((prevData) => [...prevData, { ...data, city }]);
      setFetchedCities((prev) => new Set([...prev, city])); // Add city to fetched set
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  // Listen for city deletion from Home component
  useEffect(() => {
    const handleCityDeleted = (event) => {
      setFetchedCities((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.delete(event.detail); // Remove deleted city
        return updatedSet;
      });
    };
    document.addEventListener("cityDeleted", handleCityDeleted);

    return () => {
      document.removeEventListener("cityDeleted", handleCityDeleted);
    };
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
      </button>
      {isOpen && (
        <div className="sidebar-content">
          <button
            className="get-weather-btn"
            onClick={() => fetchWeather(selectedCity)}
            disabled={!selectedCity || fetchedCities.has(selectedCity)}
          >
            Get Weather
          </button>
          <table className="cities-list">
            <thead>
              <tr>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, index) => (
                <tr key={index}>
                  <td
                    className={`city-item ${
                      selectedCity === city ? "selected" : ""
                    } ${fetchedCities.has(city) ? "fetched" : ""}`}
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
