# Relatório de Análise Dinâmica de Segurança de Aplicação (DAST)

Este relatório apresenta os resultados de uma varredura de segurança real, executada contra o mini-backend criado para o Sinais App. A análise foi focada em identificar vulnerabilidades em tempo de execução.

- **Alvo:** `http://host.docker.internal:3000`
- **Ferramenta de Varredura:** OWASP ZAP (Baseline Scan)
- **Data da Varredura:** 20 de Setembro de 2025
- **Nível de Risco Geral:** <span style="color:orange">**Médio**</span>

---

## Sumário Executivo

A varredura identificou **8 alertas (Warnings)**, a maioria relacionada à falta de cabeçalhos de segurança HTTP. Esses cabeçalhos são uma medida de defesa fundamental (defense-in-depth) para proteger a aplicação contra ataques comuns, como Clickjacking, Cross-Site Scripting (XSS) e outros. Embora nenhuma vulnerabilidade crítica tenha sido encontrada, a correção desses alertas é fortemente recomendada para fortalecer a segurança da API.

---

## Detalhes das Vulnerabilidades

O ZAP Baseline Scan reportou 8 tipos de alertas. Abaixo estão os mais importantes, com recomendações de correção para um ambiente Express.js.

### 1. Ausência de Cabeçalhos de Segurança Essenciais

- **Severidade:** <span style="color:orange">**Média**</span>
- **Alertas do ZAP:**
    - `Missing Anti-clickjacking Header [10020]`
    - `X-Content-Type-Options Header Missing [10021]`
    - `Content Security Policy (CSP) Header Not Set [10038]`
    - `Permissions Policy Header Not Set [10063]`
- **Descrição:** O servidor não está enviando cabeçalhos HTTP que instruem os navegadores a aplicar políticas de segurança. Isso deixa a aplicação mais exposta a ataques.
    - **Anti-clickjacking (X-Frame-Options):** Sem este cabeçalho, um site malicioso poderia carregar sua API em um `iframe` para enganar os usuários e fazê-los clicar em botões sem saber (Clickjacking).
    - **X-Content-Type-Options:** A ausência do valor `nosniff` pode permitir que navegadores antigos executem scripts maliciosos disfarçados de outros tipos de arquivo (ex: uma imagem).
    - **Content-Security-Policy (CSP):** Este é um dos cabeçalhos mais importantes. Ele define de quais fontes o navegador pode carregar recursos (scripts, estilos, etc.), prevenindo ataques de XSS.
    - **Permissions-Policy:** Controla quais recursos do navegador (câmera, microfone, geolocalização) a aplicação pode usar.
- **Recomendação:** Adicione um middleware de segurança ao seu `server.js` para configurar esses cabeçalhos globalmente. O pacote `helmet` é excelente para isso.

    **Exemplo de Correção:**
    1. Pare o servidor.
    2. Instale o Helmet: `npm install helmet`
    3. Adicione o seguinte código ao `server.js`:

    ```javascript
    const express = require('express');
    const helmet = require('helmet'); // Importe o helmet
    const app = express();

    app.use(helmet()); // Use o helmet como middleware

    // ... resto do seu código ...
    ```

### 2. Vazamento de Informação do Servidor (X-Powered-By)

- **Severidade:** <span style="color:yellow">**Baixa**</span>
- **Alerta do ZAP:** `Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s) [10037]`
- **Descrição:** O servidor está enviando o cabeçalho `X-Powered-By: Express`. Isso informa a um potencial atacante que a aplicação usa o framework Express, permitindo que ele foque em vulnerabilidades conhecidas dessa tecnologia.
- **Impacto:** Facilita o reconhecimento da tecnologia do servidor para um atacante.
- **Recomendação:** Desabilite este cabeçalho. O middleware `helmet` (recomendado acima) faz isso automaticamente. Alternativamente, você pode desabilitá-lo manualmente no `server.js`:

    ```javascript
    app.disable('x-powered-by');
    ```

### 3. Isolamento Insuficiente do Site (Spectre)

- **Severidade:** <span style="color:yellow">**Baixa**</span>
- **Alerta do ZAP:** `Insufficient Site Isolation Against Spectre Vulnerability [90004]`
- **Descrição:** Para mitigar ataques de canal lateral baseados em CPU, como o Spectre, os navegadores modernos oferecem mecanismos de isolamento mais fortes através de cabeçalhos específicos.
- **Impacto:** Em cenários de ataque muito específicos e complexos, um site malicioso poderia extrair informações de processos em execução no navegador que estão relacionados à sua aplicação.
- **Recomendação:** O middleware `helmet` também configura os cabeçalhos necessários para isso (`Cross-Origin-Opener-Policy` e `Cross-Origin-Embedder-Policy`) com padrões seguros.

---

## Próximos Passos

Recomenda-se aplicar as correções sugeridas no arquivo `server.js`, principalmente a adição do middleware `helmet`, que resolve a maioria dos problemas encontrados com uma única linha de código. Após a correção, uma nova varredura DAST deve ser executada para verificar se os alertas foram resolvidos.

## Fim do Relatório