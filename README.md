# SINAIS - Sistema Inteligente de Análise e Insights para Saúde Digital

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

Aplicativo móvel desenvolvido em parceria com XP Inc e FIAP, focado em bem-estar digital, monitoramento comportamental e controle de hábitos através de inteligência artificial e gamificação.

---

## 🚀 Novos Recursos Demonstráveis (Expo Go)

### 1. 🔒 Bloqueio de Apps
Interface simulada de bloqueio de aplicativos problemáticos.

**Funcionalidades:**
- Lista de apps com toggle para bloqueio/desbloqueio
- Contador de tempo economizado por app bloqueado
- Categorização de apps (Social, Gaming, Entretenimento)
- Estatísticas em tempo real
- Persistência de dados com AsyncStorage
- Integração com sistema de gamificação (pontos e badges)

**Tecnologias:**
- AsyncStorage para persistência
- BlockedAppsService para gerenciamento
- Animações com LinearGradient
- Material Community Icons

### 2. 📊 Análise de Uso
Dashboard completo com monitoramento simulado de tempo de tela.

**Funcionalidades:**
- Gráficos de tendência semanal (LineChart)
- Comparativo de apps mais usados (BarChart)
- Estatísticas detalhadas por aplicativo
- Análise de tempo produtivo vs distrações
- Sugestões baseadas em IA
- Comparação dia-a-dia com indicadores visuais

**Tecnologias:**
- react-native-chart-kit para visualizações
- UsageDataService com dados simulados
- Cálculos estatísticos em tempo real

### 3. 🎯 Modo Foco
Timer de concentração com técnica Pomodoro e gamificação.

**Funcionalidades:**
- Seleção de duração (15, 25, 45, 60 minutos)
- Timer com controles (Iniciar, Pausar, Parar)
- Contador visual de progresso
- Estatísticas de tempo total de foco
- Sistema de pontos (2 pontos por minuto focado)
- Notificações ao completar sessões
- Badges por conquistas (Focado - 2h de foco)
- Integração com achievements

**Tecnologias:**
- React Hooks (useState, useEffect, useRef)
- Expo Notifications
- GamificationService
- Timers com setInterval

### 4. 🆘 Modo Emergência
Sistema de apoio em momentos críticos.

**Funcionalidades:**
- Botão SOS com ativação rápida
- Lista de contatos de emergência:
  - CVV (188) - Centro de Valorização da Vida
  - SAMU (192)
  - Contatos pessoais configuráveis
  - Terapeuta
- Ações rápidas:
  - Respiração guiada
  - Música relaxante
- Recursos de apoio:
  - Chat online CVV
  - CAPS - Centro de Atenção Psicossocial
- Integração com sistema de chamadas
- Mensagem motivacional

**Tecnologias:**
- Linking API do React Native
- Navegação integrada
- LinearGradient para UI impactante

### 5. 🏆 Sistema de Gamificação
Conquistas, badges e progresso visual.

**Funcionalidades:**
- Sistema de níveis baseado em pontos
- Badges desbloqueáveis por categorias:
  - Foco (🎯)
  - Controle (🛡️)
  - Progresso (💪)
  - Bem-estar (🌟)
- Desafios/Achievements com progresso:
  - Tempo de Foco Diário
  - Apps Bloqueados
  - Dias Consecutivos
- Estatísticas de usuário:
  - Sequência atual de dias
  - Tempo total de foco
  - Apps bloqueados
- Ranking semanal simulado
- Sistema de XP e níveis (100 pontos por nível)

**Tecnologias:**
- GamificationService com AsyncStorage
- Visualização de progresso com barras animadas
- Integração cross-features

---

## 📱 Funcionalidades Principais

### Autenticação e Segurança
- Login seguro com MFA (Autenticação Multifator)
- Reconhecimento facial biométrico
- Criptografia AES-256 para dados sensíveis
- Hashing de senhas com bcrypt
- Proteção contra XSS e SQL Injection
- Conformidade com LGPD

### Monitoramento Inteligente
- Análise comportamental em tempo real
- Detecção de padrões de risco
- Sistema de alertas personalizados
- Integração Open Finance (conceitual)
- Dashboard com métricas visuais

### IA Explicável (XAI)
- Decisões transparentes e compreensíveis
- Análise de vieses em tempo real
- Motor de decisão ética
- Auditoria completa de ações
- Explicações detalhadas de análises

### Bem-estar
- Exercícios de respiração guiada
- Sistema de metas e progresso
- Modo de controle/crise
- Conteúdo educacional
- Comunidade de apoio

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native** (0.81.4) - Framework multiplataforma
- **Expo** (54.0) - Ferramentas de desenvolvimento
- **TypeScript** (5.3) - Tipagem estática
- **React Navigation** - Navegação entre telas

### UI/UX
- **expo-linear-gradient** - Gradientes visuais
- **@expo/vector-icons** - Ícones Material
- **react-native-chart-kit** - Gráficos e visualizações
- **react-native-reanimated** - Animações fluidas

### Armazenamento
- **AsyncStorage** - Persistência local
- **expo-secure-store** - Armazenamento seguro
- **expo-crypto** - Operações criptográficas

### Funcionalidades Nativas
- **expo-notifications** - Notificações locais
- **expo-camera** - Reconhecimento facial
- **expo-av** - Áudio e vídeo
- **react-native-keychain** - Gerenciamento de credenciais

### Segurança
- **crypto-js** - Criptografia
- **jwt-decode** - Validação de tokens
- **expo-local-authentication** - Biometria

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Expo Go instalado no celular (iOS/Android)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/phfarath/sinais-app.git
cd sinais-app

# Instale as dependências
npm install --legacy-peer-deps

# Inicie o servidor Expo
npm start
```

### Executando no Dispositivo

1. Abra o Expo Go no seu celular
2. Escaneie o QR Code exibido no terminal/navegador
3. Aguarde o build e carregamento do app

### Credenciais de Acesso

Para acessar o aplicativo na tela de login:
- **Email:** `fiap@fiap.com.br`
- **Senha:** `123456`

---

## 📂 Estrutura do Projeto

```
sinais-app/
├── screens/              # Telas da aplicação
│   ├── AppBlockerScreen.tsx
│   ├── UsageAnalyticsScreen.tsx
│   ├── FocusModeScreen.tsx
│   ├── EmergencyModeScreen.tsx
│   ├── GamificationScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── CybersecurityDemoScreen.tsx
│   └── ...
├── services/             # Lógica de negócio
│   ├── BlockedAppsService.ts
│   ├── UsageDataService.ts
│   ├── GamificationService.ts
│   ├── EncryptionService.ts
│   ├── NotificationService.ts
│   ├── StorageService.ts
│   ├── AuditService.ts
│   ├── BiasAnalyzer.ts
│   └── ...
├── components/           # Componentes reutilizáveis
├── types/               # Definições TypeScript
├── App.tsx              # Componente raiz
└── package.json         # Dependências
```

---

## 🎯 Diferenciais

### 1. Funcionalidade Completa no Expo Go
Todos os recursos funcionam sem necessidade de build nativo:
- ✅ Bloqueio de apps (simulado visualmente)
- ✅ Análise de uso com dados realistas
- ✅ Modo foco com timer funcional
- ✅ Sistema de emergência completo
- ✅ Gamificação com persistência

### 2. Experiência Profissional
- Interface polida com componentes nativos
- Animações fluidas e responsivas
- Design system consistente
- Feedback visual em tempo real

### 3. Demonstração em Tempo Real
- QR Code para acesso instantâneo
- Sem necessidade de compilação
- Funciona em qualquer dispositivo Android/iOS
- Perfeito para apresentações e demos

### 4. Arquitetura Escalável
- Serviços modulares e reutilizáveis
- Separação clara de responsabilidades
- Fácil manutenção e expansão
- TypeScript para maior robustez

---

## 👥 Equipe

| Nome                    | RM      |
|------------------------|---------|
| Luana Cabezaolias      | RM-99320 |
| Lucca Vilaça Okubo     | RM-551538 |
| João Victor            | RM-550453 |
| Juliana Maita          | RM-99224 |
| Pedro Henrique Farath  | RM-98608 |

---

## 📄 Licença

Este projeto está sob a licença MIT. Desenvolvido como parte da Global Solution FIAP em parceria com XP Inc.

---

## 🔗 Links Úteis

- [Documentação React Native](https://reactnative.dev/)
- [Documentação Expo](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Material Design Icons](https://materialdesignicons.com/)

---

## 📞 Contatos de Emergência

O app integra os seguintes recursos de apoio:

- **CVV - Centro de Valorização da Vida:** 188
- **SAMU:** 192
- **Chat Online CVV:** [cvv.org.br](https://www.cvv.org.br)
- **CAPS - Centro de Atenção Psicossocial:** 136

---

## 🎓 Sobre o Projeto

Desenvolvido como parte do programa de Mobile Development and IoT da FIAP, em parceria com a XP Inc, este projeto demonstra a aplicação prática de:

- Inteligência Artificial responsável
- Cibersegurança aplicada
- Design ético e centrado no usuário
- Conformidade regulatória (LGPD)
- Gamificação para engajamento
- Tecnologias mobile modernas

O SINAIS representa uma visão de como a tecnologia pode ser usada para promover bem-estar digital e consciência comportamental de forma ética e transparente.
