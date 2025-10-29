// Referencias a elementos
const audio = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = playPauseBtn.querySelector('i');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const volumeSlider = document.getElementById('volumeSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Configurar volumen inicial
audio.volume = 0.7;

// Play/Pause
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    } else {
        audio.pause();
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    }
});

// Actualizar tiempo y barra de progreso
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = progress + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Mostrar duración cuando se carga
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

// Hacer clic en la barra de progreso
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

// Control de volumen
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
});

// Botones anterior y siguiente (placeholder - puedes implementar lógica de playlist)
prevBtn.addEventListener('click', () => {
    audio.currentTime = 0;
    audio.play();
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
});

nextBtn.addEventListener('click', () => {
    // Aquí puedes implementar la lógica para siguiente canción
    console.log('Siguiente canción');
});

// Formatear tiempo
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Auto-reproducir al cargar
window.addEventListener('load', () => {
    audio.play().then(() => {
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
    }).catch(error => {
        console.log('Auto-play bloqueado por el navegador:', error);
    });
});

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        playPauseBtn.click();
    }
    if (e.code === 'ArrowLeft') {
        audio.currentTime = Math.max(0, audio.currentTime - 5);
    }
    if (e.code === 'ArrowRight') {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    }
});