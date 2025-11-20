const Utils = {
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    qs: (selector, parent = document) => (parent || document).querySelector(selector),
    qsa: (selector, parent = document) => (parent || document).querySelectorAll(selector),
};

const Notifier = {
    activeNotification: null,
    show(message, type = 'info') {
        try {
            if (this.activeNotification) this.activeNotification.remove();
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
            notification.style.cssText = `top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;`;
            const iconMap = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
            notification.innerHTML = `<i class="fas ${iconMap[type] || iconMap.info} me-2"></i> ${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
            document.body.appendChild(notification);
            this.activeNotification = notification;
            notification.querySelector('.btn-close')?.addEventListener('click', () => this.hide());
            setTimeout(() => this.hide(), 5000);
        } catch (err) {
            console.error('Notifier error', err);
        }
    },
    hide() {
        if (this.activeNotification && this.activeNotification.parentNode) {
            this.activeNotification.remove();
            this.activeNotification = null;
        }
    }
};

const Auth = {
    getUser: () => JSON.parse(localStorage.getItem('usuario')) || null,
    setUser: (userData) => localStorage.setItem('usuario', JSON.stringify(userData)),
    clearUser: () => localStorage.removeItem('usuario'),

    _handleAuthRequest: async (endpoint, formData, form) => {
        try {
            Notifier.show('Procesando...', 'info');
            const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.mensaje || 'Error en la operación');

            Auth.setUser(data.usuario);
            Notifier.show(`¡Bienvenido ${data.usuario.nombre || data.usuario.nombreCompleto || ''}!`, 'success');

            if (form) {
                const modal = bootstrap.Modal.getInstance(form.closest('.modal'));
                modal?.hide();
            }

            setTimeout(() => UI.updateForLoggedInUser(data.usuario), 800);
        } catch (error) {
            Notifier.show(error.message || 'Error en autenticación', 'danger');
            console.error('Error de autenticación:', error);
        }
    },

    handleRegistro: async () => {
        const form = Utils.qs('#registroForm');
        if (!form || !Validation.validateForm(form)) return Notifier.show('Por favor corrige los errores.', 'danger');
        const formData = {
            nombreCompleto: Utils.qs('#nombreRegistro')?.value,
            email: Utils.qs('#emailRegistro')?.value,
            contrasena: Utils.qs('#passwordRegistro')?.value
        };
        await Auth._handleAuthRequest('/api/usuarios/registro', formData, form);
    },

    handleLogin: async () => {
        const form = Utils.qs('#loginForm');
        if (!form || !Validation.validateForm(form)) return Notifier.show('Por favor corrige los errores.', 'danger');
        const formData = {
            email: Utils.qs('#emailLogin')?.value,
            contrasena: Utils.qs('#passwordLogin')?.value,
            recordar: Utils.qs('#recordarLogin')?.checked
        };
        await Auth._handleAuthRequest('/api/usuarios/login', formData, form);
    },

    handleRecuperarPassword: () => {
        const email = Utils.qs('#emailRecuperar')?.value;
        if (!Utils.isValidEmail(email)) return Notifier.show('Correo electrónico inválido.', 'danger');
        Notifier.show('Enlace de recuperación enviado a tu correo.', 'info');
        bootstrap.Modal.getInstance(Utils.qs('#recuperarPasswordModal'))?.hide();
    },

    cerrarSesion: () => {
        Auth.clearUser();
        Notifier.show('¡Sesión cerrada!', 'info');
        setTimeout(() => UI.restoreInitialState(), 700);
    }
};

const UI = {
    updateForLoggedInUser: (usuario) => {
        try {
            const heroTitle = Utils.qs('.hero-title');
            if (heroTitle) heroTitle.textContent = `¡Bienvenido ${usuario.nombreCompleto || usuario.nombre || ''}!`;
            const heroSubtitle = Utils.qs('.hero-subtitle');
            if (heroSubtitle) heroSubtitle.textContent = 'Radio felicidad 88.9 FM - Tu música favorita te espera';
            const headerAuth = Utils.qs('#headerAuthButtons');
            if (headerAuth) {
                headerAuth.innerHTML = `<button class="btn-custom-outline" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>`;
                Utils.qs('#logoutBtn')?.addEventListener('click', Auth.cerrarSesion);
            }
            Utils.qs('#authCards') && (Utils.qs('#authCards').style.display = 'none');
            Utils.qs("#welcomeSection")?.classList.add("d-none");

            Utils.qs("#rankingSection")?.classList.remove("d-none");
            Utils.qs("#listaCanciones")?.classList.remove("d-none");
        } catch (err) {
            console.error('UI.updateForLoggedInUser error', err);
        }
    },

    restoreInitialState: () => {
        try {
            Utils.qs('.hero-title') && (Utils.qs('.hero-title').textContent = 'Bienvenido a Peeps');
            Utils.qs('.hero-subtitle') && (Utils.qs('.hero-subtitle').textContent = 'Radio felicidad 88.9 FM');
            if (Utils.qs('#headerAuthButtons')) {
                Utils.qs('#headerAuthButtons').innerHTML = `
                    <button class="btn-custom-outline" data-bs-toggle="modal" data-bs-target="#loginModal"><i class="fas fa-user"></i> Iniciar Sesión</button>
                    <button class="btn-custom-primary" data-bs-toggle="modal" data-bs-target="#registroModal"><i class="fas fa-plus"></i> Registrarse</button>`;
            }
            Utils.qs('#authCards') && (Utils.qs('#authCards').style.display = '');
            Utils.qs("#welcomeSection")?.classList.remove("d-none");
        } catch (err) {
            console.error('UI.restoreInitialState error', err);
        }
    },

    setupEventListeners: () => {
        Utils.qs('#registroSubmitBtn')?.addEventListener('click', Auth.handleRegistro);
        Utils.qs('#loginSubmitBtn')?.addEventListener('click', Auth.handleLogin);
        Utils.qs('#recuperarPasswordSubmitBtn')?.addEventListener('click', Auth.handleRecuperarPassword);
        Utils.qs('#terminosLink')?.addEventListener('click', (e) => { e.preventDefault(); new bootstrap.Modal(Utils.qs('#terminosModal')).show(); });
        Utils.qs('#recuperarPasswordLink')?.addEventListener('click', (e) => { e.preventDefault(); new bootstrap.Modal(Utils.qs('#recuperarPasswordModal')).show(); });
    },

    setupMobileMenu: () => {
        const hamburger = Utils.qs('#hamburgerMenu');
        const sidebar = Utils.qs('#sidebarMobile');
        const overlay = Utils.qs('#mobileOverlay');
        if (!hamburger || !sidebar) return;
        const closeMenu = () => {
            sidebar.classList.remove('open');
            overlay?.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };
        const openMenu = () => {
            sidebar.classList.add('open');
            overlay?.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            sidebar.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        hamburger?.addEventListener('click', () => (sidebar.classList.contains('open') ? closeMenu() : openMenu()));
        overlay?.addEventListener('click', closeMenu);
        window.addEventListener('resize', () => { if (window.innerWidth > 991.98) closeMenu(); });
    },

    // Sidebar navigation: maneja Playlist y Premium (ambos cargan en mainDynamicContent)
    setupSidebarNavigation: () => {
        const contentContainer = Utils.qs('#mainDynamicContent');
        const initInjectedPlaylistUI = (container) => {
            const crearBtn = Utils.qs('.btn-crear', container);
            if (crearBtn) {
                crearBtn.addEventListener('click', async () => {
                    const nombre = prompt("Ingresa el nombre de tu nueva playlist:");
                    if (!nombre || !nombre.trim()) return;
                    try {
                        const response = await fetch('/api/playlist/crear', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ nombre })
                        });
                        if (!response.ok) throw new Error('No se pudo crear la playlist');
                        const nuevaPlaylist = await response.json();
                        Notifier.show(`Playlist "${nuevaPlaylist.nombre}" creada!`, 'success');
                        addPlaylistToCarrusel(nuevaPlaylist);
                        updateScrollButtons();
                        updatePlaylistCount();
                    } catch (error) {
                        Notifier.show(error.message, 'danger');
                    }
                });
            }
            initLikedSongsCarousel(container);
        };

        const navItems = Array.from(Utils.qsa('.sidebar .nav-item') || []);
        navItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                const section = Utils.qs('span', this)?.textContent?.trim().toLowerCase();

                if (!contentContainer) {
                    Notifier.show('Contenedor principal no encontrado', 'danger');
                    return;
                }

                if (section === 'premium') {
                    const usuario = Auth.getUser();
                    
                    if (!usuario) {
                        AuthPopup.show("premium");
                        return;
                    }
                    // cargar vista premium
                    loadView('/premium');
                    return;
                }

                if (section === 'playlist') {
                    const usuario = Auth.getUser();
                    if (!usuario) {
                        AuthPopup.show();
                        return;
                    }

                    contentContainer.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                    contentContainer.style.opacity = 0;
                    contentContainer.style.transform = "translateY(15px)";

                    setTimeout(() => {
                        fetch('/playlist', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                            .then(response => response.text())
                            .then(html => {
                                contentContainer.innerHTML = html;
                                contentContainer.style.opacity = 1;
                                contentContainer.style.transform = "translateY(0)";
                                history.pushState({ page: 'playlist' }, 'Playlist', '/playlist');

                                setTimeout(() => {
                                    initInjectedPlaylistUI(contentContainer);
                                    addViewButtonsToExistingPlaylists();
                                    initCarruselScroll();
                                    updateScrollButtons();
                                }, 250);
                            })
                            .catch(error => {
                                console.error('Error cargando Playlist:', error);
                                Notifier.show('Error al cargar Playlist', 'danger');
                            });
                    }, 250);
                    return;
                }

                if (section === 'inicio' || section === 'home') {
                    window.location.href = '/';
                }
            });
        });

        // fallback: premium button específico (si existe fuera del sidebar)
        Utils.qs("#premiumBtn")?.addEventListener("click", function (e) {
            e.preventDefault();

            const usuario = Auth.getUser();

            if (!usuario) {
                AuthPopup.show("premium");
                return;
            }

            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            loadView('/premium');
        });
    }
};

const Validation = {
    _fieldErrorState: (field, message, isValid) => {
        if (!field || !field.parentNode) return;
        let errorContainer = field.parentNode.querySelector('.invalid-feedback');
        if (!isValid) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            if (!errorContainer) {
                errorContainer = document.createElement('div');
                errorContainer.className = 'invalid-feedback d-block';
                errorContainer.textContent = message;
                field.parentNode.appendChild(errorContainer);
            } else {
                errorContainer.textContent = message;
                errorContainer.classList.add('d-block');
            }
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            if (errorContainer) errorContainer.remove();
        }
    },
    validateField: (field) => {
        if (!field) return true;
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        let isValid = true, message = '';
        switch (field.id) {
            case 'nombreRegistro': isValid = value.length >= 2; message = 'El nombre debe tener al menos 2 caracteres'; break;
            case 'emailRegistro': case 'emailLogin': case 'emailRecuperar': isValid = Utils.isValidEmail(value); message = 'Correo electrónico inválido'; break;
            case 'passwordRegistro': isValid = value.length >= 6; message = 'La contraseña debe tener al menos 6 caracteres'; break;
            case 'confirmPasswordRegistro': isValid = value === Utils.qs('#passwordRegistro')?.value; message = 'Las contraseñas no coinciden'; break;
            case 'passwordLogin': isValid = value.length > 0; message = 'La contraseña es requerida'; break;
            case 'terminosRegistro': isValid = value; message = 'Debes aceptar los términos'; break;
        }
        Validation._fieldErrorState(field, message, isValid);
        return isValid;
    },
    validateForm: (form) => {
        if (!form) return false;
        let isFormValid = true;
        Utils.qsa('input[required]', form).forEach(field => {
            if (!Validation.validateField(field)) isFormValid = false;
        });
        return isFormValid;
    },
    setupFormValidations: () => {
        ['#registroForm', '#loginForm', '#recuperarPasswordForm'].forEach(formId => {
            const form = Utils.qs(formId);
            if (form) {
                Utils.qsa('input[required]', form).forEach(input => {
                    input.addEventListener('blur', () => Validation.validateField(input));
                    input.addEventListener('input', () => { if (input.classList.contains('is-invalid')) Validation.validateField(input); });
                });
            }
        });
    }
};

// Reproductor de música
function playSong(id) {
    if (!id) {
        console.warn('ID de canción inválido:', id);
        Notifier.show('No se pudo reproducir la canción. ID inválido.', 'danger');
        return;
    }
    const url = `/music/reproductor?id=${id}`;
    window.location.href = url;
}

function initHomePageListeners() {
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-to-playlist') || e.target.closest('.btn-like')) return;
            const id = item.getAttribute('data-id');
            if (!id) {
                console.warn('Elemento sin data-id', item);
                Notifier.show('No se pudo reproducir la canción', 'danger');
                return;
            }
            playSong(id);
        });
    });
}

function addViewButtonsToExistingPlaylists() {
    const items = document.querySelectorAll('.carrusel-item');
    items.forEach(item => {
        if (!item.querySelector('.btn-view-playlist')) {
            const overlay = document.createElement('div');
            overlay.className = 'playlist-overlay';
            overlay.innerHTML = `<button class="btn btn-sm btn-primary btn-view-playlist" data-playlist-id="${item.dataset.playlistId || ''}">Ver</button>`;
            item.appendChild(overlay);
            if (!item.querySelector('.playlist-name')) {
                const name = document.createElement('p');
                name.className = 'playlist-name';
                name.textContent = 'Playlist';
                item.appendChild(name);
            }
        }
    });
}

const Search = {
    currentSong: null,
    audioPlayer: null,
    _createSongItem: (song) => {
        const item = document.createElement("div");
        item.classList.add("song-item");
        item.setAttribute('data-id', song.id);
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.titulo}" class="cover-thumb"> 
            <div class="song-info">
                <h5>${song.titulo}</h5> 
                <small>${song.artista}</small> 
            </div>
            <div class="song-actions">
                <button class="btn-add-to-playlist" data-id="${song.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            playSong(song.id);
        });
        return item;
    },
    _filterSongs: async () => {
        const query = Utils.qs("#searchInput")?.value.toLowerCase().trim() || '';
        const resultsContainer = Utils.qs("#searchResults");
        if (!resultsContainer) return;
        resultsContainer.innerHTML = "";
        if (!query) return;
        try {
            const response = await fetch(`/music/api/buscar?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Respuesta negativa de la API');
            const filtradas = await response.json();
            if (filtradas.length === 0) {
                resultsContainer.innerHTML = `<p style="text-align:center;color:#888;">No se encontraron canciones</p>`;
                return;
            }
            filtradas.forEach(c => {
                const item = Search._createSongItem(c);
                resultsContainer.appendChild(item);
                setTimeout(() => item.classList.add("show"), 50);
            });
        } catch (error) {
            console.error("Error al buscar canciones:", error);
            resultsContainer.innerHTML = `<p style="text-align:center;color:#888;">Error al cargar resultados</p>`;
        }
    },
    init: () => {
        Search.audioPlayer = Utils.qs("#audioPlayerSearch");
        const searchBtn = Utils.qs("#searchBtn");
        const searchOverlay = Utils.qs("#overlay");
        const searchInput = Utils.qs("#searchInput");
        searchBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            searchOverlay?.classList.add("active");
            document.body.classList.add("modal-open");
            setTimeout(() => searchInput?.focus(), 300);
        });
        searchOverlay?.addEventListener("click", (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove("active");
                document.body.classList.remove("modal-open");
                if (Search.audioPlayer && !Search.audioPlayer.paused) {
                    Search.audioPlayer.pause();
                    Search.audioPlayer.currentTime = 0;
                }
                Search.currentSong = null;
            }
        });
        searchInput?.addEventListener("input", Search._filterSongs);
    }
};

const initializePeepsApp = () => {
    UI.setupSidebarNavigation();
    UI.setupMobileMenu();
    UI.setupEventListeners();
    Validation.setupFormValidations();
    Search.init();
    initHomePageListeners();

    const user = Auth.getUser();
    if (user) {
        UI.updateForLoggedInUser(user);
    } else {
        UI.restoreInitialState();
    }
};

// Likes
async function handleLikeClick(e) {
    const likeButton = e.target.closest('.btn-like');
    if (!likeButton) return;
    e.stopPropagation();
    const cancionId = likeButton.dataset.id;
    if (!cancionId) return;
    try {
        const response = await fetch(`/music/api/cancion/${cancionId}/toggle-like`, { method: 'POST' });
        if (!response.ok) throw new Error('Error al actualizar like');
        const resultado = await response.json();
        const icon = likeButton.querySelector('i');
        if (resultado.esLiked) {
            likeButton.classList.add('liked');
            icon?.classList.remove('far');
            icon?.classList.add('fas');
            Notifier.show('Añadida a "Me Gusta"', 'success');
        } else {
            likeButton.classList.remove('liked');
            icon?.classList.remove('fas');
            icon?.classList.add('far');
            Notifier.show('Eliminada de "Me Gusta"', 'info');
        }
    } catch (error) {
        Notifier.show(error.message || 'Error en like', 'danger');
    }
}

// Abrir modal "agregar a playlist"
async function handleAddSongClick(e) {
    const addButton = e.target.closest('.btn-add-to-playlist');
    if (!addButton) return;
    e.stopPropagation();
    const cancionId = addButton.dataset.id;
    if (!cancionId) return;
    const modalElement = document.getElementById('addToPlaylistModal');
    const modalList = document.getElementById('playlist-modal-list');
    if (!modalElement || !modalList) return Notifier.show('Modal de playlists no disponible', 'danger');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modalElement.dataset.cancionId = cancionId;
    modalList.innerHTML = '<p>Cargando playlists...</p>';
    try {
        const response = await fetch('/api/playlists');
        if (!response.ok) throw new Error('No se pudieron cargar las playlists');
        const playlists = await response.json();
        modalList.innerHTML = '';
        if (!playlists.length) {
            modalList.innerHTML = '<p>Aún no has creado ninguna playlist.</p>';
            return;
        }
        playlists.forEach(playlist => {
            const item = document.createElement('button');
            item.className = 'list-group-item list-group-item-action btn-playlist-select';
            item.textContent = playlist.nombre;
            item.dataset.playlistId = playlist.id;
            modalList.appendChild(item);
        });
    } catch (error) {
        modalList.innerHTML = `<p class="text-danger">${error.message}</p>`;
    }
    modal.show();
}

// Listener seguro para lista del modal (si existe)
if (document.getElementById('playlist-modal-list')) {
    document.getElementById('playlist-modal-list').addEventListener('click', (e) => {
        const playlistButton = e.target.closest('.btn-playlist-select');
        if (!playlistButton) return;
        const playlistId = playlistButton.dataset.playlistId;
        const modalElement = document.getElementById('addToPlaylistModal');
        const cancionId = modalElement?.dataset?.cancionId;
        if (!playlistId || !cancionId) {
            Notifier.show('Error, falta información', 'danger');
            return;
        }
        Notifier.show('Añadiendo...', 'info');
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.hide();
        fetch('/api/playlist/agregarCancion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cancionId: parseInt(cancionId), playlistId: parseInt(playlistId) })
        })
            .then(response => {
                if (!response.ok) return response.json().then(err => { throw new Error(err.error || 'Error al añadir la canción'); });
                return response.json();
            })
            .then(resultado => {
                Notifier.show(`"${resultado.cancionTitulo}" añadido a "${resultado.playlistNombre}"!`, 'success');
            })
            .catch(error => {
                Notifier.show(error.message || 'Error al añadir', 'danger');
            });
    });
}

// Quitar backdrop al cerrar modal (si existe)
const addToPlaylistModalEl = document.getElementById('addToPlaylistModal');
if (addToPlaylistModalEl) {
    addToPlaylistModalEl.addEventListener('hidden.bs.modal', (e) => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        document.body.style.overflow = 'auto';
    });
}

// Delegación general de clicks (likes, add-to-playlist)
document.body.addEventListener('click', handleAddSongClick);
document.body.addEventListener('click', handleLikeClick);

// Ver canciones de playlist (modal)
async function showPlaylistSongsModal(playlistId, playlistNombre) {
    const modalEl = document.getElementById('viewPlaylistModal');
    if (!modalEl) return Notifier.show('Modal de visualización no disponible', 'danger');
    const modalBody = modalEl.querySelector('.modal-body');
    const modalTitle = modalEl.querySelector('.modal-title');
    modalTitle.textContent = `Playlist: ${playlistNombre}`;
    modalBody.innerHTML = 'Cargando canciones...';
    try {
        const response = await fetch(`/api/playlist/${playlistId}/canciones`);
        if (!response.ok) throw new Error('No se pudieron cargar las canciones');
        const canciones = await response.json();
        if (!canciones.length) {
            modalBody.innerHTML = '<p>No hay canciones en esta playlist.</p>';
            return;
        }
        const table = document.createElement('table');
        table.className = 'table table-striped';
        table.innerHTML = `
            <thead>
                <tr><th>Cancion</th><th>Artista</th></tr>
            </thead>
            <tbody>
                ${canciones.map(c => `<tr><td>${c.titulo}</td><td>${c.artista}</td></tr>`).join('')}
            </tbody>
        `;
        modalBody.innerHTML = '';
        modalBody.appendChild(table);
    } catch (err) {
        modalBody.innerHTML = `<p class="text-danger">${err.message}</p>`;
    }
    const modal = new bootstrap.Modal(modalEl, { backdrop: false, keyboard: true });
    modalEl.style.zIndex = 1055;
    modal.show();
    modalEl.addEventListener('hidden.bs.modal', () => {
        modalBody.innerHTML = '';
        modalEl.style.zIndex = '';
    }, { once: true });
}

// Delegación para botones "Ver" de playlists
document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-view-playlist');
    if (!btn) return;
    const playlistItem = btn.closest('.carrusel-item');
    const playlistId = btn.dataset.playlistId || playlistItem?.dataset?.playlistId;
    const playlistNombre = playlistItem?.querySelector('.playlist-name')?.textContent || 'Playlist';
    if (!playlistId) return Notifier.show('Error: No se encontró ID de la playlist', 'danger');
    showPlaylistSongsModal(playlistId, playlistNombre);
});

// Carrusel / playlists helpers
function updateScrollButtons() {
    const carrusel = document.querySelector('.carrusel');
    const btnLeft = document.querySelector('.scroll-btn.left');
    const btnRight = document.querySelector('.scroll-btn.right');
    if (!carrusel || !btnLeft || !btnRight) return;
    const items = carrusel.querySelectorAll('.carrusel-item');
    if (items.length > 3 && carrusel.scrollWidth > carrusel.clientWidth + 5) {
        btnLeft.classList.add('show');
        btnRight.classList.add('show');
    } else {
        btnLeft.classList.remove('show');
        btnRight.classList.remove('show');
    }
}

function updatePlaylistCount() {
    const countEl = document.querySelector('.playlist-count');
    if (!countEl) return;
    const total = document.querySelectorAll('.carrusel-item').length;
    countEl.textContent = `${total} playlist${total !== 1 ? 's' : ''}`;
}

function initCarruselScroll() {
    const carrusel = document.querySelector('.carrusel');
    const btnLeft = document.querySelector('.scroll-btn.left');
    const btnRight = document.querySelector('.scroll-btn.right');
    if (!carrusel || !btnLeft || !btnRight) return;
    const itemWidth = carrusel.querySelector('.carrusel-item')?.offsetWidth || 200;
    btnLeft.addEventListener('click', () => carrusel.scrollBy({ left: -itemWidth, behavior: 'smooth' }));
    btnRight.addEventListener('click', () => carrusel.scrollBy({ left: itemWidth, behavior: 'smooth' }));
    const updateButtons = () => {
        const maxScrollLeft = carrusel.scrollWidth - carrusel.clientWidth;
        btnLeft.style.display = carrusel.scrollLeft > 0 ? 'block' : 'none';
        btnRight.style.display = carrusel.scrollLeft < maxScrollLeft - 1 ? 'block' : 'none';
    };
    carrusel.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
}

async function initLikedSongsCarousel(contentContainer) {
    if (!contentContainer) contentContainer = document;
    const container = contentContainer.querySelector('.liked-carousel');
    if (!container) return;
    const track = container.querySelector('.liked-track');
    if (!track) {
        console.error("Error de DOM: No se encontró '.liked-track' dentro de '.liked-carousel'.");
        return;
    }
    track.innerHTML = '<p>Cargando tus "Me Gusta"...</p>';
    try {
        const response = await fetch('/music/api/canciones/liked');
        if (!response.ok) throw new Error("Error al cargar las canciones que te gustan");
        const canciones = await response.json();
        track.innerHTML = '';
        if (canciones.length === 0) {
            track.innerHTML = '<p style="padding-left: 1rem;">Aún no tienes canciones con "Me Gusta".</p>';
            container.style.animationPlayState = 'paused';
            return;
        }
        container.style.animationPlayState = 'running';
        canciones.forEach(c => {
            const item = document.createElement('div');
            item.className = 'liked-item';
            item.dataset.id = c.id;
            item.innerHTML = `
                <img src="${c.cover}" alt="${c.titulo}">
                <div class="liked-overlay">
                    <p>${c.titulo}</p>
                    <span>${c.artista}</span>
                </div>
            `;
            track.appendChild(item);
        });
        const clone = track.cloneNode(true);
        container.appendChild(clone);
        container.addEventListener('click', (e) => {
            const clickedItem = e.target.closest('.liked-item');
            if (!clickedItem) return;
            const cancionId = clickedItem.dataset.id;
            if (cancionId) playSong(cancionId);
        });
    } catch (err) {
        console.error("Fallo al cargar 'Liked Songs':", err);
        track.innerHTML = '<p class="text-danger">Error al cargar canciones.</p>';
    }
}

function loadPlaylistSongs(playlistId) {
    const container = document.getElementById('playlistSongsContainer');
    if (!container) return;
    container.innerHTML = `<p>Cargando canciones de la playlist ID: ${playlistId}</p>`;
}

// Load view (Premium u otras vistas) dentro de #mainDynamicContent
function loadView(url) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            const main = document.getElementById("mainDynamicContent");
            if (!main) return Notifier.show('Contenedor principal no encontrado', 'danger');
            main.innerHTML = html;
            const firstChild = main.firstElementChild;
            firstChild && firstChild.classList.add("view-fade-in");
        })
        .catch(err => {
            console.error("Error loading view:", err);
            Notifier.show('Error cargando la vista', 'danger');
        });
}

// Agregar nueva playlist al carrusel (UI)
function addPlaylistToCarrusel(playlist) {
    const carrusel = document.querySelector('.carrusel');
    if (!carrusel) return;
    const item = document.createElement('div');
    const playlistId = playlist.id ?? `temp-${Date.now()}`;
    item.dataset.playlistId = playlistId;
    item.className = 'carrusel-item';
    item.innerHTML = `
        <img src="https://cdn-icons-png.flaticon.com/512/9280/9280598.png" alt="${playlist.nombre}">
        <div class="playlist-overlay">
            <button class="btn btn-sm btn-primary btn-view-playlist" data-playlist-id="${playlistId}">Ver</button>
        </div>
        <p class="playlist-name">${playlist.nombre}</p>
    `;
    carrusel.appendChild(item);
    item.style.opacity = 0;
    item.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        item.style.transition = 'all 0.5s ease';
        item.style.opacity = 1;
        item.style.transform = 'translateX(0)';
        updateScrollButtons();
    }, 50);
    carrusel.scrollLeft = 0;
    updatePlaylistCount();
}
// Popup de bloqueo si no esta logueado:
const AuthPopup = {
    backdrop: Utils.qs('#authRequiredPopup'),
    titleEl: Utils.qs('#authPopupTitle'),
    msgEl: Utils.qs('#authPopupMessage'),

    show(mode = "playlist", plan = null) {

        Utils.qs('#popupPagoContenido')?.classList.add('d-none');
        Utils.qs('#popupDefaultTexto')?.classList.remove('d-none');

        // Cambiar contenido dinámico según quien lo llamó
        if (mode === "playlist") {
            this.titleEl.textContent = "¿Quieres crear una playlist?";
            this.msgEl.textContent = "Para hacerlo, solo tienes que iniciar sesión o registrarte con nosotros.";
        } else if (mode === "premium") {
            // modo playlist por defecto
            this.titleEl.textContent = "¿Deseas ser Premium?";
            this.msgEl.textContent = "Para acceder a los planes premium, inicia sesión o regístrate.";
        } else if (mode === "pago") {
            this.titleEl.textContent = `Comprar plan: ${plan}`;
            this.msgEl.textContent = "";

            // Ocultar texto normal
            Utils.qs('#popupDefaultTexto')?.classList.add('d-none');

            // Mostrar formulario de pago
            Utils.qs('#popupPagoContenido')?.classList.remove('d-none');
        }

        this.backdrop.classList.remove('d-none');
    },

    hide() {
        this.backdrop.classList.add('d-none');
    },

    init() {
        const loginBtn = Utils.qs('#popupLoginBtn');
        const registerBtn = Utils.qs('#popupRegisterBtn');

        loginBtn?.addEventListener('click', () => {
            this.hide();
            window.location.href = "/";
        });

        registerBtn?.addEventListener('click', () => {
            this.hide();
            window.location.href = "/";
        });

        this.backdrop?.addEventListener('click', (e) => {
            if (e.target === this.backdrop) {
                this.hide();
                window.location.href = "/";
            }
        });
    }
};

const Premium = {
    comprarPlan: async (plan) => {
        const usuario = Auth.getUser();
        if (!usuario) return AuthPopup.show("premium");

        // Tomar los datos del formulario de pago
        const nombreTarjeta = Utils.qs('#nombreTarjeta')?.value;
        const numeroTarjeta = Utils.qs('#numeroTarjeta')?.value;
        const cvv = Utils.qs('#cvvTarjeta')?.value;

        if (!nombreTarjeta || !numeroTarjeta || !cvv) {
            return Notifier.show('Completa todos los campos del formulario', 'danger');
        }

        try {
            const response = await fetch('/api/premium/comprar', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' },
                credentials: "include",
                // body: JSON.stringify({ plan, nombreTarjeta, numeroTarjeta, cvv })
                body: JSON.stringify({ plan: planSeleccionado})
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al procesar el pago');

            Notifier.show(`¡Compra exitosa! Plan ${plan} activado.`, 'success');

            // Cerrar popup
            AuthPopup.hide();

        } catch (err) {
            console.error(err);
            Notifier.show(err.message || 'Error al comprar plan', 'danger');
        }
    }
};



const PremiumAccess = {
    init() {

        const premiumBtn = Utils.qs('#premiumBtn');

        premiumBtn?.addEventListener('click', (e) => {
            e.preventDefault();

            const usuario = Auth.getUser();

            if (!usuario) {
                AuthPopup.show();
                return;
            }

            loadView('/premium');
        });

    }
};

const premiumBtn = Utils.qs('#premiumBtn');
premiumBtn?.addEventListener('click', function(e) {
    e.preventDefault();
    const usuario = Auth.getUser();
    if (!usuario) {
        AuthPopup.show("premium");
        return;
    }
    // usuario logueado → cargar vista en #mainDynamicContent
    loadView('/premium');
    history.pushState({ page: 'premium' }, 'Premium', '/premium');
});


document.addEventListener("DOMContentLoaded", () => {
    AuthPopup.init();
    PremiumAccess.init();
});

let planSeleccionado = null;

document.addEventListener("click", async (e) => {

    const popup = document.getElementById("authRequiredPopup");

    // ==========================
    // CERRAR POPUP (clic afuera)
    // ==========================
    if (!popup.classList.contains("d-none") && e.target === popup) {
        popup.classList.add("d-none");

        popup.querySelector("#popupPagoContenido")?.classList.add("d-none");
        popup.querySelector("#popupDefaultButtons")?.classList.remove("d-none");
        return;
    }

    // ==========================
    // BOTÓN: ELEGIR PLAN
    // ==========================
    if (e.target.classList.contains("elegir-plan")) {

        planSeleccionado = e.target.dataset.plan;
        console.log("Plan seleccionado:", planSeleccionado);

        popup.classList.remove("d-none");

        const titulo = Utils.qs("#authPopupTitle");
        const mensaje = Utils.qs("#authPopupMessage");
        const contenidoPago = Utils.qs("#popupPagoContenido");
        const botonesDefault = Utils.qs("#popupDefaultButtons");

        titulo.textContent = `Comprar Plan ${planSeleccionado}`;
        mensaje.textContent = `Completa los datos para activar tu suscripción al plan ${planSeleccionado}.`;

        contenidoPago.classList.remove("d-none");
        botonesDefault.classList.add("d-none");

        return;
    }

    // ==========================
    // BOTÓN: CERRAR POPUP
    // ==========================
    if (e.target.id === "cerrarPopup") {
        popup.classList.add("d-none");

        popup.querySelector("#popupPagoContenido")?.classList.add("d-none");
        popup.querySelector("#popupDefaultButtons")?.classList.remove("d-none");
        return;
    }

    // ==========================
    // BOTÓN: PAGAR AHORA
    // ==========================
    if (e.target.id === "btnPagarPlan") {

        // 1. Validar datos
        const nombre = Utils.qs("#nombreTarjeta").value.trim();
        const numero = Utils.qs("#numeroTarjeta").value.trim();
        const exp    = Utils.qs("#expTarjeta").value.trim();
        const cvc    = Utils.qs("#cvcTarjeta").value.trim();

        if (!nombre || !numero || !exp || !cvc) {
            alert("Completa todos los campos.");
            return;
        }

        if (!planSeleccionado) {
            alert("Error: no se detectó el plan seleccionado.");
            return;
        }

        alert("Procesando pago...");

        try {

            const response = await fetch("/api/premium/comprar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planSeleccionado })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Error desconocido en la compra.");
                return;
            }

            alert("Pago exitoso. ¡Bienvenido a Premium!");

            // 2. Cerrar popup
            popup.classList.add("d-none");
            Utils.qs("#popupPagoContenido").classList.add("d-none");
            Utils.qs("#popupDefaultButtons").classList.remove("d-none");

            // 3. Guardar estado del usuario premium
            localStorage.setItem("userPremium", "true");

            // 4. Redirigir
            window.location.href = "/";

        } catch (err) {
            console.error(err);
            alert("Error al procesar la compra.");
        }
    }
});


document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("userPremium") === "true") {
        const bar = document.querySelector("#premiumStatusBar");

        if (bar) {
            bar.innerHTML = `
                <span style="background:#ffb400;padding:6px 12px;border-radius:8px;color:#000;font-weight:bold">
                    Premium
                </span>

                <button id="btnDesuscribir" style="
                    margin-left:10px;
                    background:#444;
                    color:white;
                    padding:6px 10px;
                    border-radius:8px;
                    border:none;
                    cursor:pointer;">
                    Desuscribirse
                </button>
            `;
        }
    }
});

document.addEventListener("click", e => {
    if (e.target.id === "btnDesuscribir") {
        if (confirm("¿Seguro que deseas desuscribirte?")) {
            localStorage.removeItem("userPremium");
            location.reload();
        }
    }
});

document.addEventListener("click", async (e) => {
    if (!e.target.closest("#btnPagarPlan")) return;

    e.preventDefault();

    // 🚨 NO hacer validación de login
    // 🚨 NO abrir popup de bloqueo
    // 🚨 NO pasar por lógica del sidebar

    // 1. Capturar datos del formulario
    const nombre = Utils.qs("#nombreTarjeta").value.trim();
    const numero = Utils.qs("#numeroTarjeta").value.trim();
    const exp = Utils.qs("#expTarjeta").value.trim();
    const cvc = Utils.qs("#cvcTarjeta").value.trim();

    if (!nombre || !numero || !exp || !cvc) {
        alert("Completa todos los campos antes de pagar.");
        return;
    }

    // 2. Leer el plan que se eligió antes
    const plan = window.planSeleccionado || null;

    if (!plan) {
        alert("Error: No se detectó el plan seleccionado.");
        return;
    }

    alert("Procesando pago...");

    try {
        // 3. Enviar al backend
        const response = await fetch("/api/premium/comprar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Error al procesar el pago.");
            return;
        }

        alert("Pago exitoso. ¡Bienvenido a Premium!");

        // 4. Cerrar popup
        Utils.qs("#authRequiredPopup").classList.add("d-none");

        // 5. Guardar estado premium localmente
        localStorage.setItem("userPremium", "true");
        localStorage.setItem("premiumPlan", plan);

        // 6. Redirigir al inicio
        window.location.href = "/";

    } catch (err) {
        console.error(err);
        alert("Error al procesar el pago.");
    }
});

// === FUNCIONALIDAD BOTÓN "PAGAR AHORA" ===
document.addEventListener("click", async (e) => {
    const btn = e.target.closest("#btnPagarAhora");
    if (!btn) return;

    const usuario = Auth.getUser();

    if (!usuario) {
        Notifier.show("Debes iniciar sesión para comprar un plan Premium.", "danger");
        AuthPopup.show("premium");
        return;
    }

    const plan = btn.dataset.plan; // "BASICO" o "PREMIUM"
    if (!plan) return Notifier.show("Error: no se pudo detectar el plan.", "danger");

    try {
        Notifier.show("Procesando pago...", "info");

        const response = await fetch("/api/premium/comprar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: usuario.email,
                plan
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al procesar el pago");
        }

        Notifier.show("¡Pago realizado con éxito! Ya eres Premium 🎉", "success");

        // Actualizar usuario en localStorage
        usuario.premium = true;
        usuario.plan = plan;
        Auth.setUser(usuario);

        // Cerrar popup
        document.querySelector(".popup-pago-backdrop")?.remove();

        // Actualizar vista
        loadView("/premium");

    } catch (err) {
        Notifier.show(err.message, "danger");
    }
});


// Inicializaciones globales
document.addEventListener("DOMContentLoaded", () => AuthPopup.init());
document.addEventListener('DOMContentLoaded', initializePeepsApp);
window.addEventListener('load', () => { updateScrollButtons(); });
window.addEventListener('resize', () => { updateScrollButtons(); });
