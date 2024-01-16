// Wait for the DOM to be fully loaded before executing the JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Get references to various HTML elements
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const historyList = document.getElementById('history');
    const todaySection = document.getElementById('today');
    const forecastSection = document.getElementById('forecast');
    const apiKey = 'd241fa07cbe7b4cf7ea61ba4661255da';

    // Add an event listener to the search form
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const city = searchInput.value.trim();
        if (city === "") {
            displayError('Please enter a city name.');
            return;
        }
        // Call the fetchWeatherData function to get weather data for the entered city
        fetchWeatherData(city);
    });

    // Function to fetch weather data from the OpenWeatherMap API
    function fetchWeatherData(city) {
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
        // Use Promise.all to fetch both current weather and forecast data in parallel
        Promise.all([
            fetch(weatherApiUrl).then(response => response.json()),
            fetch(forecastApiUrl).then(response => response.json()),
        ]).then(([currentWeatherData, forecastData]) => {
            // Display the current weather and forecast
            displayCurrentWeather(currentWeatherData);
            displayForecast(forecastData);
            // Add the city to the search history
            addToHistory(currentWeatherData.name);
        }).catch(() => {
            // Display an error message if there's an issue with fetching data
            displayError("Error fetching data. Please try again.");
        });
    }

    // Function to display the current weather
    function displayCurrentWeather(data) {
        todaySection.innerHTML = ''; // Clear previous data
        const weatherCard = createWeatherCard(data, true);
        todaySection.appendChild(weatherCard);
    }

    // Function to display the weather forecast
    function displayForecast(data) {
        forecastSection.innerHTML = ''; // Clear previous data
        for (let i = 0; i < 40; i += 8) { // Assuming forecast data is every 3 hours
            const forecastData = data.list[i];
            const forecastCard = createWeatherCard(forecastData);
            forecastSection.appendChild(forecastCard);
        }
    }

    // Function to create a weather card
    function createWeatherCard(data, isCurrent = false) {
        const card = document.createElement('div');
        card.className = isCurrent ? 'current-weather ' : 'forecast-card five-day-card';
        
        const date = new Date(data.dt * 1000).toLocaleDateString('en-GB');
        const temp = data.main.temp;
        const icon = data.weather[0].icon;
        const description = data.weather[0].description;
        
        card.innerHTML = `
            <h3>${isCurrent ? data.name + ' (' + date + ')' : date}</h3>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}" />
            <p>Temp: ${temp} °C</p>
            ${isCurrent ? `<p>Wind: ${data.wind.speed} KPH</p>` : ''}
            <p>Humidity: ${data.main.humidity}%</p>
        `;
        return card;
    }

    // Function to add a city to the search history
    function addToHistory(city) {
        if (!localStorage.getItem('weatherSearchHistory')?.includes(city)) {
            let history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
            history.unshift(city);
            localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
            updateHistoryList();
        }
    }

    // Function to update the search history list in the UI
    function updateHistoryList() {
        historyList.innerHTML = ''; // Clear existing list
        const history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
        history.forEach(city => {
            const historyItem = document.createElement('button');
            historyItem.className = 'history-btn';
            historyItem.textContent = city;
            historyItem.onclick = () => fetchWeatherData(city);
            historyList.appendChild(historyItem);
        });
    }

    // Function to display an error message
    function displayError(message) {
        todaySection.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
    }

    // Update the search history list on page load
    updateHistoryList();
});
