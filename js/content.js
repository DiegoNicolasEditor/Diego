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
              mostra um círculo neutro com as iniciais.
     ========================================================= */
  testimonials: [
    {
      name: "Lagu",
      handle: "@LaguBR",
      quote: "Meu Deus, que qualidade boa! Você é profissional. Valeu todo o tempo de espera.",
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
      a: "Shorts levam de 5 a 10 horas para editar, podendo levar mais tempo dependendo da dificuldade. Vídeos longos levam de 1 a 2 dias, também dependendo da dificuldade. Em projetos urgentes, posso acelerar — é só me avisar!",
      en: {
        q: "How long does it take to edit a video?",
        a: "Shorts take 5 to 10 hours to edit and may take longer depending on the complexity. Long-form videos take 1 to 2 days, also depending on the complexity. For urgent projects, I may be able to speed things up — just let me know!",
      },
    },
    {
      q: "Quais programas você usa?",
      a: "Trabalho principalmente com Adobe Premiere Pro, After Effects e CapCut. Posso adaptar o fluxo conforme a necessidade do projeto.",
      en: {
        q: "What software do you use?",
        a: "I mainly use Adobe Premiere Pro, After Effects, and CapCut. I can adapt my workflow to your project's needs.",
      },
    },
    {
      q: "Você edita Shorts e vídeos longos?",
      a: "Sim! Edito os dois formatos. Tenho experiência com Shorts/Reels/TikToks verticais e também com vídeos horizontais para YouTube.",
      en: {
        q: "Do you edit Shorts and long videos?",
        a: "Yes! I edit both formats. I have experience with vertical Shorts/Reels/TikToks and horizontal YouTube videos.",
      },
    },
    {
      q: "Como funciona o pagamento?",
      a: "Combinamos os detalhes pelo WhatsApp ou Discord antes de começar. Aceito Pix, e os valores variam de acordo com a complexidade do projeto.",
      en: {
        q: "How does payment work?",
        a: "We sort out the details on WhatsApp or Discord before starting. I accept Pix, and prices vary based on project complexity.",
      },
    },
    {
      q: "Aceita revisões após entregar?",
      a: "Sim! Todos os planos e pacotes incluem 3 revisões. Se precisar de algum ajuste, é só falar — fico feliz em deixar o vídeo do jeito que você imaginou.",
      en: {
        q: "Do you accept revisions after delivery?",
        a: "Yes! All plans and packages include 3 revisions. If you need any adjustments, just let me know — I'm happy to make the video exactly how you envisioned it.",
      },
    },
  ],
};
