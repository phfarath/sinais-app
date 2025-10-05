# Relatório de Funcionalidades Principais do Aplicativo SINAIS

## 1. Estrutura de navegação e fluxo inicial
- O aplicativo organiza a experiência em uma pilha principal com splash, onboarding, login, quiz e a suíte de abas (Início, Monitoramento, Aprender, Metas e Perfil), além de rotas para comunidade, demos de segurança e fluxos faciais.【F:App.tsx†L49-L258】
- A jornada começa com uma splash animada que transita automaticamente para o onboarding, seguido por um carrossel de três mensagens-chave e ações de pular ou avançar para o login.【F:screens/SplashScreen.tsx†L24-L55】【F:screens/OnboardingScreen.tsx†L69-L200】
- O questionário de perfil aplica cinco perguntas com cálculo de score para definir o risco e encaminha o usuário ao registro facial com os resultados armazenados no estado de navegação.【F:screens/QuizScreen.tsx†L49-L159】

## 2. Autenticação e proteção de acesso
- A tela de login centraliza opções por e-mail, provedores externos, conta convidada e reconhecimento facial, validando dados com sanitização e exibindo fluxos de consentimento LGPD antes de prosseguir.【F:screens/LoginScreen.tsx†L77-L243】
- O fluxo MFA aceita métodos SMS, e-mail ou app autenticador, controla tentativas, registra eventos de auditoria e inclui opções de reenvio e código de backup antes de liberar o acesso.【F:screens/MFAScreen.tsx†L25-L199】
- O registro facial verifica a saúde do backend, captura a imagem, envia dados de risco como metadados e audita sucessos ou falhas, enquanto a autenticação facial reaproveita a câmera, limita tentativas e oferece fallback para senha.【F:screens/FaceRegistrationScreen.tsx†L24-L150】【F:screens/FaceAuthenticationScreen.tsx†L24-L184】
- No backend compartilhado, o `AuthenticationService` gerencia tokens, bloqueios por tentativa, MFA e biometria, apoiado pelo `AuditService` para rastreabilidade das ações sensíveis.【F:services/AuthenticationService.ts†L15-L120】【F:services/AuditService.ts†L1-L120】

## 3. Início e resumo diário
- A Home reúne saudação contextual, card de perfil de risco, previsão semanal e um destaque "Cybersecurity Ativo" que reforça controles como criptografia, auditoria, IA explicável, análise de viés e MFA.【F:screens/HomeScreen.tsx†L37-L122】
- Um grid de atalhos oferece acesso rápido a bloqueio de apps, analytics de uso, modo foco, SOS emergência e conquistas, incentivando o uso dos diferenciais preventivos.【F:screens/HomeScreen.tsx†L140-L223】
- O botão flutuante ativa o chat de IA com histórico, sugestões rápidas e integração com `AIService`, que monta prompts com contexto comportamental, metas e histórico armazenado.【F:App.tsx†L231-L258】【F:screens/AIChatScreen.tsx†L32-L165】【F:services/AIService.ts†L24-L116】

## 4. Monitoramento e intervenções de risco
- A tela de Monitoramento consome dados do `BettingMonitor`, exibe estatísticas semanais, timeline de eventos e feed categorizado por nível de risco com ícones, valores e cores orientadas pela gravidade.【F:screens/MonitoringScreen.tsx†L18-L217】
- O serviço de monitoramento aplica sanitização, criptografia opcional, análise de padrões (perdas seguidas, atividade noturna, frequência elevada) e integra Explainable AI, decisões éticas e auditoria para cada evento registrado.【F:services/BettingMonitorService.ts†L1-L210】
- Recursos de resposta rápida incluem exercícios de respiração, modo controle com contagem regressiva, alertas de comportamento, modo emergência com contatos acionáveis e atalhos para ajuda.【F:screens/BreathingScreen.tsx†L11-L82】【F:screens/CrisisModeScreen.tsx†L17-L102】【F:screens/AlertScreen.tsx†L10-L44】【F:screens/EmergencyModeScreen.tsx†L12-L138】
- Funcionalidades avançadas demonstráveis fornecem bloqueio de apps com conquistas, analytics com gráficos, modo foco gamificado e fluxo SOS, todos persistidos via serviços próprios.【F:screens/AppBlockerScreen.tsx†L9-L170】【F:services/BlockedAppsService.ts†L1-L80】【F:screens/UsageAnalyticsScreen.tsx†L9-L132】【F:screens/FocusModeScreen.tsx†L9-L132】【F:screens/EmergencyModeScreen.tsx†L139-L214】

## 5. Educação, insights e comunidade
- A aba Aprender combina biblioteca de recursos, links de apoio humano e botões para insights guiados por IA, com conteúdos categorizados por tipo e duração.【F:screens/EducationalScreen.tsx†L13-L118】
- A tela de Insights lista explicações, alertas e recomendações personalizadas com ícones, chamadas para ação e texto sobre transparência da IA.【F:screens/InsightsScreen.tsx†L17-L111】
- A área de comunidade promove grupos de apoio, histórias e interação social gamificada (curtidas/comentários), reforçando a rede de suporte.【F:screens/CommunityScreen.tsx†L18-L87】
- O módulo "Por que isso importa?" contextualiza estatísticas e missão, conectando o usuário à importância da conscientização.【F:screens/WhyItMattersScreen.tsx†L24-L86】

## 6. Metas, gamificação e motivação
- Metas pessoais rastreiam progresso porcentual e oferecem criação de novas metas com destaque para próximas conquistas.【F:screens/GoalsScreen.tsx†L19-L87】
- O hub de gamificação apresenta nível, pontos, streaks, minutos de foco, badges desbloqueadas/bloqueadas e desafios em abas alternáveis, alimentado por `GamificationService` com armazenamento local, pontos e desbloqueio de badges.【F:screens/GamificationScreen.tsx†L9-L146】【F:services/GamificationService.ts†L1-L120】
- Notificações e celebrações utilizam o `NotificationService` para canais específicos, agendamento de lembretes diários, alertas de risco e mensagens de conquista respeitando preferências e quiet hours.【F:services/NotificationService.ts†L1-L120】

## 7. Privacidade, dados e compliance
- O perfil centraliza score, histórico de alertas, controles de reconhecimento facial e links para configurações, LGPD, auditoria e análise de viés, com opções de exclusão de dados.【F:screens/ProfileScreen.tsx†L1-L212】
- Configurações permitem definir limites de tempo e valor, ações ao atingir limite, canais e horários de notificação, além de atalhos para LGPD, MFA, auditoria, viés e demos de segurança.【F:screens/SettingsScreen.tsx†L81-L230】
- O painel de Controle de Dados salva preferências via criptografia, registra auditoria para exportação, correção e exclusão, e diferencia permissões essenciais e opcionais.【F:screens/DataControlScreen.tsx†L14-L176】
- O `EthicalDecisionEngine` balanceia consentimentos, quiet hours, limites diários e contexto do usuário para decidir coleta, alertas ou intervenções de forma ética.【F:services/EthicalDecisionEngine.ts†L1-L160】
- O `EncryptionService` provê criptografia AES, hash de senhas, tokens seguros e armazenamento protegido em memória para a demo.【F:services/EncryptionService.ts†L1-L120】

## 8. IA explicável, auditoria e mitigação de viés
- O `ExplainableAI` gera score de risco com fatores, recomendações e justificativas registradas em auditoria, além de explicações específicas para alertas.【F:services/ExplainableAI.ts†L1-L120】
- A tela de Auditoria de IA lista explicações registradas, filtros por risco, medidores de confiança, fatores considerados e botões para solicitar detalhes ou reportar viés.【F:screens/ExplanationAuditScreen.tsx†L1-L210】
- A análise de viés executa simulações, mostra gráficos demográficos, métricas de equidade e recomendações, permitindo nova análise ou navegação para auditoria.【F:screens/BiasAnalysisScreen.tsx†L1-L160】【F:screens/BiasAnalysisScreen.tsx†L200-L268】
- O `BiasAnalyzer` calcula indicadores demográficos, padrões comportamentais e métricas de fairness, registrando auditoria e recomendações estruturadas.【F:services/BiasAnalyzer.ts†L1-L170】
- O `AuditService` registra todas as ações críticas, criptografa metadados, aplica limites de retenção e suporta geração de relatórios.【F:services/AuditService.ts†L1-L180】

## 9. Serviços auxiliares e integrações
- O `AIService` constrói prompts com perfil, atividades e metas armazenadas, mantendo histórico limitado e fallback para modo demo sem API key.【F:services/AIService.ts†L24-L116】
- O `UsageDataService` gera dados de tela simulados, estatísticas agregadas e atualização incremental para alimentar a análise de uso.【F:services/UsageDataService.ts†L1-L100】
- O `NotificationService` configura canais, listeners e rotinas para alertas imediatos ou agendados, respeitando preferências salvas no armazenamento seguro.【F:services/NotificationService.ts†L1-L120】
