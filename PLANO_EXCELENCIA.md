# Plano de Excelência — SIGMUND

## Stack Técnica

| Componente | Escolha | Custo |
|------------|---------|-------|
| Modelo principal | DeepSeek V4 Flash | $0,012/sessão |
| Fallback 1 | Qwen 3.5-122B | $0,022/sessão |
| Fallback 2 | GLM-5.2 | $0,012/sessão |
| Roteamento | OpenRouter | Zero markup |
| Frontend | Cloudflare Pages | $0 |
| API Gateway | Cloudflare Worker | $0 |
| Sessões/controle | Cloudflare KV | $0 |
| Pagamento | Stripe | 4,5% + $0,50 |
| Autenticação | Google OAuth | $0 |
| Criptografia PIN | Web Crypto API | $0 |
| Modelos americanos | ❌ Não usar | — |

## Planos de Assinatura

| | Free Trial | Premium | WL Essential | WL Pro |
|---|---|---|---|---|
| Preço | Grátis | R$49/mês | R$97/mês | R$197/mês |
| Sessões | 1 única | Dia sim, dia não | Ilimitado/paciente | Ilimitado/paciente |
| Pacientes | — | 1 | Até 30 | Até 60 |
| PIN | Opcional | Opcional | Opcional | Opcional |
| .sgm auto-download | ✅ fim da sessão | ✅ fim da sessão | ✅ fim da sessão | ✅ fim da sessão |
| Re-download | ✅ localStorage cripto | ✅ | ✅ | ✅ |
| PDF p/ psicólogo | ❌ | ❌ | ✅ email | ✅ email |
| BYOK | ❌ invisível | ❌ | ❌ | ❌ |
| Contagem visível | ❌ | ❌ | ❌ | ❌ |
| Modelo | DeepSeek V4 | DeepSeek V4 | DeepSeek + Qwen | DeepSeek + Qwen |
| Export .sgm | ✅ | ✅ | ✅ | ✅ |
| Marca personalizada | ❌ | ❌ | ✅ | ✅ |

## Regras de Sessão

- Frequência Premium: **Dia sim, dia não**
- Mensagens/sessão: **Até 50**
- Alerta: **Nunca mostrar contagens, tokens, minutos ou mensagens**
- Fim da sessão: **Texto humano, sem linguagem comercial**
- Extra: **R$20, oferta humana, paciente paga direto**

## Textos Humanos (Fim de Sessão)

**Fim natural:**
> "Pedro, nosso tempo de hoje chegou ao fim. Foi muito bom conversar com você. Temos duas opções: podemos continuar na nossa próxima sessão de [dia], ou se você sentir que precisa de mais espaço agora, posso liberar uma sessão extra para continuarmos. O que faz mais sentido para você?"

**Ao tentar enviar mensagem depois do limite:**
> "Guarda essa ideia para a nossa próxima conversa. Ela vai ser um ótimo ponto de partida."

**Check-in entre sessões:**
> "Oi! Como você está? Passou por algo desde nossa última conversa que queira compartilhar?"

## Fases de Implementação

### Fase 1: Worker de API + Controle de Sessão (~40h)
1.1 Criar Cloudflare Worker em `worker/index.js`
1.2 Migrar lógica de proxy da Pages Function para o Worker (rota `/api/proxy`)
1.3 Roteamento OpenRouter com chave mestra
1.4 Controle de sessão no KV
1.5 Regra "dia sim, dia não"
1.6 Limite de 50 mensagens
1.7 Texto humano de fim de sessão (sem contagens)
1.8 Sessão extra (R$20)
1.9 Flag `?dev=true` para BYOK
1.10 Testar + deploy

### Fase 2: Google OAuth + PIN + .sgm Criptografado (~30h)
2.1 Criar Google OAuth Client ID
2.2 Botão "Entrar com Google"
2.3 Worker: validar token, buscar/criar usuário no KV
2.4 Fluxo sessão grátis → cadastro
2.5 PIN opcional
2.6 Web Crypto API: AES-256-GCM + PBKDF2
2.7 Re-download criptografado
2.8 Hash SHA-256 do email no .sgm + validação no import

### Fase 3: Stripe — Assinaturas + Sessão Extra (~25h)
3.1 Produtos no Stripe: Premium, WL Essential, WL Pro
3.2 Webhook Stripe no Worker
3.3 Frontend: tela de planos + Stripe Checkout
3.4 Worker: atualizar KV após pagamento
3.5 Sessão extra R$20 (Stripe Payment Link)
3.6 Reset mensal da contagem
3.7 Bloqueio por falta de pagamento (7 dias tolerância, 90 dias dados)

### Fase 4: White Label — Dashboard + Email + PDF (~50h)
4.1 Dashboard psicólogo (listar pacientes, ver sessões)
4.2 CRUD pacientes no KV
4.3 Link personalizado
4.4 Gerar PDF
4.5 Email automático após sessão (transcrição + PDF)
4.6 Marca personalizada (logo, cor)
4.7 Limite de pacientes (30/60)
4.8 Tela do paciente no WL

### Fase 5: .sgm Auto-Download + Fim de Sessão Humano (~15h)
5.1 Detectar fim de sessão
5.2 Download automático do .sgm
5.3 Armazenar último .sgm criptografado
5.4 Textos humanos de fim de sessão
5.5 Texto oferta de sessão extra
5.6 Texto abertura próxima sessão

### Fase 6: Onboarding + Polimento UX (~30h)
6.1 Onboarding pós-1ª sessão
6.2 Tela de cadastro integrada
6.3 Notificação diária
6.4 Check-in entre sessões
6.5 Barra sutil de progresso
6.6 Modo noturno automático
6.7 Botão crise visível
6.8 Tela de configurações
6.9 Responsivo mobile
6.10 Teste de usabilidade

## Cronograma (20h/semana)

| Semana | Fase | Entrega |
|--------|------|---------|
| 1-2 | Fase 1 | Worker no ar, sessão controlada |
| 3-4 | Fase 2 | Login + PIN + .sgm criptografado |
| 5 | Fase 3 | Stripe pagando |
| 6-7 | Fase 4 | White Label operacional |
| 8 | Fase 5 | Auto-download + textos humanos |
| 9-10 | Fase 6 | Onboarding + UX final |
| Semana 10 | ✅ | Lançamento |

## Projeção Financeira (Ano 1)

| Mês | Faturamento | Custo API | Stripe | Lucro |
|-----|------------|-----------|--------|-------|
| 1 | R$391 | R$2 | R$20 | R$370 |
| 3 | R$2.054 | R$10 | R$95 | R$1.961 |
| 6 | R$7.426 | R$42 | R$340 | R$7.097 |
| 9 | R$18.964 | R$108 | R$865 | R$18.176 |
| 12 | R$39.140 | R$200 | R$1.780 | R$37.340 |
| **Ano 1** | **~R$159.000** | **~R$870** | **~R$7.200** | **~R$150.000** |

## Riscos

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| DeepSeek sair do ar | Média | Médio | Fallback Qwen → GLM |
| OpenRouter instável | Baixa | Alto | Fallback API direta |
| Stripe chargeback | Baixa | Médio | 3DS + Stripe Radar |
| Sanções modelo chinês | Muito baixa | Alto | GPT-4o-mini como fallback secreto |
| Usuário criar N contas | Alta | Baixo | Anamnese de 20min em cada conta = inviável |
