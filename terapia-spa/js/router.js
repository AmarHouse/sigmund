const Router = {
  lastContext: [],
  lastIntent: null,

  INTENTS: {
    GREETING: 'greeting',
    DESCRIBE_SYMPTOM: 'describe_symptom',
    ANSWER_QUESTION: 'answer_question',
    ASK_QUESTION: 'ask_question',
    REPORT_PROGRESS: 'report_progress',
    CRISIS: 'crisis',
    LIFE_EVENT: 'life_event',
    RESISTANCE: 'resistance',
    REQUEST_TECHNIQUE: 'request_technique',
    GENERAL: 'general'
  },

  crisisKeywords: [
    'suicídio','suicida','me matar','morrer','quero morrer','sumir','acabar com tudo',
    'desespero','sem saída','não aguento mais','não suporto mais','crise',
    'automutilação','cortar','sangrar','preciso de ajuda','socorro'
  ],

  symptomKeywords: {
    ansiedade: ['ansiedade','ansioso','nervoso','preocupado','medo','pânico','apreensão','tensão','aflito','desesperado'],
    depressao: ['triste','deprimido','depressão','choro','vazio','sem esperança','desânimo','desmotivado','cansaço','fadiga'],
    sono: ['insônia','dormir','acordar','pesadelo','sono','insone','noite mal dormida'],
    apetite: ['apetite','comer','fome','emagrecer','engordar','alimentação'],
    concentracao: ['concentrar','foco','atenção','distraído','esquecer','memória'],
    irritabilidade: ['irritado','raiva','nervoso','paciência','explosivo','irritação'],
    somatico: ['dor','cabeça','estômago','coração','falta de ar','tontura','náusea','peito'],
    trauma: ['trauma','abuso','violência','assédio','acidente','perda','luto'],
    relacoes: ['relacionamento','casamento','família','amigo','isolado','sozinho','solidão'],
    trabalho: ['trabalho','emprego','carreira','estresse','pressão','demissão','burnout']
  },

  analyzeInput(text) {
    const lower = text.toLowerCase().trim();

    if (this.crisisKeywords.some(k => lower.includes(k))) {
      return { intent: this.INTENTS.CRISIS, urgency: 'high' };
    }

    const greetings = ['olá','oi','bom dia','boa tarde','boa noite','começar','iniciar'];
    if (greetings.some(g => lower.startsWith(g))) {
      return { intent: this.INTENTS.GREETING, urgency: 'low' };
    }

    const questions = ['o que','como','por que','quando','quem','onde','?'];
    const isQuestion = questions.some(q => lower.includes(q));

    for (const [category, keywords] of Object.entries(this.symptomKeywords)) {
      if (keywords.some(k => lower.includes(k))) {
        return {
          intent: this.INTENTS.DESCRIBE_SYMPTOM,
          symptomCategory: category,
          urgency: 'medium',
          isQuestion
        };
      }
    }

    if (lower.includes('melhor') || lower.includes('pior') || lower.includes('desde') ||
        lower.includes('semana') || lower.includes('mês') || lower.includes('dia')) {
      return { intent: this.INTENTS.ANSWER_QUESTION, urgency: 'low' };
    }

    const progress = ['estou bem','melhor','evoluindo','consegui','fiz','tentei','pratiquei'];
    if (progress.some(p => lower.includes(p))) {
      return { intent: this.INTENTS.REPORT_PROGRESS, urgency: 'low' };
    }

    if (isQuestion) {
      return { intent: this.INTENTS.ASK_QUESTION, urgency: 'low' };
    }

    if (lower.includes('não sei') || lower.includes('difícil') || lower.includes('não quero')) {
      return { intent: this.INTENTS.RESISTANCE, urgency: 'low' };
    }

    const event = ['casou','nasceu','morreu','mudou','terminou','começou','perdeu','ganhou'];
    if (event.some(e => lower.includes(e))) {
      return { intent: this.INTENTS.LIFE_EVENT, urgency: 'low' };
    }

    if (lower.includes('exercício') || lower.includes('técnica') || lower.includes('como fazer') ||
        lower.includes('dica') || lower.includes('estratégia')) {
      return { intent: this.INTENTS.REQUEST_TECHNIQUE, urgency: 'low' };
    }

    return { intent: this.INTENTS.GENERAL, urgency: 'low' };
  },

  determineKB(analysis, history) {
    const needed = [];

    if (analysis.urgency === 'high') {
      needed.push('risco_crises', 'protocolos_emergencia');
    }

    switch (analysis.intent) {
      case this.INTENTS.GREETING:
        needed.push('eem_semiologia', 'entrevista_estrutura');
        break;

      case this.INTENTS.DESCRIBE_SYMPTOM:
        needed.push('alteracoes_psicopatologicas', 'eem_semiologia');
        switch (analysis.symptomCategory) {
          case 'ansiedade': needed.push('ansiedade_ocd_ptsd'); break;
          case 'depressao': needed.push('humor'); break;
          case 'sono': needed.push('alimentares_sono', 'estilo_vida'); break;
          case 'trauma': needed.push('ansiedade_ocd_ptsd', 'dissociativos_somaticos'); break;
          case 'somatico': needed.push('dissociativos_somaticos'); break;
          case 'relacoes': needed.push('personalidade', 'familiar_casal_positiva'); break;
          case 'trabalho': needed.push('estilo_vida'); break;
        }
        break;

      case this.INTENTS.ASK_QUESTION:
        needed.push('fontes_evidencias');
        break;

      case this.INTENTS.REPORT_PROGRESS:
        needed.push('psicoeducacao', 'estilo_vida');
        break;

      case this.INTENTS.REQUEST_TECHNIQUE:
        needed.push('tcc_act_esquema', 'dbt_emdr_fap_cft', 'mindfulness_entrevista');
        break;

      case this.INTENTS.LIFE_EVENT:
        needed.push('entrevista_areas', 'estilo_vida');
        break;

      case this.INTENTS.RESISTANCE:
        needed.push('comunicacao_habilidades', 'entrevista_areas');
        break;

      case this.INTENTS.GENERAL:
      default:
        needed.push('eem_semiologia', 'alteracoes_psicopatologicas');
        break;
    }

    const hasCrisisHistory = history.some(m =>
      m.role === 'user' && this.crisisKeywords.some(k => m.content.toLowerCase().includes(k))
    );
    if (hasCrisisHistory) needed.push('risco_crises');

    return [...new Set(needed)];
  },

  async route(text) {
    const analysis = this.analyzeInput(text);
    const history = SessionManager.getContextWindow(6);
    const kbNeeded = this.determineKB(analysis, history);

    const loaded = {};
    // KB temporariamente desativado para teste
    // for (const id of kbNeeded.slice(0, 4)) {
    //   const content = await KB.loadContent(id);
    //   if (content) loaded[id] = content.slice(0, 2000);
    // }

    this.lastIntent = analysis.intent;
    this.lastContext = kbNeeded;

    return {
      analysis,
      kbContext: loaded,
      kbIds: kbNeeded,
      promptType: analysis.intent
    };
  }
};
