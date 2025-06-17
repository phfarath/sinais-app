# Projeto Sinais App: Apresentação Detalhada para Banca XP Inc X FIAP

**Data:** 16 de junho de 2025
**Autores/Equipe:** [Inserir Nomes]
**Iniciativa:** Parceria XP Inc X FIAP

## 1. Introdução e Visão Geral

O **Sinais App** é uma aplicação móvel inovadora desenvolvida no âmbito da parceria XP Inc X FIAP, com o objetivo de explorar e demonstrar a aplicação prática de conceitos avançados de Inteligência Artificial, Cibersegurança, Design Ético e Conformidade Regulatória (LGPD) em um contexto de interação com o usuário e monitoramento de atividades.

Este projeto não se limita a ser uma aplicação funcional, mas também uma plataforma de aprendizado e demonstração, evidenciando como tecnologias emergentes podem ser implementadas de forma responsável e segura. O Sinais App visa oferecer uma experiência de usuário transparente, onde a IA atua como uma assistente e ferramenta de conscientização, especialmente em cenários que podem envolver riscos comportamentais, como o monitoramento de atividades de apostas.

## 2. Objetivos do Projeto

*   **Demonstrar Excelência Técnica:** Apresentar uma solução robusta que integre IA, cibersegurança e usabilidade.
*   **Inovação em Interação:** Explorar novas formas de interação usuário-IA, incluindo comandos de voz e feedback explicável.
*   **Conscientização e Ética:** Promover o uso ético da IA, com foco na transparência (XAI), mitigação de vieses e conformidade com a LGPD.
*   **Segurança by Design:** Implementar um ciclo de vida de desenvolvimento seguro, com múltiplas camadas de proteção de dados e prevenção de ameaças.
*   **Educação e Transparência:** Fornecer aos usuários e à banca uma visão clara de como os mecanismos de IA e segurança funcionam internamente.

## 3. Público-Alvo

*   **Usuários Finais:** Indivíduos que buscam uma ferramenta interativa para obter informações, assistência ou monitorar determinados comportamentos de forma consciente e segura.
*   **Comunidade Acadêmica e Profissional:** Estudantes, pesquisadores e profissionais interessados em exemplos práticos de implementação de IA ética e cibersegurança.
*   **Empresas e Desenvolvedores:** Como um case de estudo sobre a aplicação de tecnologias avançadas e boas práticas de desenvolvimento.

## 4. Arquitetura da Aplicação

O Sinais App é construído sobre uma arquitetura moderna e modular, utilizando:

*   **Frontend:**
    *   **Framework:** React Native com Expo, permitindo desenvolvimento multiplataforma (iOS e Android).
    *   **Linguagem:** TypeScript, para tipagem estática e maior robustez do código.
    *   **Interface:** Componentes nativos e bibliotecas como `react-navigation` para uma experiência de usuário fluida.
*   **Serviços (Lógica de Negócio e Segurança):**
    *   Implementados em TypeScript, estes módulos encapsulam a lógica central da aplicação. Eles operam localmente no dispositivo ou simulam interações com um backend.
    *   **Principais Módulos:** Chat com IA, Monitoramento de Atividades, Criptografia, Sanitização de Dados, Auditoria, IA Explicável, Análise de Vieses, Motor de Decisão Ética.

## 5. Funcionalidades Detalhadas e Componentes Chave

### 5.1. Interação Inteligente: AIChatScreen

*   **Referência:** [`screens/AIChatScreen.tsx`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\screens\AIChatScreen.tsx)
*   **Descrição:** O coração da interação do usuário com a IA. Permite conversas fluidas através de entrada de texto.
*   **Entrada por Voz:**
    *   Utiliza a biblioteca `expo-av` para gravação de áudio diretamente do microfone do dispositivo.
    *   A função `handleVoiceInput` gerencia o início (`startRecording`) e o fim (`stopRecording`) da gravação, incluindo a solicitação de permissões de microfone.
    *   **Ponto de Atenção (Próximos Passos):** Atualmente, o áudio gravado (URI do arquivo) é disponibilizado. A integração com um serviço de Speech-to-Text (STT) é necessária para converter a fala em texto e alimentar o chatbot.
*   **Comunicação com IA:** Interage com o [`ChatService.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\ChatService.ts) para enviar mensagens do usuário e receber respostas da IA (simulada ou conectada a um modelo externo como GPT).

### 5.2. Monitoramento de Atividades e Análise de Risco

*   **Serviço Central:** [`services/BettingMonitorService.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\BettingMonitorService.ts)
*   **Descrição:** Este serviço é um exemplo robusto de como monitorar atividades do usuário (foco em apostas) para identificar padrões de risco.
*   **Funcionalidades:**
    *   **Registro Seguro de Eventos:** A função `recordBettingEvent` sanitiza (usando [`DataSanitizer.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\DataSanitizer.ts)) e valida os eventos antes de registrá-los. Dados sensíveis como `amount` podem ser criptografados em produção usando [`EncryptionService.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\EncryptionService.ts) (ver #attachment `BettingMonitorService.ts` line 127).
    *   **Análise Comportamental:** Calcula métricas como frequência de apostas, valores médios, atividade noturna, dias consecutivos, tentativas de recuperação de perdas e tempo gasto (ver `analyzeNewEventSecurely` e a preparação de `UserBehaviorData` em #attachment `BettingMonitorService.ts` line 181).
    *   **IA Explicável (XAI) em Ação:** Utiliza [`ExplainableAI.explainRiskAssessment`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\ExplainableAI.ts#L80) para obter uma análise de risco detalhada e compreensível, incluindo fatores de risco, impacto e recomendações.
    *   **Tomada de Decisão Ética:** Integra-se com [`EthicalDecisionEngine.shouldSendAlert`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\EthicalDecisionEngine.ts) para decidir eticamente se um alerta deve ser enviado, considerando preferências do usuário e contexto (ver #attachment `BettingMonitorService.ts` line 197).
    *   **Auditoria Completa:** Todas as ações significativas, análises de risco e alertas gerados são registrados pelo [`AuditService.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\AuditService.ts).
    *   **Monitoramento de Vieses em Tempo Real:** A função `monitorBiasInDecision` (#attachment `BettingMonitorService.ts` line 260) demonstra como o [`BiasAnalyzer.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\BiasAnalyzer.ts) pode ser invocado para verificar vieses nas avaliações de risco.
    *   **Detecção de Padrões Específicos:** Funções como `detectChasingLosses`, `detectLateNightActivity`, `detectHighFrequency` (referenciadas em `checkSpecificRiskPatterns`, #attachment `BettingMonitorService.ts` line 274, line 293, line 315) identificam comportamentos de risco conhecidos.
    *   **Feed de Atividades:** Mantém um feed de atividades (`activityEvents`) que pode ser exibido ao usuário (ver `createActivityEvent` e `getActivityEvents`, #attachment `BettingMonitorService.ts` line 323).
    *   **Integração Open Finance (Conceitual):** A função `importBankingData` (#attachment `BettingMonitorService.ts` line 346, line 367) simula como transações bancárias poderiam ser importadas e analisadas, demonstrando potencial de expansão (relacionado à [`OpenFinanceScreen.tsx`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\screens\OpenFinanceScreen.tsx)).

### 5.3. Cibersegurança Aplicada e Demonstrada

O projeto possui telas dedicadas para demonstrar a aplicação de conceitos de cibersegurança:

*   **`screens/CybersecurityDemoScreen.tsx`**:
    *   Orquestra uma demonstração dos 6 critérios de cibersegurança definidos no projeto: LGPD, Segurança Geral, Processamento Seguro (XSS), IA Explicável, Mitigação de Vieses e Design Ético.
    *   Executa testes simulados para cada critério, como criptografia de dados (#attachment `CybersecurityDemoScreen.tsx` line 41), autenticação, sanitização de XSS (usando uma lista de vetores de ataque, #attachment `CybersecurityDemoScreen.tsx` line 130, line 207), análise de XAI e vieses.
    *   Apresenta um score para cada critério e um resumo dos resultados (#attachment `CybersecurityDemoScreen.tsx` line 563, line 597, line 631).
    *   Fornece feedback visual e logs de console detalhados sobre os testes (ex: debug de criptografia em #attachment `CybersecurityDemoScreen.tsx` line 86, detalhes de XSS em #attachment `CybersecurityDemoScreen.tsx` line 449).

*   **`screens/CryptographyDemoScreen.tsx`**:
    *   Foca na demonstração prática de:
        *   **Criptografia AES-256:** Utilizando [`EncryptionService.encryptData`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\EncryptionService.ts#L8) e `decryptData`.
        *   **Hashing de Senhas:** Com [`EncryptionService.hashPassword`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\EncryptionService.ts#L112).
        *   **Proteção contra XSS:** Testando o [`DataSanitizer.sanitizeUserInput`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\DataSanitizer.ts#L10) contra inputs maliciosos.
    *   Exibe resultados detalhados, incluindo o antes e depois da sanitização, e logs de auditoria das operações (#attachment `CryptographyDemoScreen.tsx` line 102, line 284).
    *   Oferece explicações técnicas sobre os algoritmos e proteções implementadas (#attachment `CryptographyDemoScreen.tsx` line 343, line 362).
    *   Permite copiar um relatório formatado dos testes (#attachment `CryptographyDemoScreen.tsx` line 123, line 147, line 167).

### 5.4. IA Explicável (XAI)

*   **Serviço Central:** [`services/ExplainableAI.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\ExplainableAI.ts)
*   **Objetivo:** Tornar as decisões da IA transparentes e compreensíveis para o usuário.
*   **Funcionalidades Chave:**
    *   `explainRiskAssessment` (#attachment `ExplainableAI.ts` line 31, line 37, line 50, line 65, line 80, line 94, line 107, line 123, line 140): Analisa dados comportamentais (`UserBehaviorData`) e retorna uma `RiskExplanation` detalhada, incluindo:
        *   `riskScore`: Pontuação de risco.
        *   `factors`: Lista de fatores que contribuíram para o risco, com impacto e explicação individual.
        *   `recommendation`: Sugestão personalizada baseada no risco (gerada por `generateRecommendation`, #attachment `ExplainableAI.ts` line 166, line 175).
        *   `confidence`: Nível de confiança na avaliação.
        *   `reasoning`: Passos lógicos simplificados.
    *   `explainAlert` (#attachment `ExplainableAI.ts` line 193, line 201): Fornece explicações claras para tipos específicos de alertas gerados (ex: `HIGH_FREQUENCY`, `LATE_NIGHT`).
    *   `explainAlgorithm` (#attachment `ExplainableAI.ts` line 211): Descreve de forma simples os critérios que a IA utiliza para suas análises, promovendo a transparência.
*   **Interface de Auditoria:** [`screens/ExplanationAuditScreen.tsx`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\screens\ExplanationAuditScreen.tsx)
    *   Permite ao usuário visualizar o histórico de explicações da IA.
    *   Filtra explicações por nível de risco (baixo, médio, alto - ver `getRiskColor`, `getRiskLabel`, `filteredExplanations`, #attachment `ExplanationAuditScreen.tsx` line 47, line 98, line 198).
    *   Permite ao usuário reportar vieses percebidos em uma explicação (#attachment `ExplanationAuditScreen.tsx` line 47).
    *   Exibe a explicação do funcionamento do algoritmo (`ExplainableAI.explainAlgorithm()`, #attachment `ExplanationAuditScreen.tsx` line 144).

### 5.5. Análise e Mitigação de Vieses Algorítmicos

*   **Serviço Central:** [`services/BiasAnalyzer.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\BiasAnalyzer.ts)
*   **Objetivo:** Identificar e analisar potenciais vieses nos dados e nas decisões algorítmicas para promover a equidade.
*   **Funcionalidades:**
    *   `analyzeBias`: Recebe dados de usuários (`UserData[]`) e gera um relatório de viés, analisando:
        *   **Viés Demográfico:** Distribuição de risco por idade, gênero, localização.
        *   **Viés Comportamental:** Como diferentes comportamentos são avaliados.
        *   **Viés de Decisão:** Padrões nas decisões da IA (função `analyzeDecisionPatterns`, #attachment `BiasAnalyzer.ts` line 182).
    *   `monitorRealtimeBias`: Chamado, por exemplo, pelo `BettingMonitorService` para uma análise de viés em tempo real de uma decisão específica.
*   **Interface de Análise:** [`screens/BiasAnalysisScreen.tsx`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\screens\BiasAnalysisScreen.tsx)
    *   Permite executar uma análise de viés sob demanda usando dados de exemplo (`generateSampleUserData`, #attachment `BiasAnalysisScreen.tsx` line 47).
    *   Exibe o relatório de viés gerado pelo `BiasAnalyzer`.

### 5.6. Design Ético e Tomada de Decisão Ética

*   **Serviço Central:** [`services/EthicalDecisionEngine.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\EthicalDecisionEngine.ts)
*   **Objetivo:** Incorporar considerações éticas no processo de tomada de decisão da aplicação, especialmente em intervenções ou coleta de dados.
*   **Funcionalidades:**
    *   `shouldSendAlert`: Avalia se um alerta deve ser enviado, considerando o tipo de alerta, preferências do usuário (ex: horários de silêncio, limite de notificações) e o estado do usuário.
    *   `shouldIntervene` (#attachment `EthicalDecisionEngine.ts` line 153): Avalia a apropriação ética de diferentes tipos de intervenção (ex: `information_only`, `professional_help`) com base no contexto do usuário e no nível de risco.
    *   `assessDataBenefit` e `assessPrivacyImpact` (#attachment `EthicalDecisionEngine.ts` line 136, line 206): Funções para ponderar o benefício da coleta de um tipo de dado versus seu impacto na privacidade, auxiliando em decisões de design centradas na privacidade.
    *   Registra decisões éticas no `AuditService`.

### 5.7. Camada de Segurança e Conformidade

*   **Criptografia:** [`services/EncryptionService.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\EncryptionService.ts)
    *   Implementa criptografia AES-256 para dados em repouso (simulado) e em trânsito (demonstração).
    *   Hashing de senhas com SHA-256.
*   **Sanitização de Dados:** [`services/DataSanitizer.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\DataSanitizer.ts)
    *   Proteção robusta contra XSS (`sanitizeUserInput`, #attachment `DataSanitizer.ts` line 4).
    *   Validação de estruturas de dados (`validateBettingEvent`, `validateUserData`).
*   **Auditoria Detalhada:** [`services/AuditService.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\AuditService.ts)
    *   Registra uma ampla gama de ações: login, verificação MFA (#attachment `MFAScreen.tsx` line 26, line 105), registro de eventos de aposta (#attachment `BettingMonitorService.ts` line 127), análises de risco da IA (#attachment `ExplainableAI.ts` line 140), decisões éticas, requisições API (#attachment `ApiService.ts` line 125, line 179), testes de segurança (#attachment `CryptographyDemoScreen.tsx` line 102), etc.
    *   Logs incluem timestamp, ação, categoria, ID do usuário, detalhes e severidade.
*   **Comunicação Segura com APIs:** [`services/ApiService.ts`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\services\ApiService.ts)
    *   Gerencia tokens de autenticação.
    *   Simula rate limiting.
    *   Pode criptografar dados sensíveis antes do envio para um backend (`containsSensitiveData`, `EncryptionService.encryptData`, #attachment `ApiService.ts` line 125).
    *   Loga todas as requisições e respostas via `AuditService`.
*   **Autenticação Multifator (MFA):**
    *   Demonstrada na [`screens/MFAScreen.tsx`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\screens\MFAScreen.tsx).
    *   Lógica de verificação (simulada) em `AuthenticationService.verifyMFA`.

## 6. Navegação e Estrutura da Aplicação

*   **Arquivo Principal:** [`App.tsx`](d:\Fiap\Ano 3\Sprints1\Cyber\sinais-app\App.tsx)
*   **Navegação:** Utiliza `react-navigation` com:
    *   `RootStackParamList`: Define todas as telas principais da aplicação (#attachment `App.tsx` line 43).
    *   `MainTabNavigator`: Navegação por abas para as seções principais (Início, Monitoramento, Aprender, Metas, Perfil - #attachment `App.tsx` line 263).
    *   Stacks aninhados para cada aba (ex: `HomeStackParamList`, `ProfileStackParamList` - #attachment `App.tsx` line 78, line 117, line 121, line 139, line 172, line 190, line 203), organizando o fluxo de navegação.
    *   A tela `AIChatScreen` é acessível a partir da `HomeStack` (#attachment `App.tsx` line 78).

## 7. Diferenciais e Inovação

*   **Abordagem Integrada:** Combina IA, cibersegurança e design ético de forma coesa, não como silos isolados.
*   **Transparência Radical:** Foco em XAI e auditoria para que o usuário (e a banca) compreendam o "porquê" das ações da IA.
*   **Segurança Demonstrável:** Não apenas implementa segurança, mas a demonstra interativamente.
*   **Conformidade Proativa:** Considerações sobre LGPD e privacidade desde a concepção.
*   **Mitigação de Riscos Algorítmicos:** Ferramentas ativas para identificar e analisar vieses.
*   **Motor de Decisão Ética:** Um framework para guiar intervenções e coleta de dados de forma ética.

## 8. Tecnologias Utilizadas (Resumo)

*   **Frontend:** React Native, Expo, TypeScript
*   **Navegação:** React Navigation
*   **UI:** Componentes Nativos, MaterialCommunityIcons
*   **Áudio:** `expo-av`
*   **Criptografia:** `crypto-js` (para AES, SHA-256)
*   **Estado/Lógica:** Hooks do React, Classes TypeScript para serviços.

## 9. Resultados e Impacto Potencial

*   **Para a XP Inc & FIAP:** Demonstra capacidade de inovação e aplicação de tecnologias de ponta em projetos com responsabilidade social e técnica.
*   **Para Usuários:** Oferece uma ferramenta que pode auxiliar no autoconhecimento e na tomada de decisões mais conscientes, com a garantia de segurança e transparência.
*   **Para a Indústria:** Serve como um modelo de referência para o desenvolvimento de aplicações de IA éticas e seguras.

## 10. Próximos Passos e Evolução Futura

*   **Integração Speech-to-Text:** Implementar um serviço STT para funcionalidade completa de voz no `AIChatScreen`.
*   **Backend Dedicado:** Desenvolver um backend robusto para gerenciamento de usuários, persistência de dados segura e processamento da IA.
*   **Expansão do Monitoramento:** Aplicar os conceitos de monitoramento e XAI a outros domínios além de apostas.
*   **Testes Abrangentes:** Implementar suítes de testes unitários, de integração e E2E.
*   **Personalização Avançada:** Permitir maior personalização das preferências éticas e de privacidade pelo usuário.
*   **Gamificação Responsável:** Explorar elementos de gamificação para engajamento positivo, alinhados com os princípios éticos.

## 11. Conclusão

O Sinais App representa um esforço significativo para materializar os princípios de uma tecnologia centrada no ser humano. Ao integrar inteligência artificial explicável, cibersegurança robusta e um framework de design ético, o projeto não apenas atende aos requisitos funcionais, mas também estabelece um alto padrão de responsabilidade e transparência. Acreditamos que este projeto demonstra o potencial da colaboração XP Inc X FIAP para impulsionar a inovação com impacto positivo.

---

Este documento visa fornecer uma visão detalhada. Estamos à disposição para responder a quaisquer perguntas e aprofundar em qualquer aspecto do projeto.