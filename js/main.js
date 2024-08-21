document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('data-container');

    // Function to parse CSV data
    function parseCSV(text) {
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => row.split(','));
        return { headers, data };
    }

    // Fetch and process the CSV file
    fetch('data/chennai-data.csv') // Update path if needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(text => {
            const { headers, data } = parseCSV(text);

            // Display headers
            const headerRow = document.createElement('div');
            headerRow.textContent = headers.join(' | ');
            dataContainer.appendChild(headerRow);

            // Display data rows
            data.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.textContent = row.join(' | ');
                dataContainer.appendChild(rowDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            dataContainer.textContent = 'Error loading weather data.';
        });
});
