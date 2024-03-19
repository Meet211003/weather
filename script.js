let weather = {
    "apikey": "ec7c27931f310264b24d2fe83ac9f2cb",

    fetchWeather: function(city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apikey)
            .then((response) => response.json())
            .then((data) => this.displayWeather(data))
            .catch((error) => {
                console.error('Error fetching weather data:', error);
                alert('Failed to fetch weather data. Please try again.');
            });
    },

    fetchForecast: function(city) {
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + this.apikey)
            .then((response) => response.json())
            .then((data) => this.displayForecast(data))
            .catch((error) => {
                console.error('Error fetching forecast data:', error);
                alert('Failed to fetch forecast data. Please try again.');
            });
    },

    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        
        const weatherCard = document.querySelector(".weather");
        weatherCard.querySelector(".city").innerText = "Weather in " + name;
        weatherCard.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        weatherCard.querySelector(".description").innerText = description;
        weatherCard.querySelector(".temp").innerText = temp + "°C";
        weatherCard.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        weatherCard.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";

        weatherCard.classList.remove("loading");
        weatherCard.style.visibility = 'visible'; // Show weather card
    },

    displayForecast: function(data) {
        const forecastCardsContainer = document.querySelector(".forecast-cards");
        forecastCardsContainer.innerHTML = ''; // Clear previous forecast cards

        const forecasts = data.list.filter((item, index) => index % 8 === 0); // Get forecasts for every 24 hours (4 days)

        forecasts.forEach((forecast) => {
            const { dt_txt } = forecast;
            const { icon } = forecast.weather[0];
            const { temp } = forecast.main;

            const card = document.createElement("div");
            card.classList.add("forecast-card");
            card.innerHTML = `
                <h3>${this.formatDate(dt_txt)}</h3>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${forecast.weather[0].description}">
                <p>${temp}°C</p>
            `;
            forecastCardsContainer.appendChild(card);
        });
    },

    formatDate: function(dateTime) {
        const date = new Date(dateTime);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    search: function() {
        const searchInput = document.querySelector(".searchbar").value.trim();
        if (searchInput) {
            this.fetchWeather(searchInput);
            this.fetchForecast(searchInput);
        } else {
            alert('Please enter a city name.');
        }
    }
};

document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

document.querySelector(".searchbar").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        weather.search();
    }
});
