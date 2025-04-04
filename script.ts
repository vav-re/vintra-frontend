/**
 * VINTRA - Análise Dimensional Clínica
 * Script principal mesclado, otimizado e refatorado para TypeScript (Baseado na v4)
 */

// --- Interfaces e Tipos ---

interface EmotionalData {
    valencia: number;
    excitacao: number;
    dominancia: number;
    intensidade: number;
}

interface CognitiveData {
    complexidade: number;
    coerencia: number;
    flexibilidade: number;
    dissonancia: number;
}

interface TemporalPerspectiveData {
    passado: number;
    presente: number;
    futuro: number;
    media: number; // Média calculada
}

interface AutonomyData {
    perspectivaTemporal: TemporalPerspectiveData;
    autocontrole: number;
}

interface DimensionalData {
    emocional: EmotionalData;
    cognitiva: CognitiveData;
    autonomia: AutonomyData;
}

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    lastVisit: string;
    status: string;
}

type DocumentType =
    | 'audio'
    | 'transcription'
    | 'vintra'
    | 'soap'
    | 'ipissima'
    | 'narrative'
    | 'orientacoes';

interface DocumentMetadata {
    id: string;
    patientId: string | null; // Pode ser nulo se não associado
    title: string;
    type: DocumentType;
    date: string; // Formato "dd/mm/yyyy"
    time?: string; // Formato "HH:MM"
    icon: string; // Classe Font Awesome (ex: 'fas fa-file-alt')
    color?: string; // Cor CSS (ex: 'var(--accent)')
    size?: string; // Ex: "15.3 MB"
    duration?: string; // Ex: "28:45"
}

interface AppState {
    currentView: string | null; // ID da view ativa (ex: 'dashboard', 'library')
    currentPatientId: string | null; // ID do paciente ativo
    currentDocumentId: string | null; // ID do documento ativo na biblioteca/processamento/edição
    currentDocumentType: DocumentType | null; // Tipo do documento ativo para edição
    activePatientTab: string; // Aba ativa no painel do paciente
    activeDimensionalView: string; // Visualização ativa no modal dimensional
    activeNewDocumentTab: string; // Aba ativa na view 'Novo Documento'
    activeResultsTab: string; // Aba ativa na view 'Resultados'
    isProcessing: boolean; // Flag geral para indicar processamento em andamento
    isRecording: boolean; // Flag para indicar gravação de áudio
    recordingStartTime: number | null;
    recordingInterval: number | null; // NodeJS.Timeout ou number (para browser)
    audioContext: AudioContext | null;
    analyser: AnalyserNode | null;
    visualizerSource: MediaStreamAudioSourceNode | null;
    visualizerRafId: number | null; // requestAnimationFrame ID
    mediaRecorder: MediaRecorder | null;
    audioChunks: Blob[];
    uploadedFile: File | null; // Objeto File do último upload
    processedAudioBlob: Blob | null; // Blob do áudio gravado ou processado
    dimensionalData: DimensionalData; // Dados dimensionais (exemplo ou carregados)
    documents: DocumentMetadata[]; // Metadados dos documentos
    recentPatients: Patient[]; // Dados dos pacientes recentes (para dashboard)
    // Conteúdos dos documentos (exemplo ou carregados/gerados)
    transcriptionText: string;
    vintraText: string;
    soapText: string;
    ipissimaText: string;
    narrativeText: string;
    orientacoesText: string;
}

// --- Tipagem para Bibliotecas Globais (Exemplo) ---
// Em um projeto real, importaríamos os tipos (@types/...)
declare const Chart: any; // Usar 'any' ou definir interface básica se necessário
declare const gsap: any; // Usar 'any' ou definir interface básica

// --- Estado Global ---
const state: AppState = {
    currentView: null,
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
    processedAudioBlob: null,
    dimensionalData: { // Dados de exemplo
        emocional: { valencia: -2.5, excitacao: 7.0, dominancia: 3.0, intensidade: 8.0 },
        cognitiva: { complexidade: 6.0, coerencia: 5.0, flexibilidade: 4.0, dissonancia: 7.0 },
        autonomia: { perspectivaTemporal: { passado: 7.0, presente: 3.0, futuro: 2.0, media: 4.0 }, autocontrole: 4.0 }
    },
    documents: [],
    recentPatients: [],
    // Conteúdo de exemplo (idealmente viria do backend)
    transcriptionText: `Entrevista Clínica - 04 de Abril de 2025\nMédico: Bom dia, Maria. Como você está se sentindo hoje?\nPaciente: Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar. (Suspira) É difícil manter a esperança.\nMédico: Entendo que seja difícil, Maria. Vamos conversar sobre isso. Além da dor física, como está o seu ânimo?\nPaciente: Péssimo. Me sinto desanimada, sem vontade de fazer nada. Até as coisas que eu gostava perderam a graça. Parece que estou carregando um peso enorme.`,
    vintraText: `# Análise VINTRA - Maria Silva (04/04/2025)\n\n## Dimensões Emocionais\n- Valência (v₁): -2.5 (Negativa)\n- Excitação (v₂): 7.0 (Alta)\n- Dominância (v₃): 3.0 (Baixa)\n- Intensidade (v₄): 8.0 (Alta)\n\n... (restante do texto VINTRA)`,
    soapText: `# Nota SOAP - Maria Silva (04/04/2025)\n\n## S (Subjetivo)\nPaciente relata persistência da dor...\n\n... (restante do texto SOAP)`,
    ipissimaText: `# Ipíssima Narrativa - Maria Silva (04/04/2025)\n\nEu não aguento mais essa dor...\n\n... (restante do texto Ipíssima)`,
    narrativeText: `# Análise Narrativa - Maria Silva (04/04/2025)\n\n## Temas Centrais:\n- Dor crônica...\n\n... (restante da análise narrativa)`,
    orientacoesText: `# Orientações - Maria Silva (04/04/2025)\n\n1.  **Medicação:** Continue...\n\n... (restante das orientações)`
};

// --- Tipagem Global (para acesso via window) ---
declare global {
    interface Window {
        switchView: (viewId: string) => void;
        dimensionalChart?: any; // Chart instance
        modalChart?: any; // Chart instance
    }
}

// --- Inicialização ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("VINTRA Inicializando...");
    loadDemoData();
    setupEventListeners();
    initCharts(); // Inicializa estruturas de gráficos
    initFluidAnimations(); // Configura efeito ripple

    // Estado inicial: Mostrar Splash brevemente, depois Login
    const splashScreen = document.getElementById('splashScreen');
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');

    if (splashScreen && loginScreen && appContainer) {
        gsap.set(splashScreen, { display: 'flex', opacity: 1 }); // Garante visibilidade inicial

        gsap.to(splashScreen, {
            opacity: 0,
            duration: 0.5,
            delay: 0.7,
            ease: "power1.inOut",
            onComplete: () => {
                splashScreen.style.display = 'none';
                gsap.set(loginScreen, { display: 'flex', opacity: 0 });
                loginScreen.classList.add('visible');
                gsap.to(loginScreen, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power1.out"
                });
            }
        });
    } else {
        console.warn("Splash, Login ou App Container não encontrados. Exibindo App diretamente.");
        if (appContainer) appContainer.style.display = 'flex';
        window.switchView('dashboard'); // Fallback
    }
});

/** Configura todos os event listeners da aplicação */
function setupEventListeners(): void {
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
    // Adicionar listeners para botões de conclusão (viewTranscription, processTranscription)
    document.getElementById('viewTranscriptionBtn')?.addEventListener('click', viewTranscription);
    document.getElementById('processTranscriptionBtn')?.addEventListener('click', processTranscription);
    document.getElementById('uploadViewTranscriptionBtn')?.addEventListener('click', viewTranscription);
    document.getElementById('uploadProcessTranscriptionBtn')?.addEventListener('click', processTranscription);
    document.getElementById('manualViewTranscriptionBtn')?.addEventListener('click', viewTranscription);
    document.getElementById('manualProcessTranscriptionBtn')?.addEventListener('click', processTranscription);
    document.getElementById('viewResultsBtn')?.addEventListener('click', () => window.switchView('results'));

}

// --- Carregamento de Dados e Renderização Inicial ---

/** Carrega dados de exemplo para demonstração */
function loadDemoData(): void {
    // Pacientes recentes
    state.recentPatients = [
        { id: 'patient-1', name: 'Maria Silva', age: 38, gender: 'Feminino', lastVisit: '28/03/2025', status: 'Em tratamento' },
        { id: 'patient-2', name: 'João Santos', age: 42, gender: 'Masculino', lastVisit: '25/03/2025', status: 'Primeira consulta' },
        { id: 'patient-3', name: 'Ana Oliveira', age: 29, gender: 'Feminino', lastVisit: '20/03/2025', status: 'Em tratamento' },
        { id: 'patient-4', name: 'Carlos Pereira', age: 55, gender: 'Masculino', lastVisit: '15/03/2025', status: 'Retorno' }
    ];

    // Documentos de exemplo
    state.documents = [
        { id: 'doc1', patientId: 'patient-1', title: 'Entrevista_Maria.mp3', type: 'audio', date: '25/03/2025', time: '10:30', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '15.3 MB', duration: '28:45' },
        { id: 'doc2', patientId: 'patient-1', title: 'Transcrição_Maria.txt', type: 'transcription', date: '25/03/2025', time: '10:35', icon: 'fas fa-file-alt', color: 'var(--accent)', size: '5 KB' },
        { id: 'doc3', patientId: 'patient-1', title: 'VINTRA_Maria.txt', type: 'vintra', date: '25/03/2025', time: '10:40', icon: 'fas fa-clipboard-list', color: 'var(--accent)', size: '8 KB' },
        { id: 'doc4', patientId: 'patient-1', title: 'SOAP_Maria.txt', type: 'soap', date: '25/03/2025', time: '10:45', icon: 'fas fa-notes-medical', color: 'var(--success)', size: '3 KB' },
        { id: 'doc5', patientId: 'patient-2', title: 'Consulta_Joao.wav', type: 'audio', date: '25/03/2025', time: '11:00', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '22.1 MB', duration: '35:10' },
        { id: 'doc6', patientId: 'patient-2', title: 'Transcricao_Joao.txt', type: 'transcription', date: '25/03/2025', time: '11:05', icon: 'fas fa-file-alt', color: 'var(--accent)', size: '7 KB' },
        { id: 'doc7', patientId: 'patient-1', title: 'Ipissima_Maria.txt', type: 'ipissima', date: '25/03/2025', time: '10:50', icon: 'fas fa-comment-dots', color: 'var(--accent-pink)', size: '2 KB' },
        { id: 'doc8', patientId: 'patient-1', title: 'Narrativa_Maria.txt', type: 'narrative', date: '25/03/2025', time: '10:55', icon: 'fas fa-book-open', color: 'var(--warning-yellow)', size: '4 KB' },
        { id: 'doc9', patientId: 'patient-1', title: 'Orientacoes_Maria.txt', type: 'orientacoes', date: '25/03/2025', time: '11:00', icon: 'fas fa-list-check', color: '#8B5CF6', size: '1 KB' },
    ];
    console.log("Dados de demonstração carregados.");
}

/** Renderiza os documentos recentes no dashboard */
function renderRecentDocuments(): void {
    const container = document.getElementById('recentDocuments');
    if (!container) return;
    container.innerHTML = ''; // Limpa antes de renderizar
    const recentDocs = state.documents.slice(-4).reverse(); // Pega os 4 últimos

    if (recentDocs.length === 0) {
        container.innerHTML = '<p class="empty-list-message">Nenhum documento recente encontrado.</p>';
        return;
    }

    recentDocs.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.dataset.id = doc.id;
        item.innerHTML = `
            <div class="recent-item-icon" style="color: ${doc.color || 'var(--text-secondary)'}">
                <i class="${doc.icon || 'fas fa-file'}"></i>
            </div>
            <div class="recent-item-info">
                <div class="recent-item-title">${escapeHtml(doc.title)}</div>
                <div class="recent-item-meta">
                    <span>${escapeHtml(doc.type)}</span>
                    <span class="recent-item-meta-divider"></span>
                    <span>${escapeHtml(doc.date)}</span>
                    ${doc.size ? `<span class="recent-item-meta-divider"></span><span>${escapeHtml(doc.size)}</span>` : ''}
                </div>
            </div>`;
        // Adiciona evento para navegar para a biblioteca e selecionar o doc
        item.addEventListener('click', () => {
            window.switchView('library');
            // Aguarda a transição da view antes de selecionar
            setTimeout(() => {
                setActiveDocumentItem(doc.id);
                viewDocumentInWorkspace(doc.id);
            }, 400); // Ajuste o tempo se necessário
        });
        container.appendChild(item);
    });
}

/** Renderiza documentos na Biblioteca com base no filtro e busca */
function renderDocumentLibrary(filter: string = 'all', searchTerm: string = ''): void {
    const container = document.getElementById('documentList');
    if (!container) return;
    container.innerHTML = ''; // Limpa

    const normalizedSearch = searchTerm.toLowerCase().trim();
    const filteredDocs = state.documents.filter(doc =>
        (filter === 'all' || doc.type === filter) &&
        (!normalizedSearch || doc.title.toLowerCase().includes(normalizedSearch))
    ).sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()); // Ordena por data desc

    if (filteredDocs.length === 0) {
        container.innerHTML = '<p class="empty-list-message">Nenhum documento encontrado.</p>';
        if (state.currentView === 'library') {
            showEmptyDocumentView();
        }
        return;
    }

    filteredDocs.forEach(doc => {
        const item = document.createElement('div');
        item.className = `document-item document-${doc.type}`;
        item.dataset.id = doc.id;
        item.dataset.type = doc.type;
        const isProcessable = doc.type === 'audio' || doc.type === 'transcription';

        item.innerHTML = `
            <div class="document-icon"> <i class="${doc.icon || 'fas fa-file'}"></i> </div>
            <div class="document-info">
                <div class="document-title">${escapeHtml(doc.title)}</div>
                <div class="document-meta">${escapeHtml(doc.date)}</div>
            </div>
            <div class="document-actions">
                ${isProcessable ? `<button class="document-action-btn process-doc" title="Processar"><i class="fas fa-cogs"></i></button>` : ''}
                <button class="document-action-btn download-doc" title="Download"><i class="fas fa-download"></i></button>
            </div>`;

        // Evento principal do item: selecionar e visualizar
        item.addEventListener('click', () => {
            setActiveDocumentItem(doc.id);
            viewDocumentInWorkspace(doc.id);
        });

        // Eventos dos botões de ação
        item.querySelector('.process-doc')?.addEventListener('click', (e) => {
            e.stopPropagation();
            startProcessingDocument(doc.id);
        });
        item.querySelector('.download-doc')?.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadDocument(doc.id);
        });

        container.appendChild(item);
    });

    // Mantém o item ativo se ele ainda estiver na lista filtrada
    if (state.currentDocumentId && filteredDocs.some(d => d.id === state.currentDocumentId)) {
        setActiveDocumentItem(state.currentDocumentId);
    } else if (state.currentView === 'library') {
        state.currentDocumentId = null;
        showEmptyDocumentView();
    }
}

/** Define o item ativo na lista da biblioteca */
function setActiveDocumentItem(docId: string): void {
    document.querySelectorAll<HTMLDivElement>('#documentList .document-item').forEach(item => {
        item.classList.toggle('active', item.dataset.id === docId);
    });
    state.currentDocumentId = docId;
    console.log(`Documento ativo: ${docId}`);
}

/** Visualiza o conteúdo de um documento no painel direito da biblioteca */
function viewDocumentInWorkspace(docId: string): void {
    const doc = state.documents.find(d => d.id === docId);
    const viewContainer = document.getElementById('documentView');
    if (!doc || !viewContainer) {
        showEmptyDocumentView();
        return;
    }

    console.log(`Visualizando documento: ${doc.title} (ID: ${docId}, Tipo: ${doc.type})`);
    const content = getDocumentContent(doc.type) ?? `Conteúdo para '${doc.type}' não encontrado.`;
    const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);
    const isProcessable = doc.type === 'audio' || doc.type === 'transcription';

    viewContainer.innerHTML = ''; // Limpa container

    const toolbar = document.createElement('div');
    toolbar.className = 'document-toolbar';
    toolbar.innerHTML = `
        <div class="document-info-header">
            <div class="document-info-icon document-${doc.type}"> <i class="${doc.icon || 'fas fa-file'}"></i> </div>
            <div class="document-info-details">
                <h2>${escapeHtml(doc.title)}</h2>
                <div class="document-info-meta">
                    <span>${escapeHtml(doc.type)}</span>
                    <span class="document-info-meta-divider"></span>
                    <span>${escapeHtml(doc.date)} ${escapeHtml(doc.time || '')}</span>
                    ${doc.size ? `<span class="document-info-meta-divider"></span><span>${escapeHtml(doc.size)}</span>` : ''}
                    ${doc.duration ? `<span class="document-info-meta-divider"></span><span>${escapeHtml(doc.duration)}</span>` : ''}
                </div>
            </div>
        </div>
        <div class="document-toolbar-actions">
            ${isEditable ? `<button class="toolbar-btn edit-doc-view" title="Editar"><i class="fas fa-edit"></i> Editar</button>` : ''}
            ${isProcessable ? `<button class="toolbar-btn process-doc-view" title="Processar"><i class="fas fa-cogs"></i> Processar</button>` : ''}
            <button class="toolbar-btn download-doc-view" title="Download"><i class="fas fa-download"></i> Download</button>
        </div>`;

    const contentArea = document.createElement('div');
    contentArea.className = 'document-content';
    contentArea.innerHTML = `<div class="document-container"><div class="document-view"></div></div>`;
    const viewElement = contentArea.querySelector<HTMLDivElement>('.document-view');

    if (viewElement) {
        if (doc.type === 'audio') {
            viewElement.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-volume-up" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-secondary);">Pré-visualização de áudio não disponível.</p>
                    <p style="font-size: 0.8rem; color: var(--text-tertiary);">Use o botão 'Processar' para transcrever.</p>
                </div>`;
        } else {
            const pre = document.createElement('pre');
            pre.textContent = content;
            viewElement.appendChild(pre);
        }
    }

    viewContainer.appendChild(toolbar);
    viewContainer.appendChild(contentArea);

    // Adiciona listeners aos botões recém-criados
    viewContainer.querySelector<HTMLButtonElement>('.edit-doc-view')?.addEventListener('click', () => editDocument(docId));
    viewContainer.querySelector<HTMLButtonElement>('.process-doc-view')?.addEventListener('click', () => startProcessingDocument(docId));
    viewContainer.querySelector<HTMLButtonElement>('.download-doc-view')?.addEventListener('click', () => downloadDocument(docId));

    gsap.fromTo(viewContainer, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' });
}


/** Mostra o estado vazio no painel de visualização de documentos */
function showEmptyDocumentView(): void {
    const viewContainer = document.getElementById('documentView');
    if (!viewContainer) return;
    console.log("Mostrando estado vazio do workspace.");
    viewContainer.innerHTML = `
        <div class="document-empty">
            <div class="document-empty-icon"><i class="fas fa-folder-open"></i></div>
            <h2 class="document-empty-title">Nenhum documento selecionado</h2>
            <p class="document-empty-text">Selecione um documento da biblioteca à esquerda para visualizá-lo aqui.</p>
            <button class="btn btn-primary" id="emptyViewCreateBtn"><i class="fas fa-plus btn-icon"></i> Criar Novo Documento</button>
        </div>`;
    viewContainer.querySelector<HTMLButtonElement>('#emptyViewCreateBtn')?.addEventListener('click', () => window.switchView('new'));
    gsap.fromTo(viewContainer.querySelector('.document-empty'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' }
    );
}

/** Renderiza documentos no repositório do paciente */
function renderPatientDocuments(): void {
    const documentsList = document.getElementById('patientDocuments');
    if (!documentsList || !state.currentPatientId) {
        console.warn("Container de documentos do paciente ou ID do paciente não encontrado.");
        if (documentsList) documentsList.innerHTML = '<p class="empty-list-message">Selecione um paciente para ver seus documentos.</p>';
        return;
    }

    documentsList.innerHTML = ''; // Limpa
    const patientDocs = state.documents.filter(doc => doc.patientId === state.currentPatientId)
        .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

    if (patientDocs.length === 0) {
        documentsList.innerHTML = '<p class="empty-list-message">Nenhum documento encontrado para este paciente.</p>';
        return;
    }

    patientDocs.forEach(doc => {
        const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);
        const item = document.createElement('div');
        item.className = `document-item document-${doc.type}`;
        item.dataset.id = doc.id;

        item.innerHTML = `
            <div class="document-icon" style="color: ${doc.color || 'var(--text-secondary)'}"> <i class="${doc.icon || 'fas fa-file'}"></i> </div>
            <div class="document-info">
                <div class="document-title">${escapeHtml(doc.title)}</div>
                <div class="document-meta">${escapeHtml(doc.date)} ${escapeHtml(doc.time || '')}</div>
            </div>
            <div class="document-actions">
                <button class="document-action-btn view-doc" title="Visualizar"><i class="fas fa-eye"></i></button>
                ${isEditable ? `<button class="document-action-btn edit-doc" title="Editar"><i class="fas fa-edit"></i></button>` : ''}
                <button class="document-action-btn download-doc" title="Download"><i class="fas fa-download"></i></button>
            </div>`;

        item.querySelector<HTMLButtonElement>('.view-doc')?.addEventListener('click', (e) => { e.stopPropagation(); viewDocument(doc.id); });
        item.querySelector<HTMLButtonElement>('.edit-doc')?.addEventListener('click', (e) => { e.stopPropagation(); editDocument(doc.id); });
        item.querySelector<HTMLButtonElement>('.download-doc')?.addEventListener('click', (e) => { e.stopPropagation(); downloadDocument(doc.id); });

        documentsList.appendChild(item);
    });
}


// --- Animações ---

/** Inicializa animações fluidas (ripple) */
function initFluidAnimations(): void {
    const rippleElements = document.querySelectorAll<HTMLElement>(`
        .btn, .toolbar-btn, .library-btn, .recording-btn,
        .patient-tab, .document-format-option, .dimensional-tab,
        .date-nav-btn, .appointment-action, .mobile-menu-item,
        .sidebar-link, .document-item, .patient-card, .library-filter,
        .document-action-btn, .upload-preview-remove, .modal-close,
        .focus-mode-btn
    `);

    rippleElements.forEach(element => {
        element.addEventListener('click', function (e: MouseEvent) {
            if (element.matches(':disabled') || element.classList.contains('disabled')) return;

            // Cria o elemento span do ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            element.appendChild(ripple);
            ripple.classList.add('ripple-animation');

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
}

// --- Autenticação ---

/** Configura o formulário de login */
function setupLogin(): void {
    const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const passwordError = document.getElementById('passwordError');
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');

    if (!loginForm || !passwordInput || !passwordError || !loginScreen || !appContainer) {
        console.error("Elementos de login não encontrados.");
        return;
    }

    loginForm.addEventListener('submit', (event: SubmitEvent) => {
        event.preventDefault();
        const password = passwordInput.value;
        const correctPassword = "123"; // Senha de demonstração

        if (password === correctPassword) {
            passwordError.style.display = 'none';
            showToast('success', 'Login bem-sucedido', 'Bem-vindo ao VINTRA!');

            gsap.to(loginScreen, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    loginScreen.style.display = 'none';
                    loginScreen.classList.remove('visible');
                    gsap.set(appContainer, { display: 'flex', opacity: 0 });

                    gsap.to(appContainer, {
                        opacity: 1,
                        duration: 0.5,
                        ease: "power1.out",
                        onComplete: () => {
                            state.currentView = null; // Força a renderização inicial
                            window.switchView('dashboard');
                        }
                    });
                }
            });
        } else {
            passwordError.style.display = 'block';
            gsap.fromTo(loginForm, { x: 0 }, { x: 10, duration: 0.05, repeat: 5, yoyo: true, ease: "power1.inOut", clearProps: "x" });
            passwordInput.focus();
            passwordInput.select();
        }
    });
}

/** Simula o logout do usuário */
function logout(): void {
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;

    if (!loginScreen || !appContainer || !passwordInput) return;

    showToast('info', 'Logout', 'Você saiu da sua conta.');

    gsap.to(appContainer, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
            appContainer.style.display = 'none';
            gsap.set(loginScreen, { display: 'flex', opacity: 0 });
            loginScreen.classList.add('visible');
            passwordInput.value = ''; // Limpa senha

            gsap.to(loginScreen, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            });
            state.currentView = null;
            state.currentPatientId = null;
            state.currentDocumentId = null;
            closeMobileMenu();
        }
    });
}

// --- Navegação Principal e Sidebar ---

/** Configura os links de navegação (header, sidebar, mobile) */
function setupNavigation(): void {
    document.body.addEventListener('click', (e: MouseEvent) => {
        const link = (e.target as Element)?.closest<HTMLElement>('[data-target]');

        if (link?.dataset.target) {
            e.preventDefault(); // Previne comportamento padrão para todos os links tratados
            const targetView = link.dataset.target;

            switch (targetView) {
                case 'perfil':
                case 'preferencias':
                    showToast('info', 'Funcionalidade Futura', `${targetView.charAt(0).toUpperCase() + targetView.slice(1)} ainda não implementado.`);
                    closeMobileMenu();
                    break;
                case 'sair':
                    logout();
                    break;
                default:
                    // Troca de view normal
                    if (state.currentView !== targetView) {
                        window.switchView(targetView);
                    } else {
                        // Se clicou no link da view atual, apenas fecha o menu mobile
                        closeMobileMenu();
                    }
                    break;
            }
        }
    });
}


/** Atualiza o estado ativo dos links de navegação */
function updateNavigation(activeViewId: string): void {
    const allLinks = document.querySelectorAll<HTMLElement>('.nav-item[data-target], .sidebar-link[data-target], .mobile-menu-item[data-target]');
    allLinks.forEach(link => {
        const isActive = link.dataset.target === activeViewId;
        link.classList.toggle('active', isActive);
    });
    closeMobileMenu();
}

/** Configura o toggle da sidebar */
function setupSidebar(): void {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector<HTMLElement>('.app-sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
            document.body.classList.toggle('sidebar-expanded', sidebar.classList.contains('expanded'));
        });
    }
}

/** Configura o menu mobile */
function setupMobileMenu(): void {
    const openBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.querySelector<HTMLButtonElement>('.mobile-menu-close');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    const menu = document.getElementById('mobileMenu');

    if (!openBtn || !closeBtn || !backdrop || !menu) {
        console.error("Elementos do menu mobile não encontrados.");
        return;
    }

    openBtn.addEventListener('click', openMobileMenu);
    closeBtn.addEventListener('click', closeMobileMenu);
    backdrop.addEventListener('click', closeMobileMenu);
}

/** Abre o menu mobile */
function openMobileMenu(): void {
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if (menu && backdrop) {
        backdrop.classList.add('open');
        menu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

/** Fecha o menu mobile */
function closeMobileMenu(): void {
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if (menu?.classList.contains('open') && backdrop) {
        menu.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// --- Troca de Views ---

/**
 * Alterna entre as views principais da aplicação.
 * @param viewId - O ID da view de destino (sem o sufixo '-view').
 */
window.switchView = function(viewId: string): void {
    const newViewElem = document.getElementById(`${viewId}-view`);
    if (!newViewElem) {
        console.error(`View não encontrada: ${viewId}-view`);
        showToast('error', 'Erro de Navegação', `A view '${viewId}' não existe.`);
        return;
    }

    if (state.currentView === viewId) {
        console.log(`Já está na view: ${viewId}`);
        closeMobileMenu();
        return;
    }
    if (state.isProcessing) {
        showToast('warning', 'Processo em andamento', 'Por favor, aguarde a conclusão do processo atual.');
        return;
    }

    console.log(`Trocando para view: ${viewId}`);
    const currentViewElem = state.currentView ? document.getElementById(`${state.currentView}-view`) : null;
    const newViewDisplayStyle = (viewId === 'library' || viewId === 'patient' || viewId === 'results' || viewId === 'processing') ? 'flex' : 'block'; // Ajustado para novas views

    const showNewView = () => {
        gsap.set(newViewElem, { display: newViewDisplayStyle, opacity: 0, y: 15 });
        newViewElem.scrollTop = 0;

        gsap.to(newViewElem, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
                // Funções pós-ativação da view
                switch (viewId) {
                    case 'patient':
                        activatePatientTab(state.activePatientTab || 'summary-panel');
                        break;
                    case 'library':
                        renderDocumentLibrary();
                        if (state.currentDocumentId) {
                            viewDocumentInWorkspace(state.currentDocumentId);
                        } else {
                            showEmptyDocumentView();
                        }
                        break;
                    case 'dashboard':
                        renderRecentDocuments();
                        break;
                    case 'results':
                        // Garante que a aba ativa seja renderizada corretamente
                        activateResultsTab(state.activeResultsTab || 'transcription-panel');
                        break;
                    case 'new':
                        // Garante que a aba ativa seja renderizada corretamente
                        activateNewDocumentTab(state.activeNewDocumentTab || 'record');
                        break;
                    // Adicionar case para 'processing' se necessário
                }
            }
        });

        state.currentView = viewId;
        updateNavigation(viewId);
    };

    if (currentViewElem) {
        gsap.to(currentViewElem, {
            opacity: 0,
            y: -15,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                currentViewElem.style.display = 'none';
                currentViewElem.style.transform = '';
                showNewView();
            }
        });
    } else {
        showNewView(); // Primeira carga
    }
};


// --- Painel do Paciente (#patient-view) ---

/** Abre o painel de um paciente específico (chamado a partir do dashboard, por exemplo) */
function openPatientPanel(patientId: string): void {
    const patient = state.recentPatients.find(p => p.id === patientId);
    if (!patient) {
        showToast('error', 'Erro', 'Paciente não encontrado.');
        return;
    }
    console.log(`Abrindo painel para paciente: ${patient.name} (ID: ${patientId})`);
    state.currentPatientId = patientId;

    // Atualiza informações no header do paciente (assumindo que os elementos existem em #patient-view)
    const nameElem = document.querySelector<HTMLElement>('#patient-view .patient-name');
    const detailsElem = document.querySelector<HTMLElement>('#patient-view .patient-details');
    if (nameElem) nameElem.textContent = escapeHtml(patient.name);
    if (detailsElem) detailsElem.textContent = `${escapeHtml(String(patient.age))} anos • ${escapeHtml(patient.gender)} • Prontuário #${escapeHtml(patientId.replace('patient-', ''))}`;

    state.activePatientTab = 'summary-panel'; // Sempre começa no resumo
    window.switchView('patient');
    // A ativação da tab e gráfico ocorre no onComplete do switchView
}

/** Configura as abas do painel de paciente */
function setupPatientTabs(): void {
    const tabsContainer = document.querySelector<HTMLElement>('#patient-view .patient-tabs');
    if (!tabsContainer) return;

    tabsContainer.addEventListener('click', (e: MouseEvent) => {
        const tab = (e.target as Element)?.closest<HTMLButtonElement>('.patient-tab');
        if (tab?.dataset.panel && !tab.classList.contains('active')) {
            activatePatientTab(tab.dataset.panel);
        }
    });
    // Botão Voltar
    document.getElementById('backToDashboardBtn')?.addEventListener('click', goBack);
}

/** Ativa uma aba específica no painel do paciente */
function activatePatientTab(panelId: string): void {
    if (!state.currentPatientId) return; // Precisa de um paciente ativo
    console.log(`Ativando aba do paciente: ${panelId}`);
    state.activePatientTab = panelId;

    // Atualiza estilo das abas
    document.querySelectorAll<HTMLButtonElement>('#patient-view .patient-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panel === panelId);
    });

    // Animação de troca de painéis
    const panelsContainer = document.querySelector<HTMLElement>('#patient-view .patient-tab-panels');
    const activePanel = document.getElementById(panelId);
    const currentActivePanel = panelsContainer?.querySelector<HTMLElement>('.patient-tab-panel.active');

    if (!activePanel) {
        console.error(`Painel não encontrado: ${panelId}`);
        return;
    }

    const showActivePanel = () => {
        gsap.set(activePanel, { display: 'block', opacity: 0 });
        activePanel.classList.add('active');
        activePanel.scrollTop = 0;

        gsap.to(activePanel, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
            onComplete: () => {
                if (panelId === 'summary-panel') {
                    updateDimensionalChart();
                } else if (panelId === 'repository-panel') {
                    renderPatientDocuments();
                }
            }
        });
    };

    if (currentActivePanel && currentActivePanel !== activePanel) {
        gsap.to(currentActivePanel, {
            opacity: 0,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
                currentActivePanel.classList.remove('active');
                currentActivePanel.style.display = 'none';
                showActivePanel();
            }
        });
    } else if (!currentActivePanel) {
        showActivePanel();
    }
}

/** Função para voltar da view do paciente para o dashboard */
function goBack(): void {
    state.currentPatientId = null; // Limpa o paciente ativo
    window.switchView('dashboard');
}

// --- Gráficos e Visualizações ---

/** Inicializa instâncias de gráficos (vazias inicialmente) */
function initCharts(): void {
    window.dimensionalChart = null;
    window.modalChart = null;
}

/** Atualiza o gráfico radar dimensional no painel do paciente */
function updateDimensionalChart(): void {
    const chartElem = document.getElementById('dimensionalRadarChart') as HTMLCanvasElement | null;
    // Só atualiza se a view e a tab estiverem corretas e o Chart.js carregado
    if (!chartElem || typeof Chart === 'undefined' || state.currentView !== 'patient' || state.activePatientTab !== 'summary-panel') {
        return;
    }
    console.log("Atualizando gráfico dimensional do paciente...");

    if (window.dimensionalChart instanceof Chart) {
        window.dimensionalChart.destroy();
    }

    // TODO: Obter dados reais do paciente state.currentPatientId
    const patientData = state.dimensionalData; // Usando dados de exemplo

    const data = {
        labels: [
            'Valência', 'Excitação', 'Dominância', 'Intensidade', // Emocional
            'Complexidade', 'Coerência', 'Flexibilidade', 'Dissonância', // Cognitiva
            'Persp. Temporal', 'Autocontrole' // Autonomia
        ],
        datasets: [{
            label: `Paciente #${state.currentPatientId?.replace('patient-', '') || 'N/A'}`,
            data: [
                patientData.emocional.valencia, patientData.emocional.excitacao, patientData.emocional.dominancia, patientData.emocional.intensidade,
                patientData.cognitiva.complexidade, patientData.cognitiva.coerencia, patientData.cognitiva.flexibilidade, patientData.cognitiva.dissonancia,
                patientData.autonomia.perspectivaTemporal.media, patientData.autonomia.autocontrole
            ],
            fill: true,
            backgroundColor: 'rgba(58, 163, 234, 0.2)', // --accent-light
            borderColor: 'rgb(58, 163, 234)', // --accent-vivid
            pointBackgroundColor: 'rgb(58, 163, 234)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(58, 163, 234)'
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        elements: { line: { borderWidth: 2 } },
        scales: {
            r: { // Escala radial (valores)
                angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' },
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                pointLabels: { font: { size: 11 } },
                suggestedMin: -10,
                suggestedMax: 10,
                ticks: {
                    stepSize: 2,
                    backdropColor: 'rgba(255, 255, 255, 0.75)',
                    color: 'rgba(0, 0, 0, 0.6)'
                }
            }
        },
        plugins: { legend: { display: false } }
    };

    try {
        window.dimensionalChart = new Chart(chartElem.getContext('2d')!, { type: 'radar', data, options });
    } catch (error) {
        console.error("Erro ao criar gráfico dimensional do paciente:", error);
        showToast('error', 'Erro no Gráfico', 'Não foi possível exibir a análise dimensional.');
    }
}


/** Configura a visualização dimensional modal */
function setupDimensionalVisualizations(): void {
    const openModalBtn = document.querySelector<HTMLButtonElement>('.activate-dimensional-space'); // Botão no header
    const openModalBtnPatient = document.querySelector<HTMLButtonElement>('#patient-view .dimensional-summary .btn'); // Botão no painel do paciente
    const modalOverlay = document.getElementById('dimensionalModal');
    const closeBtn = document.getElementById('dimensionalModalClose');
    const tabsContainer = modalOverlay?.querySelector<HTMLElement>('.dimensional-tabs');

    openModalBtn?.addEventListener('click', showDimensionalModal);
    openModalBtnPatient?.addEventListener('click', showDimensionalModal);
    closeBtn?.addEventListener('click', hideDimensionalModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e: MouseEvent) => {
            if (e.target === modalOverlay) {
                hideDimensionalModal();
            }
        });
    }
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e: MouseEvent) => {
            const tab = (e.target as Element)?.closest<HTMLButtonElement>('.dimensional-tab');
            if (tab?.dataset.view && !tab.classList.contains('active')) {
                activateDimensionalView(tab.dataset.view);
            }
        });
    }
}

/** Mostra o modal de visualização dimensional */
function showDimensionalModal(): void {
    const modal = document.getElementById('dimensionalModal');
    if (modal) {
        console.log("Mostrando modal dimensional");
        gsap.set(modal, { display: 'flex', opacity: 0 });
        gsap.to(modal, {
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out',
            onComplete: () => {
                activateDimensionalView('radar'); // Ativa view padrão
            }
        });
        gsap.fromTo(modal.querySelector('.modal-container'),
            { scale: 0.95, y: 10 },
            { scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
    }
}

/** Esconde o modal de visualização dimensional */
function hideDimensionalModal(): void {
    const modal = document.getElementById('dimensionalModal');
    if (modal) {
        console.log("Escondendo modal dimensional");
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in',
            onComplete: () => {
                modal.style.display = 'none';
                if (window.modalChart instanceof Chart) {
                    window.modalChart.destroy();
                    window.modalChart = null;
                }
            }
        });
    }
}

/** Ativa uma visualização dimensional específica dentro do modal */
function activateDimensionalView(viewType: string): void {
    const modal = document.getElementById('dimensionalModal');
    if (!modal || modal.style.display === 'none') return;

    console.log(`Ativando visualização dimensional: ${viewType}`);
    state.activeDimensionalView = viewType;

    // Atualiza estilo das abas
    modal.querySelectorAll<HTMLButtonElement>('.dimensional-tabs .dimensional-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === viewType);
    });

    // Animação de troca de painéis
    const panelsContainer = modal.querySelector<HTMLElement>('.dimensional-views');
    const activePanel = document.getElementById(`${viewType}-view`);
    const currentActivePanel = panelsContainer?.querySelector<HTMLElement>('.dimensional-view.active');

    if (!activePanel) {
        console.error(`Painel de visualização não encontrado: ${viewType}-view`);
        return;
    }

    const showActivePanel = () => {
        gsap.set(activePanel, { display: 'flex', opacity: 0 });
        activePanel.classList.add('active');

        gsap.to(activePanel, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
            onComplete: () => {
                if (viewType === 'radar') {
                    updateModalDimensionalChart();
                }
                // Adicionar lógica para outras visualizações
            }
        });
    };

    if (currentActivePanel && currentActivePanel !== activePanel) {
        gsap.to(currentActivePanel, {
            opacity: 0,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
                currentActivePanel.classList.remove('active');
                currentActivePanel.style.display = 'none';
                showActivePanel();
            }
        });
    } else if (!currentActivePanel) {
        showActivePanel();
    }
}


/** Atualiza o gráfico radar no modal dimensional */
function updateModalDimensionalChart(): void {
    const chartElem = document.getElementById('modalRadarChart') as HTMLCanvasElement | null;
    const modal = document.getElementById('dimensionalModal');
    if (!chartElem || typeof Chart === 'undefined' || !modal || modal.style.display === 'none') {
        return;
    }
    console.log("Atualizando gráfico dimensional do modal...");

    if (window.modalChart instanceof Chart) {
        window.modalChart.destroy();
    }

    // TODO: Usar dados relevantes (paciente atual ou gerais)
    const modalData = state.dimensionalData; // Usando dados de exemplo

    const data = {
        labels: [ /* Mesmos labels */
            'Valência', 'Excitação', 'Dominância', 'Intensidade',
            'Complexidade', 'Coerência', 'Flexibilidade', 'Dissonância',
            'Persp. Temporal', 'Autocontrole'
        ],
        datasets: [{
            label: 'Análise Dimensional',
            data: [
                modalData.emocional.valencia, modalData.emocional.excitacao, modalData.emocional.dominancia, modalData.emocional.intensidade,
                modalData.cognitiva.complexidade, modalData.cognitiva.coerencia, modalData.cognitiva.flexibilidade, modalData.cognitiva.dissonancia,
                modalData.autonomia.perspectivaTemporal.media, modalData.autonomia.autocontrole
            ],
            fill: true,
            backgroundColor: 'rgba(58, 163, 234, 0.2)',
            borderColor: 'rgb(58, 163, 234)',
            pointBackgroundColor: 'rgb(58, 163, 234)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(58, 163, 234)'
        }]
    };
    const options = { /* Mesmas opções, talvez com legenda */
        responsive: true,
        maintainAspectRatio: false,
        elements: { line: { borderWidth: 2 } },
        scales: { r: { angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' }, grid: { color: 'rgba(0, 0, 0, 0.1)' }, pointLabels: { font: { size: 11 } }, suggestedMin: -10, suggestedMax: 10, ticks: { stepSize: 2, backdropColor: 'rgba(255, 255, 255, 0.75)', color: 'rgba(0, 0, 0, 0.6)' } } },
        plugins: { legend: { display: true, position: 'top' as const } } // Mostra legenda
    };

    try {
        window.modalChart = new Chart(chartElem.getContext('2d')!, { type: 'radar', data, options });
    } catch (error) {
        console.error("Erro ao criar gráfico dimensional do modal:", error);
        showToast('error', 'Erro no Gráfico', 'Não foi possível exibir a análise dimensional no modal.');
    }
}


// --- Edição de Documentos ---

/** Configura o sistema de edição de documentos (Modal) */
function setupDocumentEditing(): void {
    const modalOverlay = document.getElementById('editDocumentModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editModalClose = document.getElementById('editModalClose');

    cancelEditBtn?.addEventListener('click', closeDocumentEditor);
    saveEditBtn?.addEventListener('click', saveDocumentEdit);
    editModalClose?.addEventListener('click', closeDocumentEditor);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e: MouseEvent) => {
            if (e.target === modalOverlay) {
                closeDocumentEditor();
            }
        });
    }
}

/** Abre o editor de documentos (Modal) */
function openDocumentEditor(docType: DocumentType, title: string, content: string): void {
    console.log(`Abrindo editor para: ${title} (Tipo: ${docType})`);
    // state.currentDocumentId já deve estar definido por quem chamou editDocument()
    state.currentDocumentType = docType; // Guarda o tipo para salvar

    const modal = document.getElementById('editDocumentModal');
    const modalTitle = document.getElementById('editModalTitle');
    const editor = document.getElementById('documentEditor') as HTMLTextAreaElement | null;

    if (modal && modalTitle && editor) {
        modalTitle.textContent = title;
        editor.value = content;

        gsap.set(modal, { display: 'flex', opacity: 0 });
        gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power1.out' });
        gsap.fromTo(modal.querySelector('.modal-container'),
            { scale: 0.95, y: 10 },
            { scale: 1, y: 0, duration: 0.4, ease: 'power2.out', onComplete: () => editor.focus() }
        );
    } else {
        console.error("Elementos do modal de edição não encontrados.");
    }
}

/** Fecha o editor de documentos (Modal) */
function closeDocumentEditor(): void {
    const modal = document.getElementById('editDocumentModal');
    if (modal?.style.display !== 'none') {
        console.log("Fechando editor de documento.");
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in',
            onComplete: () => {
                if (modal) modal.style.display = 'none';
                const editor = document.getElementById('documentEditor') as HTMLTextAreaElement | null;
                if (editor) editor.value = '';
                state.currentDocumentType = null; // Limpa tipo ao fechar
            }
        });
    }
}

/** Salva as edições feitas no documento (Modal) */
function saveDocumentEdit(): void {
    const editor = document.getElementById('documentEditor') as HTMLTextAreaElement | null;
    if (!editor || !state.currentDocumentType || !state.currentDocumentId) {
        console.error("Não é possível salvar: editor, tipo ou ID do documento ausente.");
        showToast('error', 'Erro ao Salvar', 'Não foi possível identificar o documento a ser salvo.');
        return;
    }

    const newContent = editor.value;
    // Cria a chave dinamicamente com type assertion
    const docKey = `${state.currentDocumentType}Text` as keyof Pick<AppState, 'transcriptionText' | 'vintraText' | 'soapText' | 'ipissimaText' | 'narrativeText' | 'orientacoesText'>;

    console.log(`Salvando documento: ID ${state.currentDocumentId}, Tipo ${state.currentDocumentType}`);

    // Atualiza o conteúdo no estado global (simulação)
    if (state.hasOwnProperty(docKey)) {
        // Atribuição segura usando a chave tipada
        state[docKey] = newContent;
        console.log(`Conteúdo para ${docKey} atualizado no estado.`);

        // Atualiza a visualização se o documento editado estiver visível
        if (state.currentView === 'library' && document.querySelector(`#documentView [data-id="${state.currentDocumentId}"]`)) {
             viewDocumentInWorkspace(state.currentDocumentId);
        } else if (state.currentView === 'results' && state.activeResultsTab === `${state.currentDocumentType}-panel`) {
             const contentElement = document.getElementById(`${state.currentDocumentType}ResultContent`) || document.getElementById(`${state.currentDocumentType}Content`);
             const viewElement = contentElement?.querySelector('.document-view');
             if(viewElement) {
                 viewElement.innerHTML = `<pre>${escapeHtml(newContent)}</pre>`;
             }
        } else if (state.currentView === 'patient' && state.activePatientTab === 'repository-panel') {
            // Se precisar atualizar alguma pré-visualização na aba do paciente
        }

        showToast('success', 'Documento Salvo', `Alterações em '${state.currentDocumentType}' foram salvas.`);
        closeDocumentEditor();
    } else {
        console.error(`Chave de estado inválida para salvar: ${docKey}`);
        showToast('error', 'Erro ao Salvar', 'Tipo de documento inválido.');
    }
}


// --- Ações de Documento (Visualizar, Editar, Download) ---

/** Visualiza um documento (mostra em modal genérico) */
function viewDocument(docId: string): void {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado.');
        return;
    }

    console.log(`Visualizando (modal genérico): ${doc.title}`);
    const content = getDocumentContent(doc.type) ?? `Conteúdo para '${doc.type}' não disponível.`;

    const formattedContent = `<pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 0.9rem; max-height: 60vh; overflow-y: auto;">${escapeHtml(content)}</pre>`;
    showGenericModal(`Visualizar: ${escapeHtml(doc.title)}`, formattedContent);
}

/** Abre um documento para edição (chamando o modal de edição) */
function editDocument(docId: string): void {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado.');
        return;
    }

    if (['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type)) {
        const content = getDocumentContent(doc.type);
        if (content !== null) { // Verifica se o conteúdo foi encontrado
            state.currentDocumentId = docId; // Define o ID do documento que está sendo editado
            openDocumentEditor(doc.type, `Editar ${escapeHtml(doc.title)}`, content);
        } else {
             showToast('error', 'Erro', `Conteúdo para '${doc.type}' não encontrado.`);
        }
    } else {
        showToast('info', 'Não Editável', `Documentos do tipo '${doc.type}' não podem ser editados diretamente.`);
    }
}

/** Realiza o download de um documento */
function downloadDocument(docId: string): void {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado.');
        return;
    }

    console.log(`Iniciando download de: ${doc.title}`);

    let blob: Blob;
    let filename = doc.title.includes('.') ? doc.title : `${doc.title}.txt`;

    if (doc.type === 'audio') {
        // Simulação: Usa state.processedAudioBlob se existir (de uma gravação anterior)
        // Ou cria um blob vazio como placeholder
        if (state.processedAudioBlob && doc.id === 'recording_blob_id') { // Assumindo um ID especial para o blob gravado
             blob = state.processedAudioBlob;
             // Garante extensão correta
             if (!filename.match(/\.(wav|mp3|ogg|m4a)$/i)) {
                 filename = filename.replace(/\.[^/.]+$/, "") + ".wav"; // Assume .wav
             }
        } else {
            blob = new Blob(["Simulação de conteúdo de áudio."], { type: 'audio/wav' });
            showToast('info', 'Download Simulado', 'Este é um arquivo de áudio simulado.');
             if (!filename.match(/\.(wav|mp3|ogg|m4a)$/i)) {
                 filename = filename.replace(/\.[^/.]+$/, "") + ".wav";
             }
        }
    } else {
        const content = getDocumentContent(doc.type);
        if (content === null) {
             showToast('error', 'Erro no Download', `Conteúdo para '${doc.type}' não encontrado.`);
             return;
        }
        blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    }

    // Cria link temporário para download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('success', 'Download Iniciado', `${filename} está sendo baixado.`);
    }, 100);
}

/** Obtém o conteúdo de um documento do estado global com base no tipo */
function getDocumentContent(type: DocumentType): string | null {
    const key = `${type}Text` as keyof Pick<AppState, 'transcriptionText' | 'vintraText' | 'soapText' | 'ipissimaText' | 'narrativeText' | 'orientacoesText'>;
    if (state.hasOwnProperty(key)) {
        return state[key];
    }
    console.warn(`Conteúdo para o tipo '${type}' não encontrado no estado.`);
    return null; // Retorna null se não encontrado
}


// --- View: Novo Documento (#new-view) ---

/** Configura as abas da view "Novo Documento" */
function setupNewDocumentTabs(): void {
    const tabsContainer = document.querySelector<HTMLElement>('#new-view .library-filters'); // Reutiliza estilo
    const contentContainer = document.getElementById('newDocumentContent');

    if (!tabsContainer || !contentContainer) {
        console.error("Elementos das abas de 'Novo Documento' não encontrados.");
        return;
    }

    tabsContainer.addEventListener('click', (e: MouseEvent) => {
        const tab = (e.target as Element)?.closest<HTMLButtonElement>('.library-filter');
        if (tab?.dataset.newTab && !tab.classList.contains('active')) {
            activateNewDocumentTab(tab.dataset.newTab);
        }
    });

    // Garante que apenas a aba inicial esteja visível e ativa
    activateNewDocumentTab(state.activeNewDocumentTab);
}

/** Ativa uma aba específica na view "Novo Documento" */
function activateNewDocumentTab(tabId: string): void {
    console.log(`Ativando aba Novo Documento: ${tabId}`);
    state.activeNewDocumentTab = tabId;
    const tabsContainer = document.querySelector<HTMLElement>('#new-view .library-filters');
    const contentContainer = document.getElementById('newDocumentContent');
    if (!tabsContainer || !contentContainer) return;

    // Atualiza estilo das abas
    tabsContainer.querySelectorAll<HTMLButtonElement>('.library-filter').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.newTab === tabId);
    });

    // Animação de troca de painéis
    const activePanel = document.getElementById(`${tabId}-tab`);
    const currentActivePanel = contentContainer.querySelector<HTMLElement>(':scope > div.active');

    if (!activePanel) {
        console.error(`Painel não encontrado: ${tabId}-tab`);
        return;
    }

    const showActivePanel = () => {
        gsap.set(activePanel, { display: 'block', opacity: 0 });
        activePanel.classList.add('active');
        activePanel.scrollTop = 0;

        gsap.to(activePanel, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
            onComplete: () => {
                 // Focar no elemento relevante, se aplicável
                 if (tabId === 'transcribe') {
                     document.getElementById('transcriptionText')?.focus();
                 }
            }
        });
    };

    if (currentActivePanel && currentActivePanel !== activePanel) {
        gsap.to(currentActivePanel, {
            opacity: 0,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
                currentActivePanel.classList.remove('active');
                currentActivePanel.style.display = 'none';
                showActivePanel();
            }
        });
    } else if (!currentActivePanel) {
        showActivePanel();
    }
}


// --- Gravação de Áudio ---

/** Configura o módulo de gravação de áudio */
function setupRecorder(): void {
    const startBtn = document.getElementById('startRecordingBtn');
    const stopBtn = document.getElementById('stopRecordingBtn');
    const removeBtn = document.getElementById('recordingRemoveBtn');
    const processBtn = document.getElementById('processRecordingBtn');

    startBtn?.addEventListener('click', startRecording);
    stopBtn?.addEventListener('click', stopRecording);
    removeBtn?.addEventListener('click', resetRecording);
    processBtn?.addEventListener('click', () => {
        if (state.processedAudioBlob) {
            simulateProcessing('recording');
        } else {
            showToast('error', 'Erro', 'Nenhuma gravação para processar.');
        }
    });

    // Inicializa Web Audio API
    try {
        state.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 256;
    } catch (e) {
        console.error("Web Audio API não suportada.", e);
        showToast('warning', 'Visualizador Indisponível', 'Seu navegador não suporta a visualização de áudio.');
        const visualizer = document.querySelector<HTMLElement>('.recording-visualizer');
        if (visualizer) visualizer.style.display = 'none';
    }
}

/** Inicia a gravação de áudio */
async function startRecording(): Promise<void> {
    if (state.isRecording || state.isProcessing) return;

    console.log("Tentando iniciar gravação...");
    resetRecordingVisuals();
    state.audioChunks = [];
    state.processedAudioBlob = null;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        console.log("Acesso ao microfone concedido.");

        state.mediaRecorder = new MediaRecorder(stream);
        state.mediaRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                state.audioChunks.push(event.data);
            }
        };

        state.mediaRecorder.onstop = () => {
            console.log("MediaRecorder parado.");
            state.processedAudioBlob = new Blob(state.audioChunks, { type: 'audio/wav' });
            console.log("Blob de áudio criado:", state.processedAudioBlob);
            state.audioChunks = [];

            stream.getTracks().forEach(track => track.stop());
            console.log("Tracks de áudio paradas.");

            updateUIAfterRecording();
        };

        state.mediaRecorder.start();
        state.isRecording = true;
        state.recordingStartTime = Date.now();
        console.log("MediaRecorder iniciado.");

        startTimer();
        if (state.audioContext && state.analyser) {
            // Garante que o context não esteja suspenso
             if (state.audioContext.state === 'suspended') {
                await state.audioContext.resume();
            }
            state.visualizerSource = state.audioContext.createMediaStreamSource(stream);
            state.visualizerSource.connect(state.analyser);
            startVisualizer();
            const visualizer = document.querySelector<HTMLElement>('.recording-visualizer');
            if(visualizer) visualizer.style.opacity = '1';
        }

        updateUIRecordingState(true);
        const statusEl = document.getElementById('recordingStatus');
        if(statusEl) statusEl.textContent = 'Gravando...';

    } catch (err: any) {
        console.error("Erro ao iniciar gravação:", err);
        state.isRecording = false;
        updateUIRecordingState(false);
        const statusEl = document.getElementById('recordingStatus');
        if(statusEl) statusEl.textContent = 'Erro ao iniciar';

        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            showToast('error', 'Permissão Negada', 'Você precisa permitir o acesso ao microfone.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            showToast('error', 'Microfone Não Encontrado', 'Nenhum microfone foi detectado.');
        } else {
            showToast('error', 'Erro na Gravação', 'Não foi possível iniciar a gravação.');
        }
    }
}

/** Para a gravação de áudio */
function stopRecording(): void {
    if (!state.isRecording || !state.mediaRecorder) return;

    console.log("Parando gravação...");
    try {
        state.mediaRecorder.stop(); // Aciona 'onstop'
        state.isRecording = false;
        stopTimer();
        stopVisualizer();
        updateUIRecordingState(false);
        const statusEl = document.getElementById('recordingStatus');
        if(statusEl) statusEl.textContent = 'Processando gravação...';
    } catch (error) {
        console.error("Erro ao parar MediaRecorder:", error);
        resetRecording();
        showToast('error', 'Erro ao Parar', 'Não foi possível finalizar a gravação corretamente.');
    }
}

/** Atualiza a interface após a gravação ser finalizada e o blob criado */
function updateUIAfterRecording(): void {
    console.log("Atualizando UI pós-gravação.");
    const preview = document.getElementById('recordingPreview');
    const fileNameEl = document.getElementById('recordingFileName');
    const fileMetaEl = document.getElementById('recordingFileMeta');
    const processBtn = document.getElementById('processRecordingBtn');
    const statusEl = document.getElementById('recordingStatus');

    if (preview && fileNameEl && fileMetaEl && processBtn && statusEl && state.processedAudioBlob && state.recordingStartTime) {
        const duration = (Date.now() - state.recordingStartTime) / 1000;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const fileSize = (state.processedAudioBlob.size / (1024 * 1024)).toFixed(1); // Em MB

        fileNameEl.textContent = `Gravação_${new Date().toISOString().split('T')[0]}.wav`;
        fileMetaEl.textContent = `${fileSize} MB • ${formattedDuration}`;

        gsap.to(preview, { display: 'flex', opacity: 1, duration: 0.3 });
        gsap.to(processBtn, { display: 'inline-flex', opacity: 1, duration: 0.3 });
        statusEl.textContent = 'Gravação finalizada';
    } else {
        console.error("Elementos de preview da gravação não encontrados ou blob/startTime ausente.");
        resetRecording(); // Reseta se algo deu errado
    }
}


/** Reseta o estado da gravação e a UI */
function resetRecording(): void {
    console.log("Resetando gravação.");
    if (state.isRecording) {
        // Tenta parar o MediaRecorder se estiver ativo, mas evita chamar stopRecording() recursivamente
        if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
             try {
                 state.mediaRecorder.stop();
             } catch (e) {
                 console.error("Erro ao tentar parar mediaRecorder no reset:", e);
             }
        }
        state.isRecording = false; // Força o estado
    }
    stopTimer();
    stopVisualizer();
    resetRecordingVisuals();
    state.audioChunks = [];
    state.processedAudioBlob = null;
    state.recordingStartTime = null;
    // Garante que o stream seja parado
    if (state.visualizerSource?.mediaStream) {
       state.visualizerSource.mediaStream.getTracks().forEach(track => track.stop());
    }
    state.visualizerSource?.disconnect(); // Desconecta a fonte do analyser
    state.visualizerSource = null;
    state.mediaRecorder = null; // Limpa a referência
}

/** Reseta apenas os elementos visuais da gravação */
function resetRecordingVisuals(): void {
    document.getElementById('startRecordingBtn')?.classList.remove('hidden');
    document.getElementById('stopRecordingBtn')?.classList.add('hidden');
    document.getElementById('recordingPreview')?.style.display = 'none';
    document.getElementById('processRecordingBtn')?.style.display = 'none';
    document.getElementById('recordingProgress')?.style.display = 'none';
    document.getElementById('recordingTranscriptionSteps')?.style.display = 'none';
    document.getElementById('liveTranscriptionPreview')?.style.display = 'none';
    document.getElementById('recordingCompletedPanel')?.style.display = 'none';

    const timeEl = document.getElementById('recordingTime');
    if(timeEl) timeEl.textContent = '00:00:00';
    const statusEl = document.getElementById('recordingStatus');
    if(statusEl) statusEl.textContent = 'Pronto para gravar';

    const visualizer = document.querySelector<HTMLElement>('.recording-visualizer');
    if(visualizer) visualizer.style.opacity = '0.3';
    const barsContainer = document.getElementById('visualizerBars');
    if (barsContainer) barsContainer.innerHTML = ''; // Limpa barras
}


/** Atualiza a visibilidade dos botões de gravação */
function updateUIRecordingState(isRecording: boolean): void {
    document.getElementById('startRecordingBtn')?.classList.toggle('hidden', isRecording);
    document.getElementById('stopRecordingBtn')?.classList.toggle('hidden', !isRecording);
}

/** Inicia o timer da gravação */
function startTimer(): void {
    if (state.recordingInterval) clearInterval(state.recordingInterval); // Limpa timer anterior
    const timerElement = document.getElementById('recordingTime');
    if(!timerElement) return;

    state.recordingInterval = window.setInterval(() => { // Usar window.setInterval para tipo number
        if (!state.recordingStartTime) return;
        const elapsedSeconds = Math.floor((Date.now() - state.recordingStartTime) / 1000);
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

/** Para o timer da gravação */
function stopTimer(): void {
    if (state.recordingInterval) {
        clearInterval(state.recordingInterval);
        state.recordingInterval = null;
    }
}

/** Inicia o visualizador de áudio */
function startVisualizer(): void {
    if (!state.analyser || !state.audioContext || state.audioContext.state === 'suspended' || !state.visualizerSource) {
        console.warn("AudioContext/Analyser/Source não disponível/pronto, não iniciando visualizador.");
        return;
    }

    const visualizerBars = document.getElementById('visualizerBars');
    if (!visualizerBars) return;
    visualizerBars.innerHTML = ''; // Limpa barras antigas

    const bufferLength = state.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barCount = 30;

    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        visualizerBars.appendChild(bar);
    }
    const bars = visualizerBars.childNodes as NodeListOf<HTMLDivElement>;

    const draw = () => {
        // Verifica se ainda deve desenhar
        if (!state.isRecording || !state.analyser) {
             stopVisualizer(); // Para o loop se a gravação parou ou analyser sumiu
             return;
        }

        state.visualizerRafId = requestAnimationFrame(draw);
        state.analyser.getByteFrequencyData(dataArray);

        const barHeightMultiplier = visualizerBars.clientHeight / 128;
        const step = Math.floor(bufferLength / barCount);

        for (let i = 0; i < barCount; i++) {
            let sum = 0;
            for (let j = 0; j < step; j++) {
                sum += dataArray[i * step + j];
            }
            let avg = sum / step || 0; // Evita NaN
            let barHeight = Math.max(1, Math.min(avg * barHeightMultiplier * 1.5, visualizerBars.clientHeight));
            if (bars[i]) {
                bars[i].style.height = `${barHeight}px`;
            }
        }
    };

    // Reinicia o RAF ID antes de chamar draw
    if(state.visualizerRafId) cancelAnimationFrame(state.visualizerRafId);
    state.visualizerRafId = null;
    draw();
}

/** Para o visualizador de áudio */
function stopVisualizer(): void {
    if (state.visualizerRafId) {
        cancelAnimationFrame(state.visualizerRafId);
        state.visualizerRafId = null;
    }
    // Não desconectar a source aqui, pois ela pode ser necessária para parar o stream
    // A desconexão e parada do stream ocorrem em stopRecording ou resetRecording

    const visualizerBars = document.getElementById('visualizerBars');
    if (visualizerBars) {
        gsap.to(".visualizer-bar", { height: 1, duration: 0.3, ease: 'power1.out', stagger: 0.01 });
    }
    console.log("Visualizador parado.");
}


// --- Upload de Arquivo ---

/** Configura o módulo de upload de arquivos */
function setupUpload(): void {
    const uploadArea = document.getElementById('uploadArea');
    const uploadInput = document.getElementById('uploadInput') as HTMLInputElement | null;
    const removeBtn = document.getElementById('uploadRemoveBtn');
    const processBtn = document.getElementById('processUploadBtn');

    if (!uploadArea || !uploadInput || !removeBtn || !processBtn) {
        console.error("Elementos de upload não encontrados.");
        return;
    }

    uploadArea.addEventListener('click', () => uploadInput.click());

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
    });

    uploadArea.addEventListener('drop', (e: DragEvent) => {
        const dt = e.dataTransfer;
        const files = dt?.files;
        if (files?.length) {
            handleFiles(files);
        }
    }, false);

    uploadInput.addEventListener('change', (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files?.length) {
            handleFiles(target.files);
        }
    });

    removeBtn.addEventListener('click', resetUpload);

    processBtn.addEventListener('click', () => {
        if (state.uploadedFile) {
            simulateProcessing('upload');
        } else {
            showToast('error', 'Erro', 'Nenhum arquivo selecionado para processar.');
        }
    });
}

/** Impede comportamentos padrão de drag & drop */
function preventDefaults(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
}

/** Lida com os arquivos selecionados/soltos */
function handleFiles(files: FileList): void {
    if (files.length > 1) {
        showToast('warning', 'Apenas um arquivo', 'Por favor, envie apenas um arquivo por vez.');
        return;
    }
    const file = files[0];
    // TODO: Validação de tipo de arquivo (ex: audio/*, text/plain)
    if (!file.type.startsWith('audio/') && file.type !== 'text/plain') {
         showToast('warning', 'Tipo Inválido', 'Apenas arquivos de áudio ou texto plano são suportados.');
         resetUpload(); // Limpa se o tipo for inválido
         return;
    }
    console.log("Arquivo selecionado:", file.name, file.size, file.type);

    state.uploadedFile = file;

    const preview = document.getElementById('uploadPreview');
    const fileNameEl = document.getElementById('uploadFileName');
    const fileMetaEl = document.getElementById('uploadFileMeta');
    const processBtn = document.getElementById('processUploadBtn');
    const iconEl = preview?.querySelector<HTMLElement>('.upload-preview-icon i');

    if (preview && fileNameEl && fileMetaEl && processBtn && iconEl) {
        fileNameEl.textContent = escapeHtml(file.name);
        fileMetaEl.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

        if (file.type.startsWith('audio/')) {
            iconEl.className = 'fas fa-file-audio';
        } else if (file.type === 'text/plain') {
            iconEl.className = 'fas fa-file-alt';
        } else {
            iconEl.className = 'fas fa-file'; // Fallback
        }

        gsap.to(preview, { display: 'flex', opacity: 1, duration: 0.3 });
        gsap.to(processBtn, { display: 'inline-flex', opacity: 1, duration: 0.3 });
        // document.getElementById('uploadArea')?.style.display = 'none'; // Opcional
    }
    // Limpa o input para permitir selecionar o mesmo arquivo novamente
    const uploadInput = document.getElementById('uploadInput') as HTMLInputElement | null;
    if(uploadInput) uploadInput.value = '';
}

/** Reseta o estado do upload e a UI */
function resetUpload(): void {
    console.log("Resetando upload.");
    state.uploadedFile = null;
    const preview = document.getElementById('uploadPreview');
    const processBtn = document.getElementById('processUploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadSteps = document.getElementById('uploadTranscriptionSteps');
    const uploadCompleted = document.getElementById('uploadCompletedPanel');
    const uploadInput = document.getElementById('uploadInput') as HTMLInputElement | null;

    if (preview) gsap.to(preview, { opacity: 0, duration: 0.2, onComplete: () => preview.style.display = 'none' });
    if (processBtn) gsap.to(processBtn, { opacity: 0, duration: 0.2, onComplete: () => processBtn.style.display = 'none' });
    if (uploadProgress) uploadProgress.style.display = 'none';
    if (uploadSteps) uploadSteps.style.display = 'none';
    if (uploadCompleted) uploadCompleted.style.display = 'none';
    if (uploadInput) uploadInput.value = '';
    // document.getElementById('uploadArea')?.style.display = 'block'; // Opcional
}


// --- Transcrição Manual ---

/** Configura a aba de transcrição manual */
function setupTranscriptionInput(): void {
    const processBtn = document.getElementById('processManualTranscriptionBtn');
    const textarea = document.getElementById('transcriptionText') as HTMLTextAreaElement | null;

    if (processBtn && textarea) {
        processBtn.addEventListener('click', () => {
            const text = textarea.value.trim();
            if (text) {
                // Salva a transcrição manual no estado para uso posterior
                state.transcriptionText = text;
                simulateProcessing('manual');
            } else {
                showToast('warning', 'Texto Vazio', 'Por favor, digite ou cole a transcrição.');
                textarea.focus();
            }
        });
    }
}

// --- Simulação de Processamento e Geração ---

/** Define o estado de processamento e atualiza a UI globalmente */
function setProcessingState(isProcessing: boolean): void {
    state.isProcessing = isProcessing;
    const elementsToToggle = document.querySelectorAll<HTMLButtonElement | HTMLAnchorElement | HTMLInputElement | HTMLTextAreaElement>(`
        .sidebar-link, .mobile-menu-item, #sidebarToggle, #mobileMenuBtn,
        .library-btn, .document-item, .toolbar-btn, .patient-tab,
        #startRecordingBtn, #stopRecordingBtn, #processRecordingBtn,
        #uploadArea, #uploadInput, #processUploadBtn,
        #processManualTranscriptionBtn, #startProcessingBtn,
        .document-format-option, .dimensional-tab, .modal-close, .modal-footer button,
        .document-action-btn, .nav-item
    `); // Seletores mais abrangentes
    elementsToToggle.forEach(el => {
        el.disabled = isProcessing;
        el.classList.toggle('disabled', isProcessing);
    });
    console.log(`Estado de processamento: ${isProcessing}`);
}

/**
 * Simula o processamento de um documento (gravação, upload, manual).
 * @param type - O tipo de origem.
 */
async function simulateProcessing(type: 'recording' | 'upload' | 'manual'): Promise<void> {
    if (state.isProcessing) return;
    setProcessingState(true);
    console.log(`Simulando processamento para: ${type}`);

    // Seleciona os elementos corretos
    const progressContainerId = `${type}Progress`;
    const stepsContainerId = `${type}TranscriptionSteps`;
    const stepsProgressId = `${type}TranscriptionStepsProgress`;
    const completedPanelId = `${type}CompletedPanel`;
    const progressBarId = `${type}ProgressBar`;
    const percentageId = `${type}ProgressPercentage`;
    const statusId = `${type}ProgressStatus`;
    const previewId = `${type}Preview`;
    const actionButtonId = type === 'recording' ? 'processRecordingBtn' : (type === 'upload' ? 'processUploadBtn' : 'processManualTranscriptionBtn');
    const livePreviewId = 'liveTranscriptionPreview'; // ID unificado para gravação/upload

    const progressContainer = document.getElementById(progressContainerId);
    const stepsContainer = document.getElementById(stepsContainerId);
    const completedPanel = document.getElementById(completedPanelId);
    const previewContainer = document.getElementById(previewId);
    const actionButton = document.getElementById(actionButtonId);
    const livePreview = document.getElementById(livePreviewId);
    const manualTextarea = document.getElementById('transcriptionText') as HTMLTextAreaElement | null;

    // Esconde botão de ação e preview (se aplicável)
    if (actionButton) gsap.to(actionButton, { opacity: 0, duration: 0.2, onComplete: () => actionButton.style.display = 'none' });
    if (previewContainer && type !== 'manual') gsap.to(previewContainer, { opacity: 0, duration: 0.2, onComplete: () => previewContainer.style.display = 'none' });
    if (type === 'manual' && manualTextarea) manualTextarea.disabled = true;

    // Mostra indicadores de progresso
    if (progressContainer) progressContainer.style.display = 'block';
    if (stepsContainer) stepsContainer.style.display = 'block';
    if (livePreview && (type === 'recording' || type === 'upload')) {
         livePreview.style.display = 'block';
         livePreview.innerHTML = '<p><i>Iniciando análise...</i><span class="typing"></span></p>';
    }

    // Simulação dos passos
    const steps = [
        { name: type === 'upload' ? 'Upload' : (type === 'manual' ? 'Validação' : 'Processando Áudio'), duration: 1000, text: 'Analisando dados...' },
        { name: type === 'manual' ? 'Processamento' : 'Transcrição', duration: 2000, text: 'Realizando transcrição...' },
        { name: type === 'manual' ? 'Análise' : 'Diarização', duration: 1500, text: 'Identificando segmentos...' },
        { name: 'Finalização', duration: 500, text: 'Gerando documento...' }
    ];

    let totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    // Simula a transcrição (usando texto de exemplo)
    const simulatedTranscription = state.transcriptionText || `Transcrição simulada para ${type} - ${new Date().toLocaleTimeString()}. Médico: ... Paciente: ...`;
    state.transcriptionText = simulatedTranscription; // Atualiza o estado com a transcrição (simulada ou manual)

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        updateStepProgress(stepsContainerId, stepsProgressId, i + 1);
        updateProgressBar(progressBarId, percentageId, statusId, (elapsed / totalDuration) * 100, step.name);
        if (livePreview && (type === 'recording' || type === 'upload')) {
            livePreview.innerHTML = `<p><i>${step.text}</i><span class="typing"></span></p>`;
            livePreview.scrollTop = livePreview.scrollHeight;
        }

        await new Promise(resolve => setTimeout(resolve, step.duration));
        elapsed += step.duration;

        if (i < steps.length - 1) {
            updateStepProgress(stepsContainerId, stepsProgressId, i + 1, true);
        }
    }

    updateProgressBar(progressBarId, percentageId, statusId, 100, 'Concluído');
    updateStepProgress(stepsContainerId, stepsProgressId, steps.length, true);
    if (livePreview && (type === 'recording' || type === 'upload')) {
        livePreview.innerHTML = `<p><i>Transcrição finalizada.</i></p>`;
    }

    // Adiciona o documento processado (transcrição) ao estado
    const originalFileName = type === 'upload' ? state.uploadedFile?.name : (type === 'recording' ? document.getElementById('recordingFileName')?.textContent : 'Transcricao_Manual');
    const newDocId = addProcessedDocument(originalFileName || 'Documento', type);
    if(newDocId) {
        state.currentDocumentId = newDocId; // Define o documento recém-criado como ativo
    } else {
        console.error("Falha ao criar ID para o novo documento de transcrição.");
        // Lidar com o erro - talvez mostrar um toast e resetar
        setProcessingState(false);
        showToast('error', 'Erro Interno', 'Não foi possível salvar a transcrição processada.');
        // Resetar a UI específica do tipo de processamento
        if (type === 'recording') resetRecording();
        else if (type === 'upload') resetUpload();
        else if (type === 'manual' && manualTextarea) manualTextarea.disabled = false;
        return; // Interrompe a função aqui
    }


    // Esconde progresso e mostra painel de conclusão
    if (progressContainer) progressContainer.style.display = 'none';
    if (stepsContainer) stepsContainer.style.display = 'none';
    if (livePreview) livePreview.style.display = 'none';
    if (completedPanel) {
        completedPanel.classList.add('active');
        completedPanel.style.display = 'flex';
    }
    if (type === 'manual' && manualTextarea) manualTextarea.disabled = false;

    setProcessingState(false);
    console.log(`Processamento de ${type} concluído. Novo Documento ID: ${newDocId}`);
}

/** Adiciona um documento de transcrição processado à lista */
function addProcessedDocument(originalFileName: string, sourceType: 'recording' | 'upload' | 'manual'): string | null {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR'); // dd/mm/yyyy
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const safeName = originalFileName.replace(/\.[^/.]+$/, ""); // Remove extensão
    const newId = `doc${Date.now()}`; // ID único

    // Usa o state.transcriptionText que foi atualizado/simulado em simulateProcessing
    const contentSize = state.transcriptionText ? (state.transcriptionText.length / 1024).toFixed(1) : '0.0';

    const newDoc: DocumentMetadata = {
        id: newId,
        patientId: state.currentPatientId || null, // Associa ao paciente atual, se houver
        title: `Transcrição_${safeName}.txt`,
        type: 'transcription',
        date: dateStr,
        time: timeStr,
        icon: 'fas fa-file-alt',
        color: 'var(--accent)',
        size: `${contentSize} KB`
    };

    // Verifica se já existe um documento com o mesmo ID (improvável, mas seguro)
    if (state.documents.some(doc => doc.id === newId)) {
        console.error("Erro: Tentativa de adicionar documento com ID duplicado:", newId);
        return null; // Retorna null para indicar falha
    }

    state.documents.push(newDoc);
    console.log("Novo documento de transcrição adicionado:", newDoc);

    // Opcional: Atualizar UI se necessário (ex: biblioteca)
    if (state.currentView === 'library') {
        renderDocumentLibrary();
    }
     // Atualiza documentos do paciente se a aba estiver ativa
    if (state.currentView === 'patient' && state.activePatientTab === 'repository-panel') {
        renderPatientDocuments();
    }

    return newId; // Retorna o ID do novo documento
}

/** Atualiza a UI dos indicadores de passo */
function updateStepProgress(stepsContainerId: string, progressIndicatorId: string, currentStep: number, completed: boolean = false): void {
    const stepsContainer = document.getElementById(stepsContainerId);
    const progressIndicator = document.getElementById(progressIndicatorId);
    if (!stepsContainer || !progressIndicator) return;

    const steps = stepsContainer.querySelectorAll<HTMLElement>('.transcription-step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNumber < currentStep || (stepNumber === currentStep && completed)) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep && !completed) {
            step.classList.add('active');
        }
    });

    const progressPercentage = completed ? ((currentStep) / steps.length) * 100 : ((currentStep - 0.5) / steps.length) * 100;
    progressIndicator.style.width = `${Math.min(100, progressPercentage)}%`;
}

/** Atualiza a UI da barra de progresso */
function updateProgressBar(barId: string, percentageId: string, statusId: string, percentage: number, statusText: string): void {
    const bar = document.getElementById(barId);
    const percentEl = document.getElementById(percentageId);
    const statusEl = document.getElementById(statusId);

    if (bar) bar.style.width = `${Math.min(percentage, 100)}%`;
    if (percentEl) percentEl.textContent = `${Math.round(Math.min(percentage, 100))}%`;
    if (statusEl) statusEl.textContent = statusText;
}


// --- View: Processamento (#processing-view) ---

/** Configura a view de processamento de documentos */
function setupProcessing(): void {
    const optionsContainer = document.querySelector<HTMLElement>('#processing-view .document-format-options');
    const startBtn = document.getElementById('startProcessingBtn');
    // O botão viewResultsBtn já é tratado no setupEventListeners global

    if (optionsContainer) {
        optionsContainer.addEventListener('click', (e: MouseEvent) => {
            const option = (e.target as Element)?.closest<HTMLDivElement>('.document-format-option');
            if (option) {
                option.classList.toggle('active');
            }
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (!optionsContainer) return;
            const selectedFormats = Array.from(optionsContainer.querySelectorAll<HTMLDivElement>('.document-format-option.active'))
                .map(el => el.dataset.format as DocumentType)
                .filter(format => format); // Filtra undefined/null

            if (selectedFormats.length === 0) {
                showToast('warning', 'Nenhum Formato', 'Selecione pelo menos um formato para gerar.');
                return;
            }
            if (!state.currentDocumentId) {
                showToast('error', 'Erro', 'Nenhum documento base selecionado para processamento.');
                window.switchView('library');
                return;
            }
            simulateGeneration(selectedFormats);
        });
    }
}

/**
 * Simula a geração dos documentos selecionados.
 * @param formats - Array com os tipos de formato selecionados.
 */
async function simulateGeneration(formats: DocumentType[]): Promise<void> {
    if (state.isProcessing) return;
    setProcessingState(true);
    console.log(`Simulando geração para formatos: ${formats.join(', ')}`);

    const progressContainer = document.getElementById('processingProgress');
    const completedPanel = document.getElementById('processingCompletedPanel');
    const startBtn = document.getElementById('startProcessingBtn');
    const optionsContainer = document.querySelector<HTMLElement>('#processing-view .document-format-options');

    // Esconde botão e opções, mostra progresso
    if (startBtn) startBtn.style.display = 'none';
    if (optionsContainer) optionsContainer.style.display = 'none';
    if (progressContainer) progressContainer.style.display = 'block';

    const totalSteps = formats.length;
    let currentStep = 0;
    const stepDuration = 1500; // Duração por formato

    for (const format of formats) {
        currentStep++;
        const statusText = `Gerando ${format.charAt(0).toUpperCase() + format.slice(1)}... (${currentStep}/${totalSteps})`;
        const percentage = (currentStep / totalSteps) * 100;
        updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', percentage, statusText);

        // Simula tempo de geração
        await new Promise(resolve => setTimeout(resolve, stepDuration));

        // Adiciona o documento gerado ao estado (simulação)
        // Em um app real, aqui ocorreria a chamada API e a resposta traria o conteúdo
        // Por ora, usamos o conteúdo de exemplo já no state
        addGeneratedDocument(format);
    }

    updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', 100, 'Concluído');

    // Esconde progresso, mostra painel de conclusão
    if (progressContainer) progressContainer.style.display = 'none';
    if (completedPanel) {
        completedPanel.classList.add('active');
        completedPanel.style.display = 'flex';
    }

    setProcessingState(false);
    console.log("Geração de documentos concluída.");
}

/** Adiciona um documento gerado (VINTRA, SOAP, etc.) à lista */
function addGeneratedDocument(formatType: DocumentType): void {
    const baseDoc = state.documents.find(d => d.id === state.currentDocumentId);
    if (!baseDoc) {
        console.error("Documento base não encontrado para gerar formato:", formatType);
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const baseTitle = baseDoc.title.replace(/\.(txt|mp3|wav|m4a)$/i, '');
    const newId = `doc${Date.now()}_${formatType}`; // ID mais específico

    let icon = 'fas fa-file-medical-alt';
    let color = 'var(--gray-600)';
    switch(formatType) {
        case 'vintra': icon = 'fas fa-clipboard-list'; color = 'var(--accent)'; break;
        case 'soap': icon = 'fas fa-notes-medical'; color = 'var(--success)'; break;
        case 'ipissima': icon = 'fas fa-comment-dots'; color = 'var(--accent-pink)'; break;
        case 'narrative': icon = 'fas fa-book-open'; color = 'var(--warning-yellow)'; break;
        case 'orientacoes': icon = 'fas fa-list-check'; color = '#8B5CF6'; break;
    }

    // Pega o conteúdo (de exemplo) do estado
    const content = getDocumentContent(formatType);
    if (content === null) {
        console.error(`Conteúdo de exemplo para '${formatType}' não encontrado.`);
        // Poderia criar um documento vazio ou com placeholder
        return;
    }
    const contentSize = (content.length / 1024).toFixed(1);

    const newDoc: DocumentMetadata = {
        id: newId,
        patientId: baseDoc.patientId,
        title: `${formatType.toUpperCase()}_${baseTitle}.txt`,
        type: formatType,
        date: dateStr,
        time: timeStr,
        icon: icon,
        color: color,
        size: `${contentSize} KB`
    };

    // Evita adicionar duplicatas exatas (mesmo ID)
     if (!state.documents.some(doc => doc.id === newId)) {
        state.documents.push(newDoc);
        console.log(`Novo documento gerado (${formatType}) adicionado:`, newDoc);

        // Atualiza UI relevante
        if (state.currentView === 'library') {
            renderDocumentLibrary();
        }
        if (state.currentView === 'patient' && state.activePatientTab === 'repository-panel') {
            renderPatientDocuments();
        }
        // Se a view de resultados estiver ativa, potencialmente atualizar as abas/conteúdo
        if (state.currentView === 'results') {
            // Poderia adicionar a tab dinamicamente ou apenas atualizar o conteúdo se a tab já existir
            // Por simplicidade, vamos assumir que as tabs são fixas e o conteúdo será atualizado quando a tab for clicada
        }
    } else {
         console.warn(`Documento com ID ${newId} já existe. Geração ignorada.`);
    }
}

/** Inicia o fluxo de processamento a partir de um documento da biblioteca */
function startProcessingDocument(docId: string): void {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado.');
        return;
    }

    if (doc.type !== 'audio' && doc.type !== 'transcription') {
        showToast('info', 'Não Processável', `Documentos do tipo '${doc.type}' não podem ser usados para gerar formatos VINTRA.`);
        return;
    }

    console.log(`Iniciando fluxo de processamento para: ${doc.title}`);
    state.currentDocumentId = docId; // Define como documento base

    // Atualiza o título na view de processamento
    const titleElement = document.getElementById('processingDocumentTitle');
    if (titleElement) {
        titleElement.textContent = escapeHtml(doc.title);
    }

    // Reseta a UI da view de processamento
    const optionsContainer = document.querySelector<HTMLElement>('#processing-view .document-format-options');
    const startBtn = document.getElementById('startProcessingBtn');
    const progressContainer = document.getElementById('processingProgress');
    const completedPanel = document.getElementById('processingCompletedPanel');

    if(optionsContainer) {
        optionsContainer.style.display = 'flex';
        // Reseta seleção (deixa VINTRA e SOAP ativos por padrão, por exemplo)
        optionsContainer.querySelectorAll<HTMLDivElement>('.document-format-option').forEach(opt => {
            const format = opt.dataset.format;
            opt.classList.toggle('active', format === 'vintra' || format === 'soap');
        });
    }
    if(startBtn) startBtn.style.display = 'inline-flex';
    if(progressContainer) progressContainer.style.display = 'none';
    if(completedPanel) completedPanel.style.display = 'none';

    window.switchView('processing');
}


// --- View: Resultados (#results-view) ---

/** Configura a view de resultados */
function setupResultsView(): void {
    const tabsContainer = document.querySelector<HTMLElement>('#results-view .document-tabs');
    const downloadBtn = document.getElementById('downloadResultsBtn');
    const editBtn = document.getElementById('editResultBtn'); // Botão Editar na toolbar de resultados

    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e: MouseEvent) => {
            const tab = (e.target as Element)?.closest<HTMLButtonElement>('.document-tab');
            if (tab?.dataset.panel && !tab.classList.contains('active')) {
                activateResultsTab(tab.dataset.panel);
            }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Encontra o documento correspondente à aba ativa
            const activeDocType = state.activeResultsTab.replace('-panel', '') as DocumentType;
            // Assume que o último documento gerado desse tipo é o relevante
            // (Idealmente, a view de resultados estaria ligada a um processamento específico)
            const relevantDoc = state.documents
                                   .filter(d => d.type === activeDocType && d.patientId === state.currentPatientId) // Filtra por tipo e paciente (se houver)
                                   .sort((a, b) => parseDate(b.date, b.time).getTime() - parseDate(a.date, a.time).getTime())[0]; // Pega o mais recente

            if (relevantDoc) {
                downloadDocument(relevantDoc.id);
            } else {
                showToast('warning', 'Download Indisponível', `Não foi possível encontrar o documento '${activeDocType}' para download.`);
            }
        });
    }

     if (editBtn) {
        editBtn.addEventListener('click', () => {
             const activeDocType = state.activeResultsTab.replace('-panel', '') as DocumentType;
             // Encontra o documento mais recente do tipo ativo
             const relevantDoc = state.documents
                                    .filter(d => d.type === activeDocType && d.patientId === state.currentPatientId)
                                    .sort((a, b) => parseDate(b.date, b.time).getTime() - parseDate(a.date, a.time).getTime())[0];

             if (relevantDoc) {
                 editDocument(relevantDoc.id); // Chama a função de edição existente
             } else {
                 showToast('warning', 'Edição Indisponível', `Não foi possível encontrar o documento '${activeDocType}' para edição.`);
             }
        });
     }
}

/** Ativa uma aba específica na view de resultados */
function activateResultsTab(panelId: string): void {
    console.log(`Ativando aba de resultados: ${panelId}`);
    state.activeResultsTab = panelId;

    // Atualiza estilo das abas
    document.querySelectorAll<HTMLButtonElement>('#results-view .document-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panel === panelId);
    });

    // Animação de troca de painéis
    const panelsContainer = document.querySelector<HTMLElement>('#results-view .document-tab-panels');
    const activePanel = document.getElementById(panelId);
    const currentActivePanel = panelsContainer?.querySelector<HTMLElement>('.document-tab-panel.active');

    if (!activePanel) {
        console.error(`Painel de resultados não encontrado: ${panelId}`);
        return;
    }

    // Pega o tipo de documento da aba e busca o conteúdo mais recente
    const docType = panelId.replace('-panel', '') as DocumentType;
    const content = getDocumentContent(docType) ?? `Conteúdo para '${docType}' não disponível.`; // Usará o conteúdo do state (exemplo)

    // Atualiza o conteúdo dentro do painel ativo
    const contentElement = activePanel.querySelector<HTMLDivElement>('.document-view');
    if (contentElement) {
        contentElement.innerHTML = `<pre>${escapeHtml(content)}</pre>`;
    } else {
        console.warn(`Elemento .document-view não encontrado em #${panelId}`);
        // Fallback: Insere estrutura básica se não existir
        activePanel.innerHTML = `<div class="document-content"><div class="document-container"><div class="document-view"><pre>${escapeHtml(content)}</pre></div></div></div>`;
    }

    // Habilita/desabilita botão de edição baseado no tipo
    const editBtn = document.getElementById('editResultBtn');
    if(editBtn) {
        const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(docType);
        (editBtn as HTMLButtonElement).disabled = !isEditable;
        editBtn.style.display = isEditable ? 'inline-flex' : 'none';
    }


    const showActivePanel = () => {
        gsap.set(activePanel, { display: 'block', opacity: 0 });
        activePanel.classList.add('active');
        activePanel.scrollTop = 0;

        gsap.to(activePanel, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.out"
        });
    };

    if (currentActivePanel && currentActivePanel !== activePanel) {
        gsap.to(currentActivePanel, {
            opacity: 0,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
                currentActivePanel.classList.remove('active');
                currentActivePanel.style.display = 'none';
                showActivePanel();
            }
        });
    } else if (!currentActivePanel) {
        showActivePanel();
    }
}


// --- Biblioteca de Documentos ---

/** Configura a interatividade da biblioteca (filtros, busca) */
function setupDocumentLibrary(): void {
    const filtersContainer = document.querySelector<HTMLElement>('#library-view .library-filters');
    const searchInput = document.querySelector<HTMLInputElement>('#library-view .library-search-input');

    if (filtersContainer) {
        filtersContainer.addEventListener('click', (e: MouseEvent) => {
            const filterBtn = (e.target as Element)?.closest<HTMLButtonElement>('.library-filter');
            if (filterBtn && !filterBtn.classList.contains('active')) {
                filtersContainer.querySelector('.library-filter.active')?.classList.remove('active');
                filterBtn.classList.add('active');
                renderDocumentLibrary(filterBtn.dataset.filter || 'all', searchInput?.value || '');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            const activeFilter = filtersContainer?.querySelector('.library-filter.active')?.dataset.filter || 'all';
            renderDocumentLibrary(activeFilter, searchInput.value);
        }, 300));
    }
}

// --- Modo Foco ---

/** Configura o botão de modo foco */
function setupFocusMode(): void {
    document.querySelectorAll<HTMLButtonElement>('.focus-mode-btn').forEach(btn => {
        btn.addEventListener('click', toggleFocusMode);
    });
}

/** Alterna o modo foco */
function toggleFocusMode(): void {
    const body = document.body;
    body.classList.toggle('focus-mode');
    const isFocus = body.classList.contains('focus-mode');
    console.log(`Modo Foco: ${isFocus ? 'Ativado' : 'Desativado'}`);

    document.querySelectorAll<HTMLElement>('.focus-mode-btn i').forEach(icon => {
        icon.className = isFocus ? 'fas fa-compress-alt' : 'fas fa-expand-alt';
    });

    // Opcional: Forçar ajuste de layout (ex: redimensionar gráficos)
    window.dispatchEvent(new Event('resize'));
    showToast('info', `Modo Foco ${isFocus ? 'Ativado' : 'Desativado'}`, isFocus ? 'Elementos da interface foram ocultos.' : 'Interface restaurada.');
}


// --- Notificações Toast ---

/** Mostra uma notificação toast */
function showToast(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, duration: number = 5000): void {
    const container = document.getElementById('toastContainer');
    if (!container) return;

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

    toast.querySelector<HTMLButtonElement>('.toast-close')?.addEventListener('click', () => removeToast(toast));
    container.appendChild(toast);

    gsap.fromTo(toast,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
    );

    setTimeout(() => removeToast(toast), duration);
}

/** Remove um toast específico com animação */
function removeToast(toastElement: HTMLElement): void {
    if (!toastElement?.parentNode) return;

    gsap.to(toastElement, {
        opacity: 0,
        y: 10,
        scale: 0.9,
        duration: 0.3,
        ease: 'power1.in',
        onComplete: () => {
            toastElement.remove();
        }
    });
}


// --- Modal Genérico ---

/** Configura o modal genérico */
function setupGenericModal(): void {
    const modalOverlay = document.getElementById('genericModal');
    const closeBtn = document.getElementById('genericModalClose');
    const cancelBtn = document.getElementById('genericModalCancelBtn'); // Botão padrão "Fechar"

    closeBtn?.addEventListener('click', hideGenericModal);
    cancelBtn?.addEventListener('click', hideGenericModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e: MouseEvent) => {
            if (e.target === modalOverlay) {
                hideGenericModal();
            }
        });
    }
}

/** Mostra o modal genérico com título e conteúdo HTML */
function showGenericModal(title: string, htmlContent: string): void {
    const modal = document.getElementById('genericModal');
    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');

    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = htmlContent; // CUIDADO: Garanta que htmlContent seja seguro

        gsap.set(modal, { display: 'flex', opacity: 0 });
        gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power1.out' });
        gsap.fromTo(modal.querySelector('.modal-container'),
            { scale: 0.95, y: 10 },
            { scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
    } else {
        console.error("Elementos do modal genérico não encontrados.");
    }
}

/** Esconde o modal genérico */
function hideGenericModal(): void {
    const modal = document.getElementById('genericModal');
    if (modal?.style.display !== 'none') {
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in',
            onComplete: () => {
                if(modal) modal.style.display = 'none';
                const modalBody = document.getElementById('genericModalBody');
                if (modalBody) modalBody.innerHTML = '';
            }
        });
    }
}


// --- Utilitários ---

/** Debounce: Atraso na execução de uma função */
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    return function executedFunction(...args: Parameters<T>): void {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(later, wait);
    };
}

/** Escapa HTML para prevenir XSS */
function escapeHtml(unsafe: any): string {
    if (typeof unsafe !== 'string') {
        try {
            unsafe = String(unsafe);
        } catch (e) {
            return '';
        }
    }
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/** Converte string de data "dd/mm/yyyy" e opcionalmente hora "HH:MM" para objeto Date */
function parseDate(dateStr: string, timeStr?: string | null): Date {
    const parts = dateStr.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexado
    const year = parseInt(parts[2], 10);

    let hour = 0;
    let minute = 0;
    if (timeStr) {
        const timeParts = timeStr.split(':');
        hour = parseInt(timeParts[0], 10);
        minute = parseInt(timeParts[1], 10);
    }

    // Verifica se as partes são válidas antes de criar a data
    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) {
        console.warn(`Data/hora inválida encontrada: ${dateStr} ${timeStr || ''}. Retornando data atual.`);
        return new Date(); // Retorna data atual como fallback
    }

    return new Date(year, month, day, hour, minute);
}


// --- Funções de Ação Pós-Processamento (Exemplo) ---

/** Ação: Visualizar transcrição recém-processada na biblioteca */
function viewTranscription(): void {
    if (!state.currentDocumentId) {
        showToast('warning', 'Nenhum Documento', 'Nenhum documento de transcrição ativo para visualizar.');
        window.switchView('library');
        return;
    }
    const doc = state.documents.find(d => d.id === state.currentDocumentId && d.type === 'transcription');
    if (doc) {
        window.switchView('library');
        setTimeout(() => {
            setActiveDocumentItem(doc.id);
            viewDocumentInWorkspace(doc.id);
        }, 400); // Atraso para renderização da view
    } else {
        showToast('error', 'Erro', 'Transcrição não encontrada na biblioteca.');
        window.switchView('library');
    }
}

/** Ação: Ir para a view de processamento com a transcrição atual */
function processTranscription(): void {
    if (!state.currentDocumentId) {
        showToast('warning', 'Nenhum Documento', 'Nenhum documento de transcrição ativo para processar.');
        window.switchView('library');
        return;
    }
    const doc = state.documents.find(d => d.id === state.currentDocumentId && d.type === 'transcription');
    if (doc) {
        startProcessingDocument(doc.id); // Inicia fluxo de processamento
    } else {
        showToast('error', 'Erro', 'Documento de transcrição não encontrado para processar.');
        window.switchView('library');
    }
}
