/* ==========================================================================
   SocialPulse Hybrid Social Media JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. STATE INITIALIZATION & LOCAL STORAGE
    // ----------------------------------------------------------------------
    const DEFAULT_SOCIAL_STATE = {
        theme: 'dark',
        user: {
            name: 'M Ikhsan Anggara',
            handle: '@mikhsananggara',
            avatar: '../e-wallet/sasuke.jpg',
            followers: '12.4K',
            following: '380',
            postsCount: 18
        },
        stories: [
            {
                id: 's1',
                name: 'Budi S.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
                img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
                caption: 'Coding marathon malam ini! 💻⚡',
                time: '2 jam lalu'
            },
            {
                id: 's2',
                name: 'Siti R.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
                img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
                caption: 'Liburan santai di pantai 🌊☀️',
                time: '4 jam lalu'
            },
            {
                id: 's3',
                name: 'Dewi L.',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
                img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
                caption: 'Coffee time dulu kawan! ☕✨',
                time: '6 jam lalu'
            }
        ],
        posts: [
            {
                id: 'p1',
                authorName: 'M Ikhsan Anggara',
                authorHandle: '@mikhsananggara',
                authorAvatar: '../e-wallet/sasuke.jpg',
                time: ' Baru saja',
                caption: 'Baru saja meluncurkan proyek web aplikasi modern! Bagaimana pendapat kalian guys? 🔥🚀 #webdev #javascript #programming',
                image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
                likes: 142,
                userReaction: null,
                comments: [
                    { name: 'Budi Santoso', text: 'Keren banget bro! Mantap karyanya 👏' },
                    { name: 'Siti Rahma', text: 'Desainnya clean dan modern! 🚀' }
                ]
            },
            {
                id: 'p2',
                authorName: 'Dev Community Indonesia',
                authorHandle: '@dev_id',
                authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
                time: '3 jam yang lalu',
                caption: 'Tips Frontend 2026: Selalu gunakan Vanilla CSS variables & Flexbox/Grid untuk performa aplikasi web yang maksimal! 💡',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
                likes: 389,
                userReaction: '❤️',
                comments: [
                    { name: 'Dewi Lestari', text: 'Sangat setuju! Performa makin kencang 🔥' }
                ]
            }
        ],
        chats: [
            {
                contactId: 'c1',
                name: 'Budi Santoso',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
                online: true,
                messages: [
                    { text: 'Halo Bro Ikhsan! Gimana kabar proyeknya?', time: '14:20', type: 'in' },
                    { text: 'Halo Budi! Alhamdulillah lancar bro, ini baru beres buat aplikasi hybrid!', time: '14:22', type: 'out' }
                ]
            },
            {
                contactId: 'c2',
                name: 'Siti Rahma',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
                online: true,
                messages: [
                    { text: 'Nanti sore ada jadwal meet dev ya!', time: '12:15', type: 'in' }
                ]
            }
        ],
        groups: [
            { name: 'Indonesian Web Developers', members: '45.2K Anggota', icon: 'ri-code-s-slash-line', bg: 'bg-blue' },
            { name: 'Gamer & Esports ID', members: '88.1K Anggota', icon: 'ri-gamepad-line', bg: 'bg-purple' },
            { name: 'Photography & Creative Hub', members: '23.4K Anggota', icon: 'ri-camera-3-line', bg: 'bg-pink' }
        ],
        marketplace: [
            { id: 'm1', title: 'Laptop Gaming High End 2026', price: 'Rp 14.500.000', location: 'Jakarta Selatan', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=500' },
            { id: 'm2', title: 'Kamera Mirrorless 4K Pristine', price: 'Rp 8.200.000', location: 'Bandung', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500' },
            { id: 'm3', title: 'Sneakers Limited Edition', price: 'Rp 2.100.000', location: 'Surabaya', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=500' }
        ],
        activeChatId: 'c1'
    };

    let state = JSON.parse(localStorage.getItem('socialpulse_state')) || DEFAULT_SOCIAL_STATE;

    function saveState() {
        localStorage.setItem('socialpulse_state', JSON.stringify(state));
        renderApp();
    }

    function showToast(msg) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'sp-toast';
        toast.textContent = msg;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ----------------------------------------------------------------------
    // 2. UI RENDERING ENGINES
    // ----------------------------------------------------------------------
    function renderApp() {
        document.documentElement.setAttribute('data-theme', state.theme || 'dark');
        renderStories();
        renderPosts();
        renderChatPanel();
        renderGroups();
        renderMarketplace();
        renderProfileGrid();
        renderSuggestions();
    }

    // Stories Renderer
    function renderStories() {
        const container = document.getElementById('storiesContainer');
        if (!container) return;

        let html = `
            <div class="story-item" onclick="openCreateStoryModal()">
                <div class="story-ring" style="background: rgba(255,255,255,0.2);">
                    <img src="${state.user.avatar}" alt="My Story">
                </div>
                <span>Cerita Anda</span>
            </div>
        `;

        html += state.stories.map(s => `
            <div class="story-item" onclick="openStoryViewer('${s.id}')">
                <div class="story-ring">
                    <img src="${s.avatar}" alt="${s.name}">
                </div>
                <span>${s.name}</span>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    // Posts Feed Renderer
    function renderPosts() {
        const container = document.getElementById('postsFeedContainer');
        if (!container) return;

        container.innerHTML = state.posts.map(p => {
            const hasReacted = p.userReaction ? true : false;
            return `
                <div class="post-card" id="post-${p.id}">
                    <div class="post-header">
                        <div class="post-author">
                            <img src="${p.authorAvatar}" alt="Avatar" class="avatar-circle-sm">
                            <div class="author-info">
                                <h4>${p.authorName}</h4>
                                <span>${p.authorHandle} • ${p.time}</span>
                            </div>
                        </div>
                        <i class="ri-more-fill text-muted"></i>
                    </div>

                    ${p.image ? `
                        <div class="post-media-box" ondblclick="handleDoubleTapLike('${p.id}')">
                            <img src="${p.image}" alt="Post Media">
                            <div class="floating-heart hidden" id="heart-${p.id}"><i class="ri-heart-fill"></i></div>
                        </div>
                    ` : ''}

                    <div class="post-content-body">
                        <p class="post-caption">${p.caption}</p>
                    </div>

                    <!-- Facebook Reactions Row -->
                    <div class="post-actions-row">
                        <div class="like-btn-wrapper">
                            <div class="reactions-popup-bar">
                                <span class="reaction-emoji" onclick="reactPost('${p.id}', '👍')">👍</span>
                                <span class="reaction-emoji" onclick="reactPost('${p.id}', '❤️')">❤️</span>
                                <span class="reaction-emoji" onclick="reactPost('${p.id}', '😂')">😂</span>
                                <span class="reaction-emoji" onclick="reactPost('${p.id}', '😮')">😮</span>
                                <span class="reaction-emoji" onclick="reactPost('${p.id}', '😢')">😢</span>
                                <span class="reaction-emoji" onclick="reactPost('${p.id}', '😡')">😡</span>
                            </div>
                            <button class="action-btn-item ${hasReacted ? 'text-blue' : ''}" onclick="toggleLikePost('${p.id}')">
                                ${p.userReaction ? p.userReaction : '<i class="ri-thumb-up-line"></i> Suka'}
                                <span>(${p.likes})</span>
                            </button>
                        </div>

                        <button class="action-btn-item" onclick="focusCommentInput('${p.id}')">
                            <i class="ri-chat-3-line"></i> Komentar (${p.comments.length})
                        </button>

                        <button class="action-btn-item" onclick="sharePost('${p.id}')">
                            <i class="ri-share-forward-line"></i> Bagikan
                        </button>
                    </div>

                    <!-- Comments Box -->
                    <div class="comments-section">
                        ${p.comments.map(c => `
                            <div class="comment-bubble-item mt-1">
                                <small class="font-bold text-indigo">${c.name}:</small>
                                <span class="text-sm">${c.text}</span>
                            </div>
                        `).join('')}
                        <div class="comment-input-box">
                            <input type="text" id="comment-input-${p.id}" placeholder="Tulis komentar..." onkeypress="handleCommentSubmit(event, '${p.id}')">
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Chat Messenger Renderer
    function renderChatPanel() {
        const contactsList = document.getElementById('chatContactsList');
        const messagesArea = document.getElementById('chatMessagesArea');
        if (!contactsList || !messagesArea) return;

        // Render Contacts Sidebar
        contactsList.innerHTML = state.chats.map(c => `
            <div class="contact-item ${c.contactId === state.activeChatId ? 'active' : ''}" onclick="switchActiveChat('${c.contactId}')">
                <div class="avatar-wrapper">
                    <img src="${c.avatar}" alt="${c.name}" class="avatar-circle-sm">
                    ${c.online ? '<span class="online-indicator"></span>' : ''}
                </div>
                <div>
                    <h5 class="font-bold">${c.name}</h5>
                    <small class="text-muted">${c.messages[c.messages.length - 1]?.text.slice(0, 20) || ''}...</small>
                </div>
            </div>
        `).join('');

        // Render Messages in Active Chat
        const activeChat = state.chats.find(c => c.contactId === state.activeChatId) || state.chats[0];
        if (activeChat) {
            document.getElementById('activeChatName').textContent = activeChat.name;
            document.getElementById('activeChatAvatar').src = activeChat.avatar;

            messagesArea.innerHTML = activeChat.messages.map(m => `
                <div class="msg-bubble ${m.type === 'out' ? 'msg-out' : 'msg-in'}">
                    <div>${m.text}</div>
                    <div class="msg-time">${m.time}</div>
                </div>
            `).join('');

            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    }

    // Groups Renderer
    function renderGroups() {
        const grid = document.getElementById('groupsGrid');
        if (!grid) return;

        grid.innerHTML = state.groups.map(g => `
            <div class="widget-card">
                <div class="flex items-center gap-3">
                    <div class="brand-logo-box ${g.bg}"><i class="${g.icon}"></i></div>
                    <div>
                        <h4 class="font-bold">${g.name}</h4>
                        <span class="text-sm text-muted">${g.members}</span>
                    </div>
                </div>
                <button class="btn-primary-sp w-100 mt-3" onclick="joinGroup('${g.name}')">Bergabung Ke Grup</button>
            </div>
        `).join('');
    }

    // Marketplace Renderer
    function renderMarketplace() {
        const grid = document.getElementById('marketplaceGrid');
        if (!grid) return;

        grid.innerHTML = state.marketplace.map(m => `
            <div class="post-card">
                <img src="${m.image}" alt="${m.title}" style="height: 180px; width: 100%; object-fit: cover;">
                <div class="p-3">
                    <h4 class="font-bold">${m.title}</h4>
                    <h3 class="text-indigo font-bold">${m.price}</h3>
                    <small class="text-muted">📍 ${m.location}</small>
                    <button class="btn-primary-sp w-100 mt-2" onclick="contactSeller('${m.title}')">Hubungi Penjual (WhatsApp)</button>
                </div>
            </div>
        `).join('');
    }

    // Profile Grid Renderer
    function renderProfileGrid() {
        const grid = document.getElementById('profilePostsGrid');
        if (!grid) return;

        grid.innerHTML = state.posts.map(p => `
            <div class="profile-grid-item" style="height: 150px; background: #000; border-radius: 8px; overflow: hidden;">
                ${p.image ? `<img src="${p.image}" style="width:100%; height:100%; object-fit:cover;">` : `<div class="p-3 text-sm">${p.caption.slice(0, 50)}...</div>`}
            </div>
        `).join('');
    }

    // Suggestions Sidebar
    function renderSuggestions() {
        const list = document.getElementById('suggestionsList');
        const onlineList = document.getElementById('onlineContactsList');

        if (list) {
            list.innerHTML = `
                <div class="suggestion-item">
                    <div class="sug-user">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" class="avatar-circle-xs">
                        <span>Alex Rivera</span>
                    </div>
                    <button class="btn-sm-primary" onclick="showToast('Mengikuti Alex Rivera')">Ikuti</button>
                </div>
            `;
        }

        if (onlineList) {
            onlineList.innerHTML = state.chats.map(c => `
                <div class="suggestion-item" onclick="switchTab('chat')">
                    <div class="sug-user">
                        <div class="avatar-wrapper">
                            <img src="${c.avatar}" class="avatar-circle-xs">
                            <span class="online-indicator"></span>
                        </div>
                        <span>${c.name}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    // ----------------------------------------------------------------------
    // 3. TAB NAVIGATION
    // ----------------------------------------------------------------------
    function switchTab(tabId) {
        document.querySelectorAll('.sp-view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.sp-nav-link').forEach(l => l.classList.remove('active'));

        const targetView = document.getElementById('view' + tabId.charAt(0).toUpperCase() + tabId.slice(1));
        const targetLink = document.querySelector(`.sp-nav-link[data-tab="${tabId}"]`);

        if (targetView) targetView.classList.add('active');
        if (targetLink) targetLink.classList.add('active');
    }

    document.querySelectorAll('.sp-nav-link, [data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            if (tab) switchTab(tab);
        });
    });

    // Theme Toggle
    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        saveState();
    });

    // ----------------------------------------------------------------------
    // 4. INTERACTIVE ACTIONS (LIKE, REACTION, POST, CHAT)
    // ----------------------------------------------------------------------

    // Double Tap Like on Post Image
    window.handleDoubleTapLike = function(postId) {
        const heart = document.getElementById(`heart-${postId}`);
        if (heart) {
            heart.classList.remove('hidden');
            setTimeout(() => heart.classList.add('hidden'), 800);
        }
        window.reactPost(postId, '❤️');
    };

    // React / Like Post
    window.reactPost = function(postId, emoji) {
        const post = state.posts.find(p => p.id === postId);
        if (!post) return;

        if (post.userReaction === emoji) {
            post.userReaction = null;
            post.likes -= 1;
        } else {
            if (!post.userReaction) post.likes += 1;
            post.userReaction = emoji;
        }
        saveState();
    };

    window.toggleLikePost = function(postId) {
        window.reactPost(postId, '👍');
    };

    // Handle Comment Submit
    window.handleCommentSubmit = function(e, postId) {
        if (e.key === 'Enter') {
            const input = document.getElementById(`comment-input-${postId}`);
            const text = input.value.trim();

            if (text) {
                const post = state.posts.find(p => p.id === postId);
                if (post) {
                    post.comments.push({ name: state.user.name, text: text });
                    input.value = '';
                    saveState();
                    showToast('Komentar ditambahkan!');
                }
            }
        }
    };

    // Create New Post
    document.getElementById('btnTriggerCreatePost')?.addEventListener('click', () => openModal('modalCreatePost'));
    document.getElementById('btnOpenCreatePostHeader')?.addEventListener('click', () => openModal('modalCreatePost'));

    document.getElementById('btnSubmitPost')?.addEventListener('click', () => {
        const text = document.getElementById('postTextInput').value;
        const img = document.getElementById('postImageInput').value;

        if (!text && !img) {
            showToast('Tuliskan teks atau sertakan gambar!');
            return;
        }

        state.posts.unshift({
            id: 'p-' + Date.now(),
            authorName: state.user.name,
            authorHandle: state.user.handle,
            authorAvatar: state.user.avatar,
            time: 'Baru saja',
            caption: text,
            image: img || null,
            likes: 1,
            userReaction: '❤️',
            comments: []
        });

        saveState();
        closeModal('modalCreatePost');
        showToast('Postingan Anda berhasil diterbitkan! 🎉');
    });

    // ----------------------------------------------------------------------
    // 5. WHATSAPP CHAT & AUTO-REPLY BOT SIMULATOR
    // ----------------------------------------------------------------------
    window.switchActiveChat = function(contactId) {
        state.activeChatId = contactId;
        renderChatPanel();
    };

    function sendChatMessage() {
        const input = document.getElementById('chatMessageInput');
        const text = input.value.trim();
        if (!text) return;

        const activeChat = state.chats.find(c => c.contactId === state.activeChatId);
        if (!activeChat) return;

        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        activeChat.messages.push({
            text: text,
            time: timeStr,
            type: 'out'
        });

        input.value = '';
        saveState();

        // Simulate WhatsApp Auto-Reply after 1.5s
        setTimeout(() => {
            const replies = [
                'Siap bro! Mantap banget informasinya 👍',
                'Wah keren! Btw hari ini ada agenda apa lagi?',
                'Oke siap, nanti kita kumpul lagi ya!',
                'Terima kasih responnya kawan! 🚀'
            ];
            const autoReply = replies[Math.floor(Math.random() * replies.length)];

            activeChat.messages.push({
                text: autoReply,
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                type: 'in'
            });

            saveState();
            showToast(`Pesan baru dari ${activeChat.name}`);
        }, 1500);
    }

    document.getElementById('btnSendMessage')?.addEventListener('click', sendChatMessage);
    document.getElementById('chatMessageInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    // WHATSAPP CALL SIMULATION
    let callTimerInterval = null;

    document.getElementById('btnAudioCall')?.addEventListener('click', startCallSimulation);
    document.getElementById('btnVideoCall')?.addEventListener('click', startCallSimulation);

    function startCallSimulation() {
        const activeChat = state.chats.find(c => c.contactId === state.activeChatId);
        if (!activeChat) return;

        document.getElementById('callTargetName').textContent = activeChat.name;
        document.getElementById('callAvatarImg').src = activeChat.avatar;
        document.getElementById('callTimer').textContent = 'Memanggil...';

        openModal('modalCallScreen');

        let seconds = 0;
        clearInterval(callTimerInterval);
        callTimerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            document.getElementById('callTimer').textContent = `${mins}:${secs}`;
        }, 1000);
    }

    document.getElementById('btnEndCall')?.addEventListener('click', () => {
        clearInterval(callTimerInterval);
        closeModal('modalCallScreen');
        showToast('Panggilan WhatsApp Selesai');
    });

    // ----------------------------------------------------------------------
    // 6. STORIES VIEWER SYSTEM
    // ----------------------------------------------------------------------
    let storyProgressInterval = null;

    window.openStoryViewer = function(storyId) {
        const story = state.stories.find(s => s.id === storyId);
        if (!story) return;

        document.getElementById('storyAuthorImg').src = story.avatar;
        document.getElementById('storyAuthorName').textContent = story.name;
        document.getElementById('storyTimeTag').textContent = story.time;
        document.getElementById('storyViewerImg').src = story.img;
        document.getElementById('storyCaptionText').textContent = story.caption;

        openModal('modalStoryViewer');

        const bar = document.getElementById('storyProgressFill');
        bar.style.width = '0%';

        let pct = 0;
        clearInterval(storyProgressInterval);
        storyProgressInterval = setInterval(() => {
            pct += 2;
            bar.style.width = pct + '%';
            if (pct >= 100) {
                clearInterval(storyProgressInterval);
                closeModal('modalStoryViewer');
            }
        }, 100);
    };

    // Generic Modal Helpers
    function openModal(id) { document.getElementById(id)?.classList.add('active'); }
    function closeModal(id) {
        document.getElementById(id)?.classList.remove('active');
        clearInterval(storyProgressInterval);
        clearInterval(callTimerInterval);
    }

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close')));
    });

    // INIT
    renderApp();
});
