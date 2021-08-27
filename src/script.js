let currentData = new Date();
let currentTime = document.querySelector("#current-time");
let currentDate = document.querySelector("#current-date");
let form = document.querySelector("#search-city-button");
let celsiusLink = document.querySelector("#celsius-link");
let fahrenheitLink = document.querySelector("#fahrenheit-link");
let apiKey = "f1b97e6818bf3a43bc9a1319c9ff238a";
let units = `imperial`;
let currentFahrenheitTemperature = null;
let currentFahrenheitHigh = null;
let currentFahrenheitLow = null;

celsiusLink.addEventListener("click", convertToCelsius);
fahrenheitLink.addEventListener("click", convertToFahrenheit);
form.addEventListener("keypress", searchCity);
currentDate.innerText = updateDate(currentData);
currentTime.innerText = updateTime(currentData);
findLocation();

function updateTime() {
  let currentHour = currentData.getHours();
  let currentMinutes = currentData.getMinutes();
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
  currentHigh.innerHTML = `H:${updateCurrentHigh}℉`;
  currentLow.innerHTML = `L:${updateCurrentLow}℉`;
  wind.innerHTML = `wind: ${updateWind} mph`;
  humidity.innerHTML = `humidity: ${updateHumidity}%`;
  currentWeatherEmoji.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${updateCurrentWeatherEmoji}@2x.png`
  );
  currentWeatherDescription.innerHTML = `${updateCurrentWeatherDescription}`;
}

function searchCity(event) {
  if (event.charCode === 13) {
    event.preventDefault();
    let cityInput = document.querySelector("#search-city");
    let newCity = cityInput.value;
    let currentLocation = document.querySelector("#current-location");
    currentLocation.innerHTML = `${cityInput.value}`;
    cityInput.value = "";
    getSearchCityTemp(newCity);
  }
}

function getSearchCityTemp(newCity) {
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=${units}&appid=${apiKey}`;
  axios.get(apiURL).then(updateSearchCityCurrentWeather);
}

function updateSearchCityCurrentWeather(response) {
  console.log(response.data);
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

  humidity.innerHTML = `humidity: ${updateHumidity}%`;
  currentTemp.innerHTML = `${temperature}`;
  currentHigh.innerHTML = `H:${updateCurrentHigh}℉`;
  currentLow.innerHTML = `L:${updateCurrentLow}℉`;
  wind.innerHTML = `wind: ${updateWind} mph`;
  currentWeatherEmoji.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${updateCurrentWeatherEmoji}@2x.png`
  );
  currentWeatherDescription.innerHTML = `${updateCurrentWeatherDescription}`;
}

function displayForecast() {
  let forecastElement = document.querySelector(`#forecast`);
  let forecastHTML = "";
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(function (days) {
    forecastHTML =
      forecastHTML +
      `
    <div class="row-forecast">
      <div class="col weather-forecast-date">${days}</div>
      <div class="col weather-forecast-emoji">
        <img
          src="http://openweathermap.org/img/wn/10d@2x.png"
          alt=""
          width="42"
        />
      </div>
      <div class="col weather-forecast-high">95℉</div>
      <div class="col weather-forecast-low">73℉</div>
    </div>
  `;
  });

  forecastElement.innerHTML = forecastHTML;
}

displayForecast();

function convertToCelsius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector(`#current-temp`);
  let currentHigh = document.querySelector(`#current-high`);
  let currentLow = document.querySelector(`#current-low`);
  let currentCelsiusTemp = Math.round(
    (currentFahrenheitTemperature - 32) * (5 / 9)
  );
  let currentCelsiusHigh = Math.round((currentFahrenheitHigh - 32) * (5 / 9));
  let currentCelsiusLow = Math.round((currentFahrenheitLow - 32) * (5 / 9));
  currentTemp.innerHTML = `${currentCelsiusTemp}`;
  currentHigh.innerHTML = `H:${currentCelsiusHigh}℃`;
  currentLow.innerHTML = `L:${currentCelsiusLow}℃`;
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let currentTemp = document.querySelector(`#current-temp`);
  let currentHigh = document.querySelector(`#current-high`);
  let currentLow = document.querySelector(`#current-low`);
  let updateFahrenheitHigh = Math.round(currentFahrenheitHigh);
  let updateFahrenheitLow = Math.round(currentFahrenheitLow);

  currentTemp.innerHTML = Math.round(currentFahrenheitTemperature);
  currentHigh.innerHTML = `H:${updateFahrenheitHigh}℉`;
  currentLow.innerHTML = `L:${updateFahrenheitLow}℉`;
}
