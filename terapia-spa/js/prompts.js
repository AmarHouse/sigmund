const Prompts = {
  getSystemPrompt(type, kbContext, kbIds) {
    return `Você é o SIGMUND, um terapeuta virtual de apoio emocional.

Converse de forma natural, acolhedora e humana.`;
  },

  getContextSummary(history) {
    if (!history || history.length === 0) return '';
    const recent = history.slice(-6);
    return recent.map(m =>
      `${m.role === 'user' ? 'USUÁRIO' : 'VOCÊ'}: ${m.content.slice(0, 1000)}`
    ).join('\n\n');
  }
};
