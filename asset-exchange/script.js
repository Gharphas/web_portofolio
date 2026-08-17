/* ==========================================================================
   GlobalAsset Exchange - Multi-Asset Trading System Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. STATE INITIALIZATION & LOCAL STORAGE
    // ----------------------------------------------------------------------
    const DEFAULT_EXCHANGE_STATE = {
        cashBalance: 85000000,
        goldGrams: 45.5,
        usdBalance: 3200,
        activeAssetId: 'gold-antam',
        checkoutSide: 'buy', // 'buy' or 'sell'
        assets: [
            { id: 'gold-antam', symbol: 'GOLD', name: 'Emas Batangan Antam 24K', cat: 'gold', unit: 'Gram', priceBuy: 1400000, priceSell: 1280000, change24h: 1.25, icon: 'ri-copper-coin-line', color: 'text-gold' },
            { id: 'usd-idr', symbol: 'USD/IDR', name: 'US Dollar (Valas)', cat: 'forex', unit: 'USD', priceBuy: 16000, priceSell: 15850, change24h: 0.45, icon: 'ri-money-dollar-circle-line', color: 'text-blue' },
            { id: 'eur-idr', symbol: 'EUR/IDR', name: 'Euro Europe', cat: 'forex', unit: 'EUR', priceBuy: 17500, priceSell: 17300, change24h: 0.20, icon: 'ri-currency-line', color: 'text-cyan' },
            { id: 'btc-crypto', symbol: 'BTC', name: 'Bitcoin Crypto', cat: 'crypto', unit: 'Coin', priceBuy: 1460000000, priceSell: 1450000000, change24h: 4.85, icon: 'ri-btc-line', color: 'text-gold' },
            { id: 'eth-crypto', symbol: 'ETH', name: 'Ethereum Crypto', cat: 'crypto', unit: 'Coin', priceBuy: 59600000, priceSell: 59000000, change24h: 3.20, icon: 'ri-currency-line', color: 'text-cyan' },
            { id: 'bbca-stock', symbol: 'BBCA', name: 'Bank Central Asia', cat: 'stocks', unit: 'Lembar', priceBuy: 10250, priceSell: 10200, change24h: 1.48, icon: 'ri-bank-line', color: 'text-green' },
            { id: 'tlkm-stock', symbol: 'TLKM', name: 'Telkom Indonesia', cat: 'stocks', unit: 'Lembar', priceBuy: 3850, priceSell: 3820, change24h: -0.77, icon: 'ri-signal-tower-line', color: 'text-red' },
            { id: 'aapl-stock', symbol: 'AAPL', name: 'Apple Inc.', cat: 'stocks', unit: 'Lembar', priceBuy: 3648000, priceSell: 3600000, change24h: 2.10, icon: 'ri-apple-fill', color: 'text-primary' },
            { id: 'tsla-stock', symbol: 'TSLA', name: 'Tesla Inc.', cat: 'stocks', unit: 'Lembar', priceBuy: 3799000, priceSell: 3750000, change24h: 5.40, icon: 'ri-car-line', color: 'text-red' }
        ],
        holdings: [
            { symbol: 'BTC', qty: 0.035 },
            { symbol: 'BBCA', qty: 1500 }
        ],
        history: [
            { id: 'GA-88291', type: 'BELI', name: 'Emas Batangan Antam 24K', qty: '10 Gram', total: 14000000, date: '12 Agt 11:20' },
            { id: 'GA-88290', type: 'BELI', name: 'US Dollar (Valas)', qty: '$1,000 USD', total: 16000000, date: '14 Agt 15:45' }
        ]
    };

    let state = JSON.parse(localStorage.getItem('globalasset_exchange_state')) || DEFAULT_EXCHANGE_STATE;

    function saveState() {
        localStorage.setItem('globalasset_exchange_state', JSON.stringify(state));
        renderApp();
    }

    function showToast(msg) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'ga-toast';
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
    }

    function formatRupiah(num) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
    }

    function generateGaId() {
        return 'GA-' + Math.floor(10000 + Math.random() * 90000);
    }

    // ----------------------------------------------------------------------
    // 2. UI RENDERING ENGINES
    // ----------------------------------------------------------------------
    function renderApp() {
        renderTickerTrack();
        renderAssetCatalog();
        renderActiveAssetView();
        renderVaults();
        renderHistory();
        calculateNetWorth();
    }

    function calculateNetWorth() {
        const goldAsset = state.assets.find(a => a.id === 'gold-antam') || { priceBuy: 1400000 };
        const usdAsset = state.assets.find(a => a.id === 'usd-idr') || { priceBuy: 16000 };

        const goldVal = state.goldGrams * goldAsset.priceBuy;
        const usdVal = state.usdBalance * usdAsset.priceBuy;

        let holdingsVal = 0;
        state.holdings.forEach(h => {
            const a = state.assets.find(ast => ast.symbol === h.symbol);
            if (a) holdingsVal += h.qty * a.priceBuy;
        });

        const grandTotal = state.cashBalance + goldVal + usdVal + holdingsVal;

        document.getElementById('totalNetWorth').textContent = formatRupiah(grandTotal);
        document.getElementById('cashBalance').textContent = formatRupiah(state.cashBalance);
        document.getElementById('goldBalance').textContent = `${state.goldGrams} Gram`;
        document.getElementById('dollarBalance').textContent = `$${state.usdBalance.toLocaleString('en-US')} USD`;
    }

    // Ticker Marquee Bar
    function renderTickerTrack() {
        const track = document.getElementById('tickerTrack');
        if (!track) return;

        const html = state.assets.map(a => {
            const isUp = a.change24h >= 0;
            return `
                <div class="ticker-item">
                    <span class="font-bold">${a.symbol}</span>
                    <span>${formatRupiah(a.priceBuy)}</span>
                    <span class="${isUp ? 'text-green' : 'text-red'}">${isUp ? '+' : ''}${a.change24h}%</span>
                </div>
            `;
        }).join('');

        track.innerHTML = html + html;
    }

    // Asset Catalog List
    function renderAssetCatalog() {
        const list = document.getElementById('assetCatalogList');
        const search = (document.getElementById('assetSearchInput')?.value || '').toLowerCase();
        const activeCat = document.querySelector('.cat-tab-btn.active')?.dataset.cat || 'all';

        if (!list) return;

        const filtered = state.assets.filter(a => {
            const matchSearch = a.symbol.toLowerCase().includes(search) || a.name.toLowerCase().includes(search);
            const matchCat = activeCat === 'all' || a.cat === activeCat;
            return matchSearch && matchCat;
        });

        list.innerHTML = filtered.map(a => {
            const isSelected = a.id === state.activeAssetId;
            const isUp = a.change24h >= 0;
            return `
                <div class="catalog-item ${isSelected ? 'active' : ''}" onclick="selectAsset('${a.id}')">
                    <div class="c-info">
                        <div class="c-icon"><i class="${a.icon} ${a.color}"></i></div>
                        <div>
                            <div class="c-title">${a.name}</div>
                            <div class="c-sub">${a.symbol} • Per ${a.unit}</div>
                        </div>
                    </div>
                    <div class="c-prices">
                        <div class="c-price">${formatRupiah(a.priceBuy)}</div>
                        <div class="c-change ${isUp ? 'text-green' : 'text-red'}">${isUp ? '+' : ''}${a.change24h}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Active Asset & Terminal Input Update
    function renderActiveAssetView() {
        const asset = state.assets.find(a => a.id === state.activeAssetId) || state.assets[0];

        document.getElementById('activeAssetIcon').innerHTML = `<i class="${asset.icon} ${asset.color}"></i>`;
        document.getElementById('activeAssetTitle').textContent = asset.name;
        document.getElementById('activeAssetSubtitle').textContent = `${asset.symbol} • Transaksi Per ${asset.unit}`;

        const isUp = asset.change24h >= 0;
        const currentPrice = state.checkoutSide === 'buy' ? asset.priceBuy : asset.priceSell;

        document.getElementById('activeAssetPrice').textContent = `${formatRupiah(currentPrice)} / ${asset.unit}`;
        document.getElementById('activeAssetChange').textContent = `${isUp ? '+' : ''}${asset.change24h}% 24h`;
        document.getElementById('execPriceInput').value = formatRupiah(currentPrice);

        updateTotalCalc();
    }

    window.selectAsset = function(assetId) {
        state.activeAssetId = assetId;
        saveState();
        drawChart();
    };

    window.quickSelectCategory = function(catName) {
        const btn = document.querySelector(`.cat-tab-btn[data-cat="${catName}"]`);
        if (btn) btn.click();
    };

    // Render Vaults
    function renderVaults() {
        document.getElementById('vaultGoldQty').textContent = `${state.goldGrams} Gram`;
        document.getElementById('vaultDollarQty').textContent = `$${state.usdBalance.toLocaleString('en-US')} USD`;
    }

    // Render Transaction History
    function renderHistory() {
        const list = document.getElementById('txHistoryList');
        if (!list) return;

        if (state.history.length === 0) {
            list.innerHTML = '<p class="text-muted text-center py-2">Belum ada transaksi.</p>';
            return;
        }

        list.innerHTML = state.history.map(t => `
            <div class="tx-item-card" onclick="openReceiptModal('${t.id}')">
                <div>
                    <span class="font-bold ${t.type === 'BELI' ? 'text-green' : 'text-gold'}">${t.type}</span>
                    <span class="ml-1">${t.name}</span>
                    <br><small class="text-muted">${t.qty}</small>
                </div>
                <div class="text-right">
                    <span class="font-bold">${formatRupiah(t.total)}</span><br>
                    <small class="text-muted">${t.date}</small>
                </div>
            </div>
        `).join('');
    }

    // ----------------------------------------------------------------------
    // 3. CHECKOUT TERMINAL & ORDER EXECUTION
    // ----------------------------------------------------------------------
    const tabBuy = document.getElementById('tabBuy');
    const tabSell = document.getElementById('tabSell');
    const btnSubmit = document.getElementById('btnSubmitCheckout');

    tabBuy?.addEventListener('click', () => {
        state.checkoutSide = 'buy';
        tabBuy.classList.add('active');
        tabSell.classList.remove('active');
        btnSubmit.className = 'btn-submit-checkout btn-bg-buy w-100 mt-2';
        btnSubmit.textContent = 'KONFIRMASI BELI ASET';
        renderActiveAssetView();
    });

    tabSell?.addEventListener('click', () => {
        state.checkoutSide = 'sell';
        tabSell.classList.add('active');
        tabBuy.classList.remove('active');
        btnSubmit.className = 'btn-submit-checkout btn-bg-sell w-100 mt-2';
        btnSubmit.textContent = 'KONFIRMASI JUAL / BUYBACK';
        renderActiveAssetView();
    });

    // Quick Unit Allocation Chips
    document.querySelectorAll('.chip-alloc').forEach(chip => {
        chip.addEventListener('click', () => {
            const alloc = parseFloat(chip.getAttribute('data-alloc'));
            document.getElementById('inputQty').value = alloc;
            updateTotalCalc();
        });
    });

    document.getElementById('inputQty')?.addEventListener('input', updateTotalCalc);

    function updateTotalCalc() {
        const qty = parseFloat(document.getElementById('inputQty')?.value) || 0;
        const asset = state.assets.find(a => a.id === state.activeAssetId);
        if (!asset) return;

        const unitPrice = state.checkoutSide === 'buy' ? asset.priceBuy : asset.priceSell;
        const total = qty * unitPrice;

        document.getElementById('totalCalcText').textContent = formatRupiah(total);
    }

    // SUBMIT CHECKOUT
    btnSubmit?.addEventListener('click', () => {
        const qty = parseFloat(document.getElementById('inputQty').value);
        const asset = state.assets.find(a => a.id === state.activeAssetId);
        if (!asset || isNaN(qty) || qty <= 0) {
            showToast('Masukkan jumlah unit transaksi yang valid!');
            return;
        }

        const unitPrice = state.checkoutSide === 'buy' ? asset.priceBuy : asset.priceSell;
        const total = qty * unitPrice;
        const dateStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const txId = generateGaId();

        if (state.checkoutSide === 'buy') {
            if (total > state.cashBalance) {
                showToast('Saldo kas Rupiah Anda tidak mencukupi untuk transaksi ini!');
                return;
            }

            state.cashBalance -= total;

            if (asset.id === 'gold-antam') state.goldGrams = parseFloat((state.goldGrams + qty).toFixed(2));
            else if (asset.id === 'usd-idr') state.usdBalance += qty;
            else {
                let holding = state.holdings.find(h => h.symbol === asset.symbol);
                if (holding) holding.qty += qty;
                else state.holdings.push({ symbol: asset.symbol, qty: qty });
            }

            const createdTx = {
                id: txId,
                type: 'BELI',
                name: asset.name,
                qty: `${qty} ${asset.unit}`,
                total: total,
                date: dateStr,
                unitPrice: unitPrice
            };

            state.history.unshift(createdTx);
            saveState();

            openReceiptModal(txId);
            showToast(`Transaksi Beli ${qty} ${asset.unit} ${asset.name} Berhasil!`);
        } else {
            // SELL / BUYBACK SIDE
            if (asset.id === 'gold-antam' && state.goldGrams < qty) {
                showToast('Stok Emas Antam Anda di brankas tidak mencukupi!', false);
                return;
            } else if (asset.id === 'usd-idr' && state.usdBalance < qty) {
                showToast('Saldo USD Anda di kantong valas tidak mencukupi!', false);
                return;
            }

            if (asset.id === 'gold-antam') state.goldGrams = parseFloat((state.goldGrams - qty).toFixed(2));
            else if (asset.id === 'usd-idr') state.usdBalance -= qty;

            state.cashBalance += total;

            const createdTx = {
                id: txId,
                type: 'BUYBACK / JUAL',
                name: asset.name,
                qty: `${qty} ${asset.unit}`,
                total: total,
                date: dateStr,
                unitPrice: unitPrice
            };

            state.history.unshift(createdTx);
            saveState();

            openReceiptModal(txId);
            showToast(`Penjualan ${qty} ${asset.unit} ${asset.name} Berhasil!`);
        }
    });

    // ----------------------------------------------------------------------
    // 4. OFFICIAL DIGITAL RECEIPT MODAL
    // ----------------------------------------------------------------------
    window.openReceiptModal = function(txId) {
        const tx = state.history.find(t => t.id === txId);
        if (!tx) return;

        const content = document.getElementById('receiptContent');
        content.innerHTML = `
            <div class="ga-receipt-card">
                <i class="ri-checkbox-circle-fill receipt-icon"></i>
                <h4 style="color: #10b981; font-weight: 800; margin-top: 0.2rem;">TRANSAKSI MULTI-ASET BERHASIL</h4>
                <p class="text-muted" style="font-size: 0.78rem;">GlobalAsset Exchange Certified</p>
                <div class="receipt-amount ${tx.type === 'BELI' ? 'text-green' : 'text-gold'}">
                    ${formatRupiah(t.total || tx.total)}
                </div>
                <div class="receipt-rows">
                    <div class="r-row"><span class="r-lbl">ID Transaksi</span><span class="r-val">${tx.id}</span></div>
                    <div class="r-row"><span class="r-lbl">Jenis Transaksi</span><span class="r-val">${tx.type}</span></div>
                    <div class="r-row"><span class="r-lbl">Aset / Instrumen</span><span class="r-val">${tx.name}</span></div>
                    <div class="r-row"><span class="r-lbl">Jumlah Unit</span><span class="r-val">${tx.qty}</span></div>
                    <div class="r-row"><span class="r-lbl">Waktu Transaksi</span><span class="r-val">${tx.date} WIB</span></div>
                    <div class="r-row"><span class="r-lbl">Status Settlement</span><span class="r-val text-green">TERVERIFIKASI REAL-TIME</span></div>
                </div>
            </div>
        `;
        openModal('modalReceipt');
    };

    document.getElementById('btnPrintReceipt')?.addEventListener('click', () => window.print());

    function openModal(id) { document.getElementById(id)?.classList.add('active'); }
    function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close')));
    });

    // ----------------------------------------------------------------------
    // 5. LIVE MARKET FLUCTUATION & CANVAS TREND CHART
    // ----------------------------------------------------------------------
    setInterval(() => {
        state.assets.forEach(a => {
            const delta = (Math.random() - 0.48) * 0.006;
            a.change24h = parseFloat((a.change24h + delta * 10).toFixed(2));
            a.priceBuy = Math.round(a.priceBuy * (1 + delta));
            a.priceSell = Math.round(a.priceSell * (1 + delta));
        });

        renderTickerTrack();
        renderAssetCatalog();
        renderActiveAssetView();
        calculateNetWorth();
        drawChart();
    }, 2500);

    const canvas = document.getElementById('trendChartCanvas');
    const ctx = canvas?.getContext('2d');

    function drawChart() {
        if (!ctx || !canvas) return;
        canvas.width = canvas.parentElement.clientWidth - 16;
        canvas.height = canvas.parentElement.clientHeight - 16;

        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        const points = 24;
        const step = w / points;
        const prices = [];
        let val = 100;
        for (let i = 0; i < points; i++) {
            val += (Math.random() - 0.48) * 6;
            prices.push(val);
        }

        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);

        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;

        prices.forEach((p, i) => {
            const x = i * step + step / 2;
            const y = h - ((p - minP) / (maxP - minP || 1)) * (h - 30) - 15;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
        grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fillStyle = grad;
        ctx.fill();
    }

    // Category Tabs Listener
    document.querySelectorAll('.cat-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAssetCatalog();
        });
    });

    document.getElementById('assetSearchInput')?.addEventListener('input', renderAssetCatalog);

    window.addEventListener('resize', drawChart);

    // INIT
    renderApp();
    drawChart();
});
