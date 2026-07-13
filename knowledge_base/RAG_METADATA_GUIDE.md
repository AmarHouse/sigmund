# RAG METADATA GUIDE — Guia de Metadados para Retrieval-Augmented Generation

> **Estratégia de indexação semântica, chunking e recuperação para a Knowledge Base de Saúde Mental**
> Versão: 1.0 | Julho/2026

---

## 1. VISÃO GERAL

Este documento define a arquitetura de metadados e as estratégias de recuperação para sistemas de Retrieval-Augmented Generation (RAG) que utilizam a Knowledge Base de Saúde Mental. O objetivo é maximizar a precisão semântica, a relevância contextual e a segurança clínica na recuperação de informações.

### 1.1 Princípios Norteadores

1. **Precisão semântica** — metadados devem capturar com fidelidade o conteúdo e a intenção de cada documento.
2. **Hierarquia clínica** — informações críticas (diagnóstico, tratamento, emergências) devem ser priorizadas na indexação.
3. **Rastreabilidade** — cada afirmação recuperável deve ser vinculada ao nível de evidência e à fonte.
4. **Segurança** — metadados devem permitir filtrar informações por nível de evidência, data e população-alvo.

---

## 2. ESQUEMA DE METADADOS

### 2.1 Estrutura Geral

Cada documento no Knowledge Base inclui, ao final, um bloco de metadados em formato YAML com a seguinte estrutura:

```yaml
---
Título: (string)
Área: (string)
Especialidade: (string)
Subespecialidade: (string)
Palavras-chave: (lista de strings)
Sinônimos: (lista de strings)
Conceitos relacionados: (lista de strings)
Transtornos relacionados: (lista de strings)
Medicamentos relacionados: (lista de strings)
Escalas relacionadas: (lista de strings)
Diretrizes utilizadas: (lista de strings)
População-alvo: (string)
Faixa etária: (string)
Nível de evidência predominante: (string)
Data da última revisão: (string — ISO 8601)
Versão do documento: (string — semantic versioning)
Fontes principais: (lista de strings)
---
```

### 2.2 Descrição Detalhada de Cada Campo

#### `Título`
- **Tipo:** String obrigatória
- **Descrição:** Nome completo do documento, padronizado em português brasileiro.
- **Exemplo:** "Antidepressivos: ISRS, IRSN, Tricíclicos, IMAO e Atípicos"
- **Uso RAG:** Identificação primária do documento.

#### `Área`
- **Tipo:** String obrigatória
- **Descrição:** Domínio amplo do conhecimento em saúde mental.
- **Valores permitidos:** Saúde Mental, Neurociência, Psiquiatria, Psicologia Clínica, Psicanálise, Psicopatologia, Classificação Diagnóstica, Avaliação Psicológica, Ética, Fundamentos.
- **Uso RAG:** Filtragem hierárquica de alto nível.

#### `Especialidade`
- **Tipo:** String obrigatória
- **Descrição:** Especialidade clínica ou acadêmica principal.
- **Exemplo:** Psiquiatria, Psicologia Clínica, Neurociência Aplicada à Saúde Mental
- **Uso RAG:** Direcionamento para domínio profissional específico.

#### `Subespecialidade`
- **Tipo:** String obrigatória
- **Descrição:** Subárea dentro da especialidade.
- **Exemplo:** Transtornos do Humor, Psicofarmacologia, Terapias Contextuais, Metapsicologia
- **Uso RAG:** Refinamento da busca semântica.

#### `Palavras-chave`
- **Tipo:** Lista de strings obrigatória (mínimo 10)
- **Descrição:** Termos fundamentais que descrevem o conteúdo do documento. Inclui conceitos centrais, nomes de transtornos, fármacos, intervenções, sintomas, escalas e autores.
- **Exemplo:** `["antidepressivos", "ISRS", "IRSN", "depressão maior", "SERT", "STAR*D"]`
- **Uso RAG:** Indexação vetorial primária. Essencial para busca por similaridade semântica.

#### `Sinônimos`
- **Tipo:** Lista de strings
- **Descrição:** Termos equivalentes ou alternativos (incluindo siglas em português e inglês, nomenclatura internacional, variações terminológicas).
- **Exemplo:** `["ISRS: SSRIs", "ADS: Antidepressivos"]`
- **Uso RAG:** Expansão de consultas (query expansion). Fundamental para recuperação multilíngue (português-inglês).

#### `Conceitos relacionados`
- **Tipo:** Lista de strings
- **Descrição:** Conceitos que possuem relação temática direta com o conteúdo do documento, sem necessariamente serem transtornos ou medicamentos.
- **Exemplo:** `["plasticidade sináptica", "neurogênese", "BDNF", "neuroinflamação"]`
- **Uso RAG:** Navegação associativa entre documentos. Recomendação de leitura complementar.

#### `Transtornos relacionados`
- **Tipo:** Lista de strings
- **Descrição:** Transtornos mentais abordados ou relevantes para o documento. Inclui códigos CID-11 e DSM-5-TR quando aplicável.
- **Exemplo:** `["Transtorno Depressivo Maior (F32, F33)", "Transtorno Bipolar (F31)"]`
- **Uso RAG:** Filtragem crítica para raciocínio diagnóstico. Permite associar automaticamente um transtorno aos documentos de tratamento, avaliação e diagnóstico diferencial.

#### `Medicamentos relacionados`
- **Tipo:** Lista de strings
- **Descrição:** Fármacos, classes farmacológicas ou princípios ativos abordados ou relevantes.
- **Exemplo:** `["fluoxetina", "sertralina", "escitalopram", "ISRS"]`
- **Uso RAG:** Recuperação contextual em perguntas sobre farmacoterapia. Suporte a decisões de prescrição.

#### `Escalas relacionadas`
- **Tipo:** Lista de strings
- **Descrição:** Instrumentos de avaliação padronizados mencionados ou clinicamente relevantes.
- **Exemplo:** `["PHQ-9", "HAM-D", "MADRS", "BDI-II", "C-SSRS"]`
- **Uso RAG:** Vinculação entre documento de transtorno e documento de avaliação. Suporte a recomendações de escalas.

#### `Diretrizes utilizadas`
- **Tipo:** Lista de strings
- **Descrição:** Guidelines, consensos e position statements que fundamentam o documento.
- **Exemplo:** `["APA Practice Guideline for MDD (2010/2019)", "NICE Guideline NG222 (2022)", "CANMAT Clinical Guidelines for MDD (2016)"]`
- **Uso RAG:** Filtragem por autoridade científica. Permite priorizar informações baseadas em diretrizes vigentes.

#### `População-alvo`
- **Tipo:** String
- **Descrição:** Caracterização da população à qual o conteúdo se aplica.
- **Exemplo:** "Adultos com suspeita ou diagnóstico de transtornos depressivos"
- **Uso RAG:** Filtragem demográfica. Evita recuperação inadequada para populações não abrangidas.

#### `Faixa etária`
- **Tipo:** String
- **Descrição:** Faixa etária de aplicação do conteúdo.
- **Exemplo:** "18-90 anos", "crianças, adolescentes, adultos, idosos"
- **Uso RAG:** Segurança pediátrica e geriátrica. Filtro crítico para psicofarmacologia.

#### `Nível de evidência predominante`
- **Tipo:** String
- **Descrição:** Classificação do nível de evidência que predomina no documento (A, B, C ou D).
- **Exemplo:** "A (revisões sistemáticas, meta-análises e diretrizes)"
- **Uso RAG:** Ranqueamento por qualidade metodológica. Permite priorizar fontes de maior evidência.

#### `Data da última revisão`
- **Tipo:** String (ISO 8601)
- **Descrição:** Data da última atualização ou revisão do documento.
- **Exemplo:** "2026-07-13"
- **Uso RAG:** Filtragem temporal. Essencial para garantir atualização científica.

#### `Versão do documento`
- **Tipo:** String (semantic versioning)
- **Descrição:** Versão do documento no formato X.Y.
- **Exemplo:** "1.0", "2.0"
- **Uso RAG:** Rastreamento de atualizações.

#### `Fontes principais`
- **Tipo:** Lista de strings
- **Descrição:** Referências bibliográficas primárias que embasaram o documento (não exaustivo; limite de ~10 principais).
- **Exemplo:** `["Stahl's Essential Psychopharmacology (5th ed., 2021)", "Kaplan & Sadock's Synopsis of Psychiatry (12th ed., 2021)"]`
- **Uso RAG:** Vinculação a referências canônicas. Rastreabilidade.

---

## 3. ESTRATÉGIA DE INDEXAÇÃO SEMÂNTICA

### 3.1 Índices Primários

| Índice | Campo Fonte | Tipo | Uso |
|--------|-------------|------|-----|
| I1 — Conteúdo | Texto completo | Vetorial (dense) | Busca semântica principal |
| I2 — Palavras-chave | `Palavras-chave` + `Sinônimos` | Vetorial + Léxico | Expansão de consulta |
| I3 — Hierarquia clínica | `Área` → `Especialidade` → `Subespecialidade` | Categórico | Filtro hierárquico |
| I4 — Evidência | `Nível de evidência predominante` | Ordinal (A > B > C > D) | Ranqueamento |
| I5 — Temporal | `Data da última revisão` | Temporal | Filtro de atualidade |
| I6 — Populacional | `População-alvo` + `Faixa etária` | Categórico | Filtro de segurança |

### 3.2 Ponderação de Campos na Indexação

| Campo | Peso na Similaridade | Justificativa |
|-------|---------------------|---------------|
| `Título` | 0.25 | Identificador primário do conteúdo |
| `Palavras-chave` | 0.25 | Vocabulário controlado de alta densidade semântica |
| `Sinônimos` | 0.10 | Expansão de cobertura terminológica |
| `Conceitos relacionados` | 0.10 | Navegação associativa |
| Corpo do texto (primeiros 20%) | 0.20 | Contexto introdutório (definição e introdução) |
| Corpo do texto (tratamento) | 0.10 | Informação clínica de alto valor |

### 3.3 Taxonomia de Áreas

```
Saúde Mental
├── Fundamentos
│   ├── História
│   ├── Filosofia
│   └── Ética
├── Neurociência Aplicada
│   ├── Neuroanatomia
│   ├── Neurobiologia
│   ├── Neuroimagem
│   ├── Genética
│   └── Psiconeuroimunologia
├── Psicopatologia
│   ├── Semiologia
│   ├── Fenomenologia
│   └── Nosologia
├── Psiquiatria Clínica
│   ├── Transtornos do Humor
│   ├── Transtornos de Ansiedade
│   ├── Transtornos Psicóticos
│   ├── Transtornos da Personalidade
│   ├── Dependência Química
│   └── Outros Transtornos
├── Psicofarmacologia
│   ├── Antidepressivos
│   ├── Antipsicóticos
│   ├── Estabilizadores
│   ├── Ansiolíticos
│   ├── Estimulantes
│   └── Hipnóticos
├── Psicoterapia
│   ├── TCC e Terceira Onda
│   ├── Psicoterapias Contextuais
│   ├── Psicanálise
│   ├── Terapia Familiar
│   └── Psicoterapia Infantil
├── Avaliação Clínica
│   ├── Entrevista
│   └── Escalas
├── Emergências Psiquiátricas
├── Medicina do Estilo de Vida
└── Saúde Digital
```

---

## 4. ESTRATÉGIA DE CHUNKING

### 4.1 Estrutura Hierárquica dos Documentos

Cada documento segue o formato padrão definido no Prompt.md:

```
Título → Definição → Introdução → Histórico → Epidemiologia → Neurobiologia →
Etiologia → Quadro Clínico → Critérios Diagnósticos → Diagnóstico Diferencial →
Comorbidades → Tratamento → Prognóstico → Casos Clínicos → Erros Comuns →
Controvérsias → Resumo → Referências → Metadados
```

### 4.2 Hierarquia de Chunking

| Nível | Elemento | Tamanho Alvo | Sobreposição |
|-------|----------|-------------|--------------|
| L0 | Documento completo | 10k–50k tokens | N/A |
| L1 | Seção principal (##) | 1k–5k tokens | 100 tokens |
| L2 | Subseção (###) | 200–1k tokens | 50 tokens |
| L3 | Parágrafo semântico | 100–500 tokens | 0 tokens |

### 4.3 Estratégia de Chunking para Conteúdo Clínico

Recomenda-se **chunking semântico hierárquico**:

1. **Preservar limites de seção** — cada seção `##` ou `###` deve ser chunk preservado integralmente.
2. **Tabelas e listas** — nunca quebrar tabelas, listas ou fluxogramas entre chunks.
3. **Definições e critérios diagnósticos** — chunk completo, sem divisão.
4. **Metadados YAML** — chunk separado, preservado integralmente para busca por metadados.
5. **Referências** — chunk separado ao final.

### 4.4 Tamanhos de Chunk Recomendados por Tipo de Conteúdo

| Tipo de Conteúdo | Tamanho (tokens) | Estratégia |
|------------------|-------------------|------------|
| Definição | 100–300 | Parágrafo único |
| Critérios diagnósticos | 300–800 | Marcadores completos |
| Tratamento farmacológico | 500–2000 | Subseções por classe/fármaco |
| Protocolo psicoterápico | 500–1500 | Subseções por técnica |
| Tabelas comparativas | 200–600 | Tabela completa |
| Fluxograma | 200–500 | Fluxograma + legenda |
| Referências | 500–2000 | Lista completa |
| Metadados YAML | 50–150 | Bloco integral |

### 4.5 Exemplo de Estrutura de Chunks (Documento de Antidepressivos)

```
Chunk 1: [Título + Definição + Introdução] — 800 tokens
Chunk 2: [Histórico + Epidemiologia] — 600 tokens
Chunk 3: [Neurobiologia da Depressão] — 1200 tokens
Chunk 4: [Classificação: ISRS] — 1500 tokens
Chunk 5: [Classificação: IRSN] — 1000 tokens
Chunk 6: [Classificação: ADT] — 800 tokens
Chunk 7: [Classificação: IMAO] — 600 tokens
Chunk 8: [Classificação: Atípicos] — 1200 tokens
Chunk 9: [Algoritmos de Tratamento] — 1000 tokens
Chunk 10: [Efeitos Adversos + Interações] — 1000 tokens
Chunk 11: [Populações Especiais] — 800 tokens
Chunk 12: [Controvérsias + Estudos Principais] — 600 tokens
Chunk 13: [Resumo + Checklist] — 400 tokens
Chunk 14: [Referências] — 1200 tokens
Chunk 15: [Metadados YAML] — 100 tokens
```

---

## 5. ESTRATÉGIAS DE RECUPERAÇÃO PARA RACIOCÍNIO CLÍNICO

### 5.1 Modos de Recuperação

#### Modo 1: Diagnóstico Diferencial
- **Estratégia:** Multi-query com filtros por `transtornos_relacionados`
- **Chunks prioritários:** Critérios diagnósticos, diagnóstico diferencial, comorbidades
- **Número de chunks:** 8–12
- **Diversidade:** Alta (vários transtornos)

#### Modo 2: Tratamento Farmacológico
- **Estratégia:** Query com expansão de sinônimos farmacológicos
- **Chunks prioritários:** Tratamento → subseções de fármacos
- **Número de chunks:** 5–8
- **Filtros:** `medicamentos_relacionados`, `faixa_etaria`, `nivel_evidencia`

#### Modo 3: Tratamento Psicoterápico
- **Estratégia:** Query focada em `especialidade: Psicologia Clínica`
- **Chunks prioritários:** Protocolos, técnicas, evidências
- **Número de chunks:** 4–6

#### Modo 4: Avaliação e Escalas
- **Estratégia:** Query com `escalas_relacionadas`
- **Chunks prioritários:** Propriedades psicométricas, pontos de corte, interpretação
- **Número de chunks:** 3–5

#### Modo 5: Emergência
- **Estratégia:** Query urgente com palavras-chave de alto risco
- **Chunks prioritários:** Red flags, manejo agudo, algoritmos
- **Número de chunks:** 3–4
- **Contexto adicional:** Documento completo do Nível 13

#### Modo 6: Fundamentos Teóricos
- **Estratégia:** Query com `Área: Fundamentos`
- **Chunks prioritários:** Definição, histórico, conceitos fundamentais
- **Número de chunks:** 3–5

### 5.2 Templates de Prompt para RAG Clínico

#### Template para Pergunta Diagnóstica

```
Com base nos seguintes chunks da Knowledge Base de Saúde Mental,
responda à pergunta clínica abaixo.

Contexto:
{chunks_retrievados}

Pergunta: {query_clinica}

Instruções:
1. Indique o nível de evidência para cada recomendação.
2. Mencione divergências entre diretrizes quando existirem.
3. Se a informação não estiver disponível nos chunks, declare explicitamente.
4. Inclua os códigos CID-11 e DSM-5-TR quando aplicável.
```

#### Template para Pergunta de Tratamento

```
Com base nos seguintes chunks, apresente as opções de tratamento para {transtorno}.

Contexto:
{chunks_retrievados}

População: {faixa_etaria} | Comorbidades: {comorbidades}

Inclua:
1. Primeira linha (com nível de evidência e diretriz de suporte)
2. Segunda linha
3. Duração esperada do tratamento
4. Principais efeitos adversos
5. Monitoramento recomendado
```

### 5.3 Estratégia de Expansão de Consultas (Query Expansion)

| Termo Original | Termos Expandidos (Sinônimos) |
|----------------|-------------------------------|
| Depressão | Depressão maior, TDM, transtorno depressivo maior, major depressive disorder, MDD |
| Ansiedade | Ansiedade generalizada, TAG, generalized anxiety disorder, GAD |
| TCC | Terapia cognitivo-comportamental, cognitive behavioral therapy, CBT |
| ISRS | Inibidores seletivos de recaptação de serotonina, SSRIs, SERT inhibitors |
| Psicose | Esquizofrenia, transtorno psicótico, delírio, alucinação, psychotic disorder |

---

## 6. MODELOS DE EMBEDDING RECOMENDADOS

### 6.1 Para Indexação e Recuperação em Português Brasileiro

| Modelo | Tipo | Tamanho | Recomendação |
|--------|------|---------|--------------|
| `multilingual-e5-large` | Dense | 1024d | **Primeira escolha** — excelente performance multilíngue |
| `BAAI/bge-m3` | Dense | 1024d | Suporte multilíngue robusto, bom para português |
| `intfloat/multilingual-e5-small` | Dense | 384d | Alternativa mais leve para produção |
| `sentence-transformers/LaBSE` | Dense | 768d | Bom para alinhamento cross-lingual |
| `text-embedding-3-large` (OpenAI) | Dense | 3072d | Máxima qualidade (API paga) |

### 6.2 Modelos Léxicos (para índice híbrido)

| Modelo | Tipo | Recomendação |
|--------|------|--------------|
| BM25 (Okapi) | Léxico padrão | Baseline obrigatório para qualquer sistema RAG |
| SPLADE-v3 | Léxico aprendido | Alta precisão em recuperação esparsa |

### 6.3 Abordagem Híbrida Recomendada

```
Recuperação Final = α × Similaridade Densa + β × Similaridade Léxica

Onde:
- α = 0.7 (dense retriever principal)
- β = 0.3 (sparse retriever complementar)
- Ajustar α/β conforme o tipo de consulta:
  - Consultas diagnósticas: α = 0.8 (favorecer semântica)
  - Consultas sobre fármacos: α = 0.6 (favorecer termos exatos)
  - Consultas sobre escalas: α = 0.5 (equilíbrio)
```

---

## 7. MÉTRICAS DE AVALIAÇÃO DA RECUPERAÇÃO

| Métrica | Alvo | Método de Avaliação |
|---------|------|---------------------|
| Hit Rate@10 | >0.90 | Proporção de consultas com ao menos 1 chunk relevante no top-10 |
| MRR (Mean Reciprocal Rank) | >0.80 | Rank médio do primeiro chunk relevante |
| NDCG@10 | >0.85 | Qualidade do ranking ponderada por relevância |
| Precisão (contexto clínico) | >0.90 | Precisão manual em 50 consultas clínicas amostradas |
| Recall (evidências) | >0.95 | Capacidade de recuperar todas as fontes relevantes |

---

## 8. ARQUITETURA DE INDEXAÇÃO

### 8.1 Fluxo de Indexação

```
Documento .md
    │
    ▼
Parser (remover YAML, separar seções)
    │
    ▼
Chunking semântico hierárquico
    │
    ▼
Geração de embeddings (modelo multilíngue)
    │
    ▼
Indexação vetorial (FAISS / Pinecone / Qdrant / Weaviate)
    │
    ▼
Indexação léxica (BM25 + SPLADE)
    │
    ▼
Índice híbrido combinado
```

### 8.2 Campos Indexados Separadamente

| Campo | Índice | Tipo |
|-------|--------|------|
| Texto completo | Vetorial + Léxico | Chunk de conteúdo |
| Título | Vetorial | Metadado embarcado |
| Palavras-chave | Vetorial + Léxico | Metadado embarcado + invertido |
| Sinônimos | Léxico (BM25) | Invertido |
| Transtornos relacionados | Léxico + Categórico | Invertido + filtro |
| Medicamentos relacionados | Léxico + Categórico | Invertido + filtro |
| Nível de evidência | Ordinal | Filtro |
| Faixa etária | Categórico | Filtro |
| Data da última revisão | Temporal | Filtro |

---

## 9. SEGURANÇA E GOVERNANÇA EM RAG

### 9.1 Filtros de Segurança Obrigatórios

1. **Nível de evidência mínimo**: filtrar documentos com nível D para consultas de tratamento
2. **Data de validade**: excluir documentos com >5 anos sem revisão para recomendações farmacológicas
3. **População-alvo**: verificar compatibilidade entre a consulta e `faixa_etaria`/`populacao_alvo`
4. **Contraindicações**: verificar `contraindicacoes` nos documentos farmacológicos

### 9.2 Mensagens de Segurança para o Usuário

Quando o sistema RAG não encontrar evidência suficiente, deve gerar:

> "A informação solicitada não está disponível na Knowledge Base com nível de evidência suficiente para uma resposta confiável. Consulte as diretrizes atuais (APA, NICE, CANMAT) ou um especialista para orientação adicional."

### 9.3 Limitações Conhecidas

- A KB não substitui avaliação clínica individualizada
- Recomendações podem estar desatualizadas entre ciclos de revisão
- Decisões clínicas devem considerar o contexto biopsicossocial completo do paciente

---

## 10. EXEMPLO COMPLETO DE INDEXAÇÃO

### Documento: Antidepressivos (Nível 06)

```yaml
# Metadados YAML extraídos
Título: "Antidepressivos: ISRS, IRSN, Tricíclicos, IMAO e Atípicos"
Área: "Psiquiatria"
Especialidade: "Psiquiatria Clínica"
Subespecialidade: "Psicofarmacologia"
Palavras-chave: ["antidepressivos", "ISRS", "IRSN", "ADT", "IMAO", "bupropiona", "mirtazapina", "esketamina", "SERT", "NET"]
Sinônimos: ["ISRS: SSRIs", "IRSN: SNRIs", "Tricíclicos: TCAs", "IMAO: MAOIs"]
Conceitos relacionados: ["depressão resistente ao tratamento", "síndrome serotoninérgica", "síndrome de descontinuação"]
Transtornos relacionados: ["TDM (F32, F33)", "TAG (F41.1)", "Pânico (F41.0)", "TOC (F42)"]
Medicamentos relacionados: ["fluoxetina", "sertralina", "escitalopram", "venlafaxina", "duloxetina"]
Escalas relacionadas: ["PHQ-9", "HAM-D", "MADRS", "BDI-II", "C-SSRS"]
Diretrizes utilizadas: ["APA MDD Guideline", "CANMAT 2016", "NICE NG222", "WFSBP"]
Nível de evidência: "A"
Faixa etária: "18-65+ anos"
Data da última revisão: "2026-07-13"
Versão: "1.0"
```

### Chunks Gerados

| Chunk ID | Seção | Tokens | Embedding |
|----------|-------|--------|-----------|
| `antidepressivos_01` | Definição + Introdução | 350 | dense_vector_01 |
| `antidepressivos_02` | Neurobiologia | 450 | dense_vector_02 |
| `antidepressivos_03` | ISRS | 800 | dense_vector_03 |
| `antidepressivos_04` | IRSN | 500 | dense_vector_04 |
| `antidepressivos_05` | ADT | 400 | dense_vector_05 |
| `antidepressivos_06` | IMAO | 300 | dense_vector_06 |
| `antidepressivos_07` | Atípicos | 600 | dense_vector_07 |
| `antidepressivos_08` | Algoritmos | 700 | dense_vector_08 |
| `antidepressivos_09` | Efeitos Adversos | 500 | dense_vector_09 |
| `antidepressivos_10` | Populações Especiais | 400 | dense_vector_10 |
| `antidepressivos_11` | Metadados YAML | 80 | dense_vector_meta |

---

## 11. REFERÊNCIAS

- Gao, Y. et al. (2023). Retrieval-Augmented Generation for Large Language Models: A Survey. *arXiv preprint arXiv:2312.10997*.
- Lewis, P. et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *Advances in Neural Information Processing Systems*, 33, 9459–9474.
- Reimers, N. & Gurevych, I. (2019). Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks. *Proceedings of EMNLP-IJCNLP*, 3982–3992.
- Karpukhin, V. et al. (2020). Dense Passage Retrieval for Open-Domain Question Answering. *Proceedings of EMNLP*, 6769–6781.

---

## 12. HISTÓRICO DE VERSÕES

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Julho/2026 | Criação do RAG Metadata Guide para Knowledge Base de Saúde Mental |
