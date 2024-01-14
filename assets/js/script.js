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