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
        const formData = {
            nombreCompleto: Utils.qs('#nombreRegistro').value,
            email: Utils.qs('#emailRegistro').value,
            contrasena: Utils.qs('#passwordRegistro').value
        };
        await Auth._handleAuthRequest('/api/usuarios/registro', formData, form);
    },

    handleLogin: async () => {
        const form = Utils.qs('#loginForm');
        if (!Validation.validateForm(form)) return Notifier.show('Por favor corrige los errores.', 'danger');
        const formData = {
            email: Utils.qs('#emailLogin').value,
            contrasena: Utils.qs('#passwordLogin').value,
            recordar: Utils.qs('#recordarLogin').checked
        };
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
        setTimeout(() => UI.restoreInitialState(), 1000);
    }
};

const UI = {
    updateForLoggedInUser: (usuario) => {
        console.log('Actualizando UI para usuario logueado');
        const heroTitle = Utils.qs('.hero-title');
        if (heroTitle) heroTitle.textContent = `¡Bienvenido ${usuario.nombreCompleto}!`;
        const heroSubtitle = Utils.qs('.hero-subtitle');
        if (heroSubtitle) heroSubtitle.textContent = 'Radio felicidad 88.9 FM - Tu música favorita te espera';
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

    // Modificacion: Ajuste de funcionalidad para la mejora de navegación en la barra lateral
    // Inicio:
    setupSidebarNavigation: () => {
        const contentContainer = Utils.qs('#mainDynamicContent');
        // Guardamos el contenido inicial (vista Home) para poder restaurarlo luego
        const initialContent = contentContainer ? contentContainer.innerHTML : '';

        // Función auxiliar para manejar elementos dentro del fragmento Playlist
        const initInjectedPlaylistUI = () => {
            const volverBtn = Utils.qs('.btn-volver', contentContainer);
            if (volverBtn) {
            }
            const crearBtn = Utils.qs('.btn-crear', contentContainer);
            if (crearBtn) {
                crearBtn.addEventListener('click', async () => {
                    //Usamos 'prompt' para pedir el nombre
                    const nombre = prompt("Ingresa el nombre de tu nueva playlist:");

                    if (!nombre || nombre.trim() === "") return;

                        try {
                            //Llamamos a la nueva API que activamos en el backend
                            const response = await fetch('/api/playlist/crear', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ nombre })
                            });

                            if (!response.ok) throw new Error('No se pudo crear la playlist');

                            const nuevaPlaylist = await response.json();

                            Notifier.show(`Playlist "${nuevaPlaylist.nombre}" creada!`, 'success');

                            //Añadimos la nueva playlist al carrusel al instante
                            const carrusel = Utils.qs('.carrusel', contentContainer);
                            
                            if (!carrusel) return;

                                const newItem = document.createElement('div');
                                
                                addPlaylistToCarrusel(nuevaPlaylist);
                                
                                // Actualiza botones de scroll
                                updateScrollButtons();
                                updatePlaylistCount();
                            
                        } catch (error) {
                            Notifier.show(error.message, 'danger');
                        }
                    }
                );
            }
        };

        // Listener para cada ítem del sidebar
        Utils.qsa('.sidebar .nav-item').forEach(item => {
            item.addEventListener('click', function (e) {
                // Prevenimos la navegación por defecto
                e.preventDefault();

                // Cambiar visualmente la selección
                Utils.qsa('.sidebar .nav-item').forEach(i => i.classList.remove('active'));

                this.classList.add('active');
                const section = Utils.qs('span', this)?.textContent?.trim().toLowerCase();
                // Insercion de animacion de despliegue:
                if (section === 'playlist') {

                    const contentContainer = Utils.qs('#mainDynamicContent');

                    // Animación de salida
                    contentContainer.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                    contentContainer.style.opacity = 0;
                    contentContainer.style.transform = "translateY(15px)";

                    setTimeout(() => {
                        fetch('/playlist', {
                            headers: { 'X-Requested-With': 'XMLHttpRequest' }
                        })

                            .then(response => response.text())

                            .then(html => {
                                if (contentContainer) {
                                    contentContainer.innerHTML = html;

                                    // Animación de entrada
                                    contentContainer.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                                    contentContainer.style.opacity = 1;
                                    contentContainer.style.transform = "translateY(0)";

                                    // Actualiza la URL sin recargar
                                    history.pushState({ page: 'playlist' }, 'Playlist', '/playlist');

                                    // Esperamos un poco a que el DOM de la playlist esté totalmente renderizado
                                    setTimeout(() => {
                                        initInjectedPlaylistUI();  
                                        initCarruselScroll();
                                        updateScrollButtons();
                                    }, 300);
                                }
                            })

                            .catch(error => {
                                console.error('Error cargando Playlist:', error);
                                Notifier.show('Error al cargar Playlist 😢', 'danger');
                            });
                    }, 300); // Espera que acabe la animación de salida

                } else if (section === 'inicio' || section === 'home') {
                    window.location.href = '/';
                }
            });
        });
    }
    // Fin
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

//Reproductor de música
function playSong(id) {
    const url = `/music/reproductor?id=${id}`;
    window.location.href = url;
}

function initHomePageListeners() {
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-to-playlist')) {
                return;
            }
            const id = item.getAttribute('data-id');
            playSong(id);
        });
    });
}

const Search = {
    currentSong: null,
    audioPlayer: null,

    _createSongItem: (song) => {
        const item = document.createElement("div");
        item.classList.add("song-item");

        // Añadimos los data-attributes, igual que en Thymeleaf
        // Necesitamos esto para que el listener sepa QUÉ canción es
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
            // (5) Llamamos a la función "global" playSong
            playSong(song.id);
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
    initHomePageListeners();

    const user = Auth.getUser();
    if (user) {
        UI.updateForLoggedInUser(user);
    } else {
        UI.restoreInitialState();
    }
};

// Esta función abre el modal
async function handleAddSongClick(e) {
    const addButton = e.target.closest('.btn-add-to-playlist');
    if (!addButton) return;

    e.stopPropagation();

    const cancionId = addButton.dataset.id;
    if (!cancionId) return;

    const modalElement = document.getElementById('addToPlaylistModal');
    const modalList = document.getElementById('playlist-modal-list');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    //Guardamos el ID de la canción en el modal
    modalElement.dataset.cancionId = cancionId;
    modalList.innerHTML = '<p>Cargando playlists...</p>';

    try {
        //Llamamos a la NUEVA API para obtener las playlists
        const response = await fetch('/api/playlists');
        if (!response.ok) throw new Error('No se pudieron cargar las playlists');

        const playlists = await response.json();
        modalList.innerHTML = '';

        if (playlists.length === 0) {
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

    //Mostramos el modal
    modal.show();
}

// --- Listener para el Modal de Playlists (CORREGIDO) ---
document.getElementById('playlist-modal-list').addEventListener('click', (e) => {
    const playlistButton = e.target.closest('.btn-playlist-select');
    if (!playlistButton) return;

    // (1) Obtenemos los IDs
    const playlistId = playlistButton.dataset.playlistId;

    // (2) ¡ARREGLADO! Definimos modalElement aquí
    const modalElement = document.getElementById('addToPlaylistModal');
    const cancionId = modalElement.dataset.cancionId;

    if (!playlistId || !cancionId) {
        Notifier.show('Error, falta información', 'danger');
        return;
    }

    Notifier.show('Añadiendo...', 'info');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    // (3) Ocultamos el modal INMEDIATAMENTE
    modal.hide();

    // (4) ¡ARREGLADO! Añadimos el method, headers y body al fetch
    fetch('/api/playlist/agregarCancion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cancionId: parseInt(cancionId),
            playlistId: parseInt(playlistId)
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || 'Error al añadir la canción');
                });
            }
            return response.json();
        })
        .then(resultado => {
            Notifier.show(`"${resultado.cancionTitulo}" añadido a "${resultado.playlistNombre}"!`, 'success');
        })
        .catch(error => {
            Notifier.show(error.message, 'danger');
        });
});

document.body.addEventListener('click', handleAddSongClick);
const modalElement = document.getElementById('addToPlaylistModal');
if (modalElement)
    modalElement.addEventListener('hidden.bs.modal', (e) => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.style.overflow = 'auto';
    });

document.addEventListener('DOMContentLoaded', initializePeepsApp);

function addPlaylistToCarrusel(playlist) {
    
    const carrusel = document.querySelector('.carrusel');

    const item = document.createElement('div');
    
    item.className = 'carrusel-item';
    
    item.innerHTML = `<img src="/images/playlist1.jpg" alt="${playlist.nombre}">`;

    // Agregamos al final pero animando desde la izquierda
    carrusel.appendChild(item);

    // Animación de aparición suave
    item.style.opacity = 0;
    
    item.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        item.style.transition = 'all 0.5s ease';
        item.style.opacity = 1;
        item.style.transform = 'translateX(0)';
        updateScrollButtons();
    }, 50);

    // Aseguramos que todo el carrusel esté centrado al inicio
    carrusel.scrollLeft = 0;

    updatePlaylistCount();
}

function updateScrollButtons() {
    const carrusel = document.querySelector('.carrusel');
    const btnLeft = document.querySelector('.scroll-btn.left');
    const btnRight = document.querySelector('.scroll-btn.right');

    
    if (!carrusel || !btnLeft || !btnRight) return;

    const items = carrusel.querySelectorAll('.carrusel-item');

    // Mostrar botones solo si hay más de 3 items o si el contenido realmente se desborda
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
    if (!countEl) return; // <--- evita el error si no existe

    const total = document.querySelectorAll('.carrusel-item').length;
    countEl.textContent = `${total} playlist${total !== 1 ? 's' : ''}`;
}

function initCarruselScroll() {
    const carrusel = document.querySelector('.carrusel');
    const btnLeft = document.querySelector('.scroll-btn.left');
    const btnRight = document.querySelector('.scroll-btn.right');

    if (!carrusel || !btnLeft || !btnRight) return;

    const itemWidth = carrusel.querySelector('.carrusel-item')?.offsetWidth || 200;

    // Botón de retroceder
    btnLeft.addEventListener('click', () => {
        carrusel.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    });

    // Botón de avanzar
    btnRight.addEventListener('click', () => {
        carrusel.scrollBy({ left: itemWidth, behavior: 'smooth' });
    });

    // Actualiza visibilidad de botones según scroll
    const updateButtons = () => {
        const maxScrollLeft = carrusel.scrollWidth - carrusel.clientWidth;
        btnLeft.style.display = carrusel.scrollLeft > 0 ? 'block' : 'none';
        btnRight.style.display = carrusel.scrollLeft < maxScrollLeft - 1 ? 'block' : 'none';
    };

    // Escuchar scroll y resize
    carrusel.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    // Inicializa visibilidad
    updateButtons();
}

// --- Detectar cuándo se carga la sección Playlist ---
function initInjectedPlaylistUI() {
    const volverBtn = Utils.qs('.btn-volver');
    const crearBtn = Utils.qs('.btn-crear');

    // Si existe botón crear
    if (crearBtn) {
        crearBtn.addEventListener('click', async () => {
            const nombre = prompt("Ingresa el nombre de tu nueva playlist:");
            if (!nombre || nombre.trim() === "") return;

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
            } catch (error) {
                Notifier.show(error.message, 'danger');
            }
        });
    }
    
    // Esperamos a que el carrusel y los botones existan antes de iniciar el scroll
    const waitForCarrusel = setInterval(() => {
        const carrusel = document.querySelector('.carrusel');
        const btnLeft = document.querySelector('.scroll-btn.left');
        const btnRight = document.querySelector('.scroll-btn.right');

        if (carrusel && btnLeft && btnRight) {
            clearInterval(waitForCarrusel);
            initCarruselScroll(); // ✅ ahora sí se ejecuta correctamente
            updateScrollButtons();
        }
    }, 150); // revisa cada 150ms hasta que cargue
}   

// Actualiza botones al cargar
window.addEventListener('load', updateScrollButtons);
window.addEventListener('resize', updateScrollButtons);

// Fin