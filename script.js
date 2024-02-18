function init() {
    gapi.client.init({
        apiKey: 'AIzaSyB5A2B9GAy9gVLpGS1Bef7yWGoyMm_LVHQ',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    });
}

const additionalInfoContainer = document.getElementById("additionalInfo")

document.getElementById("searchForm").addEventListener("submit", e => {
    search()
    e.preventDefault()
}, false)

function search() {
    const searchInput = document.getElementById('searchInput').value;

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '15NYq5ws2n3rxA3NsJhQBLyDp3OtZCYicpfbl-xViaZM',
        range: 'Website',
    }).then((response) => {
        const values = response.result.values;

        const columns = values[0];
        const dataMap = values.slice(1).map(row => {
            const rowData = {};
            columns.forEach((col, idx) => {
                rowData[col] = row[idx]
            })
            return rowData
        })

        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = '';

        if (values && values.length > 1) {
            let foundEmployee = false;

            values.slice(1).forEach((row) => {
                if (row.includes(searchInput)) {
                    foundEmployee = true;

                    const table = document.createElement('table');
                    table.classList.add('resultTable');

                    columns.forEach((header, index) => {
                        const tr = document.createElement('tr');
                        const th = document.createElement('th');
                        th.textContent = header;
                        tr.appendChild(th);

                        const td = document.createElement('td');
                        td.textContent = row[index] || '-';
                        tr.appendChild(td);

                        table.appendChild(tr);
                    });

                    resultsContainer.appendChild(table);
                }
            });

            const filteredRow = dataMap.filter(record => record["Employee Id"] == searchInput)[0]
            console.log(filteredRow)

            if (!foundEmployee) {
                additionalInfoContainer.innerHTML = '<p style="color: white;">⚠ No Employee Found. ⚠</p>';
            }
        } else {
            additionalInfoContainer.innerHTML = '<p style="color: white;">⚠ No results found. ⚠</p>';
        }
    }).catch((error) => {
        console.error('Error fetching data:', error);
        additionalInfoContainer.innerHTML = '<p style="color: white;">⚠ An error occurred while fetching data. ⚠</p>';
    });
}

gapi.load('client', init);