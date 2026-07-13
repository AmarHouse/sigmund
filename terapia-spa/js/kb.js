const KB = {
  index: [],
  cache: {},
  loaded: false,
  basePath: '../knowledge_base',

  kbMap: [
    { id: 'fundamentos_filosofia', path: '01_Fundamentos/Filosofia_Saude_Mental.md', keywords: ['biopsicossocial','neurodiversidade','positiva','preventiva','integrativa','recovery','trauma-informed'] },
    { id: 'fundamentos_historia', path: '01_Fundamentos/Historia_Saude_Mental.md', keywords: ['história','psicologia','psiquiatria','psicanálise','escolas','tratamentos'] },
    { id: 'fundamentos_etica', path: '01_Fundamentos/Etica_Saude_Mental.md', keywords: ['ética','bioética','sigilo','consentimento','direitos','ia','limites'] },
    { id: 'neuroanatomia', path: '02_Neurociencia/Neuroanatomia_Funcional.md', keywords: ['neuroanatomia','sistema nervoso','plasticidade','límbico','amígdala','hipocampo','córtex','recompensa'] },
    { id: 'neurotransmissores', path: '02_Neurociencia/Neurotransmissores_Neurobiologia.md', keywords: ['neurotransmissor','serotonina','dopamina','noradrenalina','hpa','memória','sono','emoção','cognição'] },
    { id: 'neuroimagem_genetica', path: '02_Neurociencia/Neuroimagem_Genetica_Epigenetica.md', keywords: ['neuroimagem','fmri','genética','epigenética','dna','polimorfismo'] },
    { id: 'psiconeuroimunologia', path: '02_Neurociencia/Psiconeuroimunologia_Envelhecimento.md', keywords: ['inflamação','microbiota','citocina','envelhecimento','imune','intestino'] },
    { id: 'eem_semiologia', path: '03_Psicopatologia/Exame_Estado_Mental_Semiologia.md', keywords: ['exame estado mental','semiologia','eem','entrevista','aparência','psicomotor'] },
    { id: 'alteracoes_psicopatologicas', path: '03_Psicopatologia/Alteracoes_Psicopatologicas.md', keywords: ['consciência','atenção','memória','pensamento','humor','afeto','sensopercepção','juízo','insight','alucinação','delírio'] },
    { id: 'escolas_psicopatologia', path: '03_Psicopatologia/Escolas_Psicopatologia.md', keywords: ['fenomenológica','jaspers','kraepelin','bleuler','dinâmica','descritiva'] },
    { id: 'neurodesenvolvimento', path: '04_DSM5_TR/Transtornos_Neurodesenvolvimento.md', keywords: ['autismo','tea','tdah','deficiência intelectual','comunicação','aprendizagem'] },
    { id: 'psicoticos', path: '04_DSM5_TR/Transtornos_Psicoticos.md', keywords: ['esquizofrenia','psicose','delírio','alucinação','catatonia','esquizoafetivo'] },
    { id: 'humor', path: '04_DSM5_TR/Transtornos_Humor.md', keywords: ['depressão','bipolar','mania','humor','tristeza','ciclotimia','distimia'] },
    { id: 'ansiedade_ocd_ptsd', path: '04_DSM5_TR/Transtornos_Ansiedade_OC_TEPT.md', keywords: ['ansiedade','pânico','fobia','toc','ptsd','estresse','gad','ocd'] },
    { id: 'dissociativos_somaticos', path: '04_DSM5_TR/Transtornos_Dissociativos_Somaticos.md', keywords: ['dissociação','despersonalização','somático','hipocondria','conversão'] },
    { id: 'alimentares_sono', path: '04_DSM5_TR/Transtornos_Alimentares_Sono.md', keywords: ['anorexia','bulimia','alimentar','insônia','sono','narcolepsia'] },
    { id: 'personalidade', path: '04_DSM5_TR/Transtornos_Personalidade.md', keywords: ['personalidade','borderline','narcisista','antissocial','esquiva','obsessiva'] },
    { id: 'dependencia_quimica', path: '04_DSM5_TR/Transtornos_Dependencia_Quimica.md', keywords: ['dependência','álcool','droga','substância','vício','jogo'] },
    { id: 'neurocognitivos', path: '04_DSM5_TR/Transtornos_Neurocognitivos_Sexuais.md', keywords: ['demência','delirium','neurocognitivo','sexual','parafilia','disfunção'] },
    { id: 'impulso_facticios', path: '04_DSM5_TR/Transtornos_Impulso_Facticios.md', keywords: ['impulso','explosivo','oposição','conduta','factício'] },
    { id: 'cid11_estrutura', path: '05_CID11/CID11_Estrutura_Codificacao.md', keywords: ['cid-11','cid11','classificação','who','codificação'] },
    { id: 'comparacao_dsm_cid', path: '05_CID11/Comparacao_DSM_CID11.md', keywords: ['dsm','cid','comparação','diferença','diagnóstico'] },
    { id: 'antidepressivos', path: '06_Psiquiatria_Psicofarmacologia/Antidepressivos.md', keywords: ['antidepressivo','isrs','irsn','tricíclico','imao','bupropiona','mirtazapina','vortioxetina'] },
    { id: 'antipsicoticos', path: '06_Psiquiatria_Psicofarmacologia/Antipsicoticos.md', keywords: ['antipsicótico','haloperidol','clozapina','risperidona','olanzapina','quetiapina','aripiprazol'] },
    { id: 'estabilizadores_ansioliticos', path: '06_Psiquiatria_Psicofarmacologia/Estabilizadores_Humor_Ansioliticos.md', keywords: ['lítio','valproato','lamotrigina','estabilizador','benzodiazepínico','ansiolítico'] },
    { id: 'estimulantes_hipnoticos', path: '06_Psiquiatria_Psicofarmacologia/Estimulantes_Hipnoticos.md', keywords: ['metilfenidato','lisdexanfetamina','estimulante','hipnótico','zolpidem','sono'] },
    { id: 'algoritmos_protocolos', path: '06_Psiquiatria_Psicofarmacologia/Algoritmos_Protocolos.md', keywords: ['algoritmo','protocolo','diretriz','apa','nice','canmat','wfsbp'] },
    { id: 'tcc_act_esquema', path: '07_Psicologia_Clinica/TCC_ACT_Esquema.md', keywords: ['tcc','cognitivo','comportamental','act','aceitação','esquema','young','beck'] },
    { id: 'dbt_emdr_fap_cft', path: '07_Psicologia_Clinica/DBT_EMDR_FAP_CFT.md', keywords: ['dbt','dialética','linehan','emdr','shapiro','fap','cft','compaixão'] },
    { id: 'mindfulness_entrevista', path: '07_Psicologia_Clinica/Mindfulness_EntrevistaMotivacional_Interpessoal.md', keywords: ['mindfulness','atenção plena','entrevista motivacional','interpessoal','kabat-zinn'] },
    { id: 'familiar_casal_positiva', path: '07_Psicologia_Clinica/Terapia_Familiar_Casal_Positiva.md', keywords: ['familiar','casal','gottman','positiva','seligman','minuchin','bowen'] },
    { id: 'psicoterapia_idades', path: '07_Psicologia_Clinica/Psicoterapia_Faixas_Etarias.md', keywords: ['infantil','adolescente','idoso','criança','geriátrica','desenvolvimento'] },
    { id: 'autores_fundadores', path: '08_Psicanalise/Autores_Fundadores.md', keywords: ['freud','jung','klein','anna freud','inconsciente','pulsão','arquétipo'] },
    { id: 'autores_contemporaneos', path: '08_Psicanalise/Autores_Contemporaneos.md', keywords: ['winnicott','bion','fairbairn','kohut','lacan','holding','continente'] },
    { id: 'conceitos_psicanalise', path: '08_Psicanalise/Conceitos_Fundamentais.md', keywords: ['transferência','contratransferência','defesa','édipo','sonho','livre associação','interpretação'] },
    { id: 'apego_objeto', path: '08_Psicanalise/Teoria_Apego_ObjetoRelacional.md', keywords: ['apego','bowlby','ainsworth','mentalização','fonagy','estranho'] },
    { id: 'entrevista_estrutura', path: '09_Entrevista_Clinica/Estrutura_Entrevista_PrimeiraConsulta.md', keywords: ['primeira consulta','anamnese','rapport','entrevista','história clínica'] },
    { id: 'entrevista_areas', path: '09_Entrevista_Clinica/Areas_Especificas_Entrevista.md', keywords: ['trauma','sexualidade','violência','espiritualidade','risco','funcionalidade'] },
    { id: 'plano_terapeutico', path: '09_Entrevista_Clinica/Plano_Terapeutico_Encaminhamento.md', keywords: ['plano terapêutico','encaminhamento','alta','contrato','multidisciplinar'] },
    { id: 'escalas_depressao', path: '10_Avaliacao_Escalas/Escalas_Depressao_Ansiedade.md', keywords: ['phq-9','gad-7','ham-d','bdi','madrs','c-ssrs','escala'] },
    { id: 'escalas_especificas', path: '10_Avaliacao_Escalas/Escalas_Especificas.md', keywords: ['y-bocs','asrs','mdq','pcl-5','audit','panss','ymrs'] },
    { id: 'escalas_cognitivas', path: '10_Avaliacao_Escalas/Escalas_Cognitivas_Infantis_Geriatricas.md', keywords: ['mmse','moca','ace','cbcl','sdq','gds','geriátrica','infantil'] },
    { id: 'casos_clinicos', path: '11_Casos_Clinicos/Estrutura_Casos_Clinicos.md', keywords: ['caso clínico','caso','simulação','discussão'] },
    { id: 'infancia_adolescencia', path: '12_Populacoes_Especiais/Infancia_Adolescencia.md', keywords: ['criança','adolescente','infantil','juvenil','pediátrica'] },
    { id: 'gestantes_idosos', path: '12_Populacoes_Especiais/Gestantes_PosParto_Idosos.md', keywords: ['gestante','perinatal','pós-parto','idoso','geriátrico'] },
    { id: 'tea_tdah_di', path: '12_Populacoes_Especiais/TEA_TDAH_DI_AltasHabilidades.md', keywords: ['autismo','tea','tdah','deficiência','altas habilidades','superdotação'] },
    { id: 'lgbtqia_refugiados', path: '12_Populacoes_Especiais/LGBTQIA_Refugiados_Deficiencia.md', keywords: ['lgbtqia','refugiado','deficiência','minoria','inclusão'] },
    { id: 'risco_crises', path: '13_Emergencias_Psiquiatricas/Avaliacao_Risco_Crises.md', keywords: ['suicídio','risco','crise','urgência','violência','contenção'] },
    { id: 'protocolos_emergencia', path: '13_Emergencias_Psiquiatricas/Protocolos_Emergencia.md', keywords: ['emergência','psicose aguda','delirium','intoxicação','abstinência','internação'] },
    { id: 'estilo_vida', path: '14_Medicina_Estilo_Vida/Estilo_Vida_Saude_Mental.md', keywords: ['sono','nutrição','exercício','mediterrânea','ômega','luz solar','estresse','propósito'] },
    { id: 'comunicacao_habilidades', path: '15_Comunicacao_Terapeutica/Habilidades_Comunicacao_Terapeutica.md', keywords: ['escuta ativa','validação','empatia','cnv','comunicação não violenta'] },
    { id: 'psicoeducacao', path: '15_Comunicacao_Terapeutica/Psicoeducacao_Comunicacao.md', keywords: ['psicoeducação','spikes','comunicação','família','emoção expressa'] },
    { id: 'arvores_decisao', path: '16_Tomada_Decisao_Clinica/Arvores_Decisao_DiagnosticoDiferencial.md', keywords: ['decisão','fluxograma','diagnóstico diferencial','probabilidade','bayes'] },
    { id: 'diretrizes_internacionais', path: '17_EVIDENCIAS_Cientificas/Diretrizes_Internacionais.md', keywords: ['diretriz','guideline','apa','nice','canmat','wfsbp','who'] },
    { id: 'fontes_evidencias', path: '17_EVIDENCIAS_Cientificas/Fontes_Evidencias_Metodologia.md', keywords: ['evidência','metanálise','revisão sistemática','rct','grade','prisma'] }
  ],

  async init() {
    this.index = this.kbMap.map(k => ({ ...k, score: 0 }));
    this.loaded = true;
  },

  async loadContent(id) {
    if (this.cache[id]) return this.cache[id];
    const entry = this.index.find(k => k.id === id);
    if (!entry) return null;
    try {
      const resp = await fetch(`${this.basePath}/${entry.path}`);
      if (!resp.ok) throw new Error('Not found');
      const text = await resp.text();
      this.cache[id] = text;
      return text;
    } catch {
      return `# ${entry.id}\n\n*Conteúdo não disponível no momento. Consulte o Knowledge Base completo.*`;
    }
  },

  search(query) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/).filter(t => t.length > 2);

    const scored = this.index.map(entry => {
      let score = 0;
      const kw = entry.keywords.join(' ').toLowerCase();
      for (const term of terms) {
        if (kw.includes(term)) score += 3;
        if (entry.id.includes(term)) score += 2;
      }
      if (kw.includes(q)) score += 5;
      return { ...entry, score };
    });

    return scored
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  },

  async loadRelevant(query) {
    const results = this.search(query);
    const loaded = [];
    for (const r of results.slice(0, 3)) {
      const content = await this.loadContent(r.id);
      loaded.push({ id: r.id, title: r.path.split('/').pop().replace('.md',''), content });
    }
    return loaded;
  }
};
