// var currentWeatherData = function(lat, lon) {
//     var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=0edbb4eebb59bb25285ea86cab81a271"

//     fetch(apiUrl);
// }

// currentWeatherData(40, -111);

// var getCityLatLon = function(city, state, country) {
//     var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + "," + country + "&limit=&appid=0edbb4eebb59bb25285ea86cab81a271";

//     fetch(apiUrl).then(function(response) {
//         if (response.ok) {
//             response.json().then(function(data) {
//                 var lat = data[0].lat;
//                 var lon = data[0].lon;
//                 currentWeatherData(lat, lon);
//             })
//         } else {
//             alert("Incorrect city, state, or country input");
//         }
//     });
// };

// getCityLatLon("provo", "utah", "us")

var formEl = document.querySelector("#form");
var cityInputEl = document.querySelector("#search-city");
var weatherInfoEL = document.querySelector("#weather-info");

var displayWeatherData = function(weatherData) {
    var currentTemp = weatherData.current.temp;

    var weatherDataEl = document.createElement("div");
    weatherDataEl.classList = "weather-data-div";

    var cityNameEl = document.createElement("h1");
    cityNameEl.textContent = cityInputEl.value;
    weatherDataEl.appendChild(cityNameEl);

    var cityTemp = document.createElement("p");
    cityTemp.textContent = "Temp:" + currentTemp;
    weatherDataEl.appendChild(cityTemp);

    weatherInfoEL.appendChild(weatherDataEl);


    console.log(weatherData);
};

var currentWeatherData = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&units=imperial&appid=0edbb4eebb59bb25285ea86cab81a271"

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayWeatherData(data);
            })
        } else {
            alert("Something went wrong. Try again.")
        }
    });
};

var getCityGeo = function(city) {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",us&limit=&appid=0edbb4eebb59bb25285ea86cab81a271";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                currentWeatherData(lat, lon);
            })
        } else {
            alert("Something went wrong. Try again.");
        }
    });
};

// testing
// getCityGeo("Provo");

var formSubmitHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getCityGeo(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city name");
    }
};

formEl.addEventListener("submit", formSubmitHandler);