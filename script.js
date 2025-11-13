const API_KEY = 'f8bda17891d7e015fd43196da0c3e067';

async function getWeather() {
  const city = document.getElementById('city-input').value;

  if (!city) {
    alert('Please enter a city name!');
    return;
  }

  const weatherContainer = document.getElementById('weather-container');
  const tempDiv = document.getElementById('temp-div');
  const weatherInfo = document.getElementById('weather-info');
  const hourlyForecast = document.getElementById('hourly-forecast');
  const weatherIcon = document.getElementById('weather-icon');

  tempDiv.textContent = '';
  weatherInfo.textContent = '';
  hourlyForecast.textContent = '';
  weatherIcon.src = '';

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      alert('City not found!');
      return;
    }

    const temp = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const iconCode = weatherData.weather[0].icon;

    // Update current weather
    tempDiv.textContent = `Temperature: ${temp}°C`;
    weatherInfo.textContent = `Description: ${description}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastResponse.json();

    hourlyForecast.innerHTML = '<h3>Hourly Forecast</h3>';
    forecastData.list.slice(0, 8).forEach((forecast) => {
      const time = new Date(forecast.dt * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const temp = forecast.main.temp;
      const icon = forecast.weather[0].icon;
      const description = forecast.weather[0].description;

      const forecastDiv = document.createElement('div');
      forecastDiv.className = 'forecast-item';
      forecastDiv.innerHTML = `
        <p>${time}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p>${temp}°C</p>
        <p>${description}</p>
      `;
      hourlyForecast.appendChild(forecastDiv);
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather data. Please try again later.');
  }
}

