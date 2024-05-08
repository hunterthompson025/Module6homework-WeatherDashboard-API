const cityFormEl = document.querySelector('#city-form');
const cityInputEl = document.querySelector('#city-input');
const cityNameEl = document.querySelector('#city-name');
const topCardContainerEl = document.querySelector('#top-card-container');
const cardContainerEl = document.querySelector('#card-group');
const apiKey = 'd931af5bcfa36b258754c8f89f606974';

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

                            // Call the five day forecast function after current weather data is fetched to organize data correctly on html page
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

//function to get five day forecast
function getFiveDayForecast(cityName, apiKey) {
    //API gets data 8 times a day. Setting a limit of 40 allows for 5 days of complete data
    const limit = 40;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial&cnt=${limit}`;

    //API call
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            //Create card group elements
            console.log(data);
            for (let i = 7; i < data.list.length; i += 8) {
                const divCardEl = document.createElement('div');
                const divCardBodyEl = document.createElement('div');
                const dateEl = document.createElement('h3');
                const weatherIconEl = document.createElement('img');
                const cityTempEl = document.createElement('p');
                const cityWindEl = document.createElement('p');
                const cityHumidityEl = document.createElement('p');
                const dateTime = new Date(data.list[i].dt_txt);
                const dateString = dateTime.toLocaleDateString();
                // Set text content
                dateEl.textContent = `${dateString}`;
                weatherIconEl.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
                cityTempEl.textContent = `Temp: ${data.list[i].main.temp} °F`;
                cityWindEl.textContent = `Wind: ${data.list[i].wind.speed} MPH`;
                cityHumidityEl.textContent = `Humidity: ${data.list[i].main.humidity}%`;
                // Set class name
                divCardEl.className = 'card mx-3 border-start';
                divCardBodyEl.className = 'card-body';
                dateEl.className = 'card-title';
                weatherIconEl.className = 'card-text';
                cityTempEl.className = 'card-text';
                cityWindEl.className = 'card-text';
                cityHumidityEl.className = 'card-text';
                //Append elemts to DOM
                topCardContainerEl.append(cardContainerEl);
                cardContainerEl.append(divCardEl);
                divCardEl.append(divCardBodyEl);
                divCardBodyEl.append(dateEl);
                divCardBodyEl.append(weatherIconEl);
                divCardBodyEl.append(cityTempEl);
                divCardBodyEl.append(cityWindEl);
                divCardBodyEl.append(cityHumidityEl);
            }
        })
        .catch(function (error) {
            alert('There was a problem with the fetch operation:', error);
        });
}

