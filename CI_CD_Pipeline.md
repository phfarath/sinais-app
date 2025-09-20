# Documentação do Pipeline de CI/CD com Segurança (DevSecOps)

Este documento descreve o pipeline de Integração Contínua e Entrega Contínua (CI/CD) configurado para o projeto Sinais App, com foco na integração de ferramentas de segurança (SAST, DAST, SCA).

O pipeline é definido no arquivo `.github/workflows/security.yml` e utiliza o GitHub Actions para automação.

## 1. Gatilhos (Triggers)

O pipeline é acionado automaticamente nos seguintes eventos:

- **`push`**: Sempre que um novo commit é enviado para a branch `main`.
- **`pull_request`**: Sempre que uma nova Pull Request é aberta ou atualizada com destino à branch `main`.

Isso garante que toda alteração no código principal seja verificada antes e depois de ser integrada.

## 2. Jobs de Segurança

O pipeline consiste em três jobs de segurança. O job de DAST depende do sucesso dos jobs de SCA e SAST.

### a. `sca-scan` (Análise de Componentes de Terceiros)

- **Ferramenta:** Snyk
- **Descrição:** Este job verifica as dependências do projeto (pacotes NPM) em busca de vulnerabilidades conhecidas (CVEs).
- **Política de Segurança:** O build falhará (`exit code 1`) se for encontrada qualquer vulnerabilidade de severidade **Alta** (`--fail-on=high`). Isso impede que dependências perigosas sejam introduzidas no projeto.

### b. `sast-scan` (Análise Estática de Segurança)

- **Ferramenta:** Semgrep
- **Descrição:** Realiza uma análise estática no código-fonte em busca de padrões de código inseguros, como injeção de SQL, senhas hard-coded, e outras más práticas.
- **Política de Segurança:** O job utiliza a ação oficial do Semgrep (`returntocorp/semgrep-action@v1`) com o conjunto de regras padrão (`p/default`). O build falhará se qualquer vulnerabilidade for encontrada.

### c. `dast-scan` (Análise Dinâmica de Segurança)

- **Ferramenta:** OWASP ZAP
- **Descrição:** Este job testa a aplicação em execução. Ele é executado apenas após o sucesso dos jobs de SCA e SAST.
    1.  Primeiro, ele instala as dependências do mini-backend e o inicia em background.
    2.  Em seguida, utiliza a action oficial do ZAP (`zaproxy/action-baseline@v0.10.0`) para realizar uma varredura de linha de base na API local (`http://localhost:3000`).
- **Política de Segurança:** A action do ZAP está configurada com `fail_action: true`. Isso significa que o job falhará se o ZAP reportar qualquer alerta de nível **Warning** ou superior.

## 3. Políticas de Bloqueio e Notificações

- **Bloqueio de Deploy:** Em um repositório GitHub real, a branch `main` pode ser protegida. Ao ativar a regra "Require status checks to pass before merging", o GitHub irá proibir o merge de Pull Requests caso qualquer um desses jobs de segurança falhe. Isso efetivamente bloqueia o deploy de código inseguro.
- **Notificações:** O GitHub Actions notifica automaticamente os usuários sobre falhas no pipeline através da interface de Pull Requests e por e-mail.
- **Dashboards:** A aba "Actions" no repositório GitHub serve como um dashboard de segurança contínua, mostrando o histórico de execuções, logs, e os resultados de cada varredura.

## Exemplo de Execução (Logs e Alertas)

Em uma execução real, se o job de DAST falhasse, a saída na aba "Actions" se pareceria com isto:

```log
Run zaproxy/action-baseline@v0.10.0
...
WARN-NEW: X-Content-Type-Options Header Missing [10021] x 1
    http://localhost:3000
...
Error: Job failed: ZAP found 8 warning(s) and 0 error(s)
```

Este log detalhado fornece evidência clara da vulnerabilidade, permitindo que o desenvolvedor a corrija rapidamente. A Pull Request associada mostraria um "X" vermelho, indicando que a verificação falhou e o merge está bloqueado.
