/**
 * ============================================================================
 * Close Friends VIP - Giulia Castro
 * SCRIPT EXTERNO - Funcionalidades
 * ============================================================================
 * Data de criação: 30/10/2025
 * Última atualização: 01/11/2025
 * ============================================================================
 */

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const CONFIG = {
  WEBHOOK_URL: 'https://n8noraclefull.t3c0t4z.shop/webhook/lead-cadastro',
  TIMEOUT: 30000,
  AUTO_HIDE_ERROR: 5000,
  SCROLL_BEHAVIOR: 'smooth'
};

// ============================================================================
// VALIDAÇÕES
// ============================================================================

const VALIDATORS = {
  instagram: (value) => {
    const cleanValue = value.trim();
    const regex = /^@?[a-zA-Z0-9._]{1,30}$/;
    return regex.test(cleanValue);
  },

  whatsapp: (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.length >= 10 && cleanValue.length <= 15;
  },

  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value.trim());
  }
};

// ============================================================================
// ELEMENTOS DO DOM
// ============================================================================

const DOM = {
  form: document.getElementById('cfForm'),
  usernameInput: document.getElementById('username'),
  whatsappInput: document.getElementById('whatsapp'),
  emailInput: document.getElementById('email'),
  submitBtn: document.getElementById('submitBtn'),
  errorMessage: document.getElementById('errorMessage'),
  themeToggle: document.getElementById('themeToggle'),
  quickAccess: document.getElementById('quickAccess')
};

// ============================================================================
// THEME TOGGLE
// ============================================================================

function initThemeToggle() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  DOM.themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// ============================================================================
// QUICK ACCESS
// ============================================================================

function initQuickAccess() {
  DOM.quickAccess.addEventListener('click', () => {
    DOM.form.scrollIntoView({ behavior: CONFIG.SCROLL_BEHAVIOR, block: 'start' });
    DOM.usernameInput.focus();
  });
}

// ============================================================================
// VALIDAÇÃO DE INPUTS
// ============================================================================

function validateInput(input, type) {
  const value = input.value.trim();
  const errorElement = document.getElementById(`${type}Error`);
  const successElement = document.getElementById(`${type}Success`);
  const isValid = VALIDATORS[type](value);

  input.classList.remove('valid', 'invalid');
  errorElement.classList.remove('show');
  successElement.classList.remove('show');

  if (value.length === 0) {
    return null; // Campo vazio
  }

  if (isValid) {
    input.classList.add('valid');
    successElement.classList.add('show');
    successElement.textContent = '✓ Válido';
    return true;
  } else {
    input.classList.add('invalid');
    errorElement.classList.add('show');
    
    switch(type) {
      case 'instagram':
        errorElement.textContent = 'Instagram inválido (@usuario)';
        break;
      case 'whatsapp':
        errorElement.textContent = 'WhatsApp inválido (DDD + número)';
        break;
      case 'email':
        errorElement.textContent = 'E-mail inválido';
        break;
    }
    return false;
  }
}

// Adicionar validação em tempo real
DOM.usernameInput.addEventListener('blur', () => validateInput(DOM.usernameInput, 'instagram'));
DOM.whatsappInput.addEventListener('blur', () => validateInput(DOM.whatsappInput, 'whatsapp'));
DOM.emailInput.addEventListener('blur', () => validateInput(DOM.emailInput, 'email'));

// Limpar feedback ao digitar
DOM.usernameInput.addEventListener('input', () => {
  const errorEl = document.getElementById('usernameError');
  const successEl = document.getElementById('usernameSuccess');
  errorEl.classList.remove('show');
  successEl.classList.remove('show');
  DOM.usernameInput.classList.remove('valid', 'invalid');
});

DOM.whatsappInput.addEventListener('input', () => {
  const errorEl = document.getElementById('whatsappError');
  const successEl = document.getElementById('whatsappSuccess');
  errorEl.classList.remove('show');
  successEl.classList.remove('show');
  DOM.whatsappInput.classList.remove('valid', 'invalid');
});

DOM.emailInput.addEventListener('input', () => {
  const errorEl = document.getElementById('emailError');
  const successEl = document.getElementById('emailSuccess');
  errorEl.classList.remove('show');
  successEl.classList.remove('show');
  DOM.emailInput.classList.remove('valid', 'invalid');
});

// ============================================================================
// FORMATAÇÃO DE INPUTS
// ============================================================================

function formatWhatsApp(value) {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 2) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }
}

function formatInstagram(value) {
  let formatted = value.trim();
  if (formatted && !formatted.startsWith('@')) {
    formatted = '@' + formatted;
  }
  return formatted.toLowerCase();
}

DOM.whatsappInput.addEventListener('input', (e) => {
  e.target.value = formatWhatsApp(e.target.value);
});

DOM.usernameInput.addEventListener('input', (e) => {
  e.target.value = formatInstagram(e.target.value);
});

// ============================================================================
// SUBMISSÃO DO FORMULÁRIO
// ============================================================================

async function submitForm(e) {
  e.preventDefault();

  // Validar todos os campos
  const usernameValid = validateInput(DOM.usernameInput, 'instagram');
  const whatsappValid = validateInput(DOM.whatsappInput, 'whatsapp');
  const emailValid = validateInput(DOM.emailInput, 'email');

  if (!usernameValid || !whatsappValid || !emailValid) {
    alert('⚠️ Preencha todos os campos corretamente!');
    return;
  }

  // Desabilitar botão
  DOM.submitBtn.disabled = true;
  DOM.submitBtn.textContent = '⏳ Enviando...';

  // Esconder erro anterior
  hideErrorMessage();

  try {
    const formData = {
      status: 'sucesso',
      tipo: 'Assinante_cadastrado_com_sucesso',
      mensagem: 'Lead cadastrado com sucesso na Close Friends!',
      username: DOM.usernameInput.value.trim(),
      whatsapp: DOM.whatsappInput.value.replace(/\D/g, ''),
      email: DOM.emailInput.value.trim(),
      origem: window.location.href,
      cadastro_em: new Date().toISOString(),
      registrado_em: new Date().toISOString(),
      response_code: 201,
      sucesso: true
    };

    // Enviar para o webhook
    const response = await fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
      signal: AbortSignal.timeout(CONFIG.TIMEOUT)
    });

    const data = await response.json().catch(() => ({}));

    // Verificar se é erro de duplicado
    if (response.status === 409 || 
        data.code === '23505' || 
        data.message?.toLowerCase().includes('duplicate') ||
        data.message?.toLowerCase().includes('duplicado')) {
      
      showDuplicateError();
      resetSubmitButton();
      return;
    }

    // Sucesso
    if (response.ok || response.status === 201 || response.status === 200) {
      showSuccessState();
      DOM.form.reset();
      clearAllValidation();
      
      setTimeout(() => {
        resetSubmitButton();
      }, 3000);
    } else {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

  } catch (error) {
    console.error('Erro ao enviar formulário:', error);

    // Verificar se é erro de duplicado
    if (error.message?.toLowerCase().includes('duplicate') || 
        error.message?.toLowerCase().includes('duplicado')) {
      showDuplicateError();
    } else {
      alert('❌ Erro ao enviar cadastro. Tente novamente!');
    }

    resetSubmitButton();
  }
}

// ============================================================================
// FUNÇÕES DE ERRO
// ============================================================================

function showDuplicateError() {
  const errorEl = document.getElementById('errorMessage');
  
  if (!errorEl) {
    console.error('Elemento de erro não encontrado');
    return;
  }

  errorEl.style.display = 'block';
  
  // Scroll até o erro
  errorEl.scrollIntoView({ 
    behavior: CONFIG.SCROLL_BEHAVIOR, 
    block: 'center' 
  });

  // Esconder após tempo definido
  setTimeout(() => {
    hideErrorMessage();
  }, CONFIG.AUTO_HIDE_ERROR);
}

function hideErrorMessage() {
  const errorEl = document.getElementById('errorMessage');
  if (errorEl) {
    errorEl.style.display = 'none';
  }
}

// ============================================================================
// FUNÇÕES DE ESTADO
// ============================================================================

function showSuccessState() {
  DOM.submitBtn.textContent = '✅ Cadastro Realizado!';
  DOM.submitBtn.style.background = '#22c55e';
}

function resetSubmitButton() {
  DOM.submitBtn.disabled = false;
  DOM.submitBtn.textContent = '🔥 Enviar Cadastro';
  DOM.submitBtn.style.background = '';
}

function clearAllValidation() {
  [DOM.usernameInput, DOM.whatsappInput, DOM.emailInput].forEach(input => {
    input.classList.remove('valid', 'invalid');
  });

  ['usernameError', 'usernameSuccess', 'whatsappError', 'whatsappSuccess', 'emailError', 'emailSuccess'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });
}

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar theme toggle
  initThemeToggle();

  // Inicializar quick access
  initQuickAccess();

  // Adicionar event listener ao formulário
  DOM.form.addEventListener('submit', submitForm);

  // Validar email em tempo real (mais rigoroso)
  DOM.emailInput.addEventListener('blur', () => {
    validateInput(DOM.emailInput, 'email');
  });

  // Permitir submit com Enter
  DOM.form.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target !== DOM.submitBtn) {
      e.preventDefault();
      DOM.form.dispatchEvent(new Event('submit'));
    }
  });

  // Verificar tema ao carregar
  const savedTheme = localStorage.getItem('theme') || 'dark';
  console.log('✅ Tema carregado:', savedTheme);
  console.log('✅ Webhook configurado:', CONFIG.WEBHOOK_URL);
});

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

function getClientInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString()
  };
}

function logEvent(eventName, data = {}) {
  console.log(`[${new Date().toLocaleTimeString()}] ${eventName}`, data);
}

// Log de inicialização
logEvent('APP_INITIALIZED', {
  theme: localStorage.getItem('theme') || 'dark',
  userAgent: navigator.userAgent
});
