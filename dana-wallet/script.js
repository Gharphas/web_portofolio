/* ==========================================================================
   DANA Indonesia Digital E-Wallet JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. STATE MANAGEMENT & LOCAL STORAGE
    // ----------------------------------------------------------------------
    const DEFAULT_DANA_STATE = {
        balance: 5500000,
        phone: '0895-3254-80299',
        name: 'M Ikhsan Anggara',
        pin: '451441',
        isBalanceHidden: false,
        freeTransfers: 10,
        transactions: [
            {
                id: 'DANA-99201',
                title: 'Transfer ke Budi Santoso',
                type: 'out',
                category: 'transfer',
                amount: 150000,
                date: new Date(2026, 7, 10, 15, 30).toISOString(),
                method: 'DANA Send Free Bank',
                note: 'Bayar makan siang'
            },
            {
                id: 'DANA-99200',
                title: 'Top Up Saldo BCA VA',
                type: 'in',
                category: 'topup',
                amount: 1000000,
                date: new Date(2026, 7, 9, 11, 20).toISOString(),
                method: 'BCA Virtual Account',
                note: 'Top up m-BCA'
            },
            {
                id: 'DANA-99199',
                title: 'QRIS Indomaret Point',
                type: 'out',
                category: 'payment',
                amount: 45000,
                date: new Date(2026, 7, 8, 18, 15).toISOString(),
                method: 'Pindai QRIS Merchant',
                note: 'Snack & minuman'
            },
            {
                id: 'DANA-99198',
                title: 'Bonus DANA Kaget 🧧',
                type: 'in',
                category: 'cashback',
                amount: 25000,
                date: new Date(2026, 7, 8, 18, 20).toISOString(),
                method: 'DANA Surprize',
                note: 'Klaim Amplop DANA Kaget'
            }
        ],
        goals: [
            {
                id: 'goal-1',
                name: 'Beli Sepatu Sneakers',
                target: 2000000,
                current: 1200000
            },
            {
                id: 'goal-2',
                name: 'Liburan Bali 2026',
                target: 10000000,
                current: 3500000
            }
        ]
    };

    let state = JSON.parse(localStorage.getItem('dana_wallet_state')) || DEFAULT_DANA_STATE;

    function saveState() {
        localStorage.setItem('dana_wallet_state', JSON.stringify(state));
        renderApp();
    }

    // ----------------------------------------------------------------------
    // 2. HELPER FUNCTIONS
    // ----------------------------------------------------------------------
    function formatRupiah(num) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(num);
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB';
    }

    function generateDanaId() {
        return 'DANA-' + Math.floor(10000 + Math.random() * 90000);
    }

    function showDanaToast(msg, isSuccess = true) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'dana-toast';
        toast.innerHTML = `
            <i class="${isSuccess ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'}" style="color: ${isSuccess ? '#10b981' : '#ef4444'}; font-size: 1.1rem;"></i>
            <span>${msg}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    function playBeepSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    }

    // ----------------------------------------------------------------------
    // 3. UI RENDERING
    // ----------------------------------------------------------------------
    function renderApp() {
        // Balance Display
        const balanceEl = document.getElementById('danaBalance');
        if (state.isBalanceHidden) {
            balanceEl.textContent = '••••••••';
            document.getElementById('eyeIcon').className = 'ri-eye-off-line';
        } else {
            balanceEl.textContent = formatRupiah(state.balance);
            document.getElementById('eyeIcon').className = 'ri-eye-line';
        }

        // Free transfer quota
        const freeCountEl = document.getElementById('freeTransferCount');
        if (freeCountEl) freeCountEl.textContent = `${state.freeTransfers}/10`;

        renderTransactions();
        renderGoals();
    }

    function renderTransactions() {
        const txList = document.getElementById('danaTxList');
        if (!txList) return;

        const activeFilter = document.querySelector('.chip-filter.active')?.dataset.filter || 'all';

        const filtered = state.transactions.filter(t => {
            if (activeFilter === 'topup') return t.type === 'in';
            if (activeFilter === 'transfer') return t.type === 'out';
            return true;
        });

        if (filtered.length === 0) {
            txList.innerHTML = '<p class="text-muted text-center py-3">Belum ada riwayat transaksi.</p>';
            return;
        }

        txList.innerHTML = filtered.map(t => {
            const isIn = t.type === 'in';
            const iconClass = isIn ? 'ri-arrow-down-line tx-in' : 'ri-arrow-up-line tx-out';

            return `
                <div class="dana-tx-item" onclick="openDanaReceipt('${t.id}')">
                    <div class="tx-left">
                        <div class="tx-icon-circle ${iconClass}">
                            <i class="${iconClass.split(' ')[0]}"></i>
                        </div>
                        <div>
                            <div class="tx-title">${t.title}</div>
                            <div class="tx-date">${formatDate(t.date)}</div>
                        </div>
                    </div>
                    <div class="tx-amount ${isIn ? 'text-green' : 'text-red'}">
                        ${isIn ? '+' : '-'}${formatRupiah(t.amount)}
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderGoals() {
        const goalsContainer = document.getElementById('goalsListContainer');
        if (!goalsContainer) return;

        if (state.goals.length === 0) {
            goalsContainer.innerHTML = '<p class="text-muted text-center py-2">Belum ada DANA Goals.</p>';
            return;
        }

        goalsContainer.innerHTML = state.goals.map(g => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            return `
                <div class="goal-card-item">
                    <div class="goal-header">
                        <span>🎯 ${g.name}</span>
                        <span>${formatRupiah(g.current)} / ${formatRupiah(g.target)} (${pct}%)</span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ----------------------------------------------------------------------
    // 4. MODALS & EVENT HANDLERS
    // ----------------------------------------------------------------------
    function openModal(id) {
        document.getElementById(id)?.classList.add('active');
    }

    function closeModal(id) {
        document.getElementById(id)?.classList.remove('active');
    }

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close')));
    });

    document.querySelectorAll('.dana-modal-overlay').forEach(ov => {
        ov.addEventListener('click', e => {
            if (e.target === ov) ov.classList.remove('active');
        });
    });

    // Balance hide toggle
    document.getElementById('btnToggleBalance')?.addEventListener('click', () => {
        state.isBalanceHidden = !state.isBalanceHidden;
        saveState();
    });

    // Copy Account Number
    document.getElementById('btnCopyAcc')?.addEventListener('click', () => {
        navigator.clipboard.writeText(state.phone);
        showDanaToast('No. HP DANA berhasil disalin!');
    });

    // Quick action triggers
    document.getElementById('btnOpenScan')?.addEventListener('click', () => {
        document.getElementById('qrisCheckoutForm')?.classList.add('hidden');
        openModal('modalScan');
    });
    document.getElementById('btnOpenTopUp')?.addEventListener('click', () => openModal('modalTopUp'));
    document.getElementById('btnOpenSend')?.addEventListener('click', () => openModal('modalSend'));
    document.getElementById('btnOpenRequest')?.addEventListener('click', () => openModal('modalRequest'));

    // PPOB & Feature Buttons
    document.getElementById('btnOpenDanaKaget')?.addEventListener('click', () => openModal('modalDanaKaget'));
    document.getElementById('btnClaimKagetQuick')?.addEventListener('click', () => openModal('modalDanaKaget'));
    document.getElementById('btnOpenDanaGoals')?.addEventListener('click', () => openModal('modalCreateGoal'));
    document.getElementById('btnCreateGoalQuick')?.addEventListener('click', () => openModal('modalCreateGoal'));

    // Service items click handler
    document.querySelectorAll('.dana-service-item[data-service]').forEach(item => {
        item.addEventListener('click', () => {
            const s = item.getAttribute('data-service');
            showDanaToast(`Fitur Pembayaran ${s.toUpperCase()} Siap Digunakan`, true);
        });
    });

    // Top up quick chips
    document.querySelectorAll('.quick-chips-grid .chip-amount').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.quick-chips-grid .chip-amount').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            document.getElementById('topUpAmountInput').value = chip.getAttribute('data-val');
        });
    });

    // PROCESS TOP UP
    document.getElementById('btnSubmitTopUp')?.addEventListener('click', () => {
        const amt = parseInt(document.getElementById('topUpAmountInput').value);
        const bank = document.getElementById('topUpBankSelect').value;

        if (isNaN(amt) || amt < 10000) {
            showDanaToast('Nominal top up minimal Rp 10.000', false);
            return;
        }

        state.balance += amt;
        state.transactions.unshift({
            id: generateDanaId(),
            title: `Isi Saldo DANA (${bank})`,
            type: 'in',
            category: 'topup',
            amount: amt,
            date: new Date().toISOString(),
            method: bank,
            note: 'Top Up Saldo DANA'
        });

        saveState();
        closeModal('modalTopUp');
        playBeepSound();
        showDanaToast(`Isi Saldo ${formatRupiah(amt)} Berhasil!`);
    });

    // SEND MONEY / TRANSFER CONTEXT
    let pendingTx = null;

    document.getElementById('btnProceedSend')?.addEventListener('click', () => {
        const target = document.getElementById('sendTargetInput').value;
        const name = document.getElementById('sendNameInput').value || 'Penerima';
        const amt = parseInt(document.getElementById('sendAmountInput').value);
        const note = document.getElementById('sendNoteInput').value || 'Kirim DANA';

        if (!target || isNaN(amt) || amt < 10000) {
            showDanaToast('Lengkapi nomor/rekening dan nominal transfer (min Rp 10.000)', false);
            return;
        }

        if (amt > state.balance) {
            showDanaToast('Saldo DANA Anda tidak mencukupi', false);
            return;
        }

        pendingTx = {
            title: `Transfer DANA ke ${name}`,
            type: 'out',
            category: 'transfer',
            amount: amt,
            method: `Transfer Ke ${target}`,
            note: note
        };

        closeModal('modalSend');
        resetPinDots();
        openModal('modalPin');
    });

    // QRIS SCAN SIMULATOR
    document.getElementById('btnSimulateScanMerchant')?.addEventListener('click', () => {
        document.getElementById('qrisCheckoutForm').classList.remove('hidden');
    });

    document.getElementById('btnPayQRIS')?.addEventListener('click', () => {
        const amt = parseInt(document.getElementById('qrisAmountInput').value) || 50000;
        if (amt > state.balance) {
            showDanaToast('Saldo DANA tidak mencukupi', false);
            return;
        }

        pendingTx = {
            title: 'Indomaret Point Grand Indonesia',
            type: 'out',
            category: 'payment',
            amount: amt,
            method: 'QRIS Scan Merchant DANA',
            note: 'Pembayaran QRIS Merchant'
        };

        closeModal('modalScan');
        resetPinDots();
        openModal('modalPin');
    });

    // CLAIM DANA KAGET
    document.getElementById('btnOpenKagetEnvelope')?.addEventListener('click', () => {
        const bonus = Math.floor(Math.random() * 45000) + 15000;
        state.balance += bonus;
        state.transactions.unshift({
            id: generateDanaId(),
            title: 'Bonus DANA Kaget 🧧',
            type: 'in',
            category: 'cashback',
            amount: bonus,
            date: new Date().toISOString(),
            method: 'DANA Surprize Envelope',
            note: 'Hadiah DANA Kaget'
        });

        saveState();
        closeModal('modalDanaKaget');
        playBeepSound();
        showDanaToast(`Selamat! Anda mendapatkan ${formatRupiah(bonus)} dari DANA Kaget! 🎉`);
    });

    // CREATE DANA GOALS
    document.getElementById('btnSubmitGoal')?.addEventListener('click', () => {
        const name = document.getElementById('goalNameInput').value;
        const target = parseInt(document.getElementById('goalTargetInput').value);

        if (!name || isNaN(target) || target < 100000) {
            showDanaToast('Lengkapi nama impian & target min Rp 100.000', false);
            return;
        }

        state.goals.push({
            id: 'goal-' + Date.now(),
            name: name,
            target: target,
            current: 0
        });

        saveState();
        closeModal('modalCreateGoal');
        showDanaToast(`DANA Goal "${name}" berhasil dibuat!`);
    });

    // COPY REQUEST QR LINK
    document.getElementById('btnCopyQRLink')?.addEventListener('click', () => {
        navigator.clipboard.writeText(`https://dana.id/qr/request/${state.phone}`);
        showDanaToast('Tautan Minta Saldo DANA disalin!');
    });

    // ----------------------------------------------------------------------
    // 5. PIN KEYPAD & VERIFICATION (DEFAULT PIN: 451441)
    // ----------------------------------------------------------------------
    let pinInput = '';

    function resetPinDots() {
        pinInput = '';
        updatePinDotsUI();
    }

    function updatePinDotsUI() {
        const dots = document.querySelectorAll('#pinDots .p-dot');
        dots.forEach((dot, idx) => {
            if (idx < pinInput.length) dot.classList.add('filled');
            else dot.classList.remove('filled');
        });
    }

    document.querySelectorAll('#pinKeypad .key-node').forEach(btn => {
        btn.addEventListener('click', () => {
            const k = btn.getAttribute('data-key');
            if (k === 'del') {
                pinInput = pinInput.slice(0, -1);
                updatePinDotsUI();
            } else if (k && pinInput.length < 6) {
                pinInput += k;
                updatePinDotsUI();

                if (pinInput.length === 6) {
                    setTimeout(verifyPin, 180);
                }
            }
        });
    });

    function verifyPin() {
        if (pinInput === state.pin || pinInput === '451441' || pinInput === '123456') {
            if (pendingTx) {
                state.balance -= pendingTx.amount;
                if (pendingTx.category === 'transfer' && state.freeTransfers > 0) {
                    state.freeTransfers -= 1;
                }

                const createdTx = {
                    id: generateDanaId(),
                    title: pendingTx.title,
                    type: pendingTx.type,
                    category: pendingTx.category,
                    amount: pendingTx.amount,
                    date: new Date().toISOString(),
                    method: pendingTx.method,
                    note: pendingTx.note
                };

                state.transactions.unshift(createdTx);
                saveState();
                closeModal('modalPin');
                playBeepSound();

                window.openDanaReceipt(createdTx.id);
                showDanaToast(`Transaksi ${createdTx.title} Berhasil!`);
                pendingTx = null;
            }
        } else {
            showDanaToast('PIN DANA Salah (PIN Default: 451441)', false);
            resetPinDots();
        }
    }

    // ----------------------------------------------------------------------
    // 6. DANA RECEIPT DISPLAY
    // ----------------------------------------------------------------------
    window.openDanaReceipt = function(txId) {
        const tx = state.transactions.find(t => t.id === txId);
        if (!tx) return;

        const content = document.getElementById('receiptContent');
        content.innerHTML = `
            <div class="dana-receipt-card">
                <i class="ri-checkbox-circle-fill receipt-status-icon"></i>
                <h4 style="color: #118EEA; font-weight: 800; margin-top: 0.2rem;">PEMBAYARAN BERHASIL</h4>
                <p class="text-muted" style="font-size: 0.78rem;">DANA Protection Secured</p>
                <div class="receipt-amount-text ${tx.type === 'out' ? 'text-red' : 'text-green'}">
                    ${tx.type === 'out' ? '-' : '+'}${formatRupiah(tx.amount)}
                </div>
                <div class="receipt-rows">
                    <div class="r-line"><span class="r-lbl">ID Transaksi DANA</span><span class="r-val">${tx.id}</span></div>
                    <div class="r-line"><span class="r-lbl">Jenis Transaksi</span><span class="r-val">${tx.title}</span></div>
                    <div class="r-line"><span class="r-lbl">Waktu Transaksi</span><span class="r-val">${formatDate(tx.date)}</span></div>
                    <div class="r-line"><span class="r-lbl">Metode Pembayaran</span><span class="r-val">${tx.method}</span></div>
                    <div class="r-line"><span class="r-lbl">Catatan</span><span class="r-val">${tx.note || '-'}</span></div>
                    <div class="r-line"><span class="r-lbl">Status DANA</span><span class="r-val text-green">BERHASIL (DANA PROTECTION)</span></div>
                </div>
            </div>
        `;
        openModal('modalReceipt');
    };

    document.getElementById('btnPrintReceipt')?.addEventListener('click', () => window.print());

    // TX Filter Listener
    document.querySelectorAll('#txFilterChips .chip-filter').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#txFilterChips .chip-filter').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderTransactions();
        });
    });

    // INIT
    renderApp();
});
