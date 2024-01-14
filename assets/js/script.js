document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const historyList = document.getElementById('history');
    const todaySection = document.getElementById('today');
    const forecastSection = document.getElementById('forecast');
    const apiKey = 'd241fa07cbe7b4cf7ea61ba4661255da';

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const city = searchInput.value.trim();
        if (city === "") {
            displayError('Please enter a city name.');
            return;
        }
        fetchWeatherData(city);
    });

    function fetchWeatherData(city) {
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
        Promise.all([
            fetch(weatherApiUrl).then(response => response.json()),
            fetch(forecastApiUrl).then(response => response.json()),
        ]).then(([currentWeatherData, forecastData]) => {
            displayCurrentWeather(currentWeatherData);
            displayForecast(forecastData);
            addToHistory(city);
        }).catch(() => {
            displayError("Error fetching data. Please try again.");
        });
    }

    function displayCurrentWeather(data) {
        todaySection.innerHTML = ''; // Clear previous data
        const weatherCard = createWeatherCard(data, true);
        todaySection.appendChild(weatherCard);
    }