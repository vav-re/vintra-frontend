// Estado global
const state = {
    currentView: null,
    currentPatientId: null,
    currentDocumentId: null,
    documents: [],
    recentPatients: []
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log("VINTRA Inicializando...");
    loadDemoData();
    setupEventListeners();
    
    // Estado inicial: Login visível
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');
    
    if (loginScreen && appContainer) {
        loginScreen.style.display = 'flex';
        appContainer.style.display = 'none';
    } else {
        console.warn("Elementos básicos não encontrados");
    }

    // Renderiza a seleção de pacientes no dashboard
    renderPatientSelectionOnDashboard();
});

// Carregamento de dados demo
function loadDemoData() {
    // Pacientes recentes
    state.recentPatients = [
        { id: 'patient-1', name: 'Maria Silva', age: 38, gender: 'Feminino', lastVisit: '28/03/2025', status: 'Em tratamento' },
        { id: 'patient-2', name: 'João Santos', age: 42, gender: 'Masculino', lastVisit: '25/03/2025', status: 'Primeira consulta' },
        { id: 'patient-3', name: 'Ana Oliveira', age: 29, gender: 'Feminino', lastVisit: '20/03/2025', status: 'Em tratamento' },
        { id: 'patient-4', name: 'Carlos Pereira', age: 55, gender: 'Masculino', lastVisit: '15/03/2025', status: 'Retorno' }
    ];
    
    // Documentos de exemplo
    state.documents = [
        // Docs Paciente 1
        { id: 'doc1', patientId: 'patient-1', title: 'Entrevista_Maria_2503.mp3', type: 'audio', date: '25/03/2025', time: '10:30', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '15.3 MB', duration: '28:45' },
        { id: 'doc2', patientId: 'patient-1', title: 'Transcrição_Maria_2503.txt', type: 'transcription', date: '25/03/2025', time: '10:35', icon: 'fas fa-file-alt', color: 'var(--accent)', size: '5 KB' },
        // Outros documentos...
    ];
    console.log("Dados de demonstração carregados.");
}

// Setup de eventos
function setupEventListeners() {
    setupLogin();
    setupNavigation();
    
    // Adicionar listeners para botões
    document.querySelectorAll('[data-target]').forEach(element => {
        element.addEventListener('click', function() {
            const viewId = this.dataset.target;
            window.switchView(viewId);
        });
    });
}

// Login
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');

    if (loginForm && passwordInput && passwordError && loginScreen && appContainer) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const password = passwordInput.value;
            
            if (password === "123") { // Senha de demonstração
                passwordError.style.display = 'none';
                showToast('success', 'Login bem-sucedido', 'Bem-vindo ao VINTRA!');
                
                // Transição visual
                loginScreen.style.opacity = '0';
                setTimeout(function() {
                    loginScreen.style.display = 'none';
                    appContainer.style.display = 'flex';
                    appContainer.style.opacity = '1';
                    
                    // Mostrar dashboard
                    state.currentView = null; // Força nova renderização
                    window.switchView('dashboard');
                    
                    // Garantir que o dashboard apareça
                    setTimeout(function() {
                        const dashboardView = document.getElementById('dashboard-view');
                        if (dashboardView) {
                            dashboardView.style.display = 'block';
                            dashboardView.classList.add('active');
                            renderPatientSelectionOnDashboard();
                        }
                    }, 300);
                }, 600);
            } else {
                passwordError.style.display = 'block';
                passwordInput.focus();
                passwordInput.select();
            }
        });
    } else {
        console.error("Elementos de login não encontrados");
    }
}

// Navegação
function setupNavigation() {
    document.body.addEventListener('click', function(e) {
        const link = e.target.closest('[data-target]');
        
        if (link?.dataset.target) {
            e.preventDefault();
            const targetView = link.dataset.target;
            
            if (targetView === 'sair') {
                logout();
            } else if (state.currentView !== targetView) {
                window.switchView(targetView);
            }
        }
    });
}

// Logout
function logout() {
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');
    const passwordInput = document.getElementById('password');
    
    if (loginScreen && appContainer) {
        appContainer.style.opacity = '0';
        setTimeout(function() {
            appContainer.style.display = 'none';
            loginScreen.style.display = 'flex';
            loginScreen.style.opacity = '1';
            if (passwordInput) passwordInput.value = '';
            
            state.currentView = null;
            state.currentPatientId = null;
            state.currentDocumentId = null;
        }, 600);
    }
}

// Troca de views
window.switchView = function(viewId) {
    console.log(`Trocando para view: ${viewId}`);
    
    // Verificar se a view existe
    const newViewElem = document.getElementById(`${viewId}-view`);
    if (!newViewElem) {
        console.error(`View não encontrada: ${viewId}-view`);
        return;
    }
    
    // Esconder todas as views
    document.querySelectorAll('.workspace').forEach(function(view) {
        view.style.display = 'none';
        view.classList.remove('active');
    });
    
    // Mostrar a view solicitada
    const newViewDisplayStyle = (viewId === 'library') ? 'flex' : 'block';
    newViewElem.style.display = newViewDisplayStyle;
    newViewElem.classList.add('active');
    
    // Ações específicas por view
    if (viewId === 'dashboard') {
        renderPatientSelectionOnDashboard();
    }
    
    // Atualizar estado
    state.currentView = viewId;
    updateNavigation(viewId);
};

// Atualiza navegação ativa
function updateNavigation(activeViewId) {
    const allLinks = document.querySelectorAll('.nav-item[data-target], .sidebar-link[data-target], .mobile-menu-item[data-target]');
    allLinks.forEach(link => {
        const isActive = link.dataset.target === activeViewId;
        link.classList.toggle('active', isActive);
    });
}

// Renderização do dashboard
function renderPatientSelectionOnDashboard() {
    const container = document.getElementById('dashboard-view');
    if (!container) return;
    
    // Cria a seção de seleção de pacientes se não existir
    let patientSelectionSection = container.querySelector('.patient-selection-section');
    if (!patientSelectionSection) {
        patientSelectionSection = document.createElement('div');
        patientSelectionSection.className = 'patient-selection-section';
        
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = `<h2 class="section-title">Aceder Paciente</h2>`;
        patientSelectionSection.appendChild(header);
        
        const searchBar = document.createElement('div');
        searchBar.className = 'search-container dashboard-search';
        searchBar.innerHTML = `
            <div class="search-bar">
                <i class="fas fa-search search-icon"></i>
                <input type="text" id="dashboardPatientSearch" placeholder="Buscar paciente por nome ou ID..." class="search-input">
            </div>
        `;
        patientSelectionSection.appendChild(searchBar);
        
        const patientListDiv = document.createElement('div');
        patientListDiv.id = 'dashboardPatientList';
        patientListDiv.className = 'patient-card-list';
        patientSelectionSection.appendChild(patientListDiv);
        
        container.appendChild(patientSelectionSection);
    }
    
    // Renderiza a lista de pacientes
    renderPatientList();
}

// Renderiza a lista de pacientes
function renderPatientList(searchTerm = '') {
    const patientListDiv = document.getElementById('dashboardPatientList');
    if (!patientListDiv) return;
    
    patientListDiv.innerHTML = '';
    
    const filteredPatients = state.recentPatients.filter(p => 
        !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.includes(searchTerm)
    );
    
    if (filteredPatients.length === 0) {
        patientListDiv.innerHTML = '<p class="empty-list-message">Nenhum paciente encontrado.</p>';
        return;
    }
    
    filteredPatients.forEach(patient => {
        const card = document.createElement('div');
        card.className = 'patient-card dashboard-patient-card';
        card.dataset.id = patient.id;
        card.innerHTML = `
            <div class="patient-card-header">
                <div class="patient-avatar">${patient.name.charAt(0)}</div>
                <div class="patient-card-name">${escapeHtml(patient.name)}</div>
            </div>
            <div class="patient-card-info">ID: ${escapeHtml(patient.id)}</div>
            <button class="btn btn-sm btn-primary access-patient-btn" data-patient-id="${patient.id}">Aceder</button>
        `;
        
        card.querySelector('.access-patient-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            openPatientPanel(patient.id);
        });
        
        patientListDiv.appendChild(card);
    });
    
    // Adiciona evento de busca
    const searchInput = document.getElementById('dashboardPatientSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderPatientList(this.value);
        });
    }
}

// Abre o painel do paciente
function openPatientPanel(patientId) {
    const patient = state.recentPatients.find(p => p.id === patientId);
    if (!patient) {
        showToast('error', 'Erro', 'Paciente não encontrado.');
        return;
    }
    
    console.log(`Abrindo painel para paciente: ${patient.name} (ID: ${patientId})`);
    state.currentPatientId = patientId;
    
    // Atualiza informações do paciente
    const nameElem = document.querySelector('#patient-view .patient-name');
    const detailsElem = document.querySelector('#patient-view .patient-details');
    
    if (nameElem) nameElem.textContent = patient.name;
    if (detailsElem) detailsElem.textContent = `${patient.age} anos • ${patient.gender} • Prontuário #${patientId.replace('patient-', '')}`;
    
    window.switchView('patient');
}

// Escape HTML para prevenção de XSS
function escapeHtml(unsafe) {
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Toasts
function showToast(type, title, message, duration = 5000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fas fa-info-circle';
    if (type === 'success') iconClass = 'fas fa-check-circle';
    else if (type === 'error') iconClass = 'fas fa-times-circle';
    else if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
    
    toast.innerHTML = `
        <div class="toast-icon ${type}"> <i class="${iconClass}"></i> </div>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
        </div>
        <button class="toast-close"> <i class="fas fa-times"></i> </button>
    `;
    
    toast.querySelector('.toast-close').addEventListener('click', function() {
        removeToast(toast);
    });
    
    container.appendChild(toast);
    
    // Animação simples
    setTimeout(() => toast.style.opacity = '1', 10);
    
    setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
}

// Exportar funções para uso global
window.openPatientPanel = openPatientPanel;
window.showToast = showToast;
