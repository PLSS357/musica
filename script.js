'use strict';

// ===== Estado =====
let isOpen = false;
let isPlaying = false;
let wasPlayingBeforeClose = false;

// ===== Inicialização segura =====
document.addEventListener('DOMContentLoaded', () => {
  // Pega elementos só depois do DOM pronto
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

  // Garante que tudo existe
  if (!boxContainer || !musicBox || !boxLid || !interior || !vinylRecord || !musicalNotes || !statusEl || !audio) {
    console.error('Algum elemento essencial não foi encontrado no DOM.');
    return;
  }

  // Volume inicial (só se o slider existir)
  if (volumeSlider) {
    audio.volume = parseFloat(volumeSlider.value || '0.7');
  } else {
    audio.volume = 0.7;
  }
  statusEl.textContent = 'Caixinha Fechada';

  // Evita que cliques nos controles fechem/abram a caixa
  if (volumeCard) volumeCard.addEventListener('click', (e) => e.stopPropagation());
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function (e) {
      e.stopPropagation();
      audio.volume = parseFloat(this.value);
    });
  }

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
    // Com loop, isso normalmente não dispara
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
    const tag = document.activeElement && document.activeElement.tagName;
    if (['INPUT','TEXTAREA','SELECT','OPTION'].includes(tag)) return;
    if (e.code === 'Space') { e.preventDefault(); toggleMusicBox(); }
    if (e.key && e.key.toLowerCase() === 'm') { audio.muted = !audio.muted; }
  });
});
