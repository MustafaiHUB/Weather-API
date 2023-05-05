class View {
    weatherData;

    // Left side Selectors
    searchBar = document.getElementById('search-input');
    locationBtn = document.querySelector('.location-btn');
    mainImg = document.querySelector('.main-img');
    temperatureStatus = document.querySelector('.temperature-status');
    day = document.querySelector('.day');
    time = document.querySelector('.time');
    condition = document.querySelector('.condition');
    conditionImg = document.querySelector('.condition-img');
    locationImg = document.querySelector('.location-img');
    locationName = document.querySelector('.location-name');

    // Right side Selectors
    weekBtn = document.querySelector('.week-btn');
    todayBtn = document.querySelector('.today-btn');
    weekStatus = document.querySelector('.week-status');
    todayStatus = document.querySelector('.today-status');
    tempCF = document.querySelector('.temp-c-f');
    celsius = document.querySelector('.celsius');
    fehrenhite = document.querySelector('.fehrenhite');
    logo = document.querySelector('.logo');
    weekDay = document.querySelector('.week-day');
    dayName = document.querySelector('.day-name');
    statusDayImg = document.querySelector('.status-day-img');
    minTemp = document.querySelector('.min-temp');
    maxTemp = document.querySelector('.max-temp');

    // Day selectors
    uv = document.querySelector('.uv');
    uvStatus = document.querySelector('.uv-status');
    windSpeed = document.querySelector('.wind-speed');
    windDir = document.querySelector('.wind-dir');
    windDirctionDay = document.querySelector('.wind-dir-day');
    sunriseTime = document.querySelector('.sunrise-time');
    sunsetTime = document.querySelector('.sunset-time');
    humidity = document.querySelector('.humidity');
    humidityStatus = document.querySelector('.humidity-status');
    visibility = document.querySelector('.visibility');
    visibilityStatus = document.querySelector('.visibility-status');
    airQuality = document.querySelector('.air-quality');
    airQualityStatus = document.querySelector('.air-quality-status');

    // Theme selectors
    themeBtn = document.querySelector('.theme-btn');
    moon = document.querySelector('.moon');
    sun = document.querySelector('.sun');

    // Functions
    constructor() {
        this.todayBtn.addEventListener('click', this._addHandlerTodayStatus.bind(this));
        this.weekBtn.addEventListener('click', this._addHandlerWeekStatus.bind(this));
        this.weekStatus.addEventListener('click', this._addHandlerDayStatus.bind(this));
        this.tempCF.addEventListener('click', this._addHandlerTempCalculated.bind(this));
        this.themeBtn.addEventListener('click', this._addHandlerTheme.bind(this));
    }
    _addHandlerTheme(e) {
        const target = e.target.closest('.fas');
        if (!target) return;

        if (target.classList.contains('active-theme') && target.classList.contains('sun')) {
            this.sun.style.translate = '40px';
            this.moon.style.translate = '-40px';
            document.querySelector('body').classList.add('dark-theme');
        }
        else {
            this.moon.style.translate = '40px';
            this.sun.style.translate = '0';
            document.querySelector('body').classList.remove('dark-theme');
        }
    }
    _addHandlerSearchInput(handler) {
        this.searchBar.addEventListener('change', function (e) {
            e.preventDefault();

            const query = this.value;
            handler(query);
        })
    }
    _addHandlerLocation(handler) {
        this.locationBtn.addEventListener('click', function () {
            if (navigator.geolocation.getCurrentPosition) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    const { coords } = position;
                    const { latitude, longitude } = coords;

                    handler(latitude, longitude);
                }, function () {
                    alert('Can not get your location!');
                })
            }
        })
    }
    _addHandlerTodayStatus() {
        this.weekStatus.style.display = 'none';
        this.weekBtn.classList.remove('active-week-day');
        this.todayBtn.classList.add('active-week-day');
    }
    _addHandlerWeekStatus() {
        this.weekStatus.style.display = 'grid';
        this.todayBtn.classList.remove('active-week-day');
        this.weekBtn.classList.add('active-week-day');
    }
    _addHandlerTempCalculated(e) {
        const tempBtn = e.target.closest('.temp-degree');
        if (!tempBtn) return;

        const tempSymbol = (tempBtn.textContent).trim();

        if (tempSymbol === 'C') {
            // Add the class to C
            tempBtn.setAttribute('aria-checked', 'true');
            tempBtn.classList.add('active-c-f');

            // Remove the class from F
            this.fehrenhite.setAttribute('aria-checked', false);
            this.fehrenhite.classList.remove('active-c-f');

            this.renderData(this.weatherData, 'C');
        }

        else if (tempSymbol === 'F') {
            // Add the class to F
            tempBtn.setAttribute('aria-checked', 'true');
            tempBtn.classList.add('active-c-f');

            // Remove the class from C
            this.celsius.setAttribute('aria-checked', false);
            this.celsius.classList.remove('active-c-f');

            this.renderData(this.weatherData, 'F');
        }
    }
    _addHandlerDayStatus(e) {
        e.preventDefault();
        const target = e.target.closest('.week-day');
        if (!target) return;

        const forecastDay = target.dataset.dayNum;

        // Remove the active class from all week days
        const arr = Array.from(this.weekStatus.children);
        arr.forEach(day => {
            day.classList.remove('active-day');
        })

        // Set the week class to the selected elemenet
        this.weekStatus.children[forecastDay].classList.add('active-day');

        this.renderDayStatus(this.weatherData, forecastDay)
    }
    renderData(weatherData, unit) {
        this.weatherData = weatherData;
        // const unit = ['C', 'F'];
        const { icon } = weatherData.current.condition;
        const { text } = weatherData.current.condition;

        const { temp_c } = weatherData.current;
        const { temp_f } = weatherData.current;
        const { last_updated } = weatherData.current;
        const time = last_updated.split(' ')[1];

        let day = last_updated.split(' ')[0];
        const date = new Date(day).toString();
        day = date.split(' ')[0];

        const { country } = weatherData.location;
        const { name: city } = weatherData.location;

        // ////////////////////////////////////////////////

        // Left side render
        this.mainImg.src = icon;
        this.temperatureStatus.innerHTML = `${unit === 'C' ? temp_c : temp_f}<sup>${unit}</sup>`;
        this.day.innerHTML = `${day}, <span class="time">${time}</span>`;
        this.condition.innerHTML = `${text}`;
        this.conditionImg.setAttribute('src', icon);
        this.locationName.textContent = `${city}, ${country}`;

        // Right side render
        this.renderWeekStatus(weatherData, unit);
    }
    renderWeekStatus(weatherData, unit) {
        this.weekStatus.innerHTML = '';
        let i = 0;
        weatherData.forecast.forecastday.forEach(day => {
            let dayName = day.date;
            const date = new Date(dayName).toString();
            dayName = date.split(' ')[0];

            const dayHTML = `
            <div data-day-num = ${i} class="week-day">
                <span class="day-name">${dayName}</span>
                <img
                src="${day.day.condition.icon}"
                alt="Weather Status"
                class="status-day-img"
                />
                <div class="status-numbers">
                <span class="min-temp">${unit === 'C' ? day.day.mintemp_c : day.day.mintemp_f}<sup>${unit}</sup></span>
                <span class="max-temp">${unit === 'C' ? day.day.maxtemp_c : day.day.maxtemp_f}<sup>${unit}</sup></span>
                </div>
            </div>
            `;

            this.weekStatus.insertAdjacentHTML('beforeend', dayHTML);

            i++;
        });

        // Set the active class to the first element just for the first time
        this.weekStatus.children[0].classList.add('active-day');

        // Render day status
        this.renderDayStatus(weatherData);
    }
    renderDayStatus(weatherData, selectedDay = 0) {
        // console.log(weatherData);
        const { forecastday } = weatherData.forecast;

        const { co: airQuality } = weatherData.current.air_quality;
        const { wind_dir: windDir } = weatherData.current;

        const day = forecastday[selectedDay];

        let dayName = day.date;
        const date = new Date(dayName).toString();
        dayName = date.split(' ')[0];

        const { avghumidity: humidity } = day.day;
        const { sunrise } = day.astro;
        const { sunset } = day.astro;
        const { uv } = day.day;
        const { avgvis_km: visibility } = day.day;
        const { maxwind_kph: windSpeed } = day.day;

        // console.log(airQuality.toFixed(0), windDir, humidity, sunrise, sunset, uv, visibility, windSpeed);

        this.uv.textContent = uv;
        if (uv >= 0 && uv <= 2) {
            this.uvStatus.innerHTML = 'Low';
        }
        else if (uv >= 3 && uv <= 5) {
            this.uvStatus.innerHTML = 'Moderate';
        }
        else if (uv >= 6 && uv <= 7) {
            this.uvStatus.innerHTML = 'High <i class="fa-solid fa-face-frown"></i>';
        }
        else if (uv >= 8 && uv <= 10) {
            this.uvStatus.innerHTML = 'Very High';
        }
        else if (uv >= 11) {
            this.uvStatus.innerHTML = 'Extreme';
        }

        this.windSpeed.innerHTML = '';
        this.windSpeed.innerHTML = `${windSpeed}<sub>km/h</sub>`;
        this.windDir.textContent = windDir;
        // this.windDirctionDay.textContent = `for ${dayName}`;

        this.sunriseTime.textContent = sunrise;
        this.sunsetTime.textContent = sunset;

        this.humidity.innerHTML = `${humidity}<sup>%</sup>`;

        if (humidity > 60) {
            this.humidityStatus.innerHTML = 'High <i class="fa-sharp fa-regular fa-face-frown"></i>';
        }
        else {
            this.humidityStatus.innerHTML = 'Normal <i class="fa-regular fa-hand-peace"></i>';
        }

        this.visibility.innerHTML = `${visibility}<sub>km</sub>`;
        if (visibility < 0.5) {
            this.visibilityStatus.innerHTML = 'Dense fog';
        }
        else if (visibility >= 0.5 && visibility < 1) {
            this.visibilityStatus.innerHTML = 'Thick fog';
        }
        else if (visibility >= 0.5 && visibility < 1) {
            this.visibilityStatus.innerHTML = 'Thick fog';
        }
        else if (visibility >= 1 && visibility < 2) {
            this.visibilityStatus.innerHTML = 'Moderate fog';
        }
        else if (visibility >= 2 && visibility < 4) {
            this.visibilityStatus.innerHTML = 'Haze';
        }
        else if (visibility >= 4 && visibility < 10) {
            this.visibilityStatus.innerHTML = 'Smoke';
        }
        else if (visibility >= 10 && visibility < 20) {
            this.visibilityStatus.innerHTML = 'Fair';
        }
        else if (visibility >= 20) {
            this.visibilityStatus.innerHTML = 'Excellent';
        }

        this.airQuality.textContent = airQuality.toFixed(0);

        if (airQuality > 100 && airQuality <= 150) {
            this.airQualityStatus.innerHTML = 'Unhealthy for Sensitive Groups<i class="fa-sharp fa-solid fa-thumbs-down"></i>';
        }
        else if (airQuality > 150 && airQuality <= 200) {
            this.airQualityStatus.innerHTML = 'Unhealthy <i class="fa-sharp fa-solid fa-thumbs-down"></i>';
        }
        else if (airQuality > 200 && airQuality <= 300) {
            this.airQualityStatus.innerHTML = 'Very Unhealthy <i class="fa-sharp fa-solid fa-thumbs-down"></i>';
        }
        else if (airQuality > 300) {
            this.airQualityStatus.innerHTML = 'Hazardous <i class="fa-sharp fa-solid fa-thumbs-down"></i>';
        }

        this._clearSearchInput();
    }
    _clearSearchInput() {
        this.searchBar.value = '';
        this.searchBar.focus();
    }
}
export default new View();