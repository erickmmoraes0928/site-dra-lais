/* ==========================================================================
   Dra. Lais Azevedo · Componentes (render + comportamento)
   Cada função recebe um objeto de opções e devolve HTML. DL.iniciar(raiz)
   liga os comportamentos (accordion, abas, modal, copiar, formulário...).
   Sem dependências; funciona abrindo o arquivo direto no navegador.
   ========================================================================== */
(function (DL) {
  'use strict';

  /* ---------- Utilidades ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  DL.esc = esc;
  const ic = (n, o) => DL.icone(n, o);
  let seq = 0;
  const uid = (p = 'dl') => `${p}-${++seq}`;
  const attrs = (obj = {}) => Object.entries(obj).filter(([, v]) => v !== false && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`)).join(' ');
  const cls = (...c) => c.flat().filter(Boolean).join(' ');
  /* Texto com *itálico de ênfase* → <em> */
  const enfase = (t) => esc(t).replace(/\*(.+?)\*/g, '<em>$1</em>');
  DL.enfase = enfase;

  DL.exemplo = (texto = 'exemplo') => `<span class="marca-exemplo" title="Conteúdo fictício, trocar pelo real">${esc(texto)}</span>`;

  DL.linkWhatsApp = (numero, mensagem = '') => {
    const digitos = String(numero).replace(/\D/g, '');
    const completo = digitos.startsWith('55') ? digitos : '55' + digitos;
    return `https://wa.me/${completo}${mensagem ? '?text=' + encodeURIComponent(mensagem) : ''}`;
  };

  /* ======================================================================
     BÁSICOS
     ====================================================================== */

  /**
   * Botão. variante: primario | destaque | secundario | discreto
   * tamanho: p | m | g · estado (catálogo): hover | foco | pressionado
   */
  DL.botao = function (o = {}) {
    const tag = o.href ? 'a' : 'button';
    const c = cls('btn', `btn--${o.variante || 'primario'}`, o.tamanho && o.tamanho !== 'm' && `btn--${o.tamanho}`,
      o.bloco && 'btn--bloco', o.somenteIcone && 'btn--icone', o.estado && `is-${o.estado}`, o.classe);
    const a = {
      class: c,
      href: o.href,
      type: tag === 'button' ? (o.tipo || 'button') : null,
      target: o.externo ? '_blank' : null,
      rel: o.externo ? 'noopener' : null,
      disabled: tag === 'button' && o.desabilitado,
      'aria-disabled': tag === 'a' && o.desabilitado ? 'true' : null,
      'aria-busy': o.carregando ? 'true' : null,
      'aria-label': o.rotulo || (o.somenteIcone ? o.texto : null),
      ...(o.attrs || {})
    };
    // iconeTroca: dois ícones empilhados que trocam com animação (ex.: copiar → check)
    const icone = o.iconeTroca ? `<span class="icone-troca">${ic(o.icone)}${ic(o.iconeTroca)}</span>` : o.icone ? ic(o.icone) : '';
    const iconeFim = o.iconeFim ? ic(o.iconeFim) : '';
    const texto = o.somenteIcone ? '' : `<span>${esc(o.texto)}</span>`;
    const externo = o.externo && !o.somenteIcone ? '<span class="visualmente-oculto">(abre em nova aba)</span>' : '';
    return `<${tag} ${attrs(a)}><span class="btn__conteudo">${icone}${texto}${iconeFim}${externo}</span><span class="btn__carregando" aria-hidden="true"><span class="spinner"></span></span>${o.carregando ? '<span class="visualmente-oculto">Carregando</span>' : ''}</${tag}>`;
  };

  /**
   * Campo de texto. tipo: text | email | tel | textarea | select
   * mascara: 'telefone' · max: contador de caracteres
   */
  DL.campo = function (o = {}) {
    const id = o.id || uid('campo');
    const ajudaId = `${id}-ajuda`, erroId = `${id}-erro`;
    const descr = [o.ajuda || o.max ? ajudaId : null, erroId].filter(Boolean).join(' ');
    const c = cls('campo', o.erro && 'is-erro', o.desabilitado && 'is-desabilitado', o.classe);
    const base = {
      id, name: o.nome || id,
      class: cls('campo__entrada', o.estado && `is-${o.estado}`),
      placeholder: o.placeholder,
      required: o.obrigatorio,
      disabled: o.desabilitado,
      autocomplete: o.autocomplete,
      inputmode: o.inputmode,
      maxlength: o.max,
      'aria-invalid': o.erro ? 'true' : null,
      'aria-describedby': descr,
      'data-mascara': o.mascara,
      'data-msg-obrigatorio': o.msgObrigatorio,
      ...(o.attrs || {})
    };
    let controle;
    if (o.tipo === 'textarea') {
      controle = `<textarea ${attrs({ ...base, rows: o.linhas || 4 })}>${esc(o.valor)}</textarea>`;
    } else if (o.tipo === 'select') {
      const ops = (o.opcoes || []).map((op) => {
        const v = typeof op === 'string' ? op : op.valor; const t = typeof op === 'string' ? op : op.texto;
        return `<option value="${esc(v)}"${v === o.valor ? ' selected' : ''}${op.desabilitada ? ' disabled' : ''}>${esc(t)}</option>`;
      }).join('');
      controle = `<select ${attrs(base)}>${o.placeholder ? `<option value="" disabled${o.valor ? '' : ' selected'}>${esc(o.placeholder)}</option>` : ''}${ops}</select>`;
    } else {
      controle = `<input ${attrs({ ...base, type: o.tipo || 'text', value: o.valor })}>`;
    }
    const icone = o.icone ? ic(o.icone) : '';
    const obrig = o.obrigatorio ? '' : (o.mostrarOpcional !== false ? '<span class="campo__opcional">(opcional)</span>' : '');
    const contador = o.max ? `<span class="campo__contador" data-contador="${id}" aria-live="polite">${(o.valor || '').length}/${o.max}</span>` : '';
    const ajuda = (o.ajuda || o.max) ? `<div class="campo__ajuda" id="${ajudaId}"><span>${esc(o.ajuda || '')}</span>${contador}</div>` : '';
    return `<div class="${c}">
      <label class="campo__rotulo" for="${id}">${esc(o.rotulo)}${obrig}</label>
      <div class="campo__controle">${icone}${controle}</div>
      ${ajuda}
      <div class="campo__erro" id="${erroId}" aria-live="polite">${ic('erro')}<span>${esc(o.erro || '')}</span></div>
    </div>`;
  };

  /** Checkbox ou radio isolado */
  DL.opcao = function (o = {}) {
    const id = o.id || uid('op');
    const c = cls('opcao', o.desabilitado && 'is-desabilitado', o.erro && 'is-erro', o.estado && `is-${o.estado}`);
    const input = `<input ${attrs({ type: o.tipo || 'checkbox', id, name: o.nome || id, value: o.valor || 'sim', checked: o.marcado, disabled: o.desabilitado, required: o.obrigatorio, 'aria-invalid': o.erro ? 'true' : null, 'aria-describedby': o.descricao ? `${id}-d` : null, ...(o.attrs || {}) })}>`;
    const desc = o.descricao ? `<span class="opcao__descricao" id="${id}-d">${esc(o.descricao)}</span>` : '';
    return `<label class="${c}" for="${id}">${input}<span>${o.html || esc(o.texto)}${desc}</span></label>`;
  };

  /** Grupo de radios ou checkboxes com legenda */
  DL.grupoOpcoes = function (o = {}) {
    const nome = o.nome || uid('grupo');
    const itens = (o.itens || []).map((it, i) => DL.opcao({ ...it, tipo: o.tipo || 'radio', nome, id: `${nome}-${i}`, obrigatorio: o.obrigatorio && i === 0 ? true : it.obrigatorio })).join('');
    return `<fieldset class="${cls('grupo-opcoes', o.linha && 'grupo-opcoes--linha')}" ${o.obrigatorio ? 'data-obrigatorio="true"' : ''}>
      <legend>${esc(o.legenda)}</legend><div class="grupo-opcoes__itens">${itens}</div>
      <div class="campo__erro" aria-live="polite">${ic('erro')}<span>${esc(o.erro || '')}</span></div>
    </fieldset>`;
  };

  /** Switch (input checkbox com role="switch") */
  DL.interruptor = function (o = {}) {
    const id = o.id || uid('sw');
    const c = cls('interruptor', o.desabilitado && 'is-desabilitado', o.estado && `is-${o.estado}`);
    return `<label class="${c}" for="${id}"><span class="interruptor__texto"><span>${esc(o.texto)}</span>${o.descricao ? `<span class="t-legenda">${esc(o.descricao)}</span>` : ''}</span>
      <input ${attrs({ type: 'checkbox', role: 'switch', id, name: o.nome || id, checked: o.marcado, disabled: o.desabilitado })}></label>`;
  };

  /** Chips de seleção múltipla (ou única com tipo:'radio') */
  DL.chips = function (o = {}) {
    const nome = o.nome || uid('chips');
    const itens = (o.itens || []).map((it, i) => {
      const t = typeof it === 'string' ? { texto: it, valor: it } : it;
      return `<label class="${cls('chip', t.estado && `is-${t.estado}`)}"><input ${attrs({ type: o.tipo || 'checkbox', name: nome, value: t.valor || t.texto, checked: t.marcado, disabled: t.desabilitado, 'aria-label': t.rotulo })}><span>${ic('check')}${esc(t.texto)}</span></label>`;
    }).join('');
    return `<fieldset class="${cls('chips', o.erro && 'is-erro')}" ${o.obrigatorio ? 'data-obrigatorio="true"' : ''}><legend>${esc(o.legenda)}${o.obrigatorio ? '' : ' <span class="campo__opcional">(opcional)</span>'}</legend>${itens}
      <div class="campo__erro" aria-live="polite" style="width:100%">${ic('erro')}<span>${esc(o.erro || '')}</span></div></fieldset>`;
  };

  /** Avatar. tamanho: p | m | g | xg */
  DL.avatar = function (o = {}) {
    const c = cls('avatar', `avatar--${o.tamanho || 'm'}`, o.monograma && 'avatar--monograma', o.anel && 'avatar--anel', o.classe);
    let dentro;
    if (o.monograma) dentro = `<img src="${esc(o.monograma)}" alt="${esc(o.alt || 'Monograma LA')}">`;
    else if (o.src) dentro = `<img src="${esc(o.src)}" alt="${esc(o.alt || '')}" ${o.prioridade ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    else dentro = `<span aria-hidden="true">${esc(o.iniciais || '?')}</span>${o.alt ? `<span class="visualmente-oculto">${esc(o.alt)}</span>` : ''}`;
    const status = o.status ? `<span class="avatar__status" role="img" aria-label="${esc(o.status)}"></span>` : '';
    return `<span class="${c}">${dentro}${status}</span>`;
  };

  DL.grupoAvatares = function (lista = [], o = {}) {
    const max = o.max || 4;
    const vis = lista.slice(0, max).map((a) => DL.avatar({ ...a, tamanho: o.tamanho || 'm' })).join('');
    const resto = lista.length - max;
    const mais = resto > 0 ? `<span class="avatar avatar--${o.tamanho || 'm'} grupo-avatares__mais" role="img" aria-label="Mais ${resto} pessoas">+${resto}</span>` : '';
    return `<div class="grupo-avatares" role="group" aria-label="${esc(o.rotulo || 'Equipe')}">${vis}${mais}</div>`;
  };

  /** Badge. tom: ansiedade | sono | rotina | exaustao | contorno · status: aberta | espera | fechada */
  DL.badge = function (o = {}) {
    const c = cls('badge', o.tom && `badge--${o.tom}`, o.status && `badge--${o.status}`);
    const ponto = o.status ? '<span class="badge__ponto" aria-hidden="true"></span>' : '';
    return `<span class="${c}">${ponto}${o.icone ? ic(o.icone) : ''}${esc(o.texto)}</span>`;
  };

  /** Tooltip: gatilho focável + balão role="tooltip" */
  DL.tooltip = function (o = {}) {
    const id = uid('tip');
    const gatilho = o.gatilhoHtml || `<button type="button" class="tooltip__gatilho" aria-describedby="${id}">${esc(o.texto)}${o.icone ? ic(o.icone, { tamanho: 'p' }) : ''}</button>`;
    return `<span class="${cls('tooltip', o.posicao === 'baixo' && 'tooltip--baixo', o.aberto && 'is-aberto')}" data-tooltip>${gatilho}<span class="tooltip__balao" role="tooltip" id="${id}">${esc(o.dica)}</span></span>`;
  };

  /** Accordion. itens: [{titulo, html|texto, aberto}] */
  DL.acordeao = function (o = {}) {
    const base = uid('acc');
    const nivel = o.nivel || 3;
    const itens = (o.itens || []).map((it, i) => {
      const bid = `${base}-b${i}`, pid = `${base}-p${i}`;
      const corpo = it.html || `<p>${esc(it.texto)}</p>`;
      return `<div class="acordeao__item"><h${nivel} class="acordeao__titulo"><button type="button" class="acordeao__botao" id="${bid}" aria-expanded="${it.aberto ? 'true' : 'false'}" aria-controls="${pid}"><span>${esc(it.titulo)}</span>${ic('mais', { tamanho: 'm' })}</button></h${nivel}>
        <div class="acordeao__painel" id="${pid}" role="region" aria-labelledby="${bid}" ${it.aberto ? '' : 'inert'}><div class="acordeao__interno"><div class="acordeao__conteudo">${corpo}</div></div></div></div>`;
    }).join('');
    return `<div class="acordeao" data-acordeao ${o.unico ? 'data-unico' : ''}>${itens}</div>`;
  };

  /** Alerta. tipo: info | sucesso | atencao | erro | cuidado */
  DL.alerta = function (o = {}) {
    const icones = { info: 'info', sucesso: 'sucesso', atencao: 'alerta', erro: 'erro', cuidado: 'coracao' };
    const tipo = o.tipo || 'info';
    const role = tipo === 'erro' ? 'alert' : 'status';
    const fechar = o.fechar ? DL.botao({ variante: 'discreto', somenteIcone: true, icone: 'fechar', texto: 'Fechar aviso', tamanho: 'p', classe: 'alerta__fechar', attrs: { 'data-fechar-alerta': '' } }) : '<span></span>';
    const acoes = o.acoes ? `<div class="alerta__acoes">${o.acoes}</div>` : '';
    return `<div class="${cls('alerta', `alerta--${tipo}`, o.classe)}" role="${o.role || role}">${ic(icones[tipo])}<div>${o.titulo ? `<p class="alerta__titulo">${esc(o.titulo)}</p>` : ''}<p class="alerta__texto">${o.html || esc(o.texto)}</p>${acoes}</div>${fechar}</div>`;
  };

  /** Toast (chamado por JS). tipo: info | sucesso | erro */
  DL.toast = function (texto, o = {}) {
    let regiao = document.querySelector('.toasts');
    if (!regiao) {
      regiao = document.createElement('div');
      regiao.className = 'toasts';
      regiao.setAttribute('role', 'status');
      regiao.setAttribute('aria-live', 'polite');
      document.body.appendChild(regiao);
    }
    const el = document.createElement('div');
    const tipo = o.tipo || 'sucesso';
    el.className = `toast toast--${tipo}`;
    el.innerHTML = `${ic(tipo === 'erro' ? 'erro' : tipo === 'info' ? 'info' : 'sucesso')}<span class="toast__texto">${esc(texto)}</span>` +
      (o.acao ? DL.botao({ variante: 'discreto', tamanho: 'p', texto: o.acao.texto, attrs: { 'data-toast-acao': '' } }) : '') +
      DL.botao({ variante: 'discreto', tamanho: 'p', somenteIcone: true, icone: 'fechar', texto: 'Fechar' });
    const sair = () => { el.classList.add('is-saindo'); setTimeout(() => el.remove(), 260); };
    el.querySelector('[aria-label="Fechar"]').addEventListener('click', sair);
    if (o.acao) el.querySelector('[data-toast-acao]').addEventListener('click', () => { o.acao.aoClicar?.(); sair(); });
    regiao.appendChild(el);
    setTimeout(sair, o.duracao || 4200);
    return el;
  };
  /** Toast estático (para o catálogo) */
  DL.toastEstatico = (texto, tipo = 'sucesso') => `<div class="toast toast--${tipo} toast--estatico">${ic(tipo === 'erro' ? 'erro' : tipo === 'info' ? 'info' : 'sucesso')}<span class="toast__texto">${esc(texto)}</span>${DL.botao({ variante: 'discreto', tamanho: 'p', somenteIcone: true, icone: 'fechar', texto: 'Fechar' })}</div>`;

  /** Modal (dialog). Abra com data-abrir-modal="id" */
  DL.modal = function (o = {}) {
    const id = o.id || uid('modal');
    return `<dialog class="${cls('modal', o.folha && 'modal--folha')}" id="${id}" aria-labelledby="${id}-t">
      <div class="modal__alca" data-alca aria-hidden="true"><span></span></div>
      <div class="modal__cabecalho"><div>${o.eyebrow ? `<p class="eyebrow">${esc(o.eyebrow)}</p>` : ''}<h2 class="t-h3" id="${id}-t">${enfase(o.titulo)}</h2></div>
        ${DL.botao({ variante: 'discreto', somenteIcone: true, icone: 'fechar', texto: 'Fechar', attrs: { 'data-fechar-modal': '' } })}</div>
      <div class="modal__corpo">${o.html || ''}</div>
      ${o.rodape ? `<div class="modal__rodape">${o.rodape}</div>` : ''}
    </dialog>`;
  };

  /** Abas. abas: [{rotulo, html, desabilitada}] */
  DL.abas = function (o = {}) {
    const base = o.id || uid('abas');
    const sel = o.selecionada || 0;
    const lista = (o.abas || []).map((a, i) => `<button type="button" role="tab" class="abas__aba" id="${base}-t${i}" aria-controls="${base}-p${i}" aria-selected="${i === sel}" tabindex="${i === sel ? 0 : -1}" ${a.desabilitada ? 'disabled' : ''}>${esc(a.rotulo)}</button>`).join('');
    const paineis = (o.abas || []).map((a, i) => `<div role="tabpanel" class="abas__painel" id="${base}-p${i}" aria-labelledby="${base}-t${i}" tabindex="0" ${i === sel ? '' : 'hidden'}>${a.html || ''}</div>`).join('');
    return `<div class="abas" data-abas><div class="abas__lista" role="tablist" aria-label="${esc(o.rotulo || 'Abas')}">${lista}<span class="abas__indicador" aria-hidden="true"></span></div>${paineis}</div>`;
  };

  /** Breadcrumbs. itens: [{texto, href}] (o último é a página atual) */
  DL.trilha = function (itens = []) {
    const li = itens.map((it, i) => i === itens.length - 1
      ? `<li><span aria-current="page" title="${esc(it.texto)}">${esc(it.texto)}</span></li>`
      : `<li><a href="${esc(it.href || '#')}">${esc(it.texto)}</a></li>`).join('');
    return `<nav class="trilha" aria-label="Você está em"><ol>${li}</ol></nav>`;
  };

  /** Divisor. tipo: linha | rotulo | ornamento */
  DL.divisor = function (o = {}) {
    if (o.tipo === 'rotulo') return `<div class="divisor-rotulo t-rotulo" role="separator">${esc(o.texto)}</div>`;
    if (o.tipo === 'ornamento') return '<div class="divisor-ornamento" role="separator"><span></span></div>';
    return '<hr class="divisor">';
  };

  /* ---------- Ilustração de apoio (formas chapadas) ---------- */
  const ILU = {
    sol: '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="44" fill="#EE6926"/></svg>',
    colinas: '<svg viewBox="0 0 240 120" aria-hidden="true"><ellipse cx="150" cy="128" rx="150" ry="70" fill="#5C612B"/><ellipse cx="210" cy="140" rx="110" ry="58" fill="#BF3727"/><circle cx="150" cy="40" r="26" fill="#EE6926"/></svg>',
    folha: '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M12 68C12 34 32 12 68 12c0 36-22 56-56 56Z" fill="#5C612B"/></svg>',
    degraus: '<svg viewBox="0 0 180 120" aria-hidden="true"><rect x="90" y="0" width="90" height="36" fill="#FCC697"/><rect x="45" y="40" width="135" height="36" fill="#FCC697"/><rect x="0" y="80" width="180" height="40" fill="#EE6926"/></svg>',
    'sol-colina': '<svg viewBox="0 0 200 140" aria-hidden="true"><circle cx="120" cy="52" r="30" fill="#EE6926"/><ellipse cx="130" cy="150" rx="120" ry="66" fill="#5C612B"/><ellipse cx="190" cy="160" rx="80" ry="54" fill="#BF3727"/></svg>'
  };
  DL.ilustracao = function (nome, o = {}) {
    const estilo = `width:${o.largura || 160}px;${o.estilo || ''}`;
    return `<div class="ilustracao ilustracao--${o.canto || 'canto-inf-dir'}" style="${estilo}">${ILU[nome] || ''}</div>`;
  };
  DL.ilustracaoSvg = (nome) => ILU[nome] || '';

  /* ======================================================================
     COMPONENTES DO SITE
     ====================================================================== */

  /** Cabeçalho de perfil */
  DL.perfil = function (p = {}) {
    const registro = `${DL.tooltip({ texto: p.registro, dica: 'Registro no Conselho Regional de Medicina do Estado do Rio de Janeiro', posicao: 'baixo' })}`;
    return `<header class="perfil">
      <div class="perfil__foto">${DL.avatar({ src: p.foto, alt: p.fotoAlt, tamanho: 'xg', anel: true, prioridade: true })}${p.fotoIlustrativa ? `<div style="margin-top:8px">${DL.exemplo('imagem ilustrativa')}</div>` : ''}</div>
      <h1 class="perfil__nome t-h1">${esc(p.nome)}</h1>
      <p class="perfil__titulo">${esc(p.titulo)}</p>
      <p class="perfil__registro">${registro}<span class="sep" aria-hidden="true">·</span><span>${esc(p.formacaoCurta)}</span></p>
      <p class="perfil__promessa">${enfase(p.promessa)}</p>
      ${p.status ? `<div class="perfil__status">${DL.badge({ texto: p.status.texto, status: p.status.tipo })}</div>` : ''}
    </header>`;
  };

  /** Botão de link estilo Linktree */
  DL.linkBotao = function (o = {}) {
    const tag = o.href ? 'a' : 'button';
    const c = cls('link-botao', o.destaque && 'link-botao--destaque', o.tom && `link-botao--${o.tom}`, o.estado && `is-${o.estado}`);
    const a = {
      class: c, href: o.desabilitado ? null : o.href,
      type: tag === 'button' ? 'button' : null,
      target: o.externo ? '_blank' : null, rel: o.externo ? 'noopener' : null,
      'aria-disabled': o.desabilitado ? 'true' : null,
      disabled: tag === 'button' && o.desabilitado,
      'aria-busy': o.carregando ? 'true' : null,
      role: tag === 'a' && o.desabilitado ? 'link' : null,
      ...(o.attrs || {})
    };
    const seta = ic(o.externo ? 'externo' : 'seta', { classe: 'link-botao__seta' });
    return `<${tag} ${attrs(a)}>
      <span class="link-botao__icone">${ic(o.icone || 'link')}</span>
      <span class="link-botao__texto"><span class="link-botao__titulo">${esc(o.titulo)}</span>${o.subtitulo ? `<span class="link-botao__sub">${esc(o.subtitulo)}${o.exemplo ? ' ' + DL.exemplo() : ''}</span>` : ''}</span>
      ${seta}<span class="link-botao__carregando"><span class="spinner"></span><span class="visualmente-oculto">Carregando</span></span>
      ${o.externo ? '<span class="visualmente-oculto">(abre em nova aba)</span>' : ''}
    </${tag}>`;
  };

  /** Botão de WhatsApp (destaque) */
  DL.botaoWhatsApp = function (o = {}) {
    return DL.botao({ variante: 'destaque', icone: 'whatsapp', texto: o.texto || 'Agende no WhatsApp', href: DL.linkWhatsApp(o.numero, o.mensagem), externo: true, bloco: o.bloco, tamanho: o.tamanho, estado: o.estado, carregando: o.carregando, desabilitado: o.desabilitado, classe: o.classe });
  };

  /** Redes sociais. itens: [{rede, rotulo, href}] */
  DL.redes = function (itens = []) {
    return `<ul class="redes">${itens.map((r) => `<li><a ${attrs({ href: r.href, target: r.href?.startsWith('http') ? '_blank' : null, rel: 'noopener', 'aria-label': r.rotulo, class: r.estado ? `is-${r.estado}` : null })}>${ic(r.icone || r.rede, { tamanho: 'm' })}</a></li>`).join('')}</ul>`;
  };

  /** Cabeçalho de seção */
  DL.secaoCabecalho = (o) => `<div class="secao__cabecalho">${o.eyebrow ? `<p class="eyebrow">${esc(o.eyebrow)}</p>` : ''}<h2 class="t-h2" id="${esc(o.id || '')}">${enfase(o.titulo)}</h2>${o.intro ? `<p class="secao__intro">${o.introHtml ? o.intro : esc(o.intro)}</p>` : ''}</div>`;

  /** Sobre mim */
  DL.sobreMim = function (s = {}) {
    const pontos = (s.pontos || []).map((p) => `<li>${ic(p.icone || 'folha')}<span>${esc(p.texto)}</span></li>`).join('');
    return `<div class="${cls('sobre', s.lado && 'sobre--lado')}">
      <figure class="sobre__foto" style="margin:0"><img src="${esc(s.foto)}" alt="${esc(s.fotoAlt)}" loading="lazy" decoding="async">${s.fotoIlustrativa ? `<figcaption class="sobre__credito">${DL.exemplo('imagem ilustrativa')}</figcaption>` : ''}</figure>
      <div class="sobre__texto">${(s.paragrafos || []).map((p) => `<p>${enfase(p)}</p>`).join('')}${pontos ? `<ul class="sobre__pontos">${pontos}</ul>` : ''}${s.exemplo ? `<p>${DL.exemplo('texto de exemplo · revisar com a Dra. Lais')}</p>` : ''}</div>
    </div>`;
  };

  /** Formação em linha do tempo */
  DL.formacao = function (itens = []) {
    return `<ol class="linha-tempo">${itens.map((f) => `<li class="${cls('linha-tempo__item', f.atual && 'linha-tempo__item--atual')}">
      <p class="linha-tempo__periodo"><span>${esc(f.periodo)}</span>${f.atual ? DL.badge({ texto: 'Em andamento', tom: 'contorno' }) : ''}${f.exemplo ? DL.exemplo() : ''}</p>
      <h3 class="linha-tempo__titulo">${esc(f.titulo)}</h3><p class="linha-tempo__local">${esc(f.local)}</p></li>`).join('')}</ol>`;
  };

  /** Card de tema (Ansiedade, Sono, Rotina, Exaustão) */
  DL.cartaoTema = function (t = {}) {
    const tag = t.href ? 'a' : 'div';
    return `<${tag} ${attrs({ class: cls('cartao-tema', `cartao-tema--${t.tom}`, t.estado && `is-${t.estado}`), href: t.href })}>${ic(t.icone)}<span class="cartao-tema__nome">${esc(t.nome)}</span><span class="cartao-tema__desc">${esc(t.descricao)}</span></${tag}>`;
  };
  DL.gradeTemas = (lista = []) => `<div class="grade-temas">${lista.map(DL.cartaoTema).join('')}</div>`;

  /** Local de atendimento */
  DL.local = function (l = {}) {
    const mapa = `<svg viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="225" fill="#A8BCB0"/>
      <path d="M-10 150 Q 120 120 210 160 T 420 140" stroke="#FFF3E4" stroke-width="14" fill="none"/>
      <path d="M140 -10 L 180 240" stroke="#FFF3E4" stroke-width="10" fill="none"/>
      <path d="M-10 60 L 420 90" stroke="#FFF3E4" stroke-width="6" fill="none" opacity=".8"/>
      <ellipse cx="330" cy="250" rx="140" ry="70" fill="#5C612B"/>
      <circle cx="60" cy="40" r="18" fill="#EE6926"/>
      <g transform="translate(166 66)"><path d="M18 52s-18-15.6-18-30.6a18 18 0 0 1 36 0C36 36.4 18 52 18 52Z" fill="#2A433D"/><circle cx="18" cy="21" r="6.5" fill="#FEE6CE"/></g></svg>`;
    const info = (l.info || []).map((i) => `<li>${ic(i.icone)}<div><strong>${esc(i.titulo)}</strong><br><span>${esc(i.texto)}</span>${i.exemplo ? ' ' + DL.exemplo() : ''}</div></li>`).join('');
    // Mapa interativo do Google (iframe), mostrado direto. O fundo do card
    // usa o mesmo cinza do carregamento do Google, então a carga é discreta.
    if (l.mapaEmbed) {
      const mapaEmbed = `<div class="local__mapa local__mapa--embed"><iframe src="${esc(l.mapaEmbed)}" title="Mapa interativo: ${esc(l.nome || l.endereco)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`;
      return DL.local({ ...l, mapaEmbed: null, _mapaPronto: mapaEmbed });
    }
    // O mapa ilustrado (ou o print) também é um link para o Google Maps
    const mapaTag = l.mapaHref ? `a href="${esc(l.mapaHref)}" target="_blank" rel="noopener" aria-label="Abrir ${esc(l.nome || l.endereco)} no Google Maps (abre em nova aba)"` : 'div';
    return `<article class="cartao local">
      ${l._mapaPronto || `<${mapaTag} class="${cls('local__mapa', l.mapaImagem && 'local__mapa--real')}">${l.mapaImagem
        ? `<img src="${esc(l.mapaImagem)}" alt="${esc(l.mapaAlt || 'Mapa do local de atendimento')}" loading="lazy" decoding="async"><span class="local__mapa-credito">${esc(l.mapaCredito || '© Google')}</span><span class="local__mapa-acao" aria-hidden="true">${ic('externo')}Ver no Google Maps</span>`
        : `${mapa}<span class="local__mapa-rotulo">${DL.exemplo('mapa ilustrativo')}</span>`}</${l.mapaHref ? 'a' : 'div'}>`}
      <div class="local__corpo">
        <div><p class="eyebrow">${esc(l.eyebrow || 'Consultório')}</p>${l.nome ? `<p class="local__endereco">${esc(l.nome)}</p><p class="t-pequeno" style="margin-top:4px">${esc(l.endereco)}</p>` : `<p class="local__endereco">${esc(l.endereco)}</p>`}<p class="t-legenda">${esc(l.complemento || '')} ${l.exemplo ? DL.exemplo() : ''}</p></div>
        <ul class="lista-info">${info}</ul>
        <div class="local__acoes">${DL.botao({ variante: 'secundario', icone: 'mapa', texto: 'Abrir no mapa', href: l.mapaHref, externo: true })}${l.modalidades ? l.modalidades.map((m) => DL.badge({ texto: m.texto, icone: m.icone, tom: 'contorno' })).join('') : ''}</div>
      </div></article>`;
  };

  /** Como agendar (3 passos + botão) */
  DL.comoAgendar = function (o = {}) {
    return `<div class="cartao superficie-floresta com-ilustracao" style="border:0">
      <p class="eyebrow">${esc(o.eyebrow || 'Como agendar')}</p>
      <h3 class="t-h3" style="margin:6px 0 var(--esp-5)">${enfase(o.titulo || 'Horários sob agendamento pelo *WhatsApp*')}</h3>
      <ol class="passos">${(o.passos || []).map((p) => `<li><div><strong>${esc(p.titulo)}</strong><span>${esc(p.texto)}</span></div></li>`).join('')}</ol>
      <div style="margin-top:var(--esp-5)">${DL.botaoWhatsApp({ numero: o.numero, mensagem: o.mensagem, bloco: true, texto: o.botao || 'Agende no WhatsApp' })}</div>
      ${o.nota ? `<p class="t-legenda" style="margin-top:var(--esp-3);text-align:center">${esc(o.nota)}</p>` : ''}
    </div>`;
  };

  /** Formulário de pré-agendamento (abre o WhatsApp com a mensagem pronta) */
  DL.formularioAgendamento = function (o = {}) {
    const id = o.id || uid('form');
    return `<form class="formulario" id="${id}" novalidate data-form-agendamento data-numero="${esc(o.numero)}" ${o.simularErro ? 'data-simular-erro' : ''}>
      <div class="alerta-envio" aria-live="assertive"></div>
      ${DL.campo({ id: `${id}-nome`, nome: 'nome', rotulo: 'Seu nome', obrigatorio: true, autocomplete: 'name', placeholder: 'Como prefere ser chamada', msgObrigatorio: 'Escreva seu nome para a equipe saber com quem fala.' })}
      ${DL.campo({ id: `${id}-email`, nome: 'email', rotulo: 'E-mail', tipo: 'email', autocomplete: 'email', placeholder: 'nome@exemplo.com', ajuda: 'Só para enviar a confirmação, se você quiser.' })}
      ${DL.grupoOpcoes({ nome: `${id}-tipo`, legenda: 'Tipo de consulta', linha: true, obrigatorio: true, erro: 'Escolha o tipo de consulta.', itens: [{ texto: 'Primeira consulta', valor: 'Primeira consulta', marcado: true }, { texto: 'Retorno', valor: 'Retorno' }] })}
      ${DL.interruptor({ id: `${id}-tele`, nome: 'teleconsulta', texto: 'Prefiro teleconsulta', descricao: 'Atendimento por vídeo, com o mesmo cuidado.' })}
      ${DL.campo({ id: `${id}-pag`, nome: 'pagamento', rotulo: 'Forma de atendimento', tipo: 'select', obrigatorio: true, placeholder: 'Selecione', msgObrigatorio: 'Selecione uma forma de atendimento.', opcoes: o.pagamentos || ['Particular', 'Particular com reembolso do plano'] })}
      ${DL.chips({ nome: 'dias', legenda: 'Dias de preferência', itens: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d, i) => ({ texto: d, valor: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][i], rotulo: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][i] })) })}
      ${DL.chips({ nome: 'turnos', legenda: 'Turno de preferência', itens: ['Manhã', 'Tarde', 'Noite'] })}
      ${DL.campo({ id: `${id}-obs`, nome: 'observacao', rotulo: 'Observação', tipo: 'textarea', max: 280, linhas: 3, placeholder: 'Algo que ajude a organizar o horário', ajuda: 'Não é preciso descrever sintomas aqui.' })}
      <div>${DL.opcao({ id: `${id}-lgpd`, nome: 'lgpd', obrigatorio: true, html: 'Concordo com o uso destes dados só para o agendamento, conforme a <a href="#privacidade">política de privacidade</a>.' })}
        <div class="campo__erro" id="${id}-lgpd-erro" aria-live="polite">${ic('erro')}<span>Para seguir, é preciso concordar com o uso dos dados.</span></div></div>
      ${DL.botao({ tipo: 'submit', variante: 'destaque', icone: 'whatsapp', texto: 'Continuar no WhatsApp', bloco: true })}
      <p class="formulario__nota">${ic('cadeado')}<span>Nada é salvo nesta página. Ao continuar, a mensagem abre pronta no seu WhatsApp e você revisa antes de enviar.</span></p>
      <div class="formulario__sucesso" role="status" tabindex="-1">
        <span class="icone-circulo">${ic('check', { tamanho: 'g' })}</span>
        <p class="t-h4">Sua mensagem está <em class="enfase">pronta</em></p>
        <p class="t-legenda">Abra o WhatsApp para revisar e enviar. A equipe responde com os horários disponíveis.</p>
        <pre class="formulario__mensagem" data-mensagem></pre>
        ${DL.botao({ variante: 'destaque', icone: 'whatsapp', texto: 'Abrir o WhatsApp', href: '#', externo: true, bloco: true, attrs: { 'data-link-final': '' } })}
        ${DL.botao({ variante: 'discreto', texto: 'Editar respostas', attrs: { 'data-editar': '' } })}
      </div>
    </form>`;
  };

  /** Card de conteúdo (Reel, carrossel, guia) */
  DL.cartaoConteudo = function (c = {}) {
    const iconeTipo = { Reel: 'reel', Carrossel: 'carrossel', Guia: 'documento' }[c.tipo] || 'link';
    const iconeTema = { ansiedade: 'espiral', sono: 'lua', rotina: 'sol-nascente', exaustao: 'bateria' }[c.tema] || 'folha';
    return `<a ${attrs({ class: cls('cartao-conteudo', c.estado && `is-${c.estado}`), href: c.href || '#', target: c.href?.startsWith('http') ? '_blank' : null, rel: 'noopener' })}>
      <span class="cartao-conteudo__miniatura cartao-conteudo__miniatura--${esc(c.tema || 'rotina')}" aria-hidden="true">${ic(iconeTema)}<span class="cartao-conteudo__tipo">${ic(iconeTipo)}${esc(c.tipo)}</span></span>
      <span class="cartao-conteudo__texto">
        <span class="cartao-conteudo__meta"><span>${esc(c.tipo)}${c.duracao ? ' · ' + esc(c.duracao) : ''}</span>${c.exemplo ? DL.exemplo() : ''}</span>
        <span class="cartao-conteudo__titulo">${esc(c.titulo)}</span>
        <span class="cartao-conteudo__desc">${esc(c.descricao)}</span>
      </span>${c.href?.startsWith('http') ? '<span class="visualmente-oculto">(abre em nova aba)</span>' : ''}</a>`;
  };
  DL.listaConteudos = (lista = []) => lista.length ? `<div class="lista-conteudos">${lista.map(DL.cartaoConteudo).join('')}</div>` : DL.estadoVazio({ titulo: 'Nada por aqui ainda', texto: 'Os próximos conteúdos aparecem aqui assim que forem publicados.' });

  /** Série numerada ("Os pesos 01/02/03") */
  DL.serie = function (s = {}) {
    return `<section class="serie cartao--destaque superficie-pessego" aria-label="${esc(s.nome)}">
      <div class="serie__cabecalho"><div><p class="eyebrow">Série</p><h3 class="t-h3" style="margin:0">${enfase(s.nome)}</h3></div>${s.exemplo ? DL.exemplo() : ''}</div>
      <ol class="serie__itens">${(s.itens || []).map((it, i) => `<li class="${cls('serie__item', !it.href && 'serie__item--breve')}">${it.href
        ? `<a href="${esc(it.href)}" ${it.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}><span class="serie__num">${String(i + 1).padStart(2, '0')}</span><span class="serie__titulo">${esc(it.titulo)}</span></a>`
        : `<div><span class="serie__num">${String(i + 1).padStart(2, '0')}</span><span class="serie__titulo">${esc(it.titulo || 'Em breve')}</span></div>`}</li>`).join('')}</ol>
    </section>`;
  };

  /** Convênios */
  DL.convenios = function (o = {}) {
    return `<div>${o.texto ? `<p class="t-pequeno" style="margin-bottom:var(--esp-4)">${esc(o.texto)} ${o.exemplo ? DL.exemplo() : ''}</p>` : ''}<ul class="convenios">${(o.lista || []).map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>`;
  };

  /** Contato rápido com copiar */
  DL.contatos = function (lista = []) {
    return `<ul class="contatos">${lista.map((c) => `<li class="contato">${ic(c.icone)}
      <div class="contato__texto"><span class="contato__rotulo">${esc(c.rotulo)}</span>${c.href ? `<a class="contato__valor" href="${esc(c.href)}" ${c.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${esc(c.valor)}${c.exemplo ? DL.exemplo() : ''}</a>` : `<span class="contato__valor">${esc(c.valor)}</span>`}</div>
      ${DL.botao({ variante: 'discreto', somenteIcone: true, icone: 'copiar', iconeTroca: 'check', texto: `Copiar ${c.rotulo.toLowerCase()}`, classe: 'btn-copiar', attrs: { 'data-copiar': c.copiar || c.valor } })}</li>`).join('')}</ul>`;
  };

  /** Botão flutuante (aparece quando o CTA principal sai da tela) */
  DL.flutuante = function (o = {}) {
    return `<div class="${cls('flutuante', o.estatico && 'flutuante--estatico')}" data-flutuante="${esc(o.observar || '')}" ${o.ocultarEm ? `data-flutuante-ocultar="${esc(o.ocultarEm)}"` : ''}>${DL.botaoWhatsApp({ numero: o.numero, mensagem: o.mensagem, texto: o.texto || 'Agende no WhatsApp' })}</div>`;
  };

  /** Aviso de cuidado (não substitui consulta + CVV/SAMU) */
  DL.avisoCrise = function () {
    return DL.alerta({
      tipo: 'cuidado', classe: 'aviso-crise', role: 'note', titulo: 'Esta página não substitui uma consulta',
      html: 'Se você estiver em crise ou pensando em se machucar, ligue para o <strong>CVV, 188</strong> (24 horas, gratuito) ou para o <strong>SAMU, 192</strong>, ou procure o pronto-socorro mais próximo. <a href="tel:188">Ligar para o 188</a>'
    });
  };

  /** Rodapé */
  DL.rodape = function (r = {}) {
    return `<footer class="rodape">
      <img class="rodape__monograma" src="${esc(r.monograma)}" alt="Monograma LA, Dra. Lais Azevedo">
      <p class="rodape__nome">${esc(r.nome)}</p>
      <p>${esc(r.titulo)} · ${esc(r.registro)}</p>
      <p>Responsável técnica: ${esc(r.nome)}, ${esc(r.registro)}</p>
      ${r.endereco ? `<p>${esc(r.endereco)} ${r.exemplo ? DL.exemplo() : ''}</p>` : ''}
      <ul class="rodape__links">${(r.links || []).map((l) => `<li><a href="${esc(l.href)}">${esc(l.texto)}</a></li>`).join('')}</ul>
      <p>© ${new Date().getFullYear()} ${esc(r.nome)}. Informação educativa, não substitui consulta.</p>
    </footer>`;
  };

  /* ---------- Estados ---------- */
  DL.estadoVazio = (o = {}) => `<div class="estado com-ilustracao">${DL.ilustracao('folha', { canto: 'canto-inf-dir', largura: 70, estilo: 'right:-10px;bottom:-10px;opacity:.9' })}<span class="estado__icone">${ic(o.icone || 'folha', { tamanho: 'g' })}</span><p class="estado__titulo">${esc(o.titulo)}</p><p class="estado__texto">${esc(o.texto)}</p>${o.acao || ''}</div>`;
  DL.estadoErro = (o = {}) => `<div class="estado estado--erro" role="alert"><span class="estado__icone">${ic('erro', { tamanho: 'g' })}</span><p class="estado__titulo">${esc(o.titulo || 'Não conseguimos carregar')}</p><p class="estado__texto">${esc(o.texto || 'Pode ser a conexão. Tente de novo em instantes.')}</p>${DL.botao({ variante: 'secundario', icone: 'atualizar', texto: 'Tentar de novo', attrs: { 'data-tentar': '' } })}</div>`;
  DL.skeletonLink = (n = 3) => `<div class="pilha-links" aria-busy="true" aria-label="Carregando links">${Array.from({ length: n }, () => '<div class="skeleton-link"><span class="skeleton s-icone"></span><span class="skeleton-linhas"><span class="skeleton s-linha s-linha--titulo"></span><span class="skeleton s-linha s-linha--curta"></span></span></div>').join('')}</div>`;
  DL.skeletonCartao = () => `<div class="cartao" aria-busy="true" aria-label="Carregando"><div class="skeleton" style="aspect-ratio:16/9;border-radius:var(--raio-sm);margin-bottom:var(--esp-4)"></div><div class="skeleton-linhas"><span class="skeleton s-linha s-linha--titulo"></span><span class="skeleton s-linha"></span><span class="skeleton s-linha s-linha--curta"></span></div></div>`;

  /* ======================================================================
     COMPORTAMENTO
     ====================================================================== */

  async function copiarTexto(texto) {
    try { await navigator.clipboard.writeText(texto); return true; }
    catch (e) {
      const t = document.createElement('textarea');
      t.value = texto; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (_) { /* sem suporte */ }
      t.remove(); return ok;
    }
  }

  function mascaraTelefone(v) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function definirErroCampo(campoEl, msg) {
    if (!campoEl) return;
    const entrada = campoEl.querySelector('.campo__entrada, input');
    const erro = campoEl.querySelector('.campo__erro span');
    if (msg) {
      campoEl.classList.add('is-erro');
      entrada?.setAttribute('aria-invalid', 'true');
      if (erro) erro.textContent = msg;
    } else {
      campoEl.classList.remove('is-erro');
      entrada?.removeAttribute('aria-invalid');
    }
  }

  function iniciarFormulario(form) {
    const numero = form.dataset.numero;
    const campo = (nome) => form.elements[nome];
    const validar = () => {
      const erros = [];
      const nome = campo('nome');
      const vNome = nome.value.trim();
      const cNome = nome.closest('.campo');
      if (vNome.length < 2) { definirErroCampo(cNome, nome.dataset.msgObrigatorio); erros.push(nome); } else definirErroCampo(cNome, null);

      const email = campo('email');
      const cEmail = email.closest('.campo');
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { definirErroCampo(cEmail, 'Confira o e-mail. Exemplo: nome@exemplo.com'); erros.push(email); } else definirErroCampo(cEmail, null);

      const pag = campo('pagamento');
      const cPag = pag.closest('.campo');
      if (!pag.value) { definirErroCampo(cPag, pag.dataset.msgObrigatorio); erros.push(pag); } else definirErroCampo(cPag, null);

      const lgpd = campo('lgpd');
      const cLgpd = lgpd.closest('div');
      const opcaoLgpd = lgpd.closest('.opcao');
      if (!lgpd.checked) { cLgpd.querySelector('.campo__erro').style.display = 'flex'; opcaoLgpd.classList.add('is-erro'); lgpd.setAttribute('aria-invalid', 'true'); lgpd.setAttribute('aria-describedby', cLgpd.querySelector('.campo__erro').id); erros.push(lgpd); }
      else { cLgpd.querySelector('.campo__erro').style.display = ''; opcaoLgpd.classList.remove('is-erro'); lgpd.removeAttribute('aria-invalid'); }
      return erros;
    };

    const montarMensagem = () => {
      const marcados = (n) => [...form.querySelectorAll(`input[name="${n}"]:checked`)].map((i) => i.value);
      const tipo = form.querySelector('fieldset.grupo-opcoes input:checked')?.value || 'Primeira consulta';
      const linhas = [
        `Olá, Dra. Lais! Gostaria de agendar uma consulta médica.`,
        ``,
        `Nome: ${campo('nome').value.trim()}`,
        `Consulta: ${tipo}${campo('teleconsulta').checked ? ' (teleconsulta)' : ''}`,
        `Atendimento: ${campo('pagamento').value}`
      ];
      const dias = marcados('dias'); const turnos = marcados('turnos');
      if (dias.length) linhas.push(`Dias de preferência: ${dias.join(', ')}`);
      if (turnos.length) linhas.push(`Turno: ${turnos.join(', ')}`);
      if (campo('email').value.trim()) linhas.push(`E-mail: ${campo('email').value.trim()}`);
      if (campo('observacao').value.trim()) linhas.push(`Observação: ${campo('observacao').value.trim()}`);
      return linhas.join('\n');
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const alerta = form.querySelector('.alerta-envio');
      alerta.innerHTML = '';
      const erros = validar();
      if (erros.length) {
        alerta.innerHTML = DL.alerta({ tipo: 'erro', titulo: erros.length === 1 ? 'Falta um detalhe' : `Faltam ${erros.length} detalhes`, texto: 'Confira os campos marcados abaixo.' });
        // Tremida curta só nos campos com erro (reinicia se clicar de novo)
        erros.forEach((el) => {
          const alvo = el.closest('.campo, .opcao') || el;
          alvo.classList.remove('is-tremendo'); void alvo.offsetWidth; alvo.classList.add('is-tremendo');
          alvo.addEventListener('animationend', () => alvo.classList.remove('is-tremendo'), { once: true });
        });
        erros[0].focus({ preventScroll: false });
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      btn.setAttribute('aria-busy', 'true'); btn.disabled = true;
      setTimeout(() => {
        btn.removeAttribute('aria-busy'); btn.disabled = false;
        if (form.hasAttribute('data-simular-erro') && !form.dataset.tentou) {
          form.dataset.tentou = '1';
          alerta.innerHTML = DL.alerta({ tipo: 'erro', titulo: 'Não conseguimos preparar a mensagem', html: `Tente de novo ou <a href="${DL.linkWhatsApp(numero, 'Olá, Dra. Lais! Gostaria de agendar uma consulta médica.')}" target="_blank" rel="noopener">chame direto no WhatsApp</a>.` });
          alerta.querySelector('.alerta')?.setAttribute('tabindex', '-1');
          alerta.querySelector('.alerta')?.focus();
          return;
        }
        const msg = montarMensagem();
        form.querySelector('[data-mensagem]').textContent = msg;
        form.querySelector('[data-link-final]').href = DL.linkWhatsApp(numero, msg);
        form.classList.add('is-enviado');
        form.querySelector('.formulario__sucesso').focus();
      }, 900);
    });

    form.querySelector('[data-editar]')?.addEventListener('click', () => {
      form.classList.remove('is-enviado');
      delete form.dataset.tentou;
      campo('nome').focus();
    });
    // Limpa erro ao corrigir
    form.addEventListener('input', (e) => {
      const c = e.target.closest('.campo');
      if (c?.classList.contains('is-erro')) definirErroCampo(c, null);
    });
    form.addEventListener('change', (e) => {
      if (e.target.name === 'lgpd' && e.target.checked) {
        const d = e.target.closest('div'); d.querySelector('.campo__erro').style.display = '';
        e.target.closest('.opcao').classList.remove('is-erro'); e.target.removeAttribute('aria-invalid');
      }
      if (e.target.name === 'pagamento') definirErroCampo(e.target.closest('.campo'), null);
    });
  }

  /** Fecha o modal com animação de saída (mais curta que a entrada) */
  DL.fecharModal = function (d) {
    if (!d.open || d.classList.contains('is-fechando')) return;
    const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    d.classList.add('is-fechando');
    const fim = () => { d.classList.remove('is-fechando'); d.style.transform = ''; d.close(); };
    if (reduzido) return fim();
    setTimeout(fim, d.classList.contains('modal--folha') || matchMedia('(max-width: 560px)').matches ? 280 : 160);
  };

  /** Liga todos os comportamentos dentro de raiz */
  DL.iniciar = function (raiz = document) {
    // Accordion
    raiz.querySelectorAll('[data-acordeao]').forEach((acc) => {
      acc.addEventListener('click', (e) => {
        const b = e.target.closest('.acordeao__botao'); if (!b || !acc.contains(b)) return;
        const abrir = b.getAttribute('aria-expanded') !== 'true';
        if (abrir && acc.hasAttribute('data-unico')) acc.querySelectorAll('.acordeao__botao[aria-expanded="true"]').forEach((o) => { o.setAttribute('aria-expanded', 'false'); document.getElementById(o.getAttribute('aria-controls')).inert = true; });
        b.setAttribute('aria-expanded', String(abrir));
        document.getElementById(b.getAttribute('aria-controls')).inert = !abrir;
      });
    });

    // Abas (setas, Home, End)
    raiz.querySelectorAll('[data-abas]').forEach((ab) => {
      const tabs = [...ab.querySelectorAll('[role="tab"]')];
      const indicador = ab.querySelector('.abas__indicador');
      // Indicador com 1 px de largura, posicionado só com transform (sem animar width)
      const moverIndicador = (t) => { if (!indicador || !t.offsetWidth) return; indicador.style.transform = `translateX(${t.offsetLeft + 10}px) scaleX(${t.offsetWidth - 20})`; };
      const selecionar = (t, teclado) => {
        tabs.forEach((x) => { const s = x === t; x.setAttribute('aria-selected', String(s)); x.tabIndex = s ? 0 : -1; document.getElementById(x.getAttribute('aria-controls')).hidden = !s; });
        // ação de teclado não anima (é repetida muitas vezes)
        ab.classList.toggle('is-teclado', !!teclado);
        moverIndicador(t);
        if (teclado) t.focus();
      };
      tabs.forEach((t) => t.addEventListener('click', () => selecionar(t)));
      // posição inicial sem animar
      const inicial = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
      if (indicador && inicial) {
        indicador.style.transition = 'none';
        moverIndicador(inicial);
        requestAnimationFrame(() => requestAnimationFrame(() => { indicador.style.transition = ''; }));
        if ('ResizeObserver' in window) new ResizeObserver(() => moverIndicador(tabs.find((t) => t.getAttribute('aria-selected') === 'true'))).observe(ab);
      }
      ab.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
        const ativos = tabs.filter((t) => !t.disabled);
        const i = ativos.indexOf(document.activeElement);
        if (i < 0) return;
        const mapa = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: ativos.length - 1 };
        if (!(e.key in mapa)) return;
        e.preventDefault();
        selecionar(ativos[(mapa[e.key] + ativos.length) % ativos.length], true);
      });
    });

    // Tooltip: Esc fecha
    raiz.querySelectorAll('[data-tooltip]').forEach((t) => {
      t.addEventListener('keydown', (e) => { if (e.key === 'Escape') t.classList.add('is-fechado'); });
      t.addEventListener('mouseleave', () => t.classList.remove('is-fechado'));
      t.addEventListener('focusout', () => t.classList.remove('is-fechado'));
    });

    // Modal
    raiz.querySelectorAll('[data-abrir-modal]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      const d = document.getElementById(b.dataset.abrirModal);
      if (d?.showModal) d.showModal();
    }));
    raiz.querySelectorAll('dialog.modal').forEach((d) => {
      d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-fechar-modal]')) DL.fecharModal(d); });
      // Esc também fecha com a animação de saída
      d.addEventListener('cancel', (e) => { e.preventDefault(); DL.fecharModal(d); });
    });

    // Fechar alerta
    raiz.addEventListener('click', (e) => {
      const f = e.target.closest('[data-fechar-alerta]'); if (f) f.closest('.alerta')?.remove();
    });

    // Copiar
    raiz.querySelectorAll('[data-copiar]').forEach((b) => b.addEventListener('click', async () => {
      const ok = await copiarTexto(b.dataset.copiar);
      if (ok) {
        b.classList.add('is-copiado');
        DL.toast('Copiado: ' + b.dataset.copiar);
        clearTimeout(b._t);
        b._t = setTimeout(() => b.classList.remove('is-copiado'), 1800);
      } else DL.toast('Não deu para copiar. Selecione o texto e copie manualmente.', { tipo: 'erro' });
    }));

    // Máscara de telefone
    raiz.querySelectorAll('[data-mascara="telefone"]').forEach((i) => i.addEventListener('input', () => { i.value = mascaraTelefone(i.value); }));

    // Contador de caracteres
    raiz.querySelectorAll('[maxlength]').forEach((i) => {
      const c = raiz.querySelector(`[data-contador="${i.id}"]`); if (!c) return;
      i.addEventListener('input', () => { c.textContent = `${i.value.length}/${i.maxLength}`; });
    });

    // Formulários de agendamento
    raiz.querySelectorAll('[data-form-agendamento]').forEach(iniciarFormulario);

    // Botão flutuante: fica fixo no rodapé (celular e desktop) a partir do
    // momento em que o CTA principal do topo sai de vista, e se recolhe
    // enquanto uma seção com o próprio botão (ex.: "Como agendar") está na tela.
    raiz.querySelectorAll('[data-flutuante]').forEach((f) => {
      const alvo = f.dataset.flutuante && document.querySelector(f.dataset.flutuante);
      if (!alvo) { f.classList.add('is-visivel'); return; }
      const ocultar = f.dataset.flutuanteOcultar ? [...document.querySelectorAll(f.dataset.flutuanteOcultar)] : [];
      const naTela = (el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
      const atualizar = () => f.classList.toggle('is-visivel', alvo.getBoundingClientRect().bottom < 0 && !ocultar.some(naTela));
      if ('IntersectionObserver' in window) { const io = new IntersectionObserver(atualizar); [alvo, ...ocultar].forEach((el) => io.observe(el)); }
      // reforço: alguns frames (prévia embutida) não disparam o observer na rolagem
      addEventListener('scroll', atualizar, { passive: true });
      atualizar();
    });

    // Tentar de novo (estado de erro): simula recarregar
    raiz.querySelectorAll('[data-tentar]').forEach((b) => b.addEventListener('click', () => {
      b.setAttribute('aria-busy', 'true');
      setTimeout(() => { b.removeAttribute('aria-busy'); DL.toast('Conteúdos carregados.', { tipo: 'info' }); }, 1200);
    }));

    // Simular carregamento em botões (catálogo)
    raiz.querySelectorAll('[data-simular-carregamento]').forEach((b) => b.addEventListener('click', (e) => {
      e.preventDefault();
      b.setAttribute('aria-busy', 'true');
      setTimeout(() => b.removeAttribute('aria-busy'), 1600);
    }));
  };
})(window.DL = window.DL || {});
