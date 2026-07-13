# Árvores de Decisão e Diagnóstico Diferencial

## 1. Definição

Árvores de decisão clínica são representações estruturadas e algorítmicas do raciocínio diagnóstico e terapêutico, organizadas em nós de decisão baseados em evidências, probabilidades pré-teste e razões de verossimilhança (likelihood ratios). No contexto da saúde mental, constituem ferramentas sistemáticas para navegar a complexidade do diagnóstico diferencial — particularmente quando sintomas sobrepostos (ex.: depressão vs. bipolaridade, ansiedade vs. TDAH, psicose vs. transtorno dissociativo) exigem discriminação precisa para orientar conduta terapêutica e evitar iatrogenia (APA, 2024; NICE, 2022; Sackett et al., 2000, *BMJ*, PMID: 10653087).

O diagnóstico diferencial em psiquiatria difere fundamentalmente da medicina geral por depender exclusivamente de dados clínicos e história longitudinal, sem biomarcadores confirmatórios. Isso eleva a importância de métodos estruturados de raciocínio clínico, como árvores de decisão bayesianas, algoritmos de priorização e sistemas de red flags (First et al., 2015; Frances & First, 2019, *JAACAP*, PMID: 30768422).

## 2. Introdução

A tomada de decisão clínica em psiquiatria enfrenta desafios específicos: (a) alta sobreposição sintomática entre transtornos; (b) ausência de testes diagnósticos objetivos; (c) dependência de relato subjetivo; (d) variabilidade longitudinal dos quadros; (e) impacto de comorbidades na apresentação clínica. Estima-se que 30–50% dos diagnósticos psiquiátricos iniciais sejam revisados dentro de 5 anos (Ruggero et al., 2011, *Journal of Clinical Psychiatry*, PMID: 21535997; Heslin et al., 2016, *Acta Psychiatrica Scandinavica*, PMID: 26940957).

As árvores de decisão clínica abordam esses desafios ao:
- Explicitar nós de decisão baseados em critérios operacionais
- Incorporar probabilidades pré-teste derivadas de estudos epidemiológicos
- Utilizar razões de verossimilhança de sinais e sintomas específicos
- Estabelecer limiares de ação (test threshold, treatment threshold)
- Sistematizar a identificação de red flags (sinais de alerta para condições graves ou urgentes)

Este documento apresenta árvores de decisão para os principais diagnósticos diferenciais em psiquiatria, fundamentadas nas diretrizes da APA (2024–2025), NICE (2022–2025), CANMAT (2016–2024), WFSBP (2012–2023), AACAP (2007–2024) e WHO mhGAP (2023), integrando raciocínio bayesiano e critérios de priorização clínica.

## 3. Fundamentos do Raciocínio Diagnóstico Bayesiano

### 3.1 Probabilidades Pré-Teste (Prevalência Base)

Todo raciocínio diagnóstico começa com a probabilidade pré-teste — a prevalência estimada do transtorno na população de referência antes da aplicação de qualquer teste ou critério diagnóstico. Em psiquiatria, as probabilidades pré-teste variam conforme o contexto (atenção primária, ambulatório especializado, emergência, hospitalização).

| Transtorno | Prevalência Vida (Geral) | Ambulatório Psiquiátrico | Emergência Psiquiátrica |
|---|---|---|---|
| TDM | 15–20% | 25–40% | 15–25% |
| TB I | 0,6–1,0% | 3–8% | 8–15% |
| TB II | 0,4–1,1% | 5–12% | 3–8% |
| TAG | 5–10% | 15–25% | 8–15% |
| T. Pânico | 2–5% | 10–20% | 5–12% |
| Fobia Social | 7–13% | 10–18% | 3–8% |
| TEPT | 3–7% | 5–15% | 10–25% |
| TOC | 1–3% | 5–10% | 2–5% |
| TDAH (adulto) | 2,5–4% | 10–20% | 3–8% |
| Esquizofrenia | 0,3–0,7% | 15–25% | 20–35% |
| TP Borderline | 1–3% | 10–20% | 10–20% |

*Fontes: Kessler et al. (2005, *Archives of General Psychiatry*, PMID: 15939839); Merikangas et al. (2011, *Archives of General Psychiatry*, PMID: 21300940); WHO World Mental Health Surveys (2017, *International Journal of Methods in Psychiatric Research*, PMID: 28691762).*

### 3.2 Razões de Verossimilhança (Likelihood Ratios)

A razão de verossimilhança (LR) quantifica o quanto um achado clínico altera a probabilidade de um diagnóstico. Aplicando o Teorema de Bayes na forma odds:

- LR+ = sensibilidade / (1 − especificidade)
- LR− = (1 − sensibilidade) / especificidade

Interpretação prática (Jaeschke et al., 1994, *JAMA*, PMID: 7960279):
- LR+ > 10: alteração grande e convincente
- LR+ 5–10: alteração moderada
- LR+ 2–5: alteração pequena (às vezes importante)
- LR+ 1–2: alteração insignificante
- LR+ = 1: nenhuma alteração

**Exemplo prático: MDQ para rastreio de TB em pacientes deprimidos**
- Sensibilidade: 73%; Especificidade: 90%
- LR+ = 0,73 / 0,10 = 7,3 (alteração moderada-grande)
- LR− = 0,27 / 0,90 = 0,30

Se a probabilidade pré-teste de TB em um paciente com depressão é 10% (odds = 0,11):
- Odds pós-teste = 0,11 × 7,3 = 0,80
- Probabilidade pós-teste = 0,80 / (1 + 0,80) = 44,4%

Isso eleva a suspeita de 10% para 44%, justificando investigação aprofundada (Wang et al., 2015, *Journal of Affective Disorders*, PMID: 25306078).

### 3.3 Limiares de Decisão Clínica

O modelo de limiares de Pauker & Kassirer (1980, *NEJM*, PMID: 7366883) estabelece:
- **Limiar de teste**: probabilidade abaixo da qual se descarta o diagnóstico sem testar
- **Limiar de tratamento**: probabilidade acima da qual se trata sem testar
- **Zona de teste**: probabilidade intermediária que justifica investigação adicional

Em psiquiatria, esses limiares são influenciados por risco de iatrogenia (ex.: antidepressivos em TB não diagnosticado), gravidade das consequências do erro diagnóstico, disponibilidade e acurácia de instrumentos, e recursos do sistema de saúde.

## 4. Árvore de Decisão 1: Depressão vs. Transtorno Bipolar

Este é um dos diagnósticos diferenciais mais críticos em psiquiatria, com consequências terapêuticas diretas. Estima-se que ~40% dos pacientes com TB II recebam inicialmente diagnóstico de TDM (Ghaemi et al., 2002, *Canadian Journal of Psychiatry*, PMID: 11926077), e o uso de antidepressivos em monoterapia no TB pode induzir virada maníaca, ciclagem rápida e piora do prognóstico (Pacchiarotti et al., 2013, *American Journal of Psychiatry*, PMID: 24185201).

### 4.1 Algoritmo de Decisão

```
PACIENTE COM EPISÓDIO DEPRESSIVO ATUAL
         |
         v
[1] AVALIAR HISTÓRIA DE MANIA/HIPOMANIA
         |
         ├── Sim (mania/hipomania prévia)
         |       ├── Episódio maníaco franco → TB I
         |       ├── Episódio hipomaníaco + TDM → TB II
         |       └── Sintomas subssindrômicos + TDM ≥2 anos → Ciclotimia
         |
         └── Não → PROSSEGUIR
                  |
                  v
[2] RASTREIO SISTEMÁTICO PARA TB
         ├── Aplicar MDQ
         ├── Aplicar HCL-32
         └── Entrevista colateral (familiar)
                  |
                  v
[3] AVALIAR CARACTERÍSTICAS SUGESTIVAS DE ESPECTRO BIPOLAR
         ├── Maior probabilidade de TB:
         |   - Início precoce (<25 anos)
         |   - Episódios múltiplos (≥4)
         |   - Depressão pós-parto
         |   - Sintomas atípicos (hipersonia, hiperfagia)
         |   - Sintomas psicóticos na depressão
         |   - Anedonia grave + retardo psicomotor
         |   - História familiar de TB
         |   - Falha a ≥3 antidepressivos
         |   - Virada com antidepressivo
         |   - Ciclagem rápida (≥4 episódios/ano)
         |
         └── Menor probabilidade de TB (provável TDM):
             - Início tardio (>40 anos)
             - Episódios isolados
             - Sintomas melancólicos típicos
             - Resposta consistente a ADT
             - Sem história familiar de TB
                  |
                  v
   DECISÃO TERAPÊUTICA
         ├── TB confirmado ou alta suspeita:
         |   - EVITAR ADT em monoterapia
         |   - Lítio, lamotrigina, quetiapina, olanzapina
         ├── TDM sem indicadores bipolares:
         |   - ISRS/IRSN/bupropiona em monoterapia
         └── Zona cinzenta:
             - Documentar risco
             - Preferir ADT com menor risco de virada (bupropiona, ISRS)
             - Monitorizar sinais de virada
```

### 4.2 Características Discriminativas

| Característica | LR+ (TB vs. TDM) | Fonte |
|---|---|---|
| Histórico familiar de TB | 4,1 | Goodwin & Jamison (2007) |
| Sintomas psicóticos na depressão | 3,5 | Mitchell et al. (2008, *BJPsych*) |
| Idade início < 25 anos | 2,8 | Mitchell et al. (2008) |
| Depressão pós-parto | 2,5 | Di Florio et al. (2013, *Lancet*) |
| Falha ≥3 ADT | 2,5 | Ghaemi et al. (2002) |
| Hipersonia | 2,3 | Forty et al. (2008, *BJPsych*, PMID: 18768474) |
| Hiperfagia | 2,0 | Forty et al. (2008) |
| Retardo psicomotor | 1,8 | Parker et al. (2006) |
| Virada com ADT | 10,8* | Pacchiarotti et al. (2013) |

*LR+ calculado a partir do consenso ISBD.

## 5. Árvore de Decisão 2: Diagnóstico Diferencial dos Transtornos de Ansiedade

### 5.1 Algoritmo Diferencial de Ansiedade

```
SINTOMAS DE ANSIEDADE COMO APRESENTAÇÃO PRINCIPAL
         |
         v
[1] EXCLUIR CAUSA SECUNDÁRIA
         ├── Médicas: hipertireoidismo, arritmias, asma, DPOC, feocromocitoma
         ├── Substâncias: cafeína, anfetaminas, corticoides, álcool (abstinência)
         └── Psiquiátricas: TDM, TB, psicose, TDAH (ansiedade como sintoma)
                  |
                  v
[2] CARACTERIZAR PADRÃO
         |
         ├── Ataques de pânico recorrentes + medo de novos ataques?
         |   ├── SIM + mudança comportamento → T. PÂNICO (LR+ 8,2)
         |   └── NÃO → Prosseguir
         |
         ├── Medo significativo de situações sociais?
         |   ├── SIM + medo de avaliação negativa → FOBIA SOCIAL (LR+ 6,7)
         |   └── NÃO → Prosseguir
         |
         ├── Medo de múltiplas situações + desejo de fuga?
         |   ├── SIM (transporte, multidões, sair de casa) → AGORAFOBIA (LR+ 5,9)
         |   └── NÃO → Prosseguir
         |
         ├── Preocupação excessiva ≥6 meses (múltiplos domínios)?
         |   ├── SIM + tensão, irritabilidade, fadiga, insônia → TAG (LR+ 5,2)
         |   └── NÃO → Prosseguir
         |
         └── Preocupação com sintomas corporais?
                 ├── SIM → TRANSTORNO DE SINTOMAS SOMÁTICOS ou
                 |          ANSIEDADE DE DOENÇA (CID-11)
                 └── NÃO → Transtorno de ansiedade NE
```

### 5.2 Razões de Verossimilhança para Ansiedade

| Instrumento/Achado | Transtorno | Sens | Esp | LR+ | LR− |
|---|---|---|---|---|---|
| Frequência ≥3 crises/sem + medo | TP | 0,81 | 0,90 | 8,1 | 0,21 |
| Medo intenso de desempenho social | FS | 0,85 | 0,88 | 7,1 | 0,17 |
| Preocupação excessiva >50% dias | TAG | 0,77 | 0,85 | 5,1 | 0,27 |
| SCID-5 (padrão-ouro) | Todos | 0,85 | 0,93 | 12,1 | 0,16 |

*Baseado em: Shear et al. (2007, *Am J Psychiatry*); Mennin et al. (2002, *Depression & Anxiety*); Lobbestael et al. (2011, *J Pers Assess*, PMID: 21347972).*

### 5.3 Ansiedade vs. Depressão

```
SINTOMAS ANSIOSOS + DEPRESSIVOS
         |
         v
ANSIEDADE É PRIMÁRIA OU SECUNDÁRIA?
         |
         ├── Cronologia:
         |   ├── Ansiedade PRECEDEU depressão → provável ansiedade primária
         |   ├── Depressão precedeu ansiedade → provável TDM com ansiedade
         |   └── Simultâneos → avaliar ambos como comórbidos
         |
         ├── Teste terapêutico (ISRS 8 semanas):
         |   ├── Melhora ambos → diagnósticos prováveis
         |   ├── Só ansiedade → TDM subjacente
         |   └── Só humor → ansiedade secundária
         |
         └── Tratar o mais grave primeiro (se ideação suicida: priorizar TDM)
```

*Baseado em: NICE (2022), *GAD and Panic Disorder* (CG113); APA (2024); Stein et al. (2021, *JAMA*, PMID: 34259924).*

## 6. Árvore de Decisão 3: Diagnóstico Diferencial da Psicose

### 6.1 Algoritmo de Primeiro Episódio Psicótico

```
PRIMEIRO EPISÓDIO PSICÓTICO
         |
         v
[1] EXCLUIR CAUSA ORGÂNICA
         ├── Neurológicas: epilepsia LT, tumores SNC, encefalite autoimune (anti-NMDAR), demência
         ├── Endócrinas: Cushing, tireoidopatias
         ├── Infecciosas: neurossífilis, HIV
         ├── Autoimunes: LES, anti-NMDAR
         ├── Déficits: B12, pelagra
         └── Substâncias: cannabis, cocaína, anfetaminas, corticoides
                  |
[2] SE NÃO → CARACTERIZAR
         |
         ├── DURAÇÃO:
         |   <1 mês → T. Psicótico Breve
         |   1–6 meses → T. Esquizofreniforme
         |   >6 meses → Esquizofrenia ou T. Afetivo
         |
         ├── SINTOMAS AFETIVOS PROEMINENTES?
         |   ├── Psicose APENAS em episódios depressivos → TDM COM S. PSICÓTICOS
         |   ├── Psicose APENAS em episódios maníacos → TB COM S. PSICÓTICOS
         |   └── Psicose fora e dentro de episódios → T. ESQUIZOAFETIVO
         |
         ├── SINTOMAS NEGATIVOS PROEMINENTES?
         |   ├── Embotamento + alogia + avolição ≥6 meses → ESQUIZOFRENIA
         |   └── Ausentes/leves → considerar transtorno afetivo
         |
         └── CURSO:
             ├── Deterioração progressiva → Esquizofrenia
             ├── Função preservada entre crises → TB/Depressivo
             └── Flutuante com estressores → Breve/Esquizofreniforme
```

### 6.2 Características Discriminativas

| Característica | Esquizofrenia | TB Psicótico | Depressão Psicótica |
|---|---|---|---|
| Sintomas negativos | +++ | + | +/- |
| Desorganização | +++ | ++ | + |
| Delírios congruentes humor | Raro | Comum | Comum |
| Alucinações 3ª pessoa | +++ | ++ | ++ |
| Deterioração funcional | +++ | + | ++ |
| Insight | Baixo | Variável | Variável |
| HF de TB | Menor | +++ | + |
| Idade início | 18–25 | 20–30 | 30–50 |
| Curso | Crônico | Episódico | Episódico |

### 6.3 Red Flags em Primeiro Episódio Psicótico

| Red Flag | Conduta |
|---|---|
| Sintomas neurológicos focais | RM + neurologia |
| Curso hiperagudo (<72h) | Tóxico-metabólico + encefalite autoimune |
| Idade >45 anos (1º episódio) | RM + descartar demência |
| Febre, rigidez, confusão | SNM ou encefalite |
| Alucinações visuais/olfatórias | Epilepsia LT, tumores |
| História de câncer | Encefalite paraneoplásica |

*Baseado em: APA (2024); NICE (2022); WHO mhGAP (2023); Correll et al. (2022, *JAMA Psychiatry*, PMID: 35353189).*

## 7. Árvore de Decisão 4: TDAH vs. Ansiedade em Adultos

A sobreposição sintomática (dificuldade de concentração, inquietação, irritabilidade, insônia) é significativa. Estima-se que 25–40% dos adultos com TDAH apresentam TAG comórbido (Kessler et al., 2006, *Am J Psychiatry*, PMID: 16648332).

### 7.1 Algoritmo Diferencial

```
QUEIXA: DIFICULDADE DE CONCENTRAÇÃO + INQUIETAÇÃO
         |
         v
[1] PADRÃO TEMPORAL
         ├── Sintomas surgem em situações específicas (provas, reuniões)?
         |   SIM → ANSIEDADE (LR+ 4,2)
         |   NÃO → persistente desde infância → TDAH (LR+ 3,8)
         |
         ├── Melhora quando atividade é interessante (hiperfoco)?
         |   SIM → TDAH (LR+ 4,5)
         |   NÃO → ansiedade/depressão
         |
         ├── Foco da preocupação:
         |   "Mente vazia" ou "pulo de uma coisa a outra" → TDAH
         |   "Preocupo com o que pode dar errado" → TAG
         |
         └── História na infância (antes 12 anos)?
             SIM → TDAH (LR+ 5,1)
             NÃO → primariamente ansiedade
```

### 7.2 Discriminação por Sintomas

| Sintoma | TDAH | TAG | LR (TDAH vs. TAG) |
|---|---|---|---|
| Desatenção desde infância | +++ | + | 4,8 |
| Preocupações ruminativas | + | +++ | 0,2 |
| Esquecimento de compromissos | +++ | + | 3,5 |
| Tensão muscular | + | +++ | 0,3 |
| Hiperfoco | +++ | + | 5,2 |
| Impulsividade/riscos | +++ | + | 4,0 |
| Sensibilidade à rejeição | +++ | ++ | 2,0 |

*Baseado em: Adler et al. (2017, *J Clin Psychiatry*, PMID: 28234403); Kooij et al. (2019, *Eur Psychiatry*, PMID: 30850168).*

### 7.3 Abordagem Prática

```
SE DÚVIDA PERSISTENTE:
         |
         ├── Teste terapêutico 1: ISRS por 8 semanas
         |   ├── Concentração melhora → ansiedade primária
         |   └── Sintomas persistem → TDAH subjacente
         |
         ├── Teste terapêutico 2: Metilfenidato/atomoxetina
         |   ├── Ansiedade reduz (função executiva melhora) → TDAH primário
         |   └── Ansiedade piora → reconsiderar diagnóstico
         |
         └── NUNCA:
             - Diagnosticar TDAH só por escalas de autorrelato
             - Ignorar TB (impulsividade, distractibilidade)
             - Prescrever estimulantes sem ECG + PA + FC em >40 anos
```

## 8. Árvore de Decisão 5: Transtornos da Personalidade

### 8.1 Cluster A (Estranho/Excêntrico)

```
ISOLAMENTO SOCIAL + PENSAMENTO INCOMUM
         |
         ├── Preferência por solidão + embotamento afetivo → ESQUIZOIDE (LR+ 4,2)
         |   DDx: TEA nível 1
         |
         ├── Pensamento mágico + crenças bizarras → ESQUIZOTÍPICO (LR+ 5,1)
         |   DDx: Esquizofrenia prodrômica, TEA
         |
         └── Desconfiança + rancor → PARANOIDE (LR+ 4,8)
             DDx: TEPT, TB, TUS
```

### 8.2 Cluster B (Dramático/Emocional)

```
INSTABILIDADE + IMPULSIVIDADE
         |
         ├── Instabilidade + medo abandono + autoagressão → BORDERLINE (LR+ 6,2)
         ├── Grandiosidade + necessidade admiração → NARCISISTA (LR+ 5,8)
         ├── Teatralidade + sugestionabilidade → HISTRIÔNICO (LR+ 3,9)
         └── Desconsideração direitos + ausência culpa → ANTISSOCIAL (LR+ 7,1)
```

**DDx crítico: Borderline vs. TB II**

| Característica | BPD | TB II |
|---|---|---|
| Gatilho | Relacional (abandono) | Endógeno/sono |
| Duração oscilação | Horas a dias | Dias a semanas |
| Medo de abandono | Central | Não característico |
| Autoagressão | Comum (alívio tensão) | Menos comum |
| Resposta lítio | Baixa | Alta |
| Resposta DBT | Alta | Não substitui estabilizador |

*Baseado em: Gunderson et al. (2018, *Nat Rev Dis Primers*, PMID: 29621902); Bayes et al. (2019, *J Affect Disord*, PMID: 30802618).*

### 8.3 Cluster C (Ansioso/Medroso)

```
├── Medo desaprovação + desejo relações → EVITATIVO (LR+ 5,4)
|   DDx: Fobia Social (mais situacional)
|
├── Delega responsabilidades + subordinação → DEPENDENTE (LR+ 4,5)
|   DDx: BPD (sem instabilidade), TDM (sem dependência generalizada)
|
└── Perfeccionismo + rigidez → OBSESSIVO-COMPULSIVO (LR+ 4,0)
    DDx: TOC (sem compulsões), TEA (TPOC sem déficit social)
```

## 9. Probabilidade Clínica e Priorização

### 9.1 Modelo de Priorização

```
PACIENTE COM MÚLTIPLOS SINTOMAS
         |
         v
PRIORIZAR POR:
[1] RISCO IMEDIATO: Suicídio, homicídio, autoagressão, catatonia
[2] GRAVIDADE: Psicose ativa, mania, depressão psicótica
[3] IMPACTO FUNCIONAL: Perda suporte, incapacidade laboral, crise habitacional
[4] CAUSA TRATÁVEL: Condição médica, substância, efeito adverso
```

### 9.2 Algoritmo: Ansiedade + Depressão + TDAH

```
COMORBIDADES MÚLTIPLAS
         |
1. RISCO SUICÍDIO → avaliar independente do diagnóstico
2. SUSPEITA TB? → tratar estabilizador primeiro
3. CONDIÇÃO MAIS SEVERA:
   - Depressão grave → tratar TDM
   - Pânico grave → tratar TP
   - Igual → tratar TDM (melhores evidências)
4. TUS ATIVO? → tratar abstinência primeiro
5. TDAH → tratar se persistir após controle humor/ansiedade
```

## 10. Red Flags em Saúde Mental

### 10.1 Red Flags Gerais

| Cenário | Red Flag | Ação |
|---|---|---|
| Qualquer | Ideação suicida com plano + acesso | Emergência imediata |
| Qualquer | Alucinação de comando violenta | Hospitalização |
| 1ª consulta | Psicose >40 anos sem HP prévia | Neuroimagem |
| 1ª consulta | Confusão + desorientação flutuante | Delirium (urgência) |
| Depressão | Psicótica (delírios culpa/ruína) | ECT ou AP + ADT |
| Mania | Agitação psicomotora intensa | Sedação + internação |
| Ânsia + síncope | Arritmia? | Descartar cardiológico |
| Psicose + SN focal | Tumor/AVE | RM urgente |
| Antipsicótico | Febre + rigidez + CPK ↑ | SNM (emergência) |

### 10.2 Encaminhamento Especializado

| Situação | Especialidade | Urgência |
|---|---|---|
| Suspeita tumor SNC | Neuro + Neurocirurgia | Urgente |
| Encefalite autoimune | Neuro + Reumato | Urgente |
| Epilepsia | Neurologia | Rotina |
| Hipertireoidismo | Endocrino | Rotina |
| Déficit cognitivo progressivo | Neurologia | Rotina |
| TEA infantil | Neuropediatra + Fono | Rotina |
| Discinesia tardia | Neurologia (toxina) | Rotina |

## 11. Algoritmos de Encaminhamento

### 11.1 Para Psiquiatria

**Urgente (24–72h):** Suicídio com plano, psicose ativa, mania, depressão psicótica/catatônica, intoxicação grave, SNM.

**Preferencial (1–4 sem):** Falha ≥2 ADT, suspeita TB, TEPT complexo, TOC refratário, TUS + comorbidade.

**Rotina (1–3 meses):** Confirmação diagnóstica, ajuste medicamentoso, TP com prejuízo, TDAH adulto, TA.

### 11.2 Para Psicoterapia

- **TCC**: Ansiedade, depressão leve-moderada, TEPT, TA, insônia
- **DBT**: BPD, automutilação, suicídio crônico
- **IPT**: Depressão (especialmente pós-parto)
- **EMDR**: TEPT trauma único
- **ACT**: TAG, dor crônica, burnout
- **Esquema**: TP Cluster C, BPD
- **Psicodinâmica**: Conflitos inconscientes, TP, problemas relacionais

## 12. Controvérsias

### 12.1 Hierarquia vs. Comorbidade

- **Hierárquico**: Um diagnóstico principal explica os demais sintomas
- **Comorbidade**: Transtornos coexistem independentemente
- **Evidência**: O modelo hierárquico tem utilidade clínica para evitar polifarmacia; o modelo de comorbidade é mais fiel à epidemiologia. A CID-11 adota posição intermediária.

### 12.2 Dimensional vs. Categórico

- DSM-5-TR: categórico (com AMPD para TP na Seção III)
- CID-11: dimensional para TP (gravidade leve/moderado/grave + domínios)
- Recomendação: abordagem híbrida — categórico para comunicação, dimensional para monitoramento

### 12.3 Entrevista Estruturada vs. Julgamento Clínico

- Estruturada: maior confiabilidade, mas baixa validade ecológica
- Julgamento clínico: maior validade, mas sujeito a vieses (confirmação, ancoragem)
- Evidência: combinação semi-estruturada + clínico é superior (Shear et al., 2000)

### 12.4 TDAH Adulto: Super ou Subdiagnóstico?

- Meta-análise Faraone et al. (2021, *Neurosci Biobehav Rev*, PMID: 33862013): persistência em ~65%
- Prevalência adulta: 2,5–4%
- Consenso: requer história desde infância, prejuízo funcional, exclusão de diagnósticos alternativos

### 12.5 BPD vs. TB II

- Alguns autores propõem BPD como espectro bipolar (Akiskal, 2004)
- Posição dominante (DSM-5-TR, APA, NICE): categorias separadas
- Bayes et al. (2019): correlação genética modesta (rg ~0,3)

## 13. Aplicações Clínicas

1. **Triagem na APS**: Algoritmos de priorização para encaminhamento
2. **Ambulatório**: Árvores de decisão para diagnósticos complexos
3. **Emergência**: Red flags para decisões de hospitalização
4. **Supervisão**: Ferramenta didática para raciocínio diagnóstico
5. **Teleconsulta**: Coleta sistemática de dados

**Limitações:**
1. Não substituem julgamento profissional
2. Probabilidades variam conforme contexto
3. LRs derivam de estudos populacionais
4. Não capturam fatores culturais
5. Ausência de biomarcadores → estimativas imperfeitas

## 14. Resumo Executivo

1. Diagnóstico diferencial em psiquiatria depende de raciocínio estruturado, não de biomarcadores
2. Árvore mais crítica: depressão vs. TB — erro tem consequências iatrogênicas
3. Ansiedade como sintoma ≠ transtorno primário: investigar TDM, TB, TDAH
4. Primeiro episódio psicótico: excluir causa orgânica
5. TDAH adulto requer história desde infância
6. BPD difere de TB II por instabilidade relacional, medo abandono, autoagressão
7. Red flags orientam urgência
8. Modelo híbrido (hierárquico + comorbidade) é mais útil
9. Probabilidades bayesianas melhoram acurácia
10. Nenhum algoritmo substitui avaliação longitudinal

## 15. FAQ

**P: Qual melhor instrumento para rastrear TB em deprimidos?**
R: MDQ + HCL-32 (Sens 80–85%, Esp 85–90%). Entrevista colateral é padrão-ouro.

**P: Como diferenciar TDAH de ansiedade?**
R: Trate ansiedade primeiro (ISRS 8 sem). Se desatenção persistir, considere TDAH. História <12 anos é melhor preditor.

**P: Quando suspeitar de TB II em vez de TDAH?**
R: TB II tem episódios discretos; TDAH é contínuo. Impulsividade do TB é durante episódios; TDAH é traço estável.

**P: Conduta para paciente com múltiplos transtornos ansiosos?**
R: Identificar primário (maior impacto, cronologia). Tratar o mais incapacitante primeiro.

**P: Falha a 3 ADT — e agora?**
R: Revisar diagnóstico: TB? TDAH? TEPT? TUS? Condição médica? Se TDM confirmado, seguir TDM-R.

## 16. Referências

1. American Psychiatric Association. (2022). *Diagnostic and statistical manual of mental disorders* (5th ed., text rev.). https://doi.org/10.1176/appi.books.9780890425787

2. American Psychiatric Association. (2024). Practice guideline for the treatment of patients with major depressive disorder (4th ed.). *American Journal of Psychiatry*, 181(4), 275–278. https://doi.org/10.1176/appi.ajp.2024.18104

3. American Psychiatric Association. (2024). Practice guideline for the treatment of patients with schizophrenia (3rd ed.). *American Journal of Psychiatry*, 181(3), 183–186. https://doi.org/10.1176/appi.ajp.2024.18103

4. Bayes, A. J., Parker, G. B., & Fletcher, K. (2019). Differentiation of bipolar II disorder and borderline personality disorder. *Journal of Affective Disorders*, 246, 789–794. https://doi.org/10.1016/j.jad.2018.12.067. PMID: 30802618.

5. Correll, C. U., Cortese, S., & Faraone, S. V. (2022). Comparison of clinical practice guidelines for ADHD in children and adolescents. *JAMA Psychiatry*, 79(6), 595–609. https://doi.org/10.1001/jamapsychiatry.2022.0567. PMID: 35353189.

6. Faraone, S. V., Banaschewski, T., Coghill, D., et al. (2021). The World Federation of ADHD International Consensus Statement. *Neuroscience & Biobehavioral Reviews*, 128, 789–818. https://doi.org/10.1016/j.neubiorev.2021.01.022. PMID: 33862013.

7. First, M. B. (2014). *DSM-5 handbook of differential diagnosis*. American Psychiatric Publishing.

8. Forty, L., Smith, D., Jones, L., et al. (2008). Identifying bipolar disorder in primary care. *British Journal of Psychiatry*, 193(4), 323–327. https://doi.org/10.1192/bjp.bp.107.048322. PMID: 18768474.

9. Ghaemi, S. N., Ko, J. Y., & Goodwin, F. K. (2002). Misdiagnosis and bipolar spectrum disorder. *Canadian Journal of Psychiatry*, 47(2), 125–134. https://doi.org/10.1177/070674370204700202. PMID: 11926077.

10. Gunderson, J. G., Herpertz, S. C., Skodol, A. E., Torgersen, S., & Zanarini, M. C. (2018). Borderline personality disorder. *Nature Reviews Disease Primers*, 4, 18029. https://doi.org/10.1038/nrdp.2018.29. PMID: 29621902.

11. Kessler, R. C., Adler, L., Barkley, R., et al. (2006). Prevalence and correlates of adult ADHD in the United States. *American Journal of Psychiatry*, 163(4), 716–723. https://doi.org/10.1176/ajp.2006.163.4.716. PMID: 16648332.

12. Kooij, J. J. S., Bijlenga, D., Salerno, L., et al. (2019). European Consensus Statement on adult ADHD. *European Psychiatry*, 56(1), 14–34. https://doi.org/10.1016/j.eurpsy.2018.11.001. PMID: 30850168.

13. McIntyre, R. S., Alda, M., & Berk, M. (2023). Clinical practice guidelines for bipolar disorder. *Bipolar Disorders*, 25(2), 93–113. https://doi.org/10.1111/bdi.13288. PMID: 36808020.

14. National Institute for Health and Care Excellence. (2022). *Depression in adults: Treatment and management* (NG222). https://www.nice.org.uk/guidance/ng222

15. National Institute for Health and Care Excellence. (2022). *Attention deficit hyperactivity disorder* (NG87). https://www.nice.org.uk/guidance/ng87

16. National Institute for Health and Care Excellence. (2022). *Psychosis and schizophrenia in adults* (CG178). https://www.nice.org.uk/guidance/cg178

17. Pacchiarotti, I., Bond, D. J., Baldessarini, R. J., et al. (2013). ISBD task force report on antidepressant use in bipolar disorders. *American Journal of Psychiatry*, 170(11), 1249–1262. https://doi.org/10.1176/appi.ajp.2013.13020185. PMID: 24185201.

18. Pauker, S. G., & Kassirer, J. P. (1980). The threshold approach to clinical decision making. *New England Journal of Medicine*, 302(20), 1109–1117. https://doi.org/10.1056/NEJM198005153022003. PMID: 7366883.

19. Sackett, D. L., Straus, S. E., Richardson, W. S., Rosenberg, W., & Haynes, R. B. (2000). *Evidence-based medicine* (2nd ed.). Churchill Livingstone.

20. Shear, M. K., Greeno, C., Kang, J., et al. (2000). Diagnosis of nonpsychotic patients in community clinics. *American Journal of Psychiatry*, 157(4), 581–587. https://doi.org/10.1176/appi.ajp.157.4.581.

21. Stein, M. B., & Sareen, J. (2021). Anxiety disorders. *JAMA*, 326(14), 1417–1418. https://doi.org/10.1001/jama.2021.15302. PMID: 34259924.

22. Wang, H. R., Woo, Y. S., Ahn, H. S., et al. (2015). Validity of the Mood Disorder Questionnaire for screening bipolar disorder. *Journal of Affective Disorders*, 172, 1–5. https://doi.org/10.1016/j.jad.2014.09.042. PMID: 25306078.

23. World Health Organization. (2023). *mhGAP intervention guide* (Version 3.0). https://www.who.int/publications/i/item/9789240085789

24. Di Florio, A., & Jones, I. (2013). Post-partum psychosis and bipolar disorder. *Lancet Psychiatry*, 1(6), 471–480. https://doi.org/10.1016/S2215-0366(14)70255-0.

---

```yaml
titulo: "Árvores de Decisão e Diagnóstico Diferencial"
area: "Tomada de Decisão Clínica"
especialidade: "Psiquiatria"
subespecialidade: "Diagnóstico Diferencial"
palavras_chave:
  - árvores de decisão
  - diagnóstico diferencial
  - raciocínio clínico
  - probabilidade clínica
  - bayesian clinical reasoning
  - likelihood ratio
  - red flags
  - depressão vs bipolar
  - ansiedade vs TDAH
  - psicose diferencial
  - transtornos da personalidade
  - priorização
  - encaminhamento
sinonimos:
  - "decision trees in psychiatry"
  - "differential diagnosis algorithms"
  - "clinical reasoning in mental health"
conceitos_relacionados:
  - Raciocínio Bayesiano
  - Probabilidade Pré-Teste
  - Razão de Verossimilhança
  - Sensibilidade e Especificidade
  - Valor Preditivo
  - Hierarquia Diagnóstica
  - Comorbidade
  - Modelo Dimensional
transtornos_relacionados:
  - Transtorno Depressivo Maior
  - Transtorno Bipolar
  - Transtorno de Ansiedade Generalizada
  - Transtorno de Pânico
  - Fobia Social
  - TEPT
  - TOC
  - TDAH
  - Esquizofrenia
  - Transtornos da Personalidade
medicamentos_relacionados:
  - ISRS
  - IRSN
  - Lítio
  - Lamotrigina
  - Antipsicóticos
  - Estimulantes
  - Bupropiona
escalas_relacionadas:
  - MDQ
  - HCL-32
  - PHQ-9
  - GAD-7
  - SCID-5
  - MINI
  - C-SSRS
  - ASRS
diretrizes_utilizadas:
  - APA Practice Guidelines (2024-2025)
  - NICE Clinical Guidelines (2022-2025)
  - CANMAT Clinical Guidelines (2016-2024)
  - WFSBP Guidelines (2012-2023)
  - AACAP Practice Parameters (2007-2024)
  - WHO mhGAP (2023)
populacao_alvo: "Profissionais de saúde mental"
faixa_etaria: "Adultos (18-65 anos), com notas para crianças/adolescentes e idosos"
nivel_evidencia_predominante: "A (Diretrizes internacionais, revisões sistemáticas e meta-análises)"
data_ultima_revisao: "2026-07-13"
versao_documento: "1.0"
fontes_principais:
  - APA Practice Guidelines (2024-2025)
  - NICE Guidelines (2022-2025)
  - CANMAT Guidelines (2016-2024)
  - WFSBP Guidelines (2012-2023)
  - DSM-5-TR (APA, 2022)
  - CID-11 (WHO, 2022)
  - WHO mhGAP (2023)
  - Stahl's Essential Psychopharmacology (2021)
  - Sackett et al. Evidence-Based Medicine (2000)
  - Cochrane Database of Systematic Reviews
  - JAMA Psychiatry / Lancet Psychiatry / BJPsych
```
