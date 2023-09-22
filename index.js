const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

search.addEventListener("click", () => {
  const APIKey = "9c6d14c567c55a08276f0996926608eb";
  const city = document.querySelector(".search-box input").value;

  if (city === "") return;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      if (json.cod === "404") {
        container.style.height = "400px";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fadeIn");
        return;
      }

      error404.style.display = "none";
      error404.classList.remove("fadeIn");

      const latitude = json.coord.lat;
      const longitude = json.coord.lon;

      const image = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const highTemp = document.querySelector(".weather-box .high span");
      const lowTemp = document.querySelector(".weather-box .low span");
      const realFeel = document.querySelector(
        ".weather-details .real-feel span"
      );
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span"
      );
      const wind = document.querySelector(".weather-details .wind span");

      switch (json.weather[0].main) {
        case "Clear":
          image.src = "images/clear.png";
          break;

        case "Rain":
          image.src = "images/rain.png";
          break;

        case "Snow":
          image.src = "images/snow.png";
          break;

        case "Clouds":
          image.src = "images/cloud.png";
          break;

        case "Haze":
          image.src = "images/mist.png";
          break;

        default:
          image.src = "";
      }

      temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
      highTemp.innerHTML = `${parseInt(json.main.temp_max)}<span>°C</span>`;
      lowTemp.innerHTML = `${parseInt(json.main.temp_min)}<span>°C</span>`;
      realFeel.innerHTML = `${parseInt(json.main.feels_like)}<span>°C</span>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

      weatherBox.style.display = "";
      weatherDetails.style.display = "";
      weatherBox.classList.add("fadeIn");
      weatherDetails.classList.add("fadeIn");
      container.style.height = "590px";
    });

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      const hourlyTemps = json.list.slice(0, 24).map((item) => item.main.temp); // Take only the first 8 readings

      const ctx = document.getElementById("hourlyChart").getContext("2d");

      // var myChart;
      // myChart.destroy();

      new Chart(ctx, {
        type: "line",
        data: {
          labels: hourlyTemps.map((_, i) => i * 3), // X-axis labels (hours)
          datasets: [
            {
              label: "Temperature (°C)",
              data: hourlyTemps, // Y-axis data
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
              pointRadius: 0,
              borderWidth: 4,
            },
          ],
        },
        options: {
          plugins: {
            colors: {
              enabled: true,
            },
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              title: {
                display: true,
                text: "Hour",
              },
            },
            y: {
              grid: {
                display: false,
              },
              title: {
                display: true,
                text: "Temperature (°C)",
              },
            },
          },
        },
      });
    })
    .catch((error) => console.error("Error:", error));
});
