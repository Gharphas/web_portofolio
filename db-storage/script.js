/* ==========================================================================
   NovaDB Studio - Enterprise Database Engine Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DEFAULT DATABASES INITIALIZATION
    // ----------------------------------------------------------------------
    const DEFAULT_NOVADB_SYSTEM = {
        activeDb: 'UsersDB',
        activeTable: 'users',
        databases: {
            'UsersDB': {
                'users': {
                    schema: [
                        { name: 'id', type: 'Number', isPrimary: true, nullable: false, defaultValue: 'AUTO_INC' },
                        { name: 'name', type: 'String', isPrimary: false, nullable: false, defaultValue: '' },
                        { name: 'email', type: 'String', isPrimary: false, nullable: false, defaultValue: '' },
                        { name: 'role', type: 'String', isPrimary: false, nullable: false, defaultValue: 'User' },
                        { name: 'status', type: 'String', isPrimary: false, nullable: false, defaultValue: 'Active' },
                        { name: 'created_at', type: 'Date', isPrimary: false, nullable: false, defaultValue: 'CURRENT_TIME' }
                    ],
                    rows: [
                        { id: 1, name: 'M Ikhsan Anggara', email: 'ikhsan@dev.id', role: 'Super Admin', status: 'Active', created_at: '2026-08-10 14:00' },
                        { id: 2, name: 'Budi Santoso', email: 'budi@company.com', role: 'Developer', status: 'Active', created_at: '2026-08-11 09:15' },
                        { id: 3, name: 'Siti Rahma', email: 'siti@design.id', role: 'Designer', status: 'Active', created_at: '2026-08-12 11:30' },
                        { id: 4, name: 'Dewi Lestari', email: 'dewi@marketing.id', role: 'Manager', status: 'Inactive', created_at: '2026-08-14 16:45' }
                    ]
                },
                'sessions': {
                    schema: [
                        { name: 'id', type: 'Number', isPrimary: true, nullable: false, defaultValue: 'AUTO_INC' },
                        { name: 'user_id', type: 'Number', isPrimary: false, nullable: false, defaultValue: '1' },
                        { name: 'ip_address', type: 'String', isPrimary: false, nullable: false, defaultValue: '192.168.1.1' }
                    ],
                    rows: [
                        { id: 101, user_id: 1, ip_address: '180.252.19.10' },
                        { id: 102, user_id: 2, ip_address: '180.252.20.44' }
                    ]
                }
            },
            'ECommerceDB': {
                'products': {
                    schema: [
                        { name: 'id', type: 'Number', isPrimary: true, nullable: false, defaultValue: 'AUTO_INC' },
                        { name: 'product_name', type: 'String', isPrimary: false, nullable: false, defaultValue: '' },
                        { name: 'price', type: 'Number', isPrimary: false, nullable: false, defaultValue: '0' },
                        { name: 'stock', type: 'Number', isPrimary: false, nullable: false, defaultValue: '10' }
                    ],
                    rows: [
                        { id: 1, product_name: 'Laptop Gaming Pro 15', price: 15000000, stock: 12 },
                        { id: 2, product_name: 'Wireless Mechanical Keyboard', price: 850000, stock: 45 },
                        { id: 3, product_name: 'Monitor Gaming 144Hz', price: 2750000, stock: 8 }
                    ]
                }
            },
            'SystemLogsDB': {
                'activity_logs': {
                    schema: [
                        { name: 'id', type: 'Number', isPrimary: true, nullable: false, defaultValue: 'AUTO_INC' },
                        { name: 'event_type', type: 'String', isPrimary: false, nullable: false, defaultValue: 'INFO' },
                        { name: 'message', type: 'String', isPrimary: false, nullable: false, defaultValue: '' }
                    ],
                    rows: [
                        { id: 1, event_type: 'AUTH_SUCCESS', message: 'User M Ikhsan Anggara logged in' },
                        { id: 2, event_type: 'DB_BACKUP', message: 'Automatic database snapshot saved' }
                    ]
                }
            }
        }
    };

    let state = JSON.parse(localStorage.getItem('novadb_storage_system')) || DEFAULT_NOVADB_SYSTEM;

    function saveState() {
        localStorage.setItem('novadb_storage_system', JSON.stringify(state));
        renderApp();
    }

    function showDbToast(msg) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'db-toast';
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ----------------------------------------------------------------------
    // 2. UI RENDERING ENGINES
    // ----------------------------------------------------------------------
    function renderApp() {
        renderDbSelector();
        renderTablesList();
        renderBreadcrumbs();
        renderDataGrid();
        renderSchemaTable();
        renderAnalytics();
        calculateStorageUsage();
    }

    // Memory Usage Calculator
    function calculateStorageUsage() {
        const rawJson = JSON.stringify(state);
        const bytes = new Blob([rawJson]).size;
        const kb = (bytes / 1024).toFixed(2);
        const maxKb = 5 * 1024; // 5MB limit
        const pct = Math.min(100, Math.round((kb / maxKb) * 100));

        document.getElementById('storagePercentText').textContent = pct + '%';
        document.getElementById('storageBarFill').style.width = pct + '%';
        document.getElementById('storageSizeText').textContent = `${kb} KB dari 5 MB (LocalStorage)`;
    }

    // Render Database Dropdown Selector
    function renderDbSelector() {
        const select = document.getElementById('activeDbSelect');
        if (!select) return;

        select.innerHTML = Object.keys(state.databases).map(dbName => `
            <option value="${dbName}" ${dbName === state.activeDb ? 'selected' : ''}>${dbName}</option>
        `).join('');
    }

    // Render Tables Tree in Sidebar
    function renderTablesList() {
        const list = document.getElementById('tablesList');
        if (!list) return;

        const currentDb = state.databases[state.activeDb];
        if (!currentDb) {
            list.innerHTML = '<p class="text-muted text-center py-2">Belum ada tabel.</p>';
            return;
        }

        const tableNames = Object.keys(currentDb);
        if (tableNames.length === 0) {
            list.innerHTML = '<p class="text-muted text-center py-2">Belum ada tabel.</p>';
            return;
        }

        list.innerHTML = tableNames.map(tName => {
            const rowCount = currentDb[tName].rows.length;
            const isActive = tName === state.activeTable;
            return `
                <div class="table-tree-item ${isActive ? 'active' : ''}" onclick="switchActiveTable('${tName}')">
                    <div class="t-left">
                        <i class="ri-table-2"></i>
                        <span>${tName}</span>
                    </div>
                    <span class="count-badge">${rowCount}</span>
                </div>
            `;
        }).join('');
    }

    function renderBreadcrumbs() {
        document.getElementById('breadDbName').textContent = state.activeDb;
        document.getElementById('breadTableName').textContent = state.activeTable || 'Tanpa Tabel';
    }

    // Render Data Grid Table
    function renderDataGrid() {
        const thead = document.getElementById('dataGridThead');
        const tbody = document.getElementById('dataGridTbody');
        const searchVal = (document.getElementById('gridSearchInput')?.value || '').toLowerCase();

        const tableObj = state.databases[state.activeDb]?.[state.activeTable];
        if (!tableObj) {
            thead.innerHTML = '<tr><th>Tabel Tidak Ditemukan</th></tr>';
            tbody.innerHTML = '<tr><td class="text-center py-4 text-muted">Pilih atau buat tabel terlebih dahulu.</td></tr>';
            document.getElementById('recordsCountText').textContent = 'Menampilkan 0 baris data';
            return;
        }

        const schema = tableObj.schema;
        const rows = tableObj.rows;

        // Render Table Headers
        thead.innerHTML = `
            <tr>
                ${schema.map(col => `<th>${col.name} ${col.isPrimary ? '<i class="ri-key-2-line text-yellow" title="Primary Key"></i>' : ''}</th>`).join('')}
                <th>Aksi</th>
            </tr>
        `;

        // Filter Rows
        const filteredRows = rows.filter(row => {
            return Object.values(row).some(val => String(val).toLowerCase().includes(searchVal));
        });

        document.getElementById('recordsCountText').textContent = `Menampilkan ${filteredRows.length} dari ${rows.length} baris data`;

        if (filteredRows.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${schema.length + 1}" class="text-center py-4 text-muted">Tidak ada data baris yang cocok.</td></tr>`;
            return;
        }

        // Render Table Rows
        tbody.innerHTML = filteredRows.map(row => `
            <tr>
                ${schema.map(col => {
                    const val = row[col.name] !== undefined ? row[col.name] : '';
                    return `<td><b>${val}</b></td>`;
                }).join('')}
                <td>
                    <button class="btn-danger-db" onclick="deleteRowRecord(${row.id})"><i class="ri-delete-bin-line"></i> Hapus</button>
                </td>
            </tr>
        `).join('');
    }

    // Render Schema Designer Table
    function renderSchemaTable() {
        const tbody = document.getElementById('schemaTableBody');
        if (!tbody) return;

        const tableObj = state.databases[state.activeDb]?.[state.activeTable];
        if (!tableObj) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-3 text-muted">Pilih tabel.</td></tr>';
            return;
        }

        tbody.innerHTML = tableObj.schema.map(col => `
            <tr>
                <td><b>${col.name}</b></td>
                <td><span class="type-badge badge-${col.type.toLowerCase()}">${col.type}</span></td>
                <td>${col.isPrimary ? '<i class="ri-check-line text-green font-bold"></i> Ya (PK)' : 'Tidak'}</td>
                <td>${col.nullable ? 'Ya' : 'Tidak (Required)'}</td>
                <td><code>${col.defaultValue || '-'}</code></td>
                <td>
                    <button class="btn-ghost-db" onclick="showDbToast('Pengeditan skema kolom!')"><i class="ri-edit-line"></i></button>
                </td>
            </tr>
        `).join('');
    }

    // Render Storage Analytics Tab
    function renderAnalytics() {
        const dbs = state.databases;
        const totalDbs = Object.keys(dbs).length;
        let totalTables = 0;
        let totalRecords = 0;

        Object.values(dbs).forEach(db => {
            const tables = Object.values(db);
            totalTables += tables.length;
            tables.forEach(t => totalRecords += t.rows.length);
        });

        document.getElementById('statTotalDbs').textContent = totalDbs;
        document.getElementById('statTotalTables').textContent = totalTables;
        document.getElementById('statTotalRecords').textContent = totalRecords;
    }

    // ----------------------------------------------------------------------
    // 3. DATABASE & TABLE SWITCHING
    // ----------------------------------------------------------------------
    document.getElementById('activeDbSelect')?.addEventListener('change', (e) => {
        state.activeDb = e.target.value;
        const firstTable = Object.keys(state.databases[state.activeDb] || {})[0] || '';
        state.activeTable = firstTable;
        saveState();
    });

    window.switchActiveTable = function(tableName) {
        state.activeTable = tableName;
        saveState();
    };

    // ----------------------------------------------------------------------
    // 4. ACTION TOOLBAR & MODAL HANDLERS
    // ----------------------------------------------------------------------
    function openModal(id) { document.getElementById(id)?.classList.add('active'); }
    function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close')));
    });

    document.querySelectorAll('.db-modal-overlay').forEach(ov => {
        ov.addEventListener('click', e => {
            if (e.target === ov) ov.classList.remove('active');
        });
    });

    // CREATE DATABASE
    document.getElementById('btnOpenCreateDb')?.addEventListener('click', () => openModal('modalCreateDb'));
    document.getElementById('btnSubmitCreateDb')?.addEventListener('click', () => {
        const name = document.getElementById('newDbNameInput').value.trim();
        if (!name) {
            showDbToast('Masukkan nama database!');
            return;
        }

        if (!state.databases[name]) {
            state.databases[name] = {};
            state.activeDb = name;
            state.activeTable = '';
            saveState();
            closeModal('modalCreateDb');
            showDbToast(`Database "${name}" berhasil dibuat!`);
        } else {
            showDbToast('Database dengan nama tersebut sudah ada!');
        }
    });

    // CREATE TABLE
    document.getElementById('btnOpenCreateTable')?.addEventListener('click', () => openModal('modalCreateTable'));
    document.getElementById('btnSubmitCreateTable')?.addEventListener('click', () => {
        const name = document.getElementById('newTableNameInput').value.trim().toLowerCase();
        if (!name) {
            showDbToast('Masukkan nama tabel!');
            return;
        }

        const currentDb = state.databases[state.activeDb];
        if (currentDb && !currentDb[name]) {
            currentDb[name] = {
                schema: [
                    { name: 'id', type: 'Number', isPrimary: true, nullable: false, defaultValue: 'AUTO_INC' },
                    { name: 'name', type: 'String', isPrimary: false, nullable: false, defaultValue: '' }
                ],
                rows: []
            };
            state.activeTable = name;
            saveState();
            closeModal('modalCreateTable');
            showDbToast(`Tabel "${name}" berhasil dibuat!`);
        } else {
            showDbToast('Tabel dengan nama tersebut sudah ada!');
        }
    });

    // DELETE TABLE
    document.getElementById('btnDeleteTable')?.addEventListener('click', () => {
        if (!state.activeTable) return;
        if (confirm(`Apakah Anda yakin ingin menghapus tabel "${state.activeTable}"?`)) {
            delete state.databases[state.activeDb][state.activeTable];
            state.activeTable = Object.keys(state.databases[state.activeDb])[0] || '';
            saveState();
            showDbToast('Tabel berhasil dihapus!');
        }
    });

    // INSERT RECORD FORM GENERATION & SUBMIT
    document.getElementById('btnOpenInsertRecord')?.addEventListener('click', () => {
        const tableObj = state.databases[state.activeDb]?.[state.activeTable];
        if (!tableObj) {
            showDbToast('Pilih tabel terlebih dahulu!');
            return;
        }

        const container = document.getElementById('insertFormFieldsContainer');
        container.innerHTML = tableObj.schema.map(col => {
            if (col.isPrimary) {
                const nextId = tableObj.rows.length > 0 ? Math.max(...tableObj.rows.map(r => r.id || 0)) + 1 : 1;
                return `
                    <div class="form-group">
                        <label>${col.name} (Primary Key Auto)</label>
                        <input type="text" class="db-input" value="${nextId}" disabled data-field="${col.name}">
                    </div>
                `;
            }
            return `
                <div class="form-group">
                    <label>${col.name} (${col.type})</label>
                    <input type="${col.type === 'Number' ? 'number' : 'text'}" class="db-input insert-field-input" data-field="${col.name}" placeholder="Masukkan ${col.name}">
                </div>
            `;
        }).join('');

        openModal('modalInsertRecord');
    });

    document.getElementById('btnSubmitInsertRecord')?.addEventListener('click', () => {
        const tableObj = state.databases[state.activeDb]?.[state.activeTable];
        if (!tableObj) return;

        const newRow = {};
        const inputs = document.querySelectorAll('#insertFormFieldsContainer input');

        inputs.forEach(input => {
            const field = input.getAttribute('data-field');
            let val = input.value;
            if (input.type === 'number') val = Number(val);
            newRow[field] = val;
        });

        tableObj.rows.push(newRow);
        saveState();
        closeModal('modalInsertRecord');
        showDbToast('Baris data baru berhasil disimpan!');
    });

    // DELETE ROW RECORD
    window.deleteRowRecord = function(recordId) {
        const tableObj = state.databases[state.activeDb]?.[state.activeTable];
        if (!tableObj) return;

        tableObj.rows = tableObj.rows.filter(r => r.id !== recordId);
        saveState();
        showDbToast(`Baris ID ${recordId} dihapus.`);
    };

    // ADD SCHEMA COLUMN
    document.getElementById('btnOpenAddColumn')?.addEventListener('click', () => openModal('modalAddColumn'));
    document.getElementById('btnSubmitAddColumn')?.addEventListener('click', () => {
        const name = document.getElementById('colNameInput').value.trim().toLowerCase();
        const type = document.getElementById('colTypeSelect').value;

        if (!name) {
            showDbToast('Masukkan nama kolom!');
            return;
        }

        const tableObj = state.databases[state.activeDb]?.[state.activeTable];
        if (tableObj) {
            tableObj.schema.push({
                name: name,
                type: type,
                isPrimary: false,
                nullable: true,
                defaultValue: ''
            });

            saveState();
            closeModal('modalAddColumn');
            showDbToast(`Kolom "${name}" ditambahkan ke skema!`);
        }
    });

    // ----------------------------------------------------------------------
    // 5. INTERACTIVE SQL QUERY ENGINE & PARSER
    // ----------------------------------------------------------------------
    document.querySelectorAll('.chip-query').forEach(chip => {
        chip.addEventListener('click', () => {
            document.getElementById('sqlQueryInput').value = chip.getAttribute('data-sql');
        });
    });

    document.getElementById('btnExecuteSql')?.addEventListener('click', executeSqlQuery);

    function executeSqlQuery() {
        const query = document.getElementById('sqlQueryInput').value.trim();
        const startTime = performance.now();

        const thead = document.getElementById('sqlResultThead');
        const tbody = document.getElementById('sqlResultTbody');
        const timeTag = document.getElementById('queryExecTime');

        if (!query) {
            showDbToast('Ketik perintah SQL terlebih dahulu!');
            return;
        }

        try {
            const tableObj = state.databases[state.activeDb]?.[state.activeTable];
            if (!tableObj) throw new Error('Tabel aktif tidak ditemukan');

            // Parse Simple SELECT * FROM
            if (query.toUpperCase().startsWith('SELECT')) {
                let rows = tableObj.rows;

                // Simple WHERE filter simulation
                if (query.toUpperCase().includes('WHERE')) {
                    const wherePart = query.split(/WHERE/i)[1].trim();
                    const [field, valRaw] = wherePart.split('=').map(s => s.trim().replace(/['";]/g, ''));
                    rows = rows.filter(r => String(r[field]).toLowerCase() === valRaw.toLowerCase());
                }

                thead.innerHTML = `<tr>${tableObj.schema.map(c => `<th>${c.name}</th>`).join('')}</tr>`;
                tbody.innerHTML = rows.map(r => `<tr>${tableObj.schema.map(c => `<td><b>${r[c.name] || ''}</b></td>`).join('')}</tr>`).join('');

                const endTime = performance.now();
                timeTag.textContent = `Query OK, ${rows.length} rows (${(endTime - startTime).toFixed(2)}ms)`;
                showDbToast('Query SQL berhasil dieksekusi!');
            }
            // Parse Simple INSERT INTO
            else if (query.toUpperCase().startsWith('INSERT')) {
                const newId = tableObj.rows.length + 1;
                tableObj.rows.push({ id: newId, name: 'Sample User SQL', email: 'sql@dev.id', role: 'User', status: 'Active' });
                saveState();

                const endTime = performance.now();
                timeTag.textContent = `INSERT OK, 1 row affected (${(endTime - startTime).toFixed(2)}ms)`;
                showDbToast('Data berhasil dimasukkan via SQL!');
            }
            // Parse Simple UPDATE
            else if (query.toUpperCase().startsWith('UPDATE')) {
                tableObj.rows.forEach(r => r.status = 'VIP');
                saveState();

                const endTime = performance.now();
                timeTag.textContent = `UPDATE OK, ${tableObj.rows.length} rows updated (${(endTime - startTime).toFixed(2)}ms)`;
                showDbToast('Data berhasil di-update via SQL!');
            } else {
                throw new Error('Perintah SQL tidak dikenal. Gunakan SELECT, INSERT, atau UPDATE.');
            }
        } catch (err) {
            timeTag.textContent = 'Error Query Execution';
            tbody.innerHTML = `<tr><td class="text-rose font-bold py-3">${err.message}</td></tr>`;
            showDbToast('Gagal mengeksekusi query SQL.');
        }
    }

    // ----------------------------------------------------------------------
    // 6. BACKUP, EXPORT & RESTORE ENGINE
    // ----------------------------------------------------------------------

    // Export Database to .JSON Backup Dump
    document.getElementById('btnExportJsonDump')?.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `NovaDB_Backup_${state.activeDb}_${Date.now()}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        showDbToast('Backup Database .JSON berhasil diunduh!');
    });

    // Export Table to .CSV
    document.getElementById('btnExportCsv')?.addEventListener('click', () => {
        const tableObj = state.databases[state.activeDb]?.[state.activeTable];
        if (!tableObj) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += tableObj.schema.map(c => c.name).join(",") + "\n";

        tableObj.rows.forEach(r => {
            csvContent += tableObj.schema.map(c => `"${r[c.name] || ''}"`).join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${state.activeTable}_export.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        showDbToast(`Tabel ${state.activeTable} diekspor ke CSV!`);
    });

    // Import JSON Backup File Reader
    document.getElementById('importJsonInput')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (importedData.databases) {
                    state = importedData;
                    saveState();
                    showDbToast('Database berhasil dipulihkan dari backup JSON!');
                }
            } catch (err) {
                showDbToast('Format file JSON backup tidak valid!');
            }
        };
        reader.readAsText(file);
    });

    // Reset All to Demo State
    document.getElementById('btnResetAllDb')?.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mereset seluruh database ke demo default?')) {
            state = DEFAULT_NOVADB_SYSTEM;
            saveState();
            showDbToast('Database di-reset ke default demo!');
        }
    });

    // ----------------------------------------------------------------------
    // 7. TAB NAVIGATION & LIVE SEARCH LISTENERS
    // ----------------------------------------------------------------------
    document.querySelectorAll('.ws-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.ws-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.ws-tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const tabId = 'tab' + btn.getAttribute('data-tab').charAt(0).toUpperCase() + btn.getAttribute('data-tab').slice(1);
            document.getElementById(tabId)?.classList.add('active');
        });
    });

    document.getElementById('gridSearchInput')?.addEventListener('input', renderDataGrid);

    // INIT
    renderApp();
});
