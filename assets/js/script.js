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