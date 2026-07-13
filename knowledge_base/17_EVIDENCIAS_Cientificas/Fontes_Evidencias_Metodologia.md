# Fontes de Evidência e Metodologia Científica

## 1. Definição

Medicina Baseada em Evidências (MBE/EBM) é a integração da melhor evidência científica disponível com a experiência clínica individual e as preferências do paciente na tomada de decisões sobre o cuidado em saúde (Sackett et al., 1996, *BMJ*, PMID: 8573266). Em saúde mental, a MBE fornece o arcabouço metodológico para avaliar criticamente a literatura científica, hierarquizar a qualidade dos estudos e aplicar as conclusões à prática clínica de forma racional e transparente.

Este documento apresenta uma revisão sistemática da metodologia científica aplicada à psiquiatria, incluindo: tipos de estudo, hierarquia da evidência, sistema GRADE, instrumentos de avaliação crítica, estratégias de busca em bases de dados e as principais fontes de evidência em saúde mental.

## 2. Introdução

A psiquiatria baseada em evidências enfrenta desafios específicos: (a) predomínio de sintomas subjetivos sem biomarcadores; (b) alta comorbidade que contamina amostras; (c) efeito placebo significativo em transtornos mentais (30–50% em TDM); (d) dificuldade de cegamento adequado devido a efeitos adversos evidentes; (e) heterogeneidade dos transtornos (diferentes subtipos, trajetórias e respostas ao tratamento).

A despeito dessas limitações, o avanço metodológico das últimas décadas — revisões sistemáticas, meta-análises em rede, ensaios clínicos pragmáticos, análises de mediação e modelagem causal — tem progressivamente refinado a evidência em psiquiatria. Grandes consórcios como o Cochrane Collaboration, o STARD (Standards for Reporting Diagnostic Accuracy), o CONSORT (Consolidated Standards of Reporting Trials), o PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) e o GRADE Working Group estabeleceram padrões rigorosos para a produção e comunicação da evidência científica.

## 3. Tipos de Estudo em Pesquisa Clínica

### 3.1 Revisão Sistemática

**Definição**: Síntese rigorosa e reprodutível de toda a evidência disponível sobre uma questão de pesquisa específica, utilizando métodos explícitos para identificar, selecionar, avaliar criticamente e extrair dados dos estudos primários.

**Características**:
- Pergunta de pesquisa claramente definida (PICO)
- Estratégia de busca abrangente (múltiplas bases de dados)
- Critérios de inclusão/exclusão pré-especificados
- Avaliação da qualidade/risco de viés dos estudos incluídos
- Síntese qualitativa e/ou quantitativa (meta-análise)
- Análise de heterogeneidade e viés de publicação

**Aplicação em psiquiatria**: Revisões sistemáticas Cochrane sobre intervenções farmacológicas e psicossociais; revisões sistemáticas de diagnóstico (acurácia de escalas, biomarcadores).

**Nível de evidência**: 1 (Oxford CEBM); Alta (GRADE).

### 3.2 Meta-Análise

**Definição**: Método estatístico para combinar quantitativamente os resultados de estudos independentes, produzindo uma estimativa única do efeito com maior poder e precisão.

**Métodos estatísticos principais**:
- **Efeito fixo**: Assume que todos os estudos compartilham o mesmo efeito verdadeiro
- **Efeito aleatório**: Assume que os efeitos verdadeiros variam entre estudos (DerSimonian & Laird)
- **Meta-análise em rede (NMA)**: Compara múltiplas intervenções simultaneamente, combinando evidência direta e indireta

**Medidas de efeito comuns**:
- Razão de chances (OR), Risco relativo (RR), Diferença de risco (RD)
- Diferença média padronizada (SMD/Cohen's d) — escalas diferentes
- Diferença média (MD) — mesma escala
- Número necessário para tratar (NNT) = 1 / diferença de risco

**Heterogeneidade**:
- I²: percentual da variabilidade entre estudos devido a heterogeneidade real (não ao acaso)
  - Baixa: I² < 25%
  - Moderada: I² = 25–50%
  - Alta: I² > 50%

**Viés de publicação**:
- Funnel plot (gráfico de funil): assimetria sugere viés de publicação
- Teste de Egger: regressão linear para assimetria do funnel plot
- Trim-and-fill: método para ajustar para estudos faltantes

**Aplicação em psiquiatria**: Meta-análises de eficácia de antidepressivos (Cipriani et al., 2018, *Lancet*, PMID: 29477251); meta-análise em rede de antipsicóticos (Leucht et al., 2013, *Lancet*, PMID: 23810019).

**Nível de evidência**: 1a (Oxford CEBM); Alta (GRADE, se limitações mínimas).

### 3.3 Ensaio Clínico Randomizado (ECR/RCT)

**Definição**: Estudo prospectivo no qual participantes são alocados aleatoriamente a dois ou mais grupos (intervenção vs. controle) para comparar seus efeitos.

**Tipos de ECR em psiquiatria**:
| Tipo | Característica | Exemplo |
|---|---|---|
| Explicativo (efficacy) | Condições ideais, amostra homogênea | ECR fase III de novo AP |
| Pragmático (effectiveness) | Condições reais, amostra heterogênea | STAR*D, CATIE, STEP-BD |
| Superioridade | Testa se A > B | Fluoxetina > placebo |
| Não inferioridade | Testa se A não é pior que B | Genérico vs. referência |
| Equivalência | Testa se A = B | Raro em psiquiatria |
| Crossover | Mesmo paciente recebe ambas intervenções sequencialmente | Comparação estimulantes TDAH |
| Cluster | Randomização por grupo (não indivíduo) | Intervenção em escola |
| Fatorial | Testa duas intervenções simultaneamente | CAMS (TCC + sertralina) |

**Componentes essenciais para qualidade** (CONSORT):
- Randomização adequada (sequência imprevisível)
- Alocação oculta (concealment)
- Cegamento (paciente, terapeuta, avaliador)
- Análise por intenção-de-tratar (ITT)
- Perda de seguimento < 20%
- Registro prévio do protocolo (ClinicalTrials.gov, REBEC)
- Cálculo de tamanho amostral

**Desfechos em psiquiatria**:
- Resposta: redução ≥50% na escala de gravidade
- Remissão: escore abaixo de um limiar pré-definido
- Recuperação: remissão sustentada + funcionalidade
- Recaída: retorno de sintomas após remissão
- Tempo até evento (recaída, hospitalização)

**Nível de evidência**: 2 (Oxford CEBM); Alta–Moderada (GRADE).

### 3.4 Estudo de Coorte

**Definição**: Estudo observacional longitudinal que acompanha um grupo de indivíduos ao longo do tempo, comparando aqueles expostos vs. não expostos a um fator de risco ou intervenção.

**Tipos**:
- **Prospectivo**: Recruta no presente, acompanha para o futuro
- **Retrospectivo**: Usa dados já coletados (históricos)

**Aplicação em psiquiatria**:
- Fatores de risco para transtornos mentais (coortes de nascimento: Dunedin, ALSPAC, Pelotas)
- Prognóstico (trajetórias de transtornos ao longo da vida)
- Efeitos adversos tardios de medicações

**Principais coortes em psiquiatria**:
| Coorte | País | N | Seguimento |
|---|---|---|---|
| Dunedin Multidisciplinary Health and Development Study | NZ | 1.037 | Nascimento até 45 anos |
| ALSPAC (Avon Longitudinal Study) | UK | 14.000 | Nascimento até 30 anos |
| Coorte de Pelotas (1993) | Brasil | 5.249 | Nascimento até 30 anos |
| NESDA (Netherlands Study of Depression and Anxiety) | Holanda | 2.981 | 15 anos |
| CATIE (Clinical Antipsychotic Trials) | EUA | 1.493 | 18 meses |
| STEP-BD (Systematic Treatment Enhancement Program for BD) | EUA | 4.360 | 5 anos |

**Nível de evidência**: 3 (Oxford CEBM); Baixa–Moderada (GRADE, depende de qualidade).

### 3.5 Estudo Caso-Controle

**Definição**: Estudo observacional retrospectivo que compara indivíduos com um desfecho (casos) a indivíduos sem o desfecho (controles), investigando exposições passadas.

**Aplicação em psiquiatria**:
- Fatores de risco raros (ex.: transtorno psicótico após uso de cannabis)
- Efeitos adversos raros (ex.: agranulocitose com clozapina)
- Associações genéticas (GWAS caso-controle)

**Medida de efeito**: Odds Ratio (OR)

**Nível de evidência**: 4 (Oxford CEBM); Baixa–Muito Baixa (GRADE).

### 3.6 Estudo Transversal (Cross-Sectional)

**Definição**: Estudo observacional que avalia exposição e desfecho simultaneamente em um único ponto no tempo.

**Aplicação em psiquiatria**:
- Prevalência de transtornos mentais (pesquisas epidemiológicas)
- Validação de instrumentos diagnósticos
- Associações entre sintomas e variáveis clínicas

**Limitação**: Não estabelece temporalidade (causa vs. efeito).

**Nível de evidência**: 5 (Oxford CEBM); Muito Baixa (GRADE).

## 4. Hierarquia da Evidência

### 4.1 Pirâmide da Evidência (Oxford CEBM, 2011)

```
                                 /\
                                /  \
                               /    \
                              / MA  \
                             /______\
                            /  RS    \
                           /__________\
                          /    ECR     \
                         /______________\
                        /   Coorte       \
                       /__________________\
                      /  Caso-Controle      \
                     /________________________\
                    /   Série de Casos          \
                   /______________________________\
                  / Editorial / Opinião / Consenso  \
                 /____________________________________\
                /         Pesquisa Animal              \
               /________________________________________\
              /        Estudos in vitro                  \
             /____________________________________________\
```

Legenda:
- MA: Meta-Análise
- RS: Revisão Sistemática
- ECR: Ensaio Clínico Randomizado

### 4.2 Onde a Psiquiatria se Situa na Pirâmide

A psiquiatria, por suas limitações metodológicas específicas, frequentemente produz evidência de níveis mais baixos na pirâmide:

| Tipo de Intervenção | Nível de Evidência Típico | Exemplo |
|---|---|---|
| Farmacoterapia (ECRs bem conduzidos) | 1–2 (Alta) | ISRS vs. placebo em TDM |
| Psicoterapia (ECRs, mas difícil cegamento) | 2–3 (Moderada) | TCC vs. placebo psicológico |
| Neuroestimulação (sham difícil) | 2–3 (Moderada) | rTMS vs. sham |
| Diagnóstico (sem padrão-ouro biológico) | 3–4 (Baixa) | Acurácia de escalas |
| Prognóstico (coortes longas) | 3 (Moderada) | Curso do TB |
| Intervenções psicossociais complexas | 3–4 (Baixa) | Emprego apoiado |
| Populações especiais (gestantes, crianças) | 3–4 (Baixa) | ADT na gestação |

## 5. Sistema GRADE

### 5.1 Estrutura

O GRADE (Grading of Recommendations, Assessment, Development and Evaluations) é atualmente o sistema mais utilizado internacionalmente para classificar a qualidade da evidência e a força das recomendações. Adotado por WHO, Cochrane, NICE, APA e mais de 110 organizações.

**Qualidade da Evidência**:
| Nível | Definição |
|---|---|
| Alta | Muito confiante: o efeito estimado está próximo do verdadeiro |
| Moderada | Confiança moderada: o verdadeiro efeito provavelmente está próximo |
| Baixa | Confiança limitada: o verdadeiro efeito pode ser substancialmente diferente |
| Muito Baixa | Muito pouca confiança na estimativa |

**Fatores que reduzem a qualidade**:
1. **Risco de viés** (limitações metodológicas)
2. **Inconsistência** (heterogeneidade não explicada)
3. **Evidência indireta** (população, intervenção, desfecho diferentes)
4. **Imprecisão** (intervalos de confiança largos)
5. **Viés de publicação** (estudos negativos não publicados)

**Fatores que podem aumentar a qualidade** (estudos observacionais):
1. **Magnitude do efeito** (OR > 2 ou < 0,5)
2. **Gradiente dose-resposta**
3. **Confundidores residuais que reduziriam o efeito observado**

### 5.2 Força da Recomendação

| Força | Significado para o paciente | Significado para o clínico |
|---|---|---|
| **Forte a favor** | A maioria aceitaria; poucos recusariam | A maioria dos pacientes deve receber |
| **Condicional a favor** | A maioria aceitaria, mas muitos não | Diferentes escolhas são apropriadas para diferentes pacientes |
| **Condicional contra** | A maioria recusaria | Não oferecer como rotina |
| **Forte contra** | Quase todos recusariam | Não oferecer |

### 5.3 GRADE em Psiquiatria

Aplicação do GRADE a intervenções em saúde mental:
- **Alta**: Raro em psiquiatria (exige múltiplos ECRs grandes com baixo risco de viés)
- **Moderada**: Mais comum (ex.: ISRS para TDM, AP para esquizofrenia)
- **Baixa**: Frequente (psicoterapia, neuroestimulação, intervenções em populações especiais)
- **Muito baixa**: Comum para questões diagnósticas e prognósticas

## 6. Instrumentos de Avaliação Crítica

### 6.1 CASP (Critical Appraisal Skills Programme)

Checklists para avaliação crítica de:
- **ECR**: 11 perguntas (viés, resultado, aplicabilidade)
- **Revisão Sistemática**: 10 perguntas
- **Estudo de Coorte**: 12 perguntas
- **Caso-Controle**: 11 perguntas
- **Estudo Diagnóstico**: 12 perguntas
- **Estudo Qualitativo**: 10 perguntas

Exemplo (ECR — perguntas principais):
1. A pergunta foi claramente focada?
2. A randomização foi adequada?
3. Todos os participantes foram contabilizados no final?
4. O cegamento foi adequado?
5. Os grupos eram similares no início?
6. Os grupos foram tratados igualmente?

### 6.2 AMSTAR-2 (Assessing the Methodological Quality of Systematic Reviews)

AMSTAR-2 é o instrumento mais utilizado para avaliar revisões sistemáticas de intervenções em saúde. Contém 16 itens, dos quais 7 são críticos.

**Itens críticos do AMSTAR-2**:
1. Protocolo registrado antes da condução da RS
2. Estratégia de busca adequada e abrangente
3. Justificativa para exclusão de estudos individuais
4. Avaliação de risco de viés dos estudos incluídos
5. Métodos meta-analíticos apropriados
6. Consideração do risco de viés na interpretação
7. Avaliação de viés de publicação

**Classificação AMSTAR-2**:
| Nível | Definição |
|---|---|
| Alta | 0–1 falha não crítica |
| Moderada | >1 falha não crítica |
| Baixa | 1 falha crítica (± falhas não críticas) |
| Criticamente baixa | >1 falha crítica (± falhas não críticas) |

**Aplicação em psiquiatria**: Cochrane Reviews em psiquiatria geralmente pontuam Alta ou Moderada no AMSTAR-2.

### 6.3 CONSORT (Consolidated Standards of Reporting Trials)

CONSORT é uma declaração de 25 itens para relato de ECRs. Não é instrumento de avaliação de qualidade per se, mas checklist para garantir transparência no relato.

**Itens-chave CONSORT**:
- Título e resumo estruturado
- Introdução: fundamentação e objetivos
- Métodos: desenho, participantes, intervenções, desfechos, tamanho amostral, randomização, alocação oculta, cegamento, análise estatística
- Resultados: fluxo dos participantes, dados basais, desfechos, danos
- Discussão: limitações, generalização, interpretação

**Extensões CONSORT**:
- CONSORT para cluster RCTs
- CONSORT para non-inferiority
- CONSORT para pragmatic trials
- CONSORT para N-of-1 trials
- CONSORT para outcomes (COS — Core Outcome Sets)

### 6.4 PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses)

PRISMA (2020) estabelece 27 itens para relato de revisões sistemáticas, acompanhados de fluxograma.

**Fluxograma PRISMA**:
```
Registros identificados nas bases de dados (n = X)
        |
        v
Registros após remoção de duplicatas (n = X)
        |
        v
Registros rastreados (n = X) → Excluídos (n = X)
        |
        v
Artigos completos avaliados (n = X) → Excluídos com justificativa (n = X)
        |
        v
Estudos incluídos na síntese qualitativa (n = X)
        |
        v
Estudos incluídos na síntese quantitativa (n = X)
```

### 6.5 STROBE (Strengthening the Reporting of Observational Studies in Epidemiology)

Checklist de 22 itens para relato de estudos observacionais (coorte, caso-controle, transversal).

**Itens-chave STROBE**:
- Título e resumo (desenho do estudo)
- Métodos: participantes, variáveis, fontes de dados, vieses, tamanho amostral
- Resultados: descritivos, desfecho, resultados principais, análises adicionais
- Discussão: limitações, interpretação, generalização

### 6.6 Outros Checklists Relevantes

| Instrumento | Alvo | Itens |
|---|---|---|
| QUADAS-2 | Estudos de acurácia diagnóstica | 4 domínios |
| ROBINS-I | Estudos não randomizados (risco de viés) | 7 domínios |
| ROBIS | Risco de viés em revisões sistemáticas | 4 fases |
| AGREE II | Qualidade de diretrizes clínicas | 23 itens + 2 avaliações globais |
| MINORS | Estudos não randomizados | 12 itens |
| Joanna Briggs Institute | Todos os tipos de estudo | Checklist específico |

## 7. PubMed e Estratégia de Busca

### 7.1 PubMed: Estrutura

PubMed é a base de dados da National Library of Medicine (NLM/EUA), com mais de 35 milhões de citações da literatura biomédica, incluindo MEDLINE.

**Componentes**:
- **MEDLINE**: subconjunto indexado com termos MeSH (Medical Subject Headings)
- **PubMed Central (PMC)**: artigos completos em acesso aberto
- **Bookshelf**: livros e documentos

### 7.2 Termos MeSH em Psiquiatria

Exemplos de termos MeSH relevantes:
- "Depressive Disorder, Major"
- "Bipolar Disorder"
- "Schizophrenia"
- "Anxiety Disorders"
- "Attention Deficit Disorder with Hyperactivity"
- "Antidepressive Agents"
- "Antipsychotic Agents"
- "Psychotherapy"
- "Cognitive Behavioral Therapy"
- "Randomized Controlled Trial" [Publication Type]
- "Meta-Analysis" [Publication Type]
- "Systematic Review" [Publication Type]

### 7.3 Estratégia de Busca PubMed (PICO)

**Estrutura PICO**:
- **P**opulation: pacientes com transtorno específico
- **I**ntervention: tratamento ou teste diagnóstico
- **C**omparison: placebo, outro tratamento, padrão-ouro
- **O**utcome: resposta, remissão, acurácia

**Exemplo: ISRS para TDM em adultos**
```
("Depressive Disorder, Major"[MeSH] OR "major depressive disorder"[tiab])
AND
("Selective Serotonin Reuptake Inhibitors"[MeSH] OR "SSRI"[tiab] OR "escitalopram"[tiab])
AND
("Randomized Controlled Trial"[pt] OR "Meta-Analysis"[pt])
AND
("adult"[MeSH])
```

**Filtros úteis**:
- Clinical Trial, Randomized Controlled Trial, Meta-Analysis, Systematic Review
- Humans, English/Portuguese/Spanish
- Publication date (últimos 5, 10 anos)
- Age groups (adult, child, adolescent, aged)

### 7.4 Operadores Booleanos

| Operador | Função | Exemplo |
|---|---|---|
| AND | Interseção | depression AND treatment |
| OR | União | escitalopram OR sertraline |
| NOT | Exclusão | schizophrenia NOT schizoaffective |
| [tiab] | Palavra no título/resumo | "bipolar"[tiab] |
| [MeSH] | Termo indexado | "Bipolar Disorder"[MeSH] |
| " " | Frase exata | "treatment resistant depression" |
| * | Truncamento | antidepres* → antidepressant, antidepressants |

### 7.5 PubMed Clinical Queries

Acesso rápido a buscas filtradas por categoria:
- **Therapy**: ECRs, revisões sistemáticas
- **Diagnosis**: Estudos de acurácia diagnóstica
- **Prognosis**: Coortes
- **Etiology**: Coortes, caso-controle

### 7.6 Estratégias para Revisão Sistemática

Para uma RS, a estratégia de busca deve:
1. Identificar termos MeSH + sinônimos + palavras-chave
2. Buscar em múltiplas bases (PubMed, EMBASE, PsycINFO, Cochrane, Web of Science)
3. Incluir literatura cinzenta (teses, anais de congressos)
4. Verificar referências de artigos-chave (snowballing)
5. Consultar especialistas da área
6. Documentar a estratégia completa (para reprodutibilidade)

## 8. Cochrane Library

### 8.1 Estrutura

A Cochrane Library é a principal fonte de revisões sistemáticas em saúde, composta por:

| Base | Conteúdo |
|---|---|
| Cochrane Database of Systematic Reviews (CDSR) | Revisões Cochrane completas |
| CENTRAL | Registro de ECRs (maior do mundo) |
| Cochrane Clinical Answers | Resumos para prática clínica |
| Cochrane Methodology Register | Estudos metodológicos |

### 8.2 Cochrane em Psiquiatria

O Cochrane Mental Health Group publica revisões em:
- Transtornos depressivos
- Transtorno bipolar
- Esquizofrenia
- Ansiedade
- TDAH
- Demência
- Psicoterapia
- Neuroestimulação

**Exemplos de revisões-chave**:
- Cipriani et al. (2018). Comparative efficacy and acceptability of 21 antidepressants. *Cochrane Database of Systematic Reviews*. Atualizada como *Lancet* (2018) e *Lancet* (2022).
- Leucht et al. (2013). Comparative efficacy and tolerability of 15 antipsychotics. *Cochrane Database of Systematic Reviews*.
- Cuijpers et al. (2020). Psychological treatment of depression. *Cochrane Database of Systematic Reviews*.

### 8.3 Como Usar a Cochrane

1. **Busca simples** por termo ou condição
2. **Busca avançada** com MeSH e operadores booleanos
3. **Navegação por tópico** (Mental Health)
4. **Cochrane Clinical Answers** → recomendações concisas

**Vantagens**:
- Metodologia rigorosa (protocolo registrado, revisão por pares)
- Atualizações periódicas
- Análise GRADE incluída
- Resumos em linguagem leiga
- Acesso aberto em muitos países (incluindo Brasil via BIREME)

## 9. Principais Periódicos em Psiquiatria

### 9.1 Periódicos de Alto Impacto

| Periódico | Fator de Impacto (2024) | Foco |
|---|---|---|
| *World Psychiatry* | 60,5 | Revisões, diretrizes, pesquisas globais |
| *JAMA Psychiatry* | 25,8 | Pesquisa original, meta-análises |
| *The Lancet Psychiatry* | 24,3 | Pesquisa original, comentários |
| *Nature Mental Health* | — (novo) | Neurociência, saúde mental |
| *American Journal of Psychiatry* | 17,7 | Pesquisa original, revisões |
| *Molecular Psychiatry* | 11,0 | Psiquiatria molecular e biológica |
| *Schizophrenia Bulletin* | 7,6 | Esquizofrenia |
| *Biological Psychiatry* | 10,6 | Neurociência, psicofarmacologia |
| *British Journal of Psychiatry* | 9,8 | Pesquisa geral em psiquiatria |
| *Psychological Medicine* | 6,9 | Epidemiologia, cognição |
| *Journal of Clinical Psychiatry* | 6,2 | Prática clínica |
| *Journal of Affective Disorders* | 6,4 | Transtornos do humor |
| *Bipolar Disorders* | 5,6 | Transtorno bipolar |
| *Journal of Child Psychology and Psychiatry* | 6,2 | Psiquiatria infantil |
| *Depression and Anxiety* | 5,5 | Transtornos internalizantes |

### 9.2 Diretrizes para Leitura Crítica

**Ao ler um artigo, avaliar**:

1. **Validade interna**:
   - O desenho responde à pergunta?
   - Houve randomização adequada (ECR)?
   - O cegamento foi mantido?
   - A perda de seguimento foi aceitável?
   - A análise foi por intenção-de-tratar?

2. **Magnitude do efeito**:
   - Qual o tamanho do efeito (d de Cohen, OR, RR)?
   - Qual a precisão (IC 95%)?
   - Qual o NNT/NNH?

3. **Aplicabilidade**:
   - Os participantes são similares aos meus pacientes?
   - O desfecho é clinicamente relevante?
   - A intervenção está disponível no meu contexto?
   - Os benefícios superam os riscos e custos?

4. **Conflitos de interesse**:
   - Houve financiamento da indústria?
   - Os autores declararam conflitos?
   - O estudo foi registrado prospectivamente?

### 9.3 Onde Encontrar Evidência em Psiquiatria

| Recurso | Acesso | Conteúdo |
|---|---|---|
| PubMed | Gratuito | 35M+ citações |
| Cochrane Library | Acesso restrito (parcial gratuito) | RS, ECRs |
| PsycINFO (APA) | Acesso restrito | Literatura psicológica |
| EMBASE | Acesso restrito | Literatura biomédica |
| SciELO | Gratuito | Literatura latino-americana |
| Lilacs (BIREME) | Gratuito | Literatura latino-americana |
| ClinicalTrials.gov | Gratuito | Registro de ECRs |
| WHO ICTRP | Gratuito | Registro internacional de ECRs |
| Google Scholar | Gratuito | Ampla cobertura |
| Trip Database | Gratuito | Busca em múltiplas fontes |

## 10. Aplicações Clínicas

### 10.1 Como Incorporar a MBE na Prática Clínica

Passos (Sackett et al., 2000):
1. **Converter a necessidade de informação em uma pergunta respondível** (PICO)
2. **Buscar a melhor evidência** (PubMed, Cochrane, diretrizes)
3. **Avaliar criticamente a evidência** (validade, impacto, aplicabilidade)
4. **Integrar a evidência com a experiência clínica e preferências do paciente**
5. **Avaliar o processo** (efetividade, eficiência)

### 10.2 Exemplo Prático: Paciente com TDM Resistente

**Pergunta PICO**: Em adultos com TDM que não responderam a 2 ISRS, o uso de augmentação com aripiprazol comparado a placebo melhora a taxa de resposta em 8 semanas?

**Busca**:
- PubMed: ("Depressive Disorder, Major"[MeSH] OR "treatment-resistant depression"[tiab]) AND ("aripiprazole"[MeSH] OR "aripiprazole"[tiab]) AND ("augmentation"[tiab] OR "adjunctive"[tiab]) AND (randomized controlled trial[pt])
- Cochrane Library: "aripiprazole for treatment-resistant depression"

**Avaliação Crítica** (CASP):
- ECR duplo-cego, multicêntrico
- Randomização adequada
- Perda < 15%
- ITT
- NNT = 5 (benefício clínico significativo)
- IC 95%: 3–10

**Aplicação**: Paciente de 42 anos, TDM, falhou sertralina e escitalopram. Evidência suporta augmentação com aripiprazol 2–10 mg/dia (GRADE: Moderada). Discutir com paciente benefícios (NNT 5) e riscos (ganho de peso, acatisia).

### 10.3 Armadilhas Comuns

1. **Viés de confirmação**: Buscar apenas evidência que confirma a crença prévia
2. **Viés de disponibilidade**: Usar o que vem à mente (estudo recente, famoso)
3. **Viés de publicação**: Acreditar que a literatura publicada representa toda a evidência
4. **Extrapolação indevida**: Aplicar resultados de ECRs a populações diferentes
5. **P-hacking**: Interpretar significância estatística como significância clínica
6. **Surrogate outcomes**: Desfechos substitutos (ex.: redução de escala) nem sempre equivalem a desfechos clínicos (ex.: funcionalidade)
7. **Efeito pastor**: Seguir a maioria sem avaliar criticamente

## 11. Controvérsias em MBE

### 11.1 Limitações do ECR em Psiquiatria

- **Representatividade**: ECRs frequentemente excluem pacientes com comorbidades, risco de suicídio, TUS, gestantes — justamente os pacientes mais complexos da prática clínica
- **Cegamento**: Efeitos adversos evidentes (boca seca com ADT, sedação com AP) quebram cegamento
- **Placebo**: Altas taxas de resposta placebo (30–50% em TDM) reduzem o poder estatístico
- **Duração**: Maioria dos ECRs dura 6–12 semanas; evidência para longo prazo é escassa
- **Desfechos**: Escalas podem não capturar mudanças clinicamente significativas

**Alternativas**: ECRs pragmáticos (STAR*D, CATIE), análises de world data (dados do mundo real), séries temporais individuais (N-of-1).

### 11.2 Críticas à Hierarquia da Evidência

- **Posição tradicional**: Meta-análise e ECR são o topo da hierarquia
- **Crítica**: Algumas questões clínicas exigem outros desenhos:
  - Diagnóstico: estudos transversais com padrão-ouro
  - Prognóstico: coortes longas e bem conduzidas
  - Efeitos adversos raros: caso-controle ou coorte
  - Preferências e experiência: pesquisa qualitativa
- **Posição intermediária**: A hierarquia é útil mas deve ser flexibilizada conforme a pergunta clínica

### 11.3 MBE e Individualização

- A MBE não é "receita de bolo" — é a integração de evidência + experiência + preferências
- NNT e NNT médios não se aplicam perfeitamente a pacientes individuais
- Risco de desumanização quando a MBE é mal compreendida (evidence tyranny)
- A análise de subgrupos pode identificar quem mais se beneficia (medicina de precisão)

### 11.4 Qualidade das Meta-Análises em Psiquiatria

- Muitas meta-análises incluem estudos pequenos (baixo poder → superestimação do efeito)
- Heterogeneidade metodológica entre os estudos incluídos (diferentes escalas, doses, durações)
- Viés de publicação permanece subestimado (testes de Egger com baixo poder)
- Meta-análises em rede (NMA) têm pressupostos de transitividade e consistência nem sempre verificáveis

## 12. Perspectivas Futuras

1. **Medicina de Precisão**: Identificação de biomarcadores para predizer resposta individual (farmacogenômica, neuroimagem)
2. **Dados do Mundo Real (RWD)**: Uso de prontuários eletrônicos, registros, wearables para complementar ECRs
3. **Meta-análise Individual (IPD-MA)**: Dados individuais de pacientes permitem análises de subgrupo mais robustas
4. **Aprendizado de Máquina**: Predição de risco, identificação de subtipos, personalização
5. **Ensaios Adaptativos**: Desenhos flexíveis que ajustam braços, doses e tamanhos amostrais durante o estudo
6. **Engajamento do Paciente**: Desfechos relatados pelo paciente (PROMs), preferências, coprodução

## 13. Resumo Executivo

1. A hierarquia da evidência (Oxford CEBM) coloca meta-análises e revisões sistemáticas no topo, seguidas por ECRs, coortes, caso-controle, séries de casos e opinião de especialistas
2. O sistema GRADE classifica a qualidade da evidência em alta, moderada, baixa e muito baixa, com recomendações fortes ou condicionais
3. CASP, AMSTAR-2, CONSORT, PRISMA e STROBE são instrumentos essenciais para avaliação crítica
4. PubMed (MeSH), Cochrane Library, ClinicalTrials.gov e diretrizes internacionais são as principais fontes de evidência
5. Cochrane Mental Health Group produz as revisões sistemáticas mais rigorosas em psiquiatria
6. JAMA Psychiatry, Lancet Psychiatry, World Psychiatry e American Journal of Psychiatry são os periódicos de maior impacto
7. ECRs em psiquiatria enfrentam limitações específicas (placebo, cegamento, comorbidades) — interpretar com cautela
8. MBE integra evidência + experiência + preferências — não substitui julgamento clínico
9. Meta-análises e revisões sistemáticas são o padrão-ouro, mas estão sujeitas a vieses
10. A evidência deve ser aplicada criticamente ao contexto individual do paciente

## 14. FAQ

**P: Qual a diferença entre revisão sistemática e meta-análise?**
R: Toda meta-análise é parte de uma revisão sistemática, mas nem toda revisão sistemática inclui meta-análise (a síntese pode ser apenas qualitativa se os estudos forem muito heterogêneos).

**P: Como saber se uma meta-análise é confiável?**
R: Verificar: (1) protocolo registrado? (2) busca abrangente? (3) avaliação de risco de viés? (4) heterogeneidade explorada? (5) viés de publicação avaliado? (6) AMSTAR-2 ≥ Moderada?

**P: Qual o melhor instrumento para avaliar qualidade de ensaios clínicos?**
R: A escala de Jadad (0–5) é simples e rápida. A ferramenta de risco de viés da Cochrane (RoB 2) é a mais completa e recomendada atualmente.

**P: Quando um estudo observacional pode ser considerado evidência de alta qualidade?**
R: Quando tem grande magnitude de efeito (OR > 2), gradiente dose-resposta, confundidores controlados e consistência entre estudos (GRADE pode elevar observacionais).

**P: Como buscar evidência em português?**
R: SciELO, Lilacs (BIREME) e PubMed (filtro de idioma). As diretrizes da WHO mhGAP e alguns resumos Cochrane estão disponíveis em português.

**P: O que significa "NNT"?**
R: Number Needed to Treat — número de pacientes que precisam ser tratados para que um obtenha benefício adicional em relação ao controle. NNT menores indicam tratamento mais eficaz. NNT < 10 é considerado clinicamente relevante.

## 15. Referências

1. Sackett, D. L., Rosenberg, W. M. C., Gray, J. A. M., Haynes, R. B., & Richardson, W. S. (1996). Evidence based medicine: What it is and what it isn't. *BMJ*, 312(7023), 71–72. https://doi.org/10.1136/bmj.312.7023.71. PMID: 8573266.

2. Sackett, D. L., Straus, S. E., Richardson, W. S., Rosenberg, W., & Haynes, R. B. (2000). *Evidence-based medicine: How to practice and teach EBM* (2nd ed.). Churchill Livingstone.

3. Guyatt, G. H., Oxman, A. D., Vist, G. E., et al. (2008). GRADE: An emerging consensus on rating quality of evidence and strength of recommendations. *BMJ*, 336(7650), 924–926. https://doi.org/10.1136/bmj.39489.470347.AD. PMID: 18436948.

4. Cipriani, A., Furukawa, T. A., Salanti, G., et al. (2018). Comparative efficacy and acceptability of 21 antidepressant drugs for the acute treatment of adults with major depressive disorder: A systematic review and network meta-analysis. *The Lancet*, 391(10128), 1357–1366. https://doi.org/10.1016/S0140-6736(17)32802-7. PMID: 29477251.

5. Leucht, S., Cipriani, A., Spineli, L., et al. (2013). Comparative efficacy and tolerability of 15 antipsychotic drugs in schizophrenia: A multiple-treatments meta-analysis. *The Lancet*, 382(9896), 951–962. https://doi.org/10.1016/S0140-6736(13)60733-3. PMID: 23810019.

6. Higgins, J. P. T., Thomas, J., Chandler, J., et al. (Eds.). (2022). *Cochrane handbook for systematic reviews of interventions* (Version 6.3). Cochrane. https://training.cochrane.org/handbook

7. Moher, D., Liberati, A., Tetzlaff, J., Altman, D. G., & PRISMA Group. (2009). Preferred reporting items for systematic reviews and meta-analyses: The PRISMA statement. *BMJ*, 339, b2535. https://doi.org/10.1136/bmj.b2535. PMID: 19622551.

8. Schulz, K. F., Altman, D. G., Moher, D., & CONSORT Group. (2010). CONSORT 2010 statement: Updated guidelines for reporting parallel group randomised trials. *BMJ*, 340, c332. https://doi.org/10.1136/bmj.c332. PMID: 20332509.

9. von Elm, E., Altman, D. G., Egger, M., et al. (2007). The Strengthening the Reporting of Observational Studies in Epidemiology (STROBE) statement: Guidelines for reporting observational studies. *PLOS Medicine*, 4(10), e296. https://doi.org/10.1371/journal.pmed.0040296. PMID: 17941714.

10. Shea, B. J., Reeves, B. C., Wells, G., et al. (2017). AMSTAR 2: A critical appraisal tool for systematic reviews that include randomised or non-randomised studies of healthcare interventions, or both. *BMJ*, 358, j4008. https://doi.org/10.1136/bmj.j4008. PMID: 28935701.

11. Critical Appraisal Skills Programme. (2024). *CASP checklists*. https://casp-uk.net/casp-tools-checklists/

12. Sterne, J. A. C., Savović, J., Page, M. J., et al. (2019). RoB 2: A revised tool for assessing risk of bias in randomised trials. *BMJ*, 366, l4898. https://doi.org/10.1136/bmj.l4898. PMID: 31462531.

13. Balshem, H., Helfand, M., Schünemann, H. J., et al. (2011). GRADE guidelines: 3. Rating the quality of evidence. *Journal of Clinical Epidemiology*, 64(4), 401–406. https://doi.org/10.1016/j.jclinepi.2010.07.015. PMID: 21208779.

14. Cuijpers, P., Noma, H., Karyotaki, E., Cipriani, A., & Furukawa, T. A. (2020). Effectiveness and acceptability of cognitive behavior therapy delivery formats in adults with depression: A network meta-analysis. *JAMA Psychiatry*, 77(7), 700–707. https://doi.org/10.1001/jamapsychiatry.2020.0203. PMID: 32297999.

15. Haddaway, N. R., Page, M. J., Pritchard, C. C., & McGuinness, L. A. (2020). PRISMA2020: An R package and Shiny app for producing PRISMA 2020-compliant flow diagrams. *BMJ Evidence-Based Medicine*, 27(3), 167–172. https://doi.org/10.1136/bmjebm-2021-111706.

16. Ouzzani, M., Hammady, H., Fedorowicz, Z., & Elmagarmid, A. (2016). Rayyan — a web and mobile app for systematic reviews. *Systematic Reviews*, 5(1), 210. https://doi.org/10.1186/s13643-016-0384-4. PMID: 27919275.

17. Furukawa, T. A., Cipriani, A., Barbui, C., Brambilla, P., & Watanabe, N. (2006). Imputing response rates from means and standard deviations in meta-analyses. *International Journal of Methods in Psychiatric Research*, 15(1), 24–33. https://doi.org/10.1002/mpr.179. PMID: 17639823.

18. World Health Organization. (2023). *mhGAP intervention guide* (Version 3.0). https://www.who.int/publications/i/item/9789240085789

---

```yaml
titulo: "Fontes de Evidência e Metodologia Científica"
area: "Evidências Científicas"
especialidade: "Medicina Baseada em Evidências"
subespecialidade: "Metodologia Científica em Psiquiatria"
palavras_chave:
  - medicina baseada em evidências
  - MBE
  - EBM
  - revisão sistemática
  - meta-análise
  - ensaio clínico randomizado
  - ECR
  - GRADE
  - CASP
  - AMSTAR
  - CONSORT
  - PRISMA
  - STROBE
  - PubMed
  - Cochrane
  - JAMA Psychiatry
  - Lancet Psychiatry
  - hierarquia da evidência
  - avaliação crítica
  - viés de publicação
  - NNT
  - odds ratio
  - psiquiatria baseada em evidências
sinonimos:
  - "evidence-based medicine in psychiatry"
  - "clinical research methodology"
  - "critical appraisal in mental health"
  - "systematic review methodology"
conceitos_relacionados:
  - Pirâmide da Evidência
  - Viés de Publicação
  - Heterogeneidade
  - Intenção-de-Tratar
  - PICO
  - Sensibilidade e Especificidade
  - Risco Relativo
  - Odds Ratio
  - Número Necessário para Tratar
  - Efeito Placebo
  - Medicina de Precisão
transtornos_relacionados:
  - Todos os transtornos mentais (aplica-se à pesquisa em todos)
medicamentos_relacionados:
  - Todos (aplica-se a pesquisa farmacológica em geral)
escalas_relacionadas:
  - CGAS
  - GAF
  - PHQ-9
  - GAD-7
  - PANSS
  - HAM-D
  - MADRS
  - YMRS
  - CGI-S/CGI-I
diretrizes_utilizadas:
  - Cochrane Handbook for Systematic Reviews (2022)
  - GRADE Working Group Guidelines
  - PRISMA Statement (2020)
  - CONSORT Statement (2010)
  - STROBE Statement (2007)
  - AMSTAR-2 (2017)
  - Oxford CEBM Levels of Evidence (2011)
populacao_alvo: "Pesquisadores, clínicos, estudantes de pós-graduação, residentes de psiquiatria e psicologia"
faixa_etaria: "Adultos (18-65 anos), com exemplos para crianças/adolescentes e idosos"
nivel_evidencia_predominante: "A (Revisões sistemáticas, meta-análises, diretrizes)"
data_ultima_revisao: "2026-07-13"
versao_documento: "1.0"
fontes_principais:
  - Cochrane Database of Systematic Reviews
  - Cochrane Handbook (2022)
  - BMJ Evidence-Based Medicine
  - JAMA Psychiatry / Lancet Psychiatry
  - Oxford CEBM Levels of Evidence (2011)
  - GRADE Working Group
  - CASP UK
  - PRISMA / CONSORT / STROBE Statements
  - PubMed (NLM/NIH)
  - WHO mhGAP (2023)
  - Cipriani et al. (2018, Lancet)
  - Leucht et al. (2013, Lancet)
```
