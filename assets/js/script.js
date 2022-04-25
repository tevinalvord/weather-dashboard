var formEl = document.querySelector("#form");
var cityInputEl = document.querySelector("#search-city");
var currentWeatherEl = document.querySelector("#current-weather");

var today = new Date();
var date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
var unixTime = Math.floor(Date.now() / 1000);
var timeArray = [
    (unixTime - 86400),
    (unixTime - 172800),
    (unixTime - 259200),
    (unixTime - 345600),
    (unixTime - 432000)
];    
console.log(timeArray);
// console.log(timeArray[0],timeArray[1],timeArray[2],timeArray[3],timeArray[4],);

var displayCurrentWeatherData = function(weatherData) {


};

var forecastWeatherData = function(weatherData) {



    console.log(weatherData)
};

var currentWeatherData = function(weatherData) {
    var currentIcon = weatherData.current.weather[0].icon;
    currentWeatherEl.textContent = "";    

    var weatherDataEl = document.createElement("div");
    weatherDataEl.classList = "weather-data-div";

    var cityNameEl = document.createElement("h1");
    var cityName = cityInputEl.value;
    cityInputEl.value = "";
    cityNameEl.textContent = cityName[0].toUpperCase() + cityName.substring(1) + " (" + date + ")";
    cityNameEl.classList = "section-title";
    var currentIconEl = document.createElement("img");
    currentIconEl.classList = "current-icon"
    currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
    cityNameEl.appendChild(currentIconEl);
    weatherDataEl.appendChild(cityNameEl);

    var cityTemp = document.createElement("p");
    var currentTemp = weatherData.current.temp;
    cityTemp.textContent = "Temp: " + currentTemp + "°F";
    cityTemp.classList = "current-weather-info";
    weatherDataEl.appendChild(cityTemp);

    var cityWind = document.createElement("p");
    var currentWind = weatherData.current.wind_speed;
    cityWind.textContent = "Wind: " + currentWind + " MPH";
    cityWind.classList = "current-weather-info";
    weatherDataEl.appendChild(cityWind);

    var cityHumidity = document.createElement("p");
    var currentHumidity = weatherData.current.humidity;
    cityHumidity.textContent = "Humidity: " + currentHumidity + " %";
    cityHumidity.classList = "current-weather-info";
    weatherDataEl.appendChild(cityHumidity);

    var cityUvIndex = document.createElement("p");
    var currentUvIndex = weatherData.current.uvi;
    // cityUvIndex.textContent = "UV Index: " + currentUvIndex;
    cityUvIndex.innerHTML = "<span>UV Index: </span><span class='uv-index'>" + currentUvIndex + "</span>"
    cityUvIndex.classList = "current-weather-info";
    weatherDataEl.appendChild(cityUvIndex);

    currentWeatherEl.classList.add("current-weather-border");
    currentWeatherEl.appendChild(weatherDataEl);
    // console.log(weatherData);
};

var getAllWeatherData = function(lat, lon) {
    var apiUrlCurrent = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&units=imperial&appid=0edbb4eebb59bb25285ea86cab81a271"
    fetch(apiUrlCurrent).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                currentWeatherData(data);
            })
        } else {
            alert("Something went wrong. Try again.")
        }
    });

    for (i = 0; i < timeArray.length; i++) {
        var apiUrlForecast = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + timeArray[i] + "&units=imperial&appid=0edbb4eebb59bb25285ea86cab81a271"

        fetch(apiUrlForecast).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    forecastWeatherData(data);
                })
            } else {
                alert("Something went wrong. Try again")
            }
        });
    };

    // fetch(apiUrlForecast).then(function(response) {
    //     console.log(response);
    //     if (response.ok) {
    //         response.json().then(function(data) {
    //             forecastWeatherData(data);
    //         })
    //     } else {
    //         alert("Something went wrong. Try again")
    //     }
    // });
};

var getCityGeo = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",us&limit=&appid=0edbb4eebb59bb25285ea86cab81a271";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                getAllWeatherData(lat, lon);
            })
        } else {
            alert("Something went wrong. Try again.");
        }
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getCityGeo(city);
    } else {
        alert("Please enter a city name");
    }
};

formEl.addEventListener("submit", formSubmitHandler);