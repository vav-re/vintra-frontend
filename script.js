/**

 * VINTRA - Análise Dimensional Clínica

 * Script principal mesclado, otimizado e refatorado (Baseado na v4)

 * Incorporando seleção de pacientes e removendo modo foco

 *

 * Refatorado para:

 * - Usar IIFE para evitar poluição global.

 * - Substituir 'var' por 'let'/'const'.

 * - Melhorar organização e legibilidade.

 * - Integrar correções de bugs (da seção applyVintraFixes).

 * - Otimizar seletores DOM e manipulação (parcialmente).

 * - Manter polyfills __awaiter e __generator para compatibilidade.

 */



// Polyfills gerados pelo TypeScript para async/await (MANTER)

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



// IIFE para encapsular todo o script e evitar poluição global

(function () {

    'use strict'; // Habilita o modo estrito para ajudar a pegar erros comuns



    // --- Estado Global Centralizado ---

    const state = {

        currentView: null,

        currentPatientId: null,

        currentDocumentId: null,

        currentDocumentType: null, // Tipo do documento sendo editado/visualizado

        activePatientTab: 'summary-panel',

        activeDimensionalView: 'radar',

        activeNewDocumentTab: 'record',

        activeResultsTab: 'transcription-panel',

        isProcessing: false, // Flag global para indicar processamento em andamento

        isRecording: false,

        recordingStartTime: null,

        recordingInterval: null,

        audioContext: null,

        analyser: null,

        visualizerSource: null, // Referência à fonte de áudio para o visualizador

        visualizerRafId: null, // ID do requestAnimationFrame para o visualizador

        mediaRecorder: null,

        audioChunks: [],

        uploadedFile: null,

        processedAudioBlob: null, // Armazena o blob da gravação ou upload processado

        // Dados dimensionais (exemplo, idealmente viria por paciente)

        dimensionalData: {

            emocional: { valencia: -2.5, excitacao: 7.0, dominancia: 3.0, intensidade: 8.0 },

            cognitiva: { complexidade: 6.0, coerencia: 5.0, flexibilidade: 4.0, dissonancia: 7.0 },

            autonomia: { perspectivaTemporal: { passado: 7.0, presente: 3.0, futuro: 2.0, media: 4.0 }, autocontrole: 4.0 }

        },

        documents: [], // Lista de todos os documentos (viria do backend)

        recentPatients: [], // Lista de pacientes (viria do backend)

        // Conteúdo de exemplo para documentos (idealmente viria do backend ou seria carregado sob demanda)

        transcriptionText: "Entrevista Clínica - 04 de Abril de 2025\nMédico: Bom dia, Maria. Como você está se sentindo hoje?\nPaciente: Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar. (Suspira) É difícil manter a esperança.\nMédico: Entendo que seja difícil, Maria. Vamos conversar sobre isso. Além da dor física, como está o seu ânimo?\nPaciente: Péssimo. Me sinto desanimada, sem vontade de fazer nada. Até as coisas que eu gostava perderam a graça. Parece que estou carregando um peso enorme.",

        vintraText: "# Análise VINTRA - Maria Silva (04/04/2025)\n\n## Dimensões Emocionais\n- Valência (v₁): -2.5 (Negativa)\n- Excitação (v₂): 7.0 (Alta)\n- Dominância (v₃): 3.0 (Baixa)\n- Intensidade (v₄): 8.0 (Alta)\n\n... (restante do texto VINTRA)",

        soapText: "# Nota SOAP - Maria Silva (04/04/2025)\n\n## S (Subjetivo)\nPaciente relata persistência da dor...\n\n... (restante do texto SOAP)",

        ipissimaText: "# Ipíssima Narrativa - Maria Silva (04/04/2025)\n\nEu não aguento mais essa dor...\n\n... (restante do texto Ipíssima)",

        narrativeText: "# Análise Narrativa - Maria Silva (04/04/2025)\n\n## Temas Centrais:\n- Dor crônica...\n\n... (restante da análise narrativa)",

        orientacoesText: "# Orientações - Maria Silva (04/04/2025)\n\n1.  **Medicação:** Continue...\n\n... (restante das orientações)"

    };



    // --- Cache de Seletores DOM Comuns ---

    // Melhora a performance e facilita a manutenção

    const DOM = {

        appContainer: null,

        splashScreen: null,

        loginScreen: null,

        loginForm: null,

        passwordInput: null,

        passwordError: null,

        toastContainer: null,

        sidebar: null,

        sidebarToggle: null,

        mobileMenuBtn: null,

        mobileMenu: null,

        mobileMenuBackdrop: null,

        mobileMenuClose: null,

        // Views principais (serão buscadas quando necessário)

        // Modais (serão buscadas quando necessário)

        // Outros elementos frequentemente usados podem ser adicionados aqui

    };



    // --- Inicialização Principal ---

    document.addEventListener('DOMContentLoaded', function () {

        console.log("VINTRA Inicializando...");



        // Cache de elementos DOM principais

        DOM.appContainer = document.getElementById('appContainer');

        DOM.splashScreen = document.getElementById('splashScreen');

        DOM.loginScreen = document.getElementById('loginScreen');

        DOM.loginForm = document.getElementById('loginForm');

        DOM.passwordInput = document.getElementById('password');

        DOM.passwordError = document.getElementById('passwordError');

        DOM.toastContainer = document.getElementById('toastContainer');

        DOM.sidebar = document.querySelector('.app-sidebar');

        DOM.sidebarToggle = document.getElementById('sidebarToggle');

        DOM.mobileMenuBtn = document.getElementById('mobileMenuBtn');

        DOM.mobileMenu = document.getElementById('mobileMenu');

        DOM.mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

        DOM.mobileMenuClose = document.querySelector('.mobile-menu-close');



        // Garante que o container de toasts exista (Integração da correção)

        if (!DOM.toastContainer) {

            DOM.toastContainer = document.createElement('div');

            DOM.toastContainer.id = 'toastContainer';

            DOM.toastContainer.className = 'toast-container'; // Adiciona classe para estilização

            document.body.appendChild(DOM.toastContainer);

            console.log("Container de toasts criado dinamicamente.");

        }



        loadDemoData();

        setupEventListeners(); // Configura TODOS os listeners centralizadamente

        initCharts(); // Inicializa estruturas de gráficos

        initFluidAnimations(); // Configura efeito ripple

        fixLayoutIssues(); // Aplica correções de layout iniciais

        validateDOMElements(); // Verifica elementos críticos



        // Estado inicial: Mostrar Splash brevemente, depois Login

        if (DOM.splashScreen && DOM.loginScreen && DOM.appContainer) {

            gsap.set(DOM.splashScreen, { display: 'flex', opacity: 1 }); // Garante visibilidade inicial

            gsap.to(DOM.splashScreen, {

                opacity: 0,

                duration: 0.5,

                delay: 0.7,

                ease: "power1.inOut",

                onComplete: function () {

                    DOM.splashScreen.style.display = 'none';

                    gsap.set(DOM.loginScreen, { display: 'flex', opacity: 0 });

                    DOM.loginScreen.classList.add('visible'); // Adiciona classe para controle CSS se necessário

                    gsap.to(DOM.loginScreen, {

                        opacity: 1,

                        duration: 0.5,

                        ease: "power1.out"

                    });

                }

            });

        } else {

            console.warn("Splash, Login ou App Container não encontrados. Verifique o HTML.");

            // Fallback: tenta mostrar o login ou o app diretamente

            if (DOM.loginScreen) {

                gsap.set(DOM.loginScreen, { display: 'flex', opacity: 1 });

                DOM.loginScreen.classList.add('visible');

            } else if (DOM.appContainer) {

                DOM.appContainer.style.display = 'flex';

                switchView('dashboard'); // Tenta ir para o dashboard

            }

        }

    });



    // Aplica correções de layout que dependem do carregamento completo da página

    window.addEventListener('load', function () {

        fixLayoutIssues(); // Aplica novamente para garantir altura correta após tudo carregar

        // Verifica estado inicial da view após carregamento completo

        if (state.currentView) {

            const activeView = document.getElementById(`${state.currentView}-view`);

            if (activeView) {

                const displayStyle = (state.currentView === 'library' || state.currentView === 'patient' || state.currentView === 'results' || state.currentView === 'processing') ? 'flex' : 'block';

                activeView.style.display = displayStyle;

                activeView.classList.add('active'); // Garante a classe 'active'

            }

        } else if (DOM.appContainer && DOM.appContainer.style.display === 'flex') {

            // Se o app está visível mas nenhuma view está ativa (pós-login), força o dashboard

             const dashboardView = document.getElementById('dashboard-view');

             if (dashboardView && !dashboardView.classList.contains('active')) {

                 switchView('dashboard');

             }

        }

    });



     // --- Configuração Centralizada de Event Listeners ---

     function setupEventListeners() {

        console.log("Configurando event listeners...");

        setupLogin();

        setupNavigation(); // Usa delegação

        setupSidebar();

        setupMobileMenu();

        setupPatientView(); // Configura tudo relacionado à view do paciente

        setupDimensionalVisualizations(); // Modal dimensional

        setupDocumentEditing(); // Modal de edição

        setupNewDocumentView(); // Configura tudo relacionado à view 'new'

        setupProcessingView(); // Configura tudo relacionado à view 'processing'

        setupResultsView(); // Configura tudo relacionado à view 'results'

        setupLibraryView(); // Configura tudo relacionado à view 'library'

        setupGenericModal(); // Modal genérico



        // Listeners adicionais que não se encaixam em setups específicos

        // (Exemplo: Botões de conclusão nas tabs de 'Novo Documento')

        // Estes foram movidos para dentro das funções de setup relevantes (setupNewDocumentView)

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



    // --- Autenticação ---

    /** Configura o formulário de login */

    function setupLogin() {

        if (!DOM.loginForm || !DOM.passwordInput || !DOM.passwordError || !DOM.loginScreen || !DOM.appContainer) {

            console.error("Elementos de login essenciais não encontrados no DOM.");

            return;

        }



        DOM.loginForm.addEventListener('submit', function (event) {

            event.preventDefault();

            const password = DOM.passwordInput.value;

            const correctPassword = "123"; // Senha de demonstração



            // Resetar erro

            DOM.passwordError.style.display = 'none';

            DOM.passwordInput.classList.remove('input-error'); // Assume classe de erro



            if (password === correctPassword) {

                showToast('success', 'Login bem-sucedido', 'Bem-vindo ao VINTRA!');

                // Transição suave para o app

                gsap.to(DOM.loginScreen, {

                    opacity: 0,

                    duration: 0.6,

                    ease: "power2.inOut",

                    onComplete: function () {

                        DOM.loginScreen.style.display = 'none';

                        DOM.loginScreen.classList.remove('visible');

                        gsap.set(DOM.appContainer, { display: 'flex', opacity: 0 });

                        gsap.to(DOM.appContainer, {

                            opacity: 1,

                            duration: 0.5,

                            ease: "power1.out",

                            onComplete: function () {

                                state.currentView = null; // Força a renderização inicial da view

                                switchView('dashboard'); // Vai para o dashboard após login

                                // Garante renderização do conteúdo do dashboard após animação

                                setTimeout(() => {

                                     renderPatientSelectionOnDashboard(); // Renderiza seleção de pacientes

                                     // renderRecentDocuments(); // Renderiza docs recentes se necessário

                                }, 100); // Pequeno delay

                            }

                        });

                    }

                });

            } else {

                // Senha incorreta

                DOM.passwordError.textContent = 'Senha incorreta. Tente novamente.';

                DOM.passwordError.style.display = 'block';

                DOM.passwordInput.classList.add('input-error');

                DOM.passwordInput.focus();

                // Animação de erro (shake)

                gsap.fromTo(DOM.loginForm, { x: -10 }, { x: 10, duration: 0.05, repeat: 5, yoyo: true, clearProps: "x" });

            }

        });

    }



    /** Simula o logout do usuário */

    function logout() {

        if (!DOM.loginScreen || !DOM.appContainer || !DOM.passwordInput) return;



        showToast('info', 'Logout', 'Você saiu da sua conta.');

        gsap.to(DOM.appContainer, {

            opacity: 0,

            duration: 0.6,

            ease: "power2.inOut",

            onComplete: function () {

                DOM.appContainer.style.display = 'none';

                gsap.set(DOM.loginScreen, { display: 'flex', opacity: 0 });

                DOM.loginScreen.classList.add('visible');

                DOM.passwordInput.value = ''; // Limpa senha

                DOM.passwordError.style.display = 'none'; // Esconde erro

                DOM.passwordInput.classList.remove('input-error');

                gsap.to(DOM.loginScreen, {

                    opacity: 1,

                    duration: 0.8,

                    ease: "power2.out"

                });

                // Reseta o estado da aplicação

                state.currentView = null;

                state.currentPatientId = null;

                state.currentDocumentId = null;

                state.currentDocumentType = null;

                // Outros resets de estado se necessário

                closeMobileMenu(); // Fecha menu mobile se estiver aberto

            }

        });

    }



    // --- Navegação Principal e Sidebar ---

    /** Configura os links de navegação (header, sidebar, mobile) usando delegação */

    function setupNavigation() {

        document.body.addEventListener('click', function (e) {

            const link = e.target.closest('[data-target]'); // Encontra o link clicado ou seu ancestral com data-target

            if (link?.dataset?.target) {

                 e.preventDefault(); // Previne comportamento padrão APENAS para links tratados

                 const targetView = link.dataset.target;



                 // Ignora clique se o link estiver desabilitado

                 if (link.classList.contains('disabled') || link.disabled) {

                     console.log(`Link para '${targetView}' desabilitado.`);

                     return;

                 }



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

                            switchView(targetView);

                        } else {

                            // Se clicou no link da view atual, apenas fecha o menu mobile (se aberto)

                            closeMobileMenu();

                        }

                        break;

                }

            }

        });

    }



    /** Atualiza o estado ativo dos links de navegação */

    function updateNavigation(activeViewId) {

        const allLinks = document.querySelectorAll('.nav-item[data-target], .sidebar-link[data-target], .mobile-menu-item[data-target]');

        allLinks.forEach(link => {

            const isActive = link.dataset.target === activeViewId;

            link.classList.toggle('active', isActive);

        });

        closeMobileMenu(); // Fecha menu mobile ao navegar

    }



    /** Configura o toggle da sidebar */

    function setupSidebar() {

        if (DOM.sidebarToggle && DOM.sidebar) {

            DOM.sidebarToggle.addEventListener('click', function () {

                const isExpanded = DOM.sidebar.classList.toggle('expanded');

                document.body.classList.toggle('sidebar-expanded', isExpanded);

                 // Adicionar/Remover classe 'collapsed' para estilização específica

                 document.body.classList.toggle('sidebar-collapsed', !isExpanded);

            });

             // Inicia recolhido por padrão (adiciona a classe no body)

             if (!DOM.sidebar.classList.contains('expanded')) {

                 document.body.classList.add('sidebar-collapsed');

             }

        } else {

            console.warn("Elementos da sidebar (toggle ou container) não encontrados.");

        }

    }



    /** Configura o menu mobile */

    function setupMobileMenu() {

        if (!DOM.mobileMenuBtn || !DOM.mobileMenuClose || !DOM.mobileMenuBackdrop || !DOM.mobileMenu) {

            console.error("Elementos do menu mobile não encontrados.");

            return;

        }

        DOM.mobileMenuBtn.addEventListener('click', openMobileMenu);

        DOM.mobileMenuClose.addEventListener('click', closeMobileMenu);

        DOM.mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

    }



    /** Abre o menu mobile */

    function openMobileMenu() {

        if (DOM.mobileMenu && DOM.mobileMenuBackdrop) {

            DOM.mobileMenuBackdrop.classList.add('open');

            DOM.mobileMenu.classList.add('open');

            document.body.style.overflow = 'hidden'; // Impede scroll do body

        }

    }



    /** Fecha o menu mobile */

    function closeMobileMenu() {

        if (DOM.mobileMenu?.classList.contains('open') && DOM.mobileMenuBackdrop) {

            DOM.mobileMenu.classList.remove('open');

            DOM.mobileMenuBackdrop.classList.remove('open');

            document.body.style.overflow = ''; // Restaura scroll do body

        }

    }



    // --- Troca de Views ---

    /**

     * Alterna entre as views principais da aplicação com animação.

     * @param {string} viewId - O ID da view de destino (sem o sufixo '-view').

     * @param {boolean} [force=false] - Força a troca mesmo que já esteja na mesma view.

     */

    function switchView(viewId, force = false) {

        const newViewElem = document.getElementById(`${viewId}-view`);



        if (!newViewElem) {

            console.error(`View não encontrada: ${viewId}-view`);

            showToast('error', 'Erro de Navegação', `A view '${viewId}' não existe.`);

            return;

        }



        // Verifica se já está na view e não é forçado

        if (state.currentView === viewId && !force) {

            console.log(`Já está na view: ${viewId}`);

            closeMobileMenu();

            return;

        }



        // Verifica se há um processo em andamento

        if (state.isProcessing) {

            showToast('warning', 'Processo em andamento', 'Por favor, aguarde a conclusão do processo atual.');

            return;

        }



        // Verifica acesso às views que requerem paciente selecionado

        const requiresPatient = ['library', 'new', 'processing', 'results', 'patient'];

        if (requiresPatient.includes(viewId) && !state.currentPatientId && viewId !== 'patient') { // 'patient' é onde se seleciona

             if (viewId !== 'dashboard') { // Evita loop se já estiver no dashboard

                 showToast('warning', 'Selecione um Paciente', 'Por favor, selecione um paciente no dashboard para acessar esta funcionalidade.');

                 switchView('dashboard'); // Redireciona para o dashboard

             }

            return;

        }



        console.log(`Trocando para view: ${viewId}`);



        const currentViewElem = state.currentView ? document.getElementById(`${state.currentView}-view`) : null;

        const newViewDisplayStyle = (viewId === 'library' || viewId === 'patient' || viewId === 'results' || viewId === 'processing') ? 'flex' : 'block';



        const showNewView = () => {

            gsap.set(newViewElem, { display: newViewDisplayStyle, opacity: 0, y: 15 });

            newViewElem.scrollTop = 0; // Rola para o topo

            newViewElem.classList.add('active'); // Adiciona classe 'active'

            gsap.to(newViewElem, {

                opacity: 1,

                y: 0,

                duration: 0.4,

                ease: "power2.out",

                onComplete: () => {

                    // Funções pós-ativação da view

                    state.currentView = viewId; // Atualiza o estado APÓS a animação de entrada

                    updateNavigation(viewId); // Atualiza links de navegação

                    executeViewSpecificLogic(viewId); // Executa lógica da view específica

                }

            });

        };



        if (currentViewElem) {

            currentViewElem.classList.remove('active'); // Remove classe 'active' da view antiga

            gsap.to(currentViewElem, {

                opacity: 0,

                y: -15,

                duration: 0.3,

                ease: "power2.in",

                onComplete: () => {

                    currentViewElem.style.display = 'none';

                    currentViewElem.style.transform = ''; // Limpa transformação

                    showNewView();

                }

            });

        } else {

            showNewView(); // Primeira carga ou vindo do login

        }

    }



    /** Executa lógica específica após uma view ser ativada */

    function executeViewSpecificLogic(viewId) {

        console.log(`Executando lógica para view: ${viewId}`);

        switch (viewId) {

            case 'dashboard':

                renderPatientSelectionOnDashboard();

                // renderRecentDocuments(); // Descomente se necessário

                break;

            case 'library':

                 // Renderiza a biblioteca (filtro e busca padrão)

                 renderDocumentLibrary();

                 // Tenta visualizar o documento atual ou mostra view vazia

                 if (state.currentDocumentId) {

                     // Verifica se o doc atual pertence ao paciente atual

                     const doc = state.documents.find(d => d.id === state.currentDocumentId);

                     if (doc && doc.patientId === state.currentPatientId) {

                        viewDocumentInWorkspace(state.currentDocumentId);

                     } else {

                         state.currentDocumentId = null; // Reseta se for de outro paciente

                         showEmptyDocumentView();

                     }

                 } else {

                     showEmptyDocumentView();

                 }

                break;

            case 'patient':

                // Garante que a aba ativa seja renderizada corretamente

                // A renderização do conteúdo (gráfico, documentos) ocorre dentro de activatePatientTab

                 activatePatientTab(state.activePatientTab || 'summary-panel');

                break;

            case 'new':

                // Garante que a aba ativa seja renderizada corretamente

                activateNewDocumentTab(state.activeNewDocumentTab || 'record');

                // Reseta UIs de progresso/conclusão se houver

                resetRecordingVisuals();

                resetUploadVisuals();

                resetManualTranscriptionVisuals();

                break;

            case 'processing':

                // A lógica de reset da UI de processamento está em startProcessingDocument

                // Aqui podemos garantir que o título do documento base esteja correto

                updateProcessingViewTitle();

                break;

            case 'results':

                // Garante que a aba ativa seja renderizada corretamente

                activateResultsTab(state.activeResultsTab || 'transcription-panel');

                break;

        }

    }



    // --- View: Dashboard (#dashboard-view) ---



    /** Renderiza a seção de seleção de pacientes no dashboard */

    function renderPatientSelectionOnDashboard() {

        const container = document.getElementById('dashboard-view');

        if (!container) {

            console.error("Container do dashboard (#dashboard-view) não encontrado.");

            return;

        }



        // Remove seção antiga para evitar duplicação

        const oldSection = container.querySelector('.patient-selection-section');

        if (oldSection) oldSection.remove();



        // Cria a nova seção

        const patientSelectionSection = document.createElement('div');

        patientSelectionSection.className = 'patient-selection-section card bg-white p-6 rounded-lg shadow mb-6'; // Adiciona estilos



        const header = document.createElement('div');

        header.className = 'section-header mb-4';

        header.innerHTML = `<h2 class="text-xl font-semibold text-gray-700">Aceder Paciente</h2>`;

        patientSelectionSection.appendChild(header);



        // Barra de busca

        const searchBar = document.createElement('div');

        searchBar.className = 'search-container dashboard-search mb-4';

        searchBar.innerHTML = `

            <div class="relative">

                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">

                    <i class="fas fa-search"></i>

                </span>

                <input type="text" id="dashboardPatientSearch" placeholder="Buscar paciente por nome ou ID..."

                       class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">

            </div>

        `;

        patientSelectionSection.appendChild(searchBar);



        // Div para a lista de pacientes

        const patientListDiv = document.createElement('div');

        patientListDiv.id = 'dashboardPatientList';

        patientListDiv.className = 'patient-card-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'; // Layout responsivo

        patientSelectionSection.appendChild(patientListDiv);



        // Adiciona a seção ao dashboard (ex: no início)

        container.prepend(patientSelectionSection);



        // Lógica de busca e renderização

        const searchInput = document.getElementById('dashboardPatientSearch');

        if (!searchInput) {

            console.error("Input de busca de paciente no dashboard não encontrado.");

            return;

        }



        // Função interna para renderizar a lista

        const renderList = (searchTerm = '') => {

            patientListDiv.innerHTML = ''; // Limpa lista

            const normalizedSearch = searchTerm.toLowerCase().trim();

            const filteredPatients = state.recentPatients.filter(p =>

                !normalizedSearch ||

                p.name.toLowerCase().includes(normalizedSearch) ||

                p.id.toLowerCase().includes(normalizedSearch) // Busca por ID também

            );



            if (filteredPatients.length === 0) {

                patientListDiv.innerHTML = '<p class="text-gray-500 col-span-full text-center py-4">Nenhum paciente encontrado.</p>';

                return;

            }



            filteredPatients.forEach(patient => {

                const card = document.createElement('div');

                card.className = 'patient-card dashboard-patient-card bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-between transition hover:bg-gray-100';

                card.dataset.id = patient.id;

                card.innerHTML = `

                    <div class="flex items-center space-x-3">

                         <div class="patient-avatar w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">

                             ${escapeHtml(patient.name.charAt(0))}

                         </div>

                         <div>

                             <div class="patient-card-name font-medium text-gray-800">${escapeHtml(patient.name)}</div>

                             <div class="patient-card-info text-sm text-gray-500">ID: ${escapeHtml(patient.id)}</div>

                         </div>

                    </div>

                    <button class="btn btn-sm btn-primary access-patient-btn" data-patient-id="${patient.id}">

                        <i class="fas fa-arrow-right mr-1"></i> Aceder

                    </button>

                `;

                // Adiciona listener ao botão Aceder

                card.querySelector('.access-patient-btn')?.addEventListener('click', (e) => {

                    e.stopPropagation(); // Impede que o clique no botão propague para o card (se o card for clicável)

                    openPatientPanel(patient.id);

                });

                // Opcional: tornar o card inteiro clicável

                // card.addEventListener('click', () => openPatientPanel(patient.id));

                patientListDiv.appendChild(card);

            });

        };



        // Adiciona listener com debounce

        searchInput.addEventListener('input', debounce(() => renderList(searchInput.value), 300));



        // Renderiza a lista inicial

        renderList();

    }



    /** Renderiza os documentos recentes no dashboard (Exemplo, pode ser removido/adaptado) */

    function renderRecentDocuments() {

        const container = document.getElementById('recentDocuments');

        if (!container) return;



        container.innerHTML = ''; // Limpa antes de renderizar

        const recentDocs = state.documents.slice(-4).reverse(); // Pega os 4 últimos



        if (recentDocs.length === 0) {

            container.innerHTML = '<p class="empty-list-message text-gray-500 text-center py-4">Nenhum documento recente encontrado.</p>';

            return;

        }



        recentDocs.forEach(doc => {

            const item = document.createElement('div');

            item.className = 'recent-item flex items-center p-3 bg-white rounded-lg shadow-sm mb-2 cursor-pointer transition hover:bg-gray-50';

            item.dataset.id = doc.id;

            item.innerHTML = `

                <div class="recent-item-icon text-xl w-8 text-center mr-3" style="color: ${doc.color || 'var(--text-secondary)'}">

                    <i class="${doc.icon || 'fas fa-file'}"></i>

                </div>

                <div class="recent-item-info flex-grow">

                    <div class="recent-item-title font-medium text-gray-700 truncate">${escapeHtml(doc.title)}</div>

                    <div class="recent-item-meta text-xs text-gray-500">

                        <span>${escapeHtml(doc.type)}</span>

                        <span class="mx-1">&bull;</span>

                        <span>${escapeHtml(doc.date)}</span>

                        ${doc.size ? `<span class="mx-1">&bull;</span><span>${escapeHtml(doc.size)}</span>` : ''}

                    </div>

                </div>

                <div class="text-gray-400 ml-2"> <i class="fas fa-chevron-right"></i> </div>

            `;

            // Adiciona evento para navegar para a biblioteca e selecionar o doc

            item.addEventListener('click', () => {

                // Verifica se o paciente do documento está selecionado ou seleciona-o

                if (state.currentPatientId !== doc.patientId) {

                    const patientExists = state.recentPatients.some(p => p.id === doc.patientId);

                    if (patientExists) {

                        state.currentPatientId = doc.patientId; // Define o paciente do documento como ativo

                        console.log(`Paciente ${doc.patientId} definido como ativo para visualizar documento recente.`);

                    } else {

                        showToast('error', 'Erro', `Paciente ${doc.patientId} não encontrado.`);

                        return;

                    }

                }



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



    // --- View: Painel do Paciente (#patient-view) ---



     /** Configura a view do paciente (abas, botão voltar, etc.) */

    function setupPatientView() {

        const view = document.getElementById('patient-view');

        if (!view) return;



        // Configura abas usando delegação

        const tabsContainer = view.querySelector('.patient-tabs');

        if (tabsContainer) {

            tabsContainer.addEventListener('click', function(e) {

                const tab = e.target.closest('.patient-tab');

                if (tab?.dataset?.panel && !tab.classList.contains('active')) {

                    activatePatientTab(tab.dataset.panel);

                }

            });

        }



        // Botão Voltar para Dashboard

        const backBtn = document.getElementById('backToDashboardBtn');

        if (backBtn) {

            backBtn.addEventListener('click', goBackToDashboard);

        }



        // Botão para abrir modal dimensional (dentro do resumo)

        const openModalBtnPatient = view.querySelector('.dimensional-summary .btn');

        if (openModalBtnPatient) {

             openModalBtnPatient.addEventListener('click', showDimensionalModal);

        }

    }



    /**

     * Abre o painel de um paciente específico (chamado a partir do dashboard).

     * @param {string} patientId - ID do paciente a ser aberto.

     */

    function openPatientPanel(patientId) {

        const patient = state.recentPatients.find(p => p.id === patientId);

        if (!patient) {

            showToast('error', 'Erro', 'Paciente não encontrado.');

            return;

        }



        console.log(`Abrindo painel para paciente: ${patient.name} (ID: ${patientId})`);

        state.currentPatientId = patientId;



        // Atualiza informações no header do paciente

        const view = document.getElementById('patient-view');

        if (view) {

            const nameElem = view.querySelector('.patient-name');

            const detailsElem = view.querySelector('.patient-details');

            if (nameElem) nameElem.textContent = escapeHtml(patient.name);

            if (detailsElem) detailsElem.textContent = `${escapeHtml(String(patient.age))} anos • ${escapeHtml(patient.gender)} • Prontuário #${escapeHtml(patientId.replace('patient-', ''))}`;

        }



        state.activePatientTab = 'summary-panel'; // Sempre começa no resumo

        switchView('patient');

        // A ativação da tab e a renderização do conteúdo ocorrem em executeViewSpecificLogic -> activatePatientTab

    }



    /** Ativa uma aba específica no painel do paciente */

    function activatePatientTab(panelId) {

        if (!state.currentPatientId) return; // Precisa de um paciente ativo



        console.log(`Ativando aba do paciente: ${panelId}`);

        state.activePatientTab = panelId;

        const view = document.getElementById('patient-view');

        if (!view) return;



        // Atualiza estilo das abas

        view.querySelectorAll('.patient-tab').forEach(tab => {

            tab.classList.toggle('active', tab.dataset.panel === panelId);

        });



        // Animação de troca de painéis

        const panelsContainer = view.querySelector('.patient-tab-panels');

        const activePanel = document.getElementById(panelId);

        const currentActivePanel = panelsContainer?.querySelector('.patient-tab-panel.active');



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

                    // Renderiza conteúdo específico da aba APÓS ela ficar visível

                    if (panelId === 'summary-panel') {

                        updateDimensionalChart(); // Atualiza gráfico radar

                    } else if (panelId === 'repository-panel') {

                        renderPatientDocuments(); // Renderiza lista de documentos

                    }

                    // Adicionar lógica para outras abas (ex: histórico, anotações)

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

        } else if (!currentActivePanel || currentActivePanel !== activePanel) { // Garante execução se não houver painel ativo ou se for o mesmo painel (forçar re-render)

            showActivePanel();

        }

    }



    /** Renderiza documentos na aba 'Repositório' do paciente */

    function renderPatientDocuments() {

        const documentsList = document.getElementById('patientDocuments');

        if (!documentsList) {

            console.warn("Container de documentos do paciente (#patientDocuments) não encontrado.");

            return;

        }

        if (!state.currentPatientId) {

            documentsList.innerHTML = '<p class="empty-list-message text-gray-500 text-center py-4">Erro interno: ID do paciente não definido.</p>';

            return;

        }



        documentsList.innerHTML = ''; // Limpa

        const patientDocs = state.documents.filter(doc => doc.patientId === state.currentPatientId)

            .sort((a, b) => parseDate(b.date, b.time).getTime() - parseDate(a.date, a.time).getTime()); // Ordena por data desc



        if (patientDocs.length === 0) {

            documentsList.innerHTML = '<p class="empty-list-message text-gray-500 text-center py-4">Nenhum documento encontrado para este paciente.</p>';

            return;

        }



        patientDocs.forEach(doc => {

            const item = createDocumentListItem(doc); // Usa função helper para criar o item

             // Adiciona listener para definir como ativo globalmente ao clicar no item (útil para contexto)

             item.addEventListener('click', () => {

                 setActiveDocumentItem(doc.id); // Atualiza o estado e a classe 'active' em todas as listas

             });

            documentsList.appendChild(item);

        });



         // Garante que o item ativo (se existir na lista) tenha a classe 'active'

         if (state.currentDocumentId) {

             const activeItem = documentsList.querySelector(`.document-item[data-id="${state.currentDocumentId}"]`);

             if (activeItem) {

                 activeItem.classList.add('active');

             }

         }

    }



    /** Função para voltar da view do paciente para o dashboard */

    function goBackToDashboard() {

        // state.currentPatientId = null; // Limpa o paciente ativo - COMENTADO: Manter o contexto do paciente ao voltar? Decidir.

        switchView('dashboard');

    }



    // --- View: Biblioteca (#library-view) ---



    /** Configura a interatividade da biblioteca (filtros, busca) */

    function setupLibraryView() {

        const view = document.getElementById('library-view');

        if (!view) return;



        const filtersContainer = view.querySelector('.library-filters');

        const searchInput = view.querySelector('.library-search-input');



        // Filtros (delegação)

        if (filtersContainer) {

            filtersContainer.addEventListener('click', (e) => {

                const filterBtn = e.target.closest('.library-filter');

                if (filterBtn && !filterBtn.classList.contains('active')) {

                    filtersContainer.querySelector('.library-filter.active')?.classList.remove('active');

                    filterBtn.classList.add('active');

                    renderDocumentLibrary(filterBtn.dataset.filter || 'all', searchInput?.value || '');

                }

            });

        }



        // Busca (com debounce)

        if (searchInput) {

            searchInput.addEventListener('input', debounce(() => {

                const activeFilter = filtersContainer?.querySelector('.library-filter.active')?.dataset.filter || 'all';

                renderDocumentLibrary(activeFilter, searchInput.value);

            }, 300));

        }

    }





    /** Renderiza documentos na Biblioteca com base no filtro e busca */

    function renderDocumentLibrary(filter = 'all', searchTerm = '') {

        const container = document.getElementById('documentList');

        const libraryView = document.getElementById('library-view'); // A view inteira

        const workspaceView = document.getElementById('documentView'); // O painel direito



        if (!container || !libraryView || !workspaceView) {

            console.error("Elementos da view da biblioteca não encontrados.");

            return;

        }



        // Acesso à biblioteca requer paciente selecionado

        const libraryLink = document.querySelector('.sidebar-link[data-target="library"]');

        if (!state.currentPatientId) {

            container.innerHTML = '<p class="empty-list-message text-gray-500 text-center p-4">Selecione um paciente no Dashboard para ver os seus documentos aqui.</p>';

            showEmptyDocumentView(); // Mostra mensagem no painel direito também

            libraryLink?.classList.add('disabled'); // Desabilita link na sidebar

            return;

        } else {

            libraryLink?.classList.remove('disabled'); // Habilita link

        }



        container.innerHTML = ''; // Limpa lista

        const normalizedSearch = searchTerm.toLowerCase().trim();



        // Filtra documentos do paciente atual

        const filteredDocs = state.documents.filter(doc =>

            doc.patientId === state.currentPatientId &&

            (filter === 'all' || doc.type === filter) &&

            (!normalizedSearch || doc.title.toLowerCase().includes(normalizedSearch))

        ).sort((a, b) => parseDate(b.date, b.time).getTime() - parseDate(a.date, a.time).getTime()); // Ordena por data desc



        if (filteredDocs.length === 0) {

            container.innerHTML = `<p class="empty-list-message text-gray-500 text-center p-4">Nenhum documento encontrado para este paciente ${filter !== 'all' || searchTerm ? 'com os filtros aplicados' : ''}.</p>`;

            // Se nenhum documento for encontrado E a view da biblioteca estiver ativa, mostra a view vazia à direita

            if (state.currentView === 'library') {

                 showEmptyDocumentView();

            }

            return;

        }



        // Renderiza os itens

        filteredDocs.forEach(doc => {

            const item = createDocumentListItem(doc); // Usa função helper

            // Evento principal do item: selecionar e visualizar no workspace

            item.addEventListener('click', () => {

                setActiveDocumentItem(doc.id);

                viewDocumentInWorkspace(doc.id);

            });

            container.appendChild(item);

        });



        // Mantém o item ativo se ele ainda estiver na lista filtrada

        if (state.currentDocumentId && filteredDocs.some(d => d.id === state.currentDocumentId)) {

            setActiveDocumentItem(state.currentDocumentId); // Garante que a classe 'active' seja aplicada

        } else if (state.currentView === 'library') {

             // Se o documento ativo não está mais na lista (devido a filtro/busca), limpa a seleção e a view

             state.currentDocumentId = null;

             showEmptyDocumentView();

        }

    }



    /** Define o item ativo na lista da biblioteca e na lista do paciente */

    function setActiveDocumentItem(docId) {

        // Remove 'active' de todos os itens em AMBAS as listas possíveis

        document.querySelectorAll('#documentList .document-item.active, #patientDocuments .document-item.active').forEach(item => {

            item.classList.remove('active');

        });



        // Adiciona 'active' ao item correto em AMBAS as listas possíveis

        document.querySelectorAll(`#documentList .document-item[data-id="${docId}"], #patientDocuments .document-item[data-id="${docId}"]`).forEach(item => {

            item.classList.add('active');

        });



        state.currentDocumentId = docId; // Atualiza estado global

        console.log(`Documento ativo definido: ${docId}`);

    }



    /** Visualiza o conteúdo de um documento no painel direito (workspace) da biblioteca */

    function viewDocumentInWorkspace(docId) {

        const doc = state.documents.find(d => d.id === docId);

        const viewContainer = document.getElementById('documentView');



        if (!viewContainer) {

             console.error("Container de visualização de documento (#documentView) não encontrado.");

             return;

        }



        if (!doc) {

            showEmptyDocumentView("Documento não encontrado.");

            return;

        }



        // Garante que o doc pertence ao paciente atual se estivermos na library view

        if (state.currentView === 'library' && doc.patientId !== state.currentPatientId) {

            console.warn("Tentativa de visualizar documento de outro paciente na library view.");

            showEmptyDocumentView("Este documento pertence a outro paciente.");

            state.currentDocumentId = null; // Limpa seleção inválida

            setActiveDocumentItem(null); // Remove classe 'active'

            return;

        }



        console.log(`Visualizando documento no workspace: ${doc.title} (ID: ${docId}, Tipo: ${doc.type})`);



        const content = getDocumentContent(doc.type) ?? `Conteúdo para '${doc.type}' não encontrado ou não aplicável.`;

        const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);

        const isProcessable = doc.type === 'audio' || doc.type === 'transcription';



        viewContainer.innerHTML = ''; // Limpa container



        // --- Cria Toolbar ---

        const toolbar = document.createElement('div');

        toolbar.className = 'document-toolbar flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200 bg-gray-50';

        toolbar.dataset.id = doc.id; // Adiciona ID para referência futura



        // Info Header (Esquerda)

        const infoHeader = document.createElement('div');

        infoHeader.className = 'document-info-header flex items-center mb-3 sm:mb-0';

        infoHeader.innerHTML = `

            <div class="document-info-icon text-2xl w-10 text-center mr-3 document-${doc.type}" style="color: ${doc.color || 'var(--text-secondary)'}">

                <i class="${doc.icon || 'fas fa-file'}"></i>

            </div>

            <div class="document-info-details">

                <h2 class="text-lg font-semibold text-gray-800 truncate" title="${escapeHtml(doc.title)}">${escapeHtml(doc.title)}</h2>

                <div class="document-info-meta text-xs text-gray-500">

                    <span>${escapeHtml(doc.type)}</span>

                    <span class="mx-1">&bull;</span>

                    <span>${escapeHtml(doc.date)} ${escapeHtml(doc.time || '')}</span>

                    ${doc.size ? `<span class="mx-1">&bull;</span><span>${escapeHtml(doc.size)}</span>` : ''}

                    ${doc.duration ? `<span class="mx-1">&bull;</span><span>${escapeHtml(doc.duration)}</span>` : ''}

                </div>

            </div>

        `;

        toolbar.appendChild(infoHeader);



        // Ações (Direita)

        const actions = document.createElement('div');

        actions.className = 'document-toolbar-actions flex space-x-2';

        if (isEditable) {

            actions.innerHTML += `<button class="toolbar-btn edit-doc-view btn btn-sm btn-secondary" title="Editar"><i class="fas fa-edit mr-1"></i> Editar</button>`;

        }

        if (isProcessable) {

            actions.innerHTML += `<button class="toolbar-btn process-doc-view btn btn-sm btn-secondary" title="Processar"><i class="fas fa-cogs mr-1"></i> Processar</button>`;

        }

        actions.innerHTML += `

            <button class="toolbar-btn download-doc-view btn btn-sm btn-secondary" title="Download"><i class="fas fa-download mr-1"></i> Download</button>

            <button class="toolbar-btn view-doc-modal btn btn-sm btn-secondary" title="Visualizar em Modal"><i class="fas fa-eye mr-1"></i> Visualizar</button>

        `;

        toolbar.appendChild(actions);



        viewContainer.appendChild(toolbar);



        // --- Cria Área de Conteúdo ---

        const contentArea = document.createElement('div');

        contentArea.className = 'document-content flex-grow overflow-auto p-4'; // Ocupa espaço restante e permite scroll



        const contentContainer = document.createElement('div');

        contentContainer.className = 'document-container bg-white rounded-lg shadow-sm h-full'; // Container interno

        contentArea.appendChild(contentContainer);



        const viewElement = document.createElement('div');

        viewElement.className = 'document-view p-4 h-full overflow-auto'; // Padding interno e scroll

        contentContainer.appendChild(viewElement);





        if (doc.type === 'audio') {

            // Tenta encontrar o blob associado (ex: de uma gravação recente)

            // Assume que um blob gravado/uploadado é associado temporariamente pelo ID 'recording_blob_id' ou 'upload_blob_id'

            // Esta lógica é frágil e depende de como os blobs são gerenciados após gravação/upload

            let audioBlob = null;

             if (state.processedAudioBlob) {

                // Verifica se o ID do doc corresponde a um blob processado recentemente

                // (Esta lógica precisa ser mais robusta, talvez associando o blob ao ID do documento ao salvar)

                if (doc.id === 'recording_blob_id' || doc.id === 'upload_blob_id') { // IDs placeholder

                     audioBlob = state.processedAudioBlob;

                }

             }



            if (audioBlob) {

                const audioUrl = URL.createObjectURL(audioBlob);

                viewElement.innerHTML = `

                    <div class="p-4">

                        <audio controls src="${audioUrl}" class="w-full"></audio>

                        <p class="text-sm text-gray-500 mt-2">Use 'Processar' para transcrever este áudio.</p>

                    </div>`;

                // Gerenciamento de revokeObjectURL: Idealmente, revogar quando a view mudar ou o áudio não for mais necessário.

                // Exemplo simples: revogar após um tempo ou quando a view for trocada.

                // setTimeout(() => URL.revokeObjectURL(audioUrl), 60000); // Revoga após 1 minuto (exemplo)

            } else {

                // Se não há blob, mostra placeholder

                viewElement.innerHTML = `

                    <div class="text-center p-8 text-gray-500">

                        <i class="fas fa-volume-up text-4xl mb-4"></i>

                        <p>Pré-visualização de áudio não disponível.</p>

                        <p class="text-sm mt-1">Use o botão 'Processar' para transcrever ou faça upload/grave novamente.</p>

                    </div>`;

            }

        } else {

            // Para outros tipos (texto), usa <pre>

            const pre = document.createElement('pre');

            pre.className = 'text-sm whitespace-pre-wrap break-words'; // Estilos para texto

            pre.textContent = content;

            viewElement.appendChild(pre);

        }



        viewContainer.appendChild(contentArea);



        // Adiciona listeners aos botões da toolbar recém-criada (usando delegação no container)

        viewContainer.addEventListener('click', (e) => {

            const button = e.target.closest('button');

            if (!button) return;



            if (button.classList.contains('edit-doc-view')) {

                editDocument(docId);

            } else if (button.classList.contains('process-doc-view')) {

                startProcessingDocument(docId);

            } else if (button.classList.contains('download-doc-view')) {

                downloadDocument(docId);

            } else if (button.classList.contains('view-doc-modal')) {

                viewDocumentInModal(docId); // Renomeado para clareza

            }

        });



        // Animação de entrada

        gsap.fromTo(viewContainer, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' });

    }



    /** Mostra o estado vazio no painel de visualização de documentos (workspace) */

    function showEmptyDocumentView(customMessage = null) {

        const viewContainer = document.getElementById('documentView');

        if (!viewContainer) return;



        console.log("Mostrando estado vazio do workspace.");



        let message = '<p class="document-empty-text text-gray-600">Selecione um documento da lista à esquerda para visualizá-lo aqui.</p>';

        if (customMessage) {

            message = `<p class="document-empty-text text-gray-600">${escapeHtml(customMessage)}</p>`;

        } else if (!state.currentPatientId) {

            message = '<p class="document-empty-text text-gray-600">Selecione um paciente no Dashboard para começar.</p>';

        } else if (state.documents.filter(d => d.patientId === state.currentPatientId).length === 0) {

            message = '<p class="document-empty-text text-gray-600">Nenhum documento encontrado para este paciente. Crie um novo.</p>';

        }



        viewContainer.innerHTML = `

            <div class="document-empty flex flex-col items-center justify-center h-full text-center p-8">

                <div class="document-empty-icon text-6xl text-gray-300 mb-4"><i class="fas fa-folder-open"></i></div>

                <h2 class="document-empty-title text-xl font-semibold text-gray-700 mb-2">Nenhum documento selecionado</h2>

                ${message}

                ${state.currentPatientId ? `<button class="btn btn-primary mt-4" id="emptyViewCreateBtn"><i class="fas fa-plus mr-2"></i> Criar Novo Documento</button>` : ''}

            </div>`;



        // Adiciona listener ao botão "Criar Novo" se ele existir

        const createBtn = viewContainer.querySelector('#emptyViewCreateBtn');

        createBtn?.addEventListener('click', () => switchView('new'));



        // Animação de entrada

        gsap.fromTo(viewContainer.querySelector('.document-empty'),

            { opacity: 0, y: 10 },

            { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' }

        );

    }



     /**

      * Cria um elemento HTML para um item de documento (usado na Biblioteca e Repositório do Paciente).

      * @param {object} doc - O objeto do documento.

      * @returns {HTMLElement} O elemento div do item de documento.

      */

     function createDocumentListItem(doc) {

         const item = document.createElement('div');

         item.className = `document-item document-${doc.type} flex items-center p-3 border-b border-gray-200 cursor-pointer transition hover:bg-gray-100`;

         item.dataset.id = doc.id;

         item.dataset.type = doc.type;



         // Adiciona classe 'active' se for o documento selecionado globalmente

         if (doc.id === state.currentDocumentId) {

             item.classList.add('active');

         }



         const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type);

         const isProcessable = doc.type === 'audio' || doc.type === 'transcription';



         item.innerHTML = `

             <div class="document-icon text-lg w-8 text-center mr-3" style="color: ${doc.color || 'var(--text-secondary)'}">

                 <i class="${doc.icon || 'fas fa-file'}"></i>

             </div>

             <div class="document-info flex-grow overflow-hidden mr-2">

                 <div class="document-title font-medium text-sm text-gray-800 truncate" title="${escapeHtml(doc.title)}">${escapeHtml(doc.title)}</div>

                 <div class="document-meta text-xs text-gray-500">${escapeHtml(doc.date)} ${escapeHtml(doc.time || '')}</div>

             </div>

             <div class="document-actions flex space-x-1">

                 <button class="document-action-btn view-doc-modal text-gray-500 hover:text-blue-600 p-1 rounded" title="Visualizar"><i class="fas fa-eye"></i></button>

                 ${isEditable ? `<button class="document-action-btn edit-doc text-gray-500 hover:text-green-600 p-1 rounded" title="Editar"><i class="fas fa-edit"></i></button>` : ''}

                 ${isProcessable ? `<button class="document-action-btn process-doc text-gray-500 hover:text-purple-600 p-1 rounded" title="Processar"><i class="fas fa-cogs"></i></button>` : ''}

                 <button class="document-action-btn download-doc text-gray-500 hover:text-indigo-600 p-1 rounded" title="Download"><i class="fas fa-download"></i></button>

             </div>

         `;



         // Adiciona listeners aos botões de ação (usando delegação implícita no item)

         item.querySelector('.view-doc-modal')?.addEventListener('click', (e) => { e.stopPropagation(); viewDocumentInModal(doc.id); });

         item.querySelector('.edit-doc')?.addEventListener('click', (e) => { e.stopPropagation(); editDocument(doc.id); });

         item.querySelector('.process-doc')?.addEventListener('click', (e) => { e.stopPropagation(); startProcessingDocument(doc.id); });

         item.querySelector('.download-doc')?.addEventListener('click', (e) => { e.stopPropagation(); downloadDocument(doc.id); });



         return item;

     }



    // --- View: Novo Documento (#new-view) ---



    /** Configura a view "Novo Documento" (abas, gravação, upload, transcrição manual) */

    function setupNewDocumentView() {

        const view = document.getElementById('new-view');

        if (!view) return;



        // Configura Abas (Record, Upload, Transcribe)

        const tabsContainer = view.querySelector('.library-filters'); // Reutiliza estilo de filtros

        if (tabsContainer) {

            tabsContainer.addEventListener('click', (e) => {

                const tab = e.target.closest('.library-filter');

                if (tab?.dataset?.newTab && !tab.classList.contains('active')) {

                    activateNewDocumentTab(tab.dataset.newTab);

                }

            });

        }



        // Configura Módulo de Gravação

        setupRecorder();



        // Configura Módulo de Upload

        setupUpload();



        // Configura Módulo de Transcrição Manual

        setupTranscriptionInput();



         // Configura botões de conclusão/ação dentro dos painéis de conclusão

         const recordCompletedPanel = document.getElementById('recordingCompletedPanel');

         const uploadCompletedPanel = document.getElementById('uploadCompletedPanel');

         const manualCompletedPanel = document.getElementById('manualCompletedPanel');



         recordCompletedPanel?.querySelector('.view-transcription-btn')?.addEventListener('click', viewTranscription);

         recordCompletedPanel?.querySelector('.process-transcription-btn')?.addEventListener('click', processTranscription);

         recordCompletedPanel?.querySelector('.create-new-btn')?.addEventListener('click', () => switchView('new', true)); // Força reset da view 'new'



         uploadCompletedPanel?.querySelector('.view-transcription-btn')?.addEventListener('click', viewTranscription);

         uploadCompletedPanel?.querySelector('.process-transcription-btn')?.addEventListener('click', processTranscription);

         uploadCompletedPanel?.querySelector('.create-new-btn')?.addEventListener('click', () => switchView('new', true));



         manualCompletedPanel?.querySelector('.view-transcription-btn')?.addEventListener('click', viewTranscription);

         manualCompletedPanel?.querySelector('.process-transcription-btn')?.addEventListener('click', processTranscription);

         manualCompletedPanel?.querySelector('.create-new-btn')?.addEventListener('click', () => switchView('new', true));

    }





    /** Ativa uma aba específica na view "Novo Documento" */

    function activateNewDocumentTab(tabId) {

        console.log(`Ativando aba Novo Documento: ${tabId}`);

        state.activeNewDocumentTab = tabId;



        const view = document.getElementById('new-view');

        if (!view) return;



        const tabsContainer = view.querySelector('.library-filters');

        const contentContainer = document.getElementById('newDocumentContent');

        if (!tabsContainer || !contentContainer) return;



        // Atualiza estilo das abas

        tabsContainer.querySelectorAll('.library-filter').forEach(tab => {

            tab.classList.toggle('active', tab.dataset.newTab === tabId);

        });



        // Animação de troca de painéis

        const activePanel = document.getElementById(`${tabId}-tab`);

        const currentActivePanel = contentContainer.querySelector(':scope > div.active'); // :scope garante que busca só filhos diretos



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

                    // Parar gravação se mudar de aba enquanto grava (ou outra lógica)

                    if (state.isRecording && tabId !== 'record') {

                        // stopRecording(); // Decide se quer parar ou avisar

                        console.warn("Mudou de aba durante a gravação.");

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

        } else if (!currentActivePanel || currentActivePanel !== activePanel) {

            showActivePanel();

        }

    }



    // --- Gravação de Áudio ---

    /** Configura o módulo de gravação de áudio */

    function setupRecorder() {

        const startBtn = document.getElementById('startRecordingBtn');

        const stopBtn = document.getElementById('stopRecordingBtn');

        const removeBtn = document.getElementById('recordingRemoveBtn'); // Botão no preview

        const processBtn = document.getElementById('processRecordingBtn'); // Botão no preview



        startBtn?.addEventListener('click', startRecording);

        stopBtn?.addEventListener('click', stopRecording);

        removeBtn?.addEventListener('click', resetRecording); // Remove o preview e reseta

        processBtn?.addEventListener('click', () => {

            if (state.processedAudioBlob) {

                simulateProcessing('recording'); // Inicia processamento da gravação

            } else {

                showToast('error', 'Erro', 'Nenhuma gravação concluída para processar.');

            }

        });



        // Inicializa Web Audio API para visualizador

        try {

            // Verifica se já existe antes de criar um novo

            if (!state.audioContext) {

                window.AudioContext = window.AudioContext || window.webkitAudioContext;

                if (window.AudioContext) {

                    state.audioContext = new AudioContext();

                    state.analyser = state.audioContext.createAnalyser();

                    state.analyser.fftSize = 256; // Tamanho da FFT para o visualizador

                } else {

                    throw new Error("Web Audio API não suportada.");

                }

            }

        } catch (e) {

            console.error("Erro ao inicializar Web Audio API:", e);

            showToast('warning', 'Visualizador Indisponível', 'Seu navegador não suporta a visualização de áudio em tempo real.');

            const visualizer = document.querySelector('.recording-visualizer');

            if (visualizer) visualizer.style.display = 'none'; // Esconde visualizador se API falhar

        }

    }



    /** Inicia a gravação de áudio */

    async function startRecording() {

        if (state.isRecording || state.isProcessing) return; // Não inicia se já estiver gravando ou processando



        console.log("Tentando iniciar gravação...");

        resetRecordingVisuals(); // Garante que a UI esteja no estado inicial

        state.audioChunks = [];

        state.processedAudioBlob = null; // Limpa blob anterior



        try {

            // Solicita acesso ao microfone

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

            console.log("Acesso ao microfone concedido.");



            // Cria MediaRecorder

            state.mediaRecorder = new MediaRecorder(stream);



            // Evento quando dados de áudio estão disponíveis

            state.mediaRecorder.ondataavailable = (event) => {

                if (event.data.size > 0) {

                    state.audioChunks.push(event.data);

                }

            };



            // Evento quando a gravação para

            state.mediaRecorder.onstop = () => {

                console.log("MediaRecorder parado.");

                // Cria o Blob final

                state.processedAudioBlob = new Blob(state.audioChunks, { type: 'audio/wav' }); // Ou outro tipo MIME se preferir

                console.log("Blob de áudio criado:", state.processedAudioBlob);

                state.audioChunks = []; // Limpa chunks



                // Para as tracks do stream para liberar o microfone

                stream.getTracks().forEach(track => track.stop());

                console.log("Tracks de áudio paradas.");



                // Desconecta a fonte do visualizador se existir

                if (state.visualizerSource) {

                    state.visualizerSource.disconnect();

                    state.visualizerSource = null;

                }



                updateUIAfterRecording(); // Mostra o preview e opções

            };



            // Inicia a gravação

            state.mediaRecorder.start();

            state.isRecording = true;

            state.recordingStartTime = Date.now();

            console.log("MediaRecorder iniciado.");



            startTimer(); // Inicia cronômetro na UI



            // Configura e inicia o visualizador se a API de áudio estiver disponível

            if (state.audioContext && state.analyser) {

                // Resume o AudioContext se estiver suspenso (necessário em alguns navegadores)

                if (state.audioContext.state === 'suspended') {

                    await state.audioContext.resume();

                }

                // Cria a fonte a partir do stream e conecta ao analyser

                state.visualizerSource = state.audioContext.createMediaStreamSource(stream);

                state.visualizerSource.connect(state.analyser);

                startVisualizer(); // Inicia a animação do visualizador

                const visualizerElement = document.querySelector('.recording-visualizer');

                if (visualizerElement) visualizerElement.style.opacity = '1'; // Torna visível

            }



            updateUIRecordingState(true); // Atualiza botões (mostra Parar, esconde Iniciar)

            const statusEl = document.getElementById('recordingStatus');

            if (statusEl) statusEl.textContent = 'Gravando...';



        } catch (err) {

            console.error("Erro ao iniciar gravação:", err);

            state.isRecording = false;

            updateUIRecordingState(false);

            const statusEl = document.getElementById('recordingStatus');

            if (statusEl) statusEl.textContent = 'Erro ao iniciar';



            // Mostra mensagens de erro específicas para o usuário

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {

                showToast('error', 'Permissão Negada', 'Você precisa permitir o acesso ao microfone nas configurações do navegador.');

            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {

                showToast('error', 'Microfone Não Encontrado', 'Nenhum dispositivo de microfone foi detectado.');

            } else if (err.name === 'NotReadableError') {

                 showToast('error', 'Erro de Hardware', 'Não foi possível acessar o microfone. Pode estar sendo usado por outro aplicativo.');

            } else {

                showToast('error', 'Erro na Gravação', 'Não foi possível iniciar a gravação. Verifique as permissões e o dispositivo.');

            }

        }

    }



    /** Para a gravação de áudio */

    function stopRecording() {

        if (!state.isRecording || !state.mediaRecorder) return;



        console.log("Parando gravação...");

        try {

            // O evento 'onstop' será chamado automaticamente, onde o blob é criado e as tracks são paradas.

            state.mediaRecorder.stop();

            state.isRecording = false;

            stopTimer(); // Para o cronômetro da UI

            stopVisualizer(); // Para a animação do visualizador

            updateUIRecordingState(false); // Atualiza botões



            const statusEl = document.getElementById('recordingStatus');

            if (statusEl) statusEl.textContent = 'Processando gravação...'; // Indica que está finalizando



        } catch (error) {

            console.error("Erro ao parar MediaRecorder:", error);

            // Tenta resetar o estado de gravação mesmo em caso de erro

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

        const statusEl = document.getElementById('recordingStatus');



        if (preview && fileNameEl && fileMetaEl && processBtn && statusEl && state.processedAudioBlob && state.recordingStartTime) {

            const duration = (Date.now() - state.recordingStartTime) / 1000;

            const minutes = Math.floor(duration / 60);

            const seconds = Math.floor(duration % 60);

            const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            const fileSize = (state.processedAudioBlob.size / (1024 * 1024)).toFixed(1); // Em MB



            const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD

            const filename = `Gravacao_${timestamp}.wav`; // Nome padrão



            fileNameEl.textContent = filename;

            fileMetaEl.textContent = `${fileSize} MB • ${formattedDuration}`;



            // Mostra o preview e o botão de processar com animação

            gsap.set(preview, { display: 'flex', opacity: 0 });

            gsap.to(preview, { opacity: 1, duration: 0.3 });

            gsap.set(processBtn, { display: 'inline-flex', opacity: 0 });

            gsap.to(processBtn, { opacity: 1, duration: 0.3 });



            statusEl.textContent = 'Gravação finalizada';



             // Adiciona o documento de áudio temporário ao estado (com ID especial)

             // Isso permite que ele seja baixado ou processado ANTES de ser salvo permanentemente

             const tempAudioDoc = {

                 id: 'recording_blob_id', // ID temporário para o blob

                 patientId: state.currentPatientId, // Associa ao paciente atual

                 title: filename,

                 type: 'audio',

                 date: new Date().toLocaleDateString('pt-BR'),

                 time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),

                 icon: 'fas fa-microphone',

                 color: 'var(--accent-vivid)',

                 size: `${fileSize} MB`,

                 duration: formattedDuration,

                 isTemporary: true // Flag para indicar que é do blob atual

             };

             // Remove qualquer áudio temporário anterior

             state.documents = state.documents.filter(doc => !doc.isTemporary);

             state.documents.push(tempAudioDoc); // Adiciona o novo áudio temporário



        } else {

            console.error("Elementos de preview da gravação não encontrados ou blob/startTime ausente.");

            resetRecording(); // Reseta se algo deu errado na finalização

        }

    }



    /** Reseta o estado da gravação e a UI completamente */

    function resetRecording() {

        console.log("Resetando gravação.");



        // Tenta parar o MediaRecorder se estiver ativo

        if (state.isRecording && state.mediaRecorder && state.mediaRecorder.state === 'recording') {

            try {

                state.mediaRecorder.stop(); // Isso chamará 'onstop' que limpa tracks e source

            } catch (e) {

                console.error("Erro ao tentar parar mediaRecorder no reset:", e);

                // Tenta parar as tracks manualmente como fallback

                if (state.visualizerSource?.mediaStream) {

                     state.visualizerSource.mediaStream.getTracks().forEach(track => track.stop());

                }

                 if (state.visualizerSource) {

                     state.visualizerSource.disconnect();

                     state.visualizerSource = null;

                 }

            }

        } else {

            // Se não estava gravando, mas a source ainda existe (caso raro), desconecta

             if (state.visualizerSource) {

                 state.visualizerSource.disconnect();

                 state.visualizerSource = null;

             }

        }



        state.isRecording = false;

        stopTimer();

        stopVisualizer();

        resetRecordingVisuals(); // Reseta a UI específica da gravação



        // Limpa dados

        state.audioChunks = [];

        state.processedAudioBlob = null;

        state.recordingStartTime = null;

        state.mediaRecorder = null; // Limpa a referência



         // Remove o documento de áudio temporário do estado

         state.documents = state.documents.filter(doc => !doc.isTemporary);



        console.log("Estado de gravação resetado.");

    }



    /** Reseta apenas os elementos visuais da gravação para o estado inicial */

    function resetRecordingVisuals() {

        // Botões Iniciar/Parar

        document.getElementById('startRecordingBtn')?.classList.remove('hidden');

        document.getElementById('stopRecordingBtn')?.classList.add('hidden');



        // Preview da gravação concluída

        const preview = document.getElementById('recordingPreview');

        if (preview) preview.style.display = 'none';



        // Botão Processar no preview

        const processBtn = document.getElementById('processRecordingBtn');

        if (processBtn) processBtn.style.display = 'none';



        // Indicadores de progresso/conclusão do processamento

        document.getElementById('recordingProgress')?.style.display = 'none';

        document.getElementById('recordingTranscriptionSteps')?.style.display = 'none';

        document.getElementById('recordingCompletedPanel')?.style.display = 'none';

        document.getElementById('liveTranscriptionPreview')?.style.display = 'none';





        // Tempo e Status

        const timeEl = document.getElementById('recordingTime');

        if (timeEl) timeEl.textContent = '00:00:00';

        const statusEl = document.getElementById('recordingStatus');

        if (statusEl) statusEl.textContent = 'Pronto para gravar';



        // Visualizador

        const visualizer = document.querySelector('.recording-visualizer');

        if (visualizer) visualizer.style.opacity = '0.3'; // Opacidade inicial

        const barsContainer = document.getElementById('visualizerBars');

        if (barsContainer) barsContainer.innerHTML = ''; // Limpa barras

    }



    /** Atualiza a visibilidade dos botões Iniciar/Parar gravação */

    function updateUIRecordingState(isRecording) {

        document.getElementById('startRecordingBtn')?.classList.toggle('hidden', isRecording);

        document.getElementById('stopRecordingBtn')?.classList.toggle('hidden', !isRecording);

    }



    /** Inicia o timer (cronômetro) da gravação na UI */

    function startTimer() {

        stopTimer(); // Limpa timer anterior, se houver

        const timerElement = document.getElementById('recordingTime');

        if (!timerElement || !state.recordingStartTime) return;



        state.recordingInterval = window.setInterval(() => {

            // Recalcula a partir do startTime para maior precisão

            if (!state.recordingStartTime) { stopTimer(); return; } // Segurança

            const elapsedSeconds = Math.floor((Date.now() - state.recordingStartTime) / 1000);

            const hours = Math.floor(elapsedSeconds / 3600);

            const minutes = Math.floor((elapsedSeconds % 3600) / 60);

            const seconds = elapsedSeconds % 60;

            timerElement.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        }, 1000);

    }



    /** Para o timer da gravação */

    function stopTimer() {

        if (state.recordingInterval) {

            clearInterval(state.recordingInterval);

            state.recordingInterval = null;

        }

    }



    /** Inicia o visualizador de áudio (animação das barras) */

    function startVisualizer() {

        if (!state.analyser || !state.audioContext || state.audioContext.state === 'suspended' || !state.visualizerSource) {

            console.warn("AudioContext/Analyser/Source não disponível/pronto, não iniciando visualizador.");

            return;

        }



        const visualizerBars = document.getElementById('visualizerBars');

        if (!visualizerBars) return;



        visualizerBars.innerHTML = ''; // Limpa barras antigas

        const bufferLength = state.analyser.frequencyBinCount; // Geralmente metade do fftSize

        const dataArray = new Uint8Array(bufferLength);

        const barCount = 30; // Número de barras a serem exibidas



        // Cria as barras

        for (let i = 0; i < barCount; i++) {

            const bar = document.createElement('div');

            bar.className = 'visualizer-bar bg-blue-500 w-1 mx-px'; // Estilo Tailwind

            bar.style.height = '1px'; // Altura mínima

            visualizerBars.appendChild(bar);

        }

        const bars = visualizerBars.childNodes; // NodeList das barras



        const draw = () => {

            // Verifica se ainda deve desenhar (se está gravando e analyser existe)

            if (!state.isRecording || !state.analyser) {

                stopVisualizer(); // Para o loop se a gravação parou ou analyser sumiu

                return;

            }



            // Agenda o próximo frame

            state.visualizerRafId = requestAnimationFrame(draw);



            // Obtém os dados de frequência

            state.analyser.getByteFrequencyData(dataArray);



            const maxHeight = visualizerBars.clientHeight; // Altura máxima do container

            const barHeightMultiplier = maxHeight / 128.0; // Multiplicador para escalar (0-255 -> 0-maxHeight)



            // Calcula a altura de cada barra (agrupando frequências)

            const step = Math.floor(bufferLength / barCount);

            for (let i = 0; i < barCount; i++) {

                let sum = 0;

                for (let j = 0; j < step; j++) {

                    sum += dataArray[i * step + j];

                }

                const avg = step > 0 ? sum / step : dataArray[i]; // Média ou valor direto

                // Escala a altura, garante mínimo de 1px e máximo da altura do container

                const barHeight = Math.max(1, Math.min(avg * barHeightMultiplier, maxHeight));



                if (bars[i]) {

                    // Aplica a altura (como Node)

                    (bars[i] as HTMLElement).style.height = `${barHeight}px`;

                }

            }

        };



        // Cancela qualquer RAF anterior e inicia o novo loop

        if (state.visualizerRafId) cancelAnimationFrame(state.visualizerRafId);

        state.visualizerRafId = null;

        draw();

    }



    /** Para a animação do visualizador de áudio */

    function stopVisualizer() {

        if (state.visualizerRafId) {

            cancelAnimationFrame(state.visualizerRafId);

            state.visualizerRafId = null;

        }

        // Não desconecta a source aqui, isso é feito em stopRecording/resetRecording



        // Anima as barras para baixo

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

        const removeBtn = document.getElementById('uploadRemoveBtn'); // Botão no preview

        const processBtn = document.getElementById('processUploadBtn'); // Botão no preview



        if (!uploadArea || !uploadInput || !removeBtn || !processBtn) {

            console.error("Elementos de upload não encontrados.");

            return;

        }



        // Clique na área abre o seletor de arquivo

        uploadArea.addEventListener('click', () => uploadInput.click());



        // Eventos de Drag & Drop

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {

            uploadArea.addEventListener(eventName, preventDefaults, false);

            document.body.addEventListener(eventName, preventDefaults, false); // Previne que o navegador abra o arquivo

        });



        // Highlight visual ao arrastar sobre a área

        ['dragenter', 'dragover'].forEach(eventName => {

            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);

        });

        ['dragleave', 'drop'].forEach(eventName => {

            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);

        });



        // Lidar com arquivo solto (drop)

        uploadArea.addEventListener('drop', (e) => {

            const dt = e.dataTransfer;

            const files = dt?.files;

            if (files?.length) {

                handleFiles(files);

            }

        }, false);



        // Lidar com arquivo selecionado via input

        uploadInput.addEventListener('change', (e) => {

            const target = e.target as HTMLInputElement;

            if (target.files?.length) {

                handleFiles(target.files);

            }

        });



        // Botão para remover o arquivo selecionado (no preview)

        removeBtn.addEventListener('click', resetUpload);



        // Botão para processar o arquivo selecionado (no preview)

        processBtn.addEventListener('click', () => {

            if (state.uploadedFile) {

                simulateProcessing('upload');

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



    /**

     * Lida com os arquivos selecionados/soltos, valida e atualiza a UI.

     * @param {FileList} files - Lista de arquivos.

     */

    function handleFiles(files) {

        if (files.length > 1) {

            showToast('warning', 'Apenas um arquivo', 'Por favor, envie apenas um arquivo por vez.');

            resetUpload(); // Limpa seleção

            return;

        }



        const file = files[0];

        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac', 'audio/x-m4a', 'text/plain']; // Tipos permitidos



        // Validação de tipo de arquivo

        if (!allowedTypes.includes(file.type)) {

             // Tenta verificar pela extensão se o tipo MIME estiver vazio ou genérico

             const extension = file.name.split('.').pop()?.toLowerCase();

             const allowedExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'txt'];

             if (!extension || !allowedExtensions.includes(extension)) {

                showToast('warning', 'Tipo Inválido', 'Apenas arquivos de áudio (MP3, WAV, OGG, AAC, FLAC, M4A) ou texto (.txt) são suportados.');

                resetUpload(); // Limpa se o tipo for inválido

                return;

             }

             console.warn(`Tipo MIME '${file.type}' não reconhecido, mas extensão '.${extension}' é permitida.`);

        }





        console.log("Arquivo selecionado:", file.name, file.size, file.type);

        state.uploadedFile = file; // Armazena o arquivo no estado



        // Atualiza a UI para mostrar o preview

        const preview = document.getElementById('uploadPreview');

        const fileNameEl = document.getElementById('uploadFileName');

        const fileMetaEl = document.getElementById('uploadFileMeta');

        const processBtn = document.getElementById('processUploadBtn');

        const iconEl = preview?.querySelector('.upload-preview-icon i');

        const uploadArea = document.getElementById('uploadArea');



        if (preview && fileNameEl && fileMetaEl && processBtn && iconEl && uploadArea) {

            fileNameEl.textContent = escapeHtml(file.name);

            fileMetaEl.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`; // Tamanho em MB



            // Define ícone baseado no tipo

            if (file.type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(file.name.split('.').pop()?.toLowerCase() || '')) {

                iconEl.className = 'fas fa-file-audio text-blue-500';

            } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {

                iconEl.className = 'fas fa-file-alt text-gray-500';

            } else {

                iconEl.className = 'fas fa-file text-gray-400'; // Fallback

            }



            // Animações para mostrar preview e esconder área de upload

            gsap.to(uploadArea, { opacity: 0, duration: 0.2, onComplete: () => uploadArea.style.display = 'none' });

            gsap.set(preview, { display: 'flex', opacity: 0 });

            gsap.to(preview, { opacity: 1, duration: 0.3, delay: 0.1 });

            gsap.set(processBtn, { display: 'inline-flex', opacity: 0 });

            gsap.to(processBtn, { opacity: 1, duration: 0.3, delay: 0.1 });



        }



        // Limpa o valor do input para permitir selecionar o mesmo arquivo novamente

        const uploadInput = document.getElementById('uploadInput') as HTMLInputElement;

        if (uploadInput) uploadInput.value = '';

    }



    /** Reseta o estado do upload e a UI para o estado inicial */

    function resetUpload() {

        console.log("Resetando upload.");

        state.uploadedFile = null; // Limpa arquivo do estado



        resetUploadVisuals(); // Reseta a UI específica do upload



        // Garante que a área de upload volte a aparecer

        const uploadArea = document.getElementById('uploadArea');

        if (uploadArea) {

             gsap.set(uploadArea, { display: 'flex', opacity: 0 }); // Garante display flex

             gsap.to(uploadArea, { opacity: 1, duration: 0.3 });

        }



        // Limpa o input (caso o reset não tenha sido via seleção de arquivo inválido)

        const uploadInput = document.getElementById('uploadInput') as HTMLInputElement;

        if (uploadInput) uploadInput.value = '';

    }



     /** Reseta apenas os elementos visuais do upload (preview, progresso, etc.) */

     function resetUploadVisuals() {

         const preview = document.getElementById('uploadPreview');

         const processBtn = document.getElementById('processUploadBtn');

         const uploadProgress = document.getElementById('uploadProgress');

         const uploadSteps = document.getElementById('uploadTranscriptionSteps');

         const uploadCompleted = document.getElementById('uploadCompletedPanel');



         if (preview) gsap.to(preview, { opacity: 0, duration: 0.2, onComplete: () => preview.style.display = 'none' });

         if (processBtn) gsap.to(processBtn, { opacity: 0, duration: 0.2, onComplete: () => processBtn.style.display = 'none' });

         if (uploadProgress) uploadProgress.style.display = 'none';

         if (uploadSteps) uploadSteps.style.display = 'none';

         if (uploadCompleted) uploadCompleted.style.display = 'none';

     }





    // --- Transcrição Manual ---

    /** Configura a aba de transcrição manual */

    function setupTranscriptionInput() {

        const processBtn = document.getElementById('processManualTranscriptionBtn');

        const textarea = document.getElementById('transcriptionText') as HTMLTextAreaElement;



        if (processBtn && textarea) {

            processBtn.addEventListener('click', () => {

                const text = textarea.value.trim();

                if (text) {

                    // Salva a transcrição manual no estado para uso no processamento

                    state.transcriptionText = text;

                    simulateProcessing('manual'); // Inicia o processamento

                } else {

                    showToast('warning', 'Texto Vazio', 'Por favor, digite ou cole a transcrição antes de processar.');

                    textarea.focus();

                }

            });

        }

    }



     /** Reseta a UI da transcrição manual */

     function resetManualTranscriptionVisuals() {

         const textarea = document.getElementById('transcriptionText') as HTMLTextAreaElement;

         const progress = document.getElementById('manualProgress');

         const steps = document.getElementById('manualTranscriptionSteps');

         const completed = document.getElementById('manualCompletedPanel');



         if (textarea) textarea.disabled = false; // Reabilita textarea

         if (progress) progress.style.display = 'none';

         if (steps) steps.style.display = 'none';

         if (completed) completed.style.display = 'none';

     }



    // --- Simulação de Processamento e Geração ---



    /** Define o estado de processamento global e atualiza a UI para desabilitar/habilitar interações */

    function setProcessingState(isProcessing) {

        state.isProcessing = isProcessing;

        const elementsToToggle = document.querySelectorAll(`

            .sidebar-link, .mobile-menu-item, #sidebarToggle, #mobileMenuBtn,

            .library-btn, .document-item, .toolbar-btn, .patient-tab,

            #startRecordingBtn, #stopRecordingBtn, #processRecordingBtn, #recordingRemoveBtn,

            #uploadArea, #uploadInput, #processUploadBtn, #uploadRemoveBtn,

            #processManualTranscriptionBtn, #startProcessingBtn,

            .document-format-option, .dimensional-tab, .modal-close, .modal-footer button,

            .document-action-btn, .nav-item, .library-filter,

            .access-patient-btn, #backToDashboardBtn,

            #editResultBtn, #downloadResultsBtn, .document-tab,

            #emptyViewCreateBtn, #genericModalClose, #genericModalCancelBtn,

            #editModalClose, #cancelEditBtn, #saveEditBtn,

            #dimensionalModalClose

        `); // Seletores mais abrangentes



        elementsToToggle.forEach((el: HTMLElement | HTMLButtonElement | HTMLInputElement) => {

            // Usar 'disabled' para botões/inputs, 'classList.add/remove' para outros

            if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {

                el.disabled = isProcessing;

            }

            el.classList.toggle('disabled', isProcessing); // Adiciona/remove classe para estilo visual

            el.style.pointerEvents = isProcessing ? 'none' : ''; // Impede cliques em links/divs

        });



        console.log(`Estado de processamento global: ${isProcessing}`);

         // Adiciona/remove classe no body para feedback visual global (ex: cursor)

         document.body.classList.toggle('processing', isProcessing);

    }



    /**

     * Simula o processamento de um documento (gravação, upload, manual) para gerar a transcrição.

     * @param {'recording' | 'upload' | 'manual'} type - O tipo de origem.

     */

    async function simulateProcessing(type) {

        if (state.isProcessing) return; // Não inicia se já estiver processando

        if (!state.currentPatientId) {

             showToast('error', 'Erro', 'Nenhum paciente selecionado para associar o documento.');

             switchView('dashboard');

             return;

        }



        setProcessingState(true); // Bloqueia UI

        console.log(`Simulando processamento para: ${type}`);



        // IDs dos elementos da UI baseados no tipo

        const progressContainerId = `${type}Progress`;

        const stepsContainerId = `${type}TranscriptionSteps`;

        const stepsProgressId = `${type}TranscriptionStepsProgress`;

        const completedPanelId = `${type}CompletedPanel`;

        const progressBarId = `${type}ProgressBar`;

        const percentageId = `${type}ProgressPercentage`;

        const statusId = `${type}ProgressStatus`;

        const previewId = `${type}Preview`; // Preview do áudio/arquivo

        const actionButtonId = type === 'recording' ? 'processRecordingBtn' : (type === 'upload' ? 'processUploadBtn' : 'processManualTranscriptionBtn');

        const livePreviewId = 'liveTranscriptionPreview'; // Preview da transcrição "ao vivo" (para gravação/upload)



        // Referências aos elementos

        const progressContainer = document.getElementById(progressContainerId);

        const stepsContainer = document.getElementById(stepsContainerId);

        const completedPanel = document.getElementById(completedPanelId);

        const previewContainer = document.getElementById(previewId); // Preview do input (áudio/arquivo)

        const actionButton = document.getElementById(actionButtonId); // Botão "Processar" original

        const livePreview = document.getElementById(livePreviewId); // Onde a transcrição simulada aparece

        const manualTextarea = document.getElementById('transcriptionText') as HTMLTextAreaElement;



        // --- Prepara a UI para o Processamento ---

        // Esconde botão de ação e preview do input (se aplicável)

        if (actionButton) gsap.to(actionButton, { opacity: 0, duration: 0.2, onComplete: () => actionButton.style.display = 'none' });

        if (previewContainer && type !== 'manual') gsap.to(previewContainer, { opacity: 0, duration: 0.2, onComplete: () => previewContainer.style.display = 'none' });

        if (type === 'manual' && manualTextarea) manualTextarea.disabled = true; // Desabilita textarea



        // Mostra indicadores de progresso

        if (progressContainer) progressContainer.style.display = 'block';

        if (stepsContainer) {

            stepsContainer.style.display = 'block';

            // Reseta estado visual dos steps

            const stepsElements = stepsContainer.querySelectorAll('.transcription-step');

            stepsElements.forEach(step => step.classList.remove('active', 'completed'));

            const progressIndicator = document.getElementById(stepsProgressId);

            if (progressIndicator) progressIndicator.style.width = '0%';

        }

        if (livePreview && (type === 'recording' || type === 'upload')) {

            livePreview.style.display = 'block';

            livePreview.innerHTML = '<p class="text-gray-500 italic">Iniciando análise...<span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span></p>';

        }

         if (completedPanel) completedPanel.style.display = 'none'; // Garante que painel concluído esteja escondido



        // --- Simula os Passos ---

        const steps = [

            { name: type === 'upload' ? 'Upload' : (type === 'manual' ? 'Validação' : 'Processando Áudio'), duration: 1000, text: 'Analisando dados de entrada...' },

            { name: type === 'manual' ? 'Processamento' : 'Transcrição', duration: 2000, text: 'Realizando transcrição...' },

            { name: type === 'manual' ? 'Análise' : 'Diarização', duration: 1500, text: 'Identificando segmentos e falantes...' },

            { name: 'Finalização', duration: 500, text: 'Gerando documento final...' }

        ];

        const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

        let elapsed = 0;



        // Pega a transcrição (manual ou simula uma)

        const simulatedTranscription = state.transcriptionText || `Transcrição simulada para ${type} - ${new Date().toLocaleTimeString()}. Médico: Bom dia. Paciente: Bom dia, doutor. Sinto-me um pouco melhor hoje, mas ainda com dores. Médico: Entendo. Vamos ajustar a medicação.`;

        state.transcriptionText = simulatedTranscription; // Atualiza o estado com a transcrição que será salva



        for (let i = 0; i < steps.length; i++) {

            const step = steps[i];

            updateStepProgress(stepsContainerId, stepsProgressId, i + 1); // Marca passo atual como ativo

            updateProgressBar(progressBarId, percentageId, statusId, (elapsed / totalDuration) * 100, step.name); // Atualiza barra geral



            if (livePreview && (type === 'recording' || type === 'upload')) {

                // Simula texto aparecendo

                livePreview.innerHTML = `<p class="text-gray-600"><i>${step.text}</i><span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span></p>`;

                livePreview.scrollTop = livePreview.scrollHeight; // Rola para o fim

            }



            await new Promise(resolve => setTimeout(resolve, step.duration)); // Aguarda duração do passo

            elapsed += step.duration;



            // Marca passo como concluído (exceto o último)

            if (i < steps.length - 1) {

                updateStepProgress(stepsContainerId, stepsProgressId, i + 1, true);

            }

        }



        // --- Finalização ---

        updateProgressBar(progressBarId, percentageId, statusId, 100, 'Concluído');

        updateStepProgress(stepsContainerId, stepsProgressId, steps.length, true); // Marca último passo como concluído



        if (livePreview && (type === 'recording' || type === 'upload')) {

            livePreview.innerHTML = `<p class="text-green-600 font-medium">Transcrição finalizada com sucesso!</p>`;

        }



        // Adiciona o documento de transcrição ao estado

         // Usa o nome do arquivo original (se upload/recording) ou um nome padrão

         let originalFileName = 'Transcricao_Manual';

         if (type === 'upload' && state.uploadedFile) {

             originalFileName = state.uploadedFile.name;

         } else if (type === 'recording') {

             // Tenta pegar do preview, senão usa um padrão

             originalFileName = document.getElementById('recordingFileName')?.textContent || 'Gravacao';

         }

        const newDocId = addProcessedDocument(originalFileName, type); // Adiciona doc 'transcription'



        if (newDocId) {

            state.currentDocumentId = newDocId; // Define o documento recém-criado como ativo para os botões de ação

            console.log(`Processamento de ${type} concluído. Novo Documento ID: ${newDocId}`);

        } else {

            console.error("Falha ao criar ID para o novo documento de transcrição.");

            showToast('error', 'Erro Interno', 'Não foi possível salvar a transcrição processada.');

            // Resetar UI e estado de processamento

            setProcessingState(false);

            if (type === 'recording') resetRecording();

            else if (type === 'upload') resetUpload();

            else if (type === 'manual') resetManualTranscriptionVisuals();

            return; // Interrompe

        }



        // Esconde progresso e mostra painel de conclusão

        if (progressContainer) progressContainer.style.display = 'none';

        if (stepsContainer) stepsContainer.style.display = 'none';

        if (livePreview) livePreview.style.display = 'none';

        if (completedPanel) {

            completedPanel.classList.add('active'); // Garante classe para seletores CSS

            gsap.set(completedPanel, { display: 'flex', opacity: 0 });

            gsap.to(completedPanel, { opacity: 1, duration: 0.4 });

        }



        // Reabilita textarea se for manual

        if (type === 'manual' && manualTextarea) manualTextarea.disabled = false;



        setProcessingState(false); // Libera UI

    }





    /**

     * Adiciona um documento de transcrição processado à lista `state.documents`.

     * @param {string} originalFileName - Nome do arquivo original (para basear o nome da transcrição).

     * @param {'recording' | 'upload' | 'manual'} sourceType - A origem do processamento.

     * @returns {string | null} O ID do novo documento criado ou null em caso de erro.

     */

    function addProcessedDocument(originalFileName, sourceType) {

        if (!state.currentPatientId) {

             console.error("Não é possível adicionar documento processado sem paciente selecionado.");

             return null;

        }



        const now = new Date();

        const dateStr = now.toLocaleDateString('pt-BR'); // dd/mm/yyyy

        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        // Limpa extensão e caracteres inválidos do nome base

        const safeName = originalFileName

            .replace(/\.[^/.]+$/, "") // Remove extensão

            .replace(/[^a-zA-Z0-9_-]/g, '_'); // Substitui caracteres inválidos por _

        const newId = `doc_${Date.now()}`; // ID único baseado em timestamp



        // Usa o state.transcriptionText que foi atualizado/simulado em simulateProcessing

        const contentSize = state.transcriptionText ? (state.transcriptionText.length / 1024).toFixed(1) : '0.0';



        const newDoc = {

            id: newId,

            patientId: state.currentPatientId, // Associa ao paciente atual

            title: `Transcrição_${safeName}.txt`,

            type: 'transcription', // Sempre tipo 'transcription' aqui

            date: dateStr,

            time: timeStr,

            icon: 'fas fa-file-alt',

            color: 'var(--accent)',

            size: `${contentSize} KB`,

            // Adiciona metadados sobre a origem, se útil

            // metadata: { sourceType: sourceType }

        };



        // Verifica se já existe um documento com o mesmo ID (improvável, mas seguro)

        if (state.documents.some(doc => doc.id === newId)) {

            console.error("Erro: Tentativa de adicionar documento com ID duplicado:", newId);

            return null; // Retorna null para indicar falha

        }



        state.documents.push(newDoc);

        console.log("Novo documento de transcrição adicionado:", newDoc);



        // Remove o documento de áudio temporário se a origem foi gravação/upload

        if (sourceType === 'recording' || sourceType === 'upload') {

            state.documents = state.documents.filter(doc => !doc.isTemporary);

        }



        // Atualizar UI se necessário (ex: biblioteca, repositório do paciente)

        if (state.currentView === 'library') {

            renderDocumentLibrary();

        } else if (state.currentView === 'patient' && state.activePatientTab === 'repository-panel') {

            renderPatientDocuments();

        }



        return newId; // Retorna o ID do novo documento

    }



    /** Atualiza a UI dos indicadores de passo do processamento */

    function updateStepProgress(stepsContainerId, progressIndicatorId, currentStep, completed = false) {

        const stepsContainer = document.getElementById(stepsContainerId);

        const progressIndicator = document.getElementById(progressIndicatorId);

        if (!stepsContainer || !progressIndicator) return;



        const steps = stepsContainer.querySelectorAll('.transcription-step');

        steps.forEach((step, index) => {

            const stepNumber = index + 1;

            step.classList.remove('active', 'completed');

            if (stepNumber < currentStep || (stepNumber === currentStep && completed)) {

                step.classList.add('completed');

            } else if (stepNumber === currentStep && !completed) {

                step.classList.add('active');

            }

        });



        // Atualiza a barra de progresso dos steps

        const progressPercentage = completed ? ((currentStep) / steps.length) * 100 : ((currentStep - 0.5) / steps.length) * 100;

        progressIndicator.style.width = `${Math.min(100, progressPercentage)}%`;

    }



    /** Atualiza a UI da barra de progresso geral */

    function updateProgressBar(barId, percentageId, statusId, percentage, statusText) {

        const bar = document.getElementById(barId);

        const percentEl = document.getElementById(percentageId);

        const statusEl = document.getElementById(statusId);



        if (bar) bar.style.width = `${Math.min(percentage, 100)}%`;

        if (percentEl) percentEl.textContent = `${Math.round(Math.min(percentage, 100))}%`;

        if (statusEl) statusEl.textContent = statusText;

    }



    // --- View: Processamento (#processing-view) ---



    /** Configura a view de processamento (seleção de formatos, botão iniciar) */

    function setupProcessingView() {

        const view = document.getElementById('processing-view');

        if (!view) return;



        const optionsContainer = view.querySelector('.document-format-options');

        const startBtn = document.getElementById('startProcessingBtn');

        const viewResultsBtn = document.getElementById('viewResultsBtn'); // Botão no painel de conclusão



        // Seleção de formatos (delegação)

        if (optionsContainer) {

            optionsContainer.addEventListener('click', (e) => {

                const option = e.target.closest('.document-format-option');

                if (option) {

                    option.classList.toggle('active'); // Permite selecionar/deselecionar

                }

            });

        }



        // Botão Iniciar Geração

        if (startBtn) {

            startBtn.addEventListener('click', () => {

                if (!optionsContainer) return;

                const selectedFormats = Array.from(optionsContainer.querySelectorAll('.document-format-option.active'))

                    .map(el => (el as HTMLElement).dataset.format)

                    .filter(format => format); // Filtra undefined/null



                if (selectedFormats.length === 0) {

                    showToast('warning', 'Nenhum Formato', 'Selecione pelo menos um formato de documento para gerar.');

                    return;

                }



                // Verifica se há um documento base (transcrição ou áudio) selecionado

                if (!state.currentDocumentId) {

                    showToast('error', 'Erro', 'Nenhum documento base (transcrição ou áudio) selecionado para processamento.');

                    switchView('library'); // Volta para a biblioteca para selecionar

                    return;

                }

                 const baseDoc = state.documents.find(d => d.id === state.currentDocumentId);

                 if (!baseDoc || (baseDoc.type !== 'transcription' && baseDoc.type !== 'audio')) {

                     showToast('error', 'Documento Inválido', 'O documento selecionado não é uma transcrição ou áudio válido para processamento.');

                     switchView('library');

                     return;

                 }



                simulateGeneration(selectedFormats); // Inicia a simulação de geração

            });

        }



         // Botão Ver Resultados (no painel de conclusão)

         if (viewResultsBtn) {

             viewResultsBtn.addEventListener('click', () => switchView('results'));

         }

    }



     /** Atualiza o título na view de processamento com o nome do documento base */

     function updateProcessingViewTitle() {

         const titleElement = document.getElementById('processingDocumentTitle');

         if (titleElement && state.currentDocumentId) {

             const baseDoc = state.documents.find(d => d.id === state.currentDocumentId);

             if (baseDoc) {

                 titleElement.textContent = escapeHtml(baseDoc.title);

             } else {

                 titleElement.textContent = "Documento base não encontrado";

             }

         } else if (titleElement) {

              titleElement.textContent = "Nenhum documento base selecionado";

         }

     }



    /**

     * Simula a geração dos documentos selecionados (VINTRA, SOAP, etc.).

     * @param {string[]} formats - Array com os tipos de formato selecionados (ex: ['vintra', 'soap']).

     */

    async function simulateGeneration(formats) {

        if (state.isProcessing) return;

        setProcessingState(true); // Bloqueia UI

        console.log(`Simulando geração para formatos: ${formats.join(', ')}`);



        const progressContainer = document.getElementById('processingProgress');

        const completedPanel = document.getElementById('processingCompletedPanel');

        const startBtn = document.getElementById('startProcessingBtn');

        const optionsContainer = document.querySelector('#processing-view .document-format-options');



        // Esconde botão e opções, mostra progresso

        if (startBtn) startBtn.style.display = 'none';

        if (optionsContainer) optionsContainer.style.display = 'none';

        if (progressContainer) progressContainer.style.display = 'block';

        if (completedPanel) completedPanel.style.display = 'none'; // Garante que está escondido



        const totalSteps = formats.length;

        let currentStep = 0;

        const stepDuration = 1500; // Duração simulada por formato



        for (const format of formats) {

            currentStep++;

            const statusText = `Gerando ${format.charAt(0).toUpperCase() + format.slice(1)}... (${currentStep}/${totalSteps})`;

            const percentage = (currentStep / totalSteps) * 100;

            updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', percentage, statusText);



            // Simula tempo de geração

            await new Promise(resolve => setTimeout(resolve, stepDuration));



            // Adiciona o documento gerado ao estado (simulação)

            // Em um app real, aqui ocorreria a chamada API e a resposta traria o conteúdo

            // Por ora, usamos o conteúdo de exemplo já no state e criamos um novo doc

            addGeneratedDocument(format);

        }



        updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', 100, 'Concluído');



        // Esconde progresso, mostra painel de conclusão

        if (progressContainer) progressContainer.style.display = 'none';

        if (completedPanel) {

             completedPanel.classList.add('active'); // Garante classe

             gsap.set(completedPanel, { display: 'flex', opacity: 0 });

             gsap.to(completedPanel, { opacity: 1, duration: 0.4 });

        }



        setProcessingState(false); // Libera UI

        console.log("Geração de documentos concluída.");

    }



    /**

     * Adiciona um documento gerado (VINTRA, SOAP, etc.) à lista `state.documents`,

     * baseando-se no `state.currentDocumentId` (que deve ser a transcrição ou áudio).

     * @param {string} formatType - O tipo do formato a ser gerado (ex: 'vintra', 'soap').

     */

    function addGeneratedDocument(formatType) {

        const baseDoc = state.documents.find(d => d.id === state.currentDocumentId);

        if (!baseDoc) {

            console.error("Documento base não encontrado para gerar formato:", formatType);

            showToast('error', 'Erro Interno', `Não foi possível encontrar o documento base para gerar ${formatType}.`);

            return;

        }

         if (!baseDoc.patientId) {

             console.error("Documento base não tem ID de paciente associado:", baseDoc.id);

             showToast('error', 'Erro Interno', `O documento base não está associado a um paciente.`);

             return;

         }



        const now = new Date();

        const dateStr = now.toLocaleDateString('pt-BR');

        const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const baseTitle = baseDoc.title.replace(/\.(txt|mp3|wav|m4a)$/i, ''); // Remove extensão do base

        const newId = `doc_${Date.now()}_${formatType}`; // ID mais específico



        let icon = 'fas fa-file-medical-alt';

        let color = 'var(--gray-600)';

        switch (formatType) {

            case 'vintra': icon = 'fas fa-clipboard-list'; color = 'var(--accent)'; break;

            case 'soap': icon = 'fas fa-notes-medical'; color = 'var(--success)'; break;

            case 'ipissima': icon = 'fas fa-comment-dots'; color = 'var(--accent-pink)'; break;

            case 'narrative': icon = 'fas fa-book-open'; color = 'var(--warning-yellow)'; break;

            case 'orientacoes': icon = 'fas fa-list-check'; color = '#8B5CF6'; break;

        }



        // Pega o conteúdo (de exemplo) do estado global

        const content = getDocumentContent(formatType);

        if (content === null) {

            console.error(`Conteúdo de exemplo para '${formatType}' não encontrado no estado.`);

            // Poderia criar um documento vazio ou com placeholder

            // content = `Conteúdo para ${formatType} não gerado (simulação).`;

             showToast('warning', 'Conteúdo Indisponível', `Conteúdo de exemplo para ${formatType} não encontrado.`);

             return; // Não adiciona o documento se não há conteúdo

        }

        const contentSize = (content.length / 1024).toFixed(1);



        const newDoc = {

            id: newId,

            patientId: baseDoc.patientId, // Usa o ID do paciente do documento base

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

            // Se a view de resultados estiver ativa, potencialmente atualizar o conteúdo se a tab for a correta

            if (state.currentView === 'results' && state.activeResultsTab === `${formatType}-panel`) {

                 activateResultsTab(state.activeResultsTab); // Força re-render da aba ativa

            }

        } else {

            console.warn(`Documento com ID ${newId} já existe. Geração ignorada.`);

        }

    }



    /** Inicia o fluxo de processamento (indo para a view #processing-view) a partir de um documento da biblioteca */

    function startProcessingDocument(docId) {

        const doc = state.documents.find(d => d.id === docId);

        if (!doc) {

            showToast('error', 'Erro', 'Documento não encontrado.');

            return;

        }



        if (doc.type !== 'audio' && doc.type !== 'transcription') {

            showToast('info', 'Não Processável', `Documentos do tipo '${doc.type}' não podem ser usados como base para gerar formatos VINTRA.`);

            return;

        }



        console.log(`Iniciando fluxo de processamento para: ${doc.title}`);

        state.currentDocumentId = docId; // Define como documento base para a geração



        // Reseta a UI da view de processamento para o estado inicial

        const view = document.getElementById('processing-view');

        if (view) {

            const optionsContainer = view.querySelector('.document-format-options');

            const startBtn = document.getElementById('startProcessingBtn');

            const progressContainer = document.getElementById('processingProgress');

            const completedPanel = document.getElementById('processingCompletedPanel');



            updateProcessingViewTitle(); // Atualiza o título com o nome do doc base



            if (optionsContainer) {

                optionsContainer.style.display = 'flex';

                // Reseta seleção (deixa VINTRA e SOAP ativos por padrão, por exemplo)

                optionsContainer.querySelectorAll('.document-format-option').forEach(opt => {

                    const format = (opt as HTMLElement).dataset.format;

                    opt.classList.toggle('active', format === 'vintra' || format === 'soap');

                });

            }

            if (startBtn) startBtn.style.display = 'inline-flex';

            if (progressContainer) progressContainer.style.display = 'none';

            if (completedPanel) completedPanel.style.display = 'none';

        }



        switchView('processing'); // Navega para a view de processamento

    }



    // --- View: Resultados (#results-view) ---



    /** Configura a view de resultados (abas, botões de ação) */

    function setupResultsView() {

        const view = document.getElementById('results-view');

        if (!view) return;



        const tabsContainer = view.querySelector('.document-tabs');

        const downloadBtn = document.getElementById('downloadResultsBtn');

        const editBtn = document.getElementById('editResultBtn'); // Botão Editar na toolbar



        // Abas (delegação)

        if (tabsContainer) {

            tabsContainer.addEventListener('click', (e) => {

                const tab = e.target.closest('.document-tab');

                if (tab?.dataset?.panel && !tab.classList.contains('active')) {

                    activateResultsTab(tab.dataset.panel);

                }

            });

        }



        // Botão Download

        if (downloadBtn) {

            downloadBtn.addEventListener('click', () => {

                const activeDocType = state.activeResultsTab.replace('-panel', '');

                const relevantDoc = findLatestDocumentByType(activeDocType); // Encontra doc mais recente do tipo



                if (relevantDoc) {

                    downloadDocument(relevantDoc.id);

                } else {

                    showToast('warning', 'Download Indisponível', `Não foi possível encontrar o documento '${activeDocType}' mais recente para download.`);

                }

            });

        }



        // Botão Editar

        if (editBtn) {

            editBtn.addEventListener('click', () => {

                const activeDocType = state.activeResultsTab.replace('-panel', '');

                const relevantDoc = findLatestDocumentByType(activeDocType); // Encontra doc mais recente



                if (relevantDoc) {

                    editDocument(relevantDoc.id); // Chama a função de edição existente

                } else {

                    showToast('warning', 'Edição Indisponível', `Não foi possível encontrar o documento '${activeDocType}' mais recente para edição.`);

                }

            });

        }

    }



    /** Ativa uma aba específica na view de resultados e carrega o conteúdo */

    function activateResultsTab(panelId) {

        console.log(`Ativando aba de resultados: ${panelId}`);

        state.activeResultsTab = panelId;



        const view = document.getElementById('results-view');

        if (!view) return;



        // Atualiza estilo das abas

        view.querySelectorAll('.document-tab').forEach(tab => {

            tab.classList.toggle('active', tab.dataset.panel === panelId);

        });



        // Animação de troca de painéis

        const panelsContainer = view.querySelector('.document-tab-panels');

        const activePanel = document.getElementById(panelId);

        const currentActivePanel = panelsContainer?.querySelector('.document-tab-panel.active');



        if (!activePanel) {

            console.error(`Painel de resultados não encontrado: ${panelId}`);

            return;

        }



        // Pega o tipo de documento da aba e busca o conteúdo mais recente

        const docType = panelId.replace('-panel', '');

        const relevantDoc = findLatestDocumentByType(docType); // Encontra o doc mais recente

        const content = relevantDoc ? (getDocumentContent(docType) ?? `Conteúdo para '${docType}' indisponível.`) : `Nenhum documento '${docType}' encontrado para o paciente atual.`;



        // Atualiza o conteúdo dentro do painel ativo

        // Assume que cada painel tem uma estrutura como <div class="document-view"><pre>...</pre></div>

        const contentElement = activePanel.querySelector('.document-view pre'); // Busca o <pre> diretamente

        if (contentElement) {

            contentElement.textContent = content; // Usa textContent para segurança

        } else {

             // Fallback: Se a estrutura não existir, cria-a (menos ideal)

             const docView = activePanel.querySelector('.document-view') || activePanel; // Usa o painel se .document-view não existir

             docView.innerHTML = `<pre class="text-sm whitespace-pre-wrap break-words">${escapeHtml(content)}</pre>`;

             console.warn(`Estrutura '.document-view pre' não encontrada em #${panelId}. Conteúdo inserido diretamente.`);

        }





        // Habilita/desabilita botão de edição baseado no tipo

        const editBtn = document.getElementById('editResultBtn');

        if (editBtn) {

            const isEditable = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(docType) && !!relevantDoc; // Só editável se o doc existir

            editBtn.disabled = !isEditable;

            editBtn.style.display = isEditable ? 'inline-flex' : 'none'; // Esconde se não for editável

        }



        // Lógica de animação (igual a outras trocas de aba)

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

        } else if (!currentActivePanel || currentActivePanel !== activePanel) {

            showActivePanel();

        }

    }



     /** Encontra o documento mais recente de um tipo específico para o paciente atual */

     function findLatestDocumentByType(docType) {

         if (!state.currentPatientId) return null;

         return state.documents

             .filter(d => d.type === docType && d.patientId === state.currentPatientId)

             .sort((a, b) => parseDate(b.date, b.time).getTime() - parseDate(a.date, a.time).getTime())

             [0]; // Retorna o primeiro (mais recente) ou undefined

     }



    // --- Gráficos e Visualizações ---

    let dimensionalChartInstance = null; // Instância do gráfico no painel do paciente

    let modalChartInstance = null; // Instância do gráfico no modal



    /** Inicializa variáveis de instância de gráficos */

    function initCharts() {

        dimensionalChartInstance = null;

        modalChartInstance = null;

    }



    /** Atualiza o gráfico radar dimensional no painel do paciente */

    function updateDimensionalChart() {

        const chartElem = document.getElementById('dimensionalRadarChart') as HTMLCanvasElement;



        // Só atualiza se a view e a tab estiverem corretas, o elemento existir e Chart.js carregado

        if (!chartElem || typeof Chart === 'undefined' || state.currentView !== 'patient' || state.activePatientTab !== 'summary-panel') {

            return;

        }



        console.log("Atualizando gráfico dimensional do paciente...");



        // Destroi instância anterior para evitar sobreposição e memory leaks

        if (dimensionalChartInstance instanceof Chart) {

            dimensionalChartInstance.destroy();

            dimensionalChartInstance = null;

        }



        // TODO: Obter dados reais do paciente state.currentPatientId

        // Por enquanto, usa os dados de exemplo do estado global

        const patientData = state.dimensionalData;

        const patientLabel = state.currentPatientId ? `Paciente #${state.currentPatientId.replace('patient-', '')}` : 'Paciente';



        const data = {

            labels: [

                'Valência', 'Excitação', 'Dominância', 'Intensidade', // Emocional

                'Complexidade', 'Coerência', 'Flexibilidade', 'Dissonância', // Cognitiva

                'Persp. Temporal', 'Autocontrole' // Autonomia

            ],

            datasets: [{

                label: patientLabel,

                data: [

                    patientData.emocional.valencia, patientData.emocional.excitacao, patientData.emocional.dominancia, patientData.emocional.intensidade,

                    patientData.cognitiva.complexidade, patientData.cognitiva.coerencia, patientData.cognitiva.flexibilidade, patientData.cognitiva.dissonancia,

                    patientData.autonomia.perspectivaTemporal.media, patientData.autonomia.autocontrole

                ],

                fill: true,

                backgroundColor: 'rgba(58, 163, 234, 0.2)', // Azul VINTRA com transparência

                borderColor: 'rgb(58, 163, 234)',

                pointBackgroundColor: 'rgb(58, 163, 234)',

                pointBorderColor: '#fff',

                pointHoverBackgroundColor: '#fff',

                pointHoverBorderColor: 'rgb(58, 163, 234)',

                borderWidth: 2,

                pointRadius: 4,

                pointHoverRadius: 6

            }]

        };



        const options = {

            responsive: true,

            maintainAspectRatio: false, // Permite controlar altura via CSS/container

            scales: {

                r: { // Configurações da escala radial (valores)

                    angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' }, // Linhas do centro para os rótulos

                    grid: { color: 'rgba(0, 0, 0, 0.1)' }, // Linhas circulares da grade

                    pointLabels: { font: { size: 11 }, color: 'rgba(0, 0, 0, 0.7)' }, // Rótulos das dimensões

                    suggestedMin: -10,

                    suggestedMax: 10,

                    ticks: {

                        stepSize: 2,

                        backdropColor: 'rgba(255, 255, 255, 0.75)', // Fundo para os números da escala

                        color: 'rgba(0, 0, 0, 0.6)' // Cor dos números da escala

                    }

                }

            },

            plugins: {

                legend: { display: false }, // Esconde a legenda (só tem 1 dataset)

                tooltip: {

                    callbacks: {

                        label: function(context) {

                            let label = context.dataset.label || '';

                            if (label) label += ': ';

                            if (context.parsed.r !== null) {

                                label += context.parsed.r.toFixed(1); // Formata valor com 1 decimal

                            }

                            return label;

                        }

                    }

                }

            }

        };



        try {

            // Cria a nova instância do gráfico

            dimensionalChartInstance = new Chart(chartElem.getContext('2d'), { type: 'radar', data, options });

        } catch (error) {

            console.error("Erro ao criar gráfico dimensional do paciente:", error);

            showToast('error', 'Erro no Gráfico', 'Não foi possível exibir a análise dimensional.');

            // Opcional: Mostrar mensagem de erro no lugar do canvas

             chartElem.parentElement.innerHTML = '<p class="text-red-500 text-center">Erro ao carregar gráfico.</p>';

        }

    }



    /** Configura a visualização dimensional modal (abrir/fechar, abas) */

    function setupDimensionalVisualizations() {

        const openModalBtnHeader = document.querySelector('.activate-dimensional-space'); // Botão no header

        // O botão no painel do paciente é configurado em setupPatientView

        const modalOverlay = document.getElementById('dimensionalModal');

        const closeBtn = document.getElementById('dimensionalModalClose');

        const tabsContainer = modalOverlay?.querySelector('.dimensional-tabs');



        openModalBtnHeader?.addEventListener('click', showDimensionalModal);

        closeBtn?.addEventListener('click', hideDimensionalModal);



        // Fechar ao clicar fora

        if (modalOverlay) {

            modalOverlay.addEventListener('click', (e) => {

                if (e.target === modalOverlay) {

                    hideDimensionalModal();

                }

            });

        }



        // Abas dentro do modal (delegação)

        if (tabsContainer) {

            tabsContainer.addEventListener('click', (e) => {

                const tab = e.target.closest('.dimensional-tab');

                if (tab?.dataset?.view && !tab.classList.contains('active')) {

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

            gsap.set(modal, { display: 'flex', opacity: 0 });

            gsap.to(modal, {

                opacity: 1,

                duration: 0.3,

                ease: 'power1.out',

                onComplete: () => {

                    // Ativa a view padrão (radar) e renderiza o gráfico APÓS o modal estar visível

                    activateDimensionalView(state.activeDimensionalView || 'radar');

                }

            });

            // Animação do container interno

            gsap.fromTo(modal.querySelector('.modal-container'),

                { scale: 0.95, y: 10 },

                { scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }

            );

        }

    }



    /** Esconde o modal de visualização dimensional */

    function hideDimensionalModal() {

        const modal = document.getElementById('dimensionalModal');

        if (modal && modal.style.display !== 'none') { // Verifica se está visível

            console.log("Escondendo modal dimensional");

            gsap.to(modal, {

                opacity: 0,

                duration: 0.3,

                ease: 'power1.in',

                onComplete: () => {

                    modal.style.display = 'none';

                    // Destroi o gráfico do modal ao fechar para liberar memória

                    if (modalChartInstance instanceof Chart) {

                        modalChartInstance.destroy();

                        modalChartInstance = null;

                    }

                }

            });

        }

    }



    /** Ativa uma visualização dimensional específica dentro do modal */

    function activateDimensionalView(viewType) {

        const modal = document.getElementById('dimensionalModal');

        if (!modal || modal.style.display === 'none') return; // Não faz nada se o modal não estiver visível



        console.log(`Ativando visualização dimensional no modal: ${viewType}`);

        state.activeDimensionalView = viewType;



        // Atualiza estilo das abas

        modal.querySelectorAll('.dimensional-tabs .dimensional-tab').forEach(tab => {

            tab.classList.toggle('active', tab.dataset.view === viewType);

        });



        // Animação de troca de painéis dentro do modal

        const panelsContainer = modal.querySelector('.dimensional-views');

        const activePanel = document.getElementById(`${viewType}-view`); // ID do painel da view (ex: radar-view)

        const currentActivePanel = panelsContainer?.querySelector('.dimensional-view.active');



        if (!activePanel) {

            console.error(`Painel de visualização não encontrado: ${viewType}-view`);

            return;

        }



        const showActivePanel = () => {

            // Usa 'flex' se for o 3D, 'block' para os outros (ajustar conforme necessário)

            const displayStyle = viewType === '3d' ? 'flex' : 'block';

            gsap.set(activePanel, { display: displayStyle, opacity: 0 });

            activePanel.classList.add('active');

            gsap.to(activePanel, {

                opacity: 1,

                duration: 0.3,

                ease: "power1.out",

                onComplete: () => {

                    // Renderiza o conteúdo específico APÓS a animação

                    if (viewType === 'radar') {

                        updateModalDimensionalChart(); // Renderiza/atualiza gráfico radar do modal

                    } else if (viewType === '3d') {

                        // init3DVisualization(); // Chama função para inicializar visualização 3D

                        console.warn("Visualização 3D ainda não implementada.");

                         activePanel.innerHTML = '<p class="m-auto text-gray-500">Visualização 3D indisponível.</p>'; // Placeholder

                    } else if (viewType === 'details') {

                         renderDimensionalDetails(); // Renderiza tabela/lista de detalhes

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

                     // Destroi gráfico do painel anterior se for o radar

                     if (currentActivePanel.id === 'radar-view' && modalChartInstance instanceof Chart) {

                         modalChartInstance.destroy();

                         modalChartInstance = null;

                     }

                    showActivePanel();

                }

            });

        } else if (!currentActivePanel || currentActivePanel !== activePanel) {

            showActivePanel();

        }

    }





    /** Atualiza o gráfico radar no modal dimensional */

    function updateModalDimensionalChart() {

        const chartElem = document.getElementById('modalRadarChart') as HTMLCanvasElement;

        const modal = document.getElementById('dimensionalModal');



        // Só atualiza se o modal estiver visível, o elemento existir e Chart.js carregado

        if (!chartElem || typeof Chart === 'undefined' || !modal || modal.style.display === 'none') {

            return;

        }



        console.log("Atualizando gráfico dimensional do modal...");



        // Destroi instância anterior

        if (modalChartInstance instanceof Chart) {

            modalChartInstance.destroy();

            modalChartInstance = null;

        }



        // TODO: Usar dados relevantes (paciente atual ou gerais, dependendo do contexto do modal)

        const modalData = state.dimensionalData; // Usando dados de exemplo

        const dataLabel = state.currentPatientId ? `Paciente #${state.currentPatientId.replace('patient-', '')}` : 'Análise Dimensional';





        // Reutiliza a estrutura de dados e opções do gráfico do painel, ajustando se necessário

        const data = { /* ... (mesma estrutura de dados do updateDimensionalChart) ... */

             labels: [ /* ... */ ],

             datasets: [{

                 label: dataLabel,

                 data: [ /* ... */ ],

                 /* ... estilos ... */

             }]

        };

         // Copiando estrutura de dados para evitar repetição

         data.labels = [

             'Valência', 'Excitação', 'Dominância', 'Intensidade',

             'Complexidade', 'Coerência', 'Flexibilidade', 'Dissonância',

             'Persp. Temporal', 'Autocontrole'

         ];

         data.datasets[0].data = [

             modalData.emocional.valencia, modalData.emocional.excitacao, modalData.emocional.dominancia, modalData.emocional.intensidade,

             modalData.cognitiva.complexidade, modalData.cognitiva.coerencia, modalData.cognitiva.flexibilidade, modalData.cognitiva.dissonancia,

             modalData.autonomia.perspectivaTemporal.media, modalData.autonomia.autocontrole

         ];

         // Estilos (podem ser os mesmos ou ligeiramente diferentes)

         data.datasets[0].fill = true;

         data.datasets[0].backgroundColor = 'rgba(58, 163, 234, 0.2)';

         data.datasets[0].borderColor = 'rgb(58, 163, 234)';

         data.datasets[0].pointBackgroundColor = 'rgb(58, 163, 234)';

         data.datasets[0].pointBorderColor = '#fff';

         data.datasets[0].pointHoverBackgroundColor = '#fff';

         data.datasets[0].pointHoverBorderColor = 'rgb(58, 163, 234)';

         data.datasets[0].borderWidth = 2;

         data.datasets[0].pointRadius = 4;

         data.datasets[0].pointHoverRadius = 6;





        const options = { /* ... (mesma estrutura de opções, talvez mudando a legenda) ... */

             responsive: true,

             maintainAspectRatio: false,

             scales: { r: { /* ... */ } },

             plugins: {

                 legend: { display: true, position: 'top' }, // Mostra legenda no modal

                 tooltip: { /* ... callbacks ... */ }

             }

        };

         // Copiando estrutura de opções

         options.scales.r = {

             angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' },

             grid: { color: 'rgba(0, 0, 0, 0.1)' },

             pointLabels: { font: { size: 11 }, color: 'rgba(0, 0, 0, 0.7)' },

             suggestedMin: -10,

             suggestedMax: 10,

             ticks: { stepSize: 2, backdropColor: 'rgba(255, 255, 255, 0.75)', color: 'rgba(0, 0, 0, 0.6)' }

         };

         options.plugins.tooltip = {

             callbacks: {

                 label: function(context) {

                     let label = context.dataset.label || '';

                     if (label) label += ': ';

                     if (context.parsed.r !== null) label += context.parsed.r.toFixed(1);

                     return label;

                 }

             }

         };





        try {

            modalChartInstance = new Chart(chartElem.getContext('2d'), { type: 'radar', data, options });

        } catch (error) {

            console.error("Erro ao criar gráfico dimensional do modal:", error);

            showToast('error', 'Erro no Gráfico', 'Não foi possível exibir a análise dimensional no modal.');

             chartElem.parentElement.innerHTML = '<p class="text-red-500 text-center">Erro ao carregar gráfico.</p>';

        }

    }



     /** Renderiza a tabela/lista de detalhes na aba 'Detalhes' do modal dimensional */

     function renderDimensionalDetails() {

         const detailsContainer = document.getElementById('details-content'); // Container dentro da aba 'details-view'

         if (!detailsContainer) return;



         // TODO: Usar dados relevantes (paciente atual ou gerais)

         const data = state.dimensionalData; // Usando dados de exemplo



         let html = '<h3 class="text-lg font-semibold mb-3 text-gray-700">Valores Detalhados</h3>';

         html += '<div class="space-y-4">';



         // Emocional

         html += '<div class="p-3 bg-blue-50 rounded-md">';

         html += '<h4 class="font-medium text-blue-700 mb-1">Dimensão Emocional</h4>';

         html += `<p class="text-sm text-gray-600">Valência: <span class="font-semibold">${data.emocional.valencia.toFixed(1)}</span></p>`;

         html += `<p class="text-sm text-gray-600">Excitação: <span class="font-semibold">${data.emocional.excitacao.toFixed(1)}</span></p>`;

         html += `<p class="text-sm text-gray-600">Dominância: <span class="font-semibold">${data.emocional.dominancia.toFixed(1)}</span></p>`;

         html += `<p class="text-sm text-gray-600">Intensidade: <span class="font-semibold">${data.emocional.intensidade.toFixed(1)}</span></p>`;

         html += '</div>';



         // Cognitiva

         html += '<div class="p-3 bg-green-50 rounded-md">';

         html += '<h4 class="font-medium text-green-700 mb-1">Dimensão Cognitiva</h4>';

         html += `<p class="text-sm text-gray-600">Complexidade: <span class="font-semibold">${data.cognitiva.complexidade.toFixed(1)}</span></p>`;

         html += `<p class="text-sm text-gray-600">Coerência: <span class="font-semibold">${data.cognitiva.coerencia.toFixed(1)}</span></p>`;

         html += `<p class="text-sm text-gray-600">Flexibilidade: <span class="font-semibold">${data.cognitiva.flexibilidade.toFixed(1)}</span></p>`;

         html += `<p class="text-sm text-gray-600">Dissonância: <span class="font-semibold">${data.cognitiva.dissonancia.toFixed(1)}</span></p>`;

         html += '</div>';



         // Autonomia

         html += '<div class="p-3 bg-purple-50 rounded-md">';

         html += '<h4 class="font-medium text-purple-700 mb-1">Dimensão da Autonomia</h4>';

         html += `<p class="text-sm text-gray-600">Perspectiva Temporal (Média): <span class="font-semibold">${data.autonomia.perspectivaTemporal.media.toFixed(1)}</span></p>`;

         // Opcional: Mostrar passado/presente/futuro

         // html += `<p class="text-xs text-gray-500 ml-4">Passado: ${data.autonomia.perspectivaTemporal.passado.toFixed(1)}, Presente: ${data.autonomia.perspectivaTemporal.presente.toFixed(1)}, Futuro: ${data.autonomia.perspectivaTemporal.futuro.toFixed(1)}</p>`;

         html += `<p class="text-sm text-gray-600">Autocontrole: <span class="font-semibold">${data.autonomia.autocontrole.toFixed(1)}</span></p>`;

         html += '</div>';



         html += '</div>'; // Fecha space-y-4



         detailsContainer.innerHTML = html;

     }





    // --- Edição de Documentos (Modal) ---

    /** Configura o modal de edição de documentos */

    function setupDocumentEditing() {

        const modalOverlay = document.getElementById('editDocumentModal');

        const cancelEditBtn = document.getElementById('cancelEditBtn');

        const saveEditBtn = document.getElementById('saveEditBtn');

        const editModalClose = document.getElementById('editModalClose');



        cancelEditBtn?.addEventListener('click', closeDocumentEditor);

        saveEditBtn?.addEventListener('click', saveDocumentEdit);

        editModalClose?.addEventListener('click', closeDocumentEditor);



        // Fechar ao clicar fora

        if (modalOverlay) {

            modalOverlay.addEventListener('click', (e) => {

                if (e.target === modalOverlay) {

                    closeDocumentEditor();

                }

            });

        }

    }



    /** Abre o editor de documentos (Modal) com o conteúdo do documento */

    function openDocumentEditor(docType, title, content) {

        console.log(`Abrindo editor para: ${title} (Tipo: ${docType})`);

        // Assume que state.currentDocumentId já foi definido por quem chamou editDocument()

        state.currentDocumentType = docType; // Guarda o tipo para salvar



        const modal = document.getElementById('editDocumentModal');

        const modalTitle = document.getElementById('editModalTitle');

        const editor = document.getElementById('documentEditor') as HTMLTextAreaElement;



        if (modal && modalTitle && editor) {

            modalTitle.textContent = title;

            editor.value = content; // Preenche o textarea



            gsap.set(modal, { display: 'flex', opacity: 0 });

            gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power1.out' });

            gsap.fromTo(modal.querySelector('.modal-container'),

                { scale: 0.95, y: 10 },

                { scale: 1, y: 0, duration: 0.4, ease: 'power2.out', onComplete: () => editor.focus() } // Foca no editor

            );

        } else {

            console.error("Elementos do modal de edição não encontrados.");

            showToast('error', 'Erro Interno', 'Não foi possível abrir o editor de documento.');

        }

    }



    /** Fecha o editor de documentos (Modal) */

    function closeDocumentEditor() {

        const modal = document.getElementById('editDocumentModal');

        if (modal?.style.display !== 'none') { // Verifica se está visível

            console.log("Fechando editor de documento.");

            gsap.to(modal, {

                opacity: 0,

                duration: 0.3,

                ease: 'power1.in',

                onComplete: () => {

                    if (modal) modal.style.display = 'none';

                    const editor = document.getElementById('documentEditor') as HTMLTextAreaElement;

                    if (editor) editor.value = ''; // Limpa o editor

                    // state.currentDocumentType = null; // Limpa tipo ao fechar - DECIDIR: Manter ou limpar? Manter pode ser útil se reabrir logo.

                }

            });

        }

    }



    /** Salva as edições feitas no documento (Modal) */

    function saveDocumentEdit() {

        const editor = document.getElementById('documentEditor') as HTMLTextAreaElement;

        if (!editor || !state.currentDocumentType || !state.currentDocumentId) {

            console.error("Não é possível salvar: editor, tipo ou ID do documento ausente no estado.");

            showToast('error', 'Erro ao Salvar', 'Não foi possível identificar o documento a ser salvo.');

            return;

        }



        const newContent = editor.value;

        const docKey = `${state.currentDocumentType}Text`; // Chave no objeto state (ex: 'vintraText')



        console.log(`Salvando documento: ID ${state.currentDocumentId}, Tipo ${state.currentDocumentType}`);



        // Atualiza o conteúdo no estado global (simulação - idealmente seria API call)

        if (state.hasOwnProperty(docKey)) {

            // Atribuição segura

             (state as any)[docKey] = newContent; // Usar 'as any' ou definir tipo mais preciso para state

            console.log(`Conteúdo para ${docKey} atualizado no estado.`);



            // Atualiza a visualização se o documento editado estiver visível em algum lugar

            // 1. Na Biblioteca (workspace)

            const workspaceToolbar = document.querySelector(`#documentView .document-toolbar[data-id="${state.currentDocumentId}"]`);

            if (workspaceToolbar) {

                viewDocumentInWorkspace(state.currentDocumentId); // Re-renderiza o workspace

            }

            // 2. Na View de Resultados

            else if (state.currentView === 'results' && state.activeResultsTab === `${state.currentDocumentType}-panel`) {

                 activateResultsTab(state.activeResultsTab); // Re-renderiza a aba de resultados

            }

            // 3. Opcional: Atualizar pré-visualização na aba do paciente (se houver)



            showToast('success', 'Documento Salvo', `Alterações em '${state.currentDocumentType}' foram salvas.`);

            closeDocumentEditor(); // Fecha o modal após salvar

        } else {

            console.error(`Chave de estado inválida para salvar: ${docKey}`);

            showToast('error', 'Erro ao Salvar', `Tipo de documento inválido ou não encontrado no estado: ${state.currentDocumentType}.`);

        }

    }



    // --- Ações de Documento (Visualizar Modal, Editar, Download) ---



    /** Visualiza um documento em um modal genérico */

    function viewDocumentInModal(docId) {

        const doc = state.documents.find(d => d.id === docId);

        if (!doc) {

            showToast('error', 'Erro', 'Documento não encontrado.');

            return;

        }



        console.log(`Visualizando (modal genérico): ${doc.title}`);

        const content = getDocumentContent(doc.type) ?? `Conteúdo para '${doc.type}' não disponível.`;



        // Formata o conteúdo para exibição (usando <pre> para texto)

        let formattedContent = '';

        if (doc.type === 'audio') {

             // Lógica similar à viewDocumentInWorkspace para áudio

             let audioBlob = null;

             if (state.processedAudioBlob && (doc.id === 'recording_blob_id' || doc.id === 'upload_blob_id')) { // IDs placeholder

                  audioBlob = state.processedAudioBlob;

             }

             if (audioBlob) {

                 const audioUrl = URL.createObjectURL(audioBlob);

                 formattedContent = `<audio controls src="${audioUrl}" class="w-full my-4"></audio>`;

                 // TODO: Gerenciar revokeObjectURL

             } else {

                 formattedContent = `<p class="text-gray-500 my-4 text-center">Pré-visualização de áudio indisponível neste modal.</p>`;

             }

        } else {

             formattedContent = `<pre class="text-sm whitespace-pre-wrap break-words max-h-[60vh] overflow-auto bg-gray-100 p-3 rounded">${escapeHtml(content)}</pre>`;

        }



        showGenericModal(`Visualizar: ${escapeHtml(doc.title)}`, formattedContent);

    }



    /** Abre um documento para edição (verifica tipo e chama o modal de edição) */

    function editDocument(docId) {

        const doc = state.documents.find(d => d.id === docId);

        if (!doc) {

            showToast('error', 'Erro', 'Documento não encontrado.');

            return;

        }



        const editableTypes = ['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'];

        if (editableTypes.includes(doc.type)) {

            const content = getDocumentContent(doc.type);

            if (content !== null) { // Verifica se o conteúdo foi encontrado no estado

                state.currentDocumentId = docId; // Define o ID do documento que está sendo editado ANTES de abrir o modal

                openDocumentEditor(doc.type, `Editar ${escapeHtml(doc.title)}`, content);

            } else {

                showToast('error', 'Erro', `Conteúdo para '${doc.type}' não encontrado no estado para edição.`);

            }

        } else {

            showToast('info', 'Não Editável', `Documentos do tipo '${doc.type}' não podem ser editados diretamente.`);

        }

    }



    /** Realiza o download de um documento (texto ou áudio simulado/blob) */

    function downloadDocument(docId) {

        const doc = state.documents.find(d => d.id === docId);

        if (!doc) {

            showToast('error', 'Erro', 'Documento não encontrado.');

            return;

        }



        console.log(`Iniciando download de: ${doc.title}`);



        let blob;

        let filename = doc.title; // Usa o título como nome de arquivo padrão



        if (doc.type === 'audio') {

            // Tenta usar o blob processado se for o áudio temporário

            if ((doc.id === 'recording_blob_id' || doc.id === 'upload_blob_id') && state.processedAudioBlob) {

                blob = state.processedAudioBlob;

                 // Garante extensão correta no nome do arquivo

                 if (!filename.match(/\.(wav|mp3|ogg|m4a|aac|flac)$/i)) {

                     filename = filename.replace(/\.[^/.]+$/, "") + ".wav"; // Assume .wav se não houver extensão de áudio

                 }

            } else {

                // Simulação para outros áudios ou se o blob não estiver disponível

                blob = new Blob(["Simulação de conteúdo de áudio para " + doc.title], { type: 'audio/wav' });

                 if (!filename.match(/\.(wav|mp3|ogg|m4a|aac|flac)$/i)) {

                     filename = filename.replace(/\.[^/.]+$/, "") + ".wav";

                 }

                showToast('info', 'Download Simulado', 'Este é um arquivo de áudio simulado.');

            }

        } else {

            // Para tipos de texto

            const content = getDocumentContent(doc.type);

            if (content === null) {

                showToast('error', 'Erro no Download', `Conteúdo para '${doc.type}' não encontrado.`);

                return;

            }

            blob = new Blob([content], { type: 'text/plain;charset=utf-8' });

             // Garante extensão .txt se não houver

             if (!filename.toLowerCase().endsWith('.txt')) {

                 filename += '.txt';

             }

        }



        // Cria link temporário para download

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;

        a.download = filename;

        document.body.appendChild(a);

        a.click();



        // Limpeza após o clique

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

            return (state as any)[key]; // Usa 'as any' ou melhora a tipagem de 'state'

        }

        console.warn(`Conteúdo para o tipo '${type}' (chave '${key}') não encontrado no estado.`);

        return null; // Retorna null se não encontrado

    }



    // --- Notificações Toast ---

    /**

     * Mostra uma notificação toast.

     * @param {'info' | 'success' | 'warning' | 'error'} type - Tipo do toast.

     * @param {string} title - Título do toast.

     * @param {string} message - Mensagem do toast.

     * @param {number} [duration=5000] - Duração em milissegundos.

     */

    function showToast(type, title, message, duration = 5000) {

        if (!DOM.toastContainer) {

             console.error("Container de toasts não encontrado!");

             // Tenta criar dinamicamente como fallback (embora deva ser criado no init)

             DOM.toastContainer = document.createElement('div');

             DOM.toastContainer.id = 'toastContainer';

             DOM.toastContainer.className = 'toast-container';

             document.body.appendChild(DOM.toastContainer);

             // return; // Descomentar se preferir não mostrar o toast se o container falhar

        }





        const toast = document.createElement('div');

        toast.className = `toast toast-${type} flex items-start p-4 rounded-lg shadow-lg bg-white border-l-4 border-${type === 'success' ? 'green' : type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'blue'}-500 mb-3`; // Estilo base



        let iconClass = 'fas fa-info-circle';

        let iconColor = 'text-blue-500';

        if (type === 'success') { iconClass = 'fas fa-check-circle'; iconColor = 'text-green-500'; }

        else if (type === 'error') { iconClass = 'fas fa-times-circle'; iconColor = 'text-red-500'; }

        else if (type === 'warning') { iconClass = 'fas fa-exclamation-triangle'; iconColor = 'text-yellow-500'; }



        toast.innerHTML = `

            <div class="toast-icon text-xl mr-3 ${iconColor}"> <i class="${iconClass}"></i> </div>

            <div class="toast-content flex-grow">

                <div class="toast-title font-semibold text-gray-800">${escapeHtml(title)}</div>

                <div class="toast-message text-sm text-gray-600">${escapeHtml(message)}</div>

            </div>

            <button class="toast-close ml-4 text-gray-400 hover:text-gray-600"> <i class="fas fa-times"></i> </button>

        `;



        // Botão fechar

        toast.querySelector('.toast-close')?.addEventListener('click', () => removeToast(toast));



        // Adiciona ao container (no início para aparecer no topo)

        DOM.toastContainer.prepend(toast);



        // Animação de entrada

        gsap.fromTo(toast,

            { opacity: 0, y: 20, scale: 0.9 },

            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }

        );



        // Auto-remover após duração

        const timeoutId = setTimeout(() => removeToast(toast), duration);



         // Pausar timeout ao passar o mouse sobre o toast

         toast.addEventListener('mouseenter', () => clearTimeout(timeoutId));

         toast.addEventListener('mouseleave', () => {

             // Reinicia timeout (com duração restante ou fixa)

             setTimeout(() => removeToast(toast), duration / 2); // Ex: metade da duração original

         });

    }



    /** Remove um toast específico com animação */

    function removeToast(toastElement) {

        // Verifica se o toast ainda existe no DOM antes de animar

        if (!toastElement?.parentNode) return;



        gsap.to(toastElement, {

            opacity: 0,

            // x: 50, // Animação para o lado (opcional)

            marginTop: `-${toastElement.offsetHeight}px`, // Anima para cima

            duration: 0.4,

            ease: 'power1.in',

            onComplete: () => {

                toastElement.remove();

            }

        });

    }



    // --- Modal Genérico ---

    /** Configura o modal genérico (fechar) */

    function setupGenericModal() {

        const modalOverlay = document.getElementById('genericModal');

        const closeBtn = document.getElementById('genericModalClose');

        const cancelBtn = document.getElementById('genericModalCancelBtn'); // Botão padrão "Fechar"



        closeBtn?.addEventListener('click', hideGenericModal);

        cancelBtn?.addEventListener('click', hideGenericModal);



        // Fechar ao clicar fora

        if (modalOverlay) {

            modalOverlay.addEventListener('click', (e) => {

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

            modalBody.innerHTML = htmlContent; // CUIDADO: Garanta que htmlContent seja seguro ou sanitizado se vier de fontes não confiáveis



            gsap.set(modal, { display: 'flex', opacity: 0 });

            gsap.to(modal, { opacity: 1, duration: 0.3, ease: 'power1.out' });

            gsap.fromTo(modal.querySelector('.modal-container'),

                { scale: 0.95, y: 10 },

                { scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }

            );

        } else {

            console.error("Elementos do modal genérico não encontrados.");

            showToast('error', 'Erro Interno', 'Não foi possível abrir o modal.');

        }

    }



    /** Esconde o modal genérico */

    function hideGenericModal() {

        const modal = document.getElementById('genericModal');

        if (modal?.style.display !== 'none') { // Verifica se está visível

            gsap.to(modal, {

                opacity: 0,

                duration: 0.3,

                ease: 'power1.in',

                onComplete: () => {

                    if (modal) modal.style.display = 'none';

                    const modalBody = document.getElementById('genericModalBody');

                    if (modalBody) modalBody.innerHTML = ''; // Limpa conteúdo

                }

            });

        }

    }



    // --- Utilitários ---

    /**

     * Debounce: Atraso na execução de uma função após um período sem chamadas.

     * @param {Function} func - A função a ser executada.

     * @param {number} wait - O tempo de espera em milissegundos.

     * @returns {Function} A função com debounce.

     */

    function debounce(func, wait) {

        let timeout = null;

        return function executedFunction(...args) {

            const later = () => {

                timeout = null;

                func.apply(this, args);

            };

            if (timeout !== null) {

                clearTimeout(timeout);

            }

            timeout = window.setTimeout(later, wait);

        };

    }



    /**

     * Escapa caracteres HTML especiais para prevenir XSS.

     * @param {*} unsafe - O valor a ser escapado (será convertido para string).

     * @returns {string} A string escapada.

     */

// Polyfills gerados pelo TypeScript para async/await (MANTER)

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {

    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }

    return new (P || (P = Promise))(function (resolve, reject) {

        function fulfilled(value) { try {

            step(generator.next(value));

        }

        catch (e) {

            reject(e);

        } }

        function rejected(value) { try {

            step(generator["throw"](value));

        }

        catch (e) {

            reject(e);

        } }

        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }

        step((generator = generator.apply(thisArg, _arguments || [])).next());

    });

};

var __generator = (this && this.__generator) || function (thisArg, body) {

    var _ = { label: 0, sent: function () { if (t[0] & 1)

            throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;

    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;

    function verb(n) { return function (v) { return step([n, v]); }; }

    function step(op) {

        if (f)

            throw new TypeError("Generator is already executing.");

        while (_)

            try {

                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)

                    return t;

                if (y = 0, t)

                    op = [op[0] & 2, t.value];

                switch (op[0]) {

                    case 0:

                    case 1:

                        t = op;

                        break;

                    case 4:

                        _.label++;

                        return { value: op[1], done: false };

                    case 5:

                        _.label++;

                        y = op[1];

                        op = [0];

                        continue;

                    case 7:

                        op = _.ops.pop();

                        _.trys.pop();

                        continue;

                    default:

                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {

                            _ = 0;

                            continue;

                        }

                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {

                            _.label = op[1];

                            break;

                        }

                        if (op[0] === 6 && _.label < t[1]) {

                            _.label = t[1];

                            t = op;

                            break;

                        }

                        if (t && _.label < t[2]) {

                            _.label = t[2];

                            _.ops.push(op);

                            break;

                        }

                        if (t[2])

                            _.ops.pop();

                        _.trys.pop();

                        continue;

                }

                op = body.call(thisArg, _);

            }

            catch (e) {

                op = [6, e];

                y = 0;

            }

            finally {

                f = t = 0;

            }

        if (op[0] & 5)

            throw op[1];

        return { value: op[0] ? op[1] : void 0, done: true };

    }

};

// IIFE para encapsular todo o script e evitar poluição global

(function () {

    'use strict'; // Habilita o modo estrito para ajudar a pegar erros comuns

    // --- Estado Global Centralizado ---

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

        // Conteúdo de exemplo para documentos (idealmente viria do backend ou seria carregado sob demanda)

        transcriptionText: "Entrevista Clínica - 04 de Abril de 2025\nMédico: Bom dia, Maria. Como você está se sentindo hoje?\nPaciente: Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar. (Suspira) É difícil manter a esperança.\nMédico: Entendo que seja difícil, Maria. Vamos conversar sobre isso. Além da dor física, como está o seu ânimo?\nPaciente: Péssimo. Me sinto desanimada, sem vontade de fazer nada. Até as coisas que eu gostava perderam a graça. Parece que estou carregando um peso enorme.",

        vintraText: "# Análise VINTRA - Maria Silva (04/04/2025)\n\n## Dimensões Emocionais\n- Valência (v₁): -2.5 (Negativa)\n- Excitação (v₂): 7.0 (Alta)\n- Dominância (v₃): 3.0 (Baixa)\n- Intensidade (v₄): 8.0 (Alta)\n\n... (restante do texto VINTRA)",

        soapText: "# Nota SOAP - Maria Silva (04/04/2025)\n\n## S (Subjetivo)\nPaciente relata persistência da dor...\n\n... (restante do texto SOAP)",

        ipissimaText: "# Ipíssima Narrativa - Maria Silva (04/04/2025)\n\nEu não aguento mais essa dor...\n\n... (restante do texto Ipíssima)",

        narrativeText: "# Análise Narrativa - Maria Silva (04/04/2025)\n\n## Temas Centrais:\n- Dor crônica...\n\n... (restante da análise narrativa)",

        orientacoesText: "# Orientações - Maria Silva (04/04/2025)\n\n1.  **Medicação:** Continue...\n\n... (restante das orientações)"

    };

    // --- Cache de Seletores DOM Comuns ---

    // Melhora a performance e facilita a manutenção

    var DOM = {

        appContainer: null,

        splashScreen: null,

        loginScreen: null,

        loginForm: null,

        passwordInput: null,

        passwordError: null,

        toastContainer: null,

        sidebar: null,

        sidebarToggle: null,

        mobileMenuBtn: null,

        mobileMenu: null,

        mobileMenuBackdrop: null,

        mobileMenuClose: null,

        // Views principais (serão buscadas quando necessário)

        // Modais (serão buscadas quando necessário)

        // Outros elementos frequentemente usados podem ser adicionados aqui

    };

    // --- Inicialização Principal ---

    document.addEventListener('DOMContentLoaded', function () {

        console.log("VINTRA Inicializando...");

        // Cache de elementos DOM principais

        DOM.appContainer = document.getElementById('appContainer');

        DOM.splashScreen = document.getElementById('splashScreen');

        DOM.loginScreen = document.getElementById('loginScreen');

        DOM.loginForm = document.getElementById('loginForm');

        DOM.passwordInput = document.getElementById('password');

        DOM.passwordError = document.getElementById('passwordError');

        DOM.toastContainer = document.getElementById('toastContainer');

        DOM.sidebar = document.querySelector('.app-sidebar');

        DOM.sidebarToggle = document.getElementById('sidebarToggle');

        DOM.mobileMenuBtn = document.getElementById('mobileMenuBtn');

        DOM.mobileMenu = document.getElementById('mobileMenu');

        DOM.mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

        DOM.mobileMenuClose = document.querySelector('.mobile-menu-close');

        // Garante que o container de toasts exista (Integração da correção)

        if (!DOM.toastContainer) {

            DOM.toastContainer = document.createElement('div');

            DOM.toastContainer.id = 'toastContainer';

            DOM.toastContainer.className = 'toast-container'; // Adiciona classe para estilização

            document.body.appendChild(DOM.toastContainer);

            console.log("Container de toasts criado dinamicamente.");

        }

        loadDemoData();

        setupEventListeners(); // Configura TODOS os listeners centralizadamente

        initCharts(); // Inicializa estruturas de gráficos

        initFluidAnimations(); // Configura efeito ripple

        fixLayoutIssues(); // Aplica correções de layout iniciais

        validateDOMElements(); // Verifica elementos críticos

        // Estado inicial: Mostrar Splash brevemente, depois Login

        if (DOM.splashScreen && DOM.loginScreen && DOM.appContainer) {

            gsap.set(DOM.splashScreen, { display: 'flex', opacity: 1 }); // Garante visibilidade inicial

            gsap.to(DOM.splashScreen, {

                opacity: 0,

                duration: 0.5,

                delay: 0.7,

                ease: "power1.inOut",

                onComplete: function () {

                    DOM.splashScreen.style.display = 'none';

                    gsap.set(DOM.loginScreen, { display: 'flex', opacity: 0 });

                    DOM.loginScreen.classList.add('visible'); // Adiciona classe para controle CSS se necessário

                    gsap.to(DOM.loginScreen, {

                        opacity: 1,

                        duration: 0.5,

                        ease: "power1.out"

                    })
