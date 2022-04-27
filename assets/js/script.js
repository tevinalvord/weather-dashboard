var searchFormEl = document.querySelector("#search-form");
var historyFormEl = document.querySelector("#history-form");
var searchHistoryEl = document.querySelector("#search-history");
var cityInputEl = document.querySelector("#search-city");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastWeatherEl = document.querySelector("#forecast-weather");
var allSearchEl = document.querySelector("#all-search");
var allWeatherEl = document.querySelector("#all-weather");
var deleteBtnEl = document.querySelector("#delete-btn-div");
var mainContainerEl = document.querySelector("#main-container");
var index = 0;
var cityArr = [];

var today = new Date();
var date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
var forecastDates = [
    (today.getMonth()+1) + "/" + (today.getDate()+1) + "/" + today.getFullYear(),
    (today.getMonth()+1) + "/" + (today.getDate()+2) + "/" + today.getFullYear(),
    (today.getMonth()+1) + "/" + (today.getDate()+3) + "/" + today.getFullYear(),
    (today.getMonth()+1) + "/" + (today.getDate()+4) + "/" + today.getFullYear(),
    (today.getMonth()+1) + "/" + (today.getDate()+5) + "/" + today.getFullYear(),
];

var unixTime = Math.floor(Date.now() / 1000);
var timeArray = [
    (unixTime + 86400),
    (unixTime + 172800),
    (unixTime + 259200),
    (unixTime + 345600),
    (unixTime + 432000),
];    

var forecastWeatherData = function(weatherData) {
    for (i = 1; i < 6; i++) {
        document.getElementById("forecast-date-" + [i]).textContent = forecastDates[index];
        index++;

        var currentIcon = weatherData.daily[i].weather[0].icon;
        document.getElementById("forecast-icon-" + [i]).setAttribute("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");

        var currentTemp = weatherData.daily[i].temp.day;
        document.getElementById("forecast-temp-" + [i]).textContent = "Temp: " + currentTemp + " °F";

        var currentWind = weatherData.daily[i].wind_speed;
        document.getElementById("forecast-wind-" + [i]).textContent = "Wind: " + currentWind + " MPH";

        var currentHumidity = weatherData.daily[i].humidity;
        document.getElementById("forecast-humidity-" + [i]).textContent = "Humidity: " + currentHumidity + " %";
    };
};

var currentWeatherData = function(weatherData, city) {
    currentWeatherEl.classList.add("current-weather-border")

    var cityName = city;
    cityInputEl.value = "";

    var arr = cityName.split(" ")
    for (i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    };
    var cityNameCap = arr.join(" ");
    document.getElementById("current-title").textContent = cityNameCap + " (" + date + ")";

    var currentIconEl = document.getElementById("current-icon");
    var currentIcon = weatherData.current.weather[0].icon;
    currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");

    var currentTemp = weatherData.current.temp;
    document.getElementById("current-temp").textContent = "Temp: " + currentTemp + "°F";

    var currentWind = weatherData.current.wind_speed;
    document.getElementById("current-wind").textContent = "Wind: " + currentWind + " MPH";

    var currentHumidity = weatherData.current.humidity;
    document.getElementById("current-humidity").textContent = "Humidity: " + currentHumidity + " %";

    var currentUvIndex = weatherData.current.uvi;
    document.getElementById("current-uv-text").textContent = "UV Index: ";
    document.getElementById("current-uv").textContent = currentUvIndex;
    document.getElementById("current-uv").classList = "uv-index";
};

var getAllWeatherData = function(lat, lon, city) {
    var apiUrlCurrent = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&units=imperial&appid=3bc1242a5c5f806c1f576e32c339b00b";
    
    fetch(apiUrlCurrent).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                currentWeatherData(data, city);
                forecastWeatherData(data)
            })
        } else {
            alert("Something went wrong. Try again.")
        }
    });
    index = 0;
};

var getCityGeo = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",us&limit=&appid=3bc1242a5c5f806c1f576e32c339b00b";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                getAllWeatherData(lat, lon, city);
            })
        } else {
            alert("Something went wrong. Try again.");
        }
    });
};

var createDeleteBtn = function() {
    var deleteHistoryBtn = document.createElement("button");
    deleteHistoryBtn.textContent = "Clear search history"
    deleteHistoryBtn.id = "delete-btn";
    deleteHistoryBtn.classList = "delete-btn";
    deleteHistoryBtn.setAttribute("deletebtn", "delete-Btn")
    deleteBtnEl.appendChild(deleteHistoryBtn);
};

var deleteBtn = function(event) {
    event.preventDefault();

    var buttonClicked = event.target.getAttribute("deleteBtn");

    if (buttonClicked) {
        localStorage.clear();
        location.reload();
    }
};

var loadCityHistory = function() {
    cityArr = localStorage.getItem("cityArr");
    if (cityArr === null) {
        cityArr = [];
        return false;
    }

    cityArr = JSON.parse(cityArr)

    for (e = 0; e < cityArr.length; e++) {
        searchHistoryEl.classList.add("search-history-border");
        var city = cityArr[e];
        
        var historyBtn = document.createElement("button")

        var arr = city.split(" ")
        for (i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        };
        var cityNameCap = arr.join(" ");
        historyBtn.textContent = cityNameCap;
        historyBtn.classList = "history-btn";
        historyBtn.setAttribute("button", city)
        historyBtn.id = "history-btn";
    
        historyFormEl.appendChild(historyBtn);
    };
    createDeleteBtn();
};

var saveCityHistory = function() {
    localStorage.setItem("cityArr", JSON.stringify(cityArr));
};

var cityHistory = function(city) {
    searchHistoryEl.classList.add("search-history-border");

    var historyBtn = document.createElement("button")

    var arr = city.split(" ")
    for (i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    };
    var cityNameCap = arr.join(" ");
    historyBtn.textContent = cityNameCap;
    historyBtn.classList = "history-btn";
    historyBtn.setAttribute("button", city)
    historyBtn.id = "history-btn";

    historyFormEl.appendChild(historyBtn);

    var city2 = city.toLowerCase();
    cityArr.push(city2);
    saveCityHistory();
};

var historySearch = function(event) {
    event.preventDefault();

    mainContainerEl.classList.add("flex-end-main");
    allWeatherEl.classList.add("show-all-weather")

    var buttonClicked = event.target.getAttribute("button")

    if (buttonClicked) {
        var city = event.target.textContent;    
        getCityGeo(city);
    }
};

var addToCityArr = function(city) {
        if (cityArr.indexOf(city) === -1) {
            cityHistory(city);
        }
};

var searchFormHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.toLowerCase().trim();

    if (city) {

        if (cityArr.length === 0) {
            createDeleteBtn();
        }
        
        mainContainerEl.classList.add("flex-end-main");
        allWeatherEl.classList.add("show-all-weather")
        getCityGeo(city);
        addToCityArr(city);
    } else {
        alert("Please enter a city name");
    }
};

loadCityHistory();

searchFormEl.addEventListener("submit", searchFormHandler);
historyFormEl.addEventListener("click", historySearch);
deleteBtnEl.addEventListener("click", deleteBtn);