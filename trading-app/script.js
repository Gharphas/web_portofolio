/* ==========================================================================
   TradeNova Global Trading Engine Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. STATE INITIALIZATION & LOCAL STORAGE
    // ----------------------------------------------------------------------
    const DEFAULT_TRADENOVA_STATE = {
        isLoggedIn: false,
        user: {
            name: 'M Ikhsan Anggara',
            email: 'mikhsananggara@dev.id'
        },
        cashBalance: 45000000,
        activeAssetSymbol: 'BTC',
        orderSide: 'buy', // 'buy' or 'sell'
        assets: [
            { symbol: 'BTC', name: 'Bitcoin', cat: 'crypto', priceUsd: 94250, priceIdr: 1460000000, change24h: 4.85, icon: 'ri-btc-line', color: 'text-gold' },
            { symbol: 'ETH', name: 'Ethereum', cat: 'crypto', priceUsd: 3850, priceIdr: 59600000, change24h: 3.20, icon: 'ri-currency-line', color: 'text-cyan' },
            { symbol: 'BBCA', name: 'Bank Central Asia', cat: 'stocks', priceUsd: 0.66, priceIdr: 10250, change24h: 1.48, icon: 'ri-bank-line', color: 'text-green' },
            { symbol: 'TLKM', name: 'Telkom Indonesia', cat: 'stocks', priceUsd: 0.25, priceIdr: 3850, change24h: -0.77, icon: 'ri-signal-tower-line', color: 'text-red' },
            { symbol: 'AAPL', name: 'Apple Inc.', cat: 'stocks', priceUsd: 235.40, priceIdr: 3648000, change24h: 2.10, icon: 'ri-apple-fill', color: 'text-primary' },
            { symbol: 'TSLA', name: 'Tesla Inc.', cat: 'stocks', priceUsd: 245.10, priceIdr: 3799000, change24h: 5.40, icon: 'ri-car-line', color: 'text-red' }
        ],
        holdings: [
            { symbol: 'BTC', quantity: 0.045, avgPrice: 1400000000 },
            { symbol: 'BBCA', quantity: 2000, avgPrice: 10100 }
        ],
        history: [
            { type: 'BUY', symbol: 'BTC', quantity: 0.045, price: 1400000000, total: 63000000, date: '10 Agt 14:20' },
            { type: 'BUY', symbol: 'BBCA', quantity: 2000, price: 10100, total: 20200000, date: '12 Agt 09:30' }
        ]
    };

    let state = JSON.parse(localStorage.getItem('tradenova_app_state')) || DEFAULT_TRADENOVA_STATE;

    function saveState() {
        localStorage.setItem('tradenova_app_state', JSON.stringify(state));
        renderApp();
    }

    function showToast(msg, isSuccess = true) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'tn-toast';
        toast.style.borderColor = isSuccess ? '#0ecb81' : '#f6465d';
        toast.innerHTML = `<i class="${isSuccess ? 'ri-checkbox-circle-fill text-green' : 'ri-error-warning-fill text-red'}"></i> ${msg}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
    }

    function formatRupiah(num) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    }

    function formatUsd(num) {
        return '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    }

    // ----------------------------------------------------------------------
    // 2. AUTHENTICATION SYSTEM (LOGIN / REGISTER / LOGOUT)
    // ----------------------------------------------------------------------
    const authScreen = document.getElementById('authScreen');
    const tradingDashboard = document.getElementById('tradingDashboard');

    function checkAuthScreen() {
        if (state.isLoggedIn) {
            authScreen.classList.add('hidden');
            tradingDashboard.classList.remove('hidden');
            document.getElementById('displayUserName').textContent = state.user.name;
            renderApp();
            initChartCanvas();
        } else {
            authScreen.classList.remove('hidden');
            tradingDashboard.classList.add('hidden');
        }
    }

    // Toggle Forms
    document.getElementById('linkToRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    });

    document.getElementById('linkToLogin')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    });

    // Login Form Submit
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        state.isLoggedIn = true;
        saveState();
        checkAuthScreen();
        showToast('Berhasil masuk ke TradeNova Studio!');
    });

    // Demo Login Click
    document.getElementById('btnDemoLogin')?.addEventListener('click', () => {
        state.isLoggedIn = true;
        state.user.name = 'M Ikhsan Anggara';
        saveState();
        checkAuthScreen();
        showToast('Login Demo berhasil! Selamat bertransaksi M Ikhsan Anggara.');
    });

    // Register Form Submit
    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const regName = document.getElementById('regName').value || 'M Ikhsan Anggara';
        state.isLoggedIn = true;
        state.user.name = regName;
        saveState();
        checkAuthScreen();
        showToast(`Selamat datang ${regName}, akun trading Anda berhasil dibuat!`);
    });

    // Logout
    document.getElementById('btnLogout')?.addEventListener('click', () => {
        state.isLoggedIn = false;
        saveState();
        checkAuthScreen();
        showToast('Anda telah keluar akun.');
    });

    // ----------------------------------------------------------------------
    // 3. UI RENDERING & MARKET WATCHLIST
    // ----------------------------------------------------------------------
    function renderApp() {
        if (!state.isLoggedIn) return;

        renderTickerTrack();
        renderMarketWatchlist();
        renderActiveAssetHeader();
        renderHoldingsTable();
        renderOrderHistory();
        calculatePortfolioTotals();
    }

    // Ticker Marquee Running Text
    function renderTickerTrack() {
        const track = document.getElementById('tickerTrack');
        if (!track) return;

        const itemsHtml = state.assets.map(a => {
            const isUp = a.change24h >= 0;
            return `
                <div class="ticker-item">
                    <span class="font-bold">${a.symbol}</span>
                    <span>${a.cat === 'crypto' ? formatUsd(a.priceUsd) : formatRupiah(a.priceIdr)}</span>
                    <span class="${isUp ? 'text-green' : 'text-red'}">${isUp ? '+' : ''}${a.change24h}%</span>
                </div>
            `;
        }).join('');

        track.innerHTML = itemsHtml + itemsHtml; // Duplicate for smooth looping marquee
    }

    // Market Watchlist Panel
    function renderMarketWatchlist() {
        const list = document.getElementById('marketWatchlist');
        const search = (document.getElementById('marketSearchInput')?.value || '').toLowerCase();
        const activeFilter = document.querySelector('.chip-mtype.active')?.dataset.mtype || 'all';

        if (!list) return;

        const filtered = state.assets.filter(a => {
            const matchSearch = a.symbol.toLowerCase().includes(search) || a.name.toLowerCase().includes(search);
            const matchType = activeFilter === 'all' || a.cat === activeFilter;
            return matchSearch && matchType;
        });

        list.innerHTML = filtered.map(a => {
            const isSelected = a.symbol === state.activeAssetSymbol;
            const isUp = a.change24h >= 0;

            return `
                <div class="market-asset-item ${isSelected ? 'active' : ''}" onclick="selectActiveAsset('${a.symbol}')">
                    <div class="asset-info">
                        <div class="asset-icon"><i class="${a.icon} ${a.color}"></i></div>
                        <div>
                            <div class="asset-title">${a.symbol}</div>
                            <div class="asset-cat">${a.name}</div>
                        </div>
                    </div>
                    <div class="asset-prices">
                        <div class="a-price">${a.cat === 'crypto' ? formatUsd(a.priceUsd) : formatRupiah(a.priceIdr)}</div>
                        <div class="a-change ${isUp ? 'text-green' : 'text-red'}">${isUp ? '+' : ''}${a.change24h}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Active Asset Header Bar & Terminal Input Update
    function renderActiveAssetHeader() {
        const asset = state.assets.find(a => a.symbol === state.activeAssetSymbol) || state.assets[0];

        document.getElementById('activeAssetIcon').innerHTML = `<i class="${asset.icon} ${asset.color}"></i>`;
        document.getElementById('activeAssetTitle').textContent = `${asset.name} (${asset.symbol})`;
        document.getElementById('activeAssetCat').textContent = `${asset.cat.toUpperCase()} ASSET`;

        const isUp = asset.change24h >= 0;
        const priceEl = document.getElementById('activeAssetPrice');
        const changeEl = document.getElementById('activeAssetChange');

        priceEl.textContent = asset.cat === 'crypto' ? formatUsd(asset.priceUsd) : formatRupiah(asset.priceIdr);
        priceEl.className = isUp ? 'text-green font-bold' : 'text-red font-bold';

        changeEl.textContent = `${isUp ? '+' : ''}${asset.change24h}% 24h`;
        changeEl.className = isUp ? 'text-green text-sm' : 'text-red text-sm';

        // Update Order Form Terminal execution price
        document.getElementById('orderPriceInput').value = asset.priceIdr;
        updateOrderEstQuantity();
    }

    window.selectActiveAsset = function(symbol) {
        state.activeAssetSymbol = symbol;
        saveState();
        drawChart();
    };

    // Calculate Portfolio Values & PnL
    function calculatePortfolioTotals() {
        let totalHoldingsValue = 0;

        state.holdings.forEach(h => {
            const asset = state.assets.find(a => a.symbol === h.symbol);
            if (asset) {
                totalHoldingsValue += h.quantity * asset.priceIdr;
            }
        });

        const grandTotal = state.cashBalance + totalHoldingsValue;
        document.getElementById('userTotalPortfolio').textContent = formatRupiah(grandTotal);
        document.getElementById('userAvailableCash').textContent = formatRupiah(state.cashBalance);
    }

    // Holdings Table
    function renderHoldingsTable() {
        const tbody = document.getElementById('portfolioTableBody');
        if (!tbody) return;

        if (state.holdings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-3 text-muted">Belum ada aset terbelikan.</td></tr>';
            return;
        }

        tbody.innerHTML = state.holdings.map(h => {
            const asset = state.assets.find(a => a.symbol === h.symbol) || { priceIdr: h.avgPrice };
            const currentValue = h.quantity * asset.priceIdr;
            const costValue = h.quantity * h.avgPrice;
            const pnlVal = currentValue - costValue;
            const pnlPct = ((pnlVal / (costValue || 1)) * 100).toFixed(2);
            const isUp = pnlVal >= 0;

            return `
                <tr>
                    <td><b>${h.symbol}</b></td>
                    <td>${h.quantity}</td>
                    <td class="${isUp ? 'text-green' : 'text-red'}">
                        ${isUp ? '+' : ''}${formatRupiah(pnlVal)}<br><small>(${isUp ? '+' : ''}${pnlPct}%)</small>
                    </td>
                    <td>
                        <button class="btn-sell-mini" onclick="quickSellAsset('${h.symbol}')">Jual</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Order History List
    function renderOrderHistory() {
        const list = document.getElementById('orderHistoryList');
        if (!list) return;

        list.innerHTML = state.history.map(h => `
            <div class="history-item">
                <div>
                    <span class="h-type-badge ${h.type === 'BUY' ? 'bg-buy' : 'bg-sell'}">${h.type}</span>
                    <b class="ml-1">${h.symbol}</b> (${h.quantity})
                </div>
                <div class="text-right">
                    <span>${formatRupiah(h.total)}</span><br>
                    <small class="text-muted">${h.date}</small>
                </div>
            </div>
        `).join('');
    }

    // ----------------------------------------------------------------------
    // 4. ORDER EXECUTION TERMINAL (BUY & SELL)
    // ----------------------------------------------------------------------
    const tabBuy = document.getElementById('tabOrderBuy');
    const tabSell = document.getElementById('tabOrderSell');
    const btnSubmit = document.getElementById('btnSubmitOrder');

    tabBuy?.addEventListener('click', () => {
        state.orderSide = 'buy';
        tabBuy.classList.add('active');
        tabSell.classList.remove('active');
        btnSubmit.className = 'btn-execute-order btn-bg-buy w-100 mt-2';
        btnSubmit.textContent = `EKSEKUSI BELI ${state.activeAssetSymbol}`;
    });

    tabSell?.addEventListener('click', () => {
        state.orderSide = 'sell';
        tabSell.classList.add('active');
        tabBuy.classList.remove('active');
        btnSubmit.className = 'btn-execute-order btn-bg-sell w-100 mt-2';
        btnSubmit.textContent = `EKSEKUSI JUAL ${state.activeAssetSymbol}`;
    });

    // Quantity Allocation Slider Buttons
    document.querySelectorAll('.chip-pct').forEach(chip => {
        chip.addEventListener('click', () => {
            const pct = parseFloat(chip.getAttribute('data-pct'));
            const asset = state.assets.find(a => a.symbol === state.activeAssetSymbol);

            if (state.orderSide === 'buy') {
                const allocAmount = Math.floor(state.cashBalance * pct);
                document.getElementById('orderAmountInput').value = allocAmount;
            } else {
                const holding = state.holdings.find(h => h.symbol === state.activeAssetSymbol);
                if (holding) {
                    const sellQty = (holding.quantity * pct).toFixed(4);
                    const allocAmount = Math.floor(sellQty * asset.priceIdr);
                    document.getElementById('orderAmountInput').value = allocAmount;
                }
            }
            updateOrderEstQuantity();
        });
    });

    document.getElementById('orderAmountInput')?.addEventListener('input', updateOrderEstQuantity);

    function updateOrderEstQuantity() {
        const amt = parseFloat(document.getElementById('orderAmountInput')?.value) || 0;
        const asset = state.assets.find(a => a.symbol === state.activeAssetSymbol);
        if (!asset) return;

        const qty = (amt / asset.priceIdr).toFixed(4);
        document.getElementById('orderEstQuantity').textContent = `${qty} ${asset.symbol}`;
    }

    // Submit Order
    btnSubmit?.addEventListener('click', () => {
        const amt = parseFloat(document.getElementById('orderAmountInput').value);
        const asset = state.assets.find(a => a.symbol === state.activeAssetSymbol);
        if (!asset || isNaN(amt) || amt <= 0) {
            showToast('Masukkan alokasi dana order yang valid', false);
            return;
        }

        const qty = parseFloat((amt / asset.priceIdr).toFixed(4));
        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        if (state.orderSide === 'buy') {
            if (amt > state.cashBalance) {
                showToast('Saldo kas Anda tidak mencukupi', false);
                return;
            }

            state.cashBalance -= amt;

            let holding = state.holdings.find(h => h.symbol === asset.symbol);
            if (holding) {
                holding.quantity = parseFloat((holding.quantity + qty).toFixed(4));
            } else {
                state.holdings.push({ symbol: asset.symbol, quantity: qty, avgPrice: asset.priceIdr });
            }

            state.history.unshift({ type: 'BUY', symbol: asset.symbol, quantity: qty, price: asset.priceIdr, total: amt, date: timeStr });
            showToast(`Order Beli ${qty} ${asset.symbol} Berhasil!`);
        } else {
            // SELL SIDE
            let holding = state.holdings.find(h => h.symbol === asset.symbol);
            if (!holding || holding.quantity < qty) {
                showToast(`Jumlah aset ${asset.symbol} Anda tidak mencukupi untuk dijual`, false);
                return;
            }

            holding.quantity = parseFloat((holding.quantity - qty).toFixed(4));
            if (holding.quantity <= 0) {
                state.holdings = state.holdings.filter(h => h.symbol !== asset.symbol);
            }

            state.cashBalance += amt;
            state.history.unshift({ type: 'SELL', symbol: asset.symbol, quantity: qty, price: asset.priceIdr, total: amt, date: timeStr });
            showToast(`Order Jual ${qty} ${asset.symbol} Berhasil!`);
        }

        saveState();
    });

    window.quickSellAsset = function(symbol) {
        state.activeAssetSymbol = symbol;
        state.orderSide = 'sell';
        tabSell.click();
        saveState();
    };

    // ----------------------------------------------------------------------
    // 5. LIVE REAL-TIME PRICE FLUTUATION TICKER & CANVAS CHART
    // ----------------------------------------------------------------------
    setInterval(() => {
        if (!state.isLoggedIn) return;

        state.assets.forEach(a => {
            const delta = (Math.random() - 0.48) * 0.008; // Small random walk
            a.change24h = parseFloat((a.change24h + delta * 10).toFixed(2));
            a.priceUsd = parseFloat((a.priceUsd * (1 + delta)).toFixed(2));
            a.priceIdr = Math.round(a.priceIdr * (1 + delta));
        });

        renderTickerTrack();
        renderMarketWatchlist();
        renderActiveAssetHeader();
        calculatePortfolioTotals();
        drawChart();
    }, 2500);

    // Canvas Candlestick & Line Chart Simulator Engine
    let chartMode = 'candle';
    const canvas = document.getElementById('tradingChartCanvas');
    const ctx = canvas?.getContext('2d');

    document.getElementById('btnChartCandle')?.addEventListener('click', () => {
        chartMode = 'candle';
        document.getElementById('btnChartCandle').classList.add('active');
        document.getElementById('btnChartLine').classList.remove('active');
        drawChart();
    });

    document.getElementById('btnChartLine')?.addEventListener('click', () => {
        chartMode = 'line';
        document.getElementById('btnChartLine').classList.add('active');
        document.getElementById('btnChartCandle').classList.remove('active');
        drawChart();
    });

    function initChartCanvas() {
        if (!canvas) return;
        canvas.width = canvas.parentElement.clientWidth - 16;
        canvas.height = canvas.parentElement.clientHeight - 16;
        drawChart();
    }

    function drawChart() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const w = canvas.width;
        const h = canvas.height;

        // Draw Grid Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let y = 30; y < h; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Generate synthetic price points for active asset
        const numPoints = 28;
        const step = w / numPoints;
        const prices = [];
        let cur = 100;
        for (let i = 0; i < numPoints; i++) {
            cur += (Math.random() - 0.48) * 8;
            prices.push(cur);
        }

        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);

        if (chartMode === 'line') {
            // Line Chart Mode
            ctx.beginPath();
            ctx.strokeStyle = '#0ecb81';
            ctx.lineWidth = 2.5;

            prices.forEach((p, i) => {
                const x = i * step + step / 2;
                const y = h - ((p - minP) / (maxP - minP || 1)) * (h - 40) - 20;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Gradient Fill
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, 'rgba(14, 203, 129, 0.25)');
            grad.addColorStop(1, 'rgba(14, 203, 129, 0)');
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.fillStyle = grad;
            ctx.fill();
        } else {
            // Candlestick Chart Mode
            for (let i = 0; i < numPoints; i++) {
                const x = i * step + step / 2;
                const openP = prices[i];
                const closeP = prices[i + 1] || openP + (Math.random() - 0.5) * 6;
                const isGreen = closeP >= openP;

                const openY = h - ((openP - minP) / (maxP - minP || 1)) * (h - 40) - 20;
                const closeY = h - ((closeP - minP) / (maxP - minP || 1)) * (h - 40) - 20;
                const highY = Math.min(openY, closeY) - Math.random() * 10;
                const lowY = Math.max(openY, closeY) + Math.random() * 10;

                ctx.strokeStyle = isGreen ? '#0ecb81' : '#f6465d';
                ctx.fillStyle = isGreen ? '#0ecb81' : '#f6465d';

                // Wick Line
                ctx.beginPath();
                ctx.moveTo(x, highY);
                ctx.lineTo(x, lowY);
                ctx.stroke();

                // Candle Body
                const bodyH = Math.max(4, Math.abs(closeY - openY));
                ctx.fillRect(x - 4, Math.min(openY, closeY), 8, bodyH);
            }
        }
    }

    // Market Search Listener
    document.getElementById('marketSearchInput')?.addEventListener('input', renderMarketWatchlist);

    document.querySelectorAll('.chip-mtype').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip-mtype').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderMarketWatchlist();
        });
    });

    window.addEventListener('resize', initChartCanvas);

    // INIT CHECK
    checkAuthScreen();
});
