var searchFormEl = document.querySelector("#search-form");
var historyFormEl = document.querySelector("#history-form");
var searchHistoryEl = document.querySelector("#search-history");
var cityInputEl = document.querySelector("#search-city");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastWeatherEl = document.querySelector("#forecast-weather");
var allSearchEl = document.querySelector("#all-search");
var deleteBtnEl = document.querySelector("#delete-btn-div");
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

// var fiveDayForecast = function() {
//     var forecastTitleEl = document.createElement("h2");
//     forecastTitleEl.textContent = "5-Day Forecast:";
//     forecastTitleEl.classList = "forecast-title";
//     forecastWeatherEl.appendChild(forecastTitleEl);
// };

var forecastWeatherData = function(weatherData) {
    var forecastTitleEl = document.createElement("h2");
    forecastTitleEl.textContent = "5-Day Forecast:";
    forecastTitleEl.classList = "forecast-title";
    forecastWeatherEl.appendChild(forecastTitleEl);

    var forecastWeatherDataDiv = document.createElement("div");
    forecastWeatherDataDiv.classList = "forecast-data-wrapper";
    forecastWeatherEl.appendChild(forecastWeatherDataDiv);

    for (i = 0; i < timeArray.length; i++) {
        var forecastWeatherDataEl = document.createElement("div");
        forecastWeatherDataEl.classList = "forecast-data-div";

        var forecastWeatherDate = document.createElement("p");
        forecastWeatherDate.textContent = forecastDates[index];
        forecastWeatherDate.classList = "forecast-date";
        forecastWeatherDataEl.appendChild(forecastWeatherDate);
        index++;

        var currentIcon = weatherData.daily[(i + 1)].weather[0].icon;
        var currentIconEl = document.createElement("img");
        currentIconEl.classList = "forecast-icon";
        currentIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");
        forecastWeatherDataEl.appendChild(currentIconEl);

        var cityTemp = document.createElement("p");
        var currentTemp = weatherData.daily[(i + 1)].temp.day;
        cityTemp.textContent = "Temp: " + currentTemp + " °F";
        cityTemp.classList = "forecast-weather-info";
        forecastWeatherDataEl.appendChild(cityTemp);

        var cityWind = document.createElement("p");
        var currentWind = weatherData.daily[(i + 1)].wind_speed;
        cityWind.textContent = "Wind: " + currentWind + " MPH";
        cityWind.classList = "forecast-weather-info";
        forecastWeatherDataEl.appendChild(cityWind);

        var cityHumidity = document.createElement("p");
        var currentHumidity = weatherData.daily[(i + 1)].humidity;
        cityHumidity.textContent = "Humidity: " + currentHumidity + " %";
        cityHumidity.classList = "forecast-weather-info";
        forecastWeatherDataEl.appendChild(cityHumidity);

        forecastWeatherDataDiv.appendChild(forecastWeatherDataEl);
        forecastWeatherEl.appendChild(forecastWeatherDataDiv);
    };
};

var currentWeatherData = function(weatherData, city) {
    console.log(weatherData)
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

// var test =  function(weatherInfo) {
//     return `
//         <div>${weatherInfo.temp}
//         </div>`;
// }

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

    // for (i = 0; i < timeArray.length; i++) {
    //     var apiUrlForecast = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + lon + "&dt=" + timeArray[i] + "&units=imperial&appid=3bc1242a5c5f806c1f576e32c339b00b";
    
        
    //     fetch(apiUrlForecast).then(function(response) {
    //         if (response.ok) {
    //             response.json().then(function(data) {
    //                 forecastWeatherData(data, forecastWeatherDataDiv);
    //             })
    //         } else {
    //             alert("Something went wrong. Try again")
    //         }
    //     });
    // };
    index = 0;
};

var getCityGeo = function(city) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",us&limit=&appid=3bc1242a5c5f806c1f576e32c339b00b";

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

    // var deleteHistoryBtn = document.createElement("button");
    // deleteHistoryBtn.textContent = "Clear search history"
    // deleteHistoryBtn.classList = "delete-btn";
    // allSearchEl.appendChild(deleteHistoryBtn);


    var city2 = city.toLowerCase();
    cityArr.push(city2);
    saveCityHistory();
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

var addToCityArr = function(city) {
        if (cityArr.indexOf(city) === -1) {
            cityHistory(city);
        }
};

var searchFormHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.toLowerCase().trim();

    if (city) {
        forecastWeatherEl.innerHTML = "";

        if (cityArr.length === 0) {
            createDeleteBtn();
        }

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