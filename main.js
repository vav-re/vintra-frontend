/**
 * VINTRA - Visualização INtegrativa TRAjetorial
 * Script principal
 */

// Importar serviços (em produção usaria módulos ES6 ou um bundler)
// const { PatientService, SessionService, AudioService, AnalysisService } = apiServices;

// Estado global da aplicação
const state = {
    // Autenticação e usuário
    isAuthenticated: false,
    currentUser: null,
    
    // Navegação
    activeView: 'dashboard',
    
    // Dados atuais
    currentPatient: null,
    currentSession: null,
    
    // Estado do gravador
    isRecording: false,
    recordingPaused: false,
    mediaRecorder: null,
    audioChunks: [],
    recordingTimer: null,
    recordingSeconds: 0,
    
    // Dados de transcrição e análise
    transcriptionText: "",
    recordedBlob: null,
    uploadedFile: null,
    isDiarizationEnabled: true,
    
    // Estado dos processos
    isProcessing: false,
    
    // Análise dimensional
    dimensionalAnalysis: {
      v1: 0,              // Valência Emocional (-5 a +5)
      v2: 0,              // Excitação Emocional (0-10)
      v3: 0,              // Dominância Emocional (0-10)
      v4: 0,              // Intensidade Afetiva (0-10)
      v5: 0,              // Complexidade Sintática (0-10)
      v6: 0,              // Coerência Narrativa (0-10)
      v7: 0,              // Flexibilidade Cognitiva (0-10)
      v8: 0,              // Dissonância Cognitiva (0-10)
      v9_past: 0,         // Perspectiva Temporal - Passado (0-10)
      v9_present: 0,      // Perspectiva Temporal - Presente (0-10)
      v9_future: 0,       // Perspectiva Temporal - Futuro (0-10)
      v10: 0,             // Autocontrole (0-10)
      sintese_narrativa: "",
      formulacao_integrativa: "",
      recomendacoes: []
    },
    
    // Dados historicos (trajetória)
    trajectoryData: [],
    
    // Dados de demonstração para o MVP
    demoData: {
      patients: [
        { 
          id: 'p1', 
          name: 'João Silva', 
          age: 48, 
          email: 'joao.silva@email.com',
          phone: '41 99876-5432',
          sessions: [
            {
              id: 's1',
              date: '2024-05-06',
              time: '10:00',
              tag: 'Ansiedade generalizada',
              dimensional: {
                v1: -2.5, v2: 7.0, v3: 3.0, v4: 8.0,  
                v5: 6.0, v6: 5.0, v7: 4.0, v8: 7.0,  
                v9_past: 7.0, v9_present: 3.0, v9_future: 2.0, v10: 4.0
              }
            },
            {
              id: 's2',
              date: '2024-04-28',
              time: '15:30',
              tag: 'Insônia persistente',
              dimensional: {
                v1: -3.0, v2: 7.5, v3: 2.5, v4: 7.5,  
                v5: 5.5, v6: 4.5, v7: 3.5, v8: 6.5,  
                v9_past: 8.0, v9_present: 2.5, v9_future: 1.5, v10: 3.5
              }
            },
            {
              id: 's3',
              date: '2024-04-15',
              time: '09:45',
              tag: 'Estresse ocupacional',
              dimensional: {
                v1: -3.5, v2: 8.0, v3: 2.0, v4: 7.0,  
                v5: 5.0, v6: 4.0, v7: 3.0, v8: 7.5,  
                v9_past: 6.0, v9_present: 4.0, v9_future: 1.0, v10: 3.0
              }
            },
            {
              id: 's4',
              date: '2024-04-02',
              time: '17:00',
              tag: 'Desânimo constante',
              dimensional: {
                v1: -4.0, v2: 5.0, v3: 2.0, v4: 6.0,  
                v5: 4.5, v6: 3.5, v7: 2.5, v8: 5.5,  
                v9_past: 8.5, v9_present: 2.0, v9_future: 0.5, v10: 2.5
              }
            }
          ]
        },
        { 
          id: 'p2', 
          name: 'Maria Oliveira', 
          age: 35, 
          email: 'maria.oliveira@email.com',
          phone: '11 98765-4321',
          sessions: [
            {
              id: 's5',
              date: '2024-05-03',
              time: '14:00',
              tag: 'Transtorno de ansiedade',
              dimensional: {
                v1: -2.0, v2: 8.5, v3: 2.5, v4: 7.5,
                v5: 6.5, v6: 5.5, v7: 3.5, v8: 6.0,
                v9_past: 5, v9_present: 4, v9_future: 2, v10: 3.5
              }
            }
          ]
        },
        { 
          id: 'p3', 
          name: 'Carlos Santos', 
          age: 42, 
          email: 'carlos.santos@email.com',
          phone: '21 97654-3210',
          sessions: []
        }
      ]
    }
  };
  
  // Inicialização ao carregar a página
  document.addEventListener('DOMContentLoaded', function() {
    // Iniciar animação do logo de splash
    setTimeout(() => {
      animateLogo();
    }, 500);
    
    // Configurar eventos do sistema
    setupLogin();
    setupNavigation();
    setupSidebar();
    setupTabSwitching();
    setupPatientDetails();
    setupSessionDetails();
    setupRecorder();
    setupUpload();
    setupTranscription();
    setupModals();
    
    // Carregar dados de exemplo para demonstração do MVP
    loadDemoData();
  });
  
  /**
   * Animação do logo na tela inicial
   */
  function animateLogo() {
    const splashScreen = document.getElementById('splashScreen');
    const loginScreen = document.getElementById('loginScreen');
    
    // Animação simples com transformação e opacidade
    setTimeout(() => {
      if (splashScreen) {
        splashScreen.classList.add('hidden');
      }
      
      if (loginScreen) {
        loginScreen.classList.add('visible');
      }
    }, 2000);
  }
  
  /**
   * Configuração de login
   */
  function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // No MVP, fazer uma validação simples
        if (email && password) {
          // Animação de saída do login
          const loginScreen = document.getElementById('loginScreen');
          loginScreen.classList.remove('visible');
          
          // Atualizar estado da aplicação
          state.isAuthenticated = true;
          state.currentUser = {
            name: 'Dr. Santos',
            email: email,
            role: 'clinician'
          };
          
          // Exibir o app principal
          document.getElementById('appContainer').style.display = 'block';
          
          // Em uma implementação real, aqui faríamos uma chamada à API para autenticar
          // try {
          //   const authResult = await authService.login(email, password);
          //   if (authResult.success) {
          //     state.isAuthenticated = true;
          //     state.currentUser = authResult.user;
          //     document.getElementById('appContainer').style.display = 'block';
          //   }
          // } catch (error) {
          //   showToast('error', 'Erro de autenticação', error.message);
          // }
        } else {
          showToast('error', 'Erro de autenticação', 'Por favor, informe email e senha.');
        }
      });
    }
    
    // Configurar evento de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Reset do estado
        state.isAuthenticated = false;
        state.currentUser = null;
        
        // Ocultar app e mostrar login
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('loginScreen').classList.add('visible');
        
        // Reset de campos
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
      });
    }
  }
  
  /**
   * Configuração da navegação e views
   */
  function setupNavigation() {
    // Links de navegação principal e sidebar
    const navLinks = document.querySelectorAll('.nav-item[data-target], .sidebar-link[data-target]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetView = this.dataset.target;
        switchView(targetView);
      });
    });
    
    // Botões de voltar
    const backButtons = document.querySelectorAll('.btn-back[data-target]');
    
    backButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetView = this.dataset.target;
        switchView(targetView);
      });
    });
  }
  
  /**
   * Alternar entre diferentes views
   * @param {string} viewId - ID da view a ser exibida
   */
  function switchView(viewId) {
    // Verificar se a view existe
    const viewElement = document.getElementById(`${viewId}-view`);
    if (!viewElement) return;
    
    // Ocultar a view atual
    const currentView = document.querySelector('.view.active');
    if (currentView) {
      currentView.classList.remove('active');
    }
    
    // Mostrar a nova view
    viewElement.classList.add('active');
    
    // Atualizar estado
    state.activeView = viewId;
    
    // Atualizar navegação
    updateNavigation(viewId);
    
    // Processar ações específicas de cada view
    handleViewSpecificActions(viewId);
  }
  
  /**
   * Atualizar itens de navegação baseado na view ativa
   * @param {string} viewId - ID da view ativa
   */
  function updateNavigation(viewId) {
    // Atualizar itens de navegação
    document.querySelectorAll('.nav-item, .sidebar-link').forEach(item => {
      if (item.dataset.target === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  /**
   * Executar ações específicas ao mudar de view
   * @param {string} viewId - ID da view ativa
   */
  function handleViewSpecificActions(viewId) {
    switch(viewId) {
      case 'dashboard':
        // Atualizar dashboard com dados recentes
        updateDashboardStats();
        break;
        
      case 'patients':
        // Carregar lista de pacientes
        loadPatients();
        break;
        
      case 'patient-detail':
        // Carregar detalhes do paciente atual
        loadPatientDetails(state.currentPatient);
        break;
        
      case 'session-detail':
        // Carregar detalhes da sessão atual
        loadSessionDetails(state.currentSession);
        break;
        
      case 'new':
        // Reset dos estados de gravação/upload
        resetRecordingState();
        break;
    }
  }
  
  /**
   * Configuração da sidebar
   */
  function setupSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.app-sidebar');
    
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('expanded');
      });
    }
  }
  
  /**
   * Configuração de alternância entre tabs
   */
  function setupTabSwitching() {
    // Tabs de navegação (ex: sessões, pacientes, etc)
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Obter id da tab a ser mostrada
        const tabId = this.dataset.tab;
        if (!tabId) return;
        
        // Encontrar o container parente
        const parentContainer = this.closest('.patient-profile, .session-details, .session-tabs');
        if (!parentContainer) return;
        
        // Desativar todas as tabs no mesmo container
        parentContainer.querySelectorAll('.tab-button').forEach(tab => {
          tab.classList.remove('active');
        });
        
        // Ativar a tab clicada
        this.classList.add('active');
        
        // Ocultar todos os conteúdos de tab
        const contentContainer = parentContainer.nextElementSibling || parentContainer.parentElement;
        if (contentContainer) {
          contentContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
          });
          
          // Mostrar o conteúdo correspondente
          const tabContent = document.getElementById(`${tabId}-tab`);
          if (tabContent) {
            tabContent.classList.add('active');
          }
        }
      });
    });
  }
  
  /**
   * Configuração de modais
   */
  function setupModals() {
    // Modal de novo paciente
    const addPatientBtn = document.getElementById('addPatientBtn');
    const patientModal = document.getElementById('patientModal');
    const modalClose = document.querySelector('.modal-close');
    const cancelPatientBtn = document.getElementById('cancelPatientBtn');
    const savePatientBtn = document.getElementById('savePatientBtn');
    
    // Abrir modal
    if (addPatientBtn && patientModal) {
      addPatientBtn.addEventListener('click', function() {
        patientModal.classList.add('active');
      });
    }
    
    // Fechar modal
    if (modalClose) {
      modalClose.addEventListener('click', function() {
        patientModal.classList.remove('active');
      });
    }
    
    if (cancelPatientBtn) {
      cancelPatientBtn.addEventListener('click', function() {
        patientModal.classList.remove('active');
      });
    }
    
    // Backdrop para fechar modal ao clicar fora
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', function() {
        patientModal.classList.remove('active');
      });
    }
    
    // Salvar paciente
    if (savePatientBtn) {
      savePatientBtn.addEventListener('click', function() {
        // Capturar dados do formulário
        const patientName = document.getElementById('patientName').value;
        const patientBirthDate = document.getElementById('patientBirthDate').value;
        const patientGender = document.getElementById('patientGender').value;
        const patientEmail = document.getElementById('patientEmail').value;
        const patientPhone = document.getElementById('patientPhone').value;
        
        if (!patientName) {
          showToast('warning', 'Dados incompletos', 'Por favor, informe o nome do paciente.');
          return;
        }
        
        // Em um app real, chamaríamos a API aqui
        // try {
        //   const newPatient = await patientService.createPatient({
        //     nome: patientName,
        //     data_nascimento: patientBirthDate,
        //     genero: patientGender,
        //     email: patientEmail,
        //     telefone: patientPhone
        //   });
        // } catch (error) {
        //   showToast('error', 'Erro', error.message);
        //   return;
        // }
        
        // Para o MVP, vamos simular a criação
        // Criar paciente demo
        const patientId = 'p' + (state.demoData.patients.length + 1);
        const newPatient = {
          id: patientId,
          name: patientName,
          age: calculateAge(patientBirthDate),
          email: patientEmail,
          phone: patientPhone,
          sessions: []
        };
        
        // Adicionar aos dados demo
        state.demoData.patients.push(newPatient);
        
        // Atualizar lista de pacientes
        loadPatients();
        
        // Mostrar confirmação
        showToast('success', 'Paciente adicionado', `${patientName} foi adicionado com sucesso.`);
        
        // Fechar modal e resetar formulário
        patientModal.classList.remove('active');
        document.getElementById('patientForm').reset();
      });
    }
  }
  
  /**
   * Calcular idade com base na data de nascimento
   * @param {string} birthDateStr - Data de nascimento no formato YYYY-MM-DD
   * @returns {number} Idade em anos
   */
  function calculateAge(birthDateStr) {
    if (!birthDateStr) return 0;
    
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  
  /**
   * Configuração de detalhes do paciente
   */
  function setupPatientDetails() {
    // Botão de nova sessão
    const newSessionBtn = document.getElementById('newSessionBtn');
    
    if (newSessionBtn) {
      newSessionBtn.addEventListener('click', function() {
        // Armazenar o paciente atual para referência
        // Neste ponto state.currentPatient já deve estar definido
        
        // Navegar para a view de nova sessão
        switchView('new');
      });
    }
  }
  
  /**
   * Configuração de detalhes da sessão
   */
  function setupSessionDetails() {
    // Botão de exportar sessão
    const exportSessionBtn = document.getElementById('exportSessionBtn');
    
    if (exportSessionBtn) {
      exportSessionBtn.addEventListener('click', function() {
        // Em uma implementação real, chamaríamos a API para exportar
        // No MVP, mostrar toast de confirmação
        showToast('success', 'Exportação', 'Documento exportado com sucesso.');
      });
    }
  }
  
  /**
   * Configuração do gravador de áudio
   */
  function setupRecorder() {
    // Botões de controle da gravação
    const startRecordingBtn = document.getElementById('startRecordingBtn');
    const stopRecordingBtn = document.getElementById('stopRecordingBtn');
    const pauseRecordingBtn = document.getElementById('pauseRecordingBtn');
    const processRecordingBtn = document.getElementById('processRecordingBtn');
    
    // Checkbox de diarização
    const diarizationCheckbox = document.getElementById('diarizationCheckbox');
    
    // Preview da gravação
    const recordingPreview = document.getElementById('recordingPreview');
    const recordingRemoveBtn = document.getElementById('recordingRemoveBtn');
    
    // Status e tempo
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingTime = document.getElementById('recordingTime');
    
    // Iniciar gravação
    if (startRecordingBtn) {
      startRecordingBtn.addEventListener('click', async function() {
        if (state.isProcessing) return;
        
        try {
          // Solicitar permissão para acesso ao microfone
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          // Configurar MediaRecorder
          state.mediaRecorder = new MediaRecorder(stream);
          state.audioChunks = [];
          
          // Event listener para dados disponíveis
          state.mediaRecorder.addEventListener('dataavailable', e => {
            if (e.data.size > 0) {
              state.audioChunks.push(e.data);
            }
          });
          
          // Event listener para finalização da gravação
          state.mediaRecorder.addEventListener('stop', () => {
            // Liberar microfone
            stream.getTracks().forEach(track => track.stop());
            
            if (state.audioChunks.length === 0) {
              showToast('error', 'Erro', 'Nenhum áudio foi gravado.');
              if (recordingStatus) recordingStatus.textContent = "Gravação falhou";
              return;
            }
            
            // Criar blob de áudio
            state.recordedBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
            state.uploadedFile = null; // Limpar upload anterior
            
            // Exibir preview de gravação
            if (recordingPreview) recordingPreview.classList.add('visible');
            
            // Atualizar informações
            const recordingFileName = document.getElementById('recordingFileName');
            const recordingFileMeta = document.getElementById('recordingFileMeta');
            
            const now = new Date();
            const dateStr = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}`;
            const timeFormatted = formatTime(state.recordingSeconds);
            
            if (recordingFileName) {
              recordingFileName.textContent = `Gravacao_${dateStr}.webm`;
            }
            
            if (recordingFileMeta) {
              // Aproximar tamanho do arquivo
              const fileSizeMB = (state.recordedBlob.size / (1024 * 1024)).toFixed(1);
              recordingFileMeta.textContent = `${fileSizeMB} MB • ${timeFormatted}`;
            }
            
            // Atualizar estado da UI
            if (recordingStatus) recordingStatus.textContent = "Gravação concluída";
            showToast('success', 'Sucesso', 'Gravação concluída com sucesso');
          });
          
          // Iniciar gravação
          state.mediaRecorder.start();
          state.isRecording = true;
          
          // Atualizar interface
          startRecordingBtn.classList.add('hidden');
          stopRecordingBtn.classList.remove('hidden');
          pauseRecordingBtn.classList.remove('hidden');
          if (recordingStatus) recordingStatus.textContent = "Gravando...";
          
          // Criar visualizador
          createVisualizer();
          
          // Iniciar timer
          state.recordingSeconds = 0;
          updateRecordingTimer();
          state.recordingTimer = setInterval(updateRecordingTimer, 1000);
          
        } catch (err) {
          console.error("Erro ao acessar microfone:", err);
          showToast('error', 'Erro', 'Não foi possível acessar o microfone. Verifique as permissões do navegador.');
          if (recordingStatus) recordingStatus.textContent = "Erro no microfone";
        }
      });
    }
    
    // Parar gravação
    if (stopRecordingBtn) {
      stopRecordingBtn.addEventListener('click', function() {
        if (state.mediaRecorder && state.isRecording) {
          state.mediaRecorder.stop();
          clearInterval(state.recordingTimer);
          state.isRecording = false;
          
          // Reset de UI
          stopRecordingBtn.classList.add('hidden');
          pauseRecordingBtn.classList.add('hidden');
          startRecordingBtn.classList.remove('hidden');
        }
      });
    }
    
    // Pausar/retomar gravação
    if (pauseRecordingBtn) {
      pauseRecordingBtn.addEventListener('click', function() {
        if (!state.mediaRecorder || !state.isRecording) return;
        
        if (state.recordingPaused) {
          // Retomar gravação
          state.mediaRecorder.resume();
          state.recordingPaused = false;
          if (recordingStatus) recordingStatus.textContent = "Gravando...";
          state.recordingTimer = setInterval(updateRecordingTimer, 1000);
          
          // Retomar visualizador
          animateVisualizer();
        } else {
          // Pausar gravação
          state.mediaRecorder.pause();
          state.recordingPaused = true;
          if (recordingStatus) recordingStatus.textContent = "Pausado";
          clearInterval(state.recordingTimer);
          
          // Pausar visualizador
          const visualizerBars = document.querySelectorAll('.visualizer-bar');
          visualizerBars.forEach(bar => {
            bar.style.height = '5px';
          });
        }
      });
    }
    
    // Processar gravação
    if (processRecordingBtn) {
      processRecordingBtn.addEventListener('click', function() {
        if (!state.recordedBlob) {
          showToast('error', 'Erro', 'Nenhuma gravação disponível.');
          return;
        }
        
        // Atualizar estado de diarização
        if (diarizationCheckbox) {
          state.isDiarizationEnabled = diarizationCheckbox.checked;
        }
        
        // Em uma implementação real, faríamos upload e processamento via API
        // Aqui, simulamos o processo com promessas encadeadas
        simulateTranscriptionProcess();
      });
    }
    
    // Remover gravação
    if (recordingRemoveBtn) {
      recordingRemoveBtn.addEventListener('click', function() {
        resetRecordingState();
        
        if (recordingPreview) {
          recordingPreview.classList.remove('visible');
        }
        
        if (recordingStatus) {
          recordingStatus.textContent = "Pronto para gravar";
        }
      });
    }
    
    // Funções auxiliares
    function updateRecordingTimer() {
      state.recordingSeconds++;
      if (recordingTime) {
        recordingTime.textContent = formatTime(state.recordingSeconds);
      }
    }
    
    function createVisualizer() {
      const visualizerBars = document.getElementById('visualizerBars');
      if (!visualizerBars) return;
      
      // Limpar barras anteriores
      visualizerBars.innerHTML = '';
      
      // Criar barras
      for (let i = 0; i < 100; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        visualizerBars.appendChild(bar);
      }
      
      // Animar visualizador
      animateVisualizer();
    }
  }
  
  /**
   * Animar visualizador de áudio
   */
  function animateVisualizer() {
    const visualizerBars = document.querySelectorAll('.visualizer-bar');
    if (!visualizerBars.length) return;
    
    // Animação simples para demonstração
    const animate = () => {
      // Verificar se ainda há gravação ativa
      if (!state.isRecording || state.recordingPaused) {
        return;
      }
      
      visualizerBars.forEach(bar => {
        const height = Math.random() * 90 + 10;
        bar.style.height = `${height}px`;
      });
      
      // Continuar animação
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  /**
   * Formatar tempo em HH:MM:SS
   * @param {number} seconds - Tempo em segundos
   * @returns {string} Tempo formatado
   */
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  /**
   * Resetar estado de gravação
   */
  function resetRecordingState() {
    // Limpar dados de gravação
    state.recordedBlob = null;
    state.audioChunks = [];
    state.recordingSeconds = 0;
    state.isRecording = false;
    state.recordingPaused = false;
    
    // Limpar timer se existir
    if (state.recordingTimer) {
      clearInterval(state.recordingTimer);
      state.recordingTimer = null;
    }
    
    // Atualizar UI se elementos existirem
    const recordingTime = document.getElementById('recordingTime');
    if (recordingTime) recordingTime.textContent = "00:00:00";
    
    const recordingPreview = document.getElementById('recordingPreview');
    if (recordingPreview) recordingPreview.classList.remove('visible');
    
    const startRecordingBtn = document.getElementById('startRecordingBtn');
    const stopRecordingBtn = document.getElementById('stopRecordingBtn');
    const pauseRecordingBtn = document.getElementById('pauseRecordingBtn');
    
    if (startRecordingBtn) startRecordingBtn.classList.remove('hidden');
    if (stopRecordingBtn) stopRecordingBtn.classList.add('hidden');
    if (pauseRecordingBtn) pauseRecordingBtn.classList.add('hidden');
  }
  
  /**
   * Configuração de upload de arquivo
   */
  function setupUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadInput = document.getElementById('uploadInput');
    
    if (uploadArea && uploadInput) {
      // Clique para selecionar arquivo
      uploadArea.addEventListener('click', function() {
        uploadInput.click();
      });
      
      // Drag & drop
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        uploadArea.addEventListener(event, e => {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      
      ['dragenter', 'dragover'].forEach(event => {
        uploadArea.addEventListener(event, () => {
          uploadArea.classList.add('dragover');
        });
      });
      
      ['dragleave', 'drop'].forEach(event => {
        uploadArea.addEventListener(event, () => {
          uploadArea.classList.remove('dragover');
        });
      });
      
      // Processar arquivo arrastado
      uploadArea.addEventListener('drop', e => {
        if (e.dataTransfer.files.length > 0) {
          handleFileUpload(e.dataTransfer.files[0]);
        }
      });
      
      // Processar arquivo selecionado
      uploadInput.addEventListener('change', function() {
        if (this.files.length > 0) {
          handleFileUpload(this.files[0]);
        }
      });
    }
    
    // Função para processar upload de arquivo
    function handleFileUpload(file) {
      if (!file) return;
      
      // Validações
      if (file.size > 50 * 1024 * 1024) { // Limite de 50MB
        showToast('error', 'Erro', 'O arquivo excede o tamanho máximo de 50MB.');
        return;
      }
      
      // Aceitar apenas arquivos de áudio e texto
      const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/webm', 
                         'text/plain', 'text/markdown', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      const isValidType = file.type && (
        file.type.startsWith('audio/') || 
        file.type.startsWith('text/') || 
        file.name.endsWith('.doc') || 
        file.name.endsWith('.docx')
      );
      
      if (!isValidType) {
        showToast('error', 'Erro', 'Formato de arquivo não suportado.');
        return;
      }
      
      // Atualizar estado
      state.uploadedFile = file;
      state.recordedBlob = null; // Limpar gravação anterior
      
      showToast('success', 'Arquivo carregado', 'Arquivo pronto para processamento.');
      
      // Em uma app real, processamos o arquivo com base no tipo
      if (file.type.startsWith('audio/')) {
        // Processar como áudio
        simulateAudioUploadProcess();
      } else {
        // Processar como texto (transcrito)
        simulateTextUploadProcess();
      }
    }
  }
  
  /**
   * Configuração da transcrição manual
   */
  function setupTranscription() {
    const processTranscriptionBtn = document.getElementById('processTranscriptionBtn');
    
    if (processTranscriptionBtn) {
      processTranscriptionBtn.addEventListener('click', function() {
        const transcriptionText = document.getElementById('transcriptionText');
        
        if (!transcriptionText || !transcriptionText.value.trim()) {
          showToast('warning', 'Texto vazio', 'Por favor, digite ou cole um texto para processar.');
          return;
        }
        
        // Salvar texto
        state.transcriptionText = transcriptionText.value;
        
        // Simular processamento
        simulateManualTranscriptionProcess();
      });
    }
  }
  
  /**
   * Simulação do processo de transcrição de áudio
   */
  function simulateTranscriptionProcess() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    // Em uma implementação real, enviaria o arquivo para o servidor
    // e receberia a transcrição de volta
    
    showToast('info', 'Processando', 'Iniciando transcrição do áudio...');
    
    // Simular atraso de processamento
    setTimeout(() => {
      // Gerar transcrição de exemplo
      state.transcriptionText = generateSampleTranscription(state.isDiarizationEnabled);
      
      // Exibir e popular conteúdo de transcrição
      document.getElementById('transcriptionContent').textContent = state.transcriptionText;
      
      state.isProcessing = false;
      showToast('success', 'Transcrição concluída', 'O áudio foi transcrito com sucesso.');
      
      // Navegar para o resultado
      switchView('session-detail');
      
      // Selecionar a tab de transcrição
      const transcriptionTab = document.querySelector('[data-tab="transcription"]');
      if (transcriptionTab) transcriptionTab.click();
      
      // Processar para análise dimensional
      simulateDimensionalAnalysis();
    }, 3000);
  }
  
  /**
   * Simulação do processo de upload de áudio
   */
  function simulateAudioUploadProcess() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    showToast('info', 'Processando', 'Iniciando processamento do áudio...');
    
    // Simular atraso de processamento
    setTimeout(() => {
      // Gerar transcrição de exemplo
      state.transcriptionText = generateSampleTranscription(state.isDiarizationEnabled);
      
      // Exibir e popular conteúdo de transcrição
      document.getElementById('transcriptionContent').textContent = state.transcriptionText;
      
      state.isProcessing = false;
      showToast('success', 'Processamento concluído', 'O arquivo foi processado com sucesso.');
      
      // Navegar para o resultado
      switchView('session-detail');
      
      // Selecionar a tab de transcrição
      const transcriptionTab = document.querySelector('[data-tab="transcription"]');
      if (transcriptionTab) transcriptionTab.click();
      
      // Processar para análise dimensional
      simulateDimensionalAnalysis();
    }, 2000);
  }
  
  /**
   * Simulação do processo de upload de texto
   */
  function simulateTextUploadProcess() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    showToast('info', 'Processando', 'Processando documento de texto...');
    
    // Ler o conteúdo do arquivo
    const reader = new FileReader();
    reader.onload = function(e) {
      // Obter o texto do arquivo
      state.transcriptionText = e.target.result;
      
      // Exibir e popular conteúdo de transcrição
      document.getElementById('transcriptionContent').textContent = state.transcriptionText;
      
      state.isProcessing = false;
      showToast('success', 'Processamento concluído', 'O documento foi processado com sucesso.');
      
      // Navegar para o resultado
      switchView('session-detail');
      
      // Selecionar a tab de transcrição
      const transcriptionTab = document.querySelector('[data-tab="transcription"]');
      if (transcriptionTab) transcriptionTab.click();
      
      // Processar para análise dimensional
      simulateDimensionalAnalysis();
    };
    
    reader.onerror = function() {
      state.isProcessing = false;
      showToast('error', 'Erro', 'Não foi possível ler o arquivo.');
    };
    
    reader.readAsText(state.uploadedFile);
  }
  
  /**
   * Simulação do processo de transcrição manual
   */
  function simulateManualTranscriptionProcess() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    showToast('info', 'Processando', 'Processando transcrição...');
    
    // Simular atraso de processamento
    setTimeout(() => {
      // Exibir e popular conteúdo de transcrição
      document.getElementById('transcriptionContent').textContent = state.transcriptionText;
      
      state.isProcessing = false;
      showToast('success', 'Processamento concluído', 'A transcrição foi processada com sucesso.');
      
      // Navegar para o resultado
      switchView('session-detail');
      
      // Selecionar a tab de transcrição
      const transcriptionTab = document.querySelector('[data-tab="transcription"]');
      if (transcriptionTab) transcriptionTab.click();
      
      // Processar para análise dimensional
      simulateDimensionalAnalysis();
    }, 1500);
  }
  
  /**
   * Simulação da análise dimensional
   */
  function simulateDimensionalAnalysis() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    showToast('info', 'Processando', 'Realizando análise dimensional VINTRA...');
    
    // Em uma implementação real, enviaria o texto para o backend
    // e receberia a análise dimensional de volta
    
    // Simular atraso de processamento
    setTimeout(() => {
      // No MVP, usar dados de exemplo
      state.dimensionalAnalysis = {
        v1: -2.5,        // Valência Emocional (-5 a +5)
        v2: 7.0,         // Excitação Emocional (0-10)
        v3: 3.0,         // Dominância Emocional (0-10)
        v4: 8.0,         // Intensidade Afetiva (0-10)
        v5: 6.0,         // Complexidade Sintática (0-10)
        v6: 5.0,         // Coerência Narrativa (0-10)
        v7: 4.0,         // Flexibilidade Cognitiva (0-10)
        v8: 7.0,         // Dissonância Cognitiva (0-10)
        v9_past: 7.0,    // Perspectiva Temporal - Passado (0-10)
        v9_present: 3.0, // Perspectiva Temporal - Presente (0-10)
        v9_future: 2.0,  // Perspectiva Temporal - Futuro (0-10)
        v10: 4.0,        // Autocontrole (0-10)
        sintese_narrativa: "Paciente demonstra estado emocional negativo persistente, com alta excitação e intensidade afetiva, indicando reatividade emocional significativa diante de situações de estresse. Apresenta discurso com boa complexidade sintática, porém com moderada coerência narrativa. Demonstra flexibilidade cognitiva limitada e alta dissonância, sugerindo conflitos internos não resolvidos. Foco temporal predominante no passado, com baixa orientação para o presente e futuro. Autocontrole moderado, com dificuldade em regular comportamentos sob estresse.",
        formulacao_integrativa: "Quadro compatível com transtorno de ansiedade generalizada, com elementos depressivos secundários à perda recente. A configuração dimensional aponta para um padrão de ruminação ansiosa com foco no passado, dificuldade de regulação emocional e tendência à catastrofização.",
        recomendacoes: [
          "Abordagem terapêutica com foco em regulação emocional e técnicas de mindfulness",
          "Intervenções para reorientação temporal e desenvolvimento de perspectiva futura",
          "Técnicas de reestruturação cognitiva para trabalhar dissonância e flexibilidade"
        ]
      };
      
      // Atualizar visualização
      createDimensionalChart();
      updateDimensionalValues();
      
      // Popular conteúdo dos documentos
      document.getElementById('vintraContent').innerHTML = formatVintraDocument();
      document.getElementById('soapContent').innerHTML = formatSoapDocument();
      
      state.isProcessing = false;
      showToast('success', 'Análise concluída', 'Análise dimensional VINTRA concluída com sucesso.');
      
      // Navegar para a tab de análise dimensional
      const dimensionalTab = document.querySelector('[data-tab="dimensional"]');
      if (dimensionalTab) dimensionalTab.click();
    }, 2000);
  }
  
  /**
   * Criar gráfico radar dimensional
   */
  function createDimensionalChart() {
    const ctx = document.getElementById('sessionDimensionalChart').getContext('2d');
    
    // Destruir gráfico existente se houver
    if (window.dimensionalChart) {
      window.dimensionalChart.destroy();
    }
    
    // Converter dados para o formato do gráfico radar
    const dimensions = [
      state.dimensionalAnalysis.v1 + 5, // Converter de -5/+5 para 0-10 para visualização
      state.dimensionalAnalysis.v2,
      state.dimensionalAnalysis.v3,
      state.dimensionalAnalysis.v4,
      state.dimensionalAnalysis.v5,
      state.dimensionalAnalysis.v6,
      state.dimensionalAnalysis.v7,
      state.dimensionalAnalysis.v8,
      (state.dimensionalAnalysis.v9_past + state.dimensionalAnalysis.v9_present + state.dimensionalAnalysis.v9_future) / 3, // Média para simplificar visualização
      state.dimensionalAnalysis.v10
    ];
    
    // Cores por grupo dimensional
    const pointColors = [
      // Emocionais - Tom de azul
      'rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.8)', 
      'rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.8)',
      
      // Cognitivas - Tom de verde
      'rgba(6, 95, 70, 0.8)', 'rgba(6, 95, 70, 0.8)', 
      'rgba(6, 95, 70, 0.8)', 'rgba(6, 95, 70, 0.8)',
      
      // Autonomia - Tom de roxo
      'rgba(126, 29, 95, 0.8)', 'rgba(126, 29, 95, 0.8)'
    ];
    
    // Criar gráfico radar
    window.dimensionalChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Valência', 'Excitação', 'Dominância', 'Intensidade', 
          'Complexidade', 'Coerência', 'Flexibilidade', 'Dissonância',
          'Perspectiva Temporal', 'Autocontrole'
        ],
        datasets: [{
          label: 'Perfil Dimensional',
          data: dimensions,
          backgroundColor: 'rgba(64, 180, 198, 0.2)',
          borderColor: 'rgba(64, 180, 198, 0.7)',
          borderWidth: 2,
          pointBackgroundColor: pointColors,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 2,
              display: false,
              backdropColor: 'rgba(255, 255, 255, 0)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const dimensionIndex = context.dataIndex;
                let value = context.raw;
                
                // Ajustar valores na exibição
                if (dimensionIndex === 0) {
                  // Reverter valência para -5/+5 na exibição
                  value = value - 5;
                  return `Valência Emocional: ${value.toFixed(1)}`;
                }
                
                return `${context.chart.data.labels[dimensionIndex]}: ${value.toFixed(1)}`;
              }
            }
          }
        }
      }
    });
    
    // Criar gráficos menores nas cards
    createSmallDimensionalCharts();
  }
  
  /**
   * Criar gráficos dimensionais pequenos para cards de sessão
   */
  function createSmallDimensionalCharts() {
    const smallCharts = document.querySelectorAll('.dimensional-chart-small canvas');
    
    smallCharts.forEach((canvas, index) => {
      const ctx = canvas.getContext('2d');
      
      // Cada gráfico tem dados diferentes baseados na sessão
      let dimensions;
      
      // No MVP, usar os mesmos dados com pequenas variações para demonstração
      if (index === 0) { // Primeira sessão
        dimensions = [
          state.dimensionalAnalysis.v1 + 5, 
          state.dimensionalAnalysis.v2,
          state.dimensionalAnalysis.v3,
          state.dimensionalAnalysis.v4,
          state.dimensionalAnalysis.v5,
          state.dimensionalAnalysis.v6,
          state.dimensionalAnalysis.v7,
          state.dimensionalAnalysis.v8,
          (state.dimensionalAnalysis.v9_past + state.dimensionalAnalysis.v9_present + state.dimensionalAnalysis.v9_future) / 3,
          state.dimensionalAnalysis.v10
        ];
      } else { // Sessões anteriores (com variações)
        dimensions = [
          state.dimensionalAnalysis.v1 + 5 - (index * 0.5), 
          state.dimensionalAnalysis.v2 + (index * 0.3),
          state.dimensionalAnalysis.v3 - (index * 0.2),
          state.dimensionalAnalysis.v4 - (index * 0.3),
          state.dimensionalAnalysis.v5 - (index * 0.2),
          state.dimensionalAnalysis.v6 - (index * 0.3),
          state.dimensionalAnalysis.v7 - (index * 0.2),
          state.dimensionalAnalysis.v8 + (index * 0.2),
          ((state.dimensionalAnalysis.v9_past + 0.5 * index) + 
           (state.dimensionalAnalysis.v9_present - 0.2 * index) + 
           (state.dimensionalAnalysis.v9_future - 0.3 * index)) / 3,
          state.dimensionalAnalysis.v10 - (index * 0.3)
        ];
      }
      
      // Criar gráfico radar
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            'Valência', 'Excitação', 'Dominância', 'Intensidade', 
            'Complexidade', 'Coerência', 'Flexibilidade', 'Dissonância',
            'Perspectiva Temporal', 'Autocontrole'
          ],
          datasets: [{
            data: dimensions,
            backgroundColor: 'rgba(64, 180, 198, 0.3)',
            borderColor: 'rgba(64, 180, 198, 0.7)',
            borderWidth: 1,
            pointRadius: 0,
            pointHoverRadius: 0
          }]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 10,
              ticks: {
                display: false
              },
              grid: {
                display: false
              },
              angleLines: {
                display: false
              },
              pointLabels: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false
            }
          }
        }
      });
    });
  }
  
  /**
   * Atualizar valores dimensionais na interface
   */
  function updateDimensionalValues() {
    // Atualizar barras de dimensões
    // Exemplo para uma dimensão
    document.querySelectorAll('.dimension-item').forEach(item => {
      const dimensionLabel = item.querySelector('.dimension-label').textContent;
      const dimensionValue = item.querySelector('.dimension-value');
      const dimensionBar = item.querySelector('.dimension-fill');
      
      let value = 0;
      let colorClass = '';
      
      // Determinar a dimensão com base no label
      if (dimensionLabel.includes('Valência')) {
        value = state.dimensionalAnalysis.v1;
        colorClass = 'var(--emotional-color)';
        // Mostrar valor real (-5 a +5)
        dimensionValue.textContent = value.toFixed(1);
        // Mapear para largura (0-100%)
        const barWidth = ((value + 5) / 10) * 100;
        dimensionBar.style.width = `${barWidth}%`;
      }
      else if (dimensionLabel.includes('Excitação')) {
        value = state.dimensionalAnalysis.v2;
        colorClass = 'var(--emotional-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Dominância')) {
        value = state.dimensionalAnalysis.v3;
        colorClass = 'var(--emotional-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Intensidade')) {
        value = state.dimensionalAnalysis.v4;
        colorClass = 'var(--emotional-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Complexidade')) {
        value = state.dimensionalAnalysis.v5;
        colorClass = 'var(--cognitive-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Coerência')) {
        value = state.dimensionalAnalysis.v6;
        colorClass = 'var(--cognitive-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Flexibilidade')) {
        value = state.dimensionalAnalysis.v7;
        colorClass = 'var(--cognitive-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Dissonância')) {
        value = state.dimensionalAnalysis.v8;
        colorClass = 'var(--cognitive-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Passado')) {
        value = state.dimensionalAnalysis.v9_past;
        colorClass = 'var(--autonomy-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Presente')) {
        value = state.dimensionalAnalysis.v9_present;
        colorClass = 'var(--autonomy-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Futuro')) {
        value = state.dimensionalAnalysis.v9_future;
        colorClass = 'var(--autonomy-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      else if (dimensionLabel.includes('Autocontrole')) {
        value = state.dimensionalAnalysis.v10;
        colorClass = 'var(--autonomy-color)';
        dimensionValue.textContent = value.toFixed(1);
        dimensionBar.style.width = `${value * 10}%`;
      }
      
      dimensionBar.style.backgroundColor = colorClass;
    });
  }
  
  /**
   * Gerar uma transcrição de exemplo
   * @param {boolean} includeDiarization - Se deve incluir marcações de falante
   * @returns {string} Texto de transcrição
   */
  function generateSampleTranscription(includeDiarization = true) {
    if (includeDiarization) {
      return `Entrevista Clínica - ${new Date().toLocaleDateString()}
  
  Médico: Bom dia. Como você está se sentindo hoje?
  
  Paciente: Não muito bem, doutor. Tenho estado muito ansioso nos últimos dias. Não consigo dormir direito, fico preocupado com tudo.
  
  Médico: Entendo. Pode me falar mais sobre essa ansiedade? Quando ela começou?
  
  Paciente: Acho que começou há umas duas semanas, depois daquela reunião no trabalho. Meu chefe disse que a empresa vai passar por uma reestruturação e que alguns cargos serão eliminados. Desde então, não consigo parar de pensar nisso.
  
  Médico: E como isso tem afetado seu dia a dia?
  
  Paciente: De várias formas. Durmo mal, acordo no meio da noite pensando no assunto. No trabalho, não consigo me concentrar direito. Em casa, fico irritado por qualquer coisa, já tive algumas discussões com minha esposa. E tenho tido dores de cabeça quase todos os dias.
  
  Médico: E você já passou por situações semelhantes antes?
  
  Paciente: Já tive períodos de preocupação, mas nunca assim tão intenso, que afetasse tanto minha vida. Estou com medo de perder meu emprego, de não conseguir pagar as contas, de decepcionar minha família. [voz embargada] É como se eu não conseguisse ver uma saída.
  
  Médico: Estou vendo que isso está sendo muito difícil para você. Está tomando alguma medicação atualmente?
  
  Paciente: Só o anti-hipertensivo que o senhor receitou no ano passado. E algumas vezes tomei um relaxante muscular que tinha em casa, para ver se conseguia dormir melhor, mas não ajudou muito.
  
  Médico: Entendo. Vamos conversar sobre algumas estratégias que podem ajudar a lidar com essa ansiedade...`;
    } else {
      return `Entrevista Clínica - ${new Date().toLocaleDateString()}
  
  Bom dia. Como você está se sentindo hoje?
  
  Não muito bem, doutor. Tenho estado muito ansioso nos últimos dias. Não consigo dormir direito, fico preocupado com tudo.
  
  Entendo. Pode me falar mais sobre essa ansiedade? Quando ela começou?
  
  Acho que começou há umas duas semanas, depois daquela reunião no trabalho. Meu chefe disse que a empresa vai passar por uma reestruturação e que alguns cargos serão eliminados. Desde então, não consigo parar de pensar nisso.
  
  E como isso tem afetado seu dia a dia?
  
  De várias formas. Durmo mal, acordo no meio da noite pensando no assunto. No trabalho, não consigo me concentrar direito. Em casa, fico irritado por qualquer coisa, já tive algumas discussões com minha esposa. E tenho tido dores de cabeça quase todos os dias.
  
  E você já passou por situações semelhantes antes?
  
  Já tive períodos de preocupação, mas nunca assim tão intenso, que afetasse tanto minha vida. Estou com medo de perder meu emprego, de não conseguir pagar as contas, de decepcionar minha família. É como se eu não conseguisse ver uma saída.
  
  Estou vendo que isso está sendo muito difícil para você. Está tomando alguma medicação atualmente?
  
  Só o anti-hipertensivo que o senhor receitou no ano passado. E algumas vezes tomei um relaxante muscular que tinha em casa, para ver se conseguia dormir melhor, mas não ajudou muito.
  
  Entendo. Vamos conversar sobre algumas estratégias que podem ajudar a lidar com essa ansiedade...`;
    }
  }
  
  /**
   * Formatar documento no formato VINTRA
   * @returns {string} HTML formatado
   */
  function formatVintraDocument() {
    return `<h1>VINTRA - ANÁLISE DIMENSIONAL</h1>
  <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
  <p><strong>Clínico:</strong> Dr. Santos</p>
  
  <h2>COORDENADAS DIMENSIONAIS</h2>
  
  <h3>Dimensões Emocionais</h3>
  <ul>
    <li><strong>Valência Emocional (v₁):</strong> ${state.dimensionalAnalysis.v1.toFixed(1)} - Polaridade hedônica negativa, com predominância de emoções como preocupação, tristeza e medo.</li>
    <li><strong>Excitação Emocional (v₂):</strong> ${state.dimensionalAnalysis.v2.toFixed(1)} - Elevado nível de ativação neurofisiológica, manifestando-se através de tensão, agitação psicomotora e dificuldade de relaxamento.</li>
    <li><strong>Dominância Emocional (v₃):</strong> ${state.dimensionalAnalysis.v3.toFixed(1)} - Baixo controle percebido sobre as emoções, com dificuldade de regular estados afetivos negativos.</li>
    <li><strong>Intensidade Afetiva (v₄):</strong> ${state.dimensionalAnalysis.v4.toFixed(1)} - Alta magnitude experiencial, com vivência intensa das emoções negativas e reatividade aumentada a estímulos cotidianos.</li>
  </ul>
  
  <h3>Dimensões Cognitivas</h3>
  <ul>
    <li><strong>Complexidade Sintática (v₅):</strong> ${state.dimensionalAnalysis.v5.toFixed(1)} - Elaboração preservada do pensamento, com boa articulação lógica e estrutural do discurso.</li>
    <li><strong>Coerência Narrativa (v₆):</strong> ${state.dimensionalAnalysis.v6.toFixed(1)} - Integração lógico-temporal parcial, com algumas descontinuidades na estruturação da história pessoal.</li>
    <li><strong>Flexibilidade Cognitiva (v₇):</strong> ${state.dimensionalAnalysis.v7.toFixed(1)} - Capacidade limitada de alterar esquemas mentais, com tendência à perseveração em pensamentos negativos.</li>
    <li><strong>Dissonância Cognitiva (v₈):</strong> ${state.dimensionalAnalysis.v8.toFixed(1)} - Elevada tensão entre elementos incompatíveis, particularmente entre autoexpectativas e percepção da realidade atual.</li>
  </ul>
  
  <h3>Dimensões de Autonomia</h3>
  <ul>
    <li><strong>Perspectiva Temporal:</strong>
      <ul>
        <li><strong>Passado (v₉ₚ):</strong> ${state.dimensionalAnalysis.v9_past.toFixed(1)} - Forte orientação para experiências passadas, com ênfase em conquistas anteriores.</li>
        <li><strong>Presente (v₉ₚᵣ):</strong> ${state.dimensionalAnalysis.v9_present.toFixed(1)} - Conexão parcial com a experiência presente, frequentemente interrompida por preocupações futuras.</li>
        <li><strong>Futuro (v₉f):</strong> ${state.dimensionalAnalysis.v9_future.toFixed(1)} - Orientação futura restrita, predominantemente focada em cenários negativos.</li>
      </ul>
    </li>
    <li><strong>Autocontrole (v₁₀):</strong> ${state.dimensionalAnalysis.v10.toFixed(1)} - Capacidade moderada de autorregulação, com dificuldades em situações de maior pressão ou estresse.</li>
  </ul>
  
  <h2>SÍNTESE NARRATIVA (IPSISSIMA)</h2>
  <p>${state.dimensionalAnalysis.sintese_narrativa}</p>
  
  <h2>FORMULAÇÃO INTEGRATIVA</h2>
  <p>${state.dimensionalAnalysis.formulacao_integrativa}</p>
  
  <h2>RECOMENDAÇÕES TERAPÊUTICAS</h2>
  <ul>
    ${state.dimensionalAnalysis.recomendacoes.map(rec => `<li>${rec}</li>`).join('')}
  </ul>`;
  }
  
  /**
   * Formatar documento no formato SOAP
   * @returns {string} HTML formatado
   */
  function formatSoapDocument() {
    return `<h1>NOTA SOAP</h1>
  <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
  <p><strong>Clínico:</strong> Dr. Santos</p>
  
  <h2>S (SUBJETIVO)</h2>
  <p>Paciente relata intenso estado de ansiedade nas últimas duas semanas, desencadeado por anúncio de reestruturação em seu trabalho e possibilidade de demissão. Queixa-se de insônia (dificuldade para iniciar e manter o sono), irritabilidade, dificuldade de concentração, cefaleia frequente e preocupação constante. Refere medo intenso de "perder o emprego, não conseguir pagar as contas e decepcionar a família". Menciona uso ocasional de relaxante muscular sem prescrição, sem melhora significativa.</p>
  
  <h2>O (OBJETIVO)</h2>
  <p>Paciente apresenta-se orientado, comunicativo, com aparência tensa e inquietação psicomotora discreta. Discurso fluente e coerente, com foco predominante em preocupações laborais e financeiras. Humor deprimido e afeto ansioso. Sem sinais de alterações de pensamento formal, ideação suicida ou elementos psicóticos. Cognição preservada.</p>
  
  <h2>A (AVALIAÇÃO)</h2>
  <p>Quadro compatível com Transtorno de Ansiedade Generalizada (F41.1), com elementos depressivos reativos. Estado dimensional caracterizado por valência emocional negativa (${state.dimensionalAnalysis.v1.toFixed(1)}), alta excitação (${state.dimensionalAnalysis.v2.toFixed(1)}) e intensa afetividade (${state.dimensionalAnalysis.v4.toFixed(1)}), combinados com dissonância cognitiva elevada (${state.dimensionalAnalysis.v8.toFixed(1)}) e predominância de perspectiva temporal voltada ao passado. Evidencia-se padrão de ruminação ansiosa e catastrofização.</p>
  
  <h2>P (PLANO)</h2>
  <ol>
    <li>Iniciar paroxetina 20mg, 1 comprimido pela manhã, após o café.</li>
    <li>Clonazepam 0,5mg, 1 comprimido à noite, por 3 semanas.</li>
    <li>Orientação sobre técnicas de controle respiratório e mindfulness.</li>
    <li>Encaminhamento para psicoterapia com abordagem cognitivo-comportamental.</li>
    <li>Afastamento laboral por 15 dias.</li>
    <li>Retorno em 3 semanas para reavaliação.</li>
  </ol>`;
  }
  
  /**
   * Atualizar estatísticas do dashboard
   */
  function updateDashboardStats() {
    // Em uma implementação real, buscariamos esses dados da API
    
    // No MVP, usando dados de exemplo
    // Pacientes recentes
    const recentPatientsEl = document.querySelector('.recent-patients');
    if (!recentPatientsEl) return;
    
    recentPatientsEl.innerHTML = '';
    
    // Pegar até 6 pacientes mais recentes
    const recentPatients = state.demoData.patients.slice(0, 6);
    
    recentPatients.forEach(patient => {
      const patientCard = document.createElement('div');
      patientCard.className = 'patient-card';
      patientCard.dataset.id = patient.id;
      
      patientCard.innerHTML = `
        <div class="patient-card-avatar">
          <img src="https://via.placeholder.com/100" alt="${patient.name}">
        </div>
        <div class="patient-card-info">
          <h3 class="patient-card-name">${patient.name}</h3>
          <p class="patient-card-meta">${patient.age} anos • ${patient.sessions.length} sessões</p>
        </div>
        <div class="patient-card-actions">
          <button class="btn btn-link view-patient-btn">Ver</button>
        </div>
      `;
      
      recentPatientsEl.appendChild(patientCard);
      
      // Adicionar evento para visualizar paciente
      const viewBtn = patientCard.querySelector('.view-patient-btn');
      if (viewBtn) {
        viewBtn.addEventListener('click', function() {
          state.currentPatient = patient;
          switchView('patient-detail');
        });
      }
    });
    
    // Próximas sessões
    const upcomingSessionsEl = document.querySelector('.upcoming-sessions');
    if (!upcomingSessionsEl) return;
    
    upcomingSessionsEl.innerHTML = '';
    
    // Em uma implementação real, teríamos dados de agendamento
    // No MVP, criar algumas sessões futuras de exemplo
    const futureDates = [
      { date: '2024-05-10', time: '09:30', patient: state.demoData.patients[0], type: 'Retorno' },
      { date: '2024-05-12', time: '14:00', patient: state.demoData.patients[1], type: 'Primeira Consulta' },
      { date: '2024-05-15', time: '10:00', patient: state.demoData.patients[2], type: 'Avaliação' }
    ];
    
    futureDates.forEach(session => {
      const sessionCard = document.createElement('div');
      sessionCard.className = 'session-card-mini';
      
      const date = new Date(session.date);
      const formattedDate = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
      
      sessionCard.innerHTML = `
        <div class="session-card-date">${formattedDate} • ${session.time}</div>
        <div class="session-card-patient">${session.patient.name}</div>
        <div class="session-card-tag">${session.type}</div>
      `;
      
      upcomingSessionsEl.appendChild(sessionCard);
    });
  }
  
  /**
   * Carregar lista de pacientes
   */
  function loadPatients() {
    const patientsListEl = document.querySelector('.patients-list');
    if (!patientsListEl) return;
    
    patientsListEl.innerHTML = '';
    
    state.demoData.patients.forEach(patient => {
      const patientCard = document.createElement('div');
      patientCard.className = 'patient-card';
      patientCard.dataset.id = patient.id;
      
      patientCard.innerHTML = `
        <div class="patient-card-avatar">
          <img src="https://via.placeholder.com/100" alt="${patient.name}">
        </div>
        <div class="patient-card-info">
          <h3 class="patient-card-name">${patient.name}</h3>
          <p class="patient-card-meta">${patient.age} anos • ${patient.email}</p>
          <p class="patient-card-meta">${patient.sessions.length} sessões</p>
     </div>
      <div class="patient-card-actions">
        <button class="btn btn-link view-patient-btn">Ver</button>
      </div>
    `;
    
    patientsListEl.appendChild(patientCard);
    
    // Adicionar evento para visualizar paciente
    const viewBtn = patientCard.querySelector('.view-patient-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', function() {
        state.currentPatient = patient;
        switchView('patient-detail');
      });
    }
  });
}

/**
 * Carregar detalhes do paciente
 * @param {Object} patient - Dados do paciente
 */
function loadPatientDetails(patient) {
  if (!patient) return;
  
  // Atualizar informações do cabeçalho
  const patientName = document.querySelector('.patient-name');
  const patientMeta = document.querySelectorAll('.patient-meta');
  
  if (patientName) patientName.textContent = patient.name;
  if (patientMeta.length >= 2) {
    patientMeta[0].textContent = `${patient.age} anos • ${patient.email}`;
    patientMeta[1].textContent = `Tel: ${patient.phone}`;
  }
  
  // Carregar sessões
  const sessionCards = document.querySelector('.session-cards');
  if (!sessionCards) return;
  
  sessionCards.innerHTML = '';
  
  if (patient.sessions.length === 0) {
    sessionCards.innerHTML = '<p class="empty-message">Nenhuma sessão registrada para este paciente.</p>';
    return;
  }
  
  patient.sessions.forEach(session => {
    const sessionCard = document.createElement('div');
    sessionCard.className = 'session-card';
    sessionCard.dataset.id = session.id;
    
    // Formatar data
    const date = new Date(session.date);
    const formattedDate = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    sessionCard.innerHTML = `
      <div class="session-date">
        <h3>${formattedDate}</h3>
        <p>${session.time}</p>
      </div>
      <div class="session-content">
        <div class="session-tag">${session.tag}</div>
        <div class="dimensional-chart-small">
          <canvas></canvas>
        </div>
      </div>
      <div class="session-actions">
        <button class="btn btn-link view-session-btn">Ver Sessão</button>
      </div>
    `;
    
    sessionCards.appendChild(sessionCard);
    
    // Adicionar evento para visualizar sessão
    const viewBtn = sessionCard.querySelector('.view-session-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', function() {
        state.currentSession = session;
        switchView('session-detail');
      });
    }
  });
  
  // Em uma implementação real, carregaríamos também gráficos de evolução
  // No MVP, vamos deixar isso para uma próxima versão
}

/**
 * Carregar detalhes da sessão
 * @param {Object} session - Dados da sessão
 */
function loadSessionDetails(session) {
  if (!session) return;
  
  // Atualizar informações do cabeçalho
  const sessionDateElement = document.querySelector('.session-date-large h2');
  const sessionTimeElement = document.querySelector('.session-date-large p');
  const sessionTagElement = document.querySelector('.session-tag-large');
  
  if (sessionDateElement) {
    const date = new Date(session.date);
    const formattedDate = date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    sessionDateElement.textContent = formattedDate;
  }
  
  if (sessionTimeElement) {
    sessionTimeElement.textContent = session.time;
  }
  
  if (sessionTagElement) {
    sessionTagElement.textContent = session.tag;
  }
  
  // Usar os dados dimensionais da sessão para atualizar o estado
  if (session.dimensional) {
    // Copiar dados dimensionais para o estado
    state.dimensionalAnalysis = {
      ...state.dimensionalAnalysis, // manter propriedades existentes
      ...session.dimensional // atualizar com dados da sessão
    };
    
    // Atualizar visualização
    setTimeout(() => {
      createDimensionalChart();
      updateDimensionalValues();
      
      // Gerar conteúdo dos documentos
      document.getElementById('vintraContent').innerHTML = formatVintraDocument();
      document.getElementById('soapContent').innerHTML = formatSoapDocument();
    }, 100);
  }
  
  // Atualizar transcrição (no MVP, usar uma transcrição genérica)
  const transcriptionContent = document.getElementById('transcriptionContent');
  if (transcriptionContent) {
    // Em uma app real, obteríamos a transcrição específica desta sessão
    transcriptionContent.textContent = generateSampleTranscription(true);
  }
}

/**
 * Exibir mensagem toast (notificação)
 * @param {string} type - Tipo da mensagem (success, error, warning, info)
 * @param {string} title - Título da mensagem
 * @param {string} message - Conteúdo da mensagem
 */
function showToast(type, title, message) {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  // Definir ícone baseado no tipo
  let iconClass = 'fas fa-info-circle';
  if (type === 'success') iconClass = 'fas fa-check-circle';
  else if (type === 'error') iconClass = 'fas fa-exclamation-triangle';
  else if (type === 'warning') iconClass = 'fas fa-exclamation-circle';
  
  toast.innerHTML = `
    <div class="toast-icon ${type}">
      <i class="${iconClass}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" title="Fechar">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Adicionar ao container
  toastContainer.appendChild(toast);
  
  // Adicionar evento para fechar
  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      toast.classList.add('exit');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    });
  }
  
  // Auto-remover após alguns segundos
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('exit');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, 5000);
}

/**
 * Carregar dados de demonstração
 */
function loadDemoData() {
  // Qualquer inicialização adicional que precise ser feita
  // No MVP, os dados já estão definidos no objeto state.demoData
  
  // Carregar dados do dashboard
  updateDashboardStats();
  
  // Pré-carregar alguns dados dimensionais para as visualizações de sessões
  setTimeout(() => {
    // Inicializar gráficos pequenos nas sessões
    createSmallDimensionalCharts();
    
    // Em uma implementação real, esses gráficos seriam atualizados
    // com dados reais de cada sessão
  }, 1000);
}

// Inicialização imediata
// Se o documento já foi carregado, execute as funções de inicialização
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    animateLogo();
  }, 500);
} 
// Caso contrário, aguarde o carregamento do DOM
// Este é redundante com o addEventListener no início do arquivo, 
// mas garante que a inicialização ocorra mesmo se este script for carregado depois
else {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      animateLogo();
    }, 500);
  });
}