import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FaSearch, FaRegTrashAlt } from "react-icons/fa";
import "./Home.styles.css";

const Home = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [cities] = useState(["New York", "Los Angeles", "London", "Las Vegas"]);

  const handleDelete = (index) => {
    const deletedCity = weatherData[index].city;
    const newData = weatherData.filter((_, i) => i !== index);
    setWeatherData(newData);
    setHighlightedRows([]); // Clear highlighted rows on delete
    notifyCityDeletion(deletedCity); // Notify Sidebar of city deletion
  };

  const handleSearch = () => {
    const matchingRows = weatherData
      .map((data, index) =>
        data.city.toLowerCase() === searchTerm.toLowerCase() ? index : null
      )
      .filter((index) => index !== null);
    setHighlightedRows(matchingRows);
  };

  const notifyCityDeletion = (city) => {
    document.dispatchEvent(new CustomEvent("cityDeleted", { detail: city }));
  };

  const calculateDataAge = (dateAndTime) => {
    try {
      if (!dateAndTime || typeof dateAndTime !== "string") {
        throw new Error("Invalid dateAndTime format");
      }
      const [datePart, timePart] = dateAndTime.split(",").map((part) => part.trim());
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);
      const currentDate = new Date();
      const diffInMilliseconds = currentDate - parsedDate;
      return (diffInMilliseconds / (1000 * 60 * 60)).toFixed(2); // Convert milliseconds to hours
    } catch (error) {
      console.error("Error calculating data age:", error.message);
      return "Error";
    }
  };

  return (
    <div className="home-container">
      <Sidebar setWeatherData={setWeatherData} cities={cities} /> {/* Pass setWeatherData to Sidebar */}
      <div className="main-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by city Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </div>

        <table className="weather-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Description</th>
              <th>Temperature (°C)</th>
              <th>Pressure</th>
              <th>Data Age (hrs)</th>
              <th>
                <FaRegTrashAlt className="delete-icon" />
              </th>
            </tr>
          </thead>
          <tbody>
            {weatherData.length > 0 ? (
              weatherData.map((data, index) => (
                <tr
                  key={index}
                  className={highlightedRows.includes(index) ? "highlight" : ""}
                >
                  <td>{data.city}</td>
                  <td>
                    <input
                      type="text"
                      value={data.description}
                      onChange={(e) => {
                        const newData = [...weatherData];
                        newData[index].description = e.target.value;
                        setWeatherData(newData);
                      }}
                    />
                  </td>
                  <td>{data.temp_in_celsius}</td>
                  <td>{data.pressure_in_hPa}</td>
                  <td>{calculateDataAge(data.date_and_time)}</td>
                  <td>
                    <FaRegTrashAlt
                      className="delete-icon"
                      onClick={() => handleDelete(index)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No weather data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
