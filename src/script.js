let currentData = new Date();
let currentTime = document.querySelector("#current-time");
let currentDate = document.querySelector("#current-date");
let form = document.querySelector("#search-city-button");
let celsiusLink = document.querySelector("#celsius-link");
let apiKey = "f1b97e6818bf3a43bc9a1319c9ff238a";
let locationButton = document.querySelector("#location-button");
let units = `imperial`;

locationButton.addEventListener("click", findLocation);
celsiusLink.addEventListener("click", convertToCelsius);
form.addEventListener("keypress", searchCity);
currentDate.innerText = updateDate(currentData);
currentTime.innerText = updateTime(currentData);

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

function findLocation(event) {
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
  currentCity.innerHTML = `${newCity}`;
  let currentCity = document.querySelector(`#current-location`);
}

function updateCurrentWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector(`#current-temp`);
  let currentWeatherEmoji = document.querySelector(`#current-weather-emoji`);
  let updateCurrentWeatherEmoji = response.data.weather[0].icon;
  let currentWeatherDescription = document.querySelector(
    `#current-weather-description`
  );
  let updateCurrentWeatherDescription = response.data.weather[0].description;

  currentTemp.innerHTML = `${temperature}℉`;
  currentWeatherEmoji.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${updateCurrentWeatherEmoji}@2x.png`
  );
  currentWeatherDescription.setAttribute(
    "alt",
    `http://openweathermap.org/img/wn/${updateCurrentWeatherDescription}@2x.png`
  );
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
  let temperature = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector(`#current-temp`);
  let currentWeatherEmoji = document.querySelector(`#current-weather-emoji`);
  let updateCurrentWeatherEmoji = response.data.weather[0].icon;
  let currentWeatherDescription = document.querySelector(
    `#current-weather-description`
  );
  let updateCurrentWeatherDescription = response.data.weather[0].description;

  currentTemp.innerHTML = `${temperature}℉`;
  currentWeatherEmoji.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${updateCurrentWeatherEmoji}@2x.png`
  );
  currentWeatherDescription.innerHTML = `${updateCurrentWeatherDescription}`;
}

function convertToCelsius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = "24 ℃";
}
