# Documentação do Pipeline de CI/CD com Segurança (DevSecOps)

Este documento descreve o pipeline de Integração Contínua e Entrega Contínua (CI/CD) configurado para o projeto Sinais App, com foco na integração de ferramentas de segurança (SAST, DAST, SCA).

O pipeline é definido no arquivo `.github/workflows/security.yml` e utiliza o GitHub Actions para automação.

## 1. Gatilhos (Triggers)

O pipeline é acionado automaticamente nos seguintes eventos:

- **`push`**: Sempre que um novo commit é enviado para a branch `Versao_cyber`.
- **`pull_request`**: Sempre que uma nova Pull Request é aberta ou atualizada com destino à branch `Versao_cyber`.

Isso garante que toda alteração no código principal seja verificada antes e depois de ser integrada.

## 2. Jobs de Segurança

O pipeline consiste em três jobs de segurança. O job de DAST depende do sucesso dos jobs de SCA e SAST.

### a. `sca-scan` (Análise de Componentes de Terceiros)

- **Ferramenta:** Snyk
- **Descrição:** Este job verifica as dependências do projeto (pacotes NPM) em busca de vulnerabilidades conhecidas (CVEs). Ele também envia um snapshot das dependências para a plataforma Snyk (`snyk monitor`), permitindo monitoramento contínuo e um plano de ação detalhado para itens sem patches.
- **Política de Segurança:** O build falhará (`exit code 1`) se for encontrada qualquer vulnerabilidade de severidade **Alta** (`--fail-on=high`).
- **Artefatos:** Um relatório `snyk-report.json` é gerado e disponibilizado para download.

### b. `sast-scan` (Análise Estática de Segurança)

- **Ferramenta:** Semgrep
- **Descrição:** Realiza uma análise estática no código-fonte em busca de padrões de código inseguros. O job gera um relatório no formato SARIF, que inclui detalhes de severidade e guias de remediação.
- **Política de Segurança:** O build falhará se qualquer vulnerabilidade de severidade `ERROR` for encontrada.
- **Integração com GitHub Security:** O relatório SARIF é publicado na aba "Security" > "Code scanning alerts" do repositório, centralizando os findings de segurança.
- **Artefatos:** Um relatório `semgrep-report.sarif` é disponibilizado para download.

### c. `dast-scan` (Análise Dinâmica de Segurança)

- **Ferramenta:** OWASP ZAP
- **Descrição:** Este job realiza uma varredura **ativa** na aplicação em execução, enviando payloads para identificar vulnerabilidades em tempo real.
    1.  Primeiro, ele instala as dependências do mini-backend e o inicia em background.
    2.  Em seguida, utiliza a action `zaproxy/action-full-scan@v0.10.0` para realizar a varredura na API local (`http://localhost:3000`).
- **Política de Segurança:** A action do ZAP está configurada com `fail_action: true`. Isso significa que o job falhará se o ZAP reportar qualquer alerta de nível **Warning** ou superior.
- **Artefatos:** Um relatório `zap-report.html` detalhado, com as evidências encontradas, é disponibilizado para download.

## 3. Artefatos e Relatórios

Ao final de cada execução, os seguintes artefatos são gerados e podem ser baixados na página de resumo do workflow no GitHub Actions:

- **`snyk-report.json`**: Relatório bruto das vulnerabilidades de dependência.
- **`semgrep-report.sarif`**: Relatório de análise estática, compatível com o GitHub Security.
- **`zap-report.html`**: Relatório navegável da análise dinâmica, com detalhes e evidências.

## 4. Políticas de Bloqueio e Notificações

- **Bloqueio de Deploy:** A branch `Versao_cyber` pode ser protegida exigindo que os status checks passem antes do merge. Isso bloqueia efetivamente o deploy de código inseguro se qualquer um dos jobs de segurança falhar.
- **Notificações:** O GitHub Actions notifica os usuários sobre falhas no pipeline através da interface de Pull Requests e por e-mail.
- **Dashboards:**
    - A aba **"Actions"** serve como um dashboard de CI/CD, mostrando o histórico de execuções e logs.
    - A aba **"Security" > "Code scanning alerts"** serve como um dashboard de segurança centralizado para os resultados do SAST (Semgrep).

## Exemplo de Execução (Logs e Alertas)

Se o job de DAST falhasse, a saída na aba "Actions" se pareceria com isto:

```log
Run zaproxy/action-full-scan@v0.10.0
...
WARN-NEW: X-Content-Type-Options Header Missing [10021] x 1
    http://localhost:3000
...
Error: Job failed: ZAP found 8 warning(s) and 0 error(s)
```

Este log detalhado, junto com o relatório `zap-report.html`, fornece evidência clara da vulnerabilidade, permitindo que o desenvolvedor a corrija rapidamente. A Pull Request associada mostraria um "X" vermelho, indicando que a verificação falhou e o merge está bloqueado.
