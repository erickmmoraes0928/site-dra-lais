# Site Dra. Lais Azevedo

Site de apresentação profissional no estilo Linktree para a Dra. Lais Azevedo, médica com atuação em saúde mental (CRM-RJ 521381560). Reúne perfil, agendamento pelo WhatsApp, temas de cuidado, formação, conteúdos, local de atendimento, perguntas frequentes e contato.

- **Site:** `index.html`
- **Biblioteca de componentes:** `biblioteca.html`, com fundamentos (cores, tipografia, espaçamento, ícones, movimento), componentes básicos e componentes do site, cada um com variantes e estados.

Publicado com autorização da Dra. Lais. Itens marcados como "exemplo" (convênios, detalhes do consultório, parte da formação, e-mail e respostas do FAQ) são fictícios. Os retratos são imagens ilustrativas.

## Como funciona

HTML, CSS e JavaScript puros, sem dependências nem etapa de build.

| Arquivo | Papel |
| --- | --- |
| `tokens.css` | Paleta Sol & Sálvia, tipografia (Cormorant Garamond + DM Sans), espaçamento, raios, sombras e curvas de movimento |
| `componentes.css` / `componentes.js` | Componentes reutilizáveis (render em funções `DL.*`) e seus comportamentos |
| `animacoes.css` / `animacoes.js` | Camada de movimento: toque, entradas, toasts empilhados, drawer arrastável, botão flutuante |
| `conteudo.js` | Todo o texto e os dados do site |
| `catalogo.css` / `catalogo.js` | Página da biblioteca |

O movimento segue a filosofia de design engineering de Emil Kowalski: curvas ease-out próprias, saídas mais curtas que entradas, só `transform` e `opacity`, feedback de toque e respeito a "reduzir movimento".

## Rodar localmente

```bash
python3 -m http.server 4173
```

Depois abra http://localhost:4173.
