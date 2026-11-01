/* =========================================================
   Dyo — CONTEÚDO EDITÁVEL
   Feito por: MRJGodzilla
   Ano: 2026

   Esse é o arquivo que você mais vai mexer.
   Aqui ficam: informações do perfil, vídeos do portfólio,
   depoimentos e links de contato.

   A lógica do site fica em js/app.js — não precisa mexer lá.

   Para mudanças simples, troque o texto ENTRE aspas.
   Para adicionar um vídeo, siga o passo a passo do leia-me.txt.
   Não apague chaves { }, colchetes [ ] nem vírgulas.
   ========================================================= */

window.SITE_CONTENT = {
  // Informações profissionais opcionais: pares { label: "", text: "" }.
  // Preencha somente com informações reais. Consulte a seção final do leia-me.txt.
  profileDetails: [],

  /* =========================================================
     PORTFÓLIO — os vídeos do YouTube
     ---------------------------------------------------------
     Cada bloco { ... } é um vídeo. Pra adicionar outro,
     copie um bloco inteiro, cole embaixo do último e
     ajuste as informações.

     Campo "type" (qual botão de filtro mostra o vídeo):
       "video"  → botão Vídeos (vídeos longos, horizontais)
       "short"  → botão Shorts (vídeos curtos, verticais)
       "motion" → botão Motion Design (animações)

     Como pegar o youtubeId:
       Link: youtube.com/watch?v=fK036KNKLbQ  →  ID: fK036KNKLbQ
       Link: youtube.com/shorts/nA2FhmL1bcU   →  ID: nA2FhmL1bcU
     ========================================================= */
  projects: [
      {
      title: "Vai comprar um monitor gamer?",
      youtubeId: "g8xepPKiihs",
      category: "video curto",
      type: "short",
      format: "vertical",
    },
    {
      title: "3 melhores dribles do basquete",
      youtubeId: "gAlBlcIFumM",
      category: "video curto",
      type: "short",
      format: "vertical",
    },
  ],

  /* =========================================================
     DEPOIMENTOS
     ---------------------------------------------------------
     avatar → caminho da foto (coloque o arquivo em
              img/testimonials/). Se deixar vazio (""), o site
              mostra um círculo amarelo com as iniciais.
     ========================================================= */
  testimonials: [
    {
      name: "Lagu",
      handle: "@LaguBR",
      quote: "Meu Deus que qualidade boa Você é profissional Valeu todo tempo esperada.",
      avatar: "img/testimonials/lagu.webp",
    },
  ],

  /* =========================================================
     LINKS DE CONTATO
     ---------------------------------------------------------
     IMPORTANTE no WhatsApp: o número precisa ter o "55"
     na frente (código do Brasil).
     ========================================================= */
  contactLinks: {
    whatsapp: "https://wa.me/5521984315865",
    instagram: "https://www.instagram.com/itsd.yoooo",
    x: "https://x.com/itsdyooooo",
    tiktok: "https://www.tiktok.com/@itsdyo",
    primary: "https://wa.me/5521984315865", // botão grande "Entrar em contato"
  },
};
