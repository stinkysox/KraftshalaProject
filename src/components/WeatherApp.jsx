import React, { useState } from "react";
import "./WeatherApp.css";
import cloudImage from "../assets/cloud.png";
import snowImage from "../assets/snow.png";
import drizzleImage from "../assets/drizzle.png";
import clearImage from "../assets/clear.png";
import rainImage from "../assets/rain.png";
import humidityIcon from "../assets/humidity.png";
import windImage from "../assets/wind.png";

const WeatherApp = () => {
  const [inputValue, setInputValue] = useState("");
  const [weatherDetails, setWeatherDetails] = useState({
    humidity: "12 %",
    wind: "19km/h",
    temperature: "15 °c",
    location: "Canada",
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState(snowImage);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case "01d":
      case "01n":
        return clearImage;
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return cloudImage;
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        return rainImage;
      case "13d":
      case "13n":
        return snowImage;
      case "50d":
      case "50n":
        return drizzleImage;
      default:
        return snowImage;
    }
  };

  const handleGetWeatherDetails = async () => {
    const apiKey = "06cd4ec1bf21b3e0c985fb8784b54034";
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&APPID=${apiKey}`;

    try {
      const response = await fetch(api);
      const data = await response.json();
      console.log(data);

      const timestampUTC = new Date(data.dt * 1000);
      console.log(timestampUTC);

      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      };
      const localTime = timestampUTC.toLocaleString("en-US", options);
      console.log(localTime);
      setWeatherDetails({
        humidity: data.main.humidity + "%",
        wind: Math.floor(data.wind.speed) + " km/h",
        temperature: Math.floor(data.main.temp) + "°c",
        location: data.name,
        dateTime: localTime,
      });

      const iconCode = data.weather[0].icon;
      const icon = getWeatherIcon(iconCode);
      setWeatherIcon(icon);
    } catch (error) {
      console.log(error);
      alert("Please enter a valid name");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? "dark-bg" : "weather-w-contianer"}>
      <div className="weather-app-bg">
        <div className="input-container">
          <input
            className="input-el"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter City Name"
          />
          <button className="button" onClick={handleGetWeatherDetails}>
            Get Details
          </button>
        </div>
        <div>
          <div className="toggle-switch">
            <button
              className={isDarkMode ? "black-btn" : "toggle-btn"}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>

        <div className="temp-section">
          <div className="temp-image-container">
            <img className="weather-image" src={weatherIcon} alt="" />
          </div>
          <div className={isDarkMode ? "dark-text" : "temp-text-container"}>
            <p>{weatherDetails.temperature}</p>
            <p>{weatherDetails.location}</p>
            <p>{weatherDetails.dateTime}</p>
          </div>
          <div className="wind-humid-container">
            <div className="humid-container">
              <p> Humindity: {weatherDetails.humidity}</p>
              <img className="small-icon" src={humidityIcon} alt="" />
            </div>
            <div className="wind-container">
              <p>Wind: {weatherDetails.wind}</p>
              <img className="small-icon" src={windImage} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
