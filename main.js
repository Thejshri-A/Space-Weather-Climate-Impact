document.addEventListener('DOMContentLoaded', function () {
    // Fetch weather data from chennai-data.csv
    fetch('chennai-data.csv')
        .then(response => response.text())
        .then(data => {
            try {
                const parsedData = Papa.parse(data, { header: true, skipEmptyLines: true });

                let tmaxMax = -Infinity, tminMax = -Infinity;
                let tmaxMin = Infinity, tminMin = Infinity;
                let tmaxMaxDate = '', tminMaxDate = '';
                let tmaxMinDate = '', tminMinDate = '';
                let prcpMax = -Infinity, prcpMin = Infinity;

                parsedData.data.forEach(row => {
                    if (row.TMAX) {
                        const tmaxCelsius = (parseFloat(row.TMAX) - 32) * 5 / 9;
                        if (tmaxCelsius > tmaxMax) {
                            tmaxMax = tmaxCelsius;
                            tmaxMaxDate = row.DATE; // Update the date for Tmax max
                        }
                        if (tmaxCelsius < tmaxMin) {
                            tmaxMin = tmaxCelsius;
                            tmaxMinDate = row.DATE; // Update the date for Tmax min
                        }
                    }

                    if (row.TMIN) {
                        const tminCelsius = (parseFloat(row.TMIN) - 32) * 5 / 9;
                        if (tminCelsius > tminMax) {
                            tminMax = tminCelsius;
                            tminMaxDate = row.DATE; // Update the date for Tmin max
                        }
                        if (tminCelsius < tminMin) {
                            tminMin = tminCelsius;
                            tminMinDate = row.DATE; // Update the date for Tmin min
                        }
                    }

                    if (row.PRCP) {
                        const prcpValue = parseFloat(row.PRCP);
                        if (prcpValue > prcpMax) prcpMax = prcpValue;
                        if (prcpValue < prcpMin) prcpMin = prcpValue;
                    }
                });

                document.getElementById('weather-data').innerHTML = `
                    <p>Highest Tmax: ${tmaxMax.toFixed(2)}°C on ${tmaxMaxDate}</p>
                    <p>Lowest Tmax: ${tmaxMin.toFixed(2)}°C on ${tmaxMinDate}</p>
                    <p>Highest Tmin: ${tminMax.toFixed(2)}°C on ${tminMaxDate}</p>
                    <p>Lowest Tmin: ${tminMin.toFixed(2)}°C on ${tminMinDate}</p>
                    <p>Highest PRCP: ${prcpMax.toFixed(2)}mm</p>
                    <p>Lowest PRCP: ${prcpMin.toFixed(2)}mm</p>
                `;
            } catch (error) {
                console.error('Error parsing weather data:', error);
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));

    // Fetch space weather data
    fetch('https://api.nasa.gov/DONKI/FLR?startDate=2024-01-01&endDate=2024-08-08&api_key=DEMO_KEY')
        .then(response => response.json())
        .then(spaceData => {
            const spaceWeatherDiv = document.getElementById('space-weather-data');
            spaceWeatherDiv.innerHTML = ''; // Clear any existing content

            // Define a scale for flare classes
            const flareScale = {
                'X': 3,
                'M': 2,
                'C': 1
            };

            let highestFlare = { classType: '', beginTime: '', value: -Infinity };
            let lowestFlare = { classType: '', beginTime: '', value: Infinity };

            if (Array.isArray(spaceData)) {
                spaceData.forEach(event => {
                    const flareClass = event.classType.charAt(0);
                    const flareValue = flareScale[flareClass] || 0;

                    if (flareValue > highestFlare.value) {
                        highestFlare = { classType: event.classType, beginTime: event.beginTime, value: flareValue };
                    }
                    if (flareValue < lowestFlare.value) {
                        lowestFlare = { classType: event.classType, beginTime: event.beginTime, value: flareValue };
                    }
                });

                // Convert date to ISO format
                function formatDate(dateStr) {
                    const date = new Date(dateStr);
                    return date.toISOString(); // Formats as YYYY-MM-DDTHH:MM:SS.sssZ
                }

                spaceWeatherDiv.innerHTML = `
                    <p>Highest Solar Flare Activity: ${formatDate(highestFlare.beginTime)} - Class: ${highestFlare.classType}</p>
                    <p>Lowest Solar Flare Activity: ${formatDate(lowestFlare.beginTime)} - Class: ${lowestFlare.classType}</p>
                `;
            } else {
                console.error('Unexpected space weather data format:', spaceData);
            }
        })
        .catch(error => console.error('Error fetching space weather data:', error));
});
