# 🌦️ Weather App

A clean, modern weather application built with **HTML, CSS, and vanilla JavaScript** that fetches real-time weather data using the **Fetch API** and the **OpenWeatherMap** service. It displays current conditions, a 5-day forecast, dynamic video backgrounds based on the weather, and works offline as an installable **Progressive Web App (PWA)**.

> ICT project

🔗 **[Live Demo](https://abdullah-5j.github.io/weather-app/)**

---

## ✨ Features

- **City-based search** — look up current weather for any city in the world.
- **Current conditions** — temperature, "feels like", humidity, wind speed, pressure, sunrise & sunset.
- **5-day forecast** — daily temperature and conditions at a glance.
- **Location-based weather** — automatically detects your location on load (with permission).
- **Dynamic video backgrounds** — the background changes to match the weather (clear, clouds, rain, snow, thunderstorm, mist).
- **Progressive Web App (PWA)** — installable on desktop and mobile, with offline caching via a Service Worker.
- **Responsive design** — adapts cleanly from desktop to mobile.
- **Graceful error handling** — clear messages for invalid cities and network issues.

---

## 📸 Screenshot

![Weather App screenshot](assets/images/image.png)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, glassmorphism UI, responsive grid layout |
| **JavaScript (ES6+)** | Core logic, async/await, DOM manipulation |
| **Fetch API** | Asynchronous HTTP requests to the weather service |
| **OpenWeatherMap API** | Real-time weather and forecast data |
| **Web App Manifest** | PWA metadata for installation |
| **Service Worker** | Asset caching and offline support |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/abdullah-5j/weather-app.git
cd weather-app
```

### 2. Get a free API key

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api).
2. Copy your API key from your account dashboard.

### 3. Add your API key

Open `assets/scripts/script.js` and replace the placeholder on the first line:

```js
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
```

with your actual key:

```js
const API_KEY = "your_real_key_here";
```

### 4. Run the app

Because the app uses a Service Worker and the Fetch API, it should be served over HTTP (not opened directly as a `file://`). The easiest way is a local server:

```bash
# Python 3
python -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

> **Tip:** If you use VS Code, the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension works great too.

---

## 📂 Project Structure
