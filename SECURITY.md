# Documentação do Processo de Segurança

Este documento detalha os processos de teste e monitoramento de segurança implementados no projeto, conforme as tarefas solicitadas.

---

### Etapa 1: Análise de Componentes de Terceiros (SCA) - (Tarefa 3 e 4)

Esta etapa foca em identificar vulnerabilidades em bibliotecas e dependências externas.

**Ferramenta:** Snyk

**Processo Executado:**
1.  **Instalação e Autenticação:** A CLI do Snyk foi instalada como uma dependência de desenvolvimento (`npm install --save-dev snyk`) e autenticada com uma conta de usuário.
2.  **Varredura Inicial:** O comando `npx snyk test` foi executado para realizar uma varredura completa das dependências e identificar vulnerabilidades conhecidas.
3.  **Remediação:** Uma vulnerabilidade de "Directory Traversal" no pacote `@supabase/auth-js` foi identificada. A correção foi realizada atualizando o pacote pai `@supabase/supabase-js` para a versão `2.50.0`.
4.  **Monitoramento Contínuo:** O comando `npx snyk monitor` foi executado para criar um "snapshot" das dependências do projeto na plataforma Snyk.

**Entregáveis:**
*   **Relatório SCA:** Um relatório detalhado da varredura final está disponível no arquivo `snyk_sca_report.txt`.
*   **Monitoramento e Alertas:** O projeto está agora sob monitoramento contínuo. Notificações sobre novas vulnerabilidades serão enviadas por e-mail. O painel de controle pode ser acessado em: [Painel de Controle Snyk](https://app.snyk.io/org/pedropontesfarath/project/c662a183-27d0-4a82-982c-aa1b5d3fe105).

---

### Etapa 2: Análise Estática de Segurança de Aplicação (SAST) - (Tarefa 1)

Esta etapa foca em detectar vulnerabilidades no código-fonte da aplicação.

**Ferramenta:** Semgrep

**Processo Executado:**
1.  **Instalação:** A CLI do Semgrep foi instalada via `pip`.
2.  **Varredura Inicial:** O comando `semgrep scan --config auto` foi executado para analisar o código com um conjunto de regras de segurança da comunidade.
3.  **Análise de Resultados:** A varredura inicial reportou um **falso positivo** no arquivo `SECURITY.md`, identificando a URL do painel Snyk como uma possível chave de API secreta.
4.  **Remediação de Falso Positivo:** Para corrigir, o arquivo `SECURITY.md` foi adicionado ao `.semgrepignore` para que seja ignorado em futuras varreduras.

**Entregáveis:**
*   **Relatório SAST:** Um relatório da varredura final (com o falso positivo já ignorado) está disponível no arquivo `semgrep_sast_report.txt`.