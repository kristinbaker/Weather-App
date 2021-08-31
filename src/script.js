let currentData = new Date();
let currentTime = document.querySelector("#current-time");
let currentDate = document.querySelector("#current-date");
let form = document.querySelector("#search-city-form");
let searchButton = document.querySelector(".search-city-button");
let celsiusLink = document.querySelector("#celsius-link");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let apiKey = "f1b97e6818bf3a43bc9a1319c9ff238a";
let units = `imperial`;
let currentFahrenheitTemperature = null;
let currentFahrenheitHigh = null;
let currentFahrenheitLow = null;

celsiusLink.addEventListener("click", convertToCelsius);
fahrenheitLink.addEventListener("click", convertToFahrenheit);
searchButton.addEventListener("click", searchCity);
form.addEventListener("keypress", searchCity);
currentDate.innerText = updateDate(currentData);
currentTime.innerText = updateTime(currentData);
findLocation();

function updateTime(date) {
  let currentHour = date.getHours();
  let currentMinutes = date.getMinutes();
  let timeOfDay;

  if (currentMinutes < 10) {
    currentMinutes = "0" + currentMinutes;
  }

  if (currentHour < 12) {
    timeOfDay = `AM`;
  } else if (currentHour === 12) {
    timeOfDay = `PM`;
  } else {
    currentHour = currentHour - 12;
    timeOfDay = `PM`;
  }
  let updatedTime = `${currentHour}:${currentMinutes} ${timeOfDay}`;
  return updatedTime;
}

function updateDate() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let currentDay = days[currentData.getDay()];
  let currentMonth = months[currentData.getMonth()];
  let dayNumber = currentData.getDate();
  let updatedDate = `${currentDay}, ${currentMonth} ${dayNumber}`;
  return updatedDate;
}

function locationButton() {
  findLocation();
}

let button = document.querySelector("#location-button");
button.addEventListener("click", locationButton);

function findLocation() {
  navigator.geolocation.getCurrentPosition(updateCurrentLocation);
}

function updateCurrentLocation(position) {
  let latitude = Math.round(position.coords.latitude);
  let longitude = Math.round(position.coords.longitude);
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiURL).then((response) => {
    showLocation(response);
    updateCurrentWeather(response);
    getForecast(response.data.coord);
  });
}

function showLocation(response) {
  let newCity = response.data.name;
  let currentCity = document.querySelector(`#current-location`);
  currentCity.innerHTML = `${newCity}`;
}

function updateCurrentWeather(response) {
  let currentTemp = document.querySelector(`#current-temp`);
  let currentWeatherEmoji = document.querySelector(`#current-weather-emoji`);
  let currentWeatherDescription = document.querySelector(
    `#current-weather-description`
  );
  currentFahrenheitTemperature = response.data.main.temp;
  currentFahrenheitHigh = response.data.main.temp_max;
  currentFahrenheitLow = response.data.main.temp_min;
  let currentHigh = document.querySelector(`#current-high`);
  let currentLow = document.querySelector(`#current-low`);
  let wind = document.querySelector(`#wind`);
  let humidity = document.querySelector(`#humidity`);
  let temperature = Math.round(currentFahrenheitTemperature);
  let updateCurrentWeatherEmoji = response.data.weather[0].icon;
  let updateCurrentWeatherDescription = response.data.weather[0].description;
  let updateCurrentHigh = Math.round(currentFahrenheitHigh);
  let updateCurrentLow = Math.round(currentFahrenheitLow);
  let updateWind = Math.round(response.data.wind.speed);
  let updateHumidity = Math.round(response.data.main.humidity);

  currentTemp.innerHTML = `${temperature}`;
  currentHigh.innerHTML = `H:${updateCurrentHigh}`;
  currentLow.innerHTML = `L:${updateCurrentLow}`;
  wind.innerHTML = `wind: ${updateWind} mph`;
  humidity.innerHTML = `humidity: ${updateHumidity}%`;
  currentWeatherEmoji.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${updateCurrentWeatherEmoji}@2x.png`
  );
  currentWeatherDescription.innerHTML = `${updateCurrentWeatherDescription}`;

  getForecast(response.data.coord);
}

function searchCity(event) {
  if (event.charCode === 13 || event.type === "click") {
    event.preventDefault();
    let cityInput = document.querySelector("#search-city-text");
    let newCity = cityInput.value;
    let currentLocation = document.querySelector("#current-location");
    currentLocation.innerHTML = `${cityInput.value}`;
    cityInput.value = "";
    getSearchCityTemp(newCity);
  }
}

function getSearchCityTemp(newCity) {
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=${units}&appid=${apiKey}`;
  axios.get(apiURL).then(updateCurrentWeather);
}

function getForecast(coordinates) {
  let lon = coordinates.lon;
  let lat = coordinates.lat;
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayForecast);
}

function formatDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector(`#forecast`);
  let forecast = response.data.daily;
  let forecastHTML = "";
  forecast.forEach(function (forecastDays, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
    <div class="row-forecast">
      <div class="col weather-forecast-date">${formatDays(
        forecastDays.dt
      )}</div>
      <div class="col weather-forecast-emoji">
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDays.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
      </div>
      <div class="col weather-forecast-high">${Math.round(
        forecastDays.temp.max
      )}</div>
      <div class="col weather-forecast-low">${Math.round(
        forecastDays.temp.min
      )}</div>
    </div>
  `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function convertToCelsius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector(`#current-temp`);
  let currentHigh = document.querySelector(`#current-high`);
  let currentLow = document.querySelector(`#current-low`);
  let farenheit = document.querySelector(`#fahrenheit-link`);
  let celsius = document.querySelector(`#celsius-link`);
  farenheit.classList.remove("active");
  celsius.classList.add("active");

  let currentCelsiusTemp = Math.round(
    (currentFahrenheitTemperature - 32) * (5 / 9)
  );
  let currentCelsiusHigh = Math.round((currentFahrenheitHigh - 32) * (5 / 9));
  let currentCelsiusLow = Math.round((currentFahrenheitLow - 32) * (5 / 9));
  currentTemp.innerHTML = `${currentCelsiusTemp}`;

  currentHigh.innerHTML = `H:${currentCelsiusHigh}`;
  currentLow.innerHTML = `L:${currentCelsiusLow}`;
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let currentTemp = document.querySelector(`#current-temp`);
  let currentHigh = document.querySelector(`#current-high`);
  let currentLow = document.querySelector(`#current-low`);
  let updateFahrenheitHigh = Math.round(currentFahrenheitHigh);
  let updateFahrenheitLow = Math.round(currentFahrenheitLow);

  currentTemp.innerHTML = Math.round(currentFahrenheitTemperature);
  currentHigh.innerHTML = `H:${updateFahrenheitHigh}`;
  currentLow.innerHTML = `L:${updateFahrenheitLow}`;
}
