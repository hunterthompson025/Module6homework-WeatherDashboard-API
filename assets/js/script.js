const cityInputEl = document.querySelector('#city-input');
const topCardContainerEl = document.querySelector('#top-card-container');
const cardContainerEl = document.querySelector('#card-group');

//Function to submit cityName to trigger the API call
function handleCityFormSubmit(event) {
    event.preventDefault();

    const cityName = cityInputEl.value.trim();

    if (cityName) {
        //placeholder function that will call the API to return data
        getWeatherData(cityName);
        //Get cities from local storage
        let cities = JSON.parse(localStorage.getItem('cities')) || [];
        //push value into Array
        cities.push({ name: cityName });
        //store values in local storage
        localStorage.setItem('cities', JSON.stringify(cities));
        //clear the cityName input and remove the top card and card groups for next city
        cityInputEl.value = "";
        topCardContainerEl.innerHTML = "";
        cardContainerEl.innerHTML = "";
    } else {
        //alert if you do not enter a city
        alert('You need a city input value!');
    }
};

function getWeatherData(cityName) {
    //Make first API call to get latitude and longitude
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(geoData => {
            if (geoData.length > 0) {

                const { lat, lon } = geoData[0];
                //Make second API call to get weather data
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                    .then(response => response.json())
                    .then(weatherData => {
                        // Display weather data
                        if (weatherData) {

                            createCityButton(cityName);
                            // Create top card elements
                            const divTopCardEl = document.createElement('div');
                            const divTopCardBodyEl = document.createElement('div');
                            const cityNameEl = document.createElement('h2');
                            const dateTopCardEl = document.createElement('p');
                            const weatherIconEl = document.createElement('img');
                            const cityTempEl = document.createElement('p');
                            const cityWindEl = document.createElement('p');
                            const cityHumidityEl = document.createElement('p');
                            const dateTime = new Date(weatherData.dt * 1000);
                            const dateString = dateTime.toLocaleDateString();
                            const fiveDayHeaderEl = document.createElement('h3');

                            // Set text content and attributes
                            cityNameEl.textContent = `${weatherData.name}`;
                            dateTopCardEl.textContent = `(${dateString})`;
                            weatherIconEl.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
                            cityTempEl.textContent = `Temp: ${weatherData.main.temp} °F`;
                            cityWindEl.textContent = `Wind: ${weatherData.wind.speed} MPH`;
                            cityHumidityEl.textContent = `Humidity: ${weatherData.main.humidity} %`;
                            fiveDayHeaderEl.textContent = `5 Day Forecast: `;

                            // Set class names and styles
                            divTopCardEl.className = 'card top-card-box my-1';
                            divTopCardBodyEl.className = 'card-body top-card-body';
                            cityNameEl.className = 'card-title';
                            dateTopCardEl.className = 'card-text';
                            weatherIconEl.className = 'card-text';
                            cityTempEl.className = 'card-text';
                            cityWindEl.className = 'card-text';
                            cityHumidityEl.className = 'card-text';
                            fiveDayHeaderEl.className = 'forecast-header b,strong mb-3';
                            fiveDayHeaderEl.id = 'forecast-header';
                            cityNameEl.setAttribute("style", "display: flex; align-items: center;font-size: 30px");
                            dateTopCardEl.setAttribute("style", "align-items: center; margin-bottom: 0; margin-left: 10px");

                            // Append elements to DOM
                            topCardContainerEl.append(divTopCardEl);
                            divTopCardEl.append(divTopCardBodyEl);
                            divTopCardBodyEl.append(cityNameEl);
                            cityNameEl.append(dateTopCardEl);
                            cityNameEl.append(weatherIconEl);
                            divTopCardBodyEl.append(cityTempEl);
                            divTopCardBodyEl.append(cityWindEl);
                            divTopCardBodyEl.append(cityHumidityEl);
                            topCardContainerEl.append(fiveDayHeaderEl);

                            // Placeholder function to get the five day forecast after current weather data is fetched
                            getFiveDayForecast(cityName, apiKey);
                        } else {
                            alert("Weather data not found for the specified location.");
                        }
                    })
                    .catch(function (error) {
                        alert("Error fetching weather data:", error);
                    });
            } else {
                alert("City not found.");
            }
        })
        .catch(function (error) {
            alert("Error fetching geo data:", error);
        });
}