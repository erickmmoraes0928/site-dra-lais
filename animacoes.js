/* ==========================================================================
   Dra. Lais Azevedo · Comportamentos de movimento
   Carregue depois de componentes.js. Substitui DL.toast pela versão
   empilhada (estilo Sonner) e liga a folha arrastável (estilo Vaul).
   ========================================================================== */
(function (DL) {
  'use strict';
  const reduzido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-anim');

  /* ======================================================================
     TOASTS EMPILHADOS
     · entram de baixo, os antigos recuam (escala 0,95 por nível)
     · hover expande a pilha e pausa o tempo
     · arrastar para baixo fecha (distância ou velocidade)
     ====================================================================== */
  const GAP = 10, VISIVEIS = 3;
  let regiao = null, lista = [], expandido = false;

  function criarRegiao() {
    regiao = document.createElement('section');
    regiao.className = 'toasts';
    regiao.setAttribute('aria-label', 'Notificações');
    regiao.setAttribute('aria-live', 'polite');
    regiao.setAttribute('role', 'status');
    regiao.addEventListener('mouseenter', () => { expandido = true; layout(); lista.forEach((t) => t.pausar()); }, true);
    regiao.addEventListener('mouseleave', (e) => {
      if (regiao.contains(e.relatedTarget)) return;
      expandido = false; layout(); lista.forEach((t) => t.retomar());
    }, true);
    document.addEventListener('visibilitychange', () => lista.forEach((t) => (document.hidden ? t.pausar() : t.retomar())));
    document.body.appendChild(regiao);
  }

  function layout() {
    let acumulado = 0;
    const frente = lista[0]?.el.offsetHeight || 0;
    lista.forEach((t, i) => {
      const h = t.el.offsetHeight;
      let y, s;
      if (expandido) { y = -acumulado; s = 1; }
      else { y = -i * 12; s = 1 - i * 0.05; }
      acumulado += h + GAP;
      t.el.style.setProperty('--y', `${y}px`);
      t.el.style.setProperty('--s', s);
      // na pilha fechada, os de trás assumem a altura da frente para não "vazar"
      t.el.style.height = !expandido && i > 0 && frente ? `${frente}px` : '';
      t.el.style.overflow = !expandido && i > 0 ? 'hidden' : '';
      t.el.style.zIndex = String(100 - i);
      t.el.dataset.oculto = String(i >= VISIVEIS);
      t.el.setAttribute('aria-hidden', i >= VISIVEIS ? 'true' : 'false');
    });
  }

  DL.toast = function (texto, o = {}) {
    if (!regiao || !document.body.contains(regiao)) criarRegiao();
    const tipo = o.tipo || 'sucesso';
    const el = document.createElement('div');
    el.className = `toast toast--${tipo}`;
    el.dataset.montado = 'false';
    el.innerHTML = `${DL.icone(tipo === 'erro' ? 'erro' : tipo === 'info' ? 'info' : 'sucesso')}<span class="toast__texto">${DL.esc(texto)}</span>` +
      (o.acao ? DL.botao({ variante: 'discreto', tamanho: 'p', texto: o.acao.texto, attrs: { 'data-toast-acao': '' } }) : '') +
      DL.botao({ variante: 'discreto', tamanho: 'p', somenteIcone: true, icone: 'fechar', texto: 'Fechar notificação', attrs: { 'data-toast-fechar': '' } });

    const duracao = o.duracao || 4000;
    let restante = duracao, inicio = 0, timer = null, saiu = false;
    const t = {
      el,
      pausar() { if (timer) { clearTimeout(timer); timer = null; restante -= performance.now() - inicio; } },
      retomar() { if (!timer && !saiu) { inicio = performance.now(); timer = setTimeout(sair, Math.max(restante, 800)); } }
    };
    function sair() {
      if (saiu) return; saiu = true;
      clearTimeout(timer);
      el.dataset.saindo = 'true';
      lista = lista.filter((x) => x !== t);
      layout();
      setTimeout(() => el.remove(), reduzido() ? 0 : 240);
    }
    t.sair = sair;

    el.querySelector('[data-toast-fechar]').addEventListener('click', sair);
    if (o.acao) el.querySelector('[data-toast-acao]').addEventListener('click', () => { o.acao.aoClicar?.(); sair(); });

    // Arrastar para baixo para fechar
    let y0 = 0, t0 = 0, dy = 0, arrastando = false;
    el.addEventListener('pointerdown', (e) => {
      if (arrastando || e.target.closest('button')) return;
      arrastando = true; y0 = e.clientY; t0 = performance.now(); dy = 0;
      el.setPointerCapture(e.pointerId);
      el.dataset.arrastando = 'true';
    });
    el.addEventListener('pointermove', (e) => {
      if (!arrastando) return;
      const bruto = e.clientY - y0;
      dy = bruto > 0 ? bruto : bruto * 0.15; // resistência para cima
      el.style.transform = `translateY(calc(var(--y) + ${dy}px)) scale(var(--s))`;
    });
    const soltar = () => {
      if (!arrastando) return;
      arrastando = false;
      delete el.dataset.arrastando;
      const vel = dy / Math.max(performance.now() - t0, 1);
      el.style.transform = '';
      if (dy > 45 || vel > 0.11) sair();
    };
    el.addEventListener('pointerup', soltar);
    el.addEventListener('pointercancel', soltar);

    regiao.appendChild(el);
    lista.unshift(t);
    layout();
    // dois frames para o navegador registrar o estado inicial antes de animar
    requestAnimationFrame(() => requestAnimationFrame(() => { el.dataset.montado = 'true'; layout(); }));
    if (expandido) t.pausar(); else t.retomar();
    return el;
  };

  /* ======================================================================
     FOLHA INFERIOR ARRASTÁVEL (modal no celular ou .modal--folha)
     ====================================================================== */
  function ehFolha(d) { return d.classList.contains('modal--folha') || matchMedia('(max-width: 560px)').matches; }

  DL.iniciarFolhas = function (raiz = document) {
    raiz.querySelectorAll('dialog.modal').forEach((d) => {
      if (d._folha) return; d._folha = true;
      let y0 = 0, t0 = 0, dy = 0, ativo = false;
      const inicio = (e) => {
        if (ativo) return; // proteção multitoque: ignora o segundo dedo
        if (!ehFolha(d) || e.target.closest('button, a, input, select, textarea')) return;
        // pela alça, ou pelo corpo só quando ele está rolado no topo
        const corpo = d.querySelector('.modal__corpo');
        if (!e.target.closest('[data-alca], .modal__cabecalho') && corpo && corpo.scrollTop > 0) return;
        ativo = true; y0 = e.clientY; t0 = performance.now(); dy = 0;
        d.classList.add('is-arrastando');
        d.setPointerCapture?.(e.pointerId);
      };
      const mover = (e) => {
        if (!ativo) return;
        const bruto = e.clientY - y0;
        // para cima, resistência logarítmica (não descola do chão)
        dy = bruto >= 0 ? bruto : -Math.log1p(-bruto) * 4;
        d.style.transform = `translateY(${dy}px)`; // transform direto, sem variável CSS herdável
      };
      const fim = () => {
        if (!ativo) return;
        ativo = false;
        const vel = dy / Math.max(performance.now() - t0, 1);
        d.classList.remove('is-arrastando');
        d.classList.add('is-soltando');
        if (dy > d.offsetHeight * 0.25 || vel > 0.5) {
          d.style.transform = 'translateY(100%)';
          setTimeout(() => { d.classList.remove('is-soltando'); d.close(); d.style.transform = ''; }, reduzido() ? 0 : 320);
        } else {
          d.style.transform = '';
          setTimeout(() => d.classList.remove('is-soltando'), 500);
        }
      };
      d.addEventListener('pointerdown', inicio);
      d.addEventListener('pointermove', mover);
      d.addEventListener('pointerup', fim);
      d.addEventListener('pointercancel', fim);
    });
  };

  /* ======================================================================
     TOOLTIP "AQUECIDO": depois do primeiro, os próximos abrem na hora
     ====================================================================== */
  let tAquecido = null, tMostrou = null;
  document.addEventListener('mouseover', (e) => {
    const tip = e.target.closest?.('[data-tooltip]'); if (!tip) return;
    clearTimeout(tAquecido);
    clearTimeout(tMostrou);
    tMostrou = setTimeout(() => { document.documentElement.dataset.tooltipAquecido = ''; }, 380);
  });
  document.addEventListener('mouseout', (e) => {
    const tip = e.target.closest?.('[data-tooltip]'); if (!tip || tip.contains(e.relatedTarget)) return;
    clearTimeout(tMostrou);
    tAquecido = setTimeout(() => { delete document.documentElement.dataset.tooltipAquecido; }, 600);
  });

  /* ======================================================================
     ENTRADA EM CASCATA E REVELAR AO ROLAR
     ====================================================================== */
  /** Marca filhos com .entrada e índice para cascata (só na 1ª carga) */
  DL.cascata = function (elementos, inicio = 0) {
    [...elementos].forEach((el, i) => {
      el.classList.add('entrada'); el.style.setProperty('--i', inicio + i);
      // ao terminar, sai a animação para não "prender" o transform do hover/toque
      el.addEventListener('animationend', (e) => { if (e.target === el) { el.classList.remove('entrada'); el.style.removeProperty('--i'); } }, { once: true });
    });
  };

  /** Revela elementos quando entram na tela, uma vez */
  DL.revelar = function (elementos) {
    const els = [...elementos];
    if (!('IntersectionObserver' in window) || reduzido()) { els.forEach((el) => el.classList.add('revelar', 'is-visivel')); return; }
    const obs = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        el.classList.add('is-visivel'); obs.unobserve(el);
        // devolve as transições próprias do componente (hover, toque) depois da revelação
        setTimeout(() => { el.classList.remove('revelar', 'is-visivel'); el.style.removeProperty('--i'); }, 900);
      }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => { el.classList.add('revelar'); obs.observe(el); });
  };

  /* ======================================================================
     DEMO DE CURVAS (catálogo)
     ====================================================================== */
  DL.iniciarCurvas = function (raiz = document) {
    raiz.querySelectorAll('[data-curvas]').forEach((bloco) => {
      const pistas = [...bloco.querySelectorAll('.curva-pista')];
      const medir = () => pistas.forEach((p) => p.style.setProperty('--pista-w', `${p.clientWidth}px`));
      medir();
      new ResizeObserver(medir).observe(bloco);
      bloco.querySelector('[data-reproduzir]')?.addEventListener('click', () => {
        const ligado = pistas[0].classList.contains('is-rodando');
        pistas.forEach((p) => p.classList.toggle('is-rodando', !ligado));
      });
    });
  };

  DL.iniciarMovimento = function (raiz = document) {
    DL.iniciarFolhas(raiz);
    DL.iniciarCurvas(raiz);
  };
})(window.DL = window.DL || {});
