const API_KEY = "84b321c46d3a6860eed54bcf25472f6b"; // Get a free key at https://openweathermap.org/api

async function getWeather() {
    const city = document.getElementById("city").value.trim();
    const resultContainer = document.getElementById("result-container");

    if (city === "") {
        resultContainer.hidden = false;
        resultContainer.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }

    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        resultContainer.hidden = false;
        resultContainer.innerHTML = "<p>Fetching weather...</p>";

        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(WEATHER_URL),
            fetch(FORECAST_URL)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (weatherData.cod !== 200) {
            resultContainer.innerHTML = "City not found.";
            return;
        }

        setWeatherVideo(weatherData);

        resultContainer.innerHTML = "";
        const grid = document.createElement("div");
        grid.className = "weather-grid";

        const mainCard = document.createElement("div");
        mainCard.className = "weather-card main";
        mainCard.innerHTML = `
            <h3>${weatherData.name}, ${weatherData.sys.country}</h3>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png" alt="Weather icon">
            <p>${Math.round(weatherData.main.temp)} °C</p>
            <span>${capitalize(weatherData.weather[0].description)}</span>
        `;

        grid.appendChild(mainCard);

        const stats = [
            { title: "Feels Like", value: `${Math.round(weatherData.main.feels_like)} °C`, icon: "fa-solid fa-temperature-half" },
            { title: "Humidity", value: `${weatherData.main.humidity}%`, icon: "fa-solid fa-droplet" },
            { title: "Wind", value: `${weatherData.wind.speed} m/s`, icon: "fa-solid fa-wind" },
            { title: "Pressure", value: `${weatherData.main.pressure} hPa`, icon: "fa-solid fa-gauge-high" },
            { title: "Sunrise", value: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(), icon: "fa-solid fa-sun" },
            { title: "Sunset", value: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(), icon: "fa-solid fa-moon" }
        ];

        stats.forEach(stat => {
            grid.appendChild(createStatCard(stat.title, stat.value, stat.icon));
        });

        const forecastContainer = document.createElement("div");
        forecastContainer.className = "forecast-container";
        let dailyForecasts = [];

        if (forecastData && Array.isArray(forecastData.list)) {
            const forecastsByDate = {};

            forecastData.list.forEach(item => {
                const [date, time] = item.dt_txt.split(" ");
                const hour = parseInt(time);

                // Pick one representative reading per day (around midday)
                if (!forecastsByDate[date] && hour >= 11 && hour <= 14) {
                    forecastsByDate[date] = item;
                }
            });

            dailyForecasts = Object.values(forecastsByDate).slice(0, 5);
        } else {
            console.warn("Forecast data is missing or invalid");
        }

        if (dailyForecasts.length > 0) {
            dailyForecasts.forEach(forecast => {
                const card = document.createElement("div");
                card.className = "weather-card forecast-card";
                card.innerHTML = `
                    <h3>${new Date(forecast.dt * 1000).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</h3>
                    <img class="weather-icon" src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="Weather icon">
                    <p>${Math.round(forecast.main.temp)} °C</p>
                    <span>${capitalize(forecast.weather[0].description)}</span>
                `;

                forecastContainer.appendChild(card);
            });
        } else {
            const noData = document.createElement("p");
            noData.textContent = "No forecast available.";
            forecastContainer.appendChild(noData);
        }

        const appContainer = document.getElementById("app-container");
        const currentHeight = appContainer.offsetHeight;

        resultContainer.style.display = "block";
        resultContainer.style.opacity = 0;
        resultContainer.appendChild(grid);
        resultContainer.appendChild(forecastContainer);

        const targetHeight = appContainer.scrollHeight;
        appContainer.style.height = currentHeight + "px";

        requestAnimationFrame(() => {
            appContainer.style.transition = "height 0.6s ease";
            appContainer.style.height = targetHeight + "px";
            resultContainer.style.transition = "opacity 0.6s ease";
            resultContainer.style.opacity = 1;
        });

        setTimeout(() => {
            appContainer.style.height = "auto";
        }, 650);
    } catch (error) {
        console.error("Weather fetch failed", error);
        resultContainer.innerHTML = "<p>Failed to fetch weather. Try again later.</p>";
    }
}

async function getWeatherByLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords; 

            try {
                const GEO_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                const response = await fetch(GEO_URL);
                const data = await response.json();

                if (data.cod === 200) {
                    document.getElementById("city").value = data.name;
                    await getWeather();
                }
            } catch (error) {
                console.error("Geolocation weather failed", error);
            }
        },
        (error) => {
            console.error("Geolocation error: ", error);
        }, {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 600000
        }
    );
}

function setWeatherVideo(weatherData) {
    const condition = weatherData.weather[0].main.toLowerCase();
    const video = document.getElementById("bg-video");
    const body = document.body;

    let src;

    switch (condition) {
        case "clear":
            src = "assets/videos/clear.mp4";
            break;
        case "clouds":
            src = "assets/videos/clouds.mp4";
            break;
        case "rain":
        case "drizzle":
            src = "assets/videos/rain.mp4";
            break;
        case "thunderstorm":
            src = "assets/videos/thunderstorm.mp4";
            break;
        case "snow":
            src = "assets/videos/snow.mp4";
            break;
        case "mist":
        case "fog":
        case "haze":
        case "smoke":
        case "dust":
        case "sand":
        case "ash":
            src = "assets/videos/mist.mp4";
            break;
        default:
            return;
    }

    if (video.dataset.current === src) return;

    body.classList.add("video-active");

    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;

    video.style.opacity = 0;
    video.src = src;
    video.dataset.current = src;

    video.onerror = () => {
        console.warn(`Failed to load video: ${src}`);
        video.style.display = "none";
        body.classList.remove("video-active");
    };

    video.onloadeddata = () => {
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    video.style.opacity = 1;
                })
                .catch(err => {
                    console.warn("Mobile autoplay blocked:", err);
                });
        }
    };

    video.load();
}

function createStatCard(title, value, iconClass) {
    const card = document.createElement("div");
    card.className = "weather-card";
    card.innerHTML = `
        <h3>${title}</h3>
        <p>${value}</p>
        <i class="${iconClass}"></i>
    `;
    return card;
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

document.querySelector("#city").addEventListener("keydown", (e) => {
    if (e.key === "Enter") getWeather();
});

document.querySelector("#search-container button").addEventListener("click", getWeather);

window.addEventListener("load", getWeatherByLocation);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.error("SW registration failed", err));
  });
}
