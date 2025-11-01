/**
 * ============================================================================
 * Close Friends VIP - Giulia Castro
 * JAVASCRIPT LIMPO - Conexão com n8n Webhook
 * ============================================================================
 * Data de criação: 31/10/2025
 * Última atualização: 31/10/2025
 * ============================================================================
 */

'use strict';

// ========================================
// CONFIGURAÇÃO DA WEBHOOK
// ========================================
const WEBHOOK_URL = 'https://n8noraclefull.t3c0t4z.shop/webhook/lead-cadastro';

// ========================================
// REGEX PATTERNS
// ========================================
const VALIDATION_PATTERNS = {
  instagram: /^@[a-zA-Z0-9_.]{1,29}$/,
  whatsapp: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
};

const VALIDATION_MESSAGES = {
  instagram: {
    empty: 'Username do Instagram é obrigatório',
    invalid: 'Username deve começar com @ e ter 2-30 caracteres',
    success: '✓ Username válido'
  },
  whatsapp: {
    empty: 'WhatsApp é obrigatório',
    invalid: 'Formato inválido. Use: (21) 97191-6161',
    success: '✓ WhatsApp válido'
  },
  email: {
    empty: 'Email é obrigatório',
    invalid: 'Email inválido. Use: seu@email.com',
    success: '✓ Email válido'
  }
};

// ========================================
// ELEMENTOS DO DOM
// ========================================
const form = document.getElementById('cfForm');
const usernameInput = document.getElementById('username');
const whatsappInput = document.getElementById('whatsapp');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const themeToggle = document.getElementById('themeToggle');
const quickAccess = document.getElementById('quickAccess');
const profileImg = document.getElementById('profileImg');

// ========================================
// VALIDAÇÃO EM TEMPO REAL
// ========================================
function validateUsername(value, showFeedback = true) {
  const errorEl = document.getElementById('usernameError');
  const successEl = document.getElementById('usernameSuccess');
  
  errorEl.classList.remove('show');
  successEl.classList.remove('show');
  usernameInput.classList.remove('valid', 'invalid');
  
  if (!value) {
    if (showFeedback) {
      errorEl.textContent = VALIDATION_MESSAGES.instagram.empty;
      errorEl.classList.add('show');
      usernameInput.classList.add('invalid');
    }
    return false;
  }
  
  if (!value.startsWith('@')) {
    usernameInput.value = '@' + value;
    value = usernameInput.value;
  }
  
  if (!VALIDATION_PATTERNS.instagram.test(value)) {
    if (showFeedback) {
      errorEl.textContent = VALIDATION_MESSAGES.instagram.invalid;
      errorEl.classList.add('show');
      usernameInput.classList.add('invalid');
    }
    return false;
  }
  
  if (showFeedback) {
    successEl.textContent = VALIDATION_MESSAGES.instagram.success;
    successEl.classList.add('show');
    usernameInput.classList.add('valid');
  }
  return true;
}

function validateWhatsApp(value, showFeedback = true) {
  const errorEl = document.getElementById('whatsappError');
  const successEl = document.getElementById('whatsappSuccess');
  
  errorEl.classList.remove('show');
  successEl.classList.remove('show');
  whatsappInput.classList.remove('valid', 'invalid');
  
  if (!value) {
    if (showFeedback) {
      errorEl.textContent = VALIDATION_MESSAGES.whatsapp.empty;
      errorEl.classList.add('show');
      whatsappInput.classList.add('invalid');
    }
    return false;
  }
  
  if (!VALIDATION_PATTERNS.whatsapp.test(value)) {
    if (showFeedback) {
      errorEl.textContent = VALIDATION_MESSAGES.whatsapp.invalid;
      errorEl.classList.add('show');
      whatsappInput.classList.add('invalid');
    }
    return false;
  }
  
  if (showFeedback) {
    successEl.textContent = VALIDATION_MESSAGES.whatsapp.success;
    successEl.classList.add('show');
    whatsappInput.classList.add('valid');
  }
  return true;
}

function validateEmail(value, showFeedback = true) {
  const errorEl = document.getElementById('emailError');
  const successEl = document.getElementById('emailSuccess');
  
  errorEl.classList.remove('show');
  successEl.classList.remove('show');
  emailInput.classList.remove('valid', 'invalid');
  
  if (!value) {
    if (showFeedback) {
      errorEl.textContent = VALIDATION_MESSAGES.email.empty;
      errorEl.classList.add('show');
      emailInput.classList.add('invalid');
    }
    return false;
  }
  
  if (!VALIDATION_PATTERNS.email.test(value)) {
    if (showFeedback) {
      errorEl.textContent = VALIDATION_MESSAGES.email.invalid;
      errorEl.classList.add('show');
      emailInput.classList.add('invalid');
    }
    return false;
  }
  
  if (showFeedback) {
    successEl.textContent = VALIDATION_MESSAGES.email.success;
    successEl.classList.add('show');
    emailInput.classList.add('valid');
  }
  return true;
}

// ========================================
// MÁSCARA DE WHATSAPP
// ========================================
function maskWhatsApp(value) {
  value = value.replace(/\D/g, '');
  value = value.substring(0, 11);
  
  if (value.length <= 2) {
    value = value.replace(/(\d{0,2})/, '($1');
  } else if (value.length <= 6) {
    value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
  } else if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else {
    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  }
  
  return value;
}

// ========================================
// EVENT LISTENERS - VALIDAÇÃO
// ========================================
usernameInput.addEventListener('input', (e) => {
  validateUsername(e.target.value.trim(), false);
});

usernameInput.addEventListener('blur', (e) => {
  validateUsername(e.target.value.trim(), true);
});

whatsappInput.addEventListener('input', (e) => {
  e.target.value = maskWhatsApp(e.target.value);
  validateWhatsApp(e.target.value, false);
});

whatsappInput.addEventListener('blur', (e) => {
  validateWhatsApp(e.target.value, true);
});

emailInput.addEventListener('input', (e) => {
  validateEmail(e.target.value.trim(), false);
});

emailInput.addEventListener('blur', (e) => {
  validateEmail(e.target.value.trim(), true);
});

// ========================================
// QUICK ACCESS BUTTON
// ========================================
quickAccess.addEventListener('click', () => {
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  usernameInput.focus();
});

// ========================================
// THEME TOGGLE
// ========================================
let isDarkTheme = true;

themeToggle.addEventListener('click', () => {
  isDarkTheme = !isDarkTheme;
  document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  
  const icon = themeToggle.querySelector('svg path');
  if (isDarkTheme) {
    icon.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
  } else {
    icon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
  }
  
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  isDarkTheme = savedTheme === 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const icon = themeToggle.querySelector('svg path');
  if (!isDarkTheme) {
    icon.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
  }
}

// ========================================
// EFEITOS NA IMAGEM
// ========================================
profileImg.addEventListener('mousemove', (e) => {
  const rect = profileImg.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 20;
  const rotateY = (centerX - x) / 20;
  
  profileImg.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
});

profileImg.addEventListener('mouseleave', () => {
  profileImg.style.transform = '';
});

profileImg.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  const rect = profileImg.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 241, 120, 0.4) 0%, transparent 70%);
    top: ${y}px;
    left: ${x}px;
    pointer-events: none;
    animation: ripple-expand 0.8s ease-out;
    z-index: 5;
  `;
  
  const container = profileImg.parentElement;
  container.style.position = 'relative';
  container.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 800);
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple-expand {
    from { transform: scale(0); opacity: 1; }
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// ========================================
// CONFETTI EFFECT
// ========================================
function createConfetti() {
  const colors = ['#00f178', '#00b894', '#ffd700', '#ff3b9a', '#00d2ff'];
  const confettiCount = 60;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: -10px;
      left: ${Math.random() * 100}vw;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
      transform: rotate(${Math.random() * 360}deg);
    `;
    
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
  
  const confettiStyleEl = document.createElement('style');
  confettiStyleEl.textContent = `
    @keyframes confetti-fall {
      to {
        transform: translateY(100vh) rotate(${Math.random() * 720}deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(confettiStyleEl);
}

// ========================================
// SUBMIT LIMPO - APENAS N8N WEBHOOK
// ========================================
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = usernameInput.value.trim();
  const whatsapp = whatsappInput.value.trim();
  const email = emailInput.value.trim();
  
  // Validação completa
  const isUsernameValid = validateUsername(username, true);
  const isWhatsAppValid = validateWhatsApp(whatsapp, true);
  const isEmailValid = validateEmail(email, true);
  
  if (!isUsernameValid || !isWhatsAppValid || !isEmailValid) {
    const firstInvalid = form.querySelector('.form-input.invalid');
    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Desabilitar botão
  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Enviando...';
  submitBtn.style.opacity = '0.7';
  
  // Payload limpo
  const payload = {
    username: username,
    whatsapp: whatsapp,
    email: email,
    origem: window.location.href,
    timestamp: new Date().toISOString()
  };
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Sucesso
    createConfetti();
    
    submitBtn.textContent = '✅ Cadastro Realizado!';
    submitBtn.style.background = 'linear-gradient(135deg, #00f178, #00b894)';
    submitBtn.style.opacity = '1';
    
    // Reset formulário após 2 segundos
    setTimeout(() => {
      form.reset();
      document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('valid', 'invalid');
      });
      document.querySelectorAll('.validation-feedback').forEach(feedback => {
        feedback.classList.remove('show');
      });
      submitBtn.disabled = false;
      submitBtn.textContent = '🔥 Quero Acesso Agora';
      submitBtn.style.background = '';
      submitBtn.style.opacity = '';
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erro ao enviar:', error);
    
    submitBtn.textContent = '❌ Erro - Tente Novamente';
    submitBtn.style.background = 'linear-gradient(135deg, #ff4757, #e84118)';
    submitBtn.style.opacity = '1';
    
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = '🔥 Quero Acesso Agora';
      submitBtn.style.background = '';
      submitBtn.style.opacity = '';
    }, 3000);
  }
});

// ========================================
// CONSOLE BRANDING
// ========================================
console.log('%c💚 Close Friends VIP - Giulia Castro', 'color: #00f178; font-size: 24px; font-weight: bold;');
console.log('%c✨ Landing Page conectada ao n8n', 'color: #00b894; font-size: 16px;');
