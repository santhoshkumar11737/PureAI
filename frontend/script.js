/**
 * Air Quality Pattern Analysis - Master JavaScript Logic
 * Developed for Machine Learning Project by SANTHOSH KUMAR S
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. SAMPLE DATASETS FOR CITIES & HISTORICAL RECORDS
    // =========================================================================
    
    // Dataset for Location Selector (Chennai, Coimbatore, Madurai, Salem, Tiruchirappalli)
    const cityData = {
        "Chennai": {
            aqi: 142,
            pm25: 78,
            pm10: 124,
            co: 1.8,
            no2: 42,
            o3: 56,
            status: "Unhealthy for Sensitive Groups",
            statusClass: "status-unhealthy-sensitive",
            rowId: "row-sensitive",
            weeklyTrend: [110, 125, 142, 138, 155, 130, 118],
            hourlyTrend: [85, 98, 160, 142, 168, 135],
            pollutants: [78, 124, 42, 18, 56] // PM2.5, PM10, NO2, CO*10, O3
        },
        "Coimbatore": {
            aqi: 68,
            pm25: 24,
            pm10: 52,
            co: 0.8,
            no2: 22,
            o3: 35,
            status: "Moderate",
            statusClass: "status-moderate",
            rowId: "row-moderate",
            weeklyTrend: [55, 62, 68, 70, 65, 58, 50],
            hourlyTrend: [45, 50, 75, 68, 80, 60],
            pollutants: [24, 52, 22, 8, 35]
        },
        "Madurai": {
            aqi: 95,
            pm25: 35,
            pm10: 70,
            co: 1.1,
            no2: 30,
            o3: 40,
            status: "Moderate",
            statusClass: "status-moderate",
            rowId: "row-moderate",
            weeklyTrend: [80, 88, 95, 92, 102, 85, 78],
            hourlyTrend: [60, 70, 105, 95, 115, 90],
            pollutants: [35, 70, 30, 11, 40]
        },
        "Salem": {
            aqi: 165,
            pm25: 88,
            pm10: 145,
            co: 2.1,
            no2: 54,
            o3: 62,
            status: "Unhealthy",
            statusClass: "status-unhealthy",
            rowId: "row-unhealthy",
            weeklyTrend: [140, 152, 165, 170, 180, 160, 145],
            hourlyTrend: [110, 125, 185, 165, 195, 155],
            pollutants: [88, 145, 54, 21, 62]
        },
        "Tiruchirappalli": {
            aqi: 115,
            pm25: 48,
            pm10: 89,
            co: 1.4,
            no2: 38,
            o3: 48,
            status: "Unhealthy for Sensitive Groups",
            statusClass: "status-unhealthy-sensitive",
            rowId: "row-sensitive",
            weeklyTrend: [95, 105, 115, 120, 125, 110, 100],
            hourlyTrend: [75, 85, 130, 115, 138, 105],
            pollutants: [48, 89, 38, 14, 48]
        }
    };

    // Sample 10+ Historical Dataset Records for Data Table
    const historicalRecords = [
        { date: "2026-10-08", location: "Chennai", aqi: 142, pm25: 78, pm10: 124, co: 1.8, no2: 42, o3: 56, status: "Unhealthy for Sensitive Groups" },
        { date: "2026-10-07", location: "Coimbatore", aqi: 68, pm25: 24, pm10: 52, co: 0.8, no2: 22, o3: 35, status: "Moderate" },
        { date: "2026-10-07", location: "Madurai", aqi: 95, pm25: 35, pm10: 70, co: 1.1, no2: 30, o3: 40, status: "Moderate" },
        { date: "2026-10-06", location: "Salem", aqi: 165, pm25: 88, pm10: 145, co: 2.1, no2: 54, o3: 62, status: "Unhealthy" },
        { date: "2026-10-06", location: "Tiruchirappalli", aqi: 115, pm25: 48, pm10: 89, co: 1.4, no2: 38, o3: 48, status: "Unhealthy for Sensitive Groups" },
        { date: "2026-10-05", location: "Chennai", aqi: 138, pm25: 74, pm10: 120, co: 1.7, no2: 40, o3: 54, status: "Unhealthy for Sensitive Groups" },
        { date: "2026-10-05", location: "Coimbatore", aqi: 45, pm25: 18, pm10: 38, co: 0.5, no2: 15, o3: 28, status: "Good" },
        { date: "2026-10-04", location: "Madurai", aqi: 102, pm25: 38, pm10: 76, co: 1.3, no2: 33, o3: 44, status: "Unhealthy for Sensitive Groups" },
        { date: "2026-10-04", location: "Salem", aqi: 180, pm25: 96, pm10: 160, co: 2.4, no2: 58, o3: 68, status: "Unhealthy" },
        { date: "2026-10-03", location: "Chennai", aqi: 155, pm25: 82, pm10: 132, co: 2.0, no2: 46, o3: 60, status: "Unhealthy" },
        { date: "2026-10-03", location: "Tiruchirappalli", aqi: 92, pm25: 33, pm10: 68, co: 1.0, no2: 28, o3: 41, status: "Moderate" },
        { date: "2026-10-02", location: "Coimbatore", aqi: 58, pm25: 20, pm10: 46, co: 0.7, no2: 19, o3: 31, status: "Moderate" }
    ];

    // Chart References
    let trendChartInstance = null;
    let pollutantChartInstance = null;
    let timeBasedChartInstance = null;

    // =========================================================================
    // 2. CHART INITIALIZATION FUNCTIONS
    // =========================================================================

    // Initialize Weekly AQI Trend Line Chart
    function initTrendChart(initialData) {
        const ctx = document.getElementById('trendChart').getContext('2d');
        trendChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [{
                    label: 'Air Quality Index (AQI)',
                    data: initialData,
                    borderColor: '#0d9488',
                    backgroundColor: 'rgba(13, 148, 136, 0.12)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.35,
                    pointBackgroundColor: '#0d9488',
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { color: '#e2e8f0' },
                        title: { display: true, text: 'AQI Value' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // Initialize Pollutant Breakdown Bar/Doughnut Chart
    function initPollutantChart(initialData) {
        const ctx = document.getElementById('pollutantChart').getContext('2d');
        pollutantChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['PM2.5 (µg/m³)', 'PM10 (µg/m³)', 'NO2 (µg/m³)', 'CO (x10 mg)', 'O3 (µg/m³)'],
                datasets: [{
                    label: 'Concentration Level',
                    data: initialData,
                    backgroundColor: [
                        '#ef4444', // PM2.5 Red
                        '#f97316', // PM10 Orange
                        '#2563eb', // NO2 Blue
                        '#eab308', // CO Yellow
                        '#10b981'  // O3 Green
                    ],
                    borderRadius: 8,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#e2e8f0' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // Initialize Time-Based Hourly Chart (12 AM to 8 PM)
    function initTimeBasedChart(initialData) {
        const ctx = document.getElementById('timeBasedChart').getContext('2d');
        timeBasedChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM'],
                datasets: [{
                    label: 'Hourly AQI Level',
                    data: initialData,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563eb',
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: { color: '#e2e8f0' },
                        title: { display: true, text: 'Hourly AQI' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // =========================================================================
    // 3. UPDATE DASHBOARD UPON LOCATION SELECTION
    // =========================================================================
    async function updateLocationData(cityName) {
        let data = cityData[cityName];

        // Attempt to fetch latest record for location from Flask SQLite API
        try {
            const apiRes = await fetch(`http://127.0.0.1:5000/api/latest/${cityName}`);
            if (apiRes.ok) {
                const apiRecord = await apiRes.json();
                data = {
                    aqi: apiRecord.aqi,
                    pm25: apiRecord.pm25,
                    pm10: apiRecord.pm10,
                    co: apiRecord.co,
                    no2: apiRecord.no2,
                    o3: apiRecord.o3,
                    status: apiRecord.status,
                    statusClass: getStatusClass(apiRecord.status),
                    rowId: getRowId(apiRecord.aqi),
                    weeklyTrend: cityData[cityName]?.weeklyTrend || [110, 125, 142, 138, 155, 130, 118],
                    hourlyTrend: cityData[cityName]?.hourlyTrend || [85, 98, 160, 142, 168, 135],
                    pollutants: [apiRecord.pm25, apiRecord.pm10, apiRecord.no2, Math.round(apiRecord.co * 10), apiRecord.o3]
                };
            }
        } catch (e) {
            // Flask API offline, using local cityData fallback
        }

        if (!data) return;

        // Update Hero Section
        const heroAqiVal = document.getElementById('heroAqiVal');
        const heroAqiStatus = document.getElementById('heroAqiStatus');
        if (heroAqiVal) heroAqiVal.innerText = `${data.aqi} AQI`;
        if (heroAqiStatus) {
            heroAqiStatus.innerText = data.status;
            heroAqiStatus.className = `hero-card-status ${data.statusClass}`;
        }

        // Update Location Bar Info
        const selectedCityName = document.getElementById('selectedCityName');
        if (selectedCityName) selectedCityName.innerText = `${cityName} District`;

        // Update KPI Cards
        document.getElementById('kpiAqi').innerText = data.aqi;
        document.getElementById('kpiPm25').innerText = data.pm25;
        document.getElementById('kpiPm10').innerText = data.pm10;
        document.getElementById('kpiCo').innerText = data.co;
        document.getElementById('kpiNo2').innerText = data.no2;
        document.getElementById('kpiO3').innerText = data.o3;

        // Update KPI Status Badge
        const kpiStatus = document.getElementById('kpiAqiStatus');
        if (kpiStatus) {
            kpiStatus.innerText = data.status;
            kpiStatus.className = `aqi-badge ${data.statusClass}`;
        }

        // Update Charts
        if (trendChartInstance) {
            trendChartInstance.data.datasets[0].data = data.weeklyTrend;
            trendChartInstance.update();
        }
        if (pollutantChartInstance) {
            pollutantChartInstance.data.datasets[0].data = data.pollutants;
            pollutantChartInstance.update();
        }
        if (timeBasedChartInstance) {
            timeBasedChartInstance.data.datasets[0].data = data.hourlyTrend;
            timeBasedChartInstance.update();
        }

        // Highlight Row in AQI Classification Table
        highlightClassificationRow(data.rowId);
    }

    function getStatusClass(status) {
        if (status === "Good") return "status-good";
        if (status === "Moderate") return "status-moderate";
        if (status === "Unhealthy for Sensitive Groups") return "status-unhealthy-sensitive";
        if (status === "Unhealthy") return "status-unhealthy";
        return "status-very-unhealthy";
    }

    function getRowId(aqi) {
        if (aqi <= 50) return "row-good";
        if (aqi <= 100) return "row-moderate";
        if (aqi <= 150) return "row-sensitive";
        if (aqi <= 200) return "row-unhealthy";
        if (aqi <= 300) return "row-very-unhealthy";
        return "row-hazardous";
    }

    // Highlight row in AQI classification table
    function highlightClassificationRow(targetRowId) {
        const rows = document.querySelectorAll('.classification-table tbody tr');
        rows.forEach(row => {
            row.classList.remove('active-row');
            const pill = row.querySelector('.status-pill');
            if (pill) pill.classList.add('hide');
        });

        const activeRow = document.getElementById(targetRowId);
        if (activeRow) {
            activeRow.classList.add('active-row');
            const activePill = activeRow.querySelector('.status-pill');
            if (activePill) activePill.classList.remove('hide');
        }
    }

    // =========================================================================
    // 4. HISTORICAL DATA TABLE POPULATION & SEARCH
    // =========================================================================
    async function loadBackendDataTable() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/air-quality');
            if (response.ok) {
                const apiRecords = await response.json();
                renderDataTable(apiRecords);
                return;
            }
        } catch (e) {
            // API offline, use default local records
        }
        renderDataTable(historicalRecords);
    }

    function renderDataTable(records) {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        records.forEach(rec => {
            let statusClass = "status-good";
            if (rec.aqi > 50 && rec.aqi <= 100) statusClass = "status-moderate";
            else if (rec.aqi > 100 && rec.aqi <= 150) statusClass = "status-unhealthy-sensitive";
            else if (rec.aqi > 150 && rec.aqi <= 200) statusClass = "status-unhealthy";
            else if (rec.aqi > 200) statusClass = "status-very-unhealthy";

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${rec.date}</strong></td>
                <td><i class="fa-solid fa-location-dot" style="color:#0d9488"></i> ${rec.location}</td>
                <td><strong>${rec.aqi}</strong></td>
                <td>${rec.pm25}</td>
                <td>${rec.pm10}</td>
                <td>${rec.co}</td>
                <td>${rec.no2}</td>
                <td>${rec.o3}</td>
                <td><span class="aqi-badge ${statusClass}">${rec.status}</span></td>
            `;
            tbody.appendChild(tr);
        });

        const recordCount = document.getElementById('recordCount');
        if (recordCount) recordCount.innerText = records.length;
    }

    // Live search for Data Table
    const tableSearch = document.getElementById('tableSearch');
    if (tableSearch) {
        tableSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = historicalRecords.filter(rec => 
                rec.location.toLowerCase().includes(query) ||
                rec.status.toLowerCase().includes(query) ||
                rec.date.includes(query)
            );
            renderDataTable(filtered);
        });
    }

    // =========================================================================
    // 5. ML PREDICTION INTERACTION WITH FLASK BACKEND API
    // =========================================================================
    const predictBtn = document.getElementById('predictBtn');
    const predDateInput = document.getElementById('predDate');
    
    // Set default date picker value to today
    if (predDateInput) {
        const todayStr = new Date().toISOString().split('T')[0];
        predDateInput.value = todayStr;
    }

    if (predictBtn) {
        predictBtn.addEventListener('click', async () => {
            const loc = document.getElementById('predLocation').value;
            const dateVal = document.getElementById('predDate').value;

            if (!dateVal) {
                alert('Please select a valid date for prediction.');
                return;
            }

            // Get current pollutant metrics for selected city
            const baseCityData = cityData[loc] || cityData["Chennai"];

            // Button loading visual effect
            predictBtn.disabled = true;
            predictBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Contacting Flask ML Model...`;

            try {
                // Try calling Python Flask REST API
                const response = await fetch('http://127.0.0.1:5000/api/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pm25: baseCityData.pm25,
                        pm10: baseCityData.pm10,
                        co: baseCityData.co,
                        no2: baseCityData.no2,
                        o3: baseCityData.o3
                    })
                });

                if (response.ok) {
                    const resData = await response.json();
                    renderPredictionResult(resData.predicted_aqi, resData.status, dateVal, true);
                } else {
                    throw new Error("Backend offline");
                }
            } catch (err) {
                // Fallback to local simulation if backend server is not running
                const simulatedAqi = Math.round(baseCityData.aqi + (Math.random() * 10 - 5));
                let statusStr = "Unhealthy for Sensitive Groups";
                if (simulatedAqi <= 50) statusStr = "Good";
                else if (simulatedAqi <= 100) statusStr = "Moderate";
                else if (simulatedAqi <= 150) statusStr = "Unhealthy for Sensitive Groups";
                else if (simulatedAqi <= 200) statusStr = "Unhealthy";
                else statusStr = "Very Unhealthy";

                renderPredictionResult(simulatedAqi, statusStr, dateVal, false);
            } finally {
                predictBtn.disabled = false;
                predictBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> Predict Air Pollution`;
            }
        });
    }

    function renderPredictionResult(aqiVal, statusText, dateStr, isBackend) {
        const resultBox = document.getElementById('predictionResult');
        document.getElementById('predictedAqiVal').innerText = aqiVal;
        
        let statusClass = "status-unhealthy-sensitive";
        if (statusText === "Good") statusClass = "status-good";
        else if (statusText === "Moderate") statusClass = "status-moderate";
        else if (statusText === "Unhealthy") statusClass = "status-unhealthy";
        else if (statusText === "Very Unhealthy" || statusText === "Hazardous") statusClass = "status-very-unhealthy";

        const statusVal = document.getElementById('predictedStatusVal');
        statusVal.innerText = statusText;
        statusVal.className = `status-badge ${statusClass}`;

        const modeBadge = isBackend ? "Live Python Flask ML Model" : "Simulated Local Model";
        document.getElementById('resultTimestamp').innerText = `${modeBadge} (${dateStr})`;
        
        resultBox.classList.remove('hidden');
    }

    // =========================================================================
    // 6. EVENT LISTENERS & NAVIGATION
    // =========================================================================
    
    // Location Dropdown Change Listener
    const locationSelect = document.getElementById('locationSelect');
    if (locationSelect) {
        locationSelect.addEventListener('change', (e) => {
            updateLocationData(e.target.value);
        });
    }

    // Mobile Drawer Navigation Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu when clicking nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // Active Navigation Scroll Highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    });

    // =========================================================================
    // 7. INITIAL PAGE BOOTSTRAP
    // =========================================================================
    const defaultCity = "Chennai";
    const defaultData = cityData[defaultCity];

    initTrendChart(defaultData.weeklyTrend);
    initPollutantChart(defaultData.pollutants);
    initTimeBasedChart(defaultData.hourlyTrend);
    updateLocationData(defaultCity);
    loadBackendDataTable();
});
