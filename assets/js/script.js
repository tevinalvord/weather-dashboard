var searchFormEl = document.querySelector("#search-form");
var historyFormEl = document.querySelector("#history-form");
var searchHistoryEl = document.querySelector("#search-history");
var cityInputEl = document.querySelector("#search-city");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastWeatherEl = document.querySelector("#forecast-weather");
var index = 0;

var today = new Date();
var date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
var forecastDates = [
    (today.getMonth()+1) + "/" + (today.getDate()-1) + "/" + today.getFullYear(),
    (today.getMonth()+1) + "/" + (today.getDate()-2) + "/" + today.getFullYear(),
    (today.getMonth()+1) + "/" + (today.getDate()-3) + "/" + today.getFullYear(),
    (today.getMonth()+1) + "/" + (today.getDate()-4) + "/" + today.getFullYear(),
    (today.getMonth()+1) + "/" + (today.getDate()-5) + "/" + today.getFullYear(),
];
var unixTime = Math.floor(Date.now() / 1000);
var timeArray = [
    (unixTime - 86400),
    (unixTime - 172800),
    (unixTime - 259200),
    (unixTime - 345600),
    (unixTime - 432000),
];    

var fiveDayForecast = function() {
    var forecastTitleEl = document.createElement("h2");
    forecastTitleEl.textContent = "5-Day Forecast:";
    forecastTitleEl.classList = "forecast-title";
    forecastWeatherEl.appendChild(forecastTitleEl);
};

var forecastWeatherData = function(weatherData, forecastWeatherDataDiv) {
    var currentIcon = weatherData.current.weather[0].icon;

    var forecastWeatherDataEl = document.createElement("div");
    forecastWeatherDataEl.classList = "forecast-data-div";

    var forecastWeatherDate = document.createElement("p");
    forecastWeatherDate.textContent = forecastDates[index];
    forecastWeatherDate.classList = "forecast-date";
    forecastWeatherDataEl.appendChild(forecastWeatherDate);
    index++;


    var currentIconEl = document.createElement("img");
    currentIconEl.classList = "forecast-icon";
    currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
    forecastWeatherDataEl.appendChild(currentIconEl);

    var cityTemp = document.createElement("p");
    var currentTemp = weatherData.current.temp;
    cityTemp.textContent = "Temp: " + currentTemp + " °F";
    cityTemp.classList = "forecast-weather-info";
    forecastWeatherDataEl.appendChild(cityTemp);

    var cityWind = document.createElement("p");
    var currentWind = weatherData.current.wind_speed;
    cityWind.textContent = "Wind: " + currentWind + " MPH";
    cityWind.classList = "forecast-weather-info";
    forecastWeatherDataEl.appendChild(cityWind);

    var cityHumidity = document.createElement("p");
    var currentHumidity = weatherData.current.humidity;
    cityHumidity.textContent = "Humidity: " + currentHumidity + " %";
    cityHumidity.classList = "forecast-weather-info";
    forecastWeatherDataEl.appendChild(cityHumidity);

    forecastWeatherDataDiv.appendChild(forecastWeatherDataEl);
    forecastWeatherEl.appendChild(forecastWeatherDataDiv);
};

var currentWeatherData = function(weatherData, city) {
    var currentIcon = weatherData.current.weather[0].icon;
    currentWeatherEl.textContent = "";

    var currentWeatherDataEl = document.createElement("div");
    currentWeatherDataEl.classList = "weather-data-div";

    var cityNameEl = document.createElement("h1");
    var cityName = city;
    cityInputEl.value = "";

    var arr = cityName.split(" ")
    for (i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    };
    var cityNameCap = arr.join(" ");
    console.log(cityNameCap);
    cityNameEl.textContent = cityNameCap + " (" + date + ")";
    cityNameEl.classList = "current-title";
    currentWeatherDataEl.appendChild(cityNameEl);

    var currentIconEl = document.createElement("img");
    currentIconEl.classList = "current-icon";
    currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
    currentWeatherDataEl.appendChild(currentIconEl);

    var cityTemp = document.createElement("p");
    var currentTemp = weatherData.current.temp;
    cityTemp.textContent = "Temp: " + currentTemp + "°F";
    cityTemp.classList = "current-weather-info";
    currentWeatherDataEl.appendChild(cityTemp);

    var cityWind = document.createElement("p");
    var currentWind = weatherData.current.wind_speed;
    cityWind.textContent = "Wind: " + currentWind + " MPH";
    cityWind.classList = "current-weather-info";
    currentWeatherDataEl.appendChild(cityWind);

    var cityHumidity = document.createElement("p");
    var currentHumidity = weatherData.current.humidity;
    cityHumidity.textContent = "Humidity: " + currentHumidity + " %";
    cityHumidity.classList = "current-weather-info";
    currentWeatherDataEl.appendChild(cityHumidity);

    var cityUvIndex = document.createElement("p");
    var currentUvIndex = weatherData.current.uvi;
    cityUvIndex.innerHTML = "<span>UV Index: </span><span class='uv-index'>" + currentUvIndex + "</span>";
    cityUvIndex.classList = "current-weather-info";
    currentWeatherDataEl.appendChild(cityUvIndex);

    currentWeatherEl.classList.add("current-weather-border");
    currentWeatherEl.appendChild(currentWeatherDataEl);
};

var getAllWeatherData = function(lat, lon, city) {
    var apiUrlCurrent = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&units=imperial&appid=a7b19394c2679b970277cf97cefa084c";
    
    fetch(apiUrlCurrent).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                currentWeatherData(data, city);
            })
        } else {
            alert("Something went wrong. Try again.")
        }
    });

    fiveDayForecast();

    var forecastWeatherDataDiv = document.createElement("div");
    forecastWeatherDataDiv.classList = "forecast-data-wrapper";
    forecastWeatherEl.appendChild(forecastWeatherDataDiv);

    async function asyncCall() {
        for (i = 0; i < timeArray.length; i++) {
            var apiUrlForecast = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + timeArray[i] + "&units=imperial&appid=a7b19394c2679b970277cf97cefa084c";
        
            
            await fetch(apiUrlForecast).then(function(response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        forecastWeatherData(data, forecastWeatherDataDiv);
                    })
                } else {
                    alert("Something went wrong. Try again")
                }
            });
        };
    }
    asyncCall();
    index = 0;
};

var getCityGeo = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",us&limit=&appid=a7b19394c2679b970277cf97cefa084c";

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

var cityHistory = function(city) {
    searchHistoryEl.classList.add("search-history-border");

    // if ("button[button, provo]") {
    //     console.log("do nothing")
    // } else {
    //     var historyBtn = document.createElement("button")

    //     var arr = city.split(" ")
    //     for (i = 0; i < arr.length; i++) {
    //         arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    //     };
    //     var cityNameCap = arr.join(" ");
    //     historyBtn.textContent = cityNameCap;
    //     historyBtn.classList = "history-btn";
    //     historyBtn.setAttribute("button", city)
    //     historyBtn.id = "history-btn";
    
    //     historyFormEl.appendChild(historyBtn);
    // }

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

var historySearch = function(event) {
    event.preventDefault();

    var buttonClicked = event.target.getAttribute("button")

    if (buttonClicked) {
        var city = event.target.textContent;
        forecastWeatherEl.innerHTML = "";
    
        getCityGeo(city);
    }
};

var searchFormHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        forecastWeatherEl.innerHTML = "";
        getCityGeo(city);
        cityHistory(city);
    } else {
        alert("Please enter a city name");
    }
};

searchFormEl.addEventListener("submit", searchFormHandler);
historyFormEl.addEventListener("click", historySearch);