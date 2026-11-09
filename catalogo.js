/* ==========================================================================
   Catálogo da biblioteca · monta a página de referência com as mesmas
   funções DL.* que constroem o site.
   ========================================================================== */
(function () {
  'use strict';
  const C = window.DL_CONTEUDO;
  const esc = DL.esc;
  const ic = (n, o) => DL.icone(n, o);
  const NUM = C.contato.whatsappNumero;
  const MSG = C.contato.mensagemPadrao;
  const nav = [];

  /* ---------- Helpers de documentação ---------- */
  const parte = (id, titulo, intro, corpo) => { nav.push({ grupo: titulo, itens: [] }); return `<section class="doc-parte" id="${id}" aria-labelledby="${id}-t"><p class="eyebrow">Parte</p><h2 class="t-h1 doc-parte__titulo" id="${id}-t">${DL.enfase(titulo)}</h2><p class="doc-parte__intro">${intro}</p>${corpo()}</section>`; };
  const comp = (id, nome, classe, desc, html) => {
    nav[nav.length - 1].itens.push({ id, nome });
    return `<article class="doc-comp" id="${id}" aria-labelledby="${id}-t"><div class="doc-comp__cab"><h3 class="t-h3" id="${id}-t">${esc(nome)}</h3>${classe ? `<code class="doc-codigo">${esc(classe)}</code>` : ''}</div><p class="doc-comp__desc">${desc}</p>${html}</article>`;
  };
  const demo = (html, o = {}) => `<div class="doc-demo ${o.escuro ? 'doc-demo--escuro superficie-floresta' : ''} ${o.coluna ? 'doc-demo--coluna' : ''} ${o.classe || ''}" style="${o.estilo || ''}">${html}</div>`;
  const grade = (celulas, min = 180) => `<div class="doc-grade" style="--min:${min}px">${celulas.map(([r, h]) => `<div class="doc-celula"><span class="doc-celula__rotulo">${esc(r)}</span>${h}</div>`).join('')}</div>`;
  const sub = (t) => `<p class="doc-subtitulo">${esc(t)}</p>`;

  /* ---------- Contraste (WCAG) ---------- */
  const lum = (hex) => {
    const c = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const razao = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };

  const P = {
    'Creme Sol': ['#FEE6CE', 'Fundo principal', '60%'], 'Marfim': ['#FFF3E4', 'Fundo de leitura', '60%'], 'Pêssego': ['#FCC697', 'Cartões e faixas', '60%'],
    'Sálvia': ['#A8BCB0', 'Respiro', '25%'], 'Oliva': ['#5C612B', 'Acolhimento', '25%'], 'Floresta': ['#2A433D', 'Texto e fundo escuro', '25%'],
    'Laranja Sol': ['#EE6926', 'Botão de destaque, número, sol', '15%'], 'Terracota': ['#BF3727', 'Ênfase e rótulos', '15%'], 'Tijolo': ['#912319', 'Profundidade', '15%']
  };
  const escuras = ['Oliva', 'Floresta', 'Terracota', 'Tijolo'];

  /* ======================================================================
     CAPA
     ====================================================================== */
  const capa = `<header class="doc-capa com-ilustracao">
    ${DL.ilustracao('sol-colina', { canto: 'canto-sup-dir', largura: 200, estilo: 'top:40px;right:-20px' })}
    <p class="eyebrow">Biblioteca de componentes · v1.0 · DNA 2.1</p>
    <h1 class="t-display">Dra. Lais <em>Azevedo</em></h1>
    <p class="t-lead doc-capa__intro">Peças reutilizáveis para o site de apresentação no estilo Linktree: perfil, links, agendamento pelo WhatsApp, conteúdos e contato. Tudo construído com os mesmos tokens da paleta Sol &amp; Sálvia.</p>
    <div class="doc-capa__meta">${DL.badge({ texto: 'Mobile first · coluna de 480 px', tom: 'contorno' })}${DL.badge({ texto: 'WCAG AA', tom: 'contorno', icone: 'check' })}${DL.badge({ texto: 'Sem dependências', tom: 'contorno' })}</div>
    <div class="doc-linha" style="margin-top:24px">${DL.botao({ texto: 'Ver página montada', href: 'index.html', iconeFim: 'seta' })}${DL.botao({ variante: 'secundario', texto: 'Ir ao exemplo no catálogo', href: '#montado' })}</div>
    <p class="t-legenda" style="margin-top:20px">Itens com ${DL.exemplo()} são fictícios. Troque em <code class="doc-codigo">conteudo.js</code>.</p>
  </header>`;

  /* ======================================================================
     FUNDAMENTOS
     ====================================================================== */
  const fundamentos = () => {
    const cores = Object.entries(P).map(([n, [hex, papel, grupo]]) => `<div class="doc-cor"><div class="doc-cor__amostra" style="background:${hex};color:${escuras.includes(n) ? '#FEE6CE' : '#2A433D'}">Aa</div><div class="doc-cor__info"><strong>${n}</strong><code>${hex} · --cor-${n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(' ', '-')}</code><span class="t-suave">${papel} · ${grupo}</span></div></div>`).join('');
    const semanticos = [
      ['--fundo', 'Creme Sol'], ['--superficie', 'Marfim'], ['--texto', 'Floresta'], ['--texto-suave', '#435650'], ['--texto-enfase', 'Terracota'],
      ['--acao', 'Floresta'], ['--acao-hover', 'Oliva'], ['--acao-destaque', 'Laranja Sol'], ['--borda-campo', '#7F897F'], ['--feedback-erro', 'Terracota'], ['--feedback-sucesso', 'Oliva'], ['--foco', 'Floresta']
    ].map(([t, v]) => `<tr><td><code class="doc-codigo">${t}</code></td><td>${v}</td></tr>`).join('');

    const pares = [
      ['Floresta', 'Creme Sol', 'Texto principal'], ['Floresta', 'Marfim', 'Texto em cartões e campos'], ['Floresta', 'Pêssego', 'Texto em faixas'], ['Floresta', 'Sálvia', 'Texto em respiro'],
      ['#435650', 'Creme Sol', 'Texto suave'], ['#435650', 'Pêssego', 'Texto suave em faixas'], ['#435650', 'Sálvia', 'Texto suave em Sálvia'],
      ['Creme Sol', 'Floresta', 'Texto invertido'], ['Creme Sol', 'Oliva', 'Badge Exaustão'], ['Terracota', 'Creme Sol', 'Ênfase e erro'], ['Terracota', 'Pêssego', 'Ênfase em Pêssego'], ['Tijolo', 'Pêssego', 'Ênfase em Pêssego (troca)'],
      ['Floresta', 'Laranja Sol', 'Botão de destaque'], ['#7F897F', 'Marfim', 'Borda de campo (UI)'], ['Laranja Sol', 'Creme Sol', 'Laranja em texto'], ['Terracota', 'Sálvia', 'Terracota em Sálvia']
    ].map(([t, f, uso]) => {
      const ht = P[t] ? P[t][0] : t, hf = P[f] ? P[f][0] : f;
      const r = razao(ht, hf);
      const ui = uso.includes('(UI)');
      const v = ui ? (r >= 3 ? ['ok', 'UI ≥ 3:1'] : ['nao', 'Não usar']) : r >= 4.5 ? ['ok', 'Texto'] : r >= 3 ? ['grande', 'Só ≥ 24 px'] : ['nao', 'Não usar'];
      return `<tr><td><span class="doc-par" style="background:${hf};color:${ht}">Aa ${ui ? '▢' : ''}</span></td><td>${t} sobre ${f}</td><td><strong>${r.toFixed(1).replace('.', ',')}</strong>:1</td><td><span class="doc-veredito doc-veredito--${v[0]}">${v[1]}</span></td><td class="t-suave">${uso}</td></tr>`;
    }).join('');

    const tipos = [
      ['Display', '60 · Cormorant Light 300', '<p class="t-display">Cuidar da mente é um ato de <em>elegância</em></p>'],
      ['H1', '48 · Cormorant Light 300', '<p class="t-h1">Dra. Lais Azevedo</p>'],
      ['H2', '38 · Cormorant Light 300', '<p class="t-h2">Conteúdos para <em>guardar</em></p>'],
      ['H3', '30 · Cormorant Regular 400', '<p class="t-h3">Como funciona a consulta</p>'],
      ['H4', '24 · Cormorant Regular 400', '<p class="t-h4">Pré-agendamento</p>'],
      ['Lead', '20 · DM Sans 400', '<p class="t-lead">Você dormiu oito horas e acordou cansada.</p>'],
      ['Corpo', '17 · DM Sans 400 · 1,55', '<p class="t-corpo">Na minha prática, atendo mulheres que dão conta de tudo e, mesmo assim, sentem que estão sempre no limite.</p>'],
      ['Pequeno', '15 · DM Sans 400', '<p class="t-pequeno">Atendimento presencial ou por teleconsulta.</p>'],
      ['Legenda', '14 · DM Sans 400 · texto suave', '<p class="t-legenda">Respondemos em horário comercial.</p>'],
      ['Rótulo', '13 · DM Sans 500 · caixa alta +18%', '<p class="eyebrow">Para guardar</p>'],
      ['Número', 'Cormorant Light · lining-nums', '<p class="t-numero" style="font-size:3.5rem;line-height:1">21h <span class="t-rotulo t-suave" style="font-family:var(--fonte-texto)">por semana</span></p>'],
      ['Código', 'Monoespaçada do sistema · só no catálogo', '<code class="doc-codigo">DL.botao({ variante: "destaque" })</code>']
    ].map(([n, m, h]) => `<div class="doc-tipo"><div class="doc-tipo__meta"><strong style="color:var(--texto)">${n}</strong><br>${m}</div><div style="min-width:0">${h}</div></div>`).join('');

    const esp = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => { const v = [4, 8, 12, 16, 24, 32, 48, 64, 96][i - 1]; return `<div class="doc-esp"><code class="doc-codigo">esp-${i}</code><div style="display:flex;align-items:center;gap:10px"><div class="doc-esp__barra" style="width:${v}px"></div><span class="t-suave">${v}px</span></div></div>`; }).join('');
    const raios = [['raio-xs', '4px'], ['raio-sm', '8px'], ['raio-md', '14px'], ['raio-lg', '22px'], ['raio-pill', '999px']].map(([n, v]) => [`--${n} · ${v}`, `<div class="doc-raio" style="border-radius:var(--${n})"></div>`]);
    const sombras = [['sombra-1', 'Cartões, links'], ['sombra-2', 'Hover'], ['sombra-3', 'Modal, toast, flutuante']].map(([n, u]) => [`--${n} · ${u}`, `<div class="doc-sombra" style="box-shadow:var(--${n})"></div>`]);

    const icones = DL.listaIcones().map((n) => `<div class="doc-icone">${ic(n)}<span>${n}</span></div>`).join('');
    const destaques = [['Ansiedade', 'espiral', '#FCC697', '#2A433D'], ['Sono', 'lua', '#2A433D', '#FEE6CE'], ['Rotina', 'sol-nascente', '#A8BCB0', '#2A433D'], ['Exaustão', 'bateria', '#5C612B', '#FEE6CE'], ['Sobre mim', null, '#FEE6CE', '#2A433D'], ['Perguntas', 'balao', '#FFF3E4', '#BF3727']]
      .map(([n, i, bg, cor]) => `<div class="doc-destaque"><span class="doc-destaque__circulo" style="background:${bg};color:${cor};${n === 'Sobre mim' ? 'border:1px solid var(--borda)' : ''}">${i ? ic(i) : '<img src="assets/monograma-floresta.svg" alt="">'}</span>${n}</div>`).join('');

    const ilus = ['sol', 'colinas', 'folha', 'degraus', 'sol-colina'].map((n) => `<div class="doc-celula"><div class="doc-ilustracao">${DL.ilustracaoSvg(n)}</div><span class="doc-celula__rotulo">${n}</span></div>`).join('');

    return [
      comp('f-cores', 'Cores · Sol & Sálvia', '--cor-*', 'Nove cores amostradas da ilustração escolhida pela Dra. Lais. Proporção 60/25/15 e no máximo 3 cores de marca por bloco. Vermelhos só como acento, nunca como fundo cheio.',
        demo(`<div class="doc-proporcao" role="img" aria-label="Proporção 60% base, 25% calma, 15% energia"><span style="flex:60;background:#FEE6CE;border:1px solid var(--borda-sutil)">Base 60%</span><span style="flex:25;background:#A8BCB0">Calma 25%</span><span style="flex:15;background:#EE6926;color:#2A433D">15%</span></div><div class="doc-cores">${cores}</div>`) +
        demo(`${sub('Papéis semânticos (use estes nos componentes)')}<div class="doc-tabela-wrap"><table class="doc-tabela"><tbody>${semanticos}</tbody></table></div>`)),
      comp('f-contraste', 'Contraste medido', 'WCAG 2.2 AA', 'Calculado ao vivo a partir dos hex. Meta 4,5:1 para texto; 3:1 para texto ≥ 24 px e para bordas de controles. Por isso o botão de destaque (Laranja Sol) usa Cormorant ≥ 24 px, e a ênfase em Pêssego troca Terracota por Tijolo.',
        demo(`<div class="doc-tabela-wrap"><table class="doc-tabela"><thead><tr><th>Amostra</th><th>Par</th><th>Razão</th><th>Uso</th><th>Onde</th></tr></thead><tbody>${pares}</tbody></table></div>`)),
      comp('f-tipografia', 'Tipografia', 'Cormorant Garamond + DM Sans', 'Cormorant para títulos, com itálico 400 na palavra de ênfase. DM Sans no corpo, no máximo 2 pesos por bloco e mínimo de 13 px. Caixa alta só nos eyebrows.',
        demo(tipos)),
      comp('f-espacos', 'Espaçamento, raios e sombras', '--esp-* · --raio-* · --sombra-*', 'Escala base 4. Raios discretos (a marca é editorial, não "bolha"). Sombras quentes e macias, tingidas de marrom, nunca cinza frio.',
        demo(`${sub('Espaçamento')}${esp}${sub('Raios')}${grade(raios, 120)}${sub('Sombras')}${grade(sombras, 160)}`)),
      comp('f-icones', 'Ícones', 'DL.icone(nome)', 'Linha fina de 1,5, traço contínuo, sem preenchimento, cor herdada. Mesma gramática das capas de destaque do Instagram. Sem rótulo, o ícone é decorativo (aria-hidden).',
        demo(`${sub('Capas de destaque')}<div class="doc-destaques">${destaques}</div>${sub('Conjunto')}<div class="doc-icones">${icones}</div>${sub('Tamanhos')}<div class="doc-linha">${['p', 'm', 'g', 'xg'].map((t) => ic('espiral', { tamanho: t })).join('')}</div>`)),
      comp('f-logo', 'Logo', 'assets/*.svg', 'Floresta sobre fundos claros, Creme sobre escuros. Respiro igual à altura do "A". Mínimo: completo 120 px, monograma 24 px. O marrom #422C1F dos arquivos originais não é usado.',
        demo(`<div class="doc-logos">
          <div class="doc-logo" style="background:#FEE6CE;border:1px solid var(--borda-sutil)"><img src="assets/logo-floresta.svg" alt="Logo Dra. Lais Azevedo em Floresta"><span class="doc-celula__rotulo">Floresta sobre Creme Sol</span></div>
          <div class="doc-logo" style="background:#2A433D"><img src="assets/logo-creme.svg" alt="Logo Dra. Lais Azevedo em Creme"><span class="doc-celula__rotulo" style="color:#D9CBB8">Creme sobre Floresta</span></div>
          <div class="doc-logo" style="background:#A8BCB0"><img src="assets/monograma-floresta.svg" alt="Monograma LA" style="max-width:110px"><span class="doc-celula__rotulo" style="color:#2A433D">Monograma · Sálvia</span></div>
          <div class="doc-logo" style="background:#FCC697"><div class="doc-linha"><img src="assets/monograma-floresta.svg" alt="" style="width:24px"><img src="assets/monograma-floresta.svg" alt="" style="width:48px"><img src="assets/logo-floresta.svg" alt="" style="width:120px"></div><span class="doc-celula__rotulo" style="color:#2A433D">Tamanhos mínimos: 24 · 48 · 120 px</span></div>
        </div>`)),
      comp('f-movimento', 'Movimento', '--ease-* · --dur-* · animacoes.css', 'Baseado na skill de design engineering de Emil Kowalski. Cada animação precisa de um motivo (feedback, continuidade espacial, indicar estado). O que se repete muitas vezes por dia, como navegar por teclado, não anima.',
        demo(`<div data-curvas style="display:grid;gap:10px;max-width:640px">
            ${[['ease-in (evitar em UI)', 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'], ['--ease-out · entrar e sair', 'var(--ease-out)'], ['--ease-in-out · mover na tela', 'var(--ease-in-out)'], ['--ease-folha · folhas (Vaul)', 'var(--ease-folha)']]
              .map(([n, c]) => `<div><span class="doc-celula__rotulo">${n}</span><div class="curva-pista" style="margin-top:4px"><span class="curva-bola" style="transition:transform 700ms ${c}"></span></div></div>`).join('')}
            <div>${DL.botao({ variante: 'secundario', icone: 'play', texto: 'Reproduzir (700 ms, câmera lenta)', attrs: { 'data-reproduzir': '' } })}</div>
          </div>`) +
        demo(`${sub('Durações')}<div class="doc-tabela-wrap"><table class="doc-tabela"><tbody>
            <tr><td><code class="doc-codigo">--dur-toque</code></td><td>160 ms</td><td class="t-suave">Pressionar: scale(0,97)</td></tr>
            <tr><td><code class="doc-codigo">--dur-rapida</code></td><td>150 ms</td><td class="t-suave">Hover, cor, tooltip (125 ms)</td></tr>
            <tr><td><code class="doc-codigo">--dur</code></td><td>220 ms</td><td class="t-suave">Padrão: chips, ícones, abas</td></tr>
            <tr><td><code class="doc-codigo">--dur-lenta</code></td><td>300 ms</td><td class="t-suave">Modal (entra 300, sai 160), accordion</td></tr>
            <tr><td><code class="doc-codigo">--dur-folha</code></td><td>500 ms</td><td class="t-suave">Folha inferior e botão flutuante</td></tr>
            <tr><td><code class="doc-codigo">--dur-entrada</code></td><td>500 ms + 70 ms/item</td><td class="t-suave">Só a primeira carga da página</td></tr>
          </tbody></table></div>
          ${sub('Regras')}
          <div class="doc-tabela-wrap"><table class="doc-tabela"><thead><tr><th>Antes</th><th>Depois</th><th>Por quê</th></tr></thead><tbody>
            <tr><td><code class="doc-codigo">transition: all</code></td><td><code class="doc-codigo">transform 160ms</code></td><td class="t-suave">Propriedades exatas; só transform e opacity</td></tr>
            <tr><td><code class="doc-codigo">scale(0)</code></td><td><code class="doc-codigo">scale(0.96); opacity: 0</code></td><td class="t-suave">Nada surge do nada</td></tr>
            <tr><td>Botão sem :active</td><td><code class="doc-codigo">scale(0.97)</code></td><td class="t-suave">A interface "ouve" o toque</td></tr>
            <tr><td>Tooltip do centro</td><td>Origem no gatilho</td><td class="t-suave">Cresce de onde veio</td></tr>
            <tr><td>Hover que move no celular</td><td><code class="doc-codigo">(hover: hover) and (pointer: fine)</code></td><td class="t-suave">Toque dispara hover falso</td></tr>
            <tr><td>Entrada = saída</td><td>Saída mais curta</td><td class="t-suave">O sistema responde rápido</td></tr>
            <tr><td>Keyframe em toast</td><td>Transição</td><td class="t-suave">Interrompível, não reinicia</td></tr>
            <tr><td>Tudo aparece junto</td><td>Cascata de 70 ms</td><td class="t-suave">Leitura natural, sem travar</td></tr>
          </tbody></table></div>
          <p class="t-legenda" style="margin-top:12px">Com "reduzir movimento" ativado no sistema, ficam só os fades curtos e saem deslocamento, escala e o ponto que respira.</p>`)),
      comp('f-ilustracao', 'Ilustração e textura', 'DL.ilustracao(nome)', 'Formas chapadas (sol, colinas, folha, degraus) só em canto livre, nunca atrás de texto, lista ou logo. Um motivo por bloco, só sobre fundos claros. O fundo leva grão de papel a cerca de 4%.',
        demo(`<div class="doc-ilustracoes">${ilus}</div>${sub('Aplicação em canto livre')}<div class="cartao com-ilustracao" style="min-height:180px;max-width:420px">${DL.ilustracao('sol-colina', { largura: 150, estilo: 'right:-12px;bottom:-8px' })}<p class="eyebrow">Para guardar</p><p class="t-h3" style="max-width:12ch">Cuidar da mente é um ato de <em>elegância</em> pessoal.</p></div>`))
    ].join('');
  };

  /* ======================================================================
     BÁSICOS
     ====================================================================== */
  const basicos = () => {
    const variantes = [['primario', 'Primário'], ['destaque', 'Destaque'], ['secundario', 'Secundário'], ['discreto', 'Discreto']];
    const estadosBtn = (v) => grade([
      ['Padrão', DL.botao({ variante: v, texto: v === 'destaque' ? 'Agendar' : 'Continuar' })],
      ['Hover', DL.botao({ variante: v, texto: v === 'destaque' ? 'Agendar' : 'Continuar', estado: 'hover' })],
      ['Foco', DL.botao({ variante: v, texto: v === 'destaque' ? 'Agendar' : 'Continuar', estado: 'foco' })],
      ['Pressionado', DL.botao({ variante: v, texto: v === 'destaque' ? 'Agendar' : 'Continuar', estado: 'pressionado' })],
      ['Desabilitado', DL.botao({ variante: v, texto: v === 'destaque' ? 'Agendar' : 'Continuar', desabilitado: true })],
      ['Carregando (clique)', DL.botao({ variante: v, texto: v === 'destaque' ? 'Agendar' : 'Continuar', attrs: { 'data-simular-carregamento': '' } })]
    ], 150);

    const botoes = variantes.map(([v, n]) => `${sub(n)}${estadosBtn(v)}`).join('') +
      sub('Com ícone, tamanhos e largura total') +
      `<div class="doc-linha">${DL.botao({ icone: 'whatsapp', texto: 'WhatsApp' })}${DL.botao({ variante: 'secundario', icone: 'mapa', texto: 'Abrir no mapa' })}${DL.botao({ variante: 'discreto', texto: 'Ver mais', iconeFim: 'seta' })}${DL.botao({ variante: 'secundario', somenteIcone: true, icone: 'copiar', texto: 'Copiar' })}${DL.botao({ somenteIcone: true, icone: 'fechar', texto: 'Fechar', tamanho: 'p' })}</div>
       <div class="doc-linha" style="margin-top:12px">${DL.botao({ tamanho: 'p', texto: 'Pequeno' })}${DL.botao({ texto: 'Médio' })}${DL.botao({ tamanho: 'g', texto: 'Grande' })}</div>
       <div style="max-width:360px;margin-top:12px;display:grid;gap:8px">${DL.botao({ variante: 'destaque', icone: 'whatsapp', texto: 'Agende no WhatsApp', bloco: true })}${DL.botao({ variante: 'secundario', texto: 'Um rótulo bem mais longo que precisa quebrar em duas linhas no celular', bloco: true })}</div>`;

    const campos = grade([
      ['Padrão', DL.campo({ rotulo: 'Seu nome', placeholder: 'Como prefere ser chamada', obrigatorio: true })],
      ['Hover', DL.campo({ rotulo: 'Seu nome', placeholder: 'Como prefere ser chamada', obrigatorio: true, estado: 'hover' })],
      ['Foco', DL.campo({ rotulo: 'Seu nome', valor: 'Mariana', obrigatorio: true, estado: 'foco' })],
      ['Erro', DL.campo({ rotulo: 'E-mail', tipo: 'email', valor: 'mariana@', erro: 'Confira o e-mail. Exemplo: nome@exemplo.com' })],
      ['Desabilitado', DL.campo({ rotulo: 'Registro', valor: 'CRM-RJ 521381560', desabilitado: true, obrigatorio: true })],
      ['Com ícone', DL.campo({ rotulo: 'Buscar conteúdo', icone: 'busca', placeholder: 'Ansiedade, sono...', mostrarOpcional: false })]
    ], 240) + sub('Tipos') + grade([
      ['Telefone (máscara)', DL.campo({ rotulo: 'Telefone', tipo: 'tel', mascara: 'telefone', inputmode: 'numeric', autocomplete: 'tel', placeholder: '(22) 98823-0320', icone: 'telefone' })],
      ['E-mail', DL.campo({ rotulo: 'E-mail', tipo: 'email', placeholder: 'nome@exemplo.com', icone: 'email', ajuda: 'Só para enviar a confirmação.' })],
      ['Área de texto + contador', DL.campo({ rotulo: 'Observação', tipo: 'textarea', max: 280, linhas: 3, placeholder: 'Algo que ajude a organizar o horário', ajuda: 'Não é preciso descrever sintomas.' })],
      ['Select', DL.campo({ rotulo: 'Forma de atendimento', tipo: 'select', obrigatorio: true, placeholder: 'Selecione', opcoes: C.pagamentos })],
      ['Select com erro', DL.campo({ rotulo: 'Forma de atendimento', tipo: 'select', obrigatorio: true, placeholder: 'Selecione', opcoes: C.pagamentos, erro: 'Selecione uma forma de atendimento.' })],
      ['Texto longo', DL.campo({ rotulo: 'Um rótulo bem longo para testar a quebra de linha em telas pequenas', valor: 'Maria Eduarda de Albuquerque Vasconcellos Figueiredo' })]
    ], 240);

    const selecao = `${sub('Checkbox')}${grade([
      ['Padrão', DL.opcao({ texto: 'Quero receber lembretes' })],
      ['Marcado', DL.opcao({ texto: 'Quero receber lembretes', marcado: true })],
      ['Hover', DL.opcao({ texto: 'Quero receber lembretes', estado: 'hover' })],
      ['Foco', DL.opcao({ texto: 'Quero receber lembretes', estado: 'foco' })],
      ['Desabilitado', DL.opcao({ texto: 'Indisponível', desabilitado: true, marcado: true })],
      ['Erro', DL.opcao({ texto: 'Concordo com a política de privacidade', erro: true })]
    ], 200)}
    ${sub('Radio')}${grade([
      ['Grupo', DL.grupoOpcoes({ legenda: 'Tipo de consulta', itens: [{ texto: 'Primeira consulta', valor: '1', marcado: true, descricao: 'Avaliação completa, sem pressa' }, { texto: 'Retorno', valor: '2' }, { texto: 'Indisponível', valor: '3', desabilitado: true }] })],
      ['Em linha', DL.grupoOpcoes({ legenda: 'Modalidade', linha: true, itens: [{ texto: 'Presencial', valor: 'p', marcado: true }, { texto: 'Teleconsulta', valor: 't' }] })],
      ['Foco', DL.opcao({ tipo: 'radio', texto: 'Retorno', estado: 'foco', nome: 'rf' })]
    ], 240)}
    ${sub('Switch')}${grade([
      ['Desligado', DL.interruptor({ texto: 'Prefiro teleconsulta' })],
      ['Ligado', DL.interruptor({ texto: 'Prefiro teleconsulta', marcado: true })],
      ['Com descrição', DL.interruptor({ texto: 'Prefiro teleconsulta', descricao: 'Atendimento por vídeo', marcado: true })],
      ['Foco', DL.interruptor({ texto: 'Prefiro teleconsulta', estado: 'foco' })],
      ['Desabilitado', DL.interruptor({ texto: 'Indisponível', desabilitado: true })]
    ], 220)}
    ${sub('Chips de seleção (dias e turnos)')}${grade([
      ['Múltipla escolha', DL.chips({ legenda: 'Dias de preferência', itens: [{ texto: 'Seg', marcado: true }, 'Ter', { texto: 'Qua', marcado: true }, 'Qui', 'Sex', 'Sáb'] })],
      ['Estados', DL.chips({ legenda: 'Turno', itens: ['Manhã', { texto: 'Hover', estado: 'hover' }, { texto: 'Foco', estado: 'foco' }, { texto: 'Indisponível', desabilitado: true }] })],
      ['Erro', DL.chips({ legenda: 'Turno', obrigatorio: true, erro: 'Escolha pelo menos um turno.', itens: ['Manhã', 'Tarde', 'Noite'] })]
    ], 280)}`;

    const equipe = [{ src: 'assets/retrato-1.jpg', alt: 'Dra. Lais' }, { iniciais: 'CM', alt: 'Carla, secretária' }, { iniciais: 'RB', alt: 'Renata' }, { iniciais: 'JP', alt: 'Júlia' }, { iniciais: 'AS', alt: 'Ana' }, { iniciais: 'LF', alt: 'Luiza' }];
    const avatares = grade([
      ['Retrato · p / m / g / xg', `<div class="doc-linha">${['p', 'm', 'g', 'xg'].map((t) => DL.avatar({ src: 'assets/retrato-1.jpg', alt: 'Dra. Lais Azevedo', tamanho: t })).join('')}</div>`],
      ['Monograma LA', `<div class="doc-linha">${['m', 'g', 'xg'].map((t) => DL.avatar({ monograma: 'assets/monograma-floresta.svg', tamanho: t })).join('')}</div>`],
      ['Iniciais e status', `<div class="doc-linha">${DL.avatar({ iniciais: 'LA', tamanho: 'g', alt: 'Lais Azevedo' })}${DL.avatar({ src: 'assets/retrato-1.jpg', alt: 'Dra. Lais', tamanho: 'g', status: 'Disponível' })}${DL.avatar({ src: 'assets/retrato-1.jpg', alt: 'Dra. Lais', tamanho: 'g', anel: true })}</div>`],
      ['Grupo (máx. 4)', DL.grupoAvatares(equipe, { rotulo: 'Equipe do consultório' })]
    ], 240);

    const badges = `${sub('Tema')}<div class="doc-linha">${DL.badge({ texto: 'Ansiedade', tom: 'ansiedade', icone: 'espiral' })}${DL.badge({ texto: 'Sono', tom: 'sono', icone: 'lua' })}${DL.badge({ texto: 'Rotina', tom: 'rotina', icone: 'sol-nascente' })}${DL.badge({ texto: 'Exaustão', tom: 'exaustao', icone: 'bateria' })}</div>
      ${sub('Modalidade')}<div class="doc-linha">${DL.badge({ texto: 'Presencial', icone: 'local', tom: 'contorno' })}${DL.badge({ texto: 'Teleconsulta', icone: 'tela', tom: 'contorno' })}${DL.badge({ texto: 'Particular' })}</div>
      ${sub('Status')}<div class="doc-linha">${DL.badge({ texto: 'Agenda aberta', status: 'aberta' })}${DL.badge({ texto: 'Lista de espera', status: 'espera' })}${DL.badge({ texto: 'Agenda fechada', status: 'fechada' })}${DL.exemplo()}</div>`;

    const tooltip = `<div class="doc-linha" style="padding-top:56px;gap:40px">${DL.tooltip({ texto: 'CRM-RJ 521381560', dica: 'Registro no Conselho Regional de Medicina do Estado do Rio de Janeiro' })}${DL.tooltip({ texto: 'Sempre aberto (catálogo)', dica: 'Aparece no hover e no foco do teclado. Esc fecha.', aberto: true })}${DL.tooltip({ gatilhoHtml: DL.botao({ variante: 'secundario', somenteIcone: true, icone: 'info', texto: 'O que é teleconsulta?' }), dica: 'Consulta por vídeo, com o mesmo cuidado do presencial.' })}</div>`;

    const alertas = `<div style="display:grid;gap:12px;max-width:620px">
      ${DL.alerta({ tipo: 'info', titulo: 'Horários sob agendamento', texto: 'Todo horário é combinado pelo WhatsApp com a equipe.' })}
      ${DL.alerta({ tipo: 'sucesso', titulo: 'Mensagem pronta', texto: 'Abra o WhatsApp para revisar e enviar.', fechar: true })}
      ${DL.alerta({ tipo: 'atencao', titulo: 'Agenda de dezembro quase cheia', texto: 'Ainda há horários na segunda quinzena.', acoes: DL.botao({ variante: 'secundario', tamanho: 'p', texto: 'Ver como agendar' }) })}
      ${DL.alerta({ tipo: 'erro', titulo: 'Não conseguimos preparar a mensagem', html: 'Tente de novo ou <a href="#">chame direto no WhatsApp</a>.' })}
      ${DL.avisoCrise()}
    </div>`;

    const toast = `<div style="display:grid;gap:10px;max-width:420px">${DL.toastEstatico('Copiado: (22) 98823-0320')}${DL.toastEstatico('Conteúdos carregados.', 'info')}${DL.toastEstatico('Não deu para copiar. Copie manualmente.', 'erro')}</div>
      <div class="doc-linha" style="margin-top:16px">${DL.botao({ variante: 'secundario', texto: 'Disparar toast', attrs: { 'data-demo-toast': 'sucesso' } })}${DL.botao({ variante: 'secundario', texto: 'Disparar 4 seguidos', attrs: { 'data-demo-toast': 'varios' } })}${DL.botao({ variante: 'secundario', texto: 'Toast de erro', attrs: { 'data-demo-toast': 'erro' } })}</div>
      <p class="t-legenda" style="margin-top:12px">Empilham com recuo de escala; passe o mouse para abrir a pilha e pausar o tempo. Arraste para baixo (ou dê um "peteleco") para fechar. O tempo pausa quando a aba fica oculta.</p>`;
    const drawer = `${DL.botao({ texto: 'Abrir folha', icone: 'chevron-baixo', attrs: { 'data-abrir-modal': 'demo-folha' } })}
      ${DL.modal({ id: 'demo-folha', folha: true, eyebrow: 'Drawer', titulo: 'Escolha um *turno*', html: `${DL.chips({ legenda: 'Turno de preferência', itens: ['Manhã', 'Tarde', 'Noite'] })}<p style="margin-top:16px">Arraste a alça para baixo para fechar. Puxe para cima e sinta a resistência. Um "peteleco" rápido também fecha.</p>`, rodape: DL.botao({ variante: 'primario', texto: 'Confirmar', attrs: { 'data-fechar-modal': '' } }) })}
      <p class="t-legenda" style="margin-top:12px">Curva do Vaul (--ease-folha), 500 ms para subir e 280 ms para descer. Fecha por distância (25% da altura) ou velocidade.</p>`;

    const modal = `${DL.botao({ texto: 'Abrir modal', icone: 'xicara', attrs: { 'data-abrir-modal': 'demo-modal' } })}
      ${DL.modal({ id: 'demo-modal', eyebrow: 'Avaliação médica', titulo: 'Como funciona a *consulta*', html: '<p>A primeira consulta é uma conversa sem pressa sobre o que você carrega hoje: sono, rotina, trabalho, relações e histórico de saúde.</p><p>Os retornos acompanham como você está e ajustam o caminho.</p>', rodape: DL.botao({ variante: 'secundario', texto: 'Fechar', attrs: { 'data-fechar-modal': '' } }) + DL.botaoWhatsApp({ numero: NUM, mensagem: MSG, tamanho: 'p' }) })}
      <p class="t-legenda" style="margin-top:12px">Usa &lt;dialog&gt;: foco preso dentro, Esc fecha, clique fora fecha. No celular vira uma folha que sobe da base.</p>`;

    const abas = DL.abas({ rotulo: 'Exemplo de abas', abas: [
      { rotulo: 'Reels', html: '<p class="t-pequeno">Vídeos curtos para assistir agora.</p>' },
      { rotulo: 'Carrosséis', html: '<p class="t-pequeno">Lâminas para salvar e voltar depois.</p>' },
      { rotulo: 'Guias em PDF', html: '<p class="t-pequeno">Materiais para baixar.</p>' },
      { rotulo: 'Em breve', desabilitada: true }
    ] }) + '<p class="t-legenda">Setas ←/→, Home e End navegam entre as abas.</p>';

    return [
      comp('b-botoes', 'Botões', 'DL.botao({ variante })', 'Primário (Floresta), Destaque (Laranja Sol, rótulo em Cormorant ≥ 24 px para cumprir o contraste), Secundário e Discreto. Área de toque mínima de 44 px. Carregando mantém a largura.',
        demo(botoes) + demo(grade([['Primário', DL.botao({ texto: 'Continuar' })], ['Destaque', DL.botao({ variante: 'destaque', texto: 'Agendar' })], ['Secundário', DL.botao({ variante: 'secundario', texto: 'Ver mais' })], ['Discreto', DL.botao({ variante: 'discreto', texto: 'Editar' })], ['Desabilitado', DL.botao({ texto: 'Indisponível', desabilitado: true })]], 140), { escuro: true })),
      comp('b-campos', 'Campos de texto', 'DL.campo({ tipo })', 'Rótulo sempre visível, ajuda e erro ligados por aria-describedby. Fonte de 16 px na entrada para o iOS não dar zoom. Opcional é sinalizado; obrigatório é o padrão.', demo(campos)),
      comp('b-selecao', 'Select, checkbox, radio, switch e chips', 'DL.opcao · DL.grupoOpcoes · DL.interruptor · DL.chips', 'Controles nativos estilizados, então teclado e leitor de tela funcionam sem código extra. Os chips servem para preferência de dias e turnos.', demo(selecao)),
      comp('b-avatar', 'Avatar e grupo', 'DL.avatar · DL.grupoAvatares', 'Retrato com recorte no rosto, monograma LA (avatar recomendado pelo DNA) ou iniciais. O grupo mostra até 4 e resume o resto.', demo(avatares)),
      comp('b-badges', 'Badges', 'DL.badge({ tom | status })', 'Tema segue a cor por assunto do DNA. Status usa ponto colorido + texto, nunca só a cor.', demo(badges)),
      comp('b-tooltip', 'Tooltip', 'DL.tooltip()', 'Para explicações curtas (o que é o CRM, o que é teleconsulta). Abre no hover e no foco, fecha com Esc. Nunca guarda informação essencial.', demo(tooltip)),
      comp('b-accordion', 'Accordion', 'DL.acordeao({ itens, unico })', 'Perguntas frequentes. Botão com aria-expanded, painel inerte quando fechado e animação de altura suave.', demo(DL.acordeao({ itens: C.faq.slice(0, 3).map((f, i) => ({ ...f, aberto: i === 0 })) }), { coluna: true })),
      comp('b-alertas', 'Alertas', 'DL.alerta({ tipo })', 'Fundo Marfim com barra lateral colorida. Erro usa Terracota só na barra, ícone e título, sem fundo vermelho cheio. O aviso de cuidado é obrigatório no site.', demo(alertas)),
      comp('b-toast', 'Toast', 'DL.toast(texto, { tipo })', 'Confirmação breve (copiado, carregado). Anunciado por aria-live, some em cerca de 4 s e pode ser fechado.', demo(toast)),
      comp('b-modal', 'Modal', 'DL.modal({ id })', 'Para "Como funciona a consulta" e textos de apoio. Abre com data-abrir-modal.', demo(modal)),
      comp('b-drawer', 'Drawer (folha inferior)', 'DL.modal({ folha: true })', 'Folha que sobe da base, arrastável. No celular, todo modal vira folha automaticamente.', demo(drawer)),
      comp('b-abas', 'Abas', 'DL.abas({ abas })', 'Separam os tipos de conteúdo sem sair da página. Indicador Laranja Sol na aba ativa.', demo(abas, { coluna: true })),
      comp('b-trilha', 'Breadcrumbs', 'DL.trilha(itens)', 'Para páginas internas futuras (um guia, um artigo). O último item é a página atual e corta com reticências se for longo.', demo(`${DL.trilha([{ texto: 'Início', href: '#' }, { texto: 'Conteúdos', href: '#' }, { texto: 'Ansiedade' }])}<div style="margin-top:12px">${DL.trilha([{ texto: 'Início', href: '#' }, { texto: 'Guias', href: '#' }, { texto: 'Ritual de sono para noites mais tranquilas e sem telas' }])}</div>`)),
      comp('b-divisor', 'Divisores', 'DL.divisor({ tipo })', 'Linha simples, com rótulo ou com ornamento (ponto Laranja Sol).', demo(`${DL.divisor()}${DL.divisor({ tipo: 'rotulo', texto: 'ou' })}${DL.divisor({ tipo: 'ornamento' })}`, { coluna: true }))
    ].join('');
  };

  /* ======================================================================
     SITE
     ====================================================================== */
  const site = () => {
    const linkEstados = grade([
      ['Padrão', DL.linkBotao({ titulo: 'Conteúdos para guardar', subtitulo: 'Reels, carrosséis e guias', icone: 'folha' })],
      ['Hover', DL.linkBotao({ titulo: 'Conteúdos para guardar', subtitulo: 'Reels, carrosséis e guias', icone: 'folha', estado: 'hover' })],
      ['Foco', DL.linkBotao({ titulo: 'Conteúdos para guardar', subtitulo: 'Reels, carrosséis e guias', icone: 'folha', estado: 'foco' })],
      ['Pressionado', DL.linkBotao({ titulo: 'Conteúdos para guardar', subtitulo: 'Reels, carrosséis e guias', icone: 'folha', estado: 'pressionado' })],
      ['Destacado (CTA)', DL.linkBotao({ titulo: 'Agende no WhatsApp', subtitulo: 'Horários combinados direto com a equipe', icone: 'whatsapp', destaque: true, href: DL.linkWhatsApp(NUM, MSG), externo: true })],
      ['Tom Pêssego', DL.linkBotao({ titulo: 'Guia: Ritual de sono', subtitulo: 'PDF para baixar', icone: 'documento', tom: 'pessego', exemplo: true })],
      ['Desabilitado', DL.linkBotao({ titulo: 'Grupo de apoio', subtitulo: 'Novas turmas em breve', icone: 'usuario', desabilitado: true })],
      ['Carregando', DL.linkBotao({ titulo: 'Abrindo o WhatsApp', subtitulo: 'Só um instante', icone: 'whatsapp', destaque: true, carregando: true })],
      ['Externo', DL.linkBotao({ titulo: 'Instagram', subtitulo: '@laisazeved0', icone: 'instagram', href: C.contato.instagramUrl, externo: true })],
      ['Texto longo', DL.linkBotao({ titulo: 'Um título de link bem mais longo do que o normal para testar a quebra', subtitulo: 'Subtítulo também longo, que corta depois de duas linhas para não desmontar a pilha de links no celular', icone: 'link' })]
    ], 300);

    const wa = DL.linkWhatsApp(NUM, MSG);
    const contatos = [
      { icone: 'whatsapp', rotulo: 'WhatsApp', valor: C.contato.whatsapp, href: wa, copiar: C.contato.whatsapp },
      { icone: 'instagram', rotulo: 'Instagram', valor: C.contato.instagram, href: C.contato.instagramUrl },
      { icone: 'email', rotulo: 'E-mail', valor: C.contato.email, href: 'mailto:' + C.contato.email, exemplo: true }
    ];

    return [
      comp('s-perfil', 'Cabeçalho de perfil', 'DL.perfil(perfil)', 'Retrato, nome, linha de credencial ("Médica · Saúde mental com evidências"), CRM com tooltip e a promessa em Cormorant. Nunca usa a palavra "psiquiatra".',
        demo(`${DL.perfil(C.perfil)}<div style="margin-top:20px">${DL.redes(C.redes.map((r) => ({ ...r, href: r.href === 'whatsapp' ? wa : r.href })))}</div>`, { coluna: true, estilo: 'margin-inline:auto' })),
      comp('s-link', 'Botão de link (Linktree)', 'DL.linkBotao()', 'A peça central da página. Ícone em bloco, título em Cormorant, subtítulo, seta. Título e subtítulo cortam em 2 linhas. Só um link destacado por página.', demo(linkEstados)),
      comp('s-whatsapp', 'WhatsApp e redes', 'DL.botaoWhatsApp · DL.redes', `Leva a <code class="doc-codigo">wa.me/5522988230320</code> com a mensagem pronta: "${esc(MSG)}".`,
        demo(`<div style="max-width:420px;display:grid;gap:16px">${DL.botaoWhatsApp({ numero: NUM, mensagem: MSG, bloco: true })}${DL.redes(C.redes.map((r) => ({ ...r, href: r.href === 'whatsapp' ? wa : r.href })))}<div>${DL.redes([{ rede: 'instagram', rotulo: 'Instagram (hover)', href: '#', estado: 'hover' }])}</div></div>`) +
        demo(`<div style="max-width:420px;display:grid;gap:16px">${DL.redes(C.redes.map((r) => ({ ...r, href: '#' })))}</div>`, { escuro: true })),
      comp('s-temas', 'Card de tema', 'DL.cartaoTema · DL.gradeTemas', 'Ansiedade, Sono, Rotina e Exaustão, com a cor por assunto e o ícone das capas de destaque. Grade de 2 colunas também no celular.',
        demo(DL.gradeTemas(C.temas) + `<div style="margin-top:12px;max-width:260px">${DL.cartaoTema({ nome: 'Perguntas', descricao: 'Mande a sua dúvida pela caixinha do Instagram.', icone: 'balao', tom: 'perguntas', href: '#', estado: 'hover' })}<span class="doc-celula__rotulo">Variante Perguntas · hover</span></div>`, { coluna: true })),
      comp('s-sobre', 'Sobre mim', 'DL.sobreMim(sobre)', 'Foto, texto na voz dela e pontos de destaque. A imagem gerada no Higgsfield aparece marcada como ilustrativa até chegar a foto real do ensaio. Em telas largas, use a variante lado a lado.',
        demo(DL.sobreMim(C.sobre), { coluna: true }) + demo(DL.sobreMim({ ...C.sobre, lado: true }))),
      comp('s-formacao', 'Formação', 'DL.formacao(lista)', 'Linha do tempo. O item atual ganha ponto Laranja Sol e badge "Em andamento".', demo(DL.formacao(C.formacao), { coluna: true })),
      comp('s-local', 'Local de atendimento', 'DL.local(local)', 'Mapa ilustrativo (sem embed externo, para a página carregar rápido), endereço, acessibilidade, estacionamento e modalidades.', demo(DL.local(C.local), { coluna: true })),
      comp('s-agendar', 'Como agendar', 'DL.comoAgendar()', 'Explica em 3 passos que o horário é combinado pelo WhatsApp. Sem grade de horários fixa. Bloco Floresta com o botão Laranja Sol, como manda o DNA para CTA.',
        demo(DL.comoAgendar({ ...C.agendar, numero: NUM, mensagem: MSG }), { coluna: true })),
      comp('s-formulario', 'Formulário de pré-agendamento', 'DL.formularioAgendamento()', 'Valida, mostra os erros, simula o envio e monta a mensagem. O último passo abre o WhatsApp com tudo preenchido. Não coleta sintomas nem dados de saúde. Experimente enviar vazio. O segundo exemplo simula uma falha na primeira tentativa.',
        `<div class="doc-grade" style="--min:340px">${demo(DL.formularioAgendamento({ numero: NUM, pagamentos: C.pagamentos }))}${demo(`<p class="doc-celula__rotulo" style="margin-bottom:12px">Simula erro de envio</p>${DL.formularioAgendamento({ numero: NUM, pagamentos: C.pagamentos, simularErro: true })}`)}</div>`),
      comp('s-conteudos', 'Card de conteúdo e série', 'DL.cartaoConteudo · DL.serie', 'Reels, carrosséis e guias com miniatura na cor do assunto. A série numerada segue as cartelas aprovadas ("Os pesos 01/02/03"). Links fictícios apontam para o perfil.',
        demo(`${DL.abas({ rotulo: 'Tipos de conteúdo', abas: [{ rotulo: 'Reels', html: DL.listaConteudos(C.conteudos.reels) }, { rotulo: 'Carrosséis', html: DL.listaConteudos(C.conteudos.carrosseis) }, { rotulo: 'Guias', html: DL.listaConteudos(C.conteudos.guias) }] })}<div style="margin-top:20px">${DL.serie(C.conteudos.serie)}</div>`, { coluna: true }) +
        demo(grade([['Hover', DL.cartaoConteudo({ ...C.conteudos.reels[0], estado: 'hover' })], ['Título longo', DL.cartaoConteudo({ tipo: 'Guia', tema: 'sono', titulo: 'Um guia com título bem comprido para testar o corte em duas linhas no celular', descricao: 'Descrição que também é longa e precisa cortar sem quebrar o card.', duracao: 'PDF' })]], 300))),
      comp('s-convenios', 'Convênios', 'DL.convenios()', 'Grade que se adapta ao tamanho do nome. Nomes fictícios até a confirmação.', demo(DL.convenios(C.convenios), { coluna: true })),
      comp('s-faq', 'Perguntas frequentes', 'DL.acordeao({ unico: true })', 'Só um item aberto por vez. Respostas de exemplo, para revisar com a Dra. Lais.', demo(DL.acordeao({ itens: C.faq, unico: true }), { coluna: true })),
      comp('s-contato', 'Contato rápido', 'DL.contatos(lista)', 'Cada linha tem link direto e botão de copiar com feedback (ícone vira check + toast).', demo(DL.contatos(contatos), { coluna: true })),
      comp('s-flutuante', 'Botão flutuante', 'DL.flutuante()', 'No celular, aparece quando o CTA principal sai da tela e some perto do rodapé. Oculto no desktop.', demo(DL.flutuante({ numero: NUM, mensagem: MSG, estatico: true }), { coluna: true })),
      comp('s-rodape', 'Rodapé', 'DL.rodape()', 'Monograma, nome, CRM, responsável técnica, endereço, privacidade e aviso legal, como pede a publicidade médica do CFM.',
        demo(DL.rodape({ ...C.rodape, nome: C.perfil.nome, titulo: C.perfil.titulo, registro: C.perfil.registro, monograma: 'assets/monograma-floresta.svg', endereco: C.local.endereco + ', ' + C.local.complemento, exemplo: true }), { coluna: true, estilo: 'padding-bottom:0' })),
      comp('s-estados', 'Estados: vazio, carregando e erro', 'DL.estadoVazio · DL.skeleton* · DL.estadoErro', 'O skeleton respeita "reduzir movimento". O erro oferece uma saída (tentar de novo).',
        demo(grade([
          ['Vazio', DL.estadoVazio({ titulo: 'Nada por aqui ainda', texto: 'Os próximos guias aparecem aqui assim que forem publicados.' })],
          ['Skeleton de links', DL.skeletonLink(3)],
          ['Skeleton de cartão', DL.skeletonCartao()],
          ['Erro de carregamento', DL.estadoErro({})]
        ], 280)))
    ].join('');
  };

  /* ======================================================================
     EXEMPLO MONTADO
     ====================================================================== */
  const montado = () => {
    nav.push({ grupo: 'Exemplo montado', itens: [{ id: 'montado', nome: 'Página da Dra. Lais' }] });
    return `<section class="doc-parte" id="montado" aria-labelledby="montado-t">
      <p class="eyebrow">Parte</p><h2 class="t-h1 doc-parte__titulo" id="montado-t">Exemplo <em>montado</em></h2>
      <p class="doc-parte__intro">A página completa, feita só com as peças acima. O mesmo arquivo em celular (390 px) e desktop (1280 px). As duas versões são navegáveis.</p>
      <div class="doc-linha" style="margin-bottom:20px">${DL.botao({ texto: 'Abrir em tela cheia', href: 'index.html', externo: true, iconeFim: 'externo' })}</div>
      <div class="doc-montado">
        <div class="doc-celula"><span class="doc-celula__rotulo">Celular · 390 px</span><div class="doc-celular"><iframe src="index.html" title="Página da Dra. Lais no celular" loading="lazy"></iframe></div></div>
        <div class="doc-celula"><span class="doc-celula__rotulo">Desktop · 1280 px (reduzido)</span><div class="doc-desktop"><div class="doc-desktop__barra"><i></i><i></i><i></i></div><div class="doc-desktop__palco" data-palco><iframe src="index.html" title="Página da Dra. Lais no desktop" loading="lazy" tabindex="-1"></iframe></div></div></div>
      </div>
    </section>`;
  };

  /* ======================================================================
     MONTAGEM
     ====================================================================== */
  const html = capa +
    parte('fundamentos', 'Fundamentos', 'Tokens de cor, tipografia, espaço, raio, sombra, ícones, logo e ilustração. Tudo vem do DNA Criativo v2.1 e fica em <code class="doc-codigo">tokens.css</code>.', fundamentos) +
    parte('basicos', 'Componentes *básicos*', 'Peças genéricas com todos os estados: padrão, hover, foco, pressionado, selecionado, desabilitado, carregando e erro. Os estados fixos aqui servem para comparar; na página real eles respondem ao mouse e ao teclado.', basicos) +
    parte('site', 'Componentes do *site*', 'Peças do estilo Linktree e do consultório, montadas a partir dos componentes básicos. O conteúdo vem de <code class="doc-codigo">conteudo.js</code>.', site) +
    montado();

  const main = document.querySelector('.doc-main');
  main.innerHTML = html;

  // Navegação
  const lista = document.getElementById('doc-nav-lista');
  lista.innerHTML = nav.map((g) => `<div class="doc-nav__grupo"><p>${esc(g.grupo.replace(/\*/g, ''))}</p><ul>${g.itens.map((i) => `<li><a href="#${i.id}">${esc(i.nome)}</a></li>`).join('')}</ul></div>`).join('');
  const menu = document.querySelector('.doc-nav__menu');
  const navEl = document.querySelector('.doc-nav');
  menu.addEventListener('click', () => { const a = navEl.classList.toggle('is-aberta'); menu.setAttribute('aria-expanded', String(a)); });
  lista.addEventListener('click', (e) => { if (e.target.closest('a')) { navEl.classList.remove('is-aberta'); menu.setAttribute('aria-expanded', 'false'); } });
  if ('IntersectionObserver' in window) {
    const links = [...lista.querySelectorAll('a')];
    const obs = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) links.forEach((l) => l.classList.toggle('is-ativo', l.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.doc-comp, #montado').forEach((s) => obs.observe(s));
  }

  // Toasts de demonstração
  main.querySelectorAll('[data-demo-toast]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.demoToast === 'erro') DL.toast('Não deu para copiar. Selecione o texto e copie manualmente.', { tipo: 'erro' });
    else if (b.dataset.demoToast === 'varios') ['Copiado: (22) 98823-0320', 'Conteúdos carregados.', 'Mensagem pronta para enviar.', 'Link copiado: @laisazeved0'].forEach((m, i) => setTimeout(() => DL.toast(m, { tipo: i === 1 ? 'info' : 'sucesso' }), i * 260));
    else DL.toast('Copiado: (22) 98823-0320', { acao: { texto: 'Desfazer' } });
  }));

  // Escala do iframe desktop
  const palco = main.querySelector('[data-palco]');
  const iframe = palco?.querySelector('iframe');
  const escalar = () => { const s = palco.clientWidth / 1280; iframe.style.transform = `scale(${s})`; palco.style.height = `${860 * s}px`; };
  if (palco) { escalar(); new ResizeObserver(escalar).observe(palco); }

  DL.iniciar(document);
  DL.iniciarMovimento(document);
})();
