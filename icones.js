/* ==========================================================================
   Dra. Lais Azevedo · Ícones
   Gramática (DNA 5.7.9): linha fina, traço contínuo, sem preenchimento.
   Grade 24×24, traço 1,5, pontas arredondadas. Cor = currentColor.
   ========================================================================== */
(function (DL) {
  const P = {
    /* Temas (capas de destaque) */
    espiral: '<path d="M12.2 12.1c.1-.9 1.3-1.2 1.9-.5.8.9.2 2.4-.9 2.7-1.6.5-3.1-.8-3.1-2.4 0-2.1 2-3.6 4-3.3 2.6.4 4.2 3 3.6 5.5-.7 3.1-4 4.9-7 4.1C7 17.4 5 13.9 6 10.6 7 7 11 4.9 14.6 6c3.3 1 5.5 4.3 5.1 7.7"/>',
    lua: '<path d="M19.5 14.2A7.8 7.8 0 1 1 9.8 4.5a6.3 6.3 0 0 0 9.7 9.7Z"/><path d="M17.5 3.5v4M15.5 5.5h4"/>',
    'sol-nascente': '<path d="M3.5 16.5h17M7.5 19.5h9M7.5 16.5a4.5 4.5 0 0 1 9 0M12 6.5v2.5M5.8 9.6l1.6 1.6M18.2 9.6l-1.6 1.6"/>',
    bateria: '<rect x="3" y="7.5" width="16" height="9" rx="2.2"/><path d="M21 10.5v3"/><path d="M6 10.5v3" stroke-width="2.6"/>',
    balao: '<path d="M4 5h16v11h-8.5L7 19.5V16H4Z"/><path d="M10.4 8.7a1.7 1.7 0 1 1 2.4 1.5c-.5.3-.8.7-.8 1.2v.3M12 13.6v.1"/>',
    monograma: '<path d="M6 18.5V5.5M6 18.5h4.5M11 18.5 15 5.5l4 13M12.3 14h5.4"/>',

    /* Contato */
    whatsapp: '<path d="M4 20.2l1.2-3.7a8.2 8.2 0 1 1 2.6 2.6Z"/><path d="M9.2 8.4c.3-.5.7-.6 1.1-.4l.7 1.6-.7.9a6 6 0 0 0 3 3l.9-.7 1.6.7c.2.4 0 .8-.4 1.1-1.9 1.1-6.9-3.5-6.2-6.2Z"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.9"/><path d="M17.1 6.9v.1"/>',
    email: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.6 7 8.4 6 8.4-6"/>',
    telefone: '<path d="M5 3.8h3.3l1.6 4.1-2 1.3a10.4 10.4 0 0 0 6.9 6.9l1.3-2 4.1 1.6V19a1.6 1.6 0 0 1-1.7 1.6C10.4 20.1 3.9 13.6 3.4 5.5A1.6 1.6 0 0 1 5 3.8Z"/>',
    local: '<path d="M12 21s-6.5-5.7-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15.3 12 21 12 21Z"/><circle cx="12" cy="9.8" r="2.3"/>',
    mapa: '<path d="m9 4.5-5 2v13l5-2 6 2 5-2v-13l-5 2-6-2ZM9 4.5v13M15 6.5v13"/>',
    relogio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    tela: '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M9 20h6M12 16.5V20"/>',
    acessibilidade: '<circle cx="12" cy="4.6" r="1.4"/><path d="m5 8.4 7 1.6 7-1.6M12 10v4.6l-3 5.2M12 14.6l3 5.2"/>',
    estacionamento: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M10 16.5v-9h3a2.5 2.5 0 0 1 0 5h-3"/>',
    graduacao: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5Z"/><path d="M6.5 11v4.6c1.5 1.4 3.5 2.1 5.5 2.1s4-.7 5.5-2.1V11M21.5 9v5"/>',
    usuario: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c1-3.6 3.8-5.6 7-5.6s6 2 7 5.6"/>',
    escudo: '<path d="M12 3.5 5 6v5.5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    cadeado: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5v-3a4 4 0 0 1 8 0v3"/>',

    /* Conteúdo */
    play: '<circle cx="12" cy="12" r="8.5"/><path d="M10.2 8.8v6.4l5-3.2Z"/>',
    reel: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M10.5 9.5v5l4-2.5Z"/>',
    carrossel: '<rect x="6.5" y="4" width="11" height="16" rx="1.6"/><path d="M3 7v10M21 7v10"/>',
    documento: '<path d="M6 3.5h8l4 4v13H6Z"/><path d="M14 3.5V8h4M9 12h6M9 15.5h6"/>',
    folha: '<path d="M5 19C5 11 10 5 19 5c0 9-6 14-14 14Z"/><path d="m5 19 7.5-7.5"/>',
    xicara: '<path d="M4.5 9h12v4.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5Z"/><path d="M16.5 10.5h1.2a2.3 2.3 0 0 1 0 4.6h-1.5M8.5 3.5v2.5M12.5 3.5v2.5"/>',
    coracao: '<path d="M12 19.5s-7.5-4.5-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.5-7.5 10-7.5 10Z"/>',

    /* Interface */
    copiar: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'seta-voltar': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    externo: '<path d="M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    menos: '<path d="M5 12h14"/>',
    'chevron-baixo': '<path d="m6 9 6 6 6-6"/>',
    'chevron-direita': '<path d="m9 6 6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
    busca: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.1"/>',
    alerta: '<path d="M12 4 21 19.5H3Z"/><path d="M12 10v4M12 16.8v.1"/>',
    erro: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.8v5M12 15.8v.1"/>',
    sucesso: '<circle cx="12" cy="12" r="8.5"/><path d="m8 12.4 2.7 2.7L16 9.8"/>',
    enviar: '<path d="M20.5 3.5 10 14M20.5 3.5 14 20.5l-4-6.5-6.5-4Z"/>',
    atualizar: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4"/>',
    estrela: '<path d="m12 4 2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6Z"/>'
  };

  /**
   * DL.icone('whatsapp', { tamanho: 'm', rotulo: 'WhatsApp' })
   * Sem rótulo, o ícone é decorativo (aria-hidden).
   */
  DL.icone = function (nome, o = {}) {
    const path = P[nome];
    if (!path) { console.warn('Ícone inexistente:', nome); return ''; }
    const cls = ['icone', o.tamanho ? 'icone--' + o.tamanho : '', o.classe || ''].join(' ').trim();
    const a11y = o.rotulo ? `role="img" aria-label="${DL.esc(o.rotulo)}"` : 'aria-hidden="true" focusable="false"';
    return `<svg class="${cls}" viewBox="0 0 24 24" ${a11y}>${path}</svg>`;
  };
  DL.listaIcones = () => Object.keys(P);
})(window.DL = window.DL || {});
