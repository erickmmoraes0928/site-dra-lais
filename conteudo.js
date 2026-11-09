/* ==========================================================================
   Dra. Lais Azevedo · Conteúdo do site
   TODO o texto e os dados ficam aqui. Itens com `exemplo: true` são
   fictícios e aparecem com a marca "exemplo" até serem trocados.
   Para esconder as marcas na versão final: mostrarMarcasDeExemplo: false.
   ========================================================================== */
window.DL_CONTEUDO = {
  mostrarMarcasDeExemplo: true,

  contato: {
    whatsapp: '(22) 98823-0320',
    whatsappNumero: '22988230320',
    mensagemPadrao: 'Olá, Dra. Lais! Gostaria de agendar uma consulta médica.',
    instagram: '@laisazeved0',
    instagramUrl: 'https://instagram.com/laisazeved0',
    email: 'contato@dralaisazevedo.com.br',  // exemplo: trocar pelo real
    emailExemplo: true
  },

  perfil: {
    nome: 'Dra. Lais Azevedo',
    titulo: 'Médica · Saúde mental com evidências',
    registro: 'CRM-RJ 521381560',
    formacaoCurta: 'Pós-grad. Einstein',
    promessa: 'Ajudo mulheres que funcionam a viver de *verdade*.',
    foto: 'assets/retrato-1.jpg',
    fotoAlt: 'Dra. Lais Azevedo segurando uma xícara de cerâmica, olhando pela janela',
    fotoIlustrativa: true, // gerada no Higgsfield: trocar pela foto real do ensaio
    status: { texto: 'Agenda aberta', tipo: 'aberta' }
  },

  links: [
    { titulo: 'Agende no WhatsApp', subtitulo: 'Horários combinados direto com a equipe', icone: 'whatsapp', destaque: true, tipo: 'whatsapp' },
    { titulo: 'Como funciona a consulta', subtitulo: 'Primeira consulta, retorno e teleconsulta', icone: 'xicara', tipo: 'modal', modal: 'modal-consulta' },
    { titulo: 'Conteúdos para guardar', subtitulo: 'Reels, carrosséis e guias', icone: 'folha', href: '#conteudos', tom: 'pessego' },
    { titulo: 'Instagram', subtitulo: '@laisazeved0', icone: 'instagram', href: 'https://instagram.com/laisazeved0', externo: true },
    { titulo: 'Onde atendo', subtitulo: 'Consultório e teleconsulta', icone: 'local', href: '#local' }
  ],

  redes: [
    { rede: 'instagram', rotulo: 'Instagram da Dra. Lais', href: 'https://instagram.com/laisazeved0' },
    { rede: 'whatsapp', rotulo: 'WhatsApp da Dra. Lais', href: 'whatsapp' },
    { rede: 'email', rotulo: 'E-mail da Dra. Lais', href: 'mailto:contato@dralaisazevedo.com.br' }
  ],

  temas: [
    { nome: 'Ansiedade', descricao: 'Nem toda ansiedade faz barulho. Às vezes ela só não deixa você parar.', icone: 'espiral', tom: 'ansiedade' },
    { nome: 'Sono', descricao: 'Dormir oito horas e acordar cansada também é um sinal.', icone: 'lua', tom: 'sono' },
    { nome: 'Rotina', descricao: 'Pequenos rituais que devolvem presença ao seu dia.', icone: 'sol-nascente', tom: 'rotina' },
    { nome: 'Exaustão', descricao: 'Para quem funciona para todo mundo e esqueceu de si.', icone: 'bateria', tom: 'exaustao' }
  ],

  sobre: {
    foto: 'assets/retrato-2.jpg',
    fotoAlt: 'Dra. Lais Azevedo em ambiente de luz natural',
    fotoIlustrativa: true,
    exemplo: true,
    paragrafos: [
      'Cuidar da mente é um ato de *elegância pessoal*.',
      'Na minha prática, atendo mulheres que dão conta de tudo e, mesmo assim, sentem que estão sempre no limite. Meu trabalho é chegar antes da crise, com ciência traduzida e sem pressa.',
      'Cada consulta é uma conversa sobre o que você carrega: sono, rotina, trabalho, relações. A partir daí, construímos juntas um cuidado possível para a sua vida real.'
    ],
    pontos: [
      { icone: 'escudo', texto: 'Condutas baseadas em evidências científicas' },
      { icone: 'relogio', texto: 'Consulta sem pressa, com tempo para ouvir' },
      { icone: 'tela', texto: 'Atendimento presencial ou por teleconsulta' }
    ]
  },

  formacao: [
    { periodo: '2026 – atual', titulo: 'Pós-graduação em Saúde Mental', local: 'Hospital Israelita Albert Einstein', atual: true },
    { periodo: '2024', titulo: 'Curso de Terapia Cognitivo-Comportamental', local: 'Instituto de Exemplo, Rio de Janeiro', exemplo: true },
    { periodo: '2017 – 2023', titulo: 'Graduação em Medicina', local: 'Universidade de Exemplo', exemplo: true },
    { periodo: '2023', titulo: 'Registro no Conselho Regional de Medicina', local: 'CRM-RJ 521381560' }
  ],

  agendar: {
    titulo: 'Horários sob agendamento pelo *WhatsApp*',
    passos: [
      { titulo: 'Envie uma mensagem', texto: 'Pelo botão abaixo ou pelo formulário, que já monta o texto para você.' },
      { titulo: 'Receba os horários', texto: 'A equipe responde com os horários disponíveis na semana.' },
      { titulo: 'Confirme a consulta', texto: 'Você escolhe o melhor horário e recebe a confirmação.' }
    ],
    nota: 'Respondemos em horário comercial.',
    notaExemplo: true
  },

  pagamentos: ['Particular', 'Particular com reembolso do plano', 'Convênio (consultar)'],

  conteudos: {
    reels: [
      { tipo: 'Reel', tema: 'ansiedade', titulo: 'Ansiedade silenciosa', descricao: 'Nem toda ansiedade faz barulho. Três sinais que passam despercebidos.', href: 'https://instagram.com/laisazeved0', duracao: '1 min', exemplo: true },
      { tipo: 'Reel', tema: 'exaustao', titulo: 'Os três pesos', descricao: 'O que você carrega sem perceber, e por onde começar a soltar.', href: 'https://instagram.com/laisazeved0', duracao: '1 min', exemplo: true },
      { tipo: 'Reel', tema: 'rotina', titulo: '3 técnicas para desacelerar a mente', descricao: 'Práticas simples para o fim do dia. Nenhuma técnica funciona para todas.', href: 'https://instagram.com/laisazeved0', duracao: '70 s', exemplo: true }
    ],
    carrosseis: [
      { tipo: 'Carrossel', tema: 'exaustao', titulo: 'Cansada? Sinais de exaustão para observar', descricao: 'Um checklist para observar como você tem se sentido.', href: 'https://instagram.com/laisazeved0', duracao: '10 lâminas', exemplo: true }
    ],
    guias: [
      { tipo: 'Guia', tema: 'sono', titulo: 'Ritual de sono', descricao: 'Guia em PDF com um roteiro de noite mais tranquila.', href: '#', duracao: 'PDF', exemplo: true }
    ],
    serie: {
      nome: 'Os *pesos*',
      exemplo: true,
      itens: [
        { titulo: 'O peso de dar conta de tudo', href: 'https://instagram.com/laisazeved0' },
        { titulo: 'O peso da culpa', href: 'https://instagram.com/laisazeved0' },
        { titulo: 'Em breve' }
      ]
    }
  },

  local: {
    eyebrow: 'Consultório',
    nome: 'Íntegra · Instituto de Saúde Integrativa',
    endereco: 'R. Pastor Abelar Suzano de Siqueira, 157',
    complemento: 'Pres. Costa e Silva, Itaperuna · RJ, 28300-000',
    exemplo: false,
    mapaHref: 'https://maps.app.goo.gl/oZLL1FFkyvNhZmwF7',
    info: [
      { icone: 'acessibilidade', titulo: 'Acessibilidade', texto: 'Prédio com elevador e rampa de acesso.', exemplo: true },
      { icone: 'estacionamento', titulo: 'Estacionamento', texto: 'Estacionamento rotativo em frente.', exemplo: true },
      { icone: 'tela', titulo: 'Teleconsulta', texto: 'Atendimento por vídeo para todo o Brasil.', exemplo: true }
    ],
    modalidades: [{ texto: 'Presencial', icone: 'local' }, { texto: 'Teleconsulta', icone: 'tela' }]
  },

  convenios: {
    texto: 'Atendimento particular, com recibo para pedir reembolso ao seu plano. Convênios aceitos:',
    exemplo: true,
    lista: ['Convênio Exemplo A', 'Convênio Exemplo B', 'Plano de Saúde Exemplo C', 'Convênio com nome bem longo para teste D']
  },

  faq: [
    { titulo: 'Como funciona a primeira consulta?', texto: 'É uma conversa sem pressa sobre o que você carrega hoje: sono, rotina, trabalho, histórico de saúde. Ao final, combinamos juntas os próximos passos.' },
    { titulo: 'Atende por teleconsulta?', texto: 'Sim. A teleconsulta segue os mesmos cuidados da consulta presencial e é feita por uma plataforma segura de vídeo.' },
    { titulo: 'Como marco um horário?', texto: 'Todo agendamento é feito pelo WhatsApp (22) 98823-0320. A equipe responde com os horários disponíveis.' },
    { titulo: 'Emite recibo para reembolso?', texto: 'Sim. Você recebe recibo para solicitar o reembolso ao seu plano de saúde, conforme as regras do seu contrato.' },
    { titulo: 'E se eu estiver em crise agora?', texto: 'Esta página não é um canal de urgência. Ligue para o CVV no 188 ou para o SAMU no 192, ou procure o pronto-socorro mais próximo.' }
  ],
  faqExemplo: true,

  rodape: {
    links: [
      { texto: 'Política de privacidade', href: '#privacidade' },
      { texto: 'Aviso legal', href: '#aviso-legal' },
      { texto: 'Voltar ao topo', href: '#topo' },
      { texto: 'Biblioteca de componentes', href: 'biblioteca.html' }
    ]
  }
};
