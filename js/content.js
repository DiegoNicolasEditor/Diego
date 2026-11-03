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
  profileDetails: [],

  /* =========================================================
     PORTFÓLIO — SEUS VÍDEOS
     ---------------------------------------------------------
     - type: "short" (ou format: "vertical")  → Player de Vídeos Curtos (9:16)
     - type: "video" (ou format: "horizontal")→ Player de Vídeos Longos (16:9)

     Você pode usar:
       video: "videos/nome-do-arquivo.mp4"
     ou:
       youtubeId: "ID_DO_VIDEO"
     ========================================================= */
  projects: [
    // --- VÍDEOS CURTOS (Shorts / Reels / TikTok) ---
    {
      title: "Tutorial de dribles",
      youtubeId: "gAlBlcIFumM",
      category: "Tutorial",
      type: "short",
      format: "vertical",
    },
    {
      title: "Comer bem faz diferença? - profissionais",
      youtubeId: "kkN-d-8E-0E",
      category: "Conteúdo profissional",
      type: "short",
      format: "vertical",
    },
    {
      title: "5 melhores monitores - publicidades",
      youtubeId: "g8xepPKiihs",
      category: "Publicidade",
      type: "short",
      format: "vertical",
    },

    // --- VÍDEOS LONGOS (YouTube / Widescreen) ---
    {
      title: "Mundo eterno - Minecraft",
      youtubeId: "QWExYEmhqRM",
      category: "Gameplay",
      type: "video",
      format: "horizontal",
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
