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

    function displayForecast(data) {
        forecastSection.innerHTML = ''; // Clear previous data
        for (let i = 0; i < 40; i += 8) { // Assuming forecast data is every 3 hours
            const forecastData = data.list[i];
            const forecastCard = createWeatherCard(forecastData);
            forecastSection.appendChild(forecastCard);
        }
    }

    function createWeatherCard(data, isCurrent = false) {
        const card = document.createElement('div');
        card.className = isCurrent ? 'current-weather' : 'forecast-card';
        
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

    function addToHistory(city) {
        if (!localStorage.getItem('weatherSearchHistory')?.includes(city)) {
            let history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
            history.unshift(city);
            localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
            updateHistoryList();
        }
    }

    function updateHistoryList() {
        historyList.innerHTML = ''; // Clear existing list
        const history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
        history.forEach(city => {
            const historyItem = document.createElement('button');
            historyItem.className = 'list-group-item list-group-item-action';
            historyItem.textContent = city;
            historyItem.onclick = () => fetchWeatherData(city);
            historyList.appendChild(historyItem);
        });
    }

    function displayError(message) {
        todaySection.innerHTML = `<div class="alert alert-danger" role="alert">${message}</div>`;
    }

    updateHistoryList();
});
