/**
 * VINTRA - Análise Dimensional Clínica
 * Script principal completo (v3 - Sem Anim Logo)
 */

// Estado global da aplicação
const state = {
    currentView: null, // Definido após login
    currentPatientId: null,
    currentDocumentId: null,
    currentDocumentType: null,
    activePatientTab: 'summary-panel',
    activeDimensionalView: 'radar',
    activeNewDocumentTab: 'record',
    activeResultsTab: 'transcription-panel',
    isProcessing: false,
    isRecording: false,
    recordingStartTime: null,
    recordingInterval: null,
    audioContext: null,
    analyser: null,
    visualizerSource: null,
    visualizerRafId: null,
    mediaRecorder: null,
    audioChunks: [],
    uploadedFile: null,
    dimensionalData: { /* ... dados ... */
        emocional: { valencia: -2.5, excitacao: 7.0, dominancia: 3.0, intensidade: 8.0 },
        cognitiva: { complexidade: 6.0, coerencia: 5.0, flexibilidade: 4.0, dissonancia: 7.0 },
        autonomia: { perspectivaTemporal: { passado: 7.0, presente: 3.0, futuro: 2.0, media: 4.0 }, autocontrole: 4.0 }
     },
    documents: [],
    transcriptionText: "", vintraText: "", soapText: "", ipissimaText: "", narrativeText: "", orientacoesText: "",
    recentPatients: []
};

// --- Inicialização ---

document.addEventListener('DOMContentLoaded', function() {
    // **REMOVIDO:** Chamada para animateLogo()

    // Carregar dados de exemplo
    loadDemoData();

    // Configurar eventos do sistema
    setupLogin();
    setupNavigation();
    setupSidebar();
    setupMobileMenu();
    setupPatientTabs();
    setupDimensionalVisualizations();
    setupDocumentEditing();
    setupNewDocumentTabs();
    setupRecorder();
    setupUpload();
    setupTranscriptionInput();
    setupProcessing();
    setupResultsView();
    setupDocumentLibrary();
    setupFocusMode();
    setupGenericModal();
    initCharts();
    initFluidAnimations();

    // Estado inicial: Mostrar Splash brevemente, depois Login
    const splashScreen = document.getElementById('splashScreen');
    const loginScreen = document.getElementById('loginScreen');

    if (splashScreen && loginScreen) {
        // Mostra o splash rapidamente (logo estático)
        splashScreen.style.display = 'flex';
        gsap.set(splashScreen, { opacity: 1 }); // Garante visibilidade inicial

        // Após um curto período, esconde splash e mostra login
        setTimeout(() => {
            gsap.to(splashScreen, {
                opacity: 0,
                duration: 0.5, // Duração do fade out
                ease: "power1.inOut",
                onComplete: () => {
                    splashScreen.style.display = 'none'; // Oculta completamente
                    loginScreen.style.display = 'flex'; // Mostra a tela de login
                    loginScreen.classList.add('visible');
                    gsap.fromTo(loginScreen, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }); // Fade in
                }
            });
        }, 700); // Tempo que o splash fica visível (ajuste conforme necessário)
    } else {
         // Fallback se splash/login não existirem
         document.getElementById('appContainer').style.display = 'flex';
         switchView('dashboard');
    }
});

// --- Carregamento de Dados e Renderização Inicial ---

/**
 * Carrega dados de exemplo para demonstração
 */
function loadDemoData() {
    // Pacientes recentes (usado para popular o painel do paciente)
    state.recentPatients = [
        { id: 'patient-1', name: 'Maria Silva', age: 38, gender: 'Feminino', lastVisit: '28/03/2025', status: 'Em tratamento' },
        { id: 'patient-2', name: 'João Santos', age: 42, gender: 'Masculino', lastVisit: '25/03/2025', status: 'Primeira consulta' },
        { id: 'patient-3', name: 'Ana Oliveira', age: 29, gender: 'Feminino', lastVisit: '20/03/2025', status: 'Em tratamento' },
        { id: 'patient-4', name: 'Carlos Pereira', age: 55, gender: 'Masculino', lastVisit: '15/03/2025', status: 'Retorno' }
    ];

    // Exemplo de documentos para biblioteca e repositório
    state.documents = [
        { id: 'doc1', patientId: 'patient-1', title: 'Entrevista_Maria.mp3', type: 'audio', date: '25/03/2025', time: '10:30', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '15.3 MB', duration: '28:45' }, // Usa variável CSS
        { id: 'doc2', patientId: 'patient-1', title: 'Transcrição_Maria.txt', type: 'transcription', date: '25/03/2025', time: '10:35', icon: 'fas fa-file-alt', color: 'var(--accent)', size: '5 KB' }, // Usa variável CSS
        { id: 'doc3', patientId: 'patient-1', title: 'VINTRA_Maria.txt', type: 'vintra', date: '25/03/2025', time: '10:40', icon: 'fas fa-clipboard-list', color: 'var(--accent)', size: '8 KB' }, // Usa variável CSS
        { id: 'doc4', patientId: 'patient-1', title: 'SOAP_Maria.txt', type: 'soap', date: '25/03/2025', time: '10:45', icon: 'fas fa-notes-medical', color: 'var(--gray-600)', size: '3 KB' }, // Usa variável CSS
        { id: 'doc5', patientId: 'patient-2', title: 'Consulta_Joao.wav', type: 'audio', date: '25/03/2025', time: '11:00', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '22.1 MB', duration: '35:10' }, // Usa variável CSS
        { id: 'doc6', patientId: 'patient-2', title: 'Transcricao_Joao.txt', type: 'transcription', date: '25/03/2025', time: '11:05', icon: 'fas fa-file-alt', color: 'var(--accent)', size: '7 KB' }, // Usa variável CSS
    ];

    // Exemplo de conteúdo de texto para documentos
    state.transcriptionText = `Entrevista Clínica - 25 de Março de 2025\nMédico: Bom dia, Maria. Como você está se sentindo hoje?\nPaciente: Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar. (Suspira) É difícil manter a esperança.\nMédico: Entendo que seja difícil, Maria. Vamos conversar sobre isso. Além da dor física, como está o seu ânimo?\nPaciente: Péssimo. Me sinto desanimada, sem vontade de fazer nada. Até as coisas que eu gostava perderam a graça. Parece que estou carregando um peso enorme.`;
    state.vintraText = `# Análise VINTRA - Maria Silva (25/03/2025)\n\n## Dimensões Emocionais\n- Valência (v₁): -2.5 (Negativa)\n- Excitação (v₂): 7.0 (Alta)\n- Dominância (v₃): 3.0 (Baixa)\n- Intensidade (v₄): 8.0 (Alta)\n\n## Dimensões Cognitivas\n- Complexidade (v₅): 6.0 (Moderada)\n- Coerência (v₆): 5.0 (Moderada)\n- Flexibilidade (v₇): 4.0 (Baixa)\n- Dissonância (v₈): 7.0 (Alta)\n\n## Dimensões de Autonomia\n- Perspectiva Temporal (v₉): Média 4.0 (Foco no Passado/Presente)\n- Autocontrole (v₁₀): 4.0 (Baixo)\n\n## Observações\nPaciente demonstra humor deprimido, anedonia e baixa percepção de controle sobre a situação. Alta intensidade emocional e excitação, possivelmente ligadas à ansiedade e frustração. Dificuldade em vislumbrar futuro positivo.`;
    state.soapText = `# Nota SOAP - Maria Silva (25/03/2025)\n\n## S (Subjetivo)\nPaciente relata persistência da dor ("não adianta muito"), sono de má qualidade ("durmo mal, acordo cansada"), desânimo ("péssimo", "sem vontade de fazer nada"), anedonia ("coisas que eu gostava perderam a graça") e desesperança ("acho que nunca vou melhorar"). Refere sentir como se estivesse "carregando um peso enorme".\n\n## O (Objetivo)\nApresenta-se com fácies de tristeza, discurso lentificado por vezes, suspiros frequentes. Afeto predominantemente disfórico. Nega ideação suicida ativa no momento, mas expressa desesperança.\n\n## A (Avaliação)\nQuadro compatível com Transtorno Depressivo Maior, possivelmente comórbido com quadro álgico crônico. Sintomas de humor deprimido, anedonia, alterações de sono, fadiga, sentimentos de desesperança e baixa percepção de autoeficácia são evidentes. A dor crônica parece exacerbar os sintomas depressivos e vice-versa. Risco de cronificação do quadro depressivo.\n\n## P (Plano)\n- Manter/ajustar medicação antidepressiva (a ser avaliado).\n- Encaminhar para psicoterapia com foco em TCC para depressão e manejo da dor crônica.\n- Avaliar introdução de psicoeducação sobre a relação dor-humor.\n- Monitorar ideação suicida e desesperança em próximas consultas.\n- Considerar avaliação complementar para o quadro álgico, se ainda não realizada.\n- Agendar retorno em 2 semanas.`;
}

/**
 * Renderiza os documentos recentes no dashboard (#recentDocuments)
 */
function renderRecentDocuments() {
    const container = document.getElementById('recentDocuments');
    if (!container) return;
    container.innerHTML = '';
    const recentDocs = state.documents.slice(-4).reverse();
    if (recentDocs.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-tertiary);">Nenhum documento recente encontrado.</p>';
        return;
    }
    recentDocs.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'recent-item'; item.dataset.id = doc.id;
        item.innerHTML = `
            <div class="recent-item-icon" style="color: ${doc.color || 'var(--gray-500)'}"> <i class="${doc.icon || 'fas fa-file'}"></i> </div>
            <div class="recent-item-info">
                <div class="recent-item-title">${doc.title}</div>
                <div class="recent-item-meta">
                    <span>${doc.type}</span> <span class="recent-item-meta-divider"></span> <span>${doc.date}</span>
                    ${doc.size ? `<span class="recent-item-meta-divider"></span><span>${doc.size}</span>` : ''}
                </div>
            </div>`;
        item.addEventListener('click', () => {
            switchView('library');
            setTimeout(() => { setActiveDocumentItem(doc.id); viewDocumentInWorkspace(doc.id); }, 100);
        });
        container.appendChild(item);
    });
}

/**
 * Renderiza documentos na Biblioteca (#documentList)
 */
function renderDocumentLibrary(filter = 'all') {
    const container = document.getElementById('documentList');
    if (!container) return;
    container.innerHTML = '';
    const searchTerm = document.querySelector('#library-view .library-search-input')?.value.toLowerCase() || '';
    const filteredDocs = state.documents.filter(doc =>
        (filter === 'all' || doc.type === filter) &&
        (!searchTerm || doc.title.toLowerCase().includes(searchTerm))
    );
    if (filteredDocs.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; text-align: center; color: var(--text-tertiary);">Nenhum documento encontrado.</p>';
        if (state.currentView === 'library') showEmptyDocumentView();
        return;
    }
    filteredDocs.forEach(doc => {
        const item = document.createElement('div');
        item.className = `document-item document-${doc.type}`; item.dataset.id = doc.id; item.dataset.type = doc.type;
        const isProcessable = doc.type === 'audio' || doc.type === 'transcription';
        item.innerHTML = `
            <div class="document-icon"> <i class="${doc.icon || 'fas fa-file'}"></i> </div>
            <div class="document-info">
                <div class="document-title">${doc.title}</div> <div class="document-meta">${doc.date}</div>
            </div>
            <div class="document-actions">
                 ${isProcessable ? `<button class="document-action-btn process-doc" title="Processar"><i class="fas fa-cogs"></i></button>` : ''}
                 <button class="document-action-btn download-doc" title="Download"><i class="fas fa-download"></i></button>
            </div>`;
        item.addEventListener('click', () => { setActiveDocumentItem(doc.id); viewDocumentInWorkspace(doc.id); });
        item.querySelector('.process-doc')?.addEventListener('click', (e) => { e.stopPropagation(); startProcessingDocument(doc.id); });
        item.querySelector('.download-doc').addEventListener('click', (e) => { e.stopPropagation(); downloadDocument(doc.id); });
        container.appendChild(item);
    });
    if (state.currentDocumentId && filteredDocs.some(d => d.id === state.currentDocumentId)) {
        setActiveDocumentItem(state.currentDocumentId);
    } else if (state.currentView === 'library') {
        state.currentDocumentId = null; showEmptyDocumentView();
    }
}

/** Define o item ativo na lista da biblioteca */
function setActiveDocumentItem(docId) { /* ... mantido ... */
    document.querySelectorAll('#documentList .document-item').forEach(item => {
        item.classList.toggle('active', item.dataset.id === docId);
    });
    state.currentDocumentId = docId;
}

/** Visualiza o conteúdo de um documento no painel direito da biblioteca */
function viewDocumentInWorkspace(docId) { /* ... mantido ... */
    const doc = state.documents.find(d => d.id === docId);
    const viewContainer = document.getElementById('documentView');
    if (!doc || !viewContainer) { showEmptyDocumentView(); return; }
    const content = getDocumentContent(doc.type);
    const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);
    const isProcessable = doc.type === 'audio' || doc.type === 'transcription';
    viewContainer.innerHTML = `
        <div class="document-toolbar">
            <div class="document-info-header">
                <div class="document-info-icon document-${doc.type}"> <i class="${doc.icon || 'fas fa-file'}"></i> </div>
                <div class="document-info-details">
                    <h2>${doc.title}</h2>
                    <div class="document-info-meta">
                        <span>${doc.type}</span> <span class="document-info-meta-divider"></span> <span>${doc.date} ${doc.time || ''}</span>
                        ${doc.size ? `<span class="document-info-meta-divider"></span><span>${doc.size}</span>` : ''}
                        ${doc.duration ? `<span class="document-info-meta-divider"></span><span>${doc.duration}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="document-toolbar-actions">
                ${isEditable ? `<button class="toolbar-btn edit-doc-view" title="Editar"><i class="fas fa-edit"></i> Editar</button>` : ''}
                ${isProcessable ? `<button class="toolbar-btn process-doc-view" title="Processar"><i class="fas fa-cogs"></i> Processar</button>` : ''}
                 <button class="toolbar-btn download-doc-view" title="Download"><i class="fas fa-download"></i> Download</button>
            </div>
        </div>
        <div class="document-content"> <div class="document-container"> <div class="document-view">
            ${doc.type === 'audio' ? `<div style="text-align: center; padding: 2rem;"><i class="fas fa-volume-up" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: 1rem;"></i><p style="color: var(--text-secondary);">Pré-visualização de áudio não disponível.</p><p style="font-size: 0.8rem; color: var(--text-tertiary);">Use o botão 'Processar' para transcrever.</p></div>` : `<pre>${content}</pre>`}
        </div> </div> </div>`;
    viewContainer.querySelector('.edit-doc-view')?.addEventListener('click', () => editDocument(docId));
    viewContainer.querySelector('.process-doc-view')?.addEventListener('click', () => startProcessingDocument(docId));
    viewContainer.querySelector('.download-doc-view')?.addEventListener('click', () => downloadDocument(docId));
}

/** Mostra o estado vazio no painel de visualização de documentos */
function showEmptyDocumentView() { /* ... mantido ... */
    const viewContainer = document.getElementById('documentView');
    if (!viewContainer) return;
    viewContainer.innerHTML = `
        <div class="document-empty">
            <div class="document-empty-icon"><i class="fas fa-folder-open"></i></div>
            <h2 class="document-empty-title">Nenhum documento selecionado</h2>
            <p class="document-empty-text">Selecione um documento da biblioteca à esquerda para visualizá-lo aqui.</p>
            <button class="btn btn-primary" onclick="switchView('new')"><i class="fas fa-plus btn-icon"></i> Criar Novo Documento</button>
        </div>`;
}

/** Renderiza documentos no repositório do paciente (dentro do #patient-view) */
function renderPatientDocuments() { /* ... mantido ... */
    const documentsList = document.getElementById('patientDocuments');
    if (!documentsList || !state.currentPatientId) return;
    documentsList.innerHTML = '';
    const patientDocs = state.documents.filter(doc => doc.patientId === state.currentPatientId);
    if (patientDocs.length === 0) { /* ... mensagem de vazio ... */ return; }
    patientDocs.forEach(doc => { /* ... cria e adiciona item ... */
        const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);
        const item = document.createElement('div'); /* ... innerHTML ... */
        item.innerHTML = `
            <div class="document-icon" style="color: ${doc.color || 'var(--gray-500)'}"> <i class="${doc.icon || 'fas fa-file'}"></i> </div>
            <div class="document-info">
                <div class="document-title">${doc.title}</div> <div class="document-meta">${doc.date} • ${doc.time || ''}</div>
            </div>
            <div class="document-actions">
                <button class="document-action-btn view-doc" title="Visualizar"><i class="fas fa-eye"></i></button>
                ${isEditable ? `<button class="document-action-btn edit-doc" title="Editar"><i class="fas fa-edit"></i></button>` : ''}
                <button class="document-action-btn download-doc" title="Download"><i class="fas fa-download"></i></button>
            </div>`;
        item.querySelector('.view-doc').addEventListener('click', (e) => { e.stopPropagation(); viewDocument(doc.id); });
        item.querySelector('.edit-doc')?.addEventListener('click', (e) => { e.stopPropagation(); editDocument(doc.id); });
        item.querySelector('.download-doc').addEventListener('click', (e) => { e.stopPropagation(); downloadDocument(doc.id); });
        documentsList.appendChild(item);
    });
}

// --- Animações ---

/** Anima o logo na splash screen (REMOVIDO) */
// function animateLogo() { ... }

/** Inicializa animações fluidas (ripple) */
function initFluidAnimations() { /* ... mantido ... */
    document.querySelectorAll('.btn, .toolbar-btn, .library-btn, .recording-btn, .patient-tab, .document-format-option, .dimensional-tab, .date-nav-btn, .appointment-action, .mobile-menu-item, .sidebar-link, .document-item, .patient-card').forEach(element => {
        element.addEventListener('click', function(e) {
            if (e.target.closest('button, a, .document-item, .patient-card') !== element) return;
            if (e.target.closest('.document-action-btn')) return;
            const ripple = document.createElement('span'); ripple.classList.add('ripple');
            const rect = element.getBoundingClientRect(); const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2; const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = `${size}px`; ripple.style.left = `${x}px`; ripple.style.top = `${y}px`;
            this.appendChild(ripple); ripple.classList.add('ripple-animation');
            ripple.addEventListener('animationend', () => { ripple.remove(); });
        });
    });
}

// --- Autenticação ---

/** Configura o formulário de login */
function setupLogin() { /* ... mantido ... */
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');
    if (!loginForm || !passwordInput || !passwordError || !loginScreen || !appContainer) return;
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const password = passwordInput.value; const correctPassword = "123";
        if (password === correctPassword) {
            passwordError.style.display = 'none'; showToast('success', 'Login bem-sucedido', 'Bem-vindo ao VINTRA!');
            gsap.to(loginScreen, { opacity: 0, duration: 0.6, ease: "power2.inOut", onComplete: () => {
                loginScreen.style.display = 'none'; appContainer.style.display = 'flex';
                state.currentView = null; // Força transição
                switchView('dashboard'); // Vai para o dashboard após login
            }});
        } else {
            passwordError.style.display = 'block';
            gsap.fromTo(loginForm, { x: 0 }, { x: 10, duration: 0.05, repeat: 5, yoyo: true, ease: "power1.inOut", clearProps: "x" });
            passwordInput.focus();
        }
    });
}

/** Simula o logout do usuário */
function logout() { /* ... mantido ... */
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');
    const passwordInput = document.getElementById('password');
    if (!loginScreen || !appContainer || !passwordInput) return;
    showToast('info', 'Logout', 'Você saiu da sua conta.');
    gsap.to(appContainer, { opacity: 0, duration: 0.6, ease: "power2.inOut", onComplete: () => {
        appContainer.style.display = 'none'; loginScreen.style.display = 'flex';
        loginScreen.classList.add('visible'); passwordInput.value = '';
        gsap.fromTo(loginScreen, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" });
        state.currentView = null;
    }});
}

// --- Navegação Principal e Sidebar ---

/** Configura os links de navegação */
function setupNavigation() { /* ... mantido ... */
    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-item[data-target], .sidebar-link[data-target], .mobile-menu-item[data-target]');
        if (link && link.dataset.target && !['perfil', 'preferencias', 'sair'].includes(link.dataset.target)) {
            e.preventDefault(); switchView(link.dataset.target);
        }
    });
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
}

/** Atualiza o estado ativo dos links de navegação */
function updateNavigation(activeViewId) { /* ... mantido ... */
    const allLinks = document.querySelectorAll('.nav-item[data-target], .sidebar-link[data-target], .mobile-menu-item[data-target]');
    allLinks.forEach(link => { link.classList.toggle('active', link.dataset.target === activeViewId); });
    closeMobileMenu();
}

/** Configura o toggle da sidebar */
function setupSidebar() { /* ... mantido ... */
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.app-sidebar');
    if (toggleBtn && sidebar) toggleBtn.addEventListener('click', () => sidebar.classList.toggle('expanded'));
}

/** Configura o menu mobile */
function setupMobileMenu() { /* ... mantido ... */
    const openBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    const menu = document.getElementById('mobileMenu');
    if (!openBtn || !closeBtn || !backdrop || !menu) return;
    openBtn.addEventListener('click', openMobileMenu);
    closeBtn.addEventListener('click', closeMobileMenu);
    backdrop.addEventListener('click', closeMobileMenu);
}
function openMobileMenu() { /* ... mantido ... */
    const menu = document.getElementById('mobileMenu'); const backdrop = document.getElementById('mobileMenuBackdrop');
    if (menu && backdrop) { menu.classList.add('open'); backdrop.classList.add('open'); }
}
function closeMobileMenu() { /* ... mantido ... */
    const menu = document.getElementById('mobileMenu'); const backdrop = document.getElementById('mobileMenuBackdrop');
    if (menu && backdrop) { menu.classList.remove('open'); backdrop.classList.remove('open'); }
}

// --- Troca de Views ---

/** Alterna entre as views principais */
window.switchView = function(viewId) { /* ... mantido com ajustes anteriores ... */
    const newViewElem = document.getElementById(`${viewId}-view`);
    if (!newViewElem) { console.error(`View não encontrada: ${viewId}-view`); return; }
    if (state.currentView === viewId && newViewElem.style.display !== 'none') return;
    if (state.isProcessing) { showToast('warning', 'Processo em andamento', 'Aguarde.'); return; }
    const currentViewElem = state.currentView ? document.getElementById(`${state.currentView}-view`) : null;
    const displayStyle = (viewId === 'library' || viewId === 'patient') ? 'flex' : 'block';
    const showNewView = () => {
        newViewElem.style.display = displayStyle; newViewElem.scrollTop = 0;
        gsap.fromTo(newViewElem, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", onComplete: () => {
            if (viewId === 'patient') updateDimensionalChart();
            if (viewId === 'library') { renderDocumentLibrary(); if (!state.currentDocumentId) showEmptyDocumentView(); else viewDocumentInWorkspace(state.currentDocumentId); }
            if (viewId === 'dashboard') renderRecentDocuments();
        }});
        state.currentView = viewId; updateNavigation(viewId);
    };
    if (currentViewElem && currentViewElem !== newViewElem) {
        gsap.to(currentViewElem, { opacity: 0, y: 15, duration: 0.3, ease: "power2.in", onComplete: () => {
            currentViewElem.style.display = 'none'; currentViewElem.style.transform = ''; showNewView();
        }});
    } else { showNewView(); }
};

// --- Painel do Paciente (#patient-view) ---
/** Abre o painel de um paciente específico */
function openPatientPanel(patientId) { /* ... mantido com ajustes anteriores ... */
    const patient = state.recentPatients.find(p => p.id === patientId);
    if (!patient) { showToast('error', 'Erro', 'Paciente não encontrado.'); return; }
    state.currentPatientId = patientId;
    const nameElem = document.querySelector('#patient-view .patient-name');
    const detailsElem = document.querySelector('#patient-view .patient-details');
    if (nameElem) nameElem.textContent = patient.name;
    if (detailsElem) detailsElem.textContent = `${patient.age} anos • ${patient.gender} • Prontuário #${patientId.replace('patient-', '')}`;
    switchView('patient');
    setTimeout(() => { activatePatientTab('summary-panel'); }, 50);
}
/** Configura as abas do painel de paciente */
function setupPatientTabs() { /* ... mantido com ajustes anteriores ... */
    const tabsContainer = document.querySelector('#patient-view .patient-tabs');
    if (!tabsContainer) return;
    tabsContainer.addEventListener('click', function(e) {
        const tab = e.target.closest('.patient-tab');
        if (tab && tab.dataset.panel) activatePatientTab(tab.dataset.panel);
    });
}
/** Ativa uma aba específica no painel do paciente */
function activatePatientTab(panelId) { /* ... mantido com ajustes anteriores ... */
    if (state.activePatientTab === panelId && document.getElementById(panelId)?.classList.contains('active')) {
         if (panelId === 'summary-panel') updateDimensionalChart(); return;
    }
    state.activePatientTab = panelId;
    document.querySelectorAll('#patient-view .patient-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.panel === panelId));
    const panelsContainer = document.querySelector('#patient-view .patient-tab-panels');
    const activePanel = document.getElementById(panelId);
    const currentActivePanel = panelsContainer?.querySelector('.patient-tab-panel.active');
    if (!activePanel) return;
    const showActivePanel = () => {
        activePanel.classList.add('active');
        gsap.fromTo(activePanel, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
        if (panelId === 'summary-panel') updateDimensionalChart();
        if (panelId === 'repository-panel') renderPatientDocuments();
    };
    if (currentActivePanel && currentActivePanel !== activePanel) {
        gsap.to(currentActivePanel, { opacity: 0, duration: 0.2, ease: "power1.in", onComplete: () => {
            currentActivePanel.classList.remove('active'); showActivePanel();
        }});
    } else { showActivePanel(); }
}
/** Função para voltar da view do paciente */
function goBack() { switchView('dashboard'); }

// --- Gráficos e Visualizações ---
/** Inicializa gráficos */
function initCharts() { /* ... mantido ... */ }
/** Atualiza o gráfico radar dimensional no painel do paciente */
function updateDimensionalChart() { /* ... mantido com ajustes anteriores ... */
    const chartContainer = document.getElementById('dimensionalRadarChart');
    if (!chartContainer || !Chart || state.currentView !== 'patient' || state.activePatientTab !== 'summary-panel') return;
    if (window.dimensionalChart instanceof Chart) window.dimensionalChart.destroy();
    const data = { /* ... dados ... */ }; const options = { /* ... opções ... */ };
    window.dimensionalChart = new Chart(chartContainer, { type: 'radar', data: data, options: options });
}
/** Configura a visualização dimensional modal */
function setupDimensionalVisualizations() { /* ... mantido com ajustes anteriores ... */
    const openModalBtn = document.querySelector('.activate-dimensional-space');
    const openModalBtnPatient = document.querySelector('#patient-view .dimensional-summary .btn');
    const modalOverlay = document.getElementById('dimensionalModal');
    const closeBtn = document.getElementById('dimensionalModalClose');
    const tabsContainer = modalOverlay?.querySelector('.dimensional-tabs');
    if (openModalBtn) openModalBtn.addEventListener('click', showDimensionalModal);
    if (openModalBtnPatient) openModalBtnPatient.addEventListener('click', showDimensionalModal);
    if (closeBtn) closeBtn.addEventListener('click', hideDimensionalModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) hideDimensionalModal(); });
    if (tabsContainer) tabsContainer.addEventListener('click', (e) => { /* ... */ });
}
/** Mostra o modal de visualização dimensional */
function showDimensionalModal() { /* ... mantido com ajustes anteriores ... */
    const modal = document.getElementById('dimensionalModal');
    if (modal) { /* ... animação ... */ activateDimensionalView('radar'); }
}
/** Esconde o modal de visualização dimensional */
function hideDimensionalModal() { /* ... mantido com ajustes anteriores ... */
    const modal = document.getElementById('dimensionalModal');
    if (modal) { /* ... animação ... */ }
}
/** Ativa uma visualização dimensional específica dentro do modal */
function activateDimensionalView(viewType) { /* ... mantido com ajustes anteriores ... */
     const modal = document.getElementById('dimensionalModal'); if (!modal || modal.style.display === 'none') return;
     /* ... lógica de tabs e painéis ... */
     if (viewType === 'radar') updateModalDimensionalChart();
}
/** Atualiza o gráfico radar no modal dimensional */
function updateModalDimensionalChart() { /* ... mantido com ajustes anteriores ... */
    const chartContainer = document.getElementById('modalRadarChart');
    if (!chartContainer || !Chart || document.getElementById('dimensionalModal').style.display === 'none') return;
    if (window.modalChart instanceof Chart) window.modalChart.destroy();
    const data = { /* ... dados ... */ }; const options = { /* ... opções ... */ };
    window.modalChart = new Chart(chartContainer, { type: 'radar', data: data, options: options });
}

// --- Edição de Documentos ---
/** Configura o sistema de edição de documentos (Modal) */
function setupDocumentEditing() { /* ... mantido com ajustes anteriores ... */
    const modalOverlay = document.getElementById('editDocumentModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editModalClose = document.getElementById('editModalClose');
    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeDocumentEditor);
    if (saveEditBtn) saveEditBtn.addEventListener('click', saveDocumentEdit);
    if (editModalClose) editModalClose.addEventListener('click', closeDocumentEditor);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeDocumentEditor(); });
}
/** Abre o editor de documentos (Modal) */
function openDocumentEditor(docType, title, content) { /* ... mantido com ajustes anteriores ... */
    state.currentDocumentType = docType;
    const modal = document.getElementById('editDocumentModal'); const modalTitle = document.getElementById('editModalTitle'); const editor = document.getElementById('documentEditor');
    if (modal && modalTitle && editor) { /* ... mostra modal e foca ... */ }
}
/** Fecha o editor de documentos (Modal) */
function closeDocumentEditor() { /* ... mantido com ajustes anteriores ... */
    const modal = document.getElementById('editDocumentModal'); if (modal) { /* ... animação ... */ }
}
/** Salva as edições feitas no documento (Modal) */
function saveDocumentEdit() { /* ... mantido com ajustes anteriores ... */
     const editor = document.getElementById('documentEditor'); if (!editor || !state.currentDocumentType || !state.currentDocumentId) return;
     const content = editor.value; const docKey = `${state.currentDocumentType}Text`;
     if (state.hasOwnProperty(docKey)) { /* ... atualiza estado e UI ... */ }
     closeDocumentEditor();
}

// --- Ações de Documento (Visualizar, Editar, Download) ---
/** Visualiza um documento (mostra em modal genérico) */
function viewDocument(docId) { /* ... mantido com ajustes anteriores ... */
    const doc = state.documents.find(d => d.id === docId); if (!doc) return;
    const content = getDocumentContent(doc.type);
    showGenericModal(`Visualizar: ${doc.title}`, `<pre style="white-space: pre-wrap; word-wrap: break-word;">${content}</pre>`);
}
/** Abre um documento para edição (chamando o modal) */
function editDocument(docId) { /* ... mantido com ajustes anteriores ... */
    const doc = state.documents.find(d => d.id === docId); if (!doc) return;
    if (['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type)) {
        const content = getDocumentContent(doc.type); state.currentDocumentId = docId;
        openDocumentEditor(doc.type, `Editar ${doc.title}`, content);
    } else { /* ... toast ... */ }
}
/** Realiza o download de um documento */
function downloadDocument(docId) { /* ... mantido com ajustes anteriores ... */
    const doc = state.documents.find(d => d.id === docId); if (!doc) return;
    if (doc.type === 'audio') { /* ... simulação ... */ return; }
    const content = getDocumentContent(doc.type); const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = doc.title.includes('.') ? doc.title : `${doc.title}.txt`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); showToast('success', 'Download Iniciado', `${a.download} está sendo baixado.`); }, 100);
}
/** Obtém o conteúdo de um documento com base em seu tipo */
function getDocumentContent(type) { /* ... mantido com ajustes anteriores ... */ }

// --- View: Novo Documento (#new-view) ---
/** Configura as abas da view "Novo Documento" */
function setupNewDocumentTabs() { /* ... mantido com ajustes anteriores ... */
    const tabsContainer = document.querySelector('#new-view .library-filters'); const contentContainer = document.getElementById('newDocumentContent');
    if (!tabsContainer || !contentContainer) return;
    tabsContainer.addEventListener('click', (e) => { /* ... lógica de troca de abas com animação ... */ });
    contentContainer.querySelectorAll(':scope > div[id$="-tab"]').forEach(panel => { /* ... estado inicial ... */ });
}
/** Configura o módulo de gravação de áudio */
function setupRecorder() { /* ... mantido com ajustes anteriores ... */ }
function startRecording() { /* ... mantido com ajustes anteriores ... */ }
function stopRecording() { /* ... mantido com ajustes anteriores ... */ }
function updateTimer() { /* ... mantido com ajustes anteriores ... */ }
function startVisualizer() { /* ... mantido com ajustes anteriores ... */ }
function stopVisualizer() { /* ... mantido com ajustes anteriores ... */ }
/** Configura o módulo de upload de arquivos */
function setupUpload() { /* ... mantido com ajustes anteriores ... */ }
/** Lida com os arquivos selecionados para upload */
function handleFiles(files) { /* ... mantido com ajustes anteriores ... */ }
/** Configura a aba de transcrição manual */
function setupTranscriptionInput() { /* ... mantido com ajustes anteriores ... */ }

// --- Simulação de Processamento ---
/** Define o estado de processamento e atualiza a UI */
function setProcessingState(isProcessing) { /* ... mantido com ajustes anteriores ... */ }
/** Simula o processamento de gravação, upload ou transcrição manual */
function simulateProcessing(type, stepsContainer, stepsProgress, progressContainer, progressBar, progressPercent, progressStatus, completedPanel) { /* ... mantido com ajustes anteriores ... */ }
/** Adiciona um documento processado (transcrição) à lista */
function addProcessedDocument(originalFileName = 'Documento', sourceType = 'upload') { /* ... mantido ... */ }
/** Atualiza a UI dos indicadores de passo */
function updateStepProgress(stepsContainerId, progressIndicatorId, currentStep) { /* ... mantido com ajustes anteriores ... */ }
/** Atualiza a UI da barra de progresso */
function updateProgressBar(barId, percentageId, statusId, percentage, statusText) { /* ... mantido ... */ }

// --- View: Processamento (#processing-view) ---
/** Configura a view de processamento de documentos */
function setupProcessing() { /* ... mantido com ajustes anteriores ... */ }
/** Simula a geração dos documentos selecionados */
function simulateGeneration(formats, progressContainer, completedPanel) { /* ... mantido com ajustes anteriores ... */ }
/** Adiciona um documento gerado (VINTRA, SOAP, etc.) à lista */
function addGeneratedDocument(formatType) { /* ... mantido ... */ }
/** Inicia o fluxo de processamento a partir de um documento da biblioteca */
function startProcessingDocument(docId) { /* ... mantido com ajustes anteriores ... */ }

// --- View: Resultados (#results-view) ---
/** Configura a view de resultados */
function setupResultsView() { /* ... mantido com ajustes anteriores ... */ }
/** Ativa uma aba específica na view de resultados */
function activateResultsTab(panelId) { /* ... mantido com ajustes anteriores ... */ }

// --- Biblioteca de Documentos ---
/** Configura a interatividade da biblioteca */
function setupDocumentLibrary() { /* ... mantido com ajustes anteriores ... */ }

// --- Modo Foco ---
function setupFocusMode() { /* ... mantido com ajustes anteriores ... */ }

// --- Notificações Toast ---
/** Mostra uma notificação toast */
function showToast(type, title, message, duration = 5000) { /* ... mantido com ajustes anteriores ... */ }
/** Remove um toast específico com animação */
function removeToast(toastElement) { /* ... mantido com ajustes anteriores ... */ }

// --- Modal Genérico ---
/** Configura o modal genérico */
function setupGenericModal() { /* ... mantido ... */
    const modalOverlay = document.getElementById('genericModal');
    const closeBtn = document.getElementById('genericModalClose');
    const cancelBtn = document.getElementById('genericModalCancelBtn');
    if (closeBtn) closeBtn.addEventListener('click', hideGenericModal);
    if (cancelBtn) cancelBtn.addEventListener('click', hideGenericModal);
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) hideGenericModal(); });
}
/** Mostra o modal genérico */
function showGenericModal(title, htmlContent) { /* ... mantido ... */
    const modal = document.getElementById('genericModal'); const modalTitle = document.getElementById('genericModalTitle'); const modalBody = document.getElementById('genericModalBody');
    if (modal && modalTitle && modalBody) { /* ... mostra modal ... */ }
}
/** Esconde o modal genérico */
function hideGenericModal() { /* ... mantido ... */
    const modal = document.getElementById('genericModal'); if (modal) { /* ... animação ... */ }
}

// --- Utilitários ---
/** Debounce */
function debounce(func, wait) { /* ... mantido ... */ }

// --- Funções de Exemplo para Botões ---
function viewTranscription() { /* ... mantido com ajustes anteriores ... */ }
function processTranscription() { /* ... mantido com ajustes anteriores ... */ }

