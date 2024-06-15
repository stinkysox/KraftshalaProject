import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
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
    humidity: "12%",
    wind: "19 km/h",
    temperature: "15°C",
    location: "Canada",
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weatherIcon, setWeatherIcon] = useState(snowImage);
  const [apiStatus, setApiStatus] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const renderLoadingView = () => (
    <div className="loader-container">
      <ThreeDots color="#0b69ff" height="50" width="50" />
    </div>
  );

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
      setApiStatus("Loading");
      const response = await fetch(api);
      if (response.ok) {
        const data = await response.json();
        const timestampUTC = new Date(data.dt * 1000);
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
        setWeatherDetails({
          humidity: data.main.humidity + "%",
          wind: Math.floor(data.wind.speed) + " km/h",
          temperature: Math.floor(data.main.temp) + "°C",
          location: data.name,
          dateTime: localTime,
        });
        const iconCode = data.weather[0].icon;
        const icon = getWeatherIcon(iconCode);
        setWeatherIcon(icon);
        setApiStatus("Success");
      } else {
        setApiStatus("Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Please enter a valid city name");
      setApiStatus("Failed");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderBasedOnApp = () => {
    switch (apiStatus) {
      case "Loading":
        return renderLoadingView();
      case "Success":
        return (
          <div className="temp-section">
            <div className="temp-image-container">
              <img
                className="weather-image"
                src={weatherIcon}
                alt="Weather Icon"
              />
            </div>
            <div className={isDarkMode ? "dark-text" : "temp-text-container"}>
              <p>{weatherDetails.temperature}</p>
              <p>{weatherDetails.location}</p>
              <p>{weatherDetails.dateTime}</p>
            </div>
            <div className="wind-humid-container">
              <div className="humid-container">
                <p>Humidity: {weatherDetails.humidity}</p>
                <img
                  className="small-icon"
                  src={humidityIcon}
                  alt="Humidity Icon"
                />
              </div>
              <div className="wind-container">
                <p>Wind: {weatherDetails.wind}</p>
                <img className="small-icon" src={windImage} alt="Wind Icon" />
              </div>
            </div>
          </div>
        );
      case "Failed":
        return (
          <div className="error-text">
            <p> Failed to fetch weather details. Please try again.</p>
            <button onClick={() => setApiStatus("")}>Retry</button>
          </div>
        );
      default:
        return (
          <div className="temp-section">
            <div className="temp-image-container">
              <img
                className="weather-image"
                src={weatherIcon}
                alt="Weather Icon"
              />
            </div>
            <div className={isDarkMode ? "dark-text" : "temp-text-container"}>
              <p>{weatherDetails.temperature}</p>
              <p>{weatherDetails.location}</p>
              <p>{weatherDetails.dateTime}</p>
            </div>
            <div className="wind-humid-container">
              <div className="humid-container">
                <p>Humidity: </p>
                <p>{weatherDetails.humidity}</p>
                <img
                  className="small-icon"
                  src={humidityIcon}
                  alt="Humidity Icon"
                />
              </div>
              <div className="wind-container">
                <p>Wind: </p>
                <p>{weatherDetails.wind}</p>
                <img className="small-icon" src={windImage} alt="Wind Icon" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={isDarkMode ? "dark-bg" : "weather-w-contianer "}>
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
        <div className="toggle-switch">
          <button
            className={isDarkMode ? "black-btn" : "toggle-btn"}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? "Light" : "Dark"}
          </button>
        </div>
        <div>{renderBasedOnApp()}</div>
      </div>
    </div>
  );
};

export default WeatherApp;
