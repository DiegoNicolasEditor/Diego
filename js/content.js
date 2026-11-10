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
      title: "Zenix Blox Fruits - Publicidade",
      youtubeId: "6xIJSPdCA9A",
      category: "Publicidade",
      categoryEn: "Advertising",
      type: "short",
      format: "vertical",
    },
    {
      title: "Tutorial de dribles",
      youtubeId: "gAlBlcIFumM",
      category: "Tutorial",
      categoryEn: "Tutorial",
      type: "short",
      format: "vertical",
    },
    {
      title: "Comer bem faz diferença? - profissionais",
      youtubeId: "kkN-d-8E-0E",
      category: "Conteúdo profissional",
      categoryEn: "Professional content",
      type: "short",
      format: "vertical",
    },
    {
      title: "5 melhores monitores - publicidades",
      youtubeId: "g8xepPKiihs",
      category: "Publicidade",
      categoryEn: "Advertising",
      type: "short",
      format: "vertical",
    },

    // --- VÍDEOS LONGOS (YouTube / Widescreen) ---
    {
      title: "Mundo eterno - Minecraft",
      youtubeId: "QWExYEmhqRM",
      category: "Gameplay",
      categoryEn: "Gameplay",
      type: "video",
      format: "horizontal",
    },
  ],

  /* =========================================================
     DEPOIMENTOS
     ---------------------------------------------------------
     avatar → caminho da foto (coloque o arquivo em
              img/testimonials/). Se deixar vazio (""), o site
              mostra um círculo neutro com as iniciais.
     rating → nota inteira de 1 a 5; as estrelas acompanham o valor.
     ========================================================= */
  testimonials: [
    {
      name: "Lagu",
      handle: "@LaguBR",
      rating: 5,
      quote: "Meu Deus, que qualidade boa! Você é profissional. Valeu todo o tempo de espera.",
      quoteEn: "Oh my God, the quality is so good! You're a professional. It was well worth the wait.",
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

  /* =========================================================
     FAQ — PERGUNTAS FREQUENTES
     ---------------------------------------------------------
     Adicione ou remova pares { q: "Pergunta", a: "Resposta" }.
     Você pode usar en: { q: "...", a: "..." } para tradução.
     ========================================================= */
  faq: [
    {
      q: "Quanto tempo leva para editar um vídeo?",
      a: "Em geral, levo de 5 a 10 horas para editar um Short. Projetos mais complexos podem levar mais tempo. Vídeos longos levam de 1 a 2 dias, dependendo do projeto. Se tiver urgência, me avisa e vejo se consigo adiantar.",
      en: {
        q: "How long does it take to edit a video?",
          a: "Shorts usually take me 5 to 10 hours to edit. More complex projects can take longer. Long-form videos take 1 to 2 days, depending on the project. If you're in a hurry, let me know and I'll see if I can move things along.",
      },
    },
    {
      q: "Quais programas você usa?",
      a: "Uso principalmente Premiere Pro, After Effects e CapCut. Escolho as ferramentas conforme o que cada projeto precisa.",
      en: {
        q: "What software do you use?",
          a: "I mainly use Premiere Pro, After Effects, and CapCut. I choose the tools based on what each project needs.",
      },
    },
    {
      q: "Você edita Shorts e vídeos longos?",
      a: "Edito os dois formatos: Shorts, Reels e TikToks verticais, além de vídeos horizontais para YouTube.",
      en: {
        q: "Do you edit Shorts and long videos?",
          a: "I edit both formats: vertical Shorts, Reels, and TikToks, as well as horizontal videos for YouTube.",
      },
    },
    {
      q: "Como funciona o pagamento?",
      a: "Antes de começar, combinamos os detalhes pelo WhatsApp ou Discord. Aceito Pix, e o valor depende da complexidade do projeto.",
      en: {
        q: "How does payment work?",
          a: "Before we start, we sort out the details on WhatsApp or Discord. I accept Pix, and the price depends on the project's complexity.",
      },
    },
    {
      q: "Aceita revisões após entregar?",
      a: "Todos os planos e pacotes incluem 3 revisões. Se precisar de algum ajuste depois da entrega, me chama e a gente acerta os detalhes.",
      en: {
        q: "Do you accept revisions after delivery?",
          a: "All plans and packages include 3 revisions. If you need an adjustment after delivery, get in touch and we'll work out the details.",
      },
    },
  ],
};
