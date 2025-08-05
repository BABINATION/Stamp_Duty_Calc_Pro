document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---
    const formatCurrency = (num) => '$' + Math.round(num).toLocaleString();
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    // --- CALCULATION FUNCTIONS ---
    const calculateNSWDuty = (price) => {
        if (price <= 17000) return Math.max(price * 0.0125, 20);
        if (price <= 36000) return 212 + ((price - 17000) * 0.015);
        if (price <= 97000) return 497 + ((price - 36000) * 0.0175);
        if (price <= 364000) return 1564 + ((price - 97000) * 0.035);
        if (price <= 1212000) return 10909 + ((price - 364000) * 0.045);
        return 49069 + ((price - 1212000) * 0.055);
    };
    const calcFHBVacant = (price) => {
        if (price <= 350000) return 0;
        if (price > 450000) return calculateNSWDuty(price);
        const duty = calculateNSWDuty(price);
        return Math.round(duty * ((price - 350000) / 100000));
    };
    const calcFHBHome = (price) => {
        if (price <= 800000) return 0;
        if (price > 1000000) return calculateNSWDuty(price);
        const duty = calculateNSWDuty(price);
        return Math.round(duty * ((price - 800000) / 200000));
    };
    const calculateQLDDuty = (price) => {
        if (price <= 5000) return 0;
        if (price <= 75000) return Math.ceil((price - 5000) / 100) * 1.50;
        if (price <= 540000) return 1050 + (Math.ceil((price - 75000) / 100) * 3.50);
        if (price <= 1000000) return 17325 + (Math.ceil((price - 540000) / 100) * 4.50);
        return 38025 + (Math.ceil((price - 1000000) / 100) * 5.75);
    };
    const calculateQLDHomeConcession = (price) => {
        if (price <= 350000) return Math.ceil(price / 100) * 1.00;
        if (price <= 540000) return 3500 + (Math.ceil((price - 350000) / 100) * 3.50);
        if (price <= 1000000) return 10150 + (Math.ceil((price - 540000) / 100) * 4.50);
        return 30850 + (Math.ceil((price - 1000000) / 100) * 5.75);
    };

    // --- TAB CONTENT ---
    const nswTabContent = [
        { 
            title: 'Standard Duty Rates', 
            content: `<table><thead><tr><th>Property Value</th><th>Duty Rate</th></tr></thead><tbody><tr><td>$0 to $17,000</td><td>$1.25 for every $100 (minimum $20)</td></tr><tr><td>$17,000 to $36,000</td><td>$212 plus $1.50 for every $100 over $17,000</td></tr><tr><td>$36,000 to $97,000</td><td>$497 plus $1.75 for every $100 over $36,000</td></tr><tr><td>$97,000 to $364,000</td><td>$1,564 plus $3.50 for every $100 over $97,000</td></tr><tr><td>$364,000 to $1,212,000</td><td>$10,909 plus $4.50 for every $100 over $364,000</td></tr><tr><td>Over $1,212,000</td><td>$49,069 plus $5.50 for every $100 over $1,212,000</td></tr></tbody></table>` 
        },
        { 
            title: 'FHBAS Scheme', 
            content: `<h3>✅ Eligibility Criteria</h3><p>To qualify for the FHBAS, you must:</p><ul><li>Be an individual (not a company or trust, unless acting as a corporate trustee for beneficiaries under a legal disability).</li><li>Be at least 18 years old.</li><li>Be an Australian citizen or permanent resident (at least one applicant).</li><li>Have never owned or co-owned residential property in Australia.</li><li>Have never received a first home buyer grant or duty concessions in Australia.</li><li>Be purchasing a new or existing home, or vacant land in NSW, with the intention to live in it as your principal place of residence.</li><li>Sign the contract on or after 1 July 2023.</li></ul><h3>🏠 Property Value Thresholds</h3><strong>New or existing homes:</strong><ul><li>Full exemption: dutiable value ≤ $800,000.</li><li>Concessional rate: dutiable value &gt; $800,000 and &lt; $1,000,000.</li></ul><strong>Vacant land:</strong><ul><li>Full exemption: dutiable value ≤ $350,000.</li><li>Concessional rate: dutiable value &gt; $350,000 and &lt; $450,000.</li></ul><h3>🏡 Residence Requirements</h3><ul><li>Move into the home within 12 months of settlement.</li><li>Live in the property as your principal place of residence for at least 12 continuous months.</li></ul>`
        },
        { 
            title: 'Useful Links', 
            content: `<h3>🔗 Useful Links</h3><ul><li><a href="https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer/assistance-scheme" target="_blank" rel="noopener noreferrer">First Home Buyers Assistance scheme</a></li><li><a href="https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/home-buying-assistance/first-home-buyers-assistance-scheme#:~:text=Under%20the%20First%20Home%20Buyers,the%20value%20of%20the%20property." target="_blank" rel="noopener noreferrer">Concessional rates information</a></li></ul>`
        }
    ];
    
    const qldTabContent = [
        { 
            title: 'Standard Duty Rates', 
            content: `<table><thead><tr><th>Dutiable value</th><th>Duty rate</th></tr></thead><tbody><tr><td>Not more than $5,000</td><td>Nil</td></tr><tr><td>More than $5,000 up to $75,000</td><td>$1.50 for each $100, or part of $100, over $5,000</td></tr><tr><td>$75,000 to $540,000</td><td>$1,050 plus $3.50 for each $100, or part of $100, over $75,000</td></tr><tr><td>$540,000 to $1,000,000</td><td>$17,325 plus $4.50 for each $100, or part of $100, over $540,000</td></tr><tr><td>More than $1,000,000</td><td>$38,025 plus $5.75 for each $100, or part of $100, over $1,000,000</td></tr></tbody></table>` 
        },
        { 
            title: 'Home Concession', 
            content: `<h3>✅ Eligibility Criteria</h3><ul><li>Be an individual (not a company or trust).</li><li>Acquire the property legally as an individual.</li><li>Move into and live in the home within 1 year of settlement.</li><li>Use the property as your principal place of residence.</li><li>Do not dispose of the property before moving in.</li></ul><p><strong>Note:</strong> You do not need to be an Australian citizen or permanent resident, and you are not required to be a first home buyer. However, additional foreign acquirer duty may apply if you are a foreign person.</p><h3>🏠 Home Concession Rates</h3><table><thead><tr><th>Purchase price/value</th><th>Duty rate</th></tr></thead><tbody><tr><td>Not more than $350,000</td><td>$1.00 for each $100 or part of $100</td></tr><tr><td>More than $350,000 to $540,000</td><td>$3,500 + $3.50 for every $100, or part of $100, over $350,000</td></tr><tr><td>$540,000 to $1,000,000</td><td>$10,150 + $4.50 for every $100, or part of $100, over $540,000</td></tr><tr><td>More than $1,000,000</td><td>$30,850 + $5.75 for every $100, or part of $100, over $1,000,000</td></tr></tbody></table>` 
        },
        { 
            title: 'First Home (New Home) Concession', 
            content: `<p class="highlight-news">From 1 May 2025, first home buyers who enter into a contract to purchase a new home to live in (or vacant land on which to build a home to live in) will be able to apply for a full transfer duty concession (reducing the duty to nil).</p><h3>✅ Eligibility Criteria</h3><p>To qualify for the First Home (New Home) Concession, you must:</p><ul><li>Be acquiring the property as an individual (not as a company or trust, unless acting as a corporate trustee for beneficiaries under a legal disability).</li><li>Have never owned a residential property anywhere in Australia or overseas.</li><li>Have never claimed the First Home Vacant Land Concession.</li><li>Be at least 18 years old.</li><li>Sign the contract on or after 1 May 2025.</li><li>Move into the home with your personal belongings and live there daily within 1 year of settlement (this timeframe cannot be extended).</li><li>Use the property as your principal place of residence.</li><li>Be paying market value for the property.</li><li>Provide a vendor statement confirming the home is new or substantially renovated.</li></ul><p><strong>Note:</strong> You do not need to be an Australian citizen or permanent resident to claim this concession. However, additional foreign acquirer duty may apply if you are a foreign person.</p><h3>🏠 Property Requirements</h3><p>The home must be new or substantially renovated, meaning:</p><ul><li>It has not been previously occupied or sold as a place of residence.</li><li>For substantially renovated homes, the renovations must be significant, and the home must not have been occupied or sold since the renovations.</li><li class="highlight-point">There is no value cap for the home and residential land attributed to the home.</li><li>Duty will be imposed on any additional land that doesn't form part of the residence or isn't used for residential purposes.</li></ul><h3>⚠️ Post-Purchase Obligations</h3><p>To retain the concession, you must:</p><ul><li>Not sell, transfer, lease, or grant exclusive possession of all or part of the property before moving in.</li><li>Not lease or grant exclusive possession of the entire property within 1 year after moving in.</li><li>Not lease or grant exclusive possession of part of the property within 1 year after moving in if the lease arrangement started before 10 September 2024.</li></ul><p>Failing to meet these obligations may result in the concession being revoked, and you may be required to pay the full transfer duty.</p>` 
        },
        { 
            title: 'First Home Vacant Land Concession', 
            content: `<h3>✅ Eligibility Criteria</h3><p>To qualify for the First Home Vacant Land Concession, you must:</p><ul><li>Be acquiring the property as an individual (not as a company or trust, unless acting as a corporate trustee for beneficiaries under a legal disability).</li><li>Have never claimed the first home vacant land concession on another property.</li><li>Have never held an interest in a residence anywhere in Australia or overseas.</li><li>Be at least 18 years old.</li><li>Be paying market value if the vacant land is valued between $350,001 and $499,999 (for agreements entered into before 1 May 2025).</li><li>Build your first home on the land, move in with your personal belongings, and live there daily within 2 years of settlement (this timeframe cannot be extended).</li><li>Only build one home on the land.</li><li>Ensure there is no building or part of a building on the land at the time of acquisition.</li></ul><p><strong>Note:</strong> You do not need to be an Australian citizen or permanent resident to claim this concession. However, additional foreign acquirer duty may apply if you are a foreign person.</p><h3>🏠 Property Requirements</h3><ul><li>The land must be vacant residential land on which you intend to build your first home.</li><li>Duty will be imposed on any portion of the land that is non-residential or not used for residential purposes.</li></ul><h3>⚠️ Post-Purchase Obligations</h3><p>To retain the concession, you must:</p><ul><li>Not sell or transfer all or part of the property before moving in.</li><li>Not lease, rent, or grant exclusive possession of all or part of the property before moving in.</li><li>After moving in, you may lease or grant exclusive possession of part of the property, provided the lease arrangement starts on or after 10 September 2024 and you continue to live in the property.</li><li>Not lease or grant exclusive possession of the entire property within 1 year after moving in.</li></ul>` 
        },
        { 
            title: 'Useful Links', 
            content: `<p>Links coming soon.</p>` 
        }
    ];

    // --- DOM ELEMENTS ---
    const homepage = document.getElementById('homepage');
    const nswCalculator = document.getElementById('nsw-calculator');
    const qldCalculator = document.getElementById('qld-calculator');

    // --- PAGE NAVIGATION ---
    const showPage = (pageId) => {
        homepage.classList.add('hidden');
        nswCalculator.classList.add('hidden');
        qldCalculator.classList.add('hidden');
        document.getElementById(pageId).classList.remove('hidden');

        document.body.className = '';
        if (pageId === 'homepage') document.body.classList.add('bg-default');
        if (pageId === 'nsw-calculator') document.body.classList.add('bg-nsw');
        if (pageId === 'qld-calculator') document.body.classList.add('bg-qld');
    };

    document.getElementById('NSW').addEventListener('click', () => showPage('nsw-calculator'));
    document.getElementById('QLD').addEventListener('click', () => showPage('qld-calculator'));
    document.getElementById('nswHomeIcon').addEventListener('click', (e) => { e.preventDefault(); showPage('homepage'); });
    document.getElementById('qldHomeIcon').addEventListener('click', (e) => { e.preventDefault(); showPage('homepage'); });

    // --- SHARED FUNCTIONS ---
    const handlePriceInput = (e) => {
        const rawValue = e.target.value.replace(/[^\d]/g, '');
        e.target.value = rawValue === '' ? '' : '$' + Number(rawValue).toLocaleString();
    };

    // --- NSW PAGE LOGIC ---
    if (nswCalculator) {
        const priceInput = document.getElementById('nswPropertyPrice');
        const fhbToggle = document.getElementById('nswFhbToggle');
        const vacantLandToggle = document.getElementById('nswVacantLandToggle');
        const newHomeToggle = document.getElementById('nswNewHomeToggle');
        const standardDutyEl = document.getElementById('nswStandardDuty');
        const fhbVacantEl = document.getElementById('nswFhbVacant');
        const fhbHomeEl = document.getElementById('nswFhbHome');

        const updateNSWUI = () => {
            const price = Number(priceInput.value.replace(/[^\d]/g, '')) || 0;
            const isFirstHomeBuyer = fhbToggle.classList.contains('active');
            const isVacantLand = vacantLandToggle.classList.contains('active');

            standardDutyEl.textContent = formatCurrency(calculateNSWDuty(price));
            fhbVacantEl.textContent = formatCurrency(calcFHBVacant(price));
            fhbHomeEl.textContent = formatCurrency(calcFHBHome(price));

            [standardDutyEl, fhbVacantEl, fhbHomeEl].forEach(el => el.classList.remove('result-highlight'));

            if (!isFirstHomeBuyer) {
                standardDutyEl.classList.add('result-highlight');
            } else if (isVacantLand) {
                fhbVacantEl.classList.add('result-highlight');
            } else {
                fhbHomeEl.classList.add('result-highlight');
            }
        };
        
        priceInput.addEventListener('input', (e) => { handlePriceInput(e); updateNSWUI(); });
        fhbToggle.addEventListener('click', () => { fhbToggle.classList.toggle('active'); updateNSWUI(); });
        vacantLandToggle.addEventListener('click', () => {
            vacantLandToggle.classList.add('active');
            newHomeToggle.classList.remove('active');
            updateNSWUI();
        });
        newHomeToggle.addEventListener('click', () => {
            newHomeToggle.classList.add('active');
            vacantLandToggle.classList.remove('active');
            updateNSWUI();
        });

        updateNSWUI();
        generateTabs('nswInfoTabs', nswTabContent);
    }

    // --- QLD PAGE LOGIC ---
    if (qldCalculator) {
        const priceInput = document.getElementById('qldPropertyPrice');
        const fhbToggle = document.getElementById('qldFhbToggle');
        const dateInput = document.getElementById('qldContractDate');
        const standardDutyEl = document.getElementById('qldStandardDuty');
        const homeConEl = document.getElementById('qldHomeCon');
        const newHomeConEl = document.getElementById('qldNewHomeCon');
        const vacantLandConEl = document.getElementById('qldVacantLandCon');
        
        dateInput.value = getTodayDate();

        const updateQLDUI = () => {
            const price = Number(priceInput.value.replace(/[^\d]/g, '')) || 0;
            const isFirstHomeBuyer = fhbToggle.classList.contains('active');
            const contractDate = new Date(dateInput.value + 'T00:00:00');
            const homeConStartDate = new Date('2024-06-09');
            const newConStartDate = new Date('2025-05-01');

            standardDutyEl.textContent = formatCurrency(calculateQLDDuty(price));

            if (contractDate >= homeConStartDate && contractDate < newConStartDate) {
                homeConEl.textContent = formatCurrency(calculateQLDHomeConcession(price));
            } else {
                homeConEl.textContent = 'N/A';
            }

            if (isFirstHomeBuyer && contractDate >= newConStartDate) {
                newHomeConEl.textContent = formatCurrency(0);
                vacantLandConEl.textContent = formatCurrency(0);
            } else {
                newHomeConEl.textContent = 'N/A';
                vacantLandConEl.textContent = 'N/A';
            }
        };

        priceInput.addEventListener('input', (e) => { handlePriceInput(e); updateQLDUI(); });
        fhbToggle.addEventListener('click', () => { fhbToggle.classList.toggle('active'); updateQLDUI(); });
        dateInput.addEventListener('input', updateQLDUI);

        updateQLDUI();
        generateTabs('qldInfoTabs', qldTabContent);
    }

    // --- TAB GENERATION ---
    function generateTabs(containerId, tabsData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const nav = document.createElement('div');
        nav.className = 'tab-nav';

        const sections = document.createElement('div');

        tabsData.forEach((tab, index) => {
            const btn = document.createElement('button');
            btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
            btn.textContent = tab.title;
            btn.dataset.index = index;
            nav.appendChild(btn);

            const section = document.createElement('div');
            section.className = `tab-section ${index === 0 ? 'active' : ''}`;
            section.innerHTML = tab.content;
            sections.appendChild(section);
        });

        container.innerHTML = '';
        container.appendChild(nav);
        container.appendChild(sections);

        nav.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const index = e.target.dataset.index;
                nav.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                sections.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
                e.target.classList.add('active');
                sections.children[index].classList.add('active');
            }
        });
    }
});