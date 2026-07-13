# SIGMUND — Assistente Terapêutico com IA

SIGMUND é uma SPA (Single Page Application) que oferece um espaço seguro para reflexão e acolhimento emocional, utilizando inteligência artificial com base em conhecimento clínico especializado em saúde mental.

> ⚠️ **Aviso**: SIGMUND não substitui acompanhamento profissional. Em caso de crise, ligue para o CVV (188) ou SAMU (192).

## Arquitetura

```
terapia-spa/
├── index.html              # Entry point (SPA)
├── _redirects              # Cloudflare Pages SPA routing
├── serve.js                # Servidor local + proxy API
├── css/
│   ├── variables.css       # Design tokens, themes
│   ├── base.css            # Reset, base styles
│   ├── layout.css          # App shell, header, nav, input
│   ├── chat.css            # Messages, bubbles, typing
│   └── components.css      # Modals, buttons, toggles
├── js/
│   ├── utils.js            # Storage, helpers, Providers config
│   ├── session.js          # Session CRUD, export
│   ├── kb.js               # Knowledge Base index + loader
│   ├── prompts.js          # System prompts por intent
│   ├── router.js           # Intent analysis + KB routing
│   ├── api.js              # API calls + model fetching
│   ├── chat.js             # Chat UI, send/receive
│   └── app.js              # Init, theme, settings, modals
└── knowledge_base/         # 60+ files de conhecimento clínico
    ├── 01_Fundamentos/
    ├── 02_Neurociencia/
    ├── 03_Psicopatologia/
    ├── 04_DSM5_TR/
    ├── 05_CID11/
    ├── 06_Psiquiatria_Psicofarmacologia/
    ├── 07_Psicologia_Clinica/
    ├── 08_Psicanalise/
    ├── 09_Entrevista_Clinica/
    ├── 10_Avaliacao_Escalas/
    ├── 11_Casos_Clinicos/
    ├── 12_Populacoes_Especiais/
    ├── 13_Emergencias_Psiquiatricas/
    ├── 14_Medicina_Estilo_Vida/
    ├── 15_Comunicacao_Terapeutica/
    ├── 16_Tomada_Decisao_Clinica/
    └── 17_EVIDENCIAS_Cientificas/
```

## Funcionalidades

- **Chat terapêutico** com IA com análise de intenção (saudação, sintoma, crise, progresso, etc.)
- **Knowledge Base** com 60+ documentos clínicos carregados dinamicamente conforme o contexto
- **BYOK** (Bring Your Own Key) — suporte a OpenRouter, OpenAI, Anthropic, NVIDIA NIM e Google Gemini
- **Modelos dinâmicos** — a lista de modelos é baixada da API do provedor em tempo real
- **Proxy server-side** — todas as chamadas de API passam pelo servidor local, evitando CORS
- **Sessões** — múltiplas sessões com histórico, exportação em Markdown
- **Tema escuro/claro** com preferência do sistema
- **Modo de emergência** com contatos de crise (CVV, SAMU, Polícia)
- **Responsivo** — funciona em desktop e mobile

## Provedores Suportados

| Provedor    | Modelos (fetch dinâmico) |
|-------------|--------------------------|
| OpenRouter  | Sim (via API)            |
| OpenAI      | Sim (via API)            |
| Anthropic   | Fixos                    |
| NVIDIA NIM  | Sim (via API, sem auth)  |
| Google Gemini | Fixos                  |

## Setup Local

```bash
# 1. Instalar dependências (nenhuma — é vanilla JS)
# Apenas Node.js é necessário para o servidor local

# 2. Iniciar servidor
node terapia-spa/serve.js

# 3. Abrir no navegador
# http://localhost:3000
```

## Deploy no Cloudflare Pages

```bash
# 1. Criar repositório no GitHub
gh repo create sigmund --public --source=. --push

# 2. No Cloudflare Dashboard:
#    - Workers & Pages → Create → Pages → Connect to Git
#    - Selecionar repositório sigmund
#    - Build settings:
#      - Build command: (nenhum — é estático)
#      - Build output: /terapia-spa
#      - Root directory: (deixar vazio)

# 3. Adicionar variável de ambiente no Cloudflare (se necessário):
#    - NODE_VERSION: 22

# 4. Deploy automático em cada push na main
```

O arquivo `_redirects` já configura o roteamento SPA (`/* → /index.html`).

## API Proxy

O servidor local (`serve.js`) inclui um endpoint `/api/proxy` que faz proxy de chamadas para APIs externas. Isso resolve problemas de CORS com provedores como NVIDIA NIM.

```javascript
POST /api/proxy
{
  "url": "https://integrate.api.nvidia.com/v1/chat/completions",
  "method": "POST",
  "headers": { "Authorization": "Bearer nvapi-..." },
  "body": "{\"model\":\"...\",\"messages\":[...]}"
}
```

## Licença

MIT
