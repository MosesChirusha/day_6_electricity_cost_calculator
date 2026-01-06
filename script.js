// Country-specific data
        const COUNTRY_DATA = {
            KE: { currency: 'KES', rate: 24.00, name: 'Kenya', avgBill: 2500 },
            NG: { currency: 'NGN', rate: 68.00, name: 'Nigeria', avgBill: 15000 },
            GH: { currency: 'GHS', rate: 1.95, name: 'Ghana', avgBill: 250 },
            ZA: { currency: 'ZAR', rate: 3.20, name: 'South Africa', avgBill: 1500 },
            TZ: { currency: 'TZS', rate: 385.00, name: 'Tanzania', avgBill: 50000 },
            UG: { currency: 'UGX', rate: 850.00, name: 'Uganda', avgBill: 150000 },
            EG: { currency: 'EGP', rate: 1.40, name: 'Egypt', avgBill: 600 },
            MA: { currency: 'MAD', rate: 1.50, name: 'Morocco', avgBill: 300 },
            RW: { currency: 'RWF', rate: 250.00, name: 'Rwanda', avgBill: 30000 },
            ET: { currency: 'ETB', rate: 1.80, name: 'Ethiopia', avgBill: 800 },
            ZW: { currency: 'USD', rate: 0.16, name: 'Zimbabwe', avgBill: 80 },
            ZM: { currency: 'ZMW', rate: 2.50, name: 'Zambia', avgBill: 450 },
            BW: { currency: 'BWP', rate: 1.20, name: 'Botswana', avgBill: 550 },
            SN: { currency: 'XOF', rate: 110.00, name: 'Senegal', avgBill: 15000 },
            CI: { currency: 'XOF', rate: 95.00, name: 'Côte d\'Ivoire', avgBill: 12000 },
            ML: { currency: 'XOF', rate: 100.00, name: 'Mali', avgBill: 13000 },
            CM: { currency: 'XAF', rate: 105.00, name: 'Cameroon', avgBill: 14000 },
            CD: { currency: 'CDF', rate: 120.00, name: 'DR Congo', avgBill: 2000 },
            TN: { currency: 'TND', rate: 0.42, name: 'Tunisia', avgBill: 85 }
        };

        // Common appliance presets
        const APPLIANCE_PRESETS = [
            { name: 'LED Bulb', power: 10, hours: 5, icon: '💡' },
            { name: 'CFL Bulb', power: 15, hours: 5, icon: '💡' },
            { name: 'Incandescent', power: 60, hours: 5, icon: '💡' },
            { name: 'TV (LED)', power: 80, hours: 6, icon: '📺' },
            { name: 'TV (Old)', power: 150, hours: 6, icon: '📺' },
            { name: 'Refrigerator', power: 150, hours: 24, icon: '❄️' },
            { name: 'Fan', power: 75, hours: 8, icon: '🌀' },
            { name: 'AC (1HP)', power: 900, hours: 8, icon: '❄️' },
            { name: 'Iron', power: 1000, hours: 1, icon: '👕' },
            { name: 'Washing Machine', power: 500, hours: 1, icon: '🧺' },
            { name: 'Water Heater', power: 2000, hours: 2, icon: '🚿' },
            { name: 'Microwave', power: 1200, hours: 0.5, icon: '🍽️' },
            { name: 'Laptop', power: 65, hours: 8, icon: '💻' },
            { name: 'Desktop PC', power: 200, hours: 8, icon: '🖥️' },
            { name: 'Phone Charger', power: 5, hours: 3, icon: '📱' },
            { name: 'Water Pump', power: 750, hours: 2, icon: '💧' },
            { name: 'Electric Kettle', power: 1500, hours: 0.5, icon: '☕' },
            { name: 'Rice Cooker', power: 700, hours: 1, icon: '🍚' }
        ];

        let appliances = [];

        function initializeData() {
            const saved = localStorage.getItem('electricityCalculator');
            if (saved) {
                const data = JSON.parse(saved);
                appliances = data.appliances || [];
                document.getElementById('country').value = data.country || '';
                document.getElementById('currency').value = data.currency || 'KES';
                document.getElementById('electricityRate').value = data.rate || 24.00;
                document.getElementById('billingPeriod').value = data.period || 'monthly';
                updateCurrency();
            }
            displayAppliances();
            calculateAll();
            renderPresets();
        }

        function saveData() {
            const data = {
                appliances: appliances,
                country: document.getElementById('country').value,
                currency: document.getElementById('currency').value,
                rate: document.getElementById('electricityRate').value,
                period: document.getElementById('billingPeriod').value
            };
            localStorage.setItem('electricityCalculator', JSON.stringify(data));
        }

        function updateCurrency() {
            const country = document.getElementById('country').value;
            const infoDiv = document.getElementById('countryInfo');
            
            if (country && country !== 'OTHER' && COUNTRY_DATA[country]) {
                const data = COUNTRY_DATA[country];
                document.getElementById('currency').value = data.currency;
                document.getElementById('electricityRate').value = data.rate;
                document.getElementById('currencySymbol').textContent = data.currency;
                
                infoDiv.style.display = 'block';
                infoDiv.innerHTML = `
                    <strong>${data.name}</strong> average electricity rate: ${data.currency} ${data.rate}/kWh | 
                    Average monthly bill: ${data.currency} ${data.avgBill.toLocaleString()}
                `;
            } else if (country === 'OTHER') {
                infoDiv.style.display = 'block';
                infoDiv.innerHTML = 'Please enter your electricity rate manually from your utility bill.';
            } else {
                infoDiv.style.display = 'none';
            }
            
            const currency = document.getElementById('currency').value;
            document.getElementById('currencySymbol').textContent = currency;
            calculateAll();
        }

        function renderPresets() {
            const grid = document.getElementById('presetGrid');
            grid.innerHTML = APPLIANCE_PRESETS.map((preset, index) => `
                <div class="preset-btn" onclick="usePreset(${index})">
                    <div class="preset-icon">${preset.icon}</div>
                    <div class="preset-name">${preset.name}</div>
                </div>
            `).join('');
        }

        function usePreset(index) {
            const preset = APPLIANCE_PRESETS[index];
            document.getElementById('applianceName').value = preset.name;
            document.getElementById('appliancePower').value = preset.power;
            document.getElementById('applianceHours').value = preset.hours;
            document.getElementById('applianceQuantity').value = 1;
        }

        function openAddModal() {
            document.getElementById('addApplianceModal').classList.add('active');
            document.getElementById('applianceForm').reset();
        }

        function closeAddModal() {
            document.getElementById('addApplianceModal').classList.remove('active');
        }

        function addAppliance(event) {
            event.preventDefault();
            
            const appliance = {
                id: Date.now(),
                name: document.getElementById('applianceName').value,
                power: parseFloat(document.getElementById('appliancePower').value),
                hours: parseFloat(document.getElementById('applianceHours').value),
                quantity: parseInt(document.getElementById('applianceQuantity').value)
            };

            appliances.push(appliance);
            saveData();
            displayAppliances();
            calculateAll();
            closeAddModal();
        }

        function deleteAppliance(id) {
            if (confirm('Remove this appliance?')) {
                appliances = appliances.filter(a => a.id !== id);
                saveData();
                displayAppliances();
                calculateAll();
            }
        }

        function editAppliance(id) {
            const appliance = appliances.find(a => a.id === id);
            if (appliance) {
                document.getElementById('applianceName').value = appliance.name;
                document.getElementById('appliancePower').value = appliance.power;
                document.getElementById('applianceHours').value = appliance.hours;
                document.getElementById('applianceQuantity').value = appliance.quantity;
                deleteAppliance(id);
                openAddModal();
            }
        }

        function displayAppliances() {
            const grid = document.getElementById('applianceGrid');
            const emptyState = document.getElementById('emptyState');
            
            if (appliances.length === 0) {
                grid.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }

            grid.style.display = 'grid';
            emptyState.style.display = 'none';

            const rate = parseFloat(document.getElementById('electricityRate').value) || 0;
            const currency = document.getElementById('currency').value;

            grid.innerHTML = appliances.map(app => {
                const dailyKwh = (app.power * app.hours * app.quantity) / 1000;
                const dailyCost = dailyKwh * rate;
                const monthlyKwh = dailyKwh * 30;
                const monthlyCost = dailyCost * 30;

                return `
                    <div class="appliance-card">
                        <div class="appliance-header">
                            <div class="appliance-name">${app.name}</div>
                            <div class="appliance-icon">${getApplianceIcon(app.name)}</div>
                        </div>
                        <div class="appliance-details">
                            <div class="detail-item">
                                <span class="detail-label">Power</span>
                                <span class="detail-value">${app.power} W</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Hours/Day</span>
                                <span class="detail-value">${app.hours} hrs</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Quantity</span>
                                <span class="detail-value">${app.quantity}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Daily Energy</span>
                                <span class="detail-value">${dailyKwh.toFixed(2)} kWh</span>
                            </div>
                        </div>
                        <div class="appliance-cost">
                            <div class="cost-label">Daily Cost</div>
                            <div class="cost-value">${currency} ${dailyCost.toFixed(2)}</div>
                            <div class="cost-label" style="margin-top: 5px;">Monthly: ${currency} ${monthlyCost.toFixed(2)}</div>
                        </div>
                        <div class="appliance-actions">
                            <button class="btn-primary" onclick="editAppliance(${app.id})">Edit</button>
                            <button class="btn-danger" onclick="deleteAppliance(${app.id})">Delete</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function getApplianceIcon(name) {
        name = name.toLowerCase();
        if (name.includes('light') || name.includes('bulb') || name.includes('led') || name.includes('cfl')) return '💡';
        if (name.includes('tv') || name.includes('television')) return '📺';
        if (name.includes('fridge') || name.includes('refrigerator') || name.includes('freezer')) return '❄️';
        if (name.includes('fan')) return '🌀';
        if (name.includes('ac') || name.includes('air con') || name.includes('conditioner')) return '❄️';
        if (name.includes('iron')) return '👕';
        if (name.includes('wash')) return '🧺';
        if (name.includes('water') && name.includes('heat')) return '🚿';
        if (name.includes('microwave') || name.includes('oven')) return '🍽️';
        if (name.includes('laptop')) return '💻';
        if (name.includes('computer') || name.includes('pc') || name.includes('desktop')) return '🖥️';
        if (name.includes('phone') || name.includes('charger')) return '📱';
        if (name.includes('pump')) return '💧';
        if (name.includes('kettle')) return '☕';
        if (name.includes('rice') || name.includes('cooker')) return '🍚';
        return '⚡';
    }

    function calculateAll() {
        const rate = parseFloat(document.getElementById('electricityRate').value) || 0;
        const currency = document.getElementById('currency').value;
        const period = document.getElementById('billingPeriod').value;

        let totalPower = 0;
        let dailyEnergy = 0;

        appliances.forEach(app => {
            totalPower += app.power * app.quantity;
            dailyEnergy += (app.power * app.hours * app.quantity) / 1000;
        });

        const dailyCost = dailyEnergy * rate;
        
        let periodMultiplier = 1;
        let periodName = 'Daily';
        switch(period) {
            case 'weekly': periodMultiplier = 7; periodName = 'Weekly'; break;
            case 'monthly': periodMultiplier = 30; periodName = 'Monthly'; break;
            case 'yearly': periodMultiplier = 365; periodName = 'Yearly'; break;
        }

        const periodCost = dailyCost * periodMultiplier;

        document.getElementById('totalPower').textContent = `${totalPower.toFixed(0)} W`;
        document.getElementById('dailyEnergy').textContent = `${dailyEnergy.toFixed(2)} kWh`;
        document.getElementById('dailyCost').textContent = `${currency} ${dailyCost.toFixed(2)}`;
        document.getElementById('periodLabel').textContent = `${periodName} Cost`;
        document.getElementById('periodCost').textContent = `${currency} ${periodCost.toFixed(2)}`;

        generateSavingTips(appliances, dailyEnergy);
        saveData();
    }

    function generateSavingTips(appliances, dailyEnergy) {
        const tipsContainer = document.getElementById('savingTips');
        const tips = [];

        if (dailyEnergy > 15) {
            tips.push('Your daily consumption is high. Consider energy-saving alternatives.');
        }

        const highPowerAppliances = appliances.filter(a => a.power > 1000);
        if (highPowerAppliances.length > 0) {
            tips.push(`High-power appliances found: ${highPowerAppliances.map(a => a.name).join(', ')}. Use them during off-peak hours if available.`);
        }

        const longRunningAppliances = appliances.filter(a => a.hours > 10);
        if (longRunningAppliances.length > 0) {
            tips.push(`Appliances running over 10 hours daily: ${longRunningAppliances.map(a => a.name).join(', ')}. Consider reducing usage time.`);
        }

        const hasIncandescent = appliances.some(a => a.name.toLowerCase().includes('incandescent') || (a.name.toLowerCase().includes('bulb') && a.power > 40));
        if (hasIncandescent) {
            tips.push('Switch from incandescent bulbs to LED bulbs to save up to 80% on lighting costs.');
        }

        const hasFridge = appliances.some(a => a.name.toLowerCase().includes('fridge') || a.name.toLowerCase().includes('refrigerator'));
        if (hasFridge) {
            tips.push('Keep refrigerator at 3-4°C and freezer at -18°C for optimal efficiency.');
        }

        const hasAC = appliances.some(a => a.name.toLowerCase().includes('ac') || a.name.toLowerCase().includes('air con'));
        if (hasAC) {
            tips.push('Set AC to 24-26°C and use fans to circulate cool air for better efficiency.');
        }

        if (tips.length === 0) {
            tips.push('Your energy usage looks efficient! Keep monitoring to maintain low costs.');
            tips.push('Unplug chargers and appliances when not in use to avoid phantom loads.');
            tips.push('Clean appliances regularly for better efficiency (AC filters, fridge coils, etc.).');
        }

        tipsContainer.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    }

    function exportData() {
        const rate = parseFloat(document.getElementById('electricityRate').value) || 0;
        const currency = document.getElementById('currency').value;
        const country = document.getElementById('country').value;
        const countryName = COUNTRY_DATA[country]?.name || 'Custom';

        let csv = `Electricity Cost Report - ${countryName}\n`;
        csv += `Rate: ${currency} ${rate}/kWh\n`;
        csv += `Generated: ${new Date().toLocaleString()}\n\n`;
        csv += 'Appliance,Power (W),Hours/Day,Quantity,Daily kWh,Daily Cost,Monthly Cost\n';

        appliances.forEach(app => {
            const dailyKwh = (app.power * app.hours * app.quantity) / 1000;
            const dailyCost = dailyKwh * rate;
            const monthlyCost = dailyCost * 30;
            csv += `${app.name},${app.power},${app.hours},${app.quantity},${dailyKwh.toFixed(2)},${dailyCost.toFixed(2)},${monthlyCost.toFixed(2)}\n`;
        });

        const totalDaily = appliances.reduce((sum, app) => sum + (app.power * app.hours * app.quantity) / 1000, 0);
        const totalDailyCost = totalDaily * rate;
        const totalMonthly = totalDailyCost * 30;

        csv += `\nTOTAL,,,,${totalDaily.toFixed(2)},${totalDailyCost.toFixed(2)},${totalMonthly.toFixed(2)}\n`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `electricity-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();  
        window.URL.revokeObjectURL(url);
    }

    document.getElementById('addApplianceModal').addEventListener('click', function(e) {
        if (e.target === this) closeAddModal();
    });

    document.getElementById('currency').addEventListener('change', function() {
        document.getElementById('currencySymbol').textContent = this.value;
        calculateAll();
    });

    initializeData();