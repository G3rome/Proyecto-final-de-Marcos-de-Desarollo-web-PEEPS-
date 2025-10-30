const cancionesMock = [
    { title: "AM Remix", artist: "Nio Garcia x J Balvin x Bad Bunny", cover: "/images/AM Remix.jpg", src: "/audio/AM Remix.mp3" },
    { title: "Bohemian Rhapsody", artist: "Queen", cover: "/images/Bohemian Rhapsody.jpg", src: "/audio/Bohemian Rhapsody.mp3" },
    { title: "cabellos blancos", artist: "Carmencita Lara", cover: "/images/cabellos blancos.jpg", src: "/audio/cabellos blancos.mp3" },
    { title: "carta al cielo", artist: "Lucha Reyes", cover: "/images/carta al cielo.jpg", src: "/audio/carta al cielo.mp3" },
    { title: "Chillax", artist: "Farruko", cover: "/images/Chillax.jpg", src: "/audio/Chillax.mp3" },
    { title: "Con Altura", artist: "J Balvin x Rosalía", cover: "/images/Con Altura.jpg", src: "/audio/Con Altura.mp3" },
    { title: "Dakiti", artist: "Bad Bunny", cover: "/images/Dakiti.jpg", src: "/audio/Dakiti.mp3" },
    { title: "Despechá", artist: "Rosalia", cover: "/images/Despechá.jpg", src: "/audio/Despechá.mp3" },
    { title: "DtMF", artist: "Bad Bunny", cover: "/images/DtMF.jpg", src: "/audio/DtMF.mp3" },
    { title: "Ella y Yo", artist: "Aventura (Ft. Don Omar)", cover: "/images/Ella y Yo.jpg", src: "/audio/Ella y Yo.mp3" },
    { title: "Felices los 4", artist: "Maluma", cover: "/images/Felices los 4.jpg", src: "/audio/Felices los 4.mp3" },
    { title: "Hawái", artist: "Maluma", cover: "/images/Hawái.jpg", src: "/audio/Hawái.mp3" },
    { title: "La Alergia", artist: "Donny Caballero", cover: "/images/La Alergia.jpg", src: "/audio/La Alergia.mp3" },
    { title: "La Botella", artist: "Justin Quiles & Maluma", cover: "/images/La Botella.jpg", src: "/audio/La Botella.mp3" },
    { title: "La Cancion", artist: "Bad Bunny & J Balvin", cover: "images/La Canción.jpg", src: "/audio/La Canción.mp3" },
    { title: "Lo Pasado, Pasado", artist: "José José", cover: "/images/Lo Pasado, Pasado.jpg", src: "/audio/Lo Pasado, Pasado.mp3" },
    { title: "Me Porto Bonito", artist: "Bad Bunny", cover: "images/Me Porto Bonito.jpg", src: "audio/Me Porto Bonito.mp3" },
    { title: "Me Rehúso", artist: "Danny Ocean", cover: "/images/Me Rehúso.jpg", src: "/audio/Me Rehúso.mp3" },
    { title: "Monotonía", artist: "Shakira", cover: "/images/Monotonía.jpg", src: "/audio/Monotonía.mp3" },
    { title: "Ojitos Lindos", artist: "Bad Bunny & Bomba Estéreo", cover: "/images/Ojitos Lindos.jpg", src: "/audio/Ojitos Lindos.mp3" },
    { title: "Otro Trago", artist: "Darell & Sech", cover: "/images/Otro Trago.jpg", src: "/audio/Otro Trago.mp3" },
    { title: "Pa Mi (Remix)", artist: "Alex, Dimelo Flow & Rafa Pabón", cover: "/images/Pa Mi (Remix).jpg", src: "/audio/Pa Mi (Remix).mp3" },
    { title: "Pareja del Año", artist: "Myke Towers & Sebastián Yatra", cover: "/images/Pareja del Año.jpg", src: "/audio/Pareja del Año.mp3" },
    { title: "Qué Más Pues", artist: "J Balvin & Maria Becerra", cover: "/images/Qué Más Pues.jpg", src: "/audio/Qué Más Pues.mp3" },
    { title: "Salió el Sol", artist: "Don Omar", cover: "/images/Salió el Sol.jpg", src: "/audio/Salió el Sol.mp3" },
    { title: "Sunset", artist: "Farruko", cover: "/images/Sunset.jpg", src: "/audio/Sunset.mp3" },
    { title: "Tacones Rojos", artist: "Sebastián Yatra", cover: "/images/Tacones Rojos.jpg", src: "/audio/Tacones Rojos.mp3" },
    { title: "Tal Vez", artist: "Paulo Londra", cover: "/images/Tal Vez.jpg", src: "/audio/Tal Vez.mp3" },
    { title: "Tití Me Preguntó", artist: "Bad Bunny", cover: "/images/Tití Me Preguntó.jpg", src: "/audio/Tití Me Preguntó.mp3" },
    { title: "Todo De Ti", artist: "Rauw Alejandro", cover: "/images/Todo De Ti.jpg", src: "/audio/Todo De Ti.mp3" },
    { title: "Volví", artist: "Aventura & Bad Bunny", cover: "/images/Volví.jpg", src: "/audio/Volví.mp3" },
];

const Utils = {
    isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    qs: (selector, parent = document) => parent.querySelector(selector),
    qsa: (selector, parent = document) => parent.querySelectorAll(selector),
};

const Notifier = {
    activeNotification: null,
    show(message, type = 'info') {
        if (this.activeNotification) this.activeNotification.remove();
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `top: 20px; right: 20px; z-index: 9999; min-width: 300px; max-width: 400px;`;
        const iconMap = { success: 'fa-check-circle', danger: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
        notification.innerHTML = `<i class="fas ${iconMap[type] || iconMap.info} me-2"></i> ${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        document.body.appendChild(notification);
        this.activeNotification = notification;
        notification.querySelector('.btn-close').addEventListener('click', () => this.hide());
        setTimeout(() => this.hide(), 5000);
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
            Notifier.show(`¡Bienvenido ${data.usuario.nombre}!`, 'success');

            const modal = bootstrap.Modal.getInstance(form.closest('.modal'));
            modal.hide();

            setTimeout(() => UI.updateForLoggedInUser(data.usuario), 1000);
        } catch (error) {
            Notifier.show(error.message, 'danger');
            console.error('Error de autenticación:', error);
        }
    },

    handleRegistro: async () => {
        const form = Utils.qs('#registroForm');
        if (!Validation.validateForm(form)) return Notifier.show('Por favor corrige los errores.', 'danger');
        const formData = { nombre: Utils.qs('#nombreRegistro').value, email: Utils.qs('#emailRegistro').value, password: Utils.qs('#passwordRegistro').value };
        await Auth._handleAuthRequest('/api/usuarios/registro', formData, form);
    },

    handleLogin: async () => {
        const form = Utils.qs('#loginForm');
        if (!Validation.validateForm(form)) return Notifier.show('Por favor corrige los errores.', 'danger');
        const formData = { email: Utils.qs('#emailLogin').value, password: Utils.qs('#passwordLogin').value, recordar: Utils.qs('#recordarLogin').checked };
        await Auth._handleAuthRequest('/api/usuarios/login', formData, form);
    },

    handleRecuperarPassword: () => {
        const email = Utils.qs('#emailRecuperar').value;
        if (!Utils.isValidEmail(email)) return Notifier.show('Correo electrónico inválido.', 'danger');
        Notifier.show('Enlace de recuperación enviado a tu correo.', 'info');
        bootstrap.Modal.getInstance(Utils.qs('#recuperarPasswordModal')).hide();
    },

    cerrarSesion: () => {
        Auth.clearUser();
        Notifier.show('¡Sesión cerrada!', 'info');
        Player.stop();
        setTimeout(() => UI.restoreInitialState(), 1000);
    }
};

const UI = {
    updateForLoggedInUser: (usuario) => {
        console.log('Actualizando UI para usuario logueado');
        Utils.qs('.hero-title').textContent = `¡Bienvenido ${usuario.nombre}!`;
        Utils.qs('.hero-subtitle').textContent = 'Radio felicidad 88.9 FM - Tu música favorita te espera';
        const headerAuth = Utils.qs('#headerAuthButtons');
        headerAuth.innerHTML = `<button class="btn-custom-outline" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>`;
        Utils.qs('#logoutBtn').addEventListener('click', Auth.cerrarSesion);
        Utils.qs('#authCards').style.display = 'none';
        Utils.qs("#welcomeSection")?.classList.add("d-none");

        Utils.qs("#rankingSection")?.classList.remove("d-none");
        Utils.qs("#listaCanciones")?.classList.remove("d-none");
    },

    restoreInitialState: () => {
        console.log('Restaurando UI inicial');
        Utils.qs('.hero-title').textContent = 'Bienvenido a Peeps';
        Utils.qs('.hero-subtitle').textContent = 'Radio felicidad 88.9 FM';
        Utils.qs('#headerAuthButtons').innerHTML = `
            <button class="btn-custom-outline" data-bs-toggle="modal" data-bs-target="#loginModal"><i class="fas fa-user"></i> Iniciar Sesión</button>
            <button class="btn-custom-primary" data-bs-toggle="modal" data-bs-target="#registroModal"><i class="fas fa-plus"></i> Registrarse</button>`;
        Utils.qs('#authCards').style.display = '';
        Utils.qs("#welcomeSection")?.classList.remove("d-none");
    },

    setupEventListeners: () => {
        Utils.qs('#registroSubmitBtn')?.addEventListener('click', Auth.handleRegistro);
        Utils.qs('#loginSubmitBtn')?.addEventListener('click', Auth.handleLogin);
        Utils.qs('#recuperarPasswordSubmitBtn')?.addEventListener('click', Auth.handleRecuperarPassword);
        Utils.qs('#terminosLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            new bootstrap.Modal(Utils.qs('#terminosModal')).show();
        });
        Utils.qs('#recuperarPasswordLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            new bootstrap.Modal(Utils.qs('#recuperarPasswordModal')).show();
        });
    },

    setupMobileMenu: () => {
        const hamburger = Utils.qs('#hamburgerMenu');
        const sidebar = Utils.qs('#sidebarMobile');
        const overlay = Utils.qs('#mobileOverlay');
        const closeMenu = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };
        const openMenu = () => {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            sidebar.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };
        hamburger?.addEventListener('click', () => (sidebar.classList.contains('open') ? closeMenu() : openMenu()));
        overlay?.addEventListener('click', closeMenu);
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991.98) closeMenu();
        });
    },

    setupSidebarNavigation: () => {
        Utils.qsa('.sidebar .nav-item').forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                Utils.qsa('.sidebar .nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                if (!this.classList.contains('search-btn')) {
                    const section = Utils.qs('span', this).textContent;
                    Notifier.show(`Navegando a ${section}`, 'info');
                }
            });
        });
    }
};

const Validation = {
    _fieldErrorState: (field, message, isValid) => {
        const errorContainer = field.parentNode.querySelector('.invalid-feedback') || document.createElement('div');
        if (!isValid) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            if (!field.parentNode.querySelector('.invalid-feedback')) {
                errorContainer.className = 'invalid-feedback d-block';
                errorContainer.textContent = message;
                field.parentNode.appendChild(errorContainer);
            }
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
            if (errorContainer) errorContainer.remove();
        }
    },
    validateField: (field) => {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        let isValid = true, message = '';
        switch (field.id) {
            case 'nombreRegistro': isValid = value.length >= 2; message = 'El nombre debe tener al menos 2 caracteres'; break;
            case 'emailRegistro': case 'emailLogin': case 'emailRecuperar': isValid = Utils.isValidEmail(value); message = 'Correo electrónico inválido'; break;
            case 'passwordRegistro': isValid = value.length >= 6; message = 'La contraseña debe tener al menos 6 caracteres'; break;
            case 'confirmPasswordRegistro': isValid = value === Utils.qs('#passwordRegistro').value; message = 'Las contraseñas no coinciden'; break;
            case 'passwordLogin': isValid = value.length > 0; message = 'La contraseña es requerida'; break;
            case 'terminosRegistro': isValid = value; message = 'Debes aceptar los términos'; break;
        }
        Validation._fieldErrorState(field, message, isValid);
        return isValid;
    },
    validateForm: (form) => {
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


const Search = {
    currentSong: null,
    audioPlayer: null,

    _createSongItem: (song) => {
        const item = document.createElement("div");
        item.classList.add("song-item");
        item.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="cover-thumb">
            <div class="song-info">
                <h5>${song.title}</h5>
                <small>${song.artist}</small>
            </div>
            <div class="song-actions">
                <button class="play-btn"><i class="fas fa-play"></i></button>
                <button class="add-btn"><i class="fas fa-plus"></i></button>
            </div>
        `;

        item.querySelector(".play-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            if (Search.currentSong === song.src && !Search.audioPlayer.paused) {
                Search.audioPlayer.pause();
                e.currentTarget.innerHTML = `<i class="fas fa-play"></i>`;
            } else {
                Search.audioPlayer.src = song.src;
                Search.audioPlayer.play();
                Search.currentSong = song.src;
                Utils.qsa("#searchResults .play-btn").forEach(btn => btn.innerHTML = `<i class="fas fa-play"></i>`);
                e.currentTarget.innerHTML = `<i class="fas fa-pause"></i>`;
            }
        });
        return item;
    },

    _filterSongs: async () => {
        const query = Utils.qs("#searchInput").value.toLowerCase().trim();
        const resultsContainer = Utils.qs("#searchResults");
        resultsContainer.innerHTML = ""; 
        if (!query) return;

        try {
            //Llamamos a la API de Spring Boot
            const response = await fetch(`/music/api/buscar?query=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error('Respuesta negativa de la API');
            }

            const filtradas = await response.json();

            if (filtradas.length === 0) {
                resultsContainer.innerHTML = `<p style="text-align:center;color:#888;">No se encontraron canciones</p>`;
                return;
            }

            filtradas.forEach(c => {

                const songCompatible = {
                    title: c.titulo,
                    artist: c.artista,
                    cover: c.cover,
                    src: c.src
                };

                const item = Search._createSongItem(songCompatible);

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
            searchOverlay.classList.add("active");
            document.body.classList.add("modal-open");
            setTimeout(() => searchInput.focus(), 300);
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

    //Reproductor de música
    function playSong(id) {
        const url = `/music/reproductor?id=${id}`;
        window.location.href = url;
    }

    //Para la lista
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            playSong(id);
        });
    });

    const user = Auth.getUser();
    if (user) {
        UI.updateForLoggedInUser(user);
    } else {
        UI.restoreInitialState();
    }
};

document.addEventListener('DOMContentLoaded', initializePeepsApp);