/**
 * VINTRA - Análise Dimensional Clínica
 * Script principal refatorado (v4 - Foco em Fluxo e Lógica)
 */

// --- Estado Global ---
const state = {
    currentView: null, // ID da view ativa (ex: 'dashboard', 'library')
    currentPatientId: null, // ID do paciente ativo
    currentDocumentId: null, // ID do documento ativo na biblioteca/processamento
    currentDocumentType: null, // Tipo do documento ativo (para edição/resultados)
    activePatientTab: 'summary-panel', // Aba ativa no painel do paciente
    activeDimensionalView: 'radar', // Visualização ativa no modal dimensional
    activeNewDocumentTab: 'record', // Aba ativa na view 'Novo Documento'
    activeResultsTab: 'transcription-panel', // Aba ativa na view 'Resultados'
    isProcessing: false, // Flag geral para indicar processamento em andamento
    isRecording: false, // Flag para indicar gravação de áudio
    recordingStartTime: null,
    recordingInterval: null,
    audioContext: null,
    analyser: null,
    visualizerSource: null,
    visualizerRafId: null,
    mediaRecorder: null,
    audioChunks: [],
    uploadedFile: null, // Objeto File do último upload
    processedAudioBlob: null, // Blob do áudio gravado (simulado)
    // Dados de exemplo (manter ou carregar de API)
    dimensionalData: {
        emocional: { valencia: -2.5, excitacao: 7.0, dominancia: 3.0, intensidade: 8.0 },
        cognitiva: { complexidade: 6.0, coerencia: 5.0, flexibilidade: 4.0, dissonancia: 7.0 },
        autonomia: { perspectivaTemporal: { passado: 7.0, presente: 3.0, futuro: 2.0, media: 4.0 }, autocontrole: 4.0 }
    },
    documents: [], // Array para armazenar metadados dos documentos
    recentPatients: [], // Array para armazenar dados dos pacientes
    // Conteúdo de exemplo (idealmente viria do backend ou seria gerado)
    transcriptionText: `Entrevista Clínica - 04 de Abril de 2025\nMédico: Bom dia, Maria. Como você está se sentindo hoje?\nPaciente: Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar. (Suspira) É difícil manter a esperança.\nMédico: Entendo que seja difícil, Maria. Vamos conversar sobre isso. Além da dor física, como está o seu ânimo?\nPaciente: Péssimo. Me sinto desanimada, sem vontade de fazer nada. Até as coisas que eu gostava perderam a graça. Parece que estou carregando um peso enorme.`,
    vintraText: `# Análise VINTRA - Maria Silva (04/04/2025)\n\n## Dimensões Emocionais\n- Valência (v₁): -2.5 (Negativa)\n- Excitação (v₂): 7.0 (Alta)\n- Dominância (v₃): 3.0 (Baixa)\n- Intensidade (v₄): 8.0 (Alta)\n\n## Dimensões Cognitivas\n- Complexidade (v₅): 6.0 (Moderada)\n- Coerência (v₆): 5.0 (Moderada)\n- Flexibilidade (v₇): 4.0 (Baixa)\n- Dissonância (v₈): 7.0 (Alta)\n\n## Dimensões de Autonomia\n- Perspectiva Temporal (v₉): Média 4.0 (Foco no Passado/Presente)\n- Autocontrole (v₁₀): 4.0 (Baixo)\n\n## Observações\nPaciente demonstra humor deprimido, anedonia e baixa percepção de controle sobre a situação. Alta intensidade emocional e excitação, possivelmente ligadas à ansiedade e frustração. Dificuldade em vislumbrar futuro positivo.`,
    soapText: `# Nota SOAP - Maria Silva (04/04/2025)\n\n## S (Subjetivo)\nPaciente relata persistência da dor ("não adianta muito"), sono de má qualidade ("durmo mal, acordo cansada"), desânimo ("péssimo", "sem vontade de fazer nada"), anedonia ("coisas que eu gostava perderam a graça") e desesperança ("acho que nunca vou melhorar"). Refere sentir como se estivesse "carregando um peso enorme".\n\n## O (Objetivo)\nApresenta-se com fácies de tristeza, discurso lentificado por vezes, suspiros frequentes. Afeto predominantemente disfórico. Nega ideação suicida ativa no momento, mas expressa desesperança.\n\n## A (Avaliação)\nQuadro compatível com Transtorno Depressivo Maior, possivelmente comórbido com quadro álgico crônico. Sintomas de humor deprimido, anedonia, alterações de sono, fadiga, sentimentos de desesperança e baixa percepção de autoeficácia são evidentes. A dor crônica parece exacerbar os sintomas depressivos e vice-versa. Risco de cronificação do quadro depressivo.\n\n## P (Plano)\n- Manter/ajustar medicação antidepressiva (a ser avaliado).\n- Encaminhar para psicoterapia com foco em TCC para depressão e manejo da dor crônica.\n- Avaliar introdução de psicoeducação sobre a relação dor-humor.\n- Monitorar ideação suicida e desesperança em próximas consultas.\n- Considerar avaliação complementar para o quadro álgico, se ainda não realizada.\n- Agendar retorno em 2 semanas.`,
    ipissimaText: `# Ipíssima Narrativa - Maria Silva (04/04/2025)\n\nEu não aguento mais essa dor, parece que ela toma conta de tudo. Tento fazer as coisas, mas o corpo não responde. O desânimo é constante, uma nuvem cinza que não sai de cima de mim. Lembro de quando eu gostava de passear, de conversar... agora? Nada tem cor, nada tem graça. É como se eu estivesse presa, sem conseguir sair desse buraco. Os remédios aliviam um pouco, mas a sensação ruim volta logo. Sinto-me impotente, como se não tivesse controle sobre minha própria vida. O futuro parece assustador, não consigo imaginar como será diferente.`,
    narrativeText: `# Análise Narrativa - Maria Silva (04/04/2025)\n\n## Temas Centrais:\n- Dor crônica e seu impacto incapacitante.\n- Desânimo, anedonia e perda de prazer.\n- Sentimentos de desesperança e impotência.\n- Percepção de falta de controle sobre a própria vida e saúde.\n- Foco temporal predominantemente no presente sofrimento e passado (perda de funcionalidade/prazer).\n\n## Metáforas e Linguagem:\n- "Carregando um peso enorme": Sobrecarga emocional e física.\n- "Nuvem cinza": Humor deprimido persistente.\n- "Presa num buraco": Sensação de aprisionamento na condição atual.\n\n## Implicações:\nA narrativa reflete um ciclo vicioso entre dor física e sofrimento emocional. A falta de perspectiva futura e a sensação de impotência são barreiras significativas para a melhora. A intervenção deve abordar tanto o manejo da dor quanto os sintomas depressivos, focando na reativação comportamental, reestruturação cognitiva (desesperança) e desenvolvimento de estratégias de enfrentamento.`,
    orientacoesText: `# Orientações - Maria Silva (04/04/2025)\n\n1.  **Medicação:** Continue com a medicação conforme prescrito. Anote quaisquer efeitos colaterais ou mudanças na dor/humor.\n2.  **Psicoterapia:** É fundamental iniciar a psicoterapia (Terapia Cognitivo-Comportamental) para aprender estratégias para lidar com a dor e o desânimo. Agende a primeira consulta.\n3.  **Atividade Física Leve:** Tente incorporar pequenas caminhadas (5-10 minutos) em dias que se sentir um pouco melhor. Comece devagar.\n4.  **Higiene do Sono:** Evite telas antes de dormir, tente manter um horário regular para deitar e levantar.\n5.  **Pequenos Prazeres:** Tente se lembrar de uma atividade simples que costumava gostar (ouvir música, tomar sol) e tente praticá-la por alguns minutos, mesmo sem vontade inicial.\n6.  **Rede de Apoio:** Converse com familiares ou amigos de confiança sobre como se sente.\n7.  **Próxima Consulta:** Retorno agendado para dd/mm/aaaa. Traga suas anotações.`
};

// --- Inicialização ---

document.addEventListener('DOMContentLoaded', function() {
    console.log("VINTRA Inicializando...");
    loadDemoData();
    setupEventListeners();
    initCharts(); // Inicializa estruturas de gráficos (serão atualizados quando visíveis)
    initFluidAnimations(); // Configura efeito ripple

    // Estado inicial: Mostrar Splash brevemente, depois Login
    const splashScreen = document.getElementById('splashScreen');
    const loginScreen = document.getElementById('loginScreen');

    if (splashScreen && loginScreen) {
        gsap.set(splashScreen, { display: 'flex', opacity: 1 }); // Garante visibilidade inicial do splash

        // Usando GSAP para a transição Splash -> Login
        gsap.to(splashScreen, {
            opacity: 0,
            duration: 0.5, // Fade out rápido
            delay: 0.7, // Tempo que o splash fica visível
            ease: "power1.inOut",
            onComplete: () => {
                splashScreen.style.display = 'none';
                gsap.set(loginScreen, { display: 'flex', opacity: 0 }); // Prepara login
                loginScreen.classList.add('visible'); // Adiciona classe para estado (se necessário)
                gsap.to(loginScreen, {
                    opacity: 1,
                    duration: 0.5,
                    ease: "power1.out"
                }); // Fade in do login
            }
        });
    } else {
        console.warn("Splash ou Login Screen não encontrados. Exibindo App diretamente.");
        document.getElementById('appContainer').style.display = 'flex';
        switchView('dashboard'); // Fallback
    }
});

/** Configura todos os event listeners da aplicação */
function setupEventListeners() {
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
}

// --- Carregamento de Dados e Renderização Inicial ---

/** Carrega dados de exemplo para demonstração */
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
        { id: 'doc1', patientId: 'patient-1', title: 'Entrevista_Maria.mp3', type: 'audio', date: '25/03/2025', time: '10:30', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '15.3 MB', duration: '28:45' },
        { id: 'doc2', patientId: 'patient-1', title: 'Transcrição_Maria.txt', type: 'transcription', date: '25/03/2025', time: '10:35', icon: 'fas fa-file-alt', color: 'var(--accent)', size: '5 KB' },
        { id: 'doc3', patientId: 'patient-1', title: 'VINTRA_Maria.txt', type: 'vintra', date: '25/03/2025', time: '10:40', icon: 'fas fa-clipboard-list', color: 'var(--accent)', size: '8 KB' },
        { id: 'doc4', patientId: 'patient-1', title: 'SOAP_Maria.txt', type: 'soap', date: '25/03/2025', time: '10:45', icon: 'fas fa-notes-medical', color: 'var(--gray-600)', size: '3 KB' },
        { id: 'doc5', patientId: 'patient-2', title: 'Consulta_Joao.wav', type: 'audio', date: '25/03/2025', time: '11:00', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '22.1 MB', duration: '35:10' },
        { id: 'doc6', patientId: 'patient-2', title: 'Transcricao_Joao.txt', type: 'transcription', date: '25/03/2025', time: '11:05', icon: 'fas fa-file-alt', color: 'var(--accent)', size: '7 KB' },
    ];
    console.log("Dados de demonstração carregados.");
}

/** Renderiza os documentos recentes no dashboard */
function renderRecentDocuments() {
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
            switchView('library');
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
function renderDocumentLibrary(filter = 'all', searchTerm = '') {
    const container = document.getElementById('documentList');
    if (!container) return;
    container.innerHTML = ''; // Limpa

    const normalizedSearch = searchTerm.toLowerCase().trim();
    const filteredDocs = state.documents.filter(doc =>
        (filter === 'all' || doc.type === filter) &&
        (!normalizedSearch || doc.title.toLowerCase().includes(normalizedSearch))
    ).sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))); // Ordena por data desc

    if (filteredDocs.length === 0) {
        container.innerHTML = '<p class="empty-list-message">Nenhum documento encontrado.</p>';
        // Se a biblioteca estiver ativa e vazia, mostra o estado vazio no workspace
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

        // Eventos dos botões de ação (impedem o evento do item)
        item.querySelector('.process-doc')?.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique no botão ative o clique no item
            startProcessingDocument(doc.id);
        });
        item.querySelector('.download-doc').addEventListener('click', (e) => {
            e.stopPropagation();
            downloadDocument(doc.id);
        });

        container.appendChild(item);
    });

    // Mantém o item ativo se ele ainda estiver na lista filtrada
    if (state.currentDocumentId && filteredDocs.some(d => d.id === state.currentDocumentId)) {
        setActiveDocumentItem(state.currentDocumentId);
    } else if (state.currentView === 'library') {
        // Se o item ativo não está mais visível, limpa a seleção e o workspace
        state.currentDocumentId = null;
        showEmptyDocumentView();
    }
}

/** Define o item ativo na lista da biblioteca */
function setActiveDocumentItem(docId) {
    document.querySelectorAll('#documentList .document-item').forEach(item => {
        item.classList.toggle('active', item.dataset.id === docId);
    });
    state.currentDocumentId = docId; // Atualiza o estado
    console.log(`Documento ativo: ${docId}`);
}

/** Visualiza o conteúdo de um documento no painel direito da biblioteca */
function viewDocumentInWorkspace(docId) {
    const doc = state.documents.find(d => d.id === docId);
    const viewContainer = document.getElementById('documentView');
    if (!doc || !viewContainer) {
        showEmptyDocumentView();
        return;
    }

    console.log(`Visualizando documento: ${doc.title} (ID: ${docId}, Tipo: ${doc.type})`);
    const content = getDocumentContent(doc.type) || `Conteúdo para '${doc.type}' não encontrado.`;
    const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);
    const isProcessable = doc.type === 'audio' || doc.type === 'transcription';

    // Limpa container antes de adicionar novo conteúdo
    viewContainer.innerHTML = '';

    // Cria os elementos
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
    const viewElement = contentArea.querySelector('.document-view');

    // Adiciona conteúdo específico
    if (doc.type === 'audio') {
        viewElement.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-volume-up" style="font-size: 3rem; color: var(--text-tertiary); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">Pré-visualização de áudio não disponível.</p>
                <p style="font-size: 0.8rem; color: var(--text-tertiary);">Use o botão 'Processar' para transcrever.</p>
            </div>`;
    } else {
        // Usar <pre> preserva espaços e quebras de linha do texto original
        const pre = document.createElement('pre');
        pre.textContent = content; // textContent é mais seguro que innerHTML para texto puro
        viewElement.appendChild(pre);
    }

    // Adiciona elementos ao container
    viewContainer.appendChild(toolbar);
    viewContainer.appendChild(contentArea);

    // Adiciona listeners aos botões recém-criados
    viewContainer.querySelector('.edit-doc-view')?.addEventListener('click', () => editDocument(docId));
    viewContainer.querySelector('.process-doc-view')?.addEventListener('click', () => startProcessingDocument(docId));
    viewContainer.querySelector('.download-doc-view')?.addEventListener('click', () => downloadDocument(docId));

    // Animação de entrada suave para o conteúdo
    gsap.fromTo(viewContainer, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' });
}


/** Mostra o estado vazio no painel de visualização de documentos */
function showEmptyDocumentView() {
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
    // Adiciona listener ao botão recém-criado
    viewContainer.querySelector('#emptyViewCreateBtn')?.addEventListener('click', () => switchView('new'));
    // Animação de entrada
    gsap.fromTo(viewContainer.querySelector('.document-empty'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' }
    );
}

/** Renderiza documentos no repositório do paciente */
function renderPatientDocuments() {
    const documentsList = document.getElementById('patientDocuments');
    if (!documentsList || !state.currentPatientId) {
        console.warn("Container de documentos do paciente ou ID do paciente não encontrado.");
        if (documentsList) documentsList.innerHTML = '<p class="empty-list-message">Selecione um paciente para ver seus documentos.</p>';
        return;
    }

    documentsList.innerHTML = ''; // Limpa
    const patientDocs = state.documents.filter(doc => doc.patientId === state.currentPatientId)
                                      .sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));

    if (patientDocs.length === 0) {
        documentsList.innerHTML = '<p class="empty-list-message">Nenhum documento encontrado para este paciente.</p>';
        return;
    }

    patientDocs.forEach(doc => {
        const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);
        const item = document.createElement('div');
        item.className = `document-item document-${doc.type}`; // Reutiliza estilo da biblioteca
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

        // Adiciona eventos aos botões de ação
        item.querySelector('.view-doc').addEventListener('click', (e) => { e.stopPropagation(); viewDocument(doc.id); });
        item.querySelector('.edit-doc')?.addEventListener('click', (e) => { e.stopPropagation(); editDocument(doc.id); });
        item.querySelector('.download-doc').addEventListener('click', (e) => { e.stopPropagation(); downloadDocument(doc.id); });

        documentsList.appendChild(item);
    });
}


// --- Animações ---

/** Inicializa animações fluidas (ripple) */
function initFluidAnimations() {
    // Seleciona elementos que terão o efeito ripple
    const rippleElements = document.querySelectorAll(`
        .btn, .toolbar-btn, .library-btn, .recording-btn,
        .patient-tab, .document-format-option, .dimensional-tab,
        .date-nav-btn, .appointment-action, .mobile-menu-item,
        .sidebar-link, .document-item, .patient-card, .library-filter,
        .document-action-btn, .upload-preview-remove, .modal-close,
        .focus-mode-btn
    `);

    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Garante que o ripple só seja adicionado ao elemento principal clicado
            if (e.target.closest(element.tagName) !== element && !element.contains(e.target)) return;
            // Não adiciona ripple a elementos desabilitados
            if (element.disabled || element.classList.contains('disabled')) return;

            // Cria o elemento span do ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Calcula posição e tamanho
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            // Aplica estilos
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Adiciona ao elemento e inicia animação
            element.appendChild(ripple);
            ripple.classList.add('ripple-animation'); // Classe que dispara a animação CSS

            // Remove o ripple após a animação
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
}

// --- Autenticação ---

/** Configura o formulário de login */
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');

    if (!loginForm || !passwordInput || !passwordError || !loginScreen || !appContainer) {
        console.error("Elementos de login não encontrados.");
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário
        const password = passwordInput.value;
        const correctPassword = "123"; // Senha de demonstração

        if (password === correctPassword) {
            passwordError.style.display = 'none'; // Esconde erro
            showToast('success', 'Login bem-sucedido', 'Bem-vindo ao VINTRA!');

            // Animação de saída do login e entrada da aplicação
            gsap.to(loginScreen, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    loginScreen.style.display = 'none';
                    loginScreen.classList.remove('visible');
                    gsap.set(appContainer, { display: 'flex', opacity: 0 }); // Prepara app

                    // Anima a entrada da aplicação
                    gsap.to(appContainer, {
                        opacity: 1,
                        duration: 0.5,
                        ease: "power1.out",
                        onComplete: () => {
                            state.currentView = null; // Força a renderização da view inicial
                            switchView('dashboard'); // Vai para o dashboard
                        }
                    });
                }
            });
        } else {
            passwordError.style.display = 'block'; // Mostra erro
            // Animação de "tremor" para indicar erro
            gsap.fromTo(loginForm, { x: 0 }, { x: 10, duration: 0.05, repeat: 5, yoyo: true, ease: "power1.inOut", clearProps: "x" });
            passwordInput.focus(); // Foca no campo de senha
            passwordInput.select(); // Seleciona o texto para facilitar a redigitação
        }
    });
}

/** Simula o logout do usuário */
function logout() {
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');
    const passwordInput = document.getElementById('password');

    if (!loginScreen || !appContainer || !passwordInput) return;

    showToast('info', 'Logout', 'Você saiu da sua conta.');

    // Animação de saída da aplicação e entrada do login
    gsap.to(appContainer, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
            appContainer.style.display = 'none';
            gsap.set(loginScreen, { display: 'flex', opacity: 0 }); // Prepara login
            loginScreen.classList.add('visible');
            passwordInput.value = ''; // Limpa senha

            // Anima a entrada do login
            gsap.to(loginScreen, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            });
            state.currentView = null; // Reseta a view atual
            state.currentPatientId = null;
            state.currentDocumentId = null;
            closeMobileMenu(); // Fecha o menu mobile se estiver aberto
        }
    });
}

// --- Navegação Principal e Sidebar ---

/** Configura os links de navegação (header, sidebar, mobile) */
function setupNavigation() {
    // Delegação de eventos no body para links de navegação
    document.body.addEventListener('click', (e) => {
        // Encontra o link clicado (ou seu ancestral) que tenha data-target
        const link = e.target.closest('[data-target]');

        if (link && link.dataset.target) {
            const targetView = link.dataset.target;

            // Ações especiais (não são troca de view)
            if (targetView === 'perfil' || targetView === 'preferencias') {
                e.preventDefault();
                showToast('info', 'Funcionalidade Futura', `${targetView.charAt(0).toUpperCase() + targetView.slice(1)} ainda não implementado.`);
                closeMobileMenu();
            }
            // Ação de logout
            else if (targetView === 'sair') {
                e.preventDefault();
                logout();
            }
            // Troca de view normal
            else if (state.currentView !== targetView) {
                e.preventDefault();
                switchView(targetView);
            }
             // Se clicou no link da view atual, apenas fecha o menu mobile (se aberto)
            else {
                 e.preventDefault(); // Evita recarregar a mesma view
                 closeMobileMenu();
            }
        }
    });

    // Botões de logout específicos (se ainda necessários, mas a delegação acima cobre)
    // const logoutBtn = document.getElementById('logoutBtn');
    // const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    // if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
    // if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
}


/** Atualiza o estado ativo dos links de navegação */
function updateNavigation(activeViewId) {
    const allLinks = document.querySelectorAll('.nav-item[data-target], .sidebar-link[data-target], .mobile-menu-item[data-target]');
    allLinks.forEach(link => {
        // Verifica se o link corresponde à view ativa
        const isActive = link.dataset.target === activeViewId;
        link.classList.toggle('active', isActive);
    });
    closeMobileMenu(); // Fecha o menu mobile ao trocar de view
}

/** Configura o toggle da sidebar */
function setupSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.app-sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
            // Opcional: Adicionar/remover classe no body para ajustar o conteúdo principal
            document.body.classList.toggle('sidebar-expanded', sidebar.classList.contains('expanded'));
        });
    }
}

/** Configura o menu mobile */
function setupMobileMenu() {
    const openBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    const menu = document.getElementById('mobileMenu');

    if (!openBtn || !closeBtn || !backdrop || !menu) {
        console.error("Elementos do menu mobile não encontrados.");
        return;
    }

    openBtn.addEventListener('click', openMobileMenu);
    closeBtn.addEventListener('click', closeMobileMenu);
    backdrop.addEventListener('click', closeMobileMenu); // Fecha ao clicar fora
}

/** Abre o menu mobile */
function openMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if (menu && backdrop) {
        backdrop.classList.add('open'); // Mostra o backdrop primeiro
        menu.classList.add('open'); // Desliza o menu
        // Impede o scroll do body enquanto o menu estiver aberto
        document.body.style.overflow = 'hidden';
    }
}

/** Fecha o menu mobile */
function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if (menu && backdrop && menu.classList.contains('open')) { // Só fecha se estiver aberto
        menu.classList.remove('open');
        backdrop.classList.remove('open');
        // Restaura o scroll do body
        document.body.style.overflow = '';
    }
}

// --- Troca de Views ---

/**
 * Alterna entre as views principais da aplicação.
 * @param {string} viewId - O ID da view de destino (sem o sufixo '-view').
 */
window.switchView = function(viewId) {
    const newViewElem = document.getElementById(`${viewId}-view`);
    if (!newViewElem) {
        console.error(`View não encontrada: ${viewId}-view`);
        showToast('error', 'Erro de Navegação', `A view '${viewId}' não existe.`);
        return;
    }

    // Não faz nada se já estiver na view ou se estiver processando algo
    if (state.currentView === viewId) {
        console.log(`Já está na view: ${viewId}`);
        closeMobileMenu(); // Garante que o menu feche
        return;
    }
    if (state.isProcessing) {
        showToast('warning', 'Processo em andamento', 'Por favor, aguarde a conclusão do processo atual.');
        return;
    }

    console.log(`Trocando para view: ${viewId}`);
    const currentViewElem = state.currentView ? document.getElementById(`${state.currentView}-view`) : null;
    // Define o estilo de display correto para a nova view (flex para library e patient)
    const newViewDisplayStyle = (viewId === 'library' || viewId === 'patient') ? 'flex' : 'block';

    // Função para mostrar a nova view com animação
    const showNewView = () => {
        gsap.set(newViewElem, { display: newViewDisplayStyle, opacity: 0, y: 15 }); // Prepara a nova view
        newViewElem.scrollTop = 0; // Garante que a view comece no topo

        gsap.to(newViewElem, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
                // Funções a serem executadas APÓS a view estar visível
                if (viewId === 'patient') {
                    // Garante que a aba e o gráfico sejam atualizados
                    activatePatientTab(state.activePatientTab || 'summary-panel');
                } else if (viewId === 'library') {
                    // Renderiza a biblioteca e o documento ativo (ou vazio)
                    renderDocumentLibrary(); // Renderiza com filtros padrão
                    if (state.currentDocumentId) {
                        viewDocumentInWorkspace(state.currentDocumentId);
                    } else {
                        showEmptyDocumentView();
                    }
                } else if (viewId === 'dashboard') {
                    renderRecentDocuments(); // Atualiza documentos recentes
                }
                 // Adicione outras lógicas de inicialização de view aqui
            }
        });

        state.currentView = viewId; // Atualiza o estado
        updateNavigation(viewId); // Atualiza links de navegação
    };

    // Esconde a view atual (se existir) antes de mostrar a nova
    if (currentViewElem) {
        gsap.to(currentViewElem, {
            opacity: 0,
            y: -15,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                currentViewElem.style.display = 'none'; // Esconde completamente
                currentViewElem.style.transform = ''; // Limpa transform
                showNewView(); // Mostra a nova view
            }
        });
    } else {
        // Se não houver view atual (primeira carga após login), apenas mostra a nova
        showNewView();
    }
};


// --- Painel do Paciente (#patient-view) ---

/** Abre o painel de um paciente específico */
function openPatientPanel(patientId) {
    const patient = state.recentPatients.find(p => p.id === patientId);
    if (!patient) {
        showToast('error', 'Erro', 'Paciente não encontrado.');
        return;
    }
    console.log(`Abrindo painel para paciente: ${patient.name} (ID: ${patientId})`);
    state.currentPatientId = patientId;

    // Atualiza informações no header do paciente
    const nameElem = document.querySelector('#patient-view .patient-name');
    const detailsElem = document.querySelector('#patient-view .patient-details');
    if (nameElem) nameElem.textContent = escapeHtml(patient.name);
    if (detailsElem) detailsElem.textContent = `${escapeHtml(String(patient.age))} anos • ${escapeHtml(patient.gender)} • Prontuário #${escapeHtml(patientId.replace('patient-', ''))}`;

    // Define a aba padrão e troca para a view do paciente
    state.activePatientTab = 'summary-panel'; // Sempre começa no resumo
    switchView('patient');
    // A ativação da tab e atualização do gráfico ocorrerá no onComplete do switchView
}

/** Configura as abas do painel de paciente */
function setupPatientTabs() {
    const tabsContainer = document.querySelector('#patient-view .patient-tabs');
    if (!tabsContainer) return;

    tabsContainer.addEventListener('click', function(e) {
        const tab = e.target.closest('.patient-tab');
        if (tab && tab.dataset.panel && !tab.classList.contains('active')) { // Só ativa se não for a ativa
            activatePatientTab(tab.dataset.panel);
        }
    });
}

/** Ativa uma aba específica no painel do paciente */
function activatePatientTab(panelId) {
    if (!state.currentPatientId) return; // Precisa de um paciente ativo
    console.log(`Ativando aba do paciente: ${panelId}`);
    state.activePatientTab = panelId; // Atualiza estado

    // Atualiza estilo das abas
    document.querySelectorAll('#patient-view .patient-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panel === panelId);
    });

    // Animação de troca de painéis
    const panelsContainer = document.querySelector('#patient-view .patient-tab-panels');
    const activePanel = document.getElementById(panelId);
    const currentActivePanel = panelsContainer?.querySelector('.patient-tab-panel.active');

    if (!activePanel) {
        console.error(`Painel não encontrado: ${panelId}`);
        return;
    }

    const showActivePanel = () => {
        gsap.set(activePanel, { display: 'block', opacity: 0 }); // Prepara novo painel
        activePanel.classList.add('active');
        activePanel.scrollTop = 0;

        gsap.to(activePanel, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
            onComplete: () => {
                // Lógica pós-ativação
                if (panelId === 'summary-panel') {
                    updateDimensionalChart(); // Atualiza gráfico do resumo
                } else if (panelId === 'repository-panel') {
                    renderPatientDocuments(); // Renderiza documentos do paciente
                }
                // Adicione outras lógicas aqui (ex: carregar dados da consulta)
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
                currentActivePanel.style.display = 'none'; // Esconde painel anterior
                showActivePanel();
            }
        });
    } else if (!currentActivePanel) {
        // Se nenhum painel estava ativo, apenas mostra o novo
        showActivePanel();
    }
    // Se clicou na aba já ativa, não faz nada (tratado no listener)
}

/** Função para voltar da view do paciente para o dashboard */
function goBack() {
    state.currentPatientId = null; // Limpa o paciente ativo
    switchView('dashboard');
}

// --- Gráficos e Visualizações ---

/** Inicializa instâncias de gráficos (vazias inicialmente) */
function initCharts() {
    window.dimensionalChart = null; // Gráfico no painel do paciente
    window.modalChart = null; // Gráfico no modal
}

/** Atualiza o gráfico radar dimensional no painel do paciente */
function updateDimensionalChart() {
    const chartContainer = document.getElementById('dimensionalRadarChart');
    // Só atualiza se a view e a tab estiverem corretas e o Chart.js carregado
    if (!chartContainer || typeof Chart === 'undefined' || state.currentView !== 'patient' || state.activePatientTab !== 'summary-panel') {
        return;
    }
    console.log("Atualizando gráfico dimensional do paciente...");

    // Destroi gráfico anterior se existir
    if (window.dimensionalChart instanceof Chart) {
        window.dimensionalChart.destroy();
    }

    // TODO: Obter dados reais do paciente state.currentPatientId
    const patientData = state.dimensionalData; // Usando dados de exemplo por enquanto

    const data = {
        labels: [
            'Valência', 'Excitação', 'Dominância', 'Intensidade', // Emocional
            'Complexidade', 'Coerência', 'Flexibilidade', 'Dissonância', // Cognitiva
            'Persp. Temporal', 'Autocontrole' // Autonomia
        ],
        datasets: [{
            label: `Paciente #${state.currentPatientId?.replace('patient-','') || 'N/A'}`,
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
                suggestedMin: -10, // Ajuste conforme a escala das dimensões
                suggestedMax: 10,
                ticks: {
                    stepSize: 2, // Intervalo dos ticks
                    backdropColor: 'rgba(255, 255, 255, 0.75)', // Fundo para melhor leitura
                    color: 'rgba(0, 0, 0, 0.6)'
                 }
            }
        },
        plugins: { legend: { display: false } } // Esconde legenda padrão
    };

    // Cria o novo gráfico
    try {
        window.dimensionalChart = new Chart(chartContainer.getContext('2d'), { type: 'radar', data: data, options: options });
    } catch (error) {
        console.error("Erro ao criar gráfico dimensional do paciente:", error);
        showToast('error', 'Erro no Gráfico', 'Não foi possível exibir a análise dimensional.');
    }
}


/** Configura a visualização dimensional modal */
function setupDimensionalVisualizations() {
    const openModalBtn = document.querySelector('.activate-dimensional-space'); // Botão no header
    const openModalBtnPatient = document.querySelector('#patient-view .dimensional-summary .btn'); // Botão no painel do paciente
    const modalOverlay = document.getElementById('dimensionalModal');
    const closeBtn = document.getElementById('dimensionalModalClose');
    const tabsContainer = modalOverlay?.querySelector('.dimensional-tabs');

    if (openModalBtn) openModalBtn.addEventListener('click', showDimensionalModal);
    if (openModalBtnPatient) openModalBtnPatient.addEventListener('click', showDimensionalModal);
    if (closeBtn) closeBtn.addEventListener('click', hideDimensionalModal);
    if (modalOverlay) {
        // Fecha ao clicar fora do container
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                hideDimensionalModal();
            }
        });
    }
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.dimensional-tab');
            if (tab && tab.dataset.view && !tab.classList.contains('active')) {
                activateDimensionalView(tab.dataset.view);
            }
        });
    }
}

/** Mostra o modal de visualização dimensional */
function showDimensionalModal() {
    const modal = document.getElementById('dimensionalModal');
    if (modal) {
        console.log("Mostrando modal dimensional");
        gsap.set(modal, { display: 'flex', opacity: 0 }); // Prepara modal
        gsap.to(modal, {
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out',
            onComplete: () => {
                // Ativa a view padrão (radar) e atualiza o gráfico
                activateDimensionalView('radar');
            }
        });
        // Animação do container (opcional)
        gsap.fromTo(modal.querySelector('.modal-container'),
            { scale: 0.95, y: 10 },
            { scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
    }
}

/** Esconde o modal de visualização dimensional */
function hideDimensionalModal() {
    const modal = document.getElementById('dimensionalModal');
    if (modal) {
        console.log("Escondendo modal dimensional");
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in',
            onComplete: () => {
                modal.style.display = 'none';
                // Destroi o gráfico do modal para liberar memória
                if (window.modalChart instanceof Chart) {
                    window.modalChart.destroy();
                    window.modalChart = null;
                }
            }
        });
    }
}

/** Ativa uma visualização dimensional específica dentro do modal */
function activateDimensionalView(viewType) {
    const modal = document.getElementById('dimensionalModal');
    if (!modal || modal.style.display === 'none') return; // Só ativa se modal estiver visível

    console.log(`Ativando visualização dimensional: ${viewType}`);
    state.activeDimensionalView = viewType;

    // Atualiza estilo das abas
    modal.querySelectorAll('.dimensional-tabs .dimensional-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === viewType);
    });

    // Animação de troca de painéis de visualização
    const panelsContainer = modal.querySelector('.dimensional-views');
    const activePanel = document.getElementById(`${viewType}-view`);
    const currentActivePanel = panelsContainer?.querySelector('.dimensional-view.active');

    if (!activePanel) {
        console.error(`Painel de visualização não encontrado: ${viewType}-view`);
        return;
    }

    const showActivePanel = () => {
        gsap.set(activePanel, { display: 'flex', opacity: 0 }); // Prepara novo painel
        activePanel.classList.add('active');

        gsap.to(activePanel, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.out",
            onComplete: () => {
                // Atualiza o gráfico se for a view de radar
                if (viewType === 'radar') {
                    updateModalDimensionalChart();
                }
                // Adicionar lógica para outras visualizações (trajectory, topological)
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
function updateModalDimensionalChart() {
    const chartContainer = document.getElementById('modalRadarChart');
    const modal = document.getElementById('dimensionalModal');
    // Só atualiza se o container existir, Chart.js carregado e modal visível
    if (!chartContainer || typeof Chart === 'undefined' || !modal || modal.style.display === 'none') {
        return;
    }
    console.log("Atualizando gráfico dimensional do modal...");

    if (window.modalChart instanceof Chart) {
        window.modalChart.destroy();
    }

    // TODO: Usar dados relevantes (do paciente atual ou dados gerais)
    const modalData = state.dimensionalData; // Usando dados de exemplo

    const data = {
        labels: [ /* Mesmos labels do gráfico do paciente */
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
    const options = { /* Mesmas opções do gráfico do paciente */
        responsive: true,
        maintainAspectRatio: false,
        elements: { line: { borderWidth: 2 } },
        scales: { r: { angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' }, grid: { color: 'rgba(0, 0, 0, 0.1)' }, pointLabels: { font: { size: 11 } }, suggestedMin: -10, suggestedMax: 10, ticks: { stepSize: 2, backdropColor: 'rgba(255, 255, 255, 0.75)', color: 'rgba(0, 0, 0, 0.6)' } } },
        plugins: { legend: { display: true, position: 'top' } } // Mostra legenda no modal
    };

    try {
        window.modalChart = new Chart(chartContainer.getContext('2d'), { type: 'radar', data: data, options: options });
    } catch (error) {
        console.error("Erro ao criar gráfico dimensional do modal:", error);
        showToast('error', 'Erro no Gráfico', 'Não foi possível exibir a análise dimensional no modal.');
    }
}


// --- Edição de Documentos ---

/** Configura o sistema de edição de documentos (Modal) */
function setupDocumentEditing() {
    const modalOverlay = document.getElementById('editDocumentModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editModalClose = document.getElementById('editModalClose');

    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeDocumentEditor);
    if (saveEditBtn) saveEditBtn.addEventListener('click', saveDocumentEdit);
    if (editModalClose) editModalClose.addEventListener('click', closeDocumentEditor);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeDocumentEditor(); // Fecha se clicar fora
            }
        });
    }
}

/** Abre o editor de documentos (Modal) */
function openDocumentEditor(docType, title, content) {
    console.log(`Abrindo editor para: ${title} (Tipo: ${docType})`);
    state.currentDocumentType = docType; // Guarda o tipo para salvar

    const modal = document.getElementById('editDocumentModal');
    const modalTitle = document.getElementById('editModalTitle');
    const editor = document.getElementById('documentEditor');

    if (modal && modalTitle && editor) {
        modalTitle.textContent = title;
        editor.value = content; // Preenche com conteúdo atual

        // Mostra o modal com animação
        gsap.set(modal, { display: 'flex', opacity: 0 });
        gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power1.out' });
        gsap.fromTo(modal.querySelector('.modal-container'),
            { scale: 0.95, y: 10 },
            { scale: 1, y: 0, duration: 0.4, ease: 'power2.out', onComplete: () => editor.focus() } // Foca no editor
        );
    } else {
        console.error("Elementos do modal de edição não encontrados.");
    }
}

/** Fecha o editor de documentos (Modal) */
function closeDocumentEditor() {
    const modal = document.getElementById('editDocumentModal');
    if (modal && modal.style.display !== 'none') {
        console.log("Fechando editor de documento.");
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in',
            onComplete: () => {
                modal.style.display = 'none';
                // Limpa o editor para a próxima vez
                const editor = document.getElementById('documentEditor');
                if (editor) editor.value = '';
                state.currentDocumentType = null; // Limpa tipo ao fechar
            }
        });
    }
}

/** Salva as edições feitas no documento (Modal) */
function saveDocumentEdit() {
    const editor = document.getElementById('documentEditor');
    if (!editor || !state.currentDocumentType || !state.currentDocumentId) {
        console.error("Não é possível salvar: editor, tipo ou ID do documento ausente.");
        showToast('error', 'Erro ao Salvar', 'Não foi possível identificar o documento a ser salvo.');
        return;
    }

    const newContent = editor.value;
    const docKey = `${state.currentDocumentType}Text`; // Chave no objeto state (ex: 'vintraText')

    console.log(`Salvando documento: ID ${state.currentDocumentId}, Tipo ${state.currentDocumentType}`);

    // Atualiza o conteúdo no estado global (simulação)
    // Em uma app real, isso seria uma chamada API POST/PUT
    if (state.hasOwnProperty(docKey)) {
        state[docKey] = newContent;
        console.log(`Conteúdo para ${docKey} atualizado no estado.`);

        // Atualiza a visualização no workspace se o documento editado estiver visível
        if (state.currentView === 'library' && document.getElementById('documentView').querySelector(`[data-id="${state.currentDocumentId}"]`)) {
             viewDocumentInWorkspace(state.currentDocumentId);
        }
         // Atualiza a visualização na aba de resultados se estiver visível
        else if (state.currentView === 'results' && state.activeResultsTab === `${state.currentDocumentType}-panel`) {
             const contentElement = document.getElementById(`${state.currentDocumentType}ResultContent`) || document.getElementById(`${state.currentDocumentType}Content`);
             if(contentElement) {
                contentElement.innerHTML = `<pre>${escapeHtml(newContent)}</pre>`;
             }
        }
        // Adicionar lógica para atualizar na aba do paciente se necessário

        showToast('success', 'Documento Salvo', `Alterações em '${state.currentDocumentType}' foram salvas.`);
        closeDocumentEditor(); // Fecha o modal após salvar
    } else {
        console.error(`Chave de estado inválida para salvar: ${docKey}`);
        showToast('error', 'Erro ao Salvar', 'Tipo de documento inválido.');
    }
}


// --- Ações de Documento (Visualizar, Editar, Download) ---

/** Visualiza um documento (mostra em modal genérico) */
function viewDocument(docId) {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado.');
        return;
    }

    console.log(`Visualizando (modal genérico): ${doc.title}`);
    const content = getDocumentContent(doc.type) || `Conteúdo para '${doc.type}' não disponível.`;

    // Usa <pre> para preservar formatação de texto
    const formattedContent = `<pre style="white-space: pre-wrap; word-wrap: break-word; font-size: 0.9rem; max-height: 60vh; overflow-y: auto;">${escapeHtml(content)}</pre>`;
    showGenericModal(`Visualizar: ${escapeHtml(doc.title)}`, formattedContent);
}

/** Abre um documento para edição (chamando o modal de edição) */
function editDocument(docId) {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado.');
        return;
    }

    // Verifica se o tipo de documento é editável
    if (['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type)) {
        const content = getDocumentContent(doc.type);
        state.currentDocumentId = docId; // Define o ID do documento que está sendo editado
        openDocumentEditor(doc.type, `Editar ${escapeHtml(doc.title)}`, content);
    } else {
        showToast('info', 'Não Editável', `Documentos do tipo '${doc.type}' não podem ser editados diretamente.`);
    }
}

/** Realiza o download de um documento */
function downloadDocument(docId) {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado.');
        return;
    }

    console.log(`Iniciando download de: ${doc.title}`);

    let blob;
    let filename = doc.title.includes('.') ? doc.title : `${doc.title}.txt`; // Adiciona .txt se não houver extensão

    if (doc.type === 'audio') {
        // Simulação: Cria um blob vazio ou usa state.processedAudioBlob se existir
        if (state.processedAudioBlob) {
             blob = state.processedAudioBlob;
             // Garante que o nome do arquivo tenha a extensão correta (ex: .wav, .mp3)
             if (!filename.match(/\.(wav|mp3|ogg|m4a)$/i)) {
                filename = filename.replace(/\.[^/.]+$/, "") + ".wav"; // Assume .wav como padrão
             }
        } else {
            blob = new Blob(["Simulação de conteúdo de áudio."], { type: 'audio/wav' }); // Placeholder
            showToast('info', 'Download Simulado', 'Este é um arquivo de áudio simulado.');
             if (!filename.match(/\.(wav|mp3|ogg|m4a)$/i)) {
                 filename = filename.replace(/\.[^/.]+$/, "") + ".wav";
             }
        }
    } else {
        // Para tipos de texto, obtém o conteúdo do estado
        const content = getDocumentContent(doc.type) || `Conteúdo para '${doc.type}' não encontrado.`;
        blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    }

    // Cria link temporário para download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // Necessário para Firefox
    a.click();

    // Limpa o link temporário
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('success', 'Download Iniciado', `${filename} está sendo baixado.`);
    }, 100);
}

/** Obtém o conteúdo de um documento do estado global com base no tipo */
function getDocumentContent(type) {
    const key = `${type}Text`; // Ex: 'vintraText', 'soapText'
    if (state.hasOwnProperty(key)) {
        return state[key];
    }
    console.warn(`Conteúdo para o tipo '${type}' não encontrado no estado.`);
    return `[Conteúdo para ${type} não disponível]`;
}


// --- View: Novo Documento (#new-view) ---

/** Configura as abas da view "Novo Documento" */
function setupNewDocumentTabs() {
    const tabsContainer = document.querySelector('#new-view .library-filters'); // Reutiliza estilo
    const contentContainer = document.getElementById('newDocumentContent');

    if (!tabsContainer || !contentContainer) {
        console.error("Elementos das abas de 'Novo Documento' não encontrados.");
        return;
    }

    tabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.library-filter');
        if (tab && tab.dataset.newTab && !tab.classList.contains('active')) {
            const targetTabId = tab.dataset.newTab;
            activateNewDocumentTab(targetTabId);
        }
    });

    // Garante que apenas a aba inicial esteja visível
    activateNewDocumentTab(state.activeNewDocumentTab); // Ativa a aba padrão inicial
}

/** Ativa uma aba específica na view "Novo Documento" */
function activateNewDocumentTab(tabId) {
    console.log(`Ativando aba Novo Documento: ${tabId}`);
    state.activeNewDocumentTab = tabId;
    const tabsContainer = document.querySelector('#new-view .library-filters');
    const contentContainer = document.getElementById('newDocumentContent');
    if (!tabsContainer || !contentContainer) return;

    // Atualiza estilo das abas
    tabsContainer.querySelectorAll('.library-filter').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.newTab === tabId);
    });

    // Animação de troca de painéis
    const activePanel = document.getElementById(`${tabId}-tab`);
    const currentActivePanel = contentContainer.querySelector(':scope > div.active'); // Seleciona painel ativo direto

    if (!activePanel) {
        console.error(`Painel não encontrado: ${tabId}-tab`);
        return;
    }

    const showActivePanel = () => {
        gsap.set(activePanel, { display: 'block', opacity: 0 }); // Prepara novo painel
        activePanel.classList.add('active');
        activePanel.scrollTop = 0;

        gsap.to(activePanel, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.out"
            // Adicionar foco a elemento relevante se necessário (ex: textarea)
            // onComplete: () => { if (tabId === 'transcribe') document.getElementById('transcriptionText')?.focus(); }
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
function setupRecorder() {
    const startBtn = document.getElementById('startRecordingBtn');
    const stopBtn = document.getElementById('stopRecordingBtn');
    // const pauseBtn = document.getElementById('pauseRecordingBtn'); // Pausar/Retomar pode adicionar complexidade
    const removeBtn = document.getElementById('recordingRemoveBtn');
    const processBtn = document.getElementById('processRecordingBtn');

    if (startBtn) startBtn.addEventListener('click', startRecording);
    if (stopBtn) stopBtn.addEventListener('click', stopRecording);
    // if (pauseBtn) pauseBtn.addEventListener('click', togglePauseRecording);
    if (removeBtn) removeBtn.addEventListener('click', resetRecording);
    if (processBtn) processBtn.addEventListener('click', () => {
        // Simula o início do processamento da gravação
        if (state.processedAudioBlob) {
            simulateProcessing('recording'); // Chama a função de simulação
        } else {
            showToast('error', 'Erro', 'Nenhuma gravação para processar.');
        }
    });

    // Inicializa Web Audio API para visualizador (se disponível)
    try {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 256; // Tamanho menor para visualização mais simples
    } catch (e) {
        console.error("Web Audio API não suportada.", e);
        showToast('warning', 'Visualizador Indisponível', 'Seu navegador não suporta a visualização de áudio.');
        // Desabilita visualizador se API não estiver disponível
        const visualizer = document.querySelector('.recording-visualizer');
        if (visualizer) visualizer.style.display = 'none';
    }
}

/** Inicia a gravação de áudio */
async function startRecording() {
    if (state.isRecording || state.isProcessing) return; // Impede múltiplas gravações ou durante processamento

    console.log("Tentando iniciar gravação...");
    // Resetar estado anterior se houver
    resetRecordingVisuals();
    state.audioChunks = [];
    state.processedAudioBlob = null;

    try {
        // Solicita permissão e obtém stream de áudio
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        console.log("Acesso ao microfone concedido.");

        // Configura MediaRecorder
        state.mediaRecorder = new MediaRecorder(stream);
        state.mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                state.audioChunks.push(event.data);
            }
        };

        state.mediaRecorder.onstop = () => {
            console.log("MediaRecorder parado.");
            // Cria o Blob final quando a gravação para
            state.processedAudioBlob = new Blob(state.audioChunks, { type: 'audio/wav' }); // Ou outro tipo como 'audio/webm'
            console.log("Blob de áudio criado:", state.processedAudioBlob);
            state.audioChunks = []; // Limpa chunks

            // Para o stream do microfone
            stream.getTracks().forEach(track => track.stop());
            console.log("Tracks de áudio paradas.");

            // Atualiza UI para mostrar preview e botão de processar
            updateUIAfterRecording();
        };

        // Inicia a gravação
        state.mediaRecorder.start();
        state.isRecording = true;
        state.recordingStartTime = Date.now();
        console.log("MediaRecorder iniciado.");

        // Inicia timer e visualizador
        startTimer();
        if (state.audioContext && state.analyser) {
            // Conecta o stream ao visualizador
            state.visualizerSource = state.audioContext.createMediaStreamSource(stream);
            state.visualizerSource.connect(state.analyser);
            startVisualizer(); // Inicia o loop de desenho do visualizador
            document.querySelector('.recording-visualizer').style.opacity = 1; // Mostra visualizador
        }

        // Atualiza UI para estado de gravação
        updateUIRecordingState(true);
        document.getElementById('recordingStatus').textContent = 'Gravando...';

    } catch (err) {
        console.error("Erro ao iniciar gravação:", err);
        state.isRecording = false;
        updateUIRecordingState(false);
        document.getElementById('recordingStatus').textContent = 'Erro ao iniciar';
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
function stopRecording() {
    if (!state.isRecording || !state.mediaRecorder) return;

    console.log("Parando gravação...");
    try {
        state.mediaRecorder.stop(); // Isso acionará o evento 'onstop'
        state.isRecording = false;
        stopTimer();
        stopVisualizer();
        updateUIRecordingState(false); // Esconde botões de gravação
        document.getElementById('recordingStatus').textContent = 'Processando gravação...'; // Indica que está criando o blob
        // A UI será atualizada completamente no 'onstop'
    } catch (error) {
        console.error("Erro ao parar MediaRecorder:", error);
        // Tenta resetar a UI mesmo em caso de erro
        resetRecording();
        showToast('error', 'Erro ao Parar', 'Não foi possível finalizar a gravação corretamente.');
    }
}

/** Atualiza a interface após a gravação ser finalizada e o blob criado */
function updateUIAfterRecording() {
    console.log("Atualizando UI pós-gravação.");
    const preview = document.getElementById('recordingPreview');
    const fileNameEl = document.getElementById('recordingFileName');
    const fileMetaEl = document.getElementById('recordingFileMeta');
    const processBtn = document.getElementById('processRecordingBtn');

    if (preview && fileNameEl && fileMetaEl && processBtn && state.processedAudioBlob) {
        const duration = (Date.now() - state.recordingStartTime) / 1000;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        const fileSize = (state.processedAudioBlob.size / (1024 * 1024)).toFixed(1); // Em MB

        fileNameEl.textContent = `Gravação_${new Date().toISOString().split('T')[0]}.wav`; // Nome genérico
        fileMetaEl.textContent = `${fileSize} MB • ${formattedDuration}`;

        gsap.to(preview, { display: 'flex', opacity: 1, duration: 0.3 });
        gsap.to(processBtn, { display: 'inline-flex', opacity: 1, duration: 0.3 });
        document.getElementById('recordingStatus').textContent = 'Gravação finalizada';
    } else {
        console.error("Elementos de preview da gravação não encontrados ou blob ausente.");
        resetRecording(); // Reseta se algo deu errado
    }
}


/** Reseta o estado da gravação e a UI */
function resetRecording() {
    console.log("Resetando gravação.");
    if (state.isRecording) {
        stopRecording(); // Tenta parar se ainda estiver gravando
    }
    stopTimer();
    stopVisualizer();
    resetRecordingVisuals();
    state.audioChunks = [];
    state.processedAudioBlob = null;
    state.isRecording = false;
    state.recordingStartTime = null;
    // Garante que o stream seja parado se ainda existir
    if (state.visualizerSource && state.visualizerSource.mediaStream) {
       state.visualizerSource.mediaStream.getTracks().forEach(track => track.stop());
    }
    state.visualizerSource = null;
    state.mediaRecorder = null;
}

/** Reseta apenas os elementos visuais da gravação */
function resetRecordingVisuals() {
    document.getElementById('startRecordingBtn')?.classList.remove('hidden');
    document.getElementById('stopRecordingBtn')?.classList.add('hidden');
    // document.getElementById('pauseRecordingBtn')?.classList.add('hidden');
    document.getElementById('recordingPreview')?.style.display = 'none';
    document.getElementById('processRecordingBtn')?.style.display = 'none';
    document.getElementById('recordingProgress')?.style.display = 'none';
    document.getElementById('transcriptionSteps')?.style.display = 'none';
    document.getElementById('liveTranscriptionPreview')?.style.display = 'none';
    document.getElementById('transcriptionCompletedPanel')?.style.display = 'none';
    document.getElementById('recordingTime').textContent = '00:00:00';
    document.getElementById('recordingStatus').textContent = 'Pronto para gravar';
    document.querySelector('.recording-visualizer').style.opacity = 0.3; // Esmaece visualizador
    const barsContainer = document.getElementById('visualizerBars');
    if (barsContainer) barsContainer.innerHTML = ''; // Limpa barras
}


/** Atualiza a visibilidade dos botões de gravação */
function updateUIRecordingState(isRecording) {
    document.getElementById('startRecordingBtn')?.classList.toggle('hidden', isRecording);
    document.getElementById('stopRecordingBtn')?.classList.toggle('hidden', !isRecording);
    // document.getElementById('pauseRecordingBtn')?.classList.toggle('hidden', !isRecording);
}

/** Inicia o timer da gravação */
function startTimer() {
    clearInterval(state.recordingInterval); // Limpa timer anterior
    const timerElement = document.getElementById('recordingTime');
    state.recordingInterval = setInterval(() => {
        if (!state.recordingStartTime) return;
        const elapsedSeconds = Math.floor((Date.now() - state.recordingStartTime) / 1000);
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

/** Para o timer da gravação */
function stopTimer() {
    clearInterval(state.recordingInterval);
    state.recordingInterval = null;
}

/** Inicia o visualizador de áudio */
function startVisualizer() {
    if (!state.analyser || !state.audioContext || state.audioContext.state === 'suspended') {
        console.warn("AudioContext suspenso ou Analyser não disponível, não iniciando visualizador.");
        return;
    }
     // Garante que o AudioContext seja retomado (necessário em alguns navegadores após interação do usuário)
    if (state.audioContext.state === 'suspended') {
        state.audioContext.resume();
    }

    const visualizerBars = document.getElementById('visualizerBars');
    if (!visualizerBars) return;
    visualizerBars.innerHTML = ''; // Limpa barras antigas

    const bufferLength = state.analyser.frequencyBinCount; // Metade do fftSize
    const dataArray = new Uint8Array(bufferLength);
    const barCount = 30; // Número de barras a serem exibidas

    // Cria as barras
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        visualizerBars.appendChild(bar);
    }
    const bars = visualizerBars.childNodes;

    // Função de desenho que será chamada repetidamente
    const draw = () => {
        if (!state.isRecording && !state.visualizerRafId) return; // Para se não estiver gravando

        state.visualizerRafId = requestAnimationFrame(draw); // Agenda o próximo frame

        state.analyser.getByteFrequencyData(dataArray); // Obtém dados de frequência

        const barHeightMultiplier = visualizerBars.clientHeight / 128; // Mapeia 0-255 para altura

        // Calcula a altura de cada barra (simplificado - média de faixas)
        const step = Math.floor(bufferLength / barCount);
        for (let i = 0; i < barCount; i++) {
            let sum = 0;
            for (let j = 0; j < step; j++) {
                sum += dataArray[i * step + j];
            }
            let avg = sum / step;
            // Limita a altura mínima e máxima para visualização
            let barHeight = Math.max(1, Math.min(avg * barHeightMultiplier * 1.5, visualizerBars.clientHeight));
            if (bars[i]) {
                bars[i].style.height = `${barHeight}px`;
            }
        }
    };

    draw(); // Inicia o loop
}

/** Para o visualizador de áudio */
function stopVisualizer() {
    if (state.visualizerRafId) {
        cancelAnimationFrame(state.visualizerRafId);
        state.visualizerRafId = null;
    }
    // Desconecta a fonte para liberar recursos
    if (state.visualizerSource) {
        state.visualizerSource.disconnect();
        // state.visualizerSource = null; // Mantém a referência caso precise parar o stream associado
    }
     // Esmaece as barras suavemente
    const visualizerBars = document.getElementById('visualizerBars');
    if (visualizerBars) {
        gsap.to(".visualizer-bar", { height: 1, duration: 0.3, ease: 'power1.out', stagger: 0.01 });
    }
    console.log("Visualizador parado.");
}


// --- Upload de Arquivo ---

/** Configura o módulo de upload de arquivos */
function setupUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadInput = document.getElementById('uploadInput');
    const removeBtn = document.getElementById('uploadRemoveBtn');
    const processBtn = document.getElementById('processUploadBtn');

    if (!uploadArea || !uploadInput || !removeBtn || !processBtn) {
        console.error("Elementos de upload não encontrados.");
        return;
    }

    // Abrir seletor de arquivo ao clicar na área
    uploadArea.addEventListener('click', () => uploadInput.click());

    // Eventos de Drag & Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false); // Evita que o navegador abra o arquivo
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
    });

    // Lidar com arquivo solto na área
    uploadArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    }, false);

    // Lidar com arquivo selecionado pelo input
    uploadInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });

    // Botão de remover preview
    removeBtn.addEventListener('click', resetUpload);

    // Botão de processar upload
    processBtn.addEventListener('click', () => {
        if (state.uploadedFile) {
            simulateProcessing('upload'); // Chama a simulação
        } else {
            showToast('error', 'Erro', 'Nenhum arquivo selecionado para processar.');
        }
    });
}

/** Impede comportamentos padrão de drag & drop */
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

/** Lida com os arquivos selecionados/soltos */
function handleFiles(files) {
    if (files.length > 1) {
        showToast('warning', 'Apenas um arquivo', 'Por favor, envie apenas um arquivo por vez.');
        return;
    }
    const file = files[0];
    // TODO: Adicionar validação de tipo de arquivo mais robusta
    console.log("Arquivo selecionado:", file.name, file.size, file.type);

    state.uploadedFile = file; // Armazena o arquivo no estado

    // Atualiza a UI para mostrar o preview
    const preview = document.getElementById('uploadPreview');
    const fileNameEl = document.getElementById('uploadFileName');
    const fileMetaEl = document.getElementById('uploadFileMeta');
    const processBtn = document.getElementById('processUploadBtn');
    const iconEl = preview?.querySelector('.upload-preview-icon i');

    if (preview && fileNameEl && fileMetaEl && processBtn && iconEl) {
        fileNameEl.textContent = escapeHtml(file.name);
        fileMetaEl.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`; // Tamanho em MB

        // Define ícone com base no tipo MIME
        if (file.type.startsWith('audio/')) {
            iconEl.className = 'fas fa-file-audio';
        } else if (file.type === 'text/plain') {
            iconEl.className = 'fas fa-file-alt';
        } else if (file.type.includes('wordprocessingml') || file.type.includes('msword')) {
             iconEl.className = 'fas fa-file-word';
        } else {
            iconEl.className = 'fas fa-file'; // Ícone genérico
        }

        gsap.to(preview, { display: 'flex', opacity: 1, duration: 0.3 });
        gsap.to(processBtn, { display: 'inline-flex', opacity: 1, duration: 0.3 });
        // Esconde a área de upload principal (opcional)
        // document.getElementById('uploadArea').style.display = 'none';
    }
    // Limpa o valor do input para permitir selecionar o mesmo arquivo novamente
    const uploadInput = document.getElementById('uploadInput');
    if(uploadInput) uploadInput.value = '';
}

/** Reseta o estado do upload e a UI */
function resetUpload() {
    console.log("Resetando upload.");
    state.uploadedFile = null;
    const preview = document.getElementById('uploadPreview');
    const processBtn = document.getElementById('processUploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const uploadSteps = document.getElementById('uploadTranscriptionSteps');
    const uploadCompleted = document.getElementById('uploadCompletedPanel');
    const uploadInput = document.getElementById('uploadInput');

    if (preview) gsap.to(preview, { opacity: 0, duration: 0.2, onComplete: () => preview.style.display = 'none' });
    if (processBtn) gsap.to(processBtn, { opacity: 0, duration: 0.2, onComplete: () => processBtn.style.display = 'none' });
    if (uploadProgress) uploadProgress.style.display = 'none';
    if (uploadSteps) uploadSteps.style.display = 'none';
    if (uploadCompleted) uploadCompleted.style.display = 'none';
    if (uploadInput) uploadInput.value = ''; // Limpa seleção
    // Mostra a área de upload novamente (se foi escondida)
    // document.getElementById('uploadArea').style.display = 'block';
}


// --- Transcrição Manual ---

/** Configura a aba de transcrição manual */
function setupTranscriptionInput() {
    const processBtn = document.getElementById('processManualTranscriptionBtn');
    const textarea = document.getElementById('transcriptionText');

    if (processBtn && textarea) {
        processBtn.addEventListener('click', () => {
            const text = textarea.value.trim();
            if (text) {
                state.transcriptionText = text; // Salva no estado
                simulateProcessing('manual'); // Inicia simulação
            } else {
                showToast('warning', 'Texto Vazio', 'Por favor, digite ou cole a transcrição.');
                textarea.focus();
            }
        });
    }
}

// --- Simulação de Processamento e Geração ---

/** Define o estado de processamento e atualiza a UI globalmente */
function setProcessingState(isProcessing) {
    state.isProcessing = isProcessing;
    // Desabilita/Habilita elementos interativos importantes durante o processamento
    const elementsToToggle = document.querySelectorAll(`
        .sidebar-link, .mobile-menu-item, #sidebarToggle, #mobileMenuBtn,
        .library-btn, .document-item, .toolbar-btn, .patient-tab,
        #startRecordingBtn, #stopRecordingBtn, #processRecordingBtn,
        #uploadArea, #uploadInput, #processUploadBtn,
        #processManualTranscriptionBtn, #startProcessingBtn,
        .document-format-option, .dimensional-tab, .modal-close, .modal-footer button
    `);
    elementsToToggle.forEach(el => {
        el.disabled = isProcessing;
        el.classList.toggle('disabled', isProcessing); // Adiciona classe para estilo visual
    });
    console.log(`Estado de processamento: ${isProcessing}`);
}

/**
 * Simula o processamento de um documento (gravação, upload, manual).
 * @param {'recording' | 'upload' | 'manual'} type - O tipo de origem.
 */
async function simulateProcessing(type) {
    if (state.isProcessing) return;
    setProcessingState(true);
    console.log(`Simulando processamento para: ${type}`);

    // Seleciona os elementos corretos com base no tipo
    const progressContainerId = `${type}Progress`; // ex: recordingProgress
    const stepsContainerId = `${type}TranscriptionSteps`; // ex: transcriptionSteps
    const stepsProgressId = `${type}TranscriptionStepsProgress`; // ex: transcriptionStepsProgress
    const completedPanelId = `${type}CompletedPanel`; // ex: transcriptionCompletedPanel
    const progressBarId = `${type}ProgressBar`; // ex: recordingProgressBar
    const percentageId = `${type}ProgressPercentage`; // ex: recordingProgressPercentage
    const statusId = `${type}ProgressStatus`; // ex: recordingProgressStatus
    const previewId = `${type}Preview`; // ex: recordingPreview
    const actionButtonId = type === 'recording' ? 'processRecordingBtn' : (type === 'upload' ? 'processUploadBtn' : 'processManualTranscriptionBtn');

    const progressContainer = document.getElementById(progressContainerId);
    const stepsContainer = document.getElementById(stepsContainerId);
    const completedPanel = document.getElementById(completedPanelId);
    const previewContainer = document.getElementById(previewId);
    const actionButton = document.getElementById(actionButtonId);
    const livePreview = document.getElementById('liveTranscriptionPreview'); // Apenas para gravação/upload

    // Esconde botão de ação e preview (se existir)
    if (actionButton) gsap.to(actionButton, { opacity: 0, duration: 0.2, onComplete: () => actionButton.style.display = 'none' });
    if (previewContainer && type !== 'manual') gsap.to(previewContainer, { opacity: 0, duration: 0.2, onComplete: () => previewContainer.style.display = 'none' });
    if (type === 'manual') document.getElementById('transcriptionText').disabled = true; // Desabilita textarea

    // Mostra indicadores de progresso
    if (progressContainer) progressContainer.style.display = 'block';
    if (stepsContainer) stepsContainer.style.display = 'block';
    if (livePreview && (type === 'recording' || type === 'upload')) {
         livePreview.style.display = 'block';
         livePreview.innerHTML = '<p><i>Iniciando análise...</i><span class="typing"></span></p>';
    }

    // Simulação dos passos
    const steps = [
        { name: type === 'upload' ? 'Upload' : (type === 'manual' ? 'Validação' : 'Processando Áudio'), duration: 1000, text: 'Analisando dados iniciais...' },
        { name: type === 'manual' ? 'Processamento' : 'Transcrição', duration: 2000, text: 'Realizando transcrição...' },
        { name: type === 'manual' ? 'Análise' : 'Diarização', duration: 1500, text: 'Identificando falantes...' },
        { name: 'Finalização', duration: 500, text: 'Gerando documento final...' }
    ];

    let totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        updateStepProgress(stepsContainerId, stepsProgressId, i + 1); // Ativa passo atual
        updateProgressBar(progressBarId, percentageId, statusId, (elapsed / totalDuration) * 100, step.name);
         if (livePreview && (type === 'recording' || type === 'upload')) {
             livePreview.innerHTML = `<p><i>${step.text}</i><span class="typing"></span></p>`;
             livePreview.scrollTop = livePreview.scrollHeight; // Rola para o fim
         }

        // Simula o tempo do passo
        await new Promise(resolve => setTimeout(resolve, step.duration));
        elapsed += step.duration;

        // Marca passo como completo (exceto o último)
        if (i < steps.length - 1) {
            updateStepProgress(stepsContainerId, stepsProgressId, i + 1, true); // Marca como completo
        }
    }

    // Finaliza a barra de progresso e o último passo
    updateProgressBar(progressBarId, percentageId, statusId, 100, 'Concluído');
    updateStepProgress(stepsContainerId, stepsProgressId, steps.length, true); // Completa último passo
    if (livePreview && (type === 'recording' || type === 'upload')) {
        livePreview.innerHTML = '<p><i>Transcrição finalizada.</i></p>';
    }

    // Adiciona o documento processado (transcrição) ao estado
    const originalFileName = type === 'upload' ? state.uploadedFile?.name : (type === 'recording' ? document.getElementById('recordingFileName')?.textContent : 'Transcricao_Manual');
    const newDocId = addProcessedDocument(originalFileName, type);
    state.currentDocumentId = newDocId; // Define o documento recém-criado como ativo

    // Esconde progresso e mostra painel de conclusão
    if (progressContainer) progressContainer.style.display = 'none';
    if (stepsContainer) stepsContainer.style.display = 'none';
    if (livePreview) livePreview.style.display = 'none';
    if (completedPanel) {
        completedPanel.classList.add('active'); // Adiciona classe para animação CSS (fadeSlideIn)
        completedPanel.style.display = 'flex'; // Garante display flexível
    }
    if (type === 'manual') document.getElementById('transcriptionText').disabled = false; // Reabilita textarea

    setProcessingState(false); // Libera a UI
    console.log(`Processamento de ${type} concluído. Novo Documento ID: ${newDocId}`);
}

/** Adiciona um documento de transcrição processado à lista */
function addProcessedDocument(originalFileName = 'Documento', sourceType = 'upload') {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR'); // dd/mm/yyyy
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const safeName = originalFileName.replace(/\.[^/.]+$/, ""); // Remove extensão original
    const newId = `doc${Date.now()}`; // ID único baseado no timestamp

    const newDoc = {
        id: newId,
        patientId: state.currentPatientId || null, // Associa ao paciente atual, se houver
        title: `Transcrição_${safeName}.txt`,
        type: 'transcription',
        date: dateStr,
        time: timeStr,
        icon: 'fas fa-file-alt',
        color: 'var(--accent)',
        size: `${(state.transcriptionText.length / 1024).toFixed(1)} KB` // Tamanho baseado no texto
    };

    state.documents.push(newDoc);
    console.log("Novo documento de transcrição adicionado:", newDoc);
    // Opcional: Atualizar a biblioteca se estiver visível
    if (state.currentView === 'library') {
        renderDocumentLibrary();
    }
    return newId; // Retorna o ID do novo documento
}

/** Atualiza a UI dos indicadores de passo */
function updateStepProgress(stepsContainerId, progressIndicatorId, currentStep, completed = false) {
    const stepsContainer = document.getElementById(stepsContainerId);
    const progressIndicator = document.getElementById(progressIndicatorId);
    if (!stepsContainer || !progressIndicator) return;

    const steps = stepsContainer.querySelectorAll('.transcription-step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed'); // Limpa estados
        if (stepNumber < currentStep || completed) {
            step.classList.add('completed'); // Marca anteriores ou o atual como completo
        } else if (stepNumber === currentStep && !completed) {
            step.classList.add('active'); // Marca o atual como ativo
        }
    });

    // Atualiza a barra de progresso entre os passos
    const progressPercentage = completed ? ((currentStep) / steps.length) * 100 : ((currentStep - 0.5) / steps.length) * 100;
    progressIndicator.style.width = `${Math.min(100, progressPercentage)}%`;
}

/** Atualiza a UI da barra de progresso */
function updateProgressBar(barId, percentageId, statusId, percentage, statusText) {
    const bar = document.getElementById(barId);
    const percentEl = document.getElementById(percentageId);
    const statusEl = document.getElementById(statusId);

    if (bar) bar.style.width = `${Math.min(percentage, 100)}%`;
    if (percentEl) percentEl.textContent = `${Math.round(Math.min(percentage, 100))}%`;
    if (statusEl) statusEl.textContent = statusText;
}


// --- View: Processamento (#processing-view) ---

/** Configura a view de processamento de documentos */
function setupProcessing() {
    const optionsContainer = document.querySelector('#processing-view .document-format-options');
    const startBtn = document.getElementById('startProcessingBtn');
    const viewResultsBtn = document.getElementById('viewResultsBtn'); // Botão no painel de conclusão

    if (optionsContainer) {
        optionsContainer.addEventListener('click', (e) => {
            const option = e.target.closest('.document-format-option');
            if (option) {
                option.classList.toggle('active'); // Permite selecionar/deselecionar
            }
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const selectedFormats = Array.from(optionsContainer.querySelectorAll('.document-format-option.active'))
                                       .map(el => el.dataset.format);
            if (selectedFormats.length === 0) {
                showToast('warning', 'Nenhum Formato', 'Selecione pelo menos um formato para gerar.');
                return;
            }
            if (!state.currentDocumentId) {
                 showToast('error', 'Erro', 'Nenhum documento base selecionado para processamento.');
                 switchView('library'); // Volta para biblioteca se não houver doc base
                 return;
            }
            // Inicia a simulação de geração
            simulateGeneration(selectedFormats);
        });
    }

     if (viewResultsBtn) {
        viewResultsBtn.addEventListener('click', () => {
            switchView('results'); // Navega para a view de resultados
        });
    }
}

/**
 * Simula a geração dos documentos selecionados.
 * @param {string[]} formats - Array com os tipos de formato selecionados (ex: ['vintra', 'soap']).
 */
async function simulateGeneration(formats) {
    if (state.isProcessing) return;
    setProcessingState(true);
    console.log(`Simulando geração para formatos: ${formats.join(', ')}`);

    const progressContainer = document.getElementById('processingProgress');
    const completedPanel = document.getElementById('processingCompletedPanel');
    const startBtn = document.getElementById('startProcessingBtn');
    const optionsContainer = document.querySelector('#processing-view .document-format-options');

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

        // Adiciona o documento gerado ao estado
        addGeneratedDocument(format);
    }

    updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', 100, 'Concluído');

    // Esconde progresso, mostra painel de conclusão
    if (progressContainer) progressContainer.style.display = 'none';
    if (completedPanel) {
        completedPanel.classList.add('active'); // Ativa animação CSS
        completedPanel.style.display = 'flex';
    }

    setProcessingState(false);
    console.log("Geração de documentos concluída.");
}

/** Adiciona um documento gerado (VINTRA, SOAP, etc.) à lista */
function addGeneratedDocument(formatType) {
    const baseDoc = state.documents.find(d => d.id === state.currentDocumentId);
    if (!baseDoc) {
        console.error("Documento base não encontrado para gerar formato:", formatType);
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const baseTitle = baseDoc.title.replace(/\.(txt|mp3|wav|m4a)$/i, ''); // Remove extensão base
    const newId = `doc${Date.now()}`; // ID único

    let icon = 'fas fa-file-medical-alt'; // Ícone padrão
    let color = 'var(--gray-600)'; // Cor padrão
    switch(formatType) {
        case 'vintra': icon = 'fas fa-clipboard-list'; color = 'var(--accent)'; break;
        case 'soap': icon = 'fas fa-notes-medical'; color = 'var(--success)'; break; // Verde para SOAP
        case 'ipissima': icon = 'fas fa-comment-dots'; color = 'var(--accent-pink)'; break; // Rosa para Ipissima
        case 'narrative': icon = 'fas fa-book-open'; color = 'var(--warning-yellow)'; break; // Amarelo para Narrativa
        case 'orientacoes': icon = 'fas fa-list-check'; color = '#8B5CF6'; break; // Roxo para Orientações (exemplo)
    }

    const newDoc = {
        id: newId,
        patientId: baseDoc.patientId, // Mantém o ID do paciente
        title: `${formatType.toUpperCase()}_${baseTitle}.txt`,
        type: formatType,
        date: dateStr,
        time: timeStr,
        icon: icon,
        color: color,
        size: `${(getDocumentContent(formatType).length / 1024).toFixed(1)} KB` // Tamanho baseado no conteúdo de exemplo
    };

    state.documents.push(newDoc);
    console.log(`Novo documento gerado (${formatType}) adicionado:`, newDoc);

    // Atualiza a biblioteca se estiver visível
    if (state.currentView === 'library') {
        renderDocumentLibrary();
    }
     // Atualiza a lista de documentos do paciente se estiver visível
    if (state.currentView === 'patient' && state.activePatientTab === 'repository-panel') {
        renderPatientDocuments();
    }
}

/** Inicia o fluxo de processamento a partir de um documento da biblioteca */
function startProcessingDocument(docId) {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado.');
        return;
    }

    // Verifica se o documento é processável
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
    const optionsContainer = document.querySelector('#processing-view .document-format-options');
    const startBtn = document.getElementById('startProcessingBtn');
    const progressContainer = document.getElementById('processingProgress');
    const completedPanel = document.getElementById('processingCompletedPanel');

    if(optionsContainer) {
        optionsContainer.style.display = 'flex'; // Mostra opções
        // Reseta seleção (deixa só VINTRA ativo por padrão, ou nenhum)
        optionsContainer.querySelectorAll('.document-format-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.format === 'vintra');
        });
    }
    if(startBtn) startBtn.style.display = 'inline-flex'; // Mostra botão de iniciar
    if(progressContainer) progressContainer.style.display = 'none'; // Esconde progresso
    if(completedPanel) completedPanel.style.display = 'none'; // Esconde painel de conclusão

    // Navega para a view de processamento
    switchView('processing');
}


// --- View: Resultados (#results-view) ---

/** Configura a view de resultados */
function setupResultsView() {
    const tabsContainer = document.querySelector('#results-view .document-tabs');
    const downloadBtn = document.getElementById('downloadResultsBtn'); // TODO: Implementar download de múltiplos

    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.document-tab');
            if (tab && tab.dataset.panel && !tab.classList.contains('active')) {
                activateResultsTab(tab.dataset.panel);
            }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // TODO: Implementar lógica para baixar o documento da aba ativa ou múltiplos
            showToast('info', 'Download', 'Funcionalidade de download de resultados a implementar.');
        });
    }
}

/** Ativa uma aba específica na view de resultados */
function activateResultsTab(panelId) {
    console.log(`Ativando aba de resultados: ${panelId}`);
    state.activeResultsTab = panelId; // Atualiza estado

    // Atualiza estilo das abas
    document.querySelectorAll('#results-view .document-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panel === panelId);
    });

    // Animação de troca de painéis
    const panelsContainer = document.querySelector('#results-view .document-tab-panels');
    const activePanel = document.getElementById(panelId);
    const currentActivePanel = panelsContainer?.querySelector('.document-tab-panel.active');

    if (!activePanel) {
        console.error(`Painel de resultados não encontrado: ${panelId}`);
        return;
    }

    // Pega o tipo de documento da aba (ex: 'vintra' de 'vintra-panel')
    const docType = panelId.replace('-panel', '');
    const content = getDocumentContent(docType) || `Conteúdo para '${docType}' não disponível.`;

    // Encontra o elemento de conteúdo dentro do painel ativo
    const contentElement = activePanel.querySelector('.document-view');
    if (contentElement) {
        contentElement.innerHTML = `<pre>${escapeHtml(content)}</pre>`; // Atualiza conteúdo
    } else {
        console.warn(`Elemento .document-view não encontrado em #${panelId}`);
        activePanel.innerHTML = `<div class="document-content"><div class="document-container"><div class="document-view"><pre>${escapeHtml(content)}</pre></div></div></div>`; // Fallback
    }


    const showActivePanel = () => {
        gsap.set(activePanel, { display: 'block', opacity: 0 }); // Prepara novo painel
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
function setupDocumentLibrary() {
    const filtersContainer = document.querySelector('#library-view .library-filters');
    const searchInput = document.querySelector('#library-view .library-search-input');

    if (filtersContainer) {
        filtersContainer.addEventListener('click', (e) => {
            const filterBtn = e.target.closest('.library-filter');
            if (filterBtn && !filterBtn.classList.contains('active')) {
                // Desativa filtro antigo e ativa o novo
                filtersContainer.querySelector('.library-filter.active')?.classList.remove('active');
                filterBtn.classList.add('active');
                // Renderiza a biblioteca com o novo filtro e busca atual
                renderDocumentLibrary(filterBtn.dataset.filter, searchInput?.value || '');
            }
        });
    }

    if (searchInput) {
        // Usa debounce para evitar renderizações excessivas ao digitar
        searchInput.addEventListener('input', debounce(() => {
            const activeFilter = filtersContainer?.querySelector('.library-filter.active')?.dataset.filter || 'all';
            renderDocumentLibrary(activeFilter, searchInput.value);
        }, 300)); // Atraso de 300ms
    }
}

// --- Modo Foco ---

/** Configura o botão de modo foco */
function setupFocusMode() {
    // Adiciona listener aos botões de foco (pode haver um em cada view principal)
    document.querySelectorAll('.focus-mode-btn').forEach(btn => {
        btn.addEventListener('click', toggleFocusMode);
    });
}

/** Alterna o modo foco */
function toggleFocusMode() {
    const body = document.body;
    body.classList.toggle('focus-mode');
    const isFocus = body.classList.contains('focus-mode');
    console.log(`Modo Foco: ${isFocus ? 'Ativado' : 'Desativado'}`);

    // Atualiza o ícone do botão (exemplo: alterna entre expandir/comprimir)
     document.querySelectorAll('.focus-mode-btn i').forEach(icon => {
        icon.className = isFocus ? 'fas fa-compress-alt' : 'fas fa-expand-alt';
     });

    // Opcional: Forçar re-renderização ou ajuste de layout se necessário
    // Exemplo: window.dispatchEvent(new Event('resize'));
    showToast('info', `Modo Foco ${isFocus ? 'Ativado' : 'Desativado'}`, isFocus ? 'Elementos da interface foram ocultos.' : 'Interface restaurada.');
}


// --- Notificações Toast ---

/** Mostra uma notificação toast */
function showToast(type, title, message, duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`; // Adiciona classe de tipo para estilização futura

    // Ícone baseado no tipo
    let iconClass = 'fas fa-info-circle'; // Padrão (info)
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

    // Adiciona evento para fechar ao clicar no botão
    toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));

    container.appendChild(toast);

    // Animação de entrada (usando GSAP)
    gsap.fromTo(toast,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
    );

    // Define timeout para remover automaticamente
    setTimeout(() => removeToast(toast), duration);
}

/** Remove um toast específico com animação */
function removeToast(toastElement) {
    if (!toastElement || !toastElement.parentNode) return; // Verifica se o toast ainda existe

    toastElement.classList.add('exit'); // Adiciona classe para animação de saída CSS

    // Animação de saída (usando GSAP)
    gsap.to(toastElement, {
        opacity: 0,
        y: 10, // Ou x: 10 para sair para o lado
        scale: 0.9,
        duration: 0.3,
        ease: 'power1.in',
        onComplete: () => {
            toastElement.remove(); // Remove do DOM após a animação
        }
    });
}


// --- Modal Genérico ---

/** Configura o modal genérico */
function setupGenericModal() {
    const modalOverlay = document.getElementById('genericModal');
    const closeBtn = document.getElementById('genericModalClose');
    const cancelBtn = document.getElementById('genericModalCancelBtn'); // Botão padrão "Fechar"

    if (closeBtn) closeBtn.addEventListener('click', hideGenericModal);
    if (cancelBtn) cancelBtn.addEventListener('click', hideGenericModal); // Botão fechar faz o mesmo que o X
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            // Fecha somente se clicar no overlay (fundo), não no container
            if (e.target === modalOverlay) {
                hideGenericModal();
            }
        });
    }
}

/** Mostra o modal genérico com título e conteúdo HTML */
function showGenericModal(title, htmlContent) {
    const modal = document.getElementById('genericModal');
    const modalTitle = document.getElementById('genericModalTitle');
    const modalBody = document.getElementById('genericModalBody');

    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = htmlContent; // Permite HTML no conteúdo

        gsap.set(modal, { display: 'flex', opacity: 0 }); // Prepara
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
function hideGenericModal() {
    const modal = document.getElementById('genericModal');
    if (modal && modal.style.display !== 'none') {
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in',
            onComplete: () => {
                modal.style.display = 'none';
                // Limpa o conteúdo para evitar mostrar o antigo rapidamente na próxima vez
                const modalBody = document.getElementById('genericModalBody');
                if (modalBody) modalBody.innerHTML = '';
            }
        });
    }
}


// --- Utilitários ---

/**
 * Debounce: Atraso na execução de uma função após o último evento.
 * Útil para eventos como 'input' ou 'resize'.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/** Escapa HTML para prevenir XSS ao inserir texto no DOM */
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        // Tenta converter para string, se falhar retorna string vazia
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


// --- Funções de Exemplo para Botões (Podem ser removidas ou adaptadas) ---

/** Ação de exemplo: Visualizar transcrição após processamento */
function viewTranscription() {
    if (!state.currentDocumentId) {
        showToast('warning', 'Nenhum Documento', 'Nenhum documento de transcrição ativo para visualizar.');
        switchView('library'); // Volta para biblioteca
        return;
    }
    // Tenta encontrar o documento de transcrição recém-criado
    const doc = state.documents.find(d => d.id === state.currentDocumentId && d.type === 'transcription');
    if (doc) {
        switchView('library');
        // Atraso para garantir que a view 'library' renderizou
        setTimeout(() => {
            setActiveDocumentItem(doc.id);
            viewDocumentInWorkspace(doc.id);
        }, 400);
    } else {
        showToast('error', 'Erro', 'Transcrição não encontrada na biblioteca.');
        switchView('library');
    }
}

/** Ação de exemplo: Ir para processamento após transcrição */
function processTranscription() {
    if (!state.currentDocumentId) {
        showToast('warning', 'Nenhum Documento', 'Nenhum documento de transcrição ativo para processar.');
        switchView('library');
        return;
    }
     const doc = state.documents.find(d => d.id === state.currentDocumentId && d.type === 'transcription');
     if (doc) {
        startProcessingDocument(doc.id); // Inicia o fluxo de processamento com o doc atual
     } else {
         showToast('error', 'Erro', 'Documento de transcrição não encontrado para processar.');
         switchView('library');
     }
}
