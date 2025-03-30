import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [data, setData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cityTime, setCityTime] = useState("");
  const API_KEY = "1f43dfed22c1bdcc25a718c175b543dc";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval); 
  }, []);

  const getWeather = async () => {
    if (!city) {
      toast.warn("Please enter a city name.");
    } else {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    try {
      const res = await axios.get(url);
      setData(res.data);
      toast.success("Weather data fetched successfully!");
      const timezoneOffset = res.data.timezone; 
      const cityTimeString = new Date(
        Date.now() + (timezoneOffset * 1000)
      ).toLocaleString("en-US", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      
      setCityTime(cityTimeString);
      const res2 = await axios.get(forecastUrl);
      setForecastData(res2.data);
    } catch (error) {
      toast.error("City not found. Please try again.");
    }
  };
}

const getFormattedDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const getFormattedTime = (date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getDayName = (date) => {
  return date.toLocaleDateString(undefined, { weekday: "long" });
};
const getWeatherImage = () => {
  if (!data) return " "; 

  switch (data.weather[0].main.toLowerCase()) {
    case "clear":
      return "/images/clear-sun.png";
    case "clouds":
      return "/images/cloud.png";
    case "rain":
      return "/images/rain.png";
    case "thunderstorm":
      return "/images/thunderstorm.png";
    case "snow":
      return "/images/snow.png";
    case "haze":
      return "/images/fog.png";
    case "fog":
      return "/images/fog.png";
    default:
      return "/images/clear-sun.png"; 
  }
};

  return (
    <div className="App">
      <div className="weatherContainer">
      <div className="input">
        <input type="text" value={city} placeholder="Enter city name ...." onChange={(e)=>setCity(e.target.value)}/>
        <button onClick={getWeather}>Get Weather</button>
      </div>
     {data ? (
        <div className="weather">
          <h1 className="city">{data.name}</h1>
          <h1 className="temperature">{(data.main.temp).toFixed(2)}°C</h1>
          <h1 className="temperature2">RealFeel {(data.main.feels_like).toFixed(2)}°C</h1>
          <h1 className="view">Condition: {data.weather[0].main}</h1>
          <h1 className="windSpeed">Wind Speed: {(data.wind.speed * 3.6).toFixed(2)} km/h</h1>
          <h1 className="humidity">Humidity: {data.main.humidity}%</h1>
        </div>
      ) : (
        <h2 className="noData">No data available. Please search a city.</h2>
      )}
    </div>

    <div className="forecastContainer">
      <h5>{getFormattedDate(currentTime)} {getDayName(currentTime)}</h5>
    {forecastData &&
  forecastData.list &&
  forecastData.list.slice(0, 6).map((val, index) => (
    
    <div key={index} className="hour">
      <h4>
        {new Date(val.dt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </h4>
      <p>{val.main.temp.toFixed(1)}°C</p>
      <p>{val.weather[0].main}</p>
    </div>
  ))}
    </div>
    <div className="container">
    <div className="weatherDisplay">
    {data ? (
      <div className="subContainer">
        <div className="cityName">
          <h1 className="city">{data.name}</h1>
          <h4 className="country">{data.sys.country}</h4>
        </div>
        <div className="day-temp">
        <div className="dateTime">
        <h2>{cityTime}</h2>
        <h5>{getFormattedDate(currentTime)} {getDayName(currentTime)}</h5>
        </div>
        <div className="temperature">
          <h1>{(data.main.temp).toFixed(2)}°C</h1>
          <h3>RealFeel {(data.main.feels_like).toFixed(2)}°C</h3>
        </div>
        </div>
        </div>
      ) : (
        <h2 className="noData">No data available. Please search a city.</h2>
      )}
    </div>
    <div className="searchDisplay">
      <div className="image">
        {data ? <img src={getWeatherImage()} alt="weather-image" /> : " "}
      </div>
      <h2>{data ? data.weather[0].main : " "}</h2>
      
      <div className="input">
        <input type="text" value={city} placeholder="Enter city name ...." onChange={(e)=>setCity(e.target.value)}/>
        <div className="image"><img onClick={getWeather} src="/images/search.png" alt="search"/>
      </div>
      </div>
      {data ?
      <ul className="info">
        <li><span>Temperature</span> <span>{(data.main.temp).toFixed(2)}°C {data.weather[0].main}</span></li>
        <li><span>Humidity</span><span>{data.main.humidity}%</span></li>
        <li><span>Wind Speed</span><span>{(data.wind.speed * 3.6).toFixed(2)} km/h</span></li>
        <li><span>Visibility</span><span>{data.visibility} m</span></li>
      </ul> : " "
}
    </div>
    </div>
    <footer>
    <p>🌤️Powered by OpenWeatherMap | ⏰{new Date().getFullYear()} | Built with ❤️ by Priyanshu</p>
    </footer>
    <ToastContainer />
    </div>
  );
}

export default App;