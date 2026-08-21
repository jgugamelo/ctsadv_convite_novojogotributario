/* ==========================================================================
   CONVITE DIGITAL — LÓGICA E INTERATIVIDADE (JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initStickyRsvp();
});

/* --- 1. Regressiva (Countdown Timer) --- */
function initCountdown() {
  const eventDate = new Date('2026-09-15T19:00:00-03:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
      document.getElementById('countdown').innerHTML = `<div class="time-block" style="width:100%"><span class="time-num">É HOJE!</span></div>`;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days < 10 ? '0' + days : days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --- 2. Controlar Sticky Bar no Scroll (Mobile) --- */
function initStickyRsvp() {
  const stickyBar = document.getElementById('stickyRsvp');
  if (!stickyBar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      stickyBar.style.display = 'flex';
    } else {
      stickyBar.style.display = 'none';
    }
  });
}

/* --- 3. Modal RSVP & Envio WhatsApp --- */
function openRSVPModal() {
  const modal = document.getElementById('rsvpModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeRSVPModal() {
  const modal = document.getElementById('rsvpModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

window.addEventListener('click', (e) => {
  const modal = document.getElementById('rsvpModal');
  if (e.target === modal) {
    closeRSVPModal();
  }
});

function handleRSVPSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('participantName').value.trim();
  const company = document.getElementById('companyName').value.trim();
  const accompany = document.getElementById('accompanyCount').value;

  if (!name || !company) return;

  const textMessage = 
    `*CONFIRMAÇÃO DE PRESENÇA — O NOVO JOGO TRIBUTÁRIO NO BRASIL*\n\n` +
    `Olá! Gostaria de confirmar minha presença no evento do dia 15/09/2026.\n\n` +
    `👤 *Nome:* ${name}\n` +
    `🏢 *Empresa / Cargo:* ${company}\n` +
    `👥 *Acompanhantes:* ${accompany}\n\n` +
    `Aguardo o envio da confirmação de vaga!`;

  const encodedMessage = encodeURIComponent(textMessage);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
  closeRSVPModal();
}

/* --- 4. Adicionar ao Google Calendar --- */
function addToCalendar() {
  const title = encodeURIComponent("O Novo Jogo Tributário no Brasil: Como preparar sua empresa para 2026");
  const details = encodeURIComponent("Evento sobre Reforma Tributária do Consumo, Reforma da Renda, Desafios Contábeis e Holdings Familiares. Realização: CTSADV & Objetivo Camboinhas.");
  const location = encodeURIComponent("Colégio Objetivo Camboinhas - Rua Prof. Álvaro Caetano, 908, Camboinhas, Niterói - RJ");
  
  const dates = "20260915T220000Z/20260916T000000Z";
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

  window.open(googleCalUrl, '_blank');
}

/* --- 5. Compartilhar Convite --- */
function shareInvite() {
  const shareData = {
    title: 'O Novo Jogo Tributário no Brasil',
    text: 'Convite Especial: Como preparar sua empresa para a nova realidade fiscal em 2026. 15/09 às 19h no Colégio Objetivo Camboinhas.',
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch((err) => console.log('Erro ao compartilhar:', err));
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Link do convite copiado para a área de transferência!");
    }).catch(() => {
      showToast("Link: " + window.location.href);
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
