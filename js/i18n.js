/* =========================================================
   DYO Studio — TRADUÇÃO PT / EN
   ---------------------------------------------------------
   Para trocar os textos, edite as chaves abaixo.
   Cada chave tem "pt" (português) e "en" (inglês).

   Os elementos do HTML que têm data-i18n="chave" são
   trocados automaticamente ao clicar no botão PT | EN.
   ========================================================= */

window.DYO_I18N = {
  "brand.home":       { pt: "DYO Studio — início", en: "DYO Studio — home" },
  "nav.about":        { pt: "Sobre",        en: "About" },
  "nav.main":         { pt: "Navegação principal", en: "Main navigation" },
  "nav.footer":       { pt: "Navegação do rodapé", en: "Footer navigation" },
  "nav.portfolio":    { pt: "Portfólio",    en: "Portfolio" },
  "nav.testimonials": { pt: "Depoimentos",  en: "Testimonials" },
  "nav.faq":          { pt: "FAQ",          en: "FAQ" },
  "nav.contact":      { pt: "Contato",      en: "Contact" },

  "hero.eyebrow":     { pt: "Editor de vídeos & YouTuber",              en: "Video Editor & YouTuber" },
  "hero.subtitle":    { pt: "Edição que faz o seu conteúdo parar o scroll.",  en: "Editing that makes your content stop the scroll." },
  "hero.description": { pt: "Transformo ideias em vídeos com ritmo, criatividade e atenção aos detalhes.", en: "I turn ideas into videos with rhythm, creativity, and attention to detail." },
  "hero.cta.portfolio": { pt: "Ver portfólio", en: "See portfolio" },
  "hero.cta.contact":   { pt: "Entrar em contato", en: "Get in touch" },
  "about.available":  { pt: "Disponível para projetos", en: "Available for projects" },
  "about.title":      { pt: "SOBRE", en: "ABOUT" },
  "about.title2":     { pt: "MIM", en: "ME" },
  "about.p1": {
    pt: 'Meu nome é Diego, mas prefiro usar <strong>DYO</strong> como apelido no ramo da edição. Gosto de manter uma boa relação com meus clientes e não me limito apenas a editar os vídeos — também ajudo com ideias e sugestões para melhorar o conteúdo.',
    en: 'My name is Diego, but I go by <strong>DYO</strong> in the editing world. I value a good relationship with my clients and don\'t just edit — I also help with ideas and suggestions to improve your content.'
  },
  "about.p2": {
    pt: 'Trabalho com <strong>Shorts, Reels, TikToks</strong> e vídeos longos para <strong>YouTube</strong>. Cada projeto recebe atenção total, do corte aos efeitos finais.',
    en: 'I work with <strong>Shorts, Reels, TikToks</strong> and long-form videos for <strong>YouTube</strong>. Every project gets full attention, from the cut to the final effects.'
  },
  "about.stat.experience": { pt: "Ano de experiência",   en: "Year of experience" },
  "about.stat.projects":   { pt: "Projetos entregues",   en: "Projects delivered" },
  "about.stat.platforms":  { pt: "Plataformas atendidas", en: "Platforms served" },
  "about.software":        { pt: "Ferramentas",           en: "Tools" },
  "about.stats":           { pt: "Estatísticas",          en: "Statistics" },

  "testimonials.title": { pt: "Depoimentos",                                        en: "Testimonials" },
  "testimonials.lead":  { pt: "Alguns depoimentos de quem já trabalhou comigo. Em breve mais novidades por aqui.", en: "Some testimonials from people I've worked with. More coming soon." },

  "portfolio.short.title": { pt: "Vídeos Curtos", en: "Short-Form Videos" },
  "portfolio.short.description": { pt: "Vídeos verticais de alta conversão para Reels, Shorts e TikTok.", en: "High-conversion vertical videos for Reels, Shorts, and TikTok." },
  "portfolio.long.title": { pt: "Vídeos Longos", en: "Long-Form Videos" },
  "portfolio.long.description": { pt: "Edições imersivas em widescreen para YouTube e comerciais.", en: "Immersive widescreen edits for YouTube and commercials." },
  "portfolio.all": { pt: "Todos", en: "All" },
  "portfolio.previous": { pt: "Vídeo anterior", en: "Previous video" },
  "portfolio.next": { pt: "Próximo vídeo", en: "Next video" },
  "testimonials.previous": { pt: "Depoimento anterior", en: "Previous testimonial" },
  "testimonials.next": { pt: "Próximo depoimento", en: "Next testimonial" },
  "testimonials.navigation": { pt: "Navegação de depoimentos", en: "Testimonial navigation" },
  "testimonials.carousel": { pt: "Depoimentos de clientes", en: "Client testimonials" },
  "hero.tools":       { pt: "Ferramentas",  en: "Tools" },

  "faq.title":  { pt: "Perguntas",   en: "Frequently" },
  "faq.title2": { pt: "Frequentes",  en: "Asked Questions" },
  "faq.lead":   { pt: "Tem dúvidas? Aqui estão as respostas mais comuns.", en: "Have questions? Here are the most common answers." },
  "faq.list":   { pt: "Perguntas frequentes", en: "Frequently asked questions" },

  "contact.title":  { pt: "Gostou do meu", en: "Like my" },
  "contact.title2": { pt: "trabalho?",     en: "work?" },
  "contact.lead":   { pt: "Vamos conversar sobre o seu próximo projeto? Me chama no canal que preferir.", en: "Let's talk about your next project? Reach out on your preferred channel." },
  "contact.cta":    { pt: "Bora tirar seu vídeo <span class=\"accent\">do papel?</span>", en: "Ready to bring your video <span class=\"accent\">to life?</span>" },
  "contact.btn":    { pt: "Entrar em contato", en: "Get in touch" },
  "contact.note":   { pt: "Costumo responder no mesmo dia. 😉", en: "I usually reply the same day. 😉" },
  "contact.channels": { pt: "Canais de contato", en: "Contact channels" },

  "footer.tagline": { pt: "Edição • Pós-produção", en: "Editing • Post-production" },
  "footer.rights":  { pt: "Todos os direitos reservados.", en: "All rights reserved." },
  "footer.credit":  { pt: "Site por DYO Studio",   en: "Site by DYO Studio" },
};

/* =========================================================
   Motor de tradução — não precisa editar abaixo
   ========================================================= */
(function () {
  const STORAGE_KEY = "dyo-lang-v2";
  let currentLang = localStorage.getItem(STORAGE_KEY) === "pt" ? "pt" : "en";

  function translateElements(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const entry = window.DYO_I18N[key];
      if (!entry || entry[lang] === undefined) return;
      const text = entry[lang];
      if (/<[a-z]/i.test(text)) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      const entry = window.DYO_I18N[key];
      if (entry && entry[lang] !== undefined) {
        el.setAttribute("aria-label", entry[lang]);
      }
    });
  }

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    // Atualiza o atributo lang do HTML
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

    translateElements(lang);

    // Atualiza o rótulo do botão
    const label = document.getElementById("lang-label");
    if (label) {
      if (lang === "pt") {
        label.innerHTML = '<span class="lang-active">PT</span> | EN';
      } else {
        label.innerHTML = 'PT | <span class="lang-active">EN</span>';
      }
    }

    const button = document.getElementById("lang-toggle");
    if (button) {
      button.setAttribute(
        "aria-label",
        lang === "pt" ? "Mudar para inglês" : "Switch to Portuguese"
      );
      button.title = lang === "pt" ? "Mudar para inglês" : "Switch to Portuguese";
    }

    document.dispatchEvent(
      new CustomEvent("dyo:languagechange", { detail: { lang } })
    );
  }

  document.addEventListener("dyo:contentready", () => {
    translateElements(currentLang);
  });

  // Botão de troca
  function initLangToggle() {
    const btn = document.getElementById("lang-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      applyLang(currentLang === "pt" ? "en" : "pt");
    });
    // Aplica o idioma salvo ao carregar
    applyLang(currentLang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLangToggle);
  } else {
    initLangToggle();
  }
})();
