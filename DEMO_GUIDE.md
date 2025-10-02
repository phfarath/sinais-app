# 🎯 Guia de Demonstração - Diferenciais SINAIS App

## 📱 Acesso Rápido

### Como Abrir no Expo Go

1. **Instale o Expo Go**
   - iOS: App Store
   - Android: Google Play

2. **Execute o Projeto**
   ```bash
   cd sinais-app
   npm start
   ```

3. **Escaneie o QR Code**
   - iOS: Use a câmera nativa
   - Android: Use o Expo Go

### Credenciais de Login
- **Email:** `fiap@fiap.com.br`
- **Senha:** `123456`

---

## 🎬 Roteiro de Demonstração

### 1. Tela Inicial (HomeScreen)
**O que mostrar:**
- Perfil de risco do usuário
- Card de Cybersecurity ativo
- Scroll até "🚀 Novos Recursos"
- Grid com 5 novos cards coloridos

**Destaque:**
> "Todos esses recursos foram implementados e funcionam 100% no Expo Go, sem necessidade de build nativo"

---

### 2. Bloqueio de Apps 🔒

**Navegação:** Home → "Bloqueio de Apps"

**Demonstração passo a passo:**

1. **Mostrar estatísticas iniciais**
   - "Veja: temos 0 apps bloqueados inicialmente"
   - "Tempo economizado: 0min"

2. **Bloquear Instagram**
   - Ative o toggle
   - "Note como o card muda para vermelho"
   - "Estatísticas atualizam instantaneamente"
   - "Ganhou 10 pontos!"

3. **Bloquear mais apps**
   - TikTok, Facebook, Twitter
   - "Ao bloquear 5 apps..."
   - **BADGE DESBLOQUEADO: "Controlador" 🛡️**

4. **Funcionalidades extras**
   - Botão "Bloquear Todos"
   - "Dados persistem - feche e abra o app novamente"

**Destaque técnico:**
> "Usa AsyncStorage para persistência, integração com sistema de gamificação, e interface visual polida com gradientes LinearGradient"

---

### 3. Análise de Uso 📊

**Navegação:** Home → "Análise de Uso"

**Demonstração passo a passo:**

1. **Cards de estatísticas**
   - Tempo de hoje: 340min (5h 40min)
   - Média diária: 357min
   - Tempo produtivo vs distrações

2. **Gráfico de tendência semanal**
   - LineChart com dados dos últimos 7 dias
   - "Veja a curva de uso do Instagram"

3. **Top apps mais usados**
   - BarChart mostrando ranking
   - "Instagram lidera com 120min hoje"

4. **Detalhes por app**
   - Scroll para ver cada app
   - Comparação hoje vs ontem
   - Indicadores ↑/↓ de variação

5. **Sugestão IA**
   - "Você passou mais de 2h em apps de distração"
   - "Considere ativar o modo foco"

**Destaque técnico:**
> "Usa react-native-chart-kit para gráficos, cálculos estatísticos em tempo real, dados simulados mas realistas, sugestões personalizadas"

---

### 4. Modo Foco 🎯

**Navegação:** Home → "Modo Foco"

**Demonstração passo a passo:**

1. **Timer inicial**
   - "Mostra 25:00 (25 minutos)"
   - "Progresso: 0%"

2. **Selecionar duração**
   - Toque em "15min"
   - "Timer muda para 15:00"

3. **Iniciar sessão**
   - Botão verde "Iniciar Foco"
   - Timer começa contagem regressiva
   - Status muda para "Em Foco"

4. **Controles ativos**
   - Botão "Pausar" (amarelo)
   - Botão "Parar" (vermelho)
   - "Se parar, perde progresso"

5. **Deixar completar (ou pular para demo)**
   - **ALERTA: "🎉 Sessão Completa!"**
   - Ganhou pontos (2 pts/min)
   - Tempo total de foco atualizado

6. **Estatísticas**
   - Tempo total: 345min (5h 45min)
   - Sessões completadas: calculado automaticamente

**Destaque técnico:**
> "Timer real com setInterval, notificações ao completar, integração completa com gamificação, técnica Pomodoro, persistência de progresso"

---

### 5. Modo Emergência 🆘

**Navegação:** Home → "SOS Emergência"

**Demonstração passo a passo:**

1. **Botão SOS**
   - Grande e visível
   - "Toque para ativar"
   - **ALERTA: "🆘 SOS Ativado"**
   - "Opção de ligar para CVV (188)"

2. **Contatos de emergência**
   - CVV - 188 (verde, botão de ligação)
   - SAMU - 192
   - Família (simulado)
   - Terapeuta (simulado)
   - "Toque no botão verde para ligar"

3. **Ações rápidas**
   - "Respiração Guiada" (navega para BreathingScreen)
   - "Música Relaxante" (simulado com alerta)

4. **Recursos de apoio**
   - Chat Online CVV (link externo)
   - CAPS (informações)

5. **Mensagem motivacional**
   - "Você não está sozinho"
   - Texto de apoio emocional

**Destaque técnico:**
> "Integração real com telefone via Linking API, navegação entre telas, links externos, design empático e acolhedor"

---

### 6. Sistema de Gamificação 🏆

**Navegação:** Home → "Conquistas"

**Demonstração passo a passo:**

1. **Card de progresso do usuário**
   - Nível 2
   - 125 pontos
   - Barra de progresso para próximo nível
   - "Faltam 75 pontos para nível 3"

2. **Estatísticas**
   - Sequência: 2 dias consecutivos
   - Tempo de foco: 5h
   - Apps bloqueados: 3

3. **Tab "Badges"**
   - Badge desbloqueado: "Primeiro Passo" ✓
   - "Se bloqueou 5 apps, tem 'Controlador'"
   - Badges bloqueados em cinza

4. **Tab "Desafios"**
   - Tempo de Foco Diário: 45/120min (barra de progresso)
   - Apps Bloqueados: 3/5
   - Dias Consecutivos: 2/7
   - Recompensas em pontos

5. **Ranking semanal**
   - 1º Ana Silva - 1,250 pts
   - 2º Você - 125 pts
   - 3º Carlos Santos - 980 pts

**Destaque técnico:**
> "Sistema completo de XP e níveis, 6 badges desbloqueáveis, achievements com progresso, ranking simulado, tudo persistente com AsyncStorage"

---

## 🎯 Pontos de Destaque Gerais

### Para a Banca

1. **Sem dependências nativas**
   - "Tudo funciona no Expo Go"
   - "Sem necessidade de build"
   - "Demonstração instantânea"

2. **Persistência real**
   - "Feche o app e reabra"
   - "Todos os dados persistem"
   - "AsyncStorage em produção"

3. **Integração entre recursos**
   - "Bloqueio de apps → pontos → badges"
   - "Modo foco → pontos → achievements"
   - "Tudo conectado"

4. **Qualidade visual**
   - "LinearGradient em todos os cards"
   - "Material Icons consistentes"
   - "Animações suaves"
   - "Design profissional"

5. **Funcionalidade completa**
   - "Timers funcionais"
   - "Gráficos interativos"
   - "Ligações telefônicas reais"
   - "Notificações locais"

---

## 🚀 Diferenciais Técnicos

### Arquitetura
```typescript
// Serviços modulares e reutilizáveis
BlockedAppsService.ts    // Gerenciamento de apps
UsageDataService.ts      // Análise de dados
GamificationService.ts   // Sistema de recompensas

// Telas especializadas
AppBlockerScreen.tsx
UsageAnalyticsScreen.tsx
FocusModeScreen.tsx
EmergencyModeScreen.tsx
GamificationScreen.tsx
```

### Tecnologias Demonstradas
- ✅ AsyncStorage (persistência)
- ✅ React Native Chart Kit (gráficos)
- ✅ Expo Notifications (notificações)
- ✅ Linking API (telefone)
- ✅ Navigation (rotas)
- ✅ LinearGradient (design)
- ✅ TypeScript (tipagem)

---

## 📊 Métricas Finais

| Métrica | Valor |
|---------|-------|
| Novas Telas | 5 |
| Novos Serviços | 3 |
| Linhas de Código | ~2.800+ |
| Funcionalidade Expo Go | 100% |
| Deps Nativas Novas | 0 |
| Features Integradas | Todas |

---

## ✨ Conclusão

**Mensagem final para a banca:**

> "Implementamos 5 telas completamente funcionais e integradas, com 3 serviços de dados, tudo rodando 100% no Expo Go sem necessidade de build nativo. O app demonstra recursos avançados de:
> 
> - Persistência de dados (AsyncStorage)
> - Visualização de dados (Charts)
> - Gamificação (Badges, XP, Níveis)
> - Integração de hardware (Telefone, Notificações)
> - UX profissional (Gradientes, Animações, Feedback)
> 
> Tudo pronto para demonstração via QR Code em qualquer dispositivo iOS ou Android."

---

## 📞 Suporte

Em caso de dúvidas durante a apresentação:
- Verifique se o Expo está atualizado
- Confira se as credenciais estão corretas
- Recarregue o app (shake + Reload)
- Limpe AsyncStorage se necessário (Settings do Expo)
