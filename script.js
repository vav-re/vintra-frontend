/**
 * VINTRA - Análise Dimensional Clínica
 * Script principal mesclado, otimizado e refatorado para TypeScript (Baseado na v4)
 * Incorporando seleção de pacientes e removendo modo foco
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// --- Estado Global ---
var state = {
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
    dimensionalData: {
        emocional: { valencia: -2.5, excitacao: 7.0, dominancia: 3.0, intensidade: 8.0 },
        cognitiva: { complexidade: 6.0, coerencia: 5.0, flexibilidade: 4.0, dissonancia: 7.0 },
        autonomia: { perspectivaTemporal: { passado: 7.0, presente: 3.0, futuro: 2.0, media: 4.0 }, autocontrole: 4.0 }
    },
    documents: [],
    recentPatients: [],
    // Conteúdo de exemplo (idealmente viria do backend)
    transcriptionText: "Entrevista Cl\u00EDnica - 04 de Abril de 2025\nM\u00E9dico: Bom dia, Maria. Como voc\u00EA est\u00E1 se sentindo hoje?\nPaciente: Ah, doutor... n\u00E3o estou bem. A dor continua, sabe? Eu tomo os rem\u00E9dios, mas parece que n\u00E3o adianta muito. Durmo mal, acordo cansada. \u00C0s vezes acho que nunca vou melhorar. (Suspira) \u00C9 dif\u00EDcil manter a esperan\u00E7a.\nM\u00E9dico: Entendo que seja dif\u00EDcil, Maria. Vamos conversar sobre isso. Al\u00E9m da dor f\u00EDsica, como est\u00E1 o seu \u00E2nimo?\nPaciente: P\u00E9ssimo. Me sinto desanimada, sem vontade de fazer nada. At\u00E9 as coisas que eu gostava perderam a gra\u00E7a. Parece que estou carregando um peso enorme.",
    vintraText: "# An\u00E1lise VINTRA - Maria Silva (04/04/2025)\n\n## Dimens\u00F5es Emocionais\n- Val\u00EAncia (v\u2081): -2.5 (Negativa)\n- Excita\u00E7\u00E3o (v\u2082): 7.0 (Alta)\n- Domin\u00E2ncia (v\u2083): 3.0 (Baixa)\n- Intensidade (v\u2084): 8.0 (Alta)\n\n... (restante do texto VINTRA)",
    soapText: "# Nota SOAP - Maria Silva (04/04/2025)\n\n## S (Subjetivo)\nPaciente relata persist\u00EAncia da dor...\n\n... (restante do texto SOAP)",
    ipissimaText: "# Ip\u00EDssima Narrativa - Maria Silva (04/04/2025)\n\nEu n\u00E3o aguento mais essa dor...\n\n... (restante do texto Ip\u00EDssima)",
    narrativeText: "# An\u00E1lise Narrativa - Maria Silva (04/04/2025)\n\n## Temas Centrais:\n- Dor cr\u00F4nica...\n\n... (restante da an\u00E1lise narrativa)",
    orientacoesText: "# Orienta\u00E7\u00F5es - Maria Silva (04/04/2025)\n\n1.  **Medica\u00E7\u00E3o:** Continue...\n\n... (restante das orienta\u00E7\u00F5es)"
};
// --- Inicialização ---
document.addEventListener('DOMContentLoaded', function () {
    console.log("VINTRA Inicializando...");
    loadDemoData();
    setupEventListeners();
    initCharts(); // Inicializa estruturas de gráficos
    initFluidAnimations(); // Configura efeito ripple
    // Estado inicial: Mostrar Splash brevemente, depois Login
    var splashScreen = document.getElementById('splashScreen');
    var loginScreen = document.getElementById('loginScreen');
    var appContainer = document.getElementById('appContainer');
    if (splashScreen && loginScreen && appContainer) {
        gsap.set(splashScreen, { display: 'flex', opacity: 1 }); // Garante visibilidade inicial
        gsap.to(splashScreen, {
            opacity: 0,
            duration: 0.5,
            delay: 0.7,
            ease: "power1.inOut",
            onComplete: function () {
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
    }
    else {
        console.warn("Splash, Login ou App Container não encontrados. Exibindo App diretamente.");
        if (appContainer)
            appContainer.style.display = 'flex';
        window.switchView('dashboard'); // Fallback
    }
    // Renderiza a seleção de pacientes no dashboard
    renderPatientSelectionOnDashboard();
});
/** Configura todos os event listeners da aplicação */
function setupEventListeners() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
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
    // Modo foco removido
    setupGenericModal();
    // Adicionar listeners para botões de conclusão (viewTranscription, processTranscription)
    (_a = document.getElementById('viewTranscriptionBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', viewTranscription);
    (_b = document.getElementById('processTranscriptionBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', processTranscription);
    (_c = document.getElementById('uploadViewTranscriptionBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', viewTranscription);
    (_d = document.getElementById('uploadProcessTranscriptionBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', processTranscription);
    (_e = document.getElementById('manualViewTranscriptionBtn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', viewTranscription);
    (_f = document.getElementById('manualProcessTranscriptionBtn')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', processTranscription);
    (_g = document.getElementById('viewResultsBtn')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', function () { return window.switchView('results'); });
    // Listener para o botão de processamento IA (adicionado)
    (_h = document.getElementById('processWithAIButton')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', processDocumentWithAI);
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
        // Docs Paciente 1
        { id: 'doc1', patientId: 'patient-1', title: 'Entrevista_Maria_2503.mp3', type: 'audio', date: '25/03/2025', time: '10:30', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '15.3 MB', duration: '28:45' },
        { id: 'doc2', patientId: 'patient-1', title: 'Transcrição_Maria_2503.txt', type: 'transcription', date: '25/03/2025', time: '10:35', icon: 'fas fa-file-alt', color: 'var(--accent)', size: '5 KB' },
        { id: 'doc3', patientId: 'patient-1', title: 'VINTRA_Maria_2503.txt', type: 'vintra', date: '25/03/2025', time: '10:40', icon: 'fas fa-clipboard-list', color: 'var(--accent)', size: '8 KB' },
        { id: 'doc4', patientId: 'patient-1', title: 'SOAP_Maria_2503.txt', type: 'soap', date: '25/03/2025', time: '10:45', icon: 'fas fa-notes-medical', color: 'var(--success)', size: '3 KB' },
        { id: 'doc7', patientId: 'patient-1', title: 'Ipissima_Maria_2503.txt', type: 'ipissima', date: '25/03/2025', time: '10:50', icon: 'fas fa-comment-dots', color: 'var(--accent-pink)', size: '2 KB' },
        { id: 'doc8', patientId: 'patient-1', title: 'Narrativa_Maria_2503.txt', type: 'narrative', date: '25/03/2025', time: '10:55', icon: 'fas fa-book-open', color: 'var(--warning-yellow)', size: '4 KB' },
        { id: 'doc9', patientId: 'patient-1', title: 'Orientacoes_Maria_2503.txt', type: 'orientacoes', date: '25/03/2025', time: '11:00', icon: 'fas fa-list-check', color: '#8B5CF6', size: '1 KB' },
        // Docs Paciente 2
        { id: 'doc5', patientId: 'patient-2', title: 'Consulta_Joao_2503.wav', type: 'audio', date: '25/03/2025', time: '11:00', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '22.1 MB', duration: '35:10' },
        { id: 'doc6', patientId: 'patient-2', title: 'Transcricao_Joao_2503.txt', type: 'transcription', date: '25/03/2025', time: '11:05', icon: 'fas fa-file-alt', color: 'var(--accent)', size: '7 KB' },
        // Docs Paciente 4
        { id: 'doc10', patientId: 'patient-4', title: 'Retorno_Carlos_1503.mp3', type: 'audio', date: '15/03/2025', time: '09:00', icon: 'fas fa-microphone', color: 'var(--accent-vivid)', size: '10.1 MB', duration: '15:20' },
    ];
    console.log("Dados de demonstração carregados.");
}
/** Renderiza a seleção de pacientes no dashboard */
function renderPatientSelectionOnDashboard() {
    var _a, _b, _c;
    var container = document.getElementById('dashboard-view'); // O container principal do dashboard
    if (!container)
        return;
    // Remove conteúdo antigo do dashboard se existir
    (_a = container.querySelector('.patient-selection-section')) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = container.querySelector('.welcome-message')) === null || _b === void 0 ? void 0 : _b.remove();
    (_c = container.querySelector('#recentDocuments')) === null || _c === void 0 ? void 0 : _c.remove();
    // Cria a secção de seleção de pacientes
    var patientSelectionSection = document.createElement('div');
    patientSelectionSection.className = 'patient-selection-section'; // Adicionar estilo CSS para esta classe
    var header = document.createElement('div');
    header.className = 'section-header'; // Reutilizar estilo se aplicável
    header.innerHTML = "<h2 class=\"section-title\">Aceder Paciente</h2>";
    patientSelectionSection.appendChild(header);
    // Adicionar uma barra de busca (exemplo simples)
    var searchBar = document.createElement('div');
    searchBar.className = 'search-container dashboard-search'; // Classe específica opcional
    searchBar.innerHTML = "\n        <div class=\"search-bar\">\n            <i class=\"fas fa-search search-icon\"></i>\n            <input type=\"text\" id=\"dashboardPatientSearch\" placeholder=\"Buscar paciente por nome ou ID...\" class=\"search-input\">\n        </div>\n    ";
    patientSelectionSection.appendChild(searchBar);
    var patientListDiv = document.createElement('div');
    patientListDiv.id = 'dashboardPatientList';
    patientListDiv.className = 'patient-card-list'; // Estilo para lista de cartões
    patientSelectionSection.appendChild(patientListDiv);
    // Adiciona a nova secção ao início do dashboard (antes do header existente, se houver)
    var dashboardHeader = container.querySelector('.dashboard-header');
    if (dashboardHeader) {
        container.insertBefore(patientSelectionSection, dashboardHeader.nextSibling);
    }
    else {
        container.prepend(patientSelectionSection);
    }
    // Lógica de busca e renderização da lista
    var searchInput = document.getElementById('dashboardPatientSearch');
    if (!searchInput) {
        console.error("Elemento de busca de paciente no dashboard não encontrado.");
        return;
    }
    var renderList = function (searchTerm) {
        if (searchTerm === void 0) { searchTerm = ''; }
        patientListDiv.innerHTML = ''; // Limpa lista
        var normalizedSearch = searchTerm.toLowerCase().trim();
        var filteredPatients = state.recentPatients.filter(function (p) {
            return !normalizedSearch ||
                p.name.toLowerCase().includes(normalizedSearch) ||
                p.id.includes(normalizedSearch);
        });
        if (filteredPatients.length === 0) {
            patientListDiv.innerHTML = '<p class="empty-list-message">Nenhum paciente encontrado.</p>';
            return;
        }
        filteredPatients.forEach(function (patient) {
            var _a;
            var card = document.createElement('div');
            card.className = 'patient-card dashboard-patient-card'; // Reutilizar/adaptar estilo
            card.dataset.id = patient.id;
            card.innerHTML = "\n                <div class=\"patient-card-header\">\n                     <div class=\"patient-avatar\">".concat(patient.name.charAt(0), "</div>\n                     <div class=\"patient-card-name\">").concat(escapeHtml(patient.name), "</div>\n                </div>\n                <div class=\"patient-card-info\">ID: ").concat(escapeHtml(patient.id), "</div>\n                 <button class=\"btn btn-sm btn-primary access-patient-btn\" data-patient-id=\"").concat(patient.id, "\">Aceder</button>\n            ");
            (_a = card.querySelector('.access-patient-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
                e.stopPropagation();
                window.openPatientPanel(patient.id);
            });
            // card.addEventListener('click', () => window.openPatientPanel(patient.id)); // Card inteiro clicável opcional
            patientListDiv.appendChild(card);
        });
    };
    searchInput.addEventListener('input', debounce(function () { return renderList(searchInput.value); }, 300));
    renderList(); // Renderiza a lista inicial
}
/** Renderiza os documentos recentes no dashboard */
function renderRecentDocuments() {
    var container = document.getElementById('recentDocuments');
    if (!container)
        return;
    container.innerHTML = ''; // Limpa antes de renderizar
    var recentDocs = state.documents.slice(-4).reverse(); // Pega os 4 últimos
    if (recentDocs.length === 0) {
        container.innerHTML = '<p class="empty-list-message">Nenhum documento recente encontrado.</p>';
        return;
    }
    recentDocs.forEach(function (doc) {
        var item = document.createElement('div');
        item.className = 'recent-item';
        item.dataset.id = doc.id;
        item.innerHTML = "\n            <div class=\"recent-item-icon\" style=\"color: ".concat(doc.color || 'var(--text-secondary)', "\">\n                <i class=\"").concat(doc.icon || 'fas fa-file', "\"></i>\n            </div>\n            <div class=\"recent-item-info\">\n                <div class=\"recent-item-title\">").concat(escapeHtml(doc.title), "</div>\n                <div class=\"recent-item-meta\">\n                    <span>").concat(escapeHtml(doc.type), "</span>\n                    <span class=\"recent-item-meta-divider\"></span>\n                    <span>").concat(escapeHtml(doc.date), "</span>\n                    ").concat(doc.size ? "<span class=\"recent-item-meta-divider\"></span><span>".concat(escapeHtml(doc.size), "</span>") : '', "\n                </div>\n            </div>");
        // Adiciona evento para navegar para a biblioteca e selecionar o doc
        item.addEventListener('click', function () {
            window.switchView('library');
            // Aguarda a transição da view antes de selecionar
            setTimeout(function () {
                setActiveDocumentItem(doc.id);
                viewDocumentInWorkspace(doc.id);
            }, 400); // Ajuste o tempo se necessário
        });
        container.appendChild(item);
    });
}
/** Renderiza documentos na Biblioteca com base no filtro e busca */
function renderDocumentLibrary(filter, searchTerm) {
    var _a, _b;
    if (filter === void 0) { filter = 'all'; }
    if (searchTerm === void 0) { searchTerm = ''; }
    var container = document.getElementById('documentList');
    var libraryView = document.getElementById('library-view');
    if (!container || !libraryView)
        return;
    // Acesso à biblioteca global requer paciente selecionado
    if (!state.currentPatientId) {
        container.innerHTML = '<p class="empty-list-message">Selecione um paciente no Dashboard para ver os seus documentos aqui.</p>';
        showEmptyDocumentView();
        (_a = document.querySelector('.sidebar-link[data-target="library"]')) === null || _a === void 0 ? void 0 : _a.classList.add('disabled');
        return;
    }
    else {
        (_b = document.querySelector('.sidebar-link[data-target="library"]')) === null || _b === void 0 ? void 0 : _b.classList.remove('disabled');
    }
    container.innerHTML = ''; // Limpa
    var normalizedSearch = searchTerm.toLowerCase().trim();
    var filteredDocs = state.documents.filter(function (doc) {
        return doc.patientId === state.currentPatientId &&
            (filter === 'all' || doc.type === filter) &&
            (!normalizedSearch || doc.title.toLowerCase().includes(normalizedSearch));
    }).sort(function (a, b) { return parseDate(b.date, b.time).getTime() - parseDate(a.date).getTime(); }); // Ordena por data desc
    if (filteredDocs.length === 0) {
        container.innerHTML = "<p class=\"empty-list-message\">Nenhum documento encontrado para este paciente ".concat(filter !== 'all' || searchTerm ? 'com os filtros aplicados' : '', ".</p>");
        if (state.currentView === 'library') {
            showEmptyDocumentView();
        }
        return;
    }
    filteredDocs.forEach(function (doc) {
        var _a, _b, _c, _d;
        var item = document.createElement('div');
        item.className = "document-item document-".concat(doc.type);
        item.dataset.id = doc.id;
        item.dataset.type = doc.type;
        var isProcessable = doc.type === 'audio' || doc.type === 'transcription';
        var isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);
        item.innerHTML = "\n            <div class=\"document-icon\"> <i class=\"".concat(doc.icon || 'fas fa-file', "\"></i> </div>\n            <div class=\"document-info\">\n                <div class=\"document-title\">").concat(escapeHtml(doc.title), "</div>\n                <div class=\"document-meta\">").concat(escapeHtml(doc.date), "</div>\n            </div>\n            <div class=\"document-actions\">\n                <button class=\"document-action-btn view-doc-modal\" title=\"Visualizar\"><i class=\"fas fa-eye\"></i></button>\n                ").concat(isEditable ? "<button class=\"document-action-btn edit-doc\" title=\"Editar\"><i class=\"fas fa-edit\"></i></button>" : '', "\n                ").concat(isProcessable ? "<button class=\"document-action-btn process-doc\" title=\"Processar\"><i class=\"fas fa-cogs\"></i></button>" : '', "\n                <button class=\"document-action-btn download-doc\" title=\"Download\"><i class=\"fas fa-download\"></i></button>\n            </div>");
        // Evento principal do item: selecionar e visualizar
        item.addEventListener('click', function () {
            setActiveDocumentItem(doc.id);
            viewDocumentInWorkspace(doc.id);
        });
        // Eventos dos botões de ação
        (_a = item.querySelector('.view-doc-modal')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
            e.stopPropagation();
            viewDocument(doc.id);
        });
        (_b = item.querySelector('.edit-doc')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) {
            e.stopPropagation();
            editDocument(doc.id);
        });
        (_c = item.querySelector('.process-doc')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (e) {
            e.stopPropagation();
            startProcessingDocument(doc.id);
        });
        (_d = item.querySelector('.download-doc')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function (e) {
            e.stopPropagation();
            downloadDocument(doc.id);
        });
        container.appendChild(item);
    });
    // Mantém o item ativo se ele ainda estiver na lista filtrada
    if (state.currentDocumentId && filteredDocs.some(function (d) { return d.id === state.currentDocumentId; })) {
        setActiveDocumentItem(state.currentDocumentId);
    }
    else if (state.currentView === 'library') {
        state.currentDocumentId = null;
        showEmptyDocumentView();
    }
}
/** Define o item ativo na lista da biblioteca */
function setActiveDocumentItem(docId) {
    // Remove 'active' de todos os itens em ambas as listas possíveis
    document.querySelectorAll('#documentList .document-item, #patientDocuments .document-item').forEach(function (item) {
        item.classList.remove('active');
    });
    // Adiciona 'active' ao item correto em ambas as listas possíveis
    document.querySelectorAll("#documentList .document-item[data-id=\"".concat(docId, "\"], #patientDocuments .document-item[data-id=\"").concat(docId, "\"]")).forEach(function (item) {
        item.classList.add('active');
    });
    state.currentDocumentId = docId;
    console.log("Documento ativo: ".concat(docId));
}
/** Visualiza o conteúdo de um documento no painel direito da biblioteca */
function viewDocumentInWorkspace(docId) {
    var _a, _b, _c, _d, _e;
    var doc = state.documents.find(function (d) { return d.id === docId; });
    var viewContainer = document.getElementById('documentView');
    if (!doc || !viewContainer) {
        showEmptyDocumentView();
        return;
    }
    // Garante que o doc pertence ao paciente atual se estivermos na library view
    if (state.currentView === 'library' && doc.patientId !== state.currentPatientId) {
        console.warn("Tentativa de visualizar documento de outro paciente na library view.");
        showEmptyDocumentView();
        return;
    }
    console.log("Visualizando documento: ".concat(doc.title, " (ID: ").concat(docId, ", Tipo: ").concat(doc.type, ")"));
    var content = (_a = getDocumentContent(doc.type)) !== null && _a !== void 0 ? _a : "Conte\u00FAdo para '".concat(doc.type, "' n\u00E3o encontrado.");
    var isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);
    var isProcessable = doc.type === 'audio' || doc.type === 'transcription';
    viewContainer.innerHTML = ''; // Limpa container
    var toolbar = document.createElement('div');
    toolbar.className = 'document-toolbar';
    toolbar.innerHTML = "\n        <div class=\"document-info-header\">\n            <div class=\"document-info-icon document-".concat(doc.type, "\"> <i class=\"").concat(doc.icon || 'fas fa-file', "\"></i> </div>\n            <div class=\"document-info-details\">\n                <h2>").concat(escapeHtml(doc.title), "</h2>\n                <div class=\"document-info-meta\">\n                    <span>").concat(escapeHtml(doc.type), "</span>\n                    <span class=\"document-info-meta-divider\"></span>\n                    <span>").concat(escapeHtml(doc.date), " ").concat(escapeHtml(doc.time || ''), "</span>\n                    ").concat(doc.size ? "<span class=\"document-info-meta-divider\"></span><span>".concat(escapeHtml(doc.size), "</span>") : '', "\n                    ").concat(doc.duration ? "<span class=\"document-info-meta-divider\"></span><span>".concat(escapeHtml(doc.duration), "</span>") : '', "\n                </div>\n            </div>\n        </div>\n        <div class=\"document-toolbar-actions\">\n            ").concat(isEditable ? "<button class=\"toolbar-btn edit-doc-view\" title=\"Editar\"><i class=\"fas fa-edit\"></i> Editar</button>" : '', "\n            ").concat(isProcessable ? "<button class=\"toolbar-btn process-doc-view\" title=\"Processar\"><i class=\"fas fa-cogs\"></i> Processar</button>" : '', "\n            <button class=\"toolbar-btn download-doc-view\" title=\"Download\"><i class=\"fas fa-download\"></i> Download</button>\n            <button class=\"toolbar-btn view-doc-modal\" title=\"Visualizar em Modal\"><i class=\"fas fa-eye\"></i> Visualizar</button>\n        </div>");
    var contentArea = document.createElement('div');
    contentArea.className = 'document-content';
    contentArea.innerHTML = "<div class=\"document-container\"><div class=\"document-view\"></div></div>";
    var viewElement = contentArea.querySelector('.document-view');
    if (viewElement) {
        if (doc.type === 'audio') {
            // Tenta encontrar o blob associado (ex: de uma gravação)
            var audioBlob = null;
            if (state.processedAudioBlob && doc.title.startsWith('Gravação_')) {
                audioBlob = state.processedAudioBlob;
            }
            if (audioBlob) {
                var audioUrl = URL.createObjectURL(audioBlob);
                viewElement.innerHTML = "\n                    <div style=\"padding: 1rem;\">\n                        <audio controls src=\"".concat(audioUrl, "\" style=\"width: 100%;\"></audio>\n                        <p style=\"font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;\">Use 'Processar' para transcrever.</p>\n                    </div>");
                // TODO: Gerenciar revokeObjectURL(audioUrl) quando não for mais necessário
            }
            else {
                viewElement.innerHTML = "\n                    <div style=\"text-align: center; padding: 2rem;\">\n                        <i class=\"fas fa-volume-up\" style=\"font-size: 3rem; color: var(--text-tertiary); margin-bottom: 1rem;\"></i>\n                        <p style=\"color: var(--text-secondary);\">Pr\u00E9-visualiza\u00E7\u00E3o de \u00E1udio n\u00E3o dispon\u00EDvel.</p>\n                        <p style=\"font-size: 0.8rem; color: var(--text-tertiary);\">Use o bot\u00E3o 'Processar' para transcrever.</p>\n                    </div>";
            }
        }
        else {
            var pre = document.createElement('pre');
            pre.textContent = content;
            viewElement.appendChild(pre);
        }
    }
    viewContainer.appendChild(toolbar);
    viewContainer.appendChild(contentArea);
    // Adiciona listeners aos botões recém-criados
    (_b = viewContainer.querySelector('.edit-doc-view')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () { return editDocument(docId); });
    (_c = viewContainer.querySelector('.process-doc-view')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () { return startProcessingDocument(docId); });
    (_d = viewContainer.querySelector('.download-doc-view')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () { return downloadDocument(docId); });
    (_e = viewContainer.querySelector('.view-doc-modal')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () { return viewDocument(docId); });
    gsap.fromTo(viewContainer, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' });
}
/** Mostra o estado vazio no painel de visualização de documentos */
function showEmptyDocumentView() {
    var _a;
    var viewContainer = document.getElementById('documentView');
    if (!viewContainer)
        return;
    console.log("Mostrando estado vazio do workspace.");
    var message = '<p class="document-empty-text">Selecione um documento da lista à esquerda para visualizá-lo aqui.</p>';
    if (!state.currentPatientId) {
        message = '<p class="document-empty-text">Selecione um paciente no Dashboard para começar.</p>';
    }
    else if (state.documents.filter(function (d) { return d.patientId === state.currentPatientId; }).length === 0) {
        message = '<p class="document-empty-text">Nenhum documento encontrado para este paciente. Crie um novo.</p>';
    }
    viewContainer.innerHTML = "\n        <div class=\"document-empty\">\n            <div class=\"document-empty-icon\"><i class=\"fas fa-folder-open\"></i></div>\n            <h2 class=\"document-empty-title\">Nenhum documento selecionado</h2>\n            ".concat(message, "\n            ").concat(state.currentPatientId ? "<button class=\"btn btn-primary\" id=\"emptyViewCreateBtn\"><i class=\"fas fa-plus btn-icon\"></i> Criar Novo Documento</button>" : '', "\n        </div>");
    (_a = viewContainer.querySelector('#emptyViewCreateBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return window.switchView('new'); });
    gsap.fromTo(viewContainer.querySelector('.document-empty'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' });
}
/** Renderiza documentos no repositório do paciente */
function renderPatientDocuments() {
    var documentsList = document.getElementById('patientDocuments');
    if (!documentsList || !state.currentPatientId) {
        console.warn("Container de documentos do paciente ou ID do paciente não encontrado.");
        if (documentsList)
            documentsList.innerHTML = '<p class="empty-list-message">Selecione um paciente para ver seus documentos.</p>';
        return;
    }
    documentsList.innerHTML = ''; // Limpa
    var patientDocs = state.documents.filter(function (doc) { return doc.patientId === state.currentPatientId; })
        .sort(function (a, b) { return parseDate(b.date).getTime() - parseDate(a.date).getTime(); });
    if (patientDocs.length === 0) {
        documentsList.innerHTML = '<p class="empty-list-message">Nenhum documento encontrado para este paciente.</p>';
        return;
    }
    patientDocs.forEach(function (doc) {
        var _a, _b, _c, _d;
        var isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);
        var isProcessable = doc.type === 'audio' || doc.type === 'transcription';
        var item = document.createElement('div');
        item.className = "document-item document-".concat(doc.type);
        item.dataset.id = doc.id;
        // Adiciona classe 'active' se for o documento selecionado globalmente
        if (doc.id === state.currentDocumentId) {
            item.classList.add('active');
        }
        item.innerHTML = "\n            <div class=\"document-icon\" style=\"color: ".concat(doc.color || 'var(--text-secondary)', "\"> <i class=\"").concat(doc.icon || 'fas fa-file', "\"></i> </div>\n            <div class=\"document-info\">\n                <div class=\"document-title\">").concat(escapeHtml(doc.title), "</div>\n                <div class=\"document-meta\">").concat(escapeHtml(doc.date), " ").concat(escapeHtml(doc.time || ''), "</div>\n            </div>\n            <div class=\"document-actions\">\n                <button class=\"document-action-btn view-doc\" title=\"Visualizar\"><i class=\"fas fa-eye\"></i></button>\n                ").concat(isEditable ? "<button class=\"document-action-btn edit-doc\" title=\"Editar\"><i class=\"fas fa-edit\"></i></button>" : '', "\n                ").concat(isProcessable ? "<button class=\"document-action-btn process-doc\" title=\"Processar\"><i class=\"fas fa-cogs\"></i></button>" : '', "\n                <button class=\"document-action-btn download-doc\" title=\"Download\"><i class=\"fas fa-download\"></i></button>\n            </div>");
        (_a = item.querySelector('.view-doc')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) { e.stopPropagation(); viewDocument(doc.id); });
        (_b = item.querySelector('.edit-doc')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) { e.stopPropagation(); editDocument(doc.id); });
        (_c = item.querySelector('.process-doc')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (e) { e.stopPropagation(); startProcessingDocument(doc.id); });
        (_d = item.querySelector('.download-doc')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function (e) { e.stopPropagation(); downloadDocument(doc.id); });
        // Clicar no item o define como ativo globalmente (para edição/processamento)
        item.addEventListener('click', function () {
            setActiveDocumentItem(doc.id); // Atualiza o estado e a classe 'active'
        });
        documentsList.appendChild(item);
    });
}
// --- Animações ---
/** Inicializa animações fluidas (ripple) */
function initFluidAnimations() {
    var rippleElements = document.querySelectorAll("\n        .btn, .toolbar-btn, .library-btn, .recording-btn,\n        .patient-tab, .document-format-option, .dimensional-tab,\n        .date-nav-btn, .appointment-action, .mobile-menu-item,\n        .sidebar-link, .document-item, .patient-card, .library-filter,\n        .document-action-btn, .upload-preview-remove, .modal-close\n    ");
    rippleElements.forEach(function (element) {
        element.addEventListener('click', function (e) {
            if (element.matches(':disabled') || element.classList.contains('disabled'))
                return;
            // Cria o elemento span do ripple
            var ripple = document.createElement('span');
            ripple.classList.add('ripple');
            var rect = element.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            var x = e.clientX - rect.left - size / 2;
            var y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = "".concat(size, "px");
            ripple.style.left = "".concat(x, "px");
            ripple.style.top = "".concat(y, "px");
            element.appendChild(ripple);
            ripple.classList.add('ripple-animation');
            ripple.addEventListener('animationend', function () {
                ripple.remove();
            });
        });
    });
}
// --- Autenticação ---
/** Configura o formulário de login */
function setupLogin() {
    var loginForm = document.getElementById('loginForm');
    var passwordInput = document.getElementById('password');
    var passwordError = document.getElementById('passwordError');
    var loginScreen = document.getElementById('loginScreen');
    var appContainer = document.getElementById('appContainer');
    if (!loginForm || !passwordInput || !passwordError || !loginScreen || !appContainer) {
        console.error("Elementos de login não encontrados.");
        return;
    }
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var password = passwordInput.value;
        var correctPassword = "123"; // Senha de demonstração
        if (password === correctPassword) {
            passwordError.style.display = 'none';
            showToast('success', 'Login bem-sucedido', 'Bem-vindo ao VINTRA!');
            gsap.to(loginScreen, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: function () {
                    loginScreen.style.display = 'none';
                    loginScreen.classList.remove('visible');
                    gsap.set(appContainer, { display: 'flex', opacity: 0 });
                    gsap.to(appContainer, {
                        opacity: 1,
                        duration: 0.5,
                        ease: "power1.out",
                        onComplete: function () {
                            state.currentView = null; // Força a renderização inicial
                            window.switchView('dashboard');
                            // ADICIONE ESTAS LINHAS
                            setTimeout(function () {
                                var dashboardView = document.getElementById('dashboard-view');
                                if (dashboardView) {
                                    dashboardView.style.display = 'block';
                                    dashboardView.classList.add('active');
                                    renderPatientSelectionOnDashboard();
                                }
                            }, 500);
                        }
                    });
                }
            });
        }
        else {
            // código existente para senha incorreta
        }
    });
    /** Simula o logout do usuário */
    function logout() {
        var loginScreen = document.getElementById('loginScreen');
        var appContainer = document.getElementById('appContainer');
        var passwordInput = document.getElementById('password');
        if (!loginScreen || !appContainer || !passwordInput)
            return;
        showToast('info', 'Logout', 'Você saiu da sua conta.');
        gsap.to(appContainer, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: function () {
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
    function setupNavigation() {
        document.body.addEventListener('click', function (e) {
            var _a;
            var link = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest('[data-target]');
            if (link === null || link === void 0 ? void 0 : link.dataset.target) {
                e.preventDefault(); // Previne comportamento padrão para todos os links tratados
                var targetView = link.dataset.target;
                switch (targetView) {
                    case 'perfil':
                    case 'preferencias':
                        showToast('info', 'Funcionalidade Futura', "".concat(targetView.charAt(0).toUpperCase() + targetView.slice(1), " ainda n\u00E3o implementado."));
                        closeMobileMenu();
                        break;
                    case 'sair':
                        logout();
                        break;
                    default:
                        // Troca de view normal
                        if (state.currentView !== targetView) {
                            window.switchView(targetView);
                        }
                        else {
                            // Se clicou no link da view atual, apenas fecha o menu mobile
                            closeMobileMenu();
                        }
                        break;
                }
            }
        });
    }
    /** Atualiza o estado ativo dos links de navegação */
    function updateNavigation(activeViewId) {
        var allLinks = document.querySelectorAll('.nav-item[data-target], .sidebar-link[data-target], .mobile-menu-item[data-target]');
        allLinks.forEach(function (link) {
            var isActive = link.dataset.target === activeViewId;
            link.classList.toggle('active', isActive);
        });
        closeMobileMenu();
    }
    /** Configura o toggle da sidebar */
    function setupSidebar() {
        var toggleBtn = document.getElementById('sidebarToggle');
        var sidebar = document.querySelector('.app-sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', function () {
                sidebar.classList.toggle('expanded');
                document.body.classList.toggle('sidebar-expanded', sidebar.classList.contains('expanded'));
            });
        }
    }
    /** Configura o menu mobile */
    function setupMobileMenu() {
        var openBtn = document.getElementById('mobileMenuBtn');
        var closeBtn = document.querySelector('.mobile-menu-close');
        var backdrop = document.getElementById('mobileMenuBackdrop');
        var menu = document.getElementById('mobileMenu');
        if (!openBtn || !closeBtn || !backdrop || !menu) {
            console.error("Elementos do menu mobile não encontrados.");
            return;
        }
        openBtn.addEventListener('click', openMobileMenu);
        closeBtn.addEventListener('click', closeMobileMenu);
        backdrop.addEventListener('click', closeMobileMenu);
    }
    /** Abre o menu mobile */
    function openMobileMenu() {
        var menu = document.getElementById('mobileMenu');
        var backdrop = document.getElementById('mobileMenuBackdrop');
        if (menu && backdrop) {
            backdrop.classList.add('open');
            menu.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }
    /** Fecha o menu mobile */
    function closeMobileMenu() {
        var menu = document.getElementById('mobileMenu');
        var backdrop = document.getElementById('mobileMenuBackdrop');
        if ((menu === null || menu === void 0 ? void 0 : menu.classList.contains('open')) && backdrop) {
            menu.classList.remove('open');
            backdrop.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
    // --- Troca de Views ---
    /**
     * Alterna entre as views principais da aplicação.
     * @param viewId - O ID da view de destino (sem o sufixo '-view').
     * @param force - Força a troca mesmo que já esteja na mesma view (opcional).
     */
    window.switchView = function (viewId, force) {
        if (force === void 0) { force = false; }
        var newViewElem = document.getElementById("".concat(viewId, "-view"));
        if (!newViewElem) {
            console.error("View n\u00E3o encontrada: ".concat(viewId, "-view"));
            showToast('error', 'Erro de Navegação', "A view '".concat(viewId, "' n\u00E3o existe."));
            return;
        }
        console.log("Trocando para view: ".concat(viewId));
        // Desativa todas as views primeiro
        document.querySelectorAll('.workspace').forEach(function (view) {
            view.style.display = 'none';
            view.classList.remove('active');
        });
        // Define a exibição baseada no tipo de view
        var newViewDisplayStyle = (viewId === 'library' || viewId === 'patient' || viewId === 'results' || viewId === 'processing') ? 'flex' : 'block';
        // Configura e exibe a nova view
        newViewElem.style.display = newViewDisplayStyle;
        newViewElem.classList.add('active');
        newViewElem.scrollTop = 0;
        // Atualiza o estado e executa lógica específica
        state.currentView = viewId;
        updateNavigation(viewId);
        // Executa lógica específica para cada view
        if (viewId === 'dashboard') {
            renderPatientSelectionOnDashboard();
        }
        else if (viewId === 'library') {
            renderDocumentLibrary();
            if (state.currentDocumentId) {
                viewDocumentInWorkspace(state.currentDocumentId);
            }
            else {
                showEmptyDocumentView();
            }
        }
        if (state.currentView === viewId && !force) {
            console.log("J\u00E1 est\u00E1 na view: ".concat(viewId));
            closeMobileMenu();
            return;
        }
        if (state.isProcessing) {
            showToast('warning', 'Processo em andamento', 'Por favor, aguarde a conclusão do processo atual.');
            return;
        }
        // Verifica acesso às views que requerem paciente
        if ((viewId === 'library' || viewId === 'new' || viewId === 'processing' || viewId === 'results') && !state.currentPatientId) {
            showToast('warning', 'Selecione um Paciente', 'Por favor, selecione um paciente no dashboard para acessar esta funcionalidade.');
            window.switchView('dashboard');
            return;
        }
        console.log("Trocando para view: ".concat(viewId));
        var currentViewElem = state.currentView ? document.getElementById("".concat(state.currentView, "-view")) : null;
        var newViewDisplayStyle = (viewId === 'library' || viewId === 'patient' || viewId === 'results' || viewId === 'processing') ? 'flex' : 'block'; // Ajustado para novas views
        var showNewView = function () {
            gsap.set(newViewElem, { display: newViewDisplayStyle, opacity: 0, y: 15 });
            newViewElem.scrollTop = 0;
            gsap.to(newViewElem, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: function () {
                    // Funções pós-ativação da view
                    switch (viewId) {
                        case 'patient':
                            activatePatientTab(state.activePatientTab || 'summary-panel');
                            break;
                        case 'library':
                            renderDocumentLibrary();
                            if (state.currentDocumentId) {
                                viewDocumentInWorkspace(state.currentDocumentId);
                            }
                            else {
                                showEmptyDocumentView();
                            }
                            break;
                        case 'dashboard':
                            renderPatientSelectionOnDashboard();
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
                onComplete: function () {
                    currentViewElem.style.display = 'none';
                    currentViewElem.style.transform = '';
                    showNewView();
                }
            });
        }
        else {
            showNewView(); // Primeira carga
        }
    };
    // --- Painel do Paciente (#patient-view) ---
    /**
     * Abre o painel de um paciente específico (chamado a partir do dashboard)
     * Função global para ser acessível via HTML
     */
    window.openPatientPanel = function (patientId) {
        var patient = state.recentPatients.find(function (p) { return p.id === patientId; });
        if (!patient) {
            showToast('error', 'Erro', 'Paciente não encontrado.');
            return;
        }
        console.log("Abrindo painel para paciente: ".concat(patient.name, " (ID: ").concat(patientId, ")"));
        state.currentPatientId = patientId;
        // Atualiza informações no header do paciente (assumindo que os elementos existem em #patient-view)
        var nameElem = document.querySelector('#patient-view .patient-name');
        var detailsElem = document.querySelector('#patient-view .patient-details');
        if (nameElem)
            nameElem.textContent = escapeHtml(patient.name);
        if (detailsElem)
            detailsElem.textContent = "".concat(escapeHtml(String(patient.age)), " anos \u2022 ").concat(escapeHtml(patient.gender), " \u2022 Prontu\u00E1rio #").concat(escapeHtml(patientId.replace('patient-', '')));
        state.activePatientTab = 'summary-panel'; // Sempre começa no resumo
        window.switchView('patient');
        // A ativação da tab e gráfico ocorre no onComplete do switchView
    };
    /** Configura as abas do painel de paciente */
    function setupPatientTabs() {
        var _a;
        var tabsContainer = document.querySelector('#patient-view .patient-tabs');
        if (!tabsContainer)
            return;
        tabsContainer.addEventListener('click', function (e) {
            var _a;
            var tab = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest('.patient-tab');
            if ((tab === null || tab === void 0 ? void 0 : tab.dataset.panel) && !tab.classList.contains('active')) {
                activatePatientTab(tab.dataset.panel);
            }
        });
        // Botão Voltar
        (_a = document.getElementById('backToDashboardBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', goBack);
    }
    /** Ativa uma aba específica no painel do paciente */
    function activatePatientTab(panelId) {
        if (!state.currentPatientId)
            return; // Precisa de um paciente ativo
        console.log("Ativando aba do paciente: ".concat(panelId));
        state.activePatientTab = panelId;
        // Atualiza estilo das abas
        document.querySelectorAll('#patient-view .patient-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab.dataset.panel === panelId);
        });
        // Animação de troca de painéis
        var panelsContainer = document.querySelector('#patient-view .patient-tab-panels');
        var activePanel = document.getElementById(panelId);
        var currentActivePanel = panelsContainer === null || panelsContainer === void 0 ? void 0 : panelsContainer.querySelector('.patient-tab-panel.active');
        if (!activePanel) {
            console.error("Painel n\u00E3o encontrado: ".concat(panelId));
            return;
        }
        var showActivePanel = function () {
            gsap.set(activePanel, { display: 'block', opacity: 0 });
            activePanel.classList.add('active');
            activePanel.scrollTop = 0;
            gsap.to(activePanel, {
                opacity: 1,
                duration: 0.3,
                ease: "power1.out",
                onComplete: function () {
                    if (panelId === 'summary-panel') {
                        updateDimensionalChart();
                    }
                    else if (panelId === 'repository-panel') {
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
                onComplete: function () {
                    currentActivePanel.classList.remove('active');
                    currentActivePanel.style.display = 'none';
                    showActivePanel();
                }
            });
        }
        else if (!currentActivePanel) {
            showActivePanel();
        }
    }
    /** Função para voltar da view do paciente para o dashboard */
    function goBack() {
        state.currentPatientId = null; // Limpa o paciente ativo
        window.switchView('dashboard');
    }
    /** Simula o processamento de um documento com IA (Nova função) */
    function processDocumentWithAI() {
        if (!state.currentDocumentId) {
            showToast('warning', 'Nenhum Documento Selecionado', 'Por favor, selecione um documento para processar.');
            return;
        }
        var doc = state.documents.find(function (d) { return d.id === state.currentDocumentId; });
        if (!doc) {
            showToast('error', 'Documento não encontrado', 'O documento selecionado não foi encontrado.');
            return;
        }
        if (doc.type !== 'transcription' && doc.type !== 'audio') {
            showToast('warning', 'Tipo de Documento Inválido', 'Apenas transcrições ou áudios podem ser processados.');
            return;
        }
        showToast('info', 'Processamento IA', 'Esta funcionalidade será implementada em uma versão futura.');
        // Aqui entraria a lógica real de processamento com IA
    }
    // --- Gráficos e Visualizações ---
    /** Inicializa instâncias de gráficos (vazias inicialmente) */
    function initCharts() {
        window.dimensionalChart = null;
        window.modalChart = null;
    }
    /** Atualiza o gráfico radar dimensional no painel do paciente */
    function updateDimensionalChart() {
        var _a;
        var chartElem = document.getElementById('dimensionalRadarChart');
        // Só atualiza se a view e a tab estiverem corretas e o Chart.js carregado
        if (!chartElem || typeof Chart === 'undefined' || state.currentView !== 'patient' || state.activePatientTab !== 'summary-panel') {
            return;
        }
        console.log("Atualizando gráfico dimensional do paciente...");
        if (window.dimensionalChart instanceof Chart) {
            window.dimensionalChart.destroy();
        }
        // TODO: Obter dados reais do paciente state.currentPatientId
        var patientData = state.dimensionalData; // Usando dados de exemplo
        var data = {
            labels: [
                'Valência', 'Excitação', 'Dominância', 'Intensidade',
                'Complexidade', 'Coerência', 'Flexibilidade', 'Dissonância',
                'Persp. Temporal', 'Autocontrole' // Autonomia
            ],
            datasets: [{
                    label: "Paciente #".concat(((_a = state.currentPatientId) === null || _a === void 0 ? void 0 : _a.replace('patient-', '')) || 'N/A'),
                    data: [
                        patientData.emocional.valencia, patientData.emocional.excitacao, patientData.emocional.dominancia, patientData.emocional.intensidade,
                        patientData.cognitiva.complexidade, patientData.cognitiva.coerencia, patientData.cognitiva.flexibilidade, patientData.cognitiva.dissonancia,
                        patientData.autonomia.perspectivaTemporal.media, patientData.autonomia.autocontrole
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
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            elements: { line: { borderWidth: 2 } },
            scales: {
                r: {
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
            window.dimensionalChart = new Chart(chartElem.getContext('2d'), { type: 'radar', data: data, options: options });
        }
        catch (error) {
            console.error("Erro ao criar gráfico dimensional do paciente:", error);
            showToast('error', 'Erro no Gráfico', 'Não foi possível exibir a análise dimensional.');
        }
    }
    /** Configura a visualização dimensional modal */
    function setupDimensionalVisualizations() {
        var openModalBtn = document.querySelector('.activate-dimensional-space'); // Botão no header
        var openModalBtnPatient = document.querySelector('#patient-view .dimensional-summary .btn'); // Botão no painel do paciente
        var modalOverlay = document.getElementById('dimensionalModal');
        var closeBtn = document.getElementById('dimensionalModalClose');
        var tabsContainer = modalOverlay === null || modalOverlay === void 0 ? void 0 : modalOverlay.querySelector('.dimensional-tabs');
        openModalBtn === null || openModalBtn === void 0 ? void 0 : openModalBtn.addEventListener('click', showDimensionalModal);
        openModalBtnPatient === null || openModalBtnPatient === void 0 ? void 0 : openModalBtnPatient.addEventListener('click', showDimensionalModal);
        closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', hideDimensionalModal);
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) {
                    hideDimensionalModal();
                }
            });
        }
        if (tabsContainer) {
            tabsContainer.addEventListener('click', function (e) {
                var _a;
                var tab = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest('.dimensional-tab');
                if ((tab === null || tab === void 0 ? void 0 : tab.dataset.view) && !tab.classList.contains('active')) {
                    activateDimensionalView(tab.dataset.view);
                }
            });
        }
    }
    /** Mostra o modal de visualização dimensional */
    function showDimensionalModal() {
        var modal = document.getElementById('dimensionalModal');
        if (modal) {
            console.log("Mostrando modal dimensional");
            gsap.set(modal, { display: 'flex', opacity: 0 });
            gsap.to(modal, {
                opacity: 1,
                duration: 0.3,
                ease: 'power1.out',
                onComplete: function () {
                    activateDimensionalView('radar'); // Ativa view padrão
                }
            });
            gsap.fromTo(modal.querySelector('.modal-container'), { scale: 0.95, y: 10 }, { scale: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        }
    }
    /** Esconde o modal de visualização dimensional */
    function hideDimensionalModal() {
        var modal = document.getElementById('dimensionalModal');
        if (modal) {
            console.log("Escondendo modal dimensional");
            gsap.to(modal, {
                opacity: 0,
                duration: 0.3,
                ease: 'power1.in',
                onComplete: function () {
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
    function activateDimensionalView(viewType) {
        var modal = document.getElementById('dimensionalModal');
        if (!modal || modal.style.display === 'none')
            return;
        console.log("Ativando visualiza\u00E7\u00E3o dimensional: ".concat(viewType));
        state.activeDimensionalView = viewType;
        // Atualiza estilo das abas
        modal.querySelectorAll('.dimensional-tabs .dimensional-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab.dataset.view === viewType);
        });
        // Animação de troca de painéis
        var panelsContainer = modal.querySelector('.dimensional-views');
        var activePanel = document.getElementById("".concat(viewType, "-view"));
        var currentActivePanel = panelsContainer === null || panelsContainer === void 0 ? void 0 : panelsContainer.querySelector('.dimensional-view.active');
        if (!activePanel) {
            console.error("Painel de visualiza\u00E7\u00E3o n\u00E3o encontrado: ".concat(viewType, "-view"));
            return;
        }
        var showActivePanel = function () {
            gsap.set(activePanel, { display: 'flex', opacity: 0 });
            activePanel.classList.add('active');
            gsap.to(activePanel, {
                opacity: 1,
                duration: 0.3,
                ease: "power1.out",
                onComplete: function () {
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
                onComplete: function () {
                    currentActivePanel.classList.remove('active');
                    currentActivePanel.style.display = 'none';
                    showActivePanel();
                }
            });
        }
        else if (!currentActivePanel) {
            showActivePanel();
        }
    }
    /** Atualiza o gráfico radar no modal dimensional */
    function updateModalDimensionalChart() {
        var chartElem = document.getElementById('modalRadarChart');
        var modal = document.getElementById('dimensionalModal');
        if (!chartElem || typeof Chart === 'undefined' || !modal || modal.style.display === 'none') {
            return;
        }
        console.log("Atualizando gráfico dimensional do modal...");
        if (window.modalChart instanceof Chart) {
            window.modalChart.destroy();
        }
        // TODO: Usar dados relevantes (paciente atual ou gerais)
        var modalData = state.dimensionalData; // Usando dados de exemplo
        var data = {
            labels: [
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
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            elements: { line: { borderWidth: 2 } },
            scales: { r: { angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' }, grid: { color: 'rgba(0, 0, 0, 0.1)' }, pointLabels: { font: { size: 11 } }, suggestedMin: -10, suggestedMax: 10, ticks: { stepSize: 2, backdropColor: 'rgba(255, 255, 255, 0.75)', color: 'rgba(0, 0, 0, 0.6)' } } },
            plugins: { legend: { display: true, position: 'top' } } // Mostra legenda
        };
        try {
            window.modalChart = new Chart(chartElem.getContext('2d'), { type: 'radar', data: data, options: options });
        }
        catch (error) {
            console.error("Erro ao criar gráfico dimensional do modal:", error);
            showToast('error', 'Erro no Gráfico', 'Não foi possível exibir a análise dimensional no modal.');
        }
    }
    // --- Edição de Documentos ---
    /** Configura o sistema de edição de documentos (Modal) */
    function setupDocumentEditing() {
        var modalOverlay = document.getElementById('editDocumentModal');
        var cancelEditBtn = document.getElementById('cancelEditBtn');
        var saveEditBtn = document.getElementById('saveEditBtn');
        var editModalClose = document.getElementById('editModalClose');
        cancelEditBtn === null || cancelEditBtn === void 0 ? void 0 : cancelEditBtn.addEventListener('click', closeDocumentEditor);
        saveEditBtn === null || saveEditBtn === void 0 ? void 0 : saveEditBtn.addEventListener('click', saveDocumentEdit);
        editModalClose === null || editModalClose === void 0 ? void 0 : editModalClose.addEventListener('click', closeDocumentEditor);
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) {
                    closeDocumentEditor();
                }
            });
        }
    }
    /** Abre o editor de documentos (Modal) */
    function openDocumentEditor(docType, title, content) {
        console.log("Abrindo editor para: ".concat(title, " (Tipo: ").concat(docType, ")"));
        // state.currentDocumentId já deve estar definido por quem chamou editDocument()
        state.currentDocumentType = docType; // Guarda o tipo para salvar
        var modal = document.getElementById('editDocumentModal');
        var modalTitle = document.getElementById('editModalTitle');
        var editor = document.getElementById('documentEditor');
        if (modal && modalTitle && editor) {
            modalTitle.textContent = title;
            editor.value = content;
            gsap.set(modal, { display: 'flex', opacity: 0 });
            gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power1.out' });
            gsap.fromTo(modal.querySelector('.modal-container'), { scale: 0.95, y: 10 }, { scale: 1, y: 0, duration: 0.4, ease: 'power2.out', onComplete: function () { return editor.focus(); } });
        }
        else {
            console.error("Elementos do modal de edição não encontrados.");
        }
    }
    /** Fecha o editor de documentos (Modal) */
    function closeDocumentEditor() {
        var modal = document.getElementById('editDocumentModal');
        if ((modal === null || modal === void 0 ? void 0 : modal.style.display) !== 'none') {
            console.log("Fechando editor de documento.");
            gsap.to(modal, {
                opacity: 0,
                duration: 0.3,
                ease: 'power1.in',
                onComplete: function () {
                    if (modal)
                        modal.style.display = 'none';
                    var editor = document.getElementById('documentEditor');
                    if (editor)
                        editor.value = '';
                    state.currentDocumentType = null; // Limpa tipo ao fechar
                }
            });
        }
    }
    /** Salva as edições feitas no documento (Modal) */
    function saveDocumentEdit() {
        var editor = document.getElementById('documentEditor');
        if (!editor || !state.currentDocumentType || !state.currentDocumentId) {
            console.error("Não é possível salvar: editor, tipo ou ID do documento ausente.");
            showToast('error', 'Erro ao Salvar', 'Não foi possível identificar o documento a ser salvo.');
            return;
        }
        var newContent = editor.value;
        // Cria a chave dinamicamente com type assertion
        var docKey = "".concat(state.currentDocumentType, "Text");
        console.log("Salvando documento: ID ".concat(state.currentDocumentId, ", Tipo ").concat(state.currentDocumentType));
        // Atualiza o conteúdo no estado global (simulação)
        if (state.hasOwnProperty(docKey)) {
            // Atribuição segura usando a chave tipada
            state[docKey] = newContent;
            console.log("Conte\u00FAdo para ".concat(docKey, " atualizado no estado."));
            // Atualiza a visualização se o documento editado estiver visível
            if (state.currentView === 'library' && document.querySelector("#documentView [data-id=\"".concat(state.currentDocumentId, "\"]"))) {
                viewDocumentInWorkspace(state.currentDocumentId);
            }
            else if (state.currentView === 'results' && state.activeResultsTab === "".concat(state.currentDocumentType, "-panel")) {
                var contentElement = document.getElementById("".concat(state.currentDocumentType, "ResultContent")) || document.getElementById("".concat(state.currentDocumentType, "Content"));
                var viewElement = contentElement === null || contentElement === void 0 ? void 0 : contentElement.querySelector('.document-view');
                if (viewElement) {
                    viewElement.innerHTML = "<pre>".concat(escapeHtml(newContent), "</pre>");
                }
            }
            else if (state.currentView === 'patient' && state.activePatientTab === 'repository-panel') {
                // Se precisar atualizar alguma pré-visualização na aba do paciente
            }
            showToast('success', 'Documento Salvo', "Altera\u00E7\u00F5es em '".concat(state.currentDocumentType, "' foram salvas."));
            closeDocumentEditor();
        }
        else {
            console.error("Chave de estado inv\u00E1lida para salvar: ".concat(docKey));
            showToast('error', 'Erro ao Salvar', 'Tipo de documento inválido.');
        }
    }
    // --- Ações de Documento (Visualizar, Editar, Download) ---
    /** Visualiza um documento (mostra em modal genérico) */
    function viewDocument(docId) {
        var _a;
        var doc = state.documents.find(function (d) { return d.id === docId; });
        if (!doc) {
            showToast('error', 'Erro', 'Documento não encontrado.');
            return;
        }
        console.log("Visualizando (modal gen\u00E9rico): ".concat(doc.title));
        var content = (_a = getDocumentContent(doc.type)) !== null && _a !== void 0 ? _a : "Conte\u00FAdo para '".concat(doc.type, "' n\u00E3o dispon\u00EDvel.");
        var formattedContent = "<pre style=\"white-space: pre-wrap; word-wrap: break-word; font-size: 0.9rem; max-height: 60vh; overflow-y: auto;\">".concat(escapeHtml(content), "</pre>");
        showGenericModal("Visualizar: ".concat(escapeHtml(doc.title)), formattedContent);
    }
    /** Abre um documento para edição (chamando o modal de edição) */
    function editDocument(docId) {
        var doc = state.documents.find(function (d) { return d.id === docId; });
        if (!doc) {
            showToast('error', 'Erro', 'Documento não encontrado.');
            return;
        }
        if (['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type)) {
            var content = getDocumentContent(doc.type);
            if (content !== null) { // Verifica se o conteúdo foi encontrado
                state.currentDocumentId = docId; // Define o ID do documento que está sendo editado
                openDocumentEditor(doc.type, "Editar ".concat(escapeHtml(doc.title)), content);
            }
            else {
                showToast('error', 'Erro', "Conte\u00FAdo para '".concat(doc.type, "' n\u00E3o encontrado."));
            }
        }
        else {
            showToast('info', 'Não Editável', "Documentos do tipo '".concat(doc.type, "' n\u00E3o podem ser editados diretamente."));
        }
    }
    /** Realiza o download de um documento */
    function downloadDocument(docId) {
        var doc = state.documents.find(function (d) { return d.id === docId; });
        if (!doc) {
            showToast('error', 'Erro', 'Documento não encontrado.');
            return;
        }
        console.log("Iniciando download de: ".concat(doc.title));
        var blob;
        var filename = doc.title.includes('.') ? doc.title : "".concat(doc.title, ".txt");
        if (doc.type === 'audio') {
            // Simulação: Usa state.processedAudioBlob se existir (de uma gravação anterior)
            // Ou cria um blob vazio como placeholder
            if (state.processedAudioBlob && doc.id === 'recording_blob_id') { // Assumindo um ID especial para o blob gravado
                blob = state.processedAudioBlob;
                // Garante extensão correta
                if (!filename.match(/\.(wav|mp3|ogg|m4a)$/i)) {
                    filename = filename.replace(/\.[^/.]+$/, "") + ".wav"; // Assume .wav
                }
            }
            else {
                blob = new Blob(["Simulação de conteúdo de áudio."], { type: 'audio/wav' });
                showToast('info', 'Download Simulado', 'Este é um arquivo de áudio simulado.');
                if (!filename.match(/\.(wav|mp3|ogg|m4a)$/i)) {
                    filename = filename.replace(/\.[^/.]+$/, "") + ".wav";
                }
            }
        }
        else {
            var content = getDocumentContent(doc.type);
            if (content === null) {
                showToast('error', 'Erro no Download', "Conte\u00FAdo para '".concat(doc.type, "' n\u00E3o encontrado."));
                return;
            }
            blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        }
        // Cria link temporário para download
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('success', 'Download Iniciado', "".concat(filename, " est\u00E1 sendo baixado."));
        }, 100);
    }
    /** Obtém o conteúdo de um documento do estado global com base no tipo */
    function getDocumentContent(type) {
        var key = "".concat(type, "Text");
        if (state.hasOwnProperty(key)) {
            return state[key];
        }
        console.warn("Conte\u00FAdo para o tipo '".concat(type, "' n\u00E3o encontrado no estado."));
        return null; // Retorna null se não encontrado
    }
    // --- View: Novo Documento (#new-view) ---
    /** Configura as abas da view "Novo Documento" */
    function setupNewDocumentTabs() {
        var tabsContainer = document.querySelector('#new-view .library-filters'); // Reutiliza estilo
        var contentContainer = document.getElementById('newDocumentContent');
        if (!tabsContainer || !contentContainer) {
            console.error("Elementos das abas de 'Novo Documento' não encontrados.");
            return;
        }
        tabsContainer.addEventListener('click', function (e) {
            var _a;
            var tab = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest('.library-filter');
            if ((tab === null || tab === void 0 ? void 0 : tab.dataset.newTab) && !tab.classList.contains('active')) {
                activateNewDocumentTab(tab.dataset.newTab);
            }
        });
        // Garante que apenas a aba inicial esteja visível e ativa
        activateNewDocumentTab(state.activeNewDocumentTab);
    }
    /** Ativa uma aba específica na view "Novo Documento" */
    function activateNewDocumentTab(tabId) {
        console.log("Ativando aba Novo Documento: ".concat(tabId));
        state.activeNewDocumentTab = tabId;
        var tabsContainer = document.querySelector('#new-view .library-filters');
        var contentContainer = document.getElementById('newDocumentContent');
        if (!tabsContainer || !contentContainer)
            return;
        // Atualiza estilo das abas
        tabsContainer.querySelectorAll('.library-filter').forEach(function (tab) {
            tab.classList.toggle('active', tab.dataset.newTab === tabId);
        });
        // Animação de troca de painéis
        var activePanel = document.getElementById("".concat(tabId, "-tab"));
        var currentActivePanel = contentContainer.querySelector(':scope > div.active');
        if (!activePanel) {
            console.error("Painel n\u00E3o encontrado: ".concat(tabId, "-tab"));
            return;
        }
        var showActivePanel = function () {
            gsap.set(activePanel, { display: 'block', opacity: 0 });
            activePanel.classList.add('active');
            activePanel.scrollTop = 0;
            gsap.to(activePanel, {
                opacity: 1,
                duration: 0.3,
                ease: "power1.out",
                onComplete: function () {
                    var _a;
                    // Focar no elemento relevante, se aplicável
                    if (tabId === 'transcribe') {
                        (_a = document.getElementById('transcriptionText')) === null || _a === void 0 ? void 0 : _a.focus();
                    }
                }
            });
        };
        if (currentActivePanel && currentActivePanel !== activePanel) {
            gsap.to(currentActivePanel, {
                opacity: 0,
                duration: 0.2,
                ease: "power1.in",
                onComplete: function () {
                    currentActivePanel.classList.remove('active');
                    currentActivePanel.style.display = 'none';
                    showActivePanel();
                }
            });
        }
        else if (!currentActivePanel) {
            showActivePanel();
        }
    }
    // --- Gravação de Áudio ---
    /** Configura o módulo de gravação de áudio */
    function setupRecorder() {
        var startBtn = document.getElementById('startRecordingBtn');
        var stopBtn = document.getElementById('stopRecordingBtn');
        var removeBtn = document.getElementById('recordingRemoveBtn');
        var processBtn = document.getElementById('processRecordingBtn');
        startBtn === null || startBtn === void 0 ? void 0 : startBtn.addEventListener('click', startRecording);
        stopBtn === null || stopBtn === void 0 ? void 0 : stopBtn.addEventListener('click', stopRecording);
        removeBtn === null || removeBtn === void 0 ? void 0 : removeBtn.addEventListener('click', resetRecording);
        processBtn === null || processBtn === void 0 ? void 0 : processBtn.addEventListener('click', function () {
            if (state.processedAudioBlob) {
                simulateProcessing('recording');
            }
            else {
                showToast('error', 'Erro', 'Nenhuma gravação para processar.');
            }
        });
        // Inicializa Web Audio API
        try {
            state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            state.analyser = state.audioContext.createAnalyser();
            state.analyser.fftSize = 256;
        }
        catch (e) {
            console.error("Web Audio API não suportada.", e);
            showToast('warning', 'Visualizador Indisponível', 'Seu navegador não suporta a visualização de áudio.');
            var visualizer = document.querySelector('.recording-visualizer');
            if (visualizer)
                visualizer.style.display = 'none';
        }
    }
    /** Inicia a gravação de áudio */
    function startRecording() {
        return __awaiter(this, void 0, Promise, function () {
            var stream_1, visualizer, statusEl, err_1, statusEl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (state.isRecording || state.isProcessing)
                            return [2 /*return*/];
                        console.log("Tentando iniciar gravação...");
                        resetRecordingVisuals();
                        state.audioChunks = [];
                        state.processedAudioBlob = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true, video: false })];
                    case 2:
                        stream_1 = _a.sent();
                        console.log("Acesso ao microfone concedido.");
                        state.mediaRecorder = new MediaRecorder(stream_1);
                        state.mediaRecorder.ondataavailable = function (event) {
                            if (event.data.size > 0) {
                                state.audioChunks.push(event.data);
                            }
                        };
                        state.mediaRecorder.onstop = function () {
                            console.log("MediaRecorder parado.");
                            state.processedAudioBlob = new Blob(state.audioChunks, { type: 'audio/wav' });
                            console.log("Blob de áudio criado:", state.processedAudioBlob);
                            state.audioChunks = [];
                            stream_1.getTracks().forEach(function (track) { return track.stop(); });
                            console.log("Tracks de áudio paradas.");
                            updateUIAfterRecording();
                        };
                        state.mediaRecorder.start();
                        state.isRecording = true;
                        state.recordingStartTime = Date.now();
                        console.log("MediaRecorder iniciado.");
                        startTimer();
                        if (!(state.audioContext && state.analyser)) return [3 /*break*/, 5];
                        if (!(state.audioContext.state === 'suspended')) return [3 /*break*/, 4];
                        return [4 /*yield*/, state.audioContext.resume()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        state.visualizerSource = state.audioContext.createMediaStreamSource(stream_1);
                        state.visualizerSource.connect(state.analyser);
                        startVisualizer();
                        visualizer = document.querySelector('.recording-visualizer');
                        if (visualizer)
                            visualizer.style.opacity = '1';
                        _a.label = 5;
                    case 5:
                        updateUIRecordingState(true);
                        statusEl = document.getElementById('recordingStatus');
                        if (statusEl)
                            statusEl.textContent = 'Gravando...';
                        return [3 /*break*/, 7];
                    case 6:
                        err_1 = _a.sent();
                        console.error("Erro ao iniciar gravação:", err_1);
                        state.isRecording = false;
                        updateUIRecordingState(false);
                        statusEl = document.getElementById('recordingStatus');
                        if (statusEl)
                            statusEl.textContent = 'Erro ao iniciar';
                        if (err_1.name === 'NotAllowedError' || err_1.name === 'PermissionDeniedError') {
                            showToast('error', 'Permissão Negada', 'Você precisa permitir o acesso ao microfone.');
                        }
                        else if (err_1.name === 'NotFoundError' || err_1.name === 'DevicesNotFoundError') {
                            showToast('error', 'Microfone Não Encontrado', 'Nenhum microfone foi detectado.');
                        }
                        else {
                            showToast('error', 'Erro na Gravação', 'Não foi possível iniciar a gravação.');
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    /** Para a gravação de áudio */
    function stopRecording() {
        if (!state.isRecording || !state.mediaRecorder)
            return;
        console.log("Parando gravação...");
        try {
            state.mediaRecorder.stop(); // Aciona 'onstop'
            state.isRecording = false;
            stopTimer();
            stopVisualizer();
            updateUIRecordingState(false);
            var statusEl = document.getElementById('recordingStatus');
            if (statusEl)
                statusEl.textContent = 'Processando gravação...';
        }
        catch (error) {
            console.error("Erro ao parar MediaRecorder:", error);
            resetRecording();
            showToast('error', 'Erro ao Parar', 'Não foi possível finalizar a gravação corretamente.');
        }
    }
    /** Atualiza a interface após a gravação ser finalizada e o blob criado */
    function updateUIAfterRecording() {
        console.log("Atualizando UI pós-gravação.");
        var preview = document.getElementById('recordingPreview');
        var fileNameEl = document.getElementById('recordingFileName');
        var fileMetaEl = document.getElementById('recordingFileMeta');
        var processBtn = document.getElementById('processRecordingBtn');
        var statusEl = document.getElementById('recordingStatus');
        if (preview && fileNameEl && fileMetaEl && processBtn && statusEl && state.processedAudioBlob && state.recordingStartTime) {
            var duration = (Date.now() - state.recordingStartTime) / 1000;
            var minutes = Math.floor(duration / 60);
            var seconds = Math.floor(duration % 60);
            var formattedDuration = "".concat(String(minutes).padStart(2, '0'), ":").concat(String(seconds).padStart(2, '0'));
            var fileSize = (state.processedAudioBlob.size / (1024 * 1024)).toFixed(1); // Em MB
            fileNameEl.textContent = "Grava\u00E7\u00E3o_".concat(new Date().toISOString().split('T')[0], ".wav");
            fileMetaEl.textContent = "".concat(fileSize, " MB \u2022 ").concat(formattedDuration);
            gsap.to(preview, { display: 'flex', opacity: 1, duration: 0.3 });
            gsap.to(processBtn, { display: 'inline-flex', opacity: 1, duration: 0.3 });
            statusEl.textContent = 'Gravação finalizada';
        }
        else {
            console.error("Elementos de preview da gravação não encontrados ou blob/startTime ausente.");
            resetRecording(); // Reseta se algo deu errado
        }
    }
    /** Reseta o estado da gravação e a UI */
    function resetRecording() {
        var _a, _b;
        console.log("Resetando gravação.");
        if (state.isRecording) {
            // Tenta parar o MediaRecorder se estiver ativo, mas evita chamar stopRecording() recursivamente
            if (state.mediaRecorder && state.mediaRecorder.state === 'recording') {
                try {
                    state.mediaRecorder.stop();
                }
                catch (e) {
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
        if ((_a = state.visualizerSource) === null || _a === void 0 ? void 0 : _a.mediaStream) {
            state.visualizerSource.mediaStream.getTracks().forEach(function (track) { return track.stop(); });
        }
        (_b = state.visualizerSource) === null || _b === void 0 ? void 0 : _b.disconnect(); // Desconecta a fonte do analyser
        state.visualizerSource = null;
        state.mediaRecorder = null; // Limpa a referência
    }
    /** Reseta apenas os elementos visuais da gravação */
    function resetRecordingVisuals() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        (_a = document.getElementById('startRecordingBtn')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
        (_b = document.getElementById('stopRecordingBtn')) === null || _b === void 0 ? void 0 : _b.classList.add('hidden');
        (_c = document.getElementById('recordingPreview')) === null || _c === void 0 ? void 0 : _c.style.display = 'none';
        (_d = document.getElementById('processRecordingBtn')) === null || _d === void 0 ? void 0 : _d.style.display = 'none';
        (_e = document.getElementById('recordingProgress')) === null || _e === void 0 ? void 0 : _e.style.display = 'none';
        (_f = document.getElementById('recordingTranscriptionSteps')) === null || _f === void 0 ? void 0 : _f.style.display = 'none';
        (_g = document.getElementById('liveTranscriptionPreview')) === null || _g === void 0 ? void 0 : _g.style.display = 'none';
        (_h = document.getElementById('recordingCompletedPanel')) === null || _h === void 0 ? void 0 : _h.style.display = 'none';
        var timeEl = document.getElementById('recordingTime');
        if (timeEl)
            timeEl.textContent = '00:00:00';
        var statusEl = document.getElementById('recordingStatus');
        if (statusEl)
            statusEl.textContent = 'Pronto para gravar';
        var visualizer = document.querySelector('.recording-visualizer');
        if (visualizer)
            visualizer.style.opacity = '0.3';
        var barsContainer = document.getElementById('visualizerBars');
        if (barsContainer)
            barsContainer.innerHTML = ''; // Limpa barras
    }
    /** Atualiza a visibilidade dos botões de gravação */
    function updateUIRecordingState(isRecording) {
        var _a, _b;
        (_a = document.getElementById('startRecordingBtn')) === null || _a === void 0 ? void 0 : _a.classList.toggle('hidden', isRecording);
        (_b = document.getElementById('stopRecordingBtn')) === null || _b === void 0 ? void 0 : _b.classList.toggle('hidden', !isRecording);
    }
    /** Inicia o timer da gravação */
    function startTimer() {
        if (state.recordingInterval)
            clearInterval(state.recordingInterval); // Limpa timer anterior
        var timerElement = document.getElementById('recordingTime');
        if (!timerElement)
            return;
        state.recordingInterval = window.setInterval(function () {
            if (!state.recordingStartTime)
                return;
            var elapsedSeconds = Math.floor((Date.now() - state.recordingStartTime) / 1000);
            var hours = Math.floor(elapsedSeconds / 3600);
            var minutes = Math.floor((elapsedSeconds % 3600) / 60);
            var seconds = elapsedSeconds % 60;
            timerElement.textContent = "".concat(String(hours).padStart(2, '0'), ":").concat(String(minutes).padStart(2, '0'), ":").concat(String(seconds).padStart(2, '0'));
        }, 1000);
    }
    /** Para o timer da gravação */
    function stopTimer() {
        if (state.recordingInterval) {
            clearInterval(state.recordingInterval);
            state.recordingInterval = null;
        }
    }
    /** Inicia o visualizador de áudio */
    function startVisualizer() {
        if (!state.analyser || !state.audioContext || state.audioContext.state === 'suspended' || !state.visualizerSource) {
            console.warn("AudioContext/Analyser/Source não disponível/pronto, não iniciando visualizador.");
            return;
        }
        var visualizerBars = document.getElementById('visualizerBars');
        if (!visualizerBars)
            return;
        visualizerBars.innerHTML = ''; // Limpa barras antigas
        var bufferLength = state.analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        var barCount = 30;
        for (var i = 0; i < barCount; i++) {
            var bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            visualizerBars.appendChild(bar);
        }
        var bars = visualizerBars.childNodes;
        var draw = function () {
            // Verifica se ainda deve desenhar
            if (!state.isRecording || !state.analyser) {
                stopVisualizer(); // Para o loop se a gravação parou ou analyser sumiu
                return;
            }
            state.visualizerRafId = requestAnimationFrame(draw);
            state.analyser.getByteFrequencyData(dataArray);
            var barHeightMultiplier = visualizerBars.clientHeight / 128;
            var step = Math.floor(bufferLength / barCount);
            for (var i = 0; i < barCount; i++) {
                var sum = 0;
                for (var j = 0; j < step; j++) {
                    sum += dataArray[i * step + j];
                }
                var avg = sum / step || 0; // Evita NaN
                var barHeight = Math.max(1, Math.min(avg * barHeightMultiplier * 1.5, visualizerBars.clientHeight));
                if (bars[i]) {
                    bars[i].style.height = "".concat(barHeight, "px");
                }
            }
        };
        // Reinicia o RAF ID antes de chamar draw
        if (state.visualizerRafId)
            cancelAnimationFrame(state.visualizerRafId);
        state.visualizerRafId = null;
        draw();
    }
    /** Para o visualizador de áudio */
    function stopVisualizer() {
        if (state.visualizerRafId) {
            cancelAnimationFrame(state.visualizerRafId);
            state.visualizerRafId = null;
        }
        // Não desconectar a source aqui, pois ela pode ser necessária para parar o stream
        // A desconexão e parada do stream ocorrem em stopRecording ou resetRecording
        var visualizerBars = document.getElementById('visualizerBars');
        if (visualizerBars) {
            gsap.to(".visualizer-bar", { height: 1, duration: 0.3, ease: 'power1.out', stagger: 0.01 });
        }
        console.log("Visualizador parado.");
    }
    // --- Upload de Arquivo ---
    /** Configura o módulo de upload de arquivos */
    function setupUpload() {
        var uploadArea = document.getElementById('uploadArea');
        var uploadInput = document.getElementById('uploadInput');
        var removeBtn = document.getElementById('uploadRemoveBtn');
        var processBtn = document.getElementById('processUploadBtn');
        if (!uploadArea || !uploadInput || !removeBtn || !processBtn) {
            console.error("Elementos de upload não encontrados.");
            return;
        }
        uploadArea.addEventListener('click', function () { return uploadInput.click(); });
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        ['dragenter', 'dragover'].forEach(function (eventName) {
            uploadArea.addEventListener(eventName, function () { return uploadArea.classList.add('dragover'); }, false);
        });
        ['dragleave', 'drop'].forEach(function (eventName) {
            uploadArea.addEventListener(eventName, function () { return uploadArea.classList.remove('dragover'); }, false);
        });
        uploadArea.addEventListener('drop', function (e) {
            var dt = e.dataTransfer;
            var files = dt === null || dt === void 0 ? void 0 : dt.files;
            if (files === null || files === void 0 ? void 0 : files.length) {
                handleFiles(files);
            }
        }, false);
        uploadInput.addEventListener('change', function (e) {
            var _a;
            var target = e.target;
            if ((_a = target.files) === null || _a === void 0 ? void 0 : _a.length) {
                handleFiles(target.files);
            }
        });
        removeBtn.addEventListener('click', resetUpload);
        processBtn.addEventListener('click', function () {
            if (state.uploadedFile) {
                simulateProcessing('upload');
            }
            else {
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
        var file = files[0];
        // TODO: Validação de tipo de arquivo (ex: audio/*, text/plain)
        if (!file.type.startsWith('audio/') && file.type !== 'text/plain') {
            showToast('warning', 'Tipo Inválido', 'Apenas arquivos de áudio ou texto plano são suportados.');
            resetUpload(); // Limpa se o tipo for inválido
            return;
        }
        console.log("Arquivo selecionado:", file.name, file.size, file.type);
        state.uploadedFile = file;
        var preview = document.getElementById('uploadPreview');
        var fileNameEl = document.getElementById('uploadFileName');
        var fileMetaEl = document.getElementById('uploadFileMeta');
        var processBtn = document.getElementById('processUploadBtn');
        var iconEl = preview === null || preview === void 0 ? void 0 : preview.querySelector('.upload-preview-icon i');
        if (preview && fileNameEl && fileMetaEl && processBtn && iconEl) {
            fileNameEl.textContent = escapeHtml(file.name);
            fileMetaEl.textContent = "".concat((file.size / (1024 * 1024)).toFixed(1), " MB");
            if (file.type.startsWith('audio/')) {
                iconEl.className = 'fas fa-file-audio';
            }
            else if (file.type === 'text/plain') {
                iconEl.className = 'fas fa-file-alt';
            }
            else {
                iconEl.className = 'fas fa-file'; // Fallback
            }
            gsap.to(preview, { display: 'flex', opacity: 1, duration: 0.3 });
            gsap.to(processBtn, { display: 'inline-flex', opacity: 1, duration: 0.3 });
            // document.getElementById('uploadArea')?.style.display = 'none'; // Opcional
        }
        // Limpa o input para permitir selecionar o mesmo arquivo novamente
        var uploadInput = document.getElementById('uploadInput');
        if (uploadInput)
            uploadInput.value = '';
    }
    /** Reseta o estado do upload e a UI */
    function resetUpload() {
        console.log("Resetando upload.");
        state.uploadedFile = null;
        var preview = document.getElementById('uploadPreview');
        var processBtn = document.getElementById('processUploadBtn');
        var uploadProgress = document.getElementById('uploadProgress');
        var uploadSteps = document.getElementById('uploadTranscriptionSteps');
        var uploadCompleted = document.getElementById('uploadCompletedPanel');
        var uploadInput = document.getElementById('uploadInput');
        if (preview)
            gsap.to(preview, { opacity: 0, duration: 0.2, onComplete: function () { return preview.style.display = 'none'; } });
        if (processBtn)
            gsap.to(processBtn, { opacity: 0, duration: 0.2, onComplete: function () { return processBtn.style.display = 'none'; } });
        if (uploadProgress)
            uploadProgress.style.display = 'none';
        if (uploadSteps)
            uploadSteps.style.display = 'none';
        if (uploadCompleted)
            uploadCompleted.style.display = 'none';
        if (uploadInput)
            uploadInput.value = '';
        // document.getElementById('uploadArea')?.style.display = 'block'; // Opcional
    }
    // --- Transcrição Manual ---
    /** Configura a aba de transcrição manual */
    function setupTranscriptionInput() {
        var processBtn = document.getElementById('processManualTranscriptionBtn');
        var textarea = document.getElementById('transcriptionText');
        if (processBtn && textarea) {
            processBtn.addEventListener('click', function () {
                var text = textarea.value.trim();
                if (text) {
                    // Salva a transcrição manual no estado para uso posterior
                    state.transcriptionText = text;
                    simulateProcessing('manual');
                }
                else {
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
        var elementsToToggle = document.querySelectorAll("\n        .sidebar-link, .mobile-menu-item, #sidebarToggle, #mobileMenuBtn,\n        .library-btn, .document-item, .toolbar-btn, .patient-tab,\n        #startRecordingBtn, #stopRecordingBtn, #processRecordingBtn,\n        #uploadArea, #uploadInput, #processUploadBtn,\n        #processManualTranscriptionBtn, #startProcessingBtn,\n        .document-format-option, .dimensional-tab, .modal-close, .modal-footer button,\n        .document-action-btn, .nav-item\n    "); // Seletores mais abrangentes
        elementsToToggle.forEach(function (el) {
            el.disabled = isProcessing;
            el.classList.toggle('disabled', isProcessing);
        });
        console.log("Estado de processamento: ".concat(isProcessing));
    }
    /**
     * Simula o processamento de um documento (gravação, upload, manual).
     * @param type - O tipo de origem.
     */
    function simulateProcessing(type) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var progressContainerId, stepsContainerId, stepsProgressId, completedPanelId, progressBarId, percentageId, statusId, previewId, actionButtonId, livePreviewId, progressContainer, stepsContainer, completedPanel, previewContainer, actionButton, livePreview, manualTextarea, steps, totalDuration, elapsed, simulatedTranscription, _loop_1, i, originalFileName, newDocId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (state.isProcessing)
                            return [2 /*return*/];
                        setProcessingState(true);
                        console.log("Simulando processamento para: ".concat(type));
                        progressContainerId = "".concat(type, "Progress");
                        stepsContainerId = "".concat(type, "TranscriptionSteps");
                        stepsProgressId = "".concat(type, "TranscriptionStepsProgress");
                        completedPanelId = "".concat(type, "CompletedPanel");
                        progressBarId = "".concat(type, "ProgressBar");
                        percentageId = "".concat(type, "ProgressPercentage");
                        statusId = "".concat(type, "ProgressStatus");
                        previewId = "".concat(type, "Preview");
                        actionButtonId = type === 'recording' ? 'processRecordingBtn' : (type === 'upload' ? 'processUploadBtn' : 'processManualTranscriptionBtn');
                        livePreviewId = 'liveTranscriptionPreview';
                        progressContainer = document.getElementById(progressContainerId);
                        stepsContainer = document.getElementById(stepsContainerId);
                        completedPanel = document.getElementById(completedPanelId);
                        previewContainer = document.getElementById(previewId);
                        actionButton = document.getElementById(actionButtonId);
                        livePreview = document.getElementById(livePreviewId);
                        manualTextarea = document.getElementById('transcriptionText');
                        // Esconde botão de ação e preview (se aplicável)
                        if (actionButton)
                            gsap.to(actionButton, { opacity: 0, duration: 0.2, onComplete: function () { return actionButton.style.display = 'none'; } });
                        if (previewContainer && type !== 'manual')
                            gsap.to(previewContainer, { opacity: 0, duration: 0.2, onComplete: function () { return previewContainer.style.display = 'none'; } });
                        if (type === 'manual' && manualTextarea)
                            manualTextarea.disabled = true;
                        // Mostra indicadores de progresso
                        if (progressContainer)
                            progressContainer.style.display = 'block';
                        if (stepsContainer)
                            stepsContainer.style.display = 'block';
                        if (livePreview && (type === 'recording' || type === 'upload')) {
                            livePreview.style.display = 'block';
                            livePreview.innerHTML = '<p><i>Iniciando análise...</i><span class="typing"></span></p>';
                        }
                        steps = [
                            { name: type === 'upload' ? 'Upload' : (type === 'manual' ? 'Validação' : 'Processando Áudio'), duration: 1000, text: 'Analisando dados...' },
                            { name: type === 'manual' ? 'Processamento' : 'Transcrição', duration: 2000, text: 'Realizando transcrição...' },
                            { name: type === 'manual' ? 'Análise' : 'Diarização', duration: 1500, text: 'Identificando segmentos...' },
                            { name: 'Finalização', duration: 500, text: 'Gerando documento...' }
                        ];
                        totalDuration = steps.reduce(function (sum, step) { return sum + step.duration; }, 0);
                        elapsed = 0;
                        simulatedTranscription = state.transcriptionText || "Transcri\u00E7\u00E3o simulada para ".concat(type, " - ").concat(new Date().toLocaleTimeString(), ". M\u00E9dico: ... Paciente: ...");
                        state.transcriptionText = simulatedTranscription; // Atualiza o estado com a transcrição (simulada ou manual)
                        _loop_1 = function (i) {
                            var step;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        step = steps[i];
                                        updateStepProgress(stepsContainerId, stepsProgressId, i + 1);
                                        updateProgressBar(progressBarId, percentageId, statusId, (elapsed / totalDuration) * 100, step.name);
                                        if (livePreview && (type === 'recording' || type === 'upload')) {
                                            livePreview.innerHTML = "<p><i>".concat(step.text, "</i><span class=\"typing\"></span></p>");
                                            livePreview.scrollTop = livePreview.scrollHeight;
                                        }
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, step.duration); })];
                                    case 1:
                                        _d.sent();
                                        elapsed += step.duration;
                                        if (i < steps.length - 1) {
                                            updateStepProgress(stepsContainerId, stepsProgressId, i + 1, true);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < steps.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        updateProgressBar(progressBarId, percentageId, statusId, 100, 'Concluído');
                        updateStepProgress(stepsContainerId, stepsProgressId, steps.length, true);
                        if (livePreview && (type === 'recording' || type === 'upload')) {
                            livePreview.innerHTML = "<p><i>Transcri\u00E7\u00E3o finalizada.</i></p>";
                        }
                        originalFileName = type === 'upload' ? (_a = state.uploadedFile) === null || _a === void 0 ? void 0 : _a.name : (type === 'recording' ? (_b = document.getElementById('recordingFileName')) === null || _b === void 0 ? void 0 : _b.textContent : 'Transcricao_Manual');
                        newDocId = addProcessedDocument(originalFileName || 'Documento', type);
                        if (newDocId) {
                            state.currentDocumentId = newDocId; // Define o documento recém-criado como ativo
                        }
                        else {
                            console.error("Falha ao criar ID para o novo documento de transcrição.");
                            // Lidar com o erro - talvez mostrar um toast e resetar
                            setProcessingState(false);
                            showToast('error', 'Erro Interno', 'Não foi possível salvar a transcrição processada.');
                            // Resetar a UI específica do tipo de processamento
                            if (type === 'recording')
                                resetRecording();
                            else if (type === 'upload')
                                resetUpload();
                            else if (type === 'manual' && manualTextarea)
                                manualTextarea.disabled = false;
                            return [2 /*return*/]; // Interrompe a função aqui
                        }
                        // Esconde progresso e mostra painel de conclusão
                        if (progressContainer)
                            progressContainer.style.display = 'none';
                        if (stepsContainer)
                            stepsContainer.style.display = 'none';
                        if (livePreview)
                            livePreview.style.display = 'none';
                        if (completedPanel) {
                            completedPanel.classList.add('active');
                            completedPanel.style.display = 'flex';
                        }
                        if (type === 'manual' && manualTextarea)
                            manualTextarea.disabled = false;
                        setProcessingState(false);
                        console.log("Processamento de ".concat(type, " conclu\u00EDdo. Novo Documento ID: ").concat(newDocId));
                        return [2 /*return*/];
                }
            });
        });
    }
    /** Adiciona um documento de transcrição processado à lista */
    function addProcessedDocument(originalFileName, sourceType) {
        var now = new Date();
        var dateStr = now.toLocaleDateString('pt-BR'); // dd/mm/yyyy
        var timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        var safeName = originalFileName.replace(/\.[^/.]+$/, ""); // Remove extensão
        var newId = "doc".concat(Date.now()); // ID único
        // Usa o state.transcriptionText que foi atualizado/simulado em simulateProcessing
        var contentSize = state.transcriptionText ? (state.transcriptionText.length / 1024).toFixed(1) : '0.0';
        var newDoc = {
            id: newId,
            patientId: state.currentPatientId || null,
            title: "Transcri\u00E7\u00E3o_".concat(safeName, ".txt"),
            type: 'transcription',
            date: dateStr,
            time: timeStr,
            icon: 'fas fa-file-alt',
            color: 'var(--accent)',
            size: "".concat(contentSize, " KB")
        };
        // Verifica se já existe um documento com o mesmo ID (improvável, mas seguro)
        if (state.documents.some(function (doc) { return doc.id === newId; })) {
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
    function updateStepProgress(stepsContainerId, progressIndicatorId, currentStep, completed) {
        if (completed === void 0) { completed = false; }
        var stepsContainer = document.getElementById(stepsContainerId);
        var progressIndicator = document.getElementById(progressIndicatorId);
        if (!stepsContainer || !progressIndicator)
            return;
        var steps = stepsContainer.querySelectorAll('.transcription-step');
        steps.forEach(function (step, index) {
            var stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            if (stepNumber < currentStep || (stepNumber === currentStep && completed)) {
                step.classList.add('completed');
            }
            else if (stepNumber === currentStep && !completed) {
                step.classList.add('active');
            }
        });
        var progressPercentage = completed ? ((currentStep) / steps.length) * 100 : ((currentStep - 0.5) / steps.length) * 100;
        progressIndicator.style.width = "".concat(Math.min(100, progressPercentage), "%");
    }
    /** Atualiza a UI da barra de progresso */
    function updateProgressBar(barId, percentageId, statusId, percentage, statusText) {
        var bar = document.getElementById(barId);
        var percentEl = document.getElementById(percentageId);
        var statusEl = document.getElementById(statusId);
        if (bar)
            bar.style.width = "".concat(Math.min(percentage, 100), "%");
        if (percentEl)
            percentEl.textContent = "".concat(Math.round(Math.min(percentage, 100)), "%");
        if (statusEl)
            statusEl.textContent = statusText;
    }
    // --- View: Processamento (#processing-view) ---
    /** Configura a view de processamento de documentos */
    function setupProcessing() {
        var optionsContainer = document.querySelector('#processing-view .document-format-options');
        var startBtn = document.getElementById('startProcessingBtn');
        // O botão viewResultsBtn já é tratado no setupEventListeners global
        if (optionsContainer) {
            optionsContainer.addEventListener('click', function (e) {
                var _a;
                var option = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest('.document-format-option');
                if (option) {
                    option.classList.toggle('active');
                }
            });
        }
        if (startBtn) {
            startBtn.addEventListener('click', function () {
                if (!optionsContainer)
                    return;
                var selectedFormats = Array.from(optionsContainer.querySelectorAll('.document-format-option.active'))
                    .map(function (el) { return el.dataset.format; })
                    .filter(function (format) { return format; }); // Filtra undefined/null
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
    function simulateGeneration(formats) {
        return __awaiter(this, void 0, Promise, function () {
            var progressContainer, completedPanel, startBtn, optionsContainer, totalSteps, currentStep, stepDuration, _i, formats_1, format, statusText, percentage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (state.isProcessing)
                            return [2 /*return*/];
                        setProcessingState(true);
                        console.log("Simulando gera\u00E7\u00E3o para formatos: ".concat(formats.join(', ')));
                        progressContainer = document.getElementById('processingProgress');
                        completedPanel = document.getElementById('processingCompletedPanel');
                        startBtn = document.getElementById('startProcessingBtn');
                        optionsContainer = document.querySelector('#processing-view .document-format-options');
                        // Esconde botão e opções, mostra progresso
                        if (startBtn)
                            startBtn.style.display = 'none';
                        if (optionsContainer)
                            optionsContainer.style.display = 'none';
                        if (progressContainer)
                            progressContainer.style.display = 'block';
                        totalSteps = formats.length;
                        currentStep = 0;
                        stepDuration = 1500;
                        _i = 0, formats_1 = formats;
                        _a.label = 1;
                    case 1:
                        if (!(_i < formats_1.length)) return [3 /*break*/, 4];
                        format = formats_1[_i];
                        currentStep++;
                        statusText = "Gerando ".concat(format.charAt(0).toUpperCase() + format.slice(1), "... (").concat(currentStep, "/").concat(totalSteps, ")");
                        percentage = (currentStep / totalSteps) * 100;
                        updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', percentage, statusText);
                        // Simula tempo de geração
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, stepDuration); })];
                    case 2:
                        // Simula tempo de geração
                        _a.sent();
                        // Adiciona o documento gerado ao estado (simulação)
                        // Em um app real, aqui ocorreria a chamada API e a resposta traria o conteúdo
                        // Por ora, usamos o conteúdo de exemplo já no state
                        addGeneratedDocument(format);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', 100, 'Concluído');
                        // Esconde progresso, mostra painel de conclusão
                        if (progressContainer)
                            progressContainer.style.display = 'none';
                        if (completedPanel) {
                            completedPanel.classList.add('active');
                            completedPanel.style.display = 'flex';
                        }
                        setProcessingState(false);
                        console.log("Geração de documentos concluída.");
                        return [2 /*return*/];
                }
            });
        });
    }
    /** Adiciona um documento gerado (VINTRA, SOAP, etc.) à lista */
    function addGeneratedDocument(formatType) {
        var baseDoc = state.documents.find(function (d) { return d.id === state.currentDocumentId; });
        if (!baseDoc) {
            console.error("Documento base não encontrado para gerar formato:", formatType);
            return;
        }
        var now = new Date();
        var dateStr = now.toLocaleDateString('pt-BR');
        var timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        var baseTitle = baseDoc.title.replace(/\.(txt|mp3|wav|m4a)$/i, '');
        var newId = "doc".concat(Date.now(), "_").concat(formatType); // ID mais específico
        var icon = 'fas fa-file-medical-alt';
        var color = 'var(--gray-600)';
        switch (formatType) {
            case 'vintra':
                icon = 'fas fa-clipboard-list';
                color = 'var(--accent)';
                break;
            case 'soap':
                icon = 'fas fa-notes-medical';
                color = 'var(--success)';
                break;
            case 'ipissima':
                icon = 'fas fa-comment-dots';
                color = 'var(--accent-pink)';
                break;
            case 'narrative':
                icon = 'fas fa-book-open';
                color = 'var(--warning-yellow)';
                break;
            case 'orientacoes':
                icon = 'fas fa-list-check';
                color = '#8B5CF6';
                break;
        }
        // Pega o conteúdo (de exemplo) do estado
        var content = getDocumentContent(formatType);
        if (content === null) {
            console.error("Conte\u00FAdo de exemplo para '".concat(formatType, "' n\u00E3o encontrado."));
            // Poderia criar um documento vazio ou com placeholder
            return;
        }
        var contentSize = (content.length / 1024).toFixed(1);
        var newDoc = {
            id: newId,
            patientId: baseDoc.patientId,
            title: "".concat(formatType.toUpperCase(), "_").concat(baseTitle, ".txt"),
            type: formatType,
            date: dateStr,
            time: timeStr,
            icon: icon,
            color: color,
            size: "".concat(contentSize, " KB")
        };
        // Evita adicionar duplicatas exatas (mesmo ID)
        if (!state.documents.some(function (doc) { return doc.id === newId; })) {
            state.documents.push(newDoc);
            console.log("Novo documento gerado (".concat(formatType, ") adicionado:"), newDoc);
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
        }
        else {
            console.warn("Documento com ID ".concat(newId, " j\u00E1 existe. Gera\u00E7\u00E3o ignorada."));
        }
    }
    /** Inicia o fluxo de processamento a partir de um documento da biblioteca */
    function startProcessingDocument(docId) {
        var doc = state.documents.find(function (d) { return d.id === docId; });
        if (!doc) {
            showToast('error', 'Erro', 'Documento não encontrado.');
            return;
        }
        if (doc.type !== 'audio' && doc.type !== 'transcription') {
            showToast('info', 'Não Processável', "Documentos do tipo '".concat(doc.type, "' n\u00E3o podem ser usados para gerar formatos VINTRA."));
            return;
        }
        console.log("Iniciando fluxo de processamento para: ".concat(doc.title));
        state.currentDocumentId = docId; // Define como documento base
        // Atualiza o título na view de processamento
        var titleElement = document.getElementById('processingDocumentTitle');
        if (titleElement) {
            titleElement.textContent = escapeHtml(doc.title);
        }
        // Reseta a UI da view de processamento
        var optionsContainer = document.querySelector('#processing-view .document-format-options');
        var startBtn = document.getElementById('startProcessingBtn');
        var progressContainer = document.getElementById('processingProgress');
        var completedPanel = document.getElementById('processingCompletedPanel');
        if (optionsContainer) {
            optionsContainer.style.display = 'flex';
            // Reseta seleção (deixa VINTRA e SOAP ativos por padrão, por exemplo)
            optionsContainer.querySelectorAll('.document-format-option').forEach(function (opt) {
                var format = opt.dataset.format;
                opt.classList.toggle('active', format === 'vintra' || format === 'soap');
            });
        }
        if (startBtn)
            startBtn.style.display = 'inline-flex';
        if (progressContainer)
            progressContainer.style.display = 'none';
        if (completedPanel)
            completedPanel.style.display = 'none';
        window.switchView('processing');
    }
    // --- View: Resultados (#results-view) ---
    /** Configura a view de resultados */
    function setupResultsView() {
        var tabsContainer = document.querySelector('#results-view .document-tabs');
        var downloadBtn = document.getElementById('downloadResultsBtn');
        var editBtn = document.getElementById('editResultBtn'); // Botão Editar na toolbar de resultados
        if (tabsContainer) {
            tabsContainer.addEventListener('click', function (e) {
                var _a;
                var tab = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest('.document-tab');
                if ((tab === null || tab === void 0 ? void 0 : tab.dataset.panel) && !tab.classList.contains('active')) {
                    activateResultsTab(tab.dataset.panel);
                }
            });
        }
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function () {
                // Encontra o documento correspondente à aba ativa
                var activeDocType = state.activeResultsTab.replace('-panel', '');
                // Assume que o último documento gerado desse tipo é o relevante
                // (Idealmente, a view de resultados estaria ligada a um processamento específico)
                var relevantDoc = state.documents
                    .filter(function (d) { return d.type === activeDocType && d.patientId === state.currentPatientId; }) // Filtra por tipo e paciente (se houver)
                    .sort(function (a, b) { return parseDate(b.date, b.time).getTime() - parseDate(a.date, a.time).getTime(); })[0]; // Pega o mais recente
                if (relevantDoc) {
                    downloadDocument(relevantDoc.id);
                }
                else {
                    showToast('warning', 'Download Indisponível', "N\u00E3o foi poss\u00EDvel encontrar o documento '".concat(activeDocType, "' para download."));
                }
            });
        }
        if (editBtn) {
            editBtn.addEventListener('click', function () {
                var activeDocType = state.activeResultsTab.replace('-panel', '');
                // Encontra o documento mais recente do tipo ativo
                var relevantDoc = state.documents
                    .filter(function (d) { return d.type === activeDocType && d.patientId === state.currentPatientId; })
                    .sort(function (a, b) { return parseDate(b.date, b.time).getTime() - parseDate(a.date, a.time).getTime(); })[0];
                if (relevantDoc) {
                    editDocument(relevantDoc.id); // Chama a função de edição existente
                }
                else {
                    showToast('warning', 'Edição Indisponível', "N\u00E3o foi poss\u00EDvel encontrar o documento '".concat(activeDocType, "' para edi\u00E7\u00E3o."));
                }
            });
        }
    }
    /** Ativa uma aba específica na view de resultados */
    function activateResultsTab(panelId) {
        var _a;
        console.log("Ativando aba de resultados: ".concat(panelId));
        state.activeResultsTab = panelId;
        // Atualiza estilo das abas
        document.querySelectorAll('#results-view .document-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab.dataset.panel === panelId);
        });
        // Animação de troca de painéis
        var panelsContainer = document.querySelector('#results-view .document-tab-panels');
        var activePanel = document.getElementById(panelId);
        var currentActivePanel = panelsContainer === null || panelsContainer === void 0 ? void 0 : panelsContainer.querySelector('.document-tab-panel.active');
        if (!activePanel) {
            console.error("Painel de resultados n\u00E3o encontrado: ".concat(panelId));
            return;
        }
        // Pega o tipo de documento da aba e busca o conteúdo mais recente
        var docType = panelId.replace('-panel', '');
        var content = (_a = getDocumentContent(docType)) !== null && _a !== void 0 ? _a : "Conte\u00FAdo para '".concat(docType, "' n\u00E3o dispon\u00EDvel."); // Usará o conteúdo do state (exemplo)
        // Atualiza o conteúdo dentro do painel ativo
        var contentElement = activePanel.querySelector('.document-view');
        if (contentElement) {
            contentElement.innerHTML = "<pre>".concat(escapeHtml(content), "</pre>");
        }
        else {
            console.warn("Elemento .document-view n\u00E3o encontrado em #".concat(panelId));
            // Fallback: Insere estrutura básica se não existir
            activePanel.innerHTML = "<div class=\"document-content\"><div class=\"document-container\"><div class=\"document-view\"><pre>".concat(escapeHtml(content), "</pre></div></div></div>");
        }
        // Habilita/desabilita botão de edição baseado no tipo
        var editBtn = document.getElementById('editResultBtn');
        if (editBtn) {
            var isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(docType);
            editBtn.disabled = !isEditable;
            editBtn.style.display = isEditable ? 'inline-flex' : 'none';
        }
        var showActivePanel = function () {
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
                onComplete: function () {
                    currentActivePanel.classList.remove('active');
                    currentActivePanel.style.display = 'none';
                    showActivePanel();
                }
            });
        }
        else if (!currentActivePanel) {
            showActivePanel();
        }
    }
    // --- Biblioteca de Documentos ---
    /** Configura a interatividade da biblioteca (filtros, busca) */
    function setupDocumentLibrary() {
        var filtersContainer = document.querySelector('#library-view .library-filters');
        var searchInput = document.querySelector('#library-view .library-search-input');
        if (filtersContainer) {
            filtersContainer.addEventListener('click', function (e) {
                var _a, _b;
                var filterBtn = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest('.library-filter');
                if (filterBtn && !filterBtn.classList.contains('active')) {
                    (_b = filtersContainer.querySelector('.library-filter.active')) === null || _b === void 0 ? void 0 : _b.classList.remove('active');
                    filterBtn.classList.add('active');
                    renderDocumentLibrary(filterBtn.dataset.filter || 'all', (searchInput === null || searchInput === void 0 ? void 0 : searchInput.value) || '');
                }
            });
        }
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function () {
                var _a;
                var activeFilter = ((_a = filtersContainer === null || filtersContainer === void 0 ? void 0 : filtersContainer.querySelector('.library-filter.active')) === null || _a === void 0 ? void 0 : _a.dataset.filter) || 'all';
                renderDocumentLibrary(activeFilter, searchInput.value);
            }, 300));
        }
    }
    // --- Notificações Toast ---
    /** Mostra uma notificação toast */
    function showToast(type, title, message, duration) {
        var _a;
        if (duration === void 0) { duration = 5000; }
        var container = document.getElementById('toastContainer');
        if (!container)
            return;
        var toast = document.createElement('div');
        toast.className = "toast toast-".concat(type);
        var iconClass = 'fas fa-info-circle';
        if (type === 'success')
            iconClass = 'fas fa-check-circle';
        else if (type === 'error')
            iconClass = 'fas fa-times-circle';
        else if (type === 'warning')
            iconClass = 'fas fa-exclamation-triangle';
        toast.innerHTML = "\n        <div class=\"toast-icon ".concat(type, "\"> <i class=\"").concat(iconClass, "\"></i> </div>\n        <div class=\"toast-content\">\n            <div class=\"toast-title\">").concat(escapeHtml(title), "</div>\n            <div class=\"toast-message\">").concat(escapeHtml(message), "</div>\n        </div>\n        <button class=\"toast-close\"> <i class=\"fas fa-times\"></i> </button>\n    ");
        (_a = toast.querySelector('.toast-close')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return removeToast(toast); });
        container.appendChild(toast);
        gsap.fromTo(toast, { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
        setTimeout(function () { return removeToast(toast); }, duration);
    }
    /** Remove um toast específico com animação */
    function removeToast(toastElement) {
        if (!(toastElement === null || toastElement === void 0 ? void 0 : toastElement.parentNode))
            return;
        gsap.to(toastElement, {
            opacity: 0,
            y: 10,
            scale: 0.9,
            duration: 0.3,
            ease: 'power1.in',
            onComplete: function () {
                toastElement.remove();
            }
        });
    }
    // --- Modal Genérico ---
    /** Configura o modal genérico */
    function setupGenericModal() {
        var modalOverlay = document.getElementById('genericModal');
        var closeBtn = document.getElementById('genericModalClose');
        var cancelBtn = document.getElementById('genericModalCancelBtn'); // Botão padrão "Fechar"
        closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', hideGenericModal);
        cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', hideGenericModal);
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function (e) {
                if (e.target === modalOverlay) {
                    hideGenericModal();
                }
            });
        }
    }
    /** Mostra o modal genérico com título e conteúdo HTML */
    function showGenericModal(title, htmlContent) {
        var modal = document.getElementById('genericModal');
        var modalTitle = document.getElementById('genericModalTitle');
        var modalBody = document.getElementById('genericModalBody');
        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = title;
            modalBody.innerHTML = htmlContent; // CUIDADO: Garanta que htmlContent seja seguro
            gsap.set(modal, { display: 'flex', opacity: 0 });
            gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power1.out' });
            gsap.fromTo(modal.querySelector('.modal-container'), { scale: 0.95, y: 10 }, { scale: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        }
        else {
            console.error("Elementos do modal genérico não encontrados.");
        }
    }
    /** Esconde o modal genérico */
    function hideGenericModal() {
        var modal = document.getElementById('genericModal');
        if ((modal === null || modal === void 0 ? void 0 : modal.style.display) !== 'none') {
            gsap.to(modal, {
                opacity: 0,
                duration: 0.3,
                ease: 'power1.in',
                onComplete: function () {
                    if (modal)
                        modal.style.display = 'none';
                    var modalBody = document.getElementById('genericModalBody');
                    if (modalBody)
                        modalBody.innerHTML = '';
                }
            });
        }
    }
    // --- Utilitários ---
    /** Debounce: Atraso na execução de uma função */
    function debounce(func, wait) {
        var timeout = null;
        return function executedFunction() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                func.apply(void 0, args);
            };
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = window.setTimeout(later, wait);
        };
    }
    /** Escapa HTML para prevenir XSS */
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') {
            try {
                unsafe = String(unsafe);
            }
            catch (e) {
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
    function parseDate(dateStr, timeStr) {
        var parts = dateStr.split('/');
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1; // Mês é 0-indexado
        var year = parseInt(parts[2], 10);
        var hour = 0;
        var minute = 0;
        if (timeStr) {
            var timeParts = timeStr.split(':');
            hour = parseInt(timeParts[0], 10);
            minute = parseInt(timeParts[1], 10);
        }
        // Verifica se as partes são válidas antes de criar a data
        if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hour) || isNaN(minute)) {
            console.warn("Data/hora inv\u00E1lida encontrada: ".concat(dateStr, " ").concat(timeStr || '', ". Retornando data atual."));
            return new Date(); // Retorna data atual como fallback
        }
        return new Date(year, month, day, hour, minute);
    }
    // --- Funções de Ação Pós-Processamento (Exemplo) ---
    /** Ação: Visualizar transcrição recém-processada na biblioteca */
    function viewTranscription() {
        if (!state.currentDocumentId) {
            showToast('warning', 'Nenhum Documento', 'Nenhum documento de transcrição ativo para visualizar.');
            window.switchView('library');
            return;
        }
        var doc = state.documents.find(function (d) { return d.id === state.currentDocumentId && d.type === 'transcription'; });
        if (doc) {
            window.switchView('library');
            setTimeout(function () {
                setActiveDocumentItem(doc.id);
                viewDocumentInWorkspace(doc.id);
            }, 400); // Atraso para renderização da view
        }
        else {
            showToast('error', 'Erro', 'Transcrição não encontrada na biblioteca.');
            window.switchView('library');
        }
    }
    /** Ação: Ir para a view de processamento com a transcrição atual */
    function processTranscription() {
        if (!state.currentDocumentId) {
            showToast('warning', 'Nenhum Documento', 'Nenhum documento de transcrição ativo para processar.');
            window.switchView('library');
            return;
        }
        var doc = state.documents.find(function (d) { return d.id === state.currentDocumentId && d.type === 'transcription'; });
        if (doc) {
            startProcessingDocument(doc.id); // Inicia fluxo de processamento
        }
        else {
            showToast('error', 'Erro', 'Documento de transcrição não encontrado para processar.');
            window.switchView('library');
        }
    }
    /**
     * VINTRA - Correções JavaScript para Bugs de Interface
     */
    // Função para garantir a inicialização correta do dashboard
    function fixDashboardInitialization() {
        // Garante que o dashboard seja exibido por padrão quando o app iniciar
        document.addEventListener('DOMContentLoaded', function () {
            // Certifique-se de que o dashboard é renderizado quando o login for bem-sucedido
            var loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', function (e) {
                    // Nota: Mantenha qualquer lógica existente, apenas adicione isso:
                    setTimeout(function () {
                        renderPatientSelectionOnDashboard();
                        var dashboardView = document.getElementById('dashboard-view');
                        if (dashboardView) {
                            dashboardView.style.display = 'block';
                        }
                    }, 700); // Delay para dar tempo às animações
                });
            }
        });
    }
    // Corrigir problemas com os toasts
    function fixToastPositioning() {
        // Certificar que o container existe
        var toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        // Sobrescrever a função showToast se necessário para garantir comportamento correto
        if (typeof window.showToast !== 'function') {
            window.showToast = function (type, title, message, duration) {
                if (duration === void 0) { duration = 5000; }
                var toast = document.createElement('div');
                toast.className = "toast toast-".concat(type);
                var iconClass = 'fas fa-info-circle';
                if (type === 'success')
                    iconClass = 'fas fa-check-circle';
                else if (type === 'error')
                    iconClass = 'fas fa-times-circle';
                else if (type === 'warning')
                    iconClass = 'fas fa-exclamation-triangle';
                toast.innerHTML = "\n                <div class=\"toast-icon ".concat(type, "\"> <i class=\"").concat(iconClass, "\"></i> </div>\n                <div class=\"toast-content\">\n                    <div class=\"toast-title\">").concat(title, "</div>\n                    <div class=\"toast-message\">").concat(message, "</div>\n                </div>\n                <button class=\"toast-close\"> <i class=\"fas fa-times\"></i> </button>\n            ");
                toast.querySelector('.toast-close').addEventListener('click', function () {
                    toast.style.opacity = '0';
                    setTimeout(function () {
                        toast.remove();
                    }, 300);
                });
                toastContainer.appendChild(toast);
                // Animação de entrada
                setTimeout(function () {
                    toast.style.transform = 'translateY(0)';
                    toast.style.opacity = '1';
                }, 10);
                // Auto-remover após duração
                setTimeout(function () {
                    toast.style.opacity = '0';
                    setTimeout(function () {
                        toast.remove();
                    }, 300);
                }, duration);
            };
        }
    }
    // Corrigir problemas de layout em geral
    function fixLayoutIssues() {
        // Corrigir problema com o botão de login
        var loginBtn = document.querySelector('#loginForm .btn-primary');
        if (loginBtn) {
            loginBtn.addEventListener('mouseout', function () {
                // Resetar transformações após o mouse sair
                this.style.transform = 'none';
            });
        }
        // Garantir que o sidebar ocupe toda a altura
        var appSidebar = document.querySelector('.app-sidebar');
        var appMain = document.querySelector('.app-main');
        if (appSidebar && appMain) {
            // Estabelecer a altura correta
            var updateSidebarHeight = function () {
                var _a;
                var headerHeight = ((_a = document.querySelector('.app-header')) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 73;
                appMain.style.height = "calc(100vh - ".concat(headerHeight, "px)");
            };
            // Aplicar no carregamento e ao redimensionar
            window.addEventListener('load', updateSidebarHeight);
            window.addEventListener('resize', updateSidebarHeight);
        }
        // Garantir que views ativas são exibidas corretamente
        var switchView = window.switchView;
        if (typeof switchView === 'function') {
            window.switchView = function (viewId, force) {
                if (force === void 0) { force = false; }
                // Chamar função original
                switchView(viewId, force);
                // Adicionar verificação extra
                setTimeout(function () {
                    var view = document.getElementById("".concat(viewId, "-view"));
                    if (view && view.classList.contains('active')) {
                        if (viewId === 'library') {
                            view.style.display = 'flex';
                        }
                        else {
                            view.style.display = 'block';
                        }
                    }
                }, 50);
            };
        }
    }
    // Corrigir problemas com modais
    function fixModalIssues() {
        // Garantir que modais sejam fechados corretamente
        var modalOverlays = document.querySelectorAll('.modal-overlay');
        modalOverlays.forEach(function (modal) {
            modal.addEventListener('click', function (e) {
                var _this = this;
                if (e.target === this) {
                    // Clicar fora do modal fecha-o
                    this.style.opacity = '0';
                    setTimeout(function () {
                        _this.style.display = 'none';
                    }, 300);
                }
            });
        });
        // Garantir que botões de fechar funcionem
        var closeButtons = document.querySelectorAll('.modal-close, .modal-footer .btn-secondary');
        closeButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var modal = this.closest('.modal-overlay');
                if (modal) {
                    modal.style.opacity = '0';
                    setTimeout(function () {
                        modal.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
    // Função para verificação de elementos no DOM
    function validateDOMElements() {
        console.log('Validando elementos DOM críticos...');
        var criticalElements = [
            { id: 'dashboard-view', name: 'Dashboard View' },
            { id: 'appContainer', name: 'App Container' },
            { id: 'loginForm', name: 'Login Form' },
            { id: 'toastContainer', name: 'Toast Container' },
            { id: 'library-view', name: 'Library View' },
            { id: 'patient-view', name: 'Patient View' }
        ];
        criticalElements.forEach(function (el) {
            var element = document.getElementById(el.id);
            if (!element) {
                console.warn("\u26A0\uFE0F Elemento cr\u00EDtico n\u00E3o encontrado: ".concat(el.name, " (id: ").concat(el.id, ")"));
            }
            else {
                console.log("\u2705 Elemento encontrado: ".concat(el.name));
            }
        });
    }
    // Função principal para aplicar todas as correções
    function applyVintraFixes() {
        console.log('Aplicando correções para VINTRA UI...');
        fixDashboardInitialization();
        fixToastPositioning();
        fixLayoutIssues();
        fixModalIssues();
        validateDOMElements();
        console.log('Correções aplicadas!');
    }
    // Aplicar correções quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', applyVintraFixes);
    // Para corrigir problemas com renderização das views, você pode adicionar:
    window.addEventListener('load', function () {
        // Verificar estado inicial após carregamento completo
        if (state && state.currentView) {
            var activeView = document.getElementById("".concat(state.currentView, "-view"));
            if (activeView) {
                if (state.currentView === 'library') {
                    activeView.style.display = 'flex';
                }
                else {
                    activeView.style.display = 'block';
                }
            }
        }
        else {
            // Fallback para dashboard
            var dashboardView = document.getElementById('dashboard-view');
            if (dashboardView) {
                dashboardView.style.display = 'block';
                dashboardView.classList.add('active');
            }
        }
    });
}
