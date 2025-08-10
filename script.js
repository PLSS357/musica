'use strict';

// ===== Estado =====
let isOpen = false;
let isPlaying = false;
let wasPlayingBeforeClose = false;

// ===== Elementos =====
const boxContainer = document.getElementById('boxContainer');
const musicBox     = document.getElementById('musicBox');
const boxLid       = document.getElementById('boxLid');
const interior     = document.getElementById('interior');
const vinylRecord  = document.getElementById('vinylRecord');
const musicalNotes = document.getElementById('musicalNotes');
const statusEl     = document.getElementById('status');
const audio        = document.getElementById('musicAudio');
const volumeSlider = document.getElementById('volumeSlider');
const volumeCard   = document.getElementById('volumeCard');

// Inicialização após a árvore carregar
document.addEventListener('DOMContentLoaded', () => {
  // Volume inicial
  audio.volume = parseFloat(volumeSlider.value || '0.7');
  statusEl.textContent = 'Caixinha Fechada';
});

// Evita que cliques nos controles fechem/abram a caixa
volumeCard.addEventListener('click', (e) => e.stopPropagation());
volumeSlider.addEventListener('input', function (e) {
  e.stopPropagation();
  audio.volume = parseFloat(this.value);
});

// Alterna caixa ao clicar no container
boxContainer.addEventListener('click', toggleMusicBox);

function toggleMusicBox() {
  isOpen = !isOpen;
  if (isOpen) openMusicBox(); else closeMusicBox();
}

function openMusicBox() {
  boxLid.classList.add('open');
  musicBox.classList.add('open');
  interior.classList.add('visible');

  // Inicia/continua música somente após gesto do usuário
  if (wasPlayingBeforeClose || !audio.currentTime) {
    playMusic();
  }

  setTimeout(() => {
    statusEl.textContent = isPlaying ? 'Tocando Música ♪' : 'Caixinha Aberta';
  }, 350);
}

function closeMusicBox() {
  wasPlayingBeforeClose = isPlaying;
  boxLid.classList.remove('open');
  musicBox.classList.remove('open');
  interior.classList.remove('visible');
  pauseMusic();
  statusEl.textContent = 'Caixinha Fechada';
}

function playMusic() {
  audio.play().then(() => {
    isPlaying = true;
    vinylRecord.classList.add('spinning');
    musicalNotes.classList.add('floating');
    if (isOpen) statusEl.textContent = 'Tocando Música ♪';
  }).catch((err) => {
    console.warn('Não foi possível reproduzir o áudio:', err);
    statusEl.textContent = 'Erro: adicione seu arquivo MP3';
  });
}

function pauseMusic() {
  audio.pause();
  isPlaying = false;
  vinylRecord.classList.remove('spinning');
  musicalNotes.classList.remove('floating');
}

// Eventos do áudio
audio.addEventListener('ended', () => {
  isPlaying = false;
  vinylRecord.classList.remove('spinning');
  musicalNotes.classList.remove('floating');
  if (isOpen) statusEl.textContent = 'Música finalizada';
});

audio.addEventListener('error', () => {
  statusEl.textContent = 'Erro: verifique o caminho do MP3';
});

// Teclado: espaço para abrir/fechar, M para mutar
window.addEventListener('keydown', (e) => {
  if (['INPUT','TEXTAREA','SELECT','OPTION'].includes(document.activeElement.tagName)) return;
  if (e.code === 'Space') { e.preventDefault(); toggleMusicBox(); }
  if (e.key && e.key.toLowerCase() === 'm') { audio.muted = !audio.muted; }
});
