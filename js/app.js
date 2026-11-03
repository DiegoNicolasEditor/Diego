/* =========================================================
   Dyo — LÓGICA DO SITE
   Feito por: MRJGodzilla
   Ano: 2026

   Esse arquivo monta as seções a partir do conteúdo que
   está em js/content.js e cuida do menu, filtros,
   carrossel e animações.

   Pra trocar textos, vídeos ou links, edite o
   js/content.js — você não precisa mexer aqui.
   ========================================================= */

(function () {
  "use strict";

  const content = window.SITE_CONTENT || {};
  const projects = content.projects || [];
  const testimonials = content.testimonials || [];
  const contactLinks = content.contactLinks || {};
  const faqItems = content.faq || [];

  function currentLanguage() {
    return document.documentElement.lang === "en" ? "en" : "pt";
  }

  function translated(key) {
    return window.DYO_I18N?.[key]?.[currentLanguage()] || key;
  }

  function categoryLabelFor(item) {
    if (!item) return "";
    return currentLanguage() === "en" ? (item.categoryEn || item.category || "") : (item.category || "");
  }

  function setPlayerLabel(element, key) {
    if (!element) return;
    element.dataset.i18nAriaLabel = key;
    element.setAttribute("aria-label", translated(key));
  }

  /* ---------- Funções auxiliares ---------- */
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  // Cria um elemento HTML já com classe e texto
  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  // Pega as iniciais do nome (ex: "João Silva" vira "JS")
  function getInitials(name) {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }

  /* ---------- Navegação (header + menu do celular) ---------- */
  function initNavigation() {
    const header = qs("#site-header");
    const toggle = qs("#nav-toggle");
    const nav = qs("#site-nav");

    const updateActiveLink = () => {
      if (!nav) return;

      const links = qsa('.site-nav a[href^="#"]', nav);
      const activationPoint = window.scrollY + window.innerHeight * 0.35;
      let activeLink = null;

      links.forEach((link) => {
        const section = document.getElementById(link.hash.slice(1));
        if (
          section &&
          section.getBoundingClientRect().top + window.scrollY <= activationPoint
        ) {
          activeLink = link;
        }
      });

      links.forEach((link) => {
        const isActive = link === activeLink;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    // Escurece o header quando rola a página
    if (header) {
      let scrollUpdatePending = false;
      const onScroll = () => {
        if (scrollUpdatePending) return;
        scrollUpdatePending = true;
        window.requestAnimationFrame(() => {
          header.classList.toggle("is-scrolled", window.scrollY > 10);
          updateActiveLink();
          scrollUpdatePending = false;
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    } else updateActiveLink();

    if (!toggle || !nav) return;

    const setOpen = (open) => {
      const isEnglish = document.documentElement.lang === "en";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        isEnglish
          ? (open ? "Close menu" : "Open menu")
          : (open ? "Fechar menu" : "Abrir menu")
      );
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Fecha o menu ao clicar em um link
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    // Fecha com a tecla ESC
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
      if (event.key === "Tab" && nav.classList.contains("is-open")) {
        const controls = [...qsa("a", nav), toggle];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    // Fecha se a tela aumentar (virar computador)
    window.addEventListener("resize", () => {
      updateActiveLink();
      if (window.innerWidth > 1280) setOpen(false);
    });
  }

  /* ---------- Animações de entrada (reveal) ---------- */
  function initRevealAnimations() {
    const elements = qsa(".reveal");
    const staggeredElements = [];
    const staggeredGroups = [
      ".hero-tools-list > .hero-tool",
      ".about-meta > .meta-item",
      ".kx-filter-tabs > .kx-filter-tab",
      ".contact-links > .contact-link",
      ".testimonials-track > .testimonial-card",
      ".site-footer .footer-brand",
      ".site-footer .footer-nav > a",
      ".site-footer .footer-copy > span",
    ];

    staggeredGroups.forEach((selector) => {
      qsa(selector).forEach((element, index) => {
        element.classList.add("reveal", "reveal-pending");
        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, 4) * 60}ms`
        );
        element.addEventListener("transitionend", (event) => {
          if (event.target === element) {
            element.style.removeProperty("--reveal-delay");
          }
        }, { once: true });
        elements.push(element);
        staggeredElements.push(element);
      });
    });

    if (!elements.length) return;
    // Evita animar os elementos para fora ao preparar a entrada em cascata.
    void document.body.offsetHeight;
    staggeredElements.forEach((element) => {
      element.classList.remove("reveal-pending");
    });

    // Navegadores antigos: mostra tudo
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => {
        el.classList.add("is-visible");
        el.style.removeProperty("--reveal-delay");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ---------- Informações opcionais escritas pelo dono do site ---------- */
  // Campos vazios não criam títulos, promessas ou espaços em branco.
  function hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function createDetailList(items) {
    if (!Array.isArray(items)) return null;
    const valid = items.filter((item) => item && hasText(item.label) && hasText(item.text));
    if (!valid.length) return null;
    const list = createEl("dl", "detail-list");
    valid.forEach((item) => {
      const row = createEl("div", "detail-row");
      row.appendChild(createEl("dt", null, item.label));
      row.appendChild(createEl("dd", null, item.text));
      list.appendChild(row);
    });
    return list;
  }

  function appendDetails(container, items) {
    const list = createDetailList(items);
    if (list) container.appendChild(list);
  }

  function initProfileDetails() {
    const container = qs("#profile-details");
    if (!container) return;
    appendDetails(container, content.profileDetails);
    container.hidden = !container.childElementCount;
  }

  /* ---------- Ícones Phosphor do Player (Estilo kxeditor) ---------- */
  const KX_ICONS = {
    caretLeft: '<svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z"/></svg>',
    caretRight: '<svg viewBox="0 0 256 256" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M181.66 133.66l-80 80a8 8 0 0 1-11.32-11.32L164.69 128 90.34 53.66a8 8 0 0 1 11.32-11.32l80 80a8 8 0 0 1 0 11.32Z"/></svg>',
    play: '<svg viewBox="0 0 256 256" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82 16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128Z"/></svg>',
    pause: '<svg viewBox="0 0 256 256" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M216 48v160a16 16 0 0 1-16 16h-40a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h40a16 16 0 0 1 16 16Zm-96 0v160a16 16 0 0 1-16 16H64a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h40a16 16 0 0 1 16 16Z"/></svg>',
    volumeHigh: '<svg viewBox="0 0 256 256" width="20" height="20" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M152 72v112a8 8 0 0 1-12.8 6.4L88 152H40a8 8 0 0 1-8-8v-32a8 8 0 0 1 8-8h48l51.2-38.4A8 8 0 0 1 152 72Z" fill="currentColor"/><path d="M192 104a32 32 0 0 1 0 48"/><path d="M224 88a64 64 0 0 1 0 80"/></svg>',
    volumeLow: '<svg viewBox="0 0 256 256" width="20" height="20" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M152 72v112a8 8 0 0 1-12.8 6.4L88 152H40a8 8 0 0 1-8-8v-32a8 8 0 0 1 8-8h48l51.2-38.4A8 8 0 0 1 152 72Z" fill="currentColor"/><path d="M192 104a32 32 0 0 1 0 48"/></svg>',
    volumeMute: '<svg viewBox="0 0 256 256" width="20" height="20" fill="none" stroke="currentColor" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M152 72v112a8 8 0 0 1-12.8 6.4L88 152H40a8 8 0 0 1-8-8v-32a8 8 0 0 1 8-8h48l51.2-38.4A8 8 0 0 1 152 72Z" fill="currentColor"/><line x1="200" y1="112" x2="232" y2="144"/><line x1="232" y1="112" x2="200" y2="144"/></svg>',
    fullscreen: '<svg viewBox="0 0 256 256" width="18" height="18" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="168 48 208 48 208 88"/><line x1="208" y1="48" x2="152" y2="104"/><polyline points="88 208 48 208 48 168"/><line x1="48" y1="208" x2="104" y2="152"/><polyline points="208 168 208 208 168 208"/><line x1="208" y1="208" x2="152" y2="152"/><polyline points="48 88 48 48 88 48"/><line x1="48" y1="48" x2="104" y2="104"/></svg>'
  };

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  const projectThumbnailCache = new Map();

  function getProjectThumbnailCandidates(item) {
    if (item.thumbnail) return [item.thumbnail];
    if (item.poster) return [item.poster];
    if (item.youtubeId) {
      const videoId = encodeURIComponent(item.youtubeId);
      return ["maxresdefault", "hq720", "sddefault", "hqdefault"].map(
        (size) => `https://i.ytimg.com/vi/${videoId}/${size}.jpg`
      );
    }
    return [];
  }

  function getProjectThumbnail(item) {
    return getProjectThumbnailCandidates(item)[0] || "";
  }

  function resolveProjectThumbnail(item) {
    const candidates = getProjectThumbnailCandidates(item);
    if (!candidates.length) return Promise.resolve("");
    const cacheKey = item.youtubeId || candidates[0];
    if (projectThumbnailCache.has(cacheKey)) return projectThumbnailCache.get(cacheKey);

    const resolved = new Promise((resolve) => {
      const probe = new Image();
      let index = 0;
      const tryNext = () => {
        const source = candidates[index];
        probe.onload = () => {
          if (probe.naturalWidth >= 640 || index === candidates.length - 1) {
            resolve(source);
            return;
          }
          index += 1;
          tryNext();
        };
        probe.onerror = () => {
          if (index === candidates.length - 1) {
            resolve(source);
            return;
          }
          index += 1;
          tryNext();
        };
        probe.src = source;
      };
      tryNext();
    });
    projectThumbnailCache.set(cacheKey, resolved);
    return resolved;
  }

  /* ---------- Motor do Player 3D Estilo kxeditor ---------- */
  function createKxPlayer(container, config) {
    if (!container) return;

    const {
      title,
      description,
      playerType, // "short" ou "long"
      items = [],
    } = config;

    if (!items.length) {
      container.hidden = true;
      return;
    }
    container.hidden = false;

    container.innerHTML = `
      <div class="kx-player-container">
        <div class="kx-player-header">
          <h2 class="kx-player-title" data-i18n="${playerType === "short" ? "portfolio.short.title" : "portfolio.long.title"}">${title}</h2>
          <p class="kx-player-desc" data-i18n="${playerType === "short" ? "portfolio.short.description" : "portfolio.long.description"}">${description}</p>
        </div>
        <div class="kx-filter-tabs" role="group" aria-label="Filtros do portfólio" data-i18n-aria-label="portfolio.filters"></div>
        <div class="kx-carousel-stage" tabindex="0">
          <button type="button" class="kx-nav-btn kx-nav-prev" aria-label="Vídeo anterior" data-i18n-aria-label="portfolio.previous">
            ${KX_ICONS.caretLeft}
          </button>
          <button type="button" class="kx-nav-btn kx-nav-next" aria-label="Próximo vídeo" data-i18n-aria-label="portfolio.next">
            ${KX_ICONS.caretRight}
          </button>
          <div class="kx-perspective-wrapper"></div>
        </div>
        <div class="kx-pagination"></div>
      </div>
    `;

    const filterTabsContainer = qs(".kx-filter-tabs", container);
    const stage = qs(".kx-carousel-stage", container);
    const perspectiveWrapper = qs(".kx-perspective-wrapper", container);
    const paginationContainer = qs(".kx-pagination", container);
    const paginationIndicator = createEl("span", "kx-pagination-indicator");
    paginationIndicator.setAttribute("aria-hidden", "true");
    const prevBtn = qs(".kx-nav-prev", container);
    const nextBtn = qs(".kx-nav-next", container);

    let activeFilter = null;
    let activeIndex = 0;
    let incomingDirection = 0;
    let filteredItems = [...items];

    // Estados de reprodução
    let isPlaying = false;
    let isMuted = false;
    let volume = 0.4;
    let duration = 0;
    let currentTime = 0;
    let hideControlsTimer = null;
    const hoverControls = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let isDraggingProgress = false;
    let isHoveringVolume = false;
    let activeVideoEl = null;
    let activeIframeEl = null;

    // Categorias únicas
    const rawCategories = items.map((p) => p.category).filter(Boolean);
    const categories = [null, ...Array.from(new Set(rawCategories))];

    // Renderiza tabs de filtro
    categories.forEach((cat) => {
      const isAll = cat === null;
      const itemForCategory = items.find((item) => item.category === cat);
      const categoryLabel = itemForCategory && currentLanguage() === "en"
        ? (itemForCategory.categoryEn || cat)
        : cat;
      const btn = createEl("button", "kx-filter-tab", isAll ? translated("portfolio.all") : categoryLabel);
      btn.type = "button";
      btn.dataset.category = isAll ? "" : cat;
      btn.setAttribute("aria-pressed", String(cat === activeFilter));
      if (isAll) btn.dataset.i18n = "portfolio.all";
      if (cat === activeFilter) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        if (activeFilter === cat) return;
        activeFilter = cat;
        qsa(".kx-filter-tab", filterTabsContainer).forEach((t) => {
          const selected = t.dataset.category === (isAll ? "" : cat);
          t.classList.toggle("is-active", selected);
          t.setAttribute("aria-pressed", String(selected));
        });
        filteredItems =
          isAll
            ? [...items]
            : items.filter((p) => p.category === cat);
        activeIndex = 0;
        incomingDirection = 0;
        resetPlayback();
        render();
      });
      filterTabsContainer.appendChild(btn);
    });

    document.addEventListener("dyo:languagechange", () => {
      qsa(".kx-filter-tab", filterTabsContainer).forEach((btn) => {
        const category = btn.dataset.category;
        if (!category) {
          btn.textContent = translated("portfolio.all");
          btn.dataset.i18n = "portfolio.all";
          return;
        }
        delete btn.dataset.i18n;
        const item = items.find((project) => project.category === category);
        btn.textContent = categoryLabelFor(item);
      });
      qsa(".kx-side-cat", container).forEach((label) => {
        const item = items.find((project) => project.category === label.dataset.category);
        label.textContent = categoryLabelFor(item);
      });
      const activeCategory = qs(".kx-controls-cat", container);
      if (activeCategory) activeCategory.textContent = categoryLabelFor(filteredItems[activeIndex]);
    });

    function resetPlayback() {
      if (activeVideoEl) {
        try {
          activeVideoEl.pause();
          activeVideoEl.currentTime = 0;
        } catch (_) {}
      }
      if (activeIframeEl) {
        activeIframeEl.remove();
        activeIframeEl = null;
      }
      isPlaying = false;
      currentTime = 0;
      clearTimeout(hideControlsTimer);
    }

    function scheduleControlsHide(controlsBar) {
      clearTimeout(hideControlsTimer);
      if (!controlsBar) return;

      if (hoverControls) {
        const card = controlsBar.closest(".kx-main-card");
        const show = isPlaying && (card?.matches(":hover") || card?.matches(":focus-within"));
        controlsBar.classList.toggle("is-hidden", !show);
        return;
      }

      if (!isPlaying) {
        controlsBar.classList.add("is-hidden");
        return;
      }

      controlsBar.classList.remove("is-hidden");
      if (isPlaying && !isDraggingProgress && !isHoveringVolume) {
        hideControlsTimer = setTimeout(() => {
          controlsBar.classList.add("is-hidden");
        }, 1300);
      }
    }

    function createSideCard(item, positionClass, direction) {
      const card = createEl("button", `kx-side-card ${positionClass}`);
      card.type = "button";
      card.setAttribute("aria-label", `${item.title} — ${categoryLabelFor(item)}`);

      const thumbUrl = getProjectThumbnail(item);
      const isLeft = positionClass.includes("left");

      card.innerHTML = `
        <img class="kx-side-thumb" src="${thumbUrl}" alt="${item.title}" loading="lazy" />
        <div class="kx-side-overlay"></div>
        <div class="kx-side-center-icon">
          <div class="kx-side-icon-circle">
            ${isLeft ? KX_ICONS.caretLeft : KX_ICONS.caretRight}
          </div>
        </div>
        <div class="kx-side-caption">
          <p class="kx-side-title">${item.title}</p>
          <span class="kx-side-cat" data-category="${item.category || ""}">${categoryLabelFor(item)}</span>
        </div>
      `;

      resolveProjectThumbnail(item).then((source) => {
        const thumbnail = qs(".kx-side-thumb", card);
        if (source && thumbnail?.isConnected) thumbnail.src = source;
      });

      card.addEventListener("click", (event) => {
        slideTo(direction, event.detail === 0);
      });

      return card;
    }

    function slideTo(direction, restoreStageFocus = false) {
      resetPlayback();
      const count = filteredItems.length;
      activeIndex = (activeIndex + direction + count) % count;
      incomingDirection = Math.sign(direction);
      render();
      if (restoreStageFocus) stage.focus({ preventScroll: true });
    }

    function renderPagination() {
      const restorePaginationFocus = paginationContainer.contains(document.activeElement);
      const currentDots = qsa(".kx-dot", paginationContainer);
      const needsRebuild = currentDots.length !== filteredItems.length || currentDots.some((dot, idx) =>
        dot.dataset.videoKey !== String(filteredItems[idx]?.youtubeId || filteredItems[idx]?.video || filteredItems[idx]?.title || "")
      );
      paginationContainer.style.display = filteredItems.length > 1 ? "flex" : "none";
      if (prevBtn) prevBtn.style.display = filteredItems.length > 1 ? "flex" : "none";
      if (nextBtn) nextBtn.style.display = filteredItems.length > 1 ? "flex" : "none";

      if (!paginationIndicator.isConnected) paginationContainer.appendChild(paginationIndicator);

      if (needsRebuild) {
        currentDots.forEach((dot) => dot.remove());
        filteredItems.forEach((item, idx) => {
          const dot = createEl("button", "kx-dot");
          dot.type = "button";
          dot.dataset.videoKey = String(item.youtubeId || item.video || item.title || "");
          dot.addEventListener("click", () => {
            const targetIndex = Number(dot.dataset.index);
            if (targetIndex === activeIndex) return;
            slideTo(targetIndex - activeIndex);
          });
          paginationContainer.insertBefore(dot, paginationIndicator);
        });
      }

      filteredItems.forEach((item, idx) => {
        const dot = qsa(".kx-dot", paginationContainer)[idx];
        const selected = idx === activeIndex;
        dot.dataset.index = String(idx);
        dot.setAttribute(
          "aria-label",
          currentLanguage() === "en"
            ? `Go to video ${idx + 1}: ${item.title}`
            : `Ir para vídeo ${idx + 1}: ${item.title}`
        );
        dot.setAttribute("aria-pressed", String(selected));
        dot.classList.toggle("is-active", selected);
      });

      const activeDot = qs(".kx-dot.is-active", paginationContainer);
      if (activeDot) {
        const indicatorX = activeDot.offsetLeft + activeDot.offsetWidth / 2 - 12;
        paginationIndicator.style.setProperty("--indicator-x", `${indicatorX}px`);
      }
      if (restorePaginationFocus) {
        qs(".kx-dot.is-active", paginationContainer)?.focus({ preventScroll: true });
      }
    }

    function render() {
      perspectiveWrapper.replaceChildren();
      renderPagination();

      const total = filteredItems.length;
      if (!total) return;

      const currentItem = filteredItems[activeIndex];
      const thumbUrl = getProjectThumbnail(currentItem);

      // Índices dos cards laterais
      const nearLeftIndex = (activeIndex - 1 + total) % total;
      const farLeftIndex = (activeIndex - 2 + total) % total;
      const nearRightIndex = (activeIndex + 1) % total;
      const farRightIndex = (activeIndex + 2) % total;

      // Card Far Left (se houver 3 ou mais)
      if (total >= 3) {
        perspectiveWrapper.appendChild(
          createSideCard(filteredItems[farLeftIndex], "kx-side-far kx-side-far-left", -2)
        );
      }

      // Card Near Left (se houver 2 ou mais)
      if (total >= 2) {
        perspectiveWrapper.appendChild(
          createSideCard(filteredItems[nearLeftIndex], "kx-side-near kx-side-near-left", -1)
        );
      }

      // Card Principal do Centro
      const mainCard = createEl("div", "kx-main-card");
      if (incomingDirection) {
        mainCard.classList.add("is-entering");
        mainCard.style.setProperty("--slide-direction", incomingDirection > 0 ? "1" : "-1");
      }
      mainCard.innerHTML = `
        <video class="kx-main-video" poster="${thumbUrl}" playsinline preload="metadata" loop></video>
        <div class="kx-play-center">
          <button type="button" class="kx-play-center-btn" aria-label="Reproduzir" data-i18n-aria-label="player.play">
            ${KX_ICONS.play}
          </button>
        </div>
        <div class="kx-controls-bar is-hidden">
          <div class="kx-controls-top">
            <div class="kx-controls-title-info">
              <p class="kx-controls-title">${currentItem.title}</p>
            <span class="kx-controls-cat">${categoryLabelFor(currentItem)}</span>
            </div>
            <div class="kx-controls-time">00:00 / 00:00</div>
          </div>
          <div class="kx-progress-box">
            <input type="range" class="kx-progress-range" min="0" max="100" step="0.1" value="0" aria-label="Progresso do vídeo" data-i18n-aria-label="player.progress" />
          </div>
          <div class="kx-controls-bottom">
            <div class="kx-controls-left">
              <button type="button" class="kx-ctrl-btn kx-play-btn" aria-label="Reproduzir" data-i18n-aria-label="player.play">
                ${KX_ICONS.play}
              </button>
              <div class="kx-volume-box">
                <button type="button" class="kx-ctrl-btn kx-vol-btn" aria-label="Silenciar" data-i18n-aria-label="player.mute">
                  ${KX_ICONS.volumeHigh}
                </button>
                <div class="kx-volume-popup">
                  <input type="range" class="kx-volume-range" min="0" max="1" step="0.05" value="${volume}" aria-label="Volume" data-i18n-aria-label="player.volume" />
                </div>
              </div>
            </div>
            <div class="kx-controls-right">
              <button type="button" class="kx-ctrl-btn kx-fullscreen-btn" aria-label="Tela cheia" data-i18n-aria-label="player.fullscreen">
                ${KX_ICONS.fullscreen}
              </button>
            </div>
          </div>
        </div>
      `;

      const video = qs(".kx-main-video", mainCard);
      const playCenter = qs(".kx-play-center", mainCard);
      const playCenterBtn = qs(".kx-play-center-btn", mainCard);
      const controlsBar = qs(".kx-controls-bar", mainCard);
      const playBtn = qs(".kx-play-btn", mainCard);
      const volBtn = qs(".kx-vol-btn", mainCard);
      const volumeRange = qs(".kx-volume-range", mainCard);
      const progressRange = qs(".kx-progress-range", mainCard);
      const timeDisplay = qs(".kx-controls-time", mainCard);
      const fullscreenBtn = qs(".kx-fullscreen-btn", mainCard);
      const volumeBox = qs(".kx-volume-box", mainCard);

      activeVideoEl = video;

      resolveProjectThumbnail(currentItem).then((source) => {
        if (source && video.isConnected) video.poster = source;
      });

      const hasDirectVideo = Boolean(currentItem.video);

      if (hasDirectVideo) {
        video.src = currentItem.video;
        video.volume = volume;
        video.muted = isMuted;
      }

      function updateVolIcon() {
        if (isMuted || volume === 0) {
          volBtn.innerHTML = KX_ICONS.volumeMute;
          setPlayerLabel(volBtn, "player.unmute");
        } else if (volume < 0.5) {
          volBtn.innerHTML = KX_ICONS.volumeLow;
          setPlayerLabel(volBtn, "player.mute");
        } else {
          volBtn.innerHTML = KX_ICONS.volumeHigh;
          setPlayerLabel(volBtn, "player.mute");
        }
      }

      function updatePlayState(playing) {
        isPlaying = playing;
        if (playing) {
          playCenter.classList.add("is-hidden");
          playBtn.innerHTML = KX_ICONS.pause;
          setPlayerLabel(playBtn, "player.pause");
          setPlayerLabel(playCenterBtn, "player.pause");
        } else {
          playCenter.classList.remove("is-hidden");
          playBtn.innerHTML = KX_ICONS.play;
          setPlayerLabel(playBtn, "player.play");
          setPlayerLabel(playCenterBtn, "player.play");
        }
        scheduleControlsHide(controlsBar);
      }

      function togglePlay() {
        if (hasDirectVideo) {
          if (video.paused) {
            video
              .play()
              .then(() => updatePlayState(true))
              .catch(() => {
                video.muted = true;
                isMuted = true;
                updateVolIcon();
                video.play().then(() => updatePlayState(true)).catch(() => {});
              });
          } else {
            video.pause();
            updatePlayState(false);
          }
        } else if (activeIframeEl) {
          const command = isPlaying ? "pauseVideo" : "playVideo";
          activeIframeEl.contentWindow?.postMessage(
            JSON.stringify({ event: "command", func: command, args: [] }),
            "*"
          );
          updatePlayState(!isPlaying);
        } else if (currentItem.youtubeId) {
          // Incorpora o YouTube dentro do próprio frame do player
          if (!activeIframeEl) {
            const iframe = document.createElement("iframe");
            iframe.className = "kx-main-iframe";
            iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(
              currentItem.youtubeId
            )}?autoplay=1&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3`;
            iframe.title = currentItem.title;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";
            iframe.allow =
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            mainCard.prepend(iframe);
            activeIframeEl = iframe;
            video.style.display = "none";
            updatePlayState(true);
          }
        }
      }

      // Eventos do vídeo direto
      if (hasDirectVideo) {
        video.addEventListener("loadedmetadata", () => {
          duration = video.duration || 0;
          progressRange.max = duration;
          timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(duration)}`;
        });

        video.addEventListener("timeupdate", () => {
          if (!isDraggingProgress) {
            currentTime = video.currentTime;
            progressRange.value = currentTime;
            timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration || video.duration)}`;
          }
        });

        video.addEventListener("play", () => updatePlayState(true));
        video.addEventListener("pause", () => updatePlayState(false));

        progressRange.addEventListener("input", (e) => {
          isDraggingProgress = true;
          const val = parseFloat(e.target.value);
          timeDisplay.textContent = `${formatTime(val)} / ${formatTime(duration || video.duration)}`;
        });

        progressRange.addEventListener("change", (e) => {
          isDraggingProgress = false;
          const val = parseFloat(e.target.value);
          video.currentTime = val;
          scheduleControlsHide(controlsBar);
        });

        playBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (e.detail > 0) playBtn.blur();
          togglePlay();
        });

        volBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          isMuted = !isMuted;
          video.muted = isMuted;
          if (!isMuted && volume === 0) {
            volume = 0.5;
            video.volume = 0.5;
            volumeRange.value = 0.5;
          }
          updateVolIcon();
          scheduleControlsHide(controlsBar);
        });

        volumeRange.addEventListener("input", (e) => {
          e.stopPropagation();
          const val = parseFloat(e.target.value);
          volume = val;
          video.volume = val;
          isMuted = val === 0;
          video.muted = isMuted;
          updateVolIcon();
        });

        fullscreenBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          } else {
            (mainCard.requestFullscreen || mainCard.webkitRequestFullscreen || mainCard.msRequestFullscreen)
              ?.call(mainCard)
              .catch(() => {});
          }
        });

        volumeBox.addEventListener("mouseenter", () => {
          isHoveringVolume = true;
          scheduleControlsHide(controlsBar);
        });
        volumeBox.addEventListener("mouseleave", () => {
          isHoveringVolume = false;
          scheduleControlsHide(controlsBar);
        });
      } else {
        // Se for YouTube, simplifica o botão play/fullscreen
        playBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          togglePlay();
        });
        volBtn.style.display = "none";
        volumeRange.style.display = "none";
        progressRange.style.display = "none";
        timeDisplay.style.display = "none";
        fullscreenBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          } else {
            mainCard.requestFullscreen?.().catch(() => {});
          }
        });
      }

      playCenterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (e.detail > 0) playCenterBtn.blur();
        togglePlay();
      });

      mainCard.addEventListener("click", () => {
        if (!activeIframeEl) togglePlay();
      });

      mainCard.addEventListener("mousemove", () => scheduleControlsHide(controlsBar));
      mainCard.addEventListener("mouseenter", () => scheduleControlsHide(controlsBar));
      mainCard.addEventListener("mouseleave", () => {
        if (isPlaying && !isDraggingProgress && !isHoveringVolume && !mainCard.matches(":focus-within")) {
          controlsBar.classList.add("is-hidden");
        }
      });
      mainCard.addEventListener("focusin", () => scheduleControlsHide(controlsBar));
      mainCard.addEventListener("focusout", () => requestAnimationFrame(() => scheduleControlsHide(controlsBar)));

      perspectiveWrapper.appendChild(mainCard);
      if (incomingDirection) requestAnimationFrame(() => mainCard.classList.remove("is-entering"));
      incomingDirection = 0;

      // Card Near Right (se houver 2 ou mais)
      if (total >= 2) {
        perspectiveWrapper.appendChild(
          createSideCard(filteredItems[nearRightIndex], "kx-side-near kx-side-near-right", 1)
        );
      }

      // Card Far Right (se houver 3 ou mais)
      if (total >= 3) {
        perspectiveWrapper.appendChild(
          createSideCard(filteredItems[farRightIndex], "kx-side-far kx-side-far-right", 2)
        );
      }
    }

    // Botões de navegação
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      slideTo(-1);
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      slideTo(1);
    });

    // Teclado
    stage.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        slideTo(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        slideTo(1);
      } else if (e.key === " " && e.target === stage) {
        e.preventDefault();
        const centerBtn = qs(".kx-play-center-btn", stage);
        if (centerBtn) centerBtn.click();
      }
    });

    // Deslize horizontal sem capturar toques em controles nem scroll vertical.
    let touchStart = null;
    stage.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1 || e.target.closest("button, input, select, textarea")) {
          touchStart = null;
          return;
        }
        touchStart = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      },
      { passive: true }
    );
    stage.addEventListener(
      "touchend",
      (e) => {
        if (!touchStart) return;
        if (e.changedTouches.length !== 1) {
          touchStart = null;
          return;
        }
        const deltaX = e.changedTouches[0].clientX - touchStart.x;
        const deltaY = e.changedTouches[0].clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
          slideTo(deltaX < 0 ? 1 : -1);
        }
      },
      { passive: true }
    );
    stage.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });

    // Auto-pausa quando rolar para fora da tela (IntersectionObserver)
    if ("IntersectionObserver" in window) {
      let wasPlayingBeforeScroll = false;
      const obs = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!activeVideoEl) return;
          if (entry.isIntersecting) {
            if (wasPlayingBeforeScroll && activeVideoEl.paused) {
              activeVideoEl.play().catch(() => {});
            }
          } else {
            wasPlayingBeforeScroll = !activeVideoEl.paused;
            if (!activeVideoEl.paused) activeVideoEl.pause();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(container);
    }

    render();
  }

  /* ---------- Inicialização dos Players do Portfólio ---------- */
  function initKxPortfolio() {
    const shortsContainer = qs("#kx-shorts-section");
    const longsContainer = qs("#kx-longs-section");

    // Separa os projetos em curtos (verticais) e longos (horizontais)
    const shortProjects = projects.filter(
      (p) => p.format === "vertical" || p.type === "short"
    );
    const longProjects = projects.filter(
      (p) => p.format === "horizontal" || p.type === "video" || p.type === "long"
    );

    if (shortsContainer) {
      createKxPlayer(shortsContainer, {
        title: "Vídeos Curtos",
        description: "Vídeos verticais de alta conversão para Reels, Shorts e TikTok.",
        playerType: "short",
        items: shortProjects,
      });
    }

    if (longsContainer) {
      createKxPlayer(longsContainer, {
        title: "Vídeos Longos",
        description: "Edições imersivas em widescreen para YouTube e comerciais.",
        playerType: "long",
        items: longProjects,
      });
    }
  }

  /* ---------- Depoimentos (carrossel) ---------- */
  function createTestimonialCard(testimonial) {
    const article = createEl("article", "testimonial-card");

    const rating = Math.max(1, Math.min(5, Number.parseInt(testimonial.rating, 10) || 5));
    const stars = createEl("div", "testimonial-rating");
    stars.setAttribute("role", "img");
    stars.dataset.rating = String(rating);
    stars.setAttribute("aria-label", currentLanguage() === "en" ? `${rating} out of 5 stars` : `${rating} de 5 estrelas`);
    stars.innerHTML = Array.from({ length: 5 }, (_, index) => `<span aria-hidden="true" class="${index < rating ? "is-filled" : ""}">★</span>`).join("");
    article.appendChild(stars);

    const quote = createEl("p", "testimonial-quote", currentLanguage() === "en" ? (testimonial.quoteEn || testimonial.quote) : testimonial.quote);
    quote.dataset.quotePt = testimonial.quote;
    quote.dataset.quoteEn = testimonial.quoteEn || testimonial.quote;
    article.appendChild(quote);

    const author = createEl("div", "testimonial-author");
    const avatar = createEl("div", "testimonial-avatar");

    if (testimonial.avatar) {
      const img = document.createElement("img");
      img.src = testimonial.avatar;
      img.alt = currentLanguage() === "en" ? `Photo of ${testimonial.name}` : `Foto de ${testimonial.name}`;
      img.width = 48;
      img.height = 48;
      img.loading = "lazy";
      img.decoding = "async";
      // Se a foto falhar, mostra as iniciais do cliente.
      img.onerror = () => {
        img.remove();
        avatar.textContent = getInitials(testimonial.name);
      };
      avatar.appendChild(img);
    } else {
      avatar.textContent = getInitials(testimonial.name);
    }

    const info = createEl("div", "testimonial-author-info");
    info.appendChild(createEl("span", "testimonial-name", testimonial.name));
    const attribution = testimonial.role || testimonial.company || testimonial.handle;
    if (attribution) {
      info.appendChild(createEl("span", "testimonial-handle", attribution));
    }

    author.appendChild(avatar);
    author.appendChild(info);
    article.appendChild(author);

    return article;
  }

  function initTestimonials() {
    const track = qs("#testimonials-track");
    const controls = qs("#testimonials-controls");
    const prevBtn = qs('[data-carousel="prev"]');
    const nextBtn = qs('[data-carousel="next"]');
    const dotsContainer = qs("#carousel-dots");
    const progress = qs("#testimonials-progress");
    const viewport = qs("#testimonials-viewport");

    if (!track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    let group;
    let cycleDistance = 0;

    if (!testimonials.length) {
      if (controls) controls.hidden = true;
      if (progress) progress.hidden = true;
      return;
    }

    group = createEl("div", "testimonial-group");
    group.setAttribute("role", "group");
    group.setAttribute(
      "aria-label",
      document.documentElement.lang === "en" ? "Testimonials" : "Depoimentos"
    );
    testimonials.forEach((testimonial) => {
      group.appendChild(createTestimonialCard(testimonial));
    });
    track.appendChild(group);

    document.addEventListener("dyo:languagechange", (event) => {
      const english = event.detail?.lang === "en";
      group.setAttribute("aria-label", english ? "Testimonials" : "Depoimentos");
      qsa(".testimonial-card", track).forEach((card) => {
        const quote = qs(".testimonial-quote", card);
        const stars = qs(".testimonial-rating", card);
        const image = qs(".testimonial-avatar img", card);
        if (quote) quote.textContent = english ? quote.dataset.quoteEn : quote.dataset.quotePt;
        if (stars) stars.setAttribute("aria-label", english ? `${stars.dataset.rating} out of 5 stars` : `${stars.dataset.rating} de 5 estrelas`);
        if (image) image.alt = english ? `Photo of ${qs(".testimonial-name", card)?.textContent || "client"}` : `Foto de ${qs(".testimonial-name", card)?.textContent || "cliente"}`;
      });
    });

    const canMove = testimonials.length > 1;
    track.classList.toggle("is-static", !canMove);
    track.classList.toggle("is-marquee", canMove && !reducedMotion.matches);

    function cloneGroup(source) {
      const clone = source.cloneNode(true);
      clone.dataset.carouselClone = "";
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("img").forEach((img) => img.setAttribute("alt", ""));
      return clone;
    }

    function buildMarquee() {
      track.querySelectorAll("[data-carousel-clone]").forEach((clone) => clone.remove());
      if (!canMove || !viewport) return;

      const groupWidth = group.getBoundingClientRect().width;
      if (!groupWidth) return;
      const groupCount = Math.max(
        1,
        Math.ceil(viewport.getBoundingClientRect().width / groupWidth)
      );
      const cycle = [group];
      for (let i = 1; i < groupCount; i++) {
        const clone = cloneGroup(group);
        track.appendChild(clone);
        cycle.push(clone);
      }
      cycleDistance = groupWidth * groupCount;
      cycle.forEach((source) => track.appendChild(cloneGroup(source)));
    }

    if (canMove) {
      track.style.setProperty(
        "--testimonial-marquee-duration",
        `${Math.max(28, testimonials.length * 7)}s`
      );
      buildMarquee();
    }

    if (canMove && viewport && "IntersectionObserver" in window) {
      const marqueeObserver = new IntersectionObserver(([entry]) => {
        const paused = !entry.isIntersecting;
        track.classList.toggle("is-paused", paused);
        if (progress) progress.classList.toggle("is-paused", paused);
      }, { threshold: 0 });
      marqueeObserver.observe(viewport);
    }

    if (controls) controls.hidden = !canMove;
    if (progress) {
      progress.hidden = !canMove;
      progress.classList.toggle("is-marquee", canMove && !reducedMotion.matches);
    }

    function setActive(nextIndex) {
      index = (nextIndex + testimonials.length) % testimonials.length;
      group.querySelectorAll(".testimonial-card").forEach((card, cardIndex) => {
        card.classList.toggle("is-active", cardIndex === index);
      });

      if (dotsContainer) {
        qsa(".carousel-dot", dotsContainer).forEach((dot, dotIndex) => {
          const active = dotIndex === index;
          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-selected", active ? "true" : "false");
        });
      }

      if (prevBtn) prevBtn.disabled = !canMove;
      if (nextBtn) nextBtn.disabled = !canMove;
    }

    function getAnimation(element) {
      return element.getAnimations().find((animation) =>
        animation.effect.getKeyframes().some((frame) => frame.transform)
      );
    }

    function seekToCard(nextIndex) {
      setActive(nextIndex);
      if (!canMove) return;

      if (reducedMotion.matches) {
        const card = group.children[index];
        track.style.transform = `translateX(-${card.offsetLeft}px)`;
        return;
      }

      const animation = getAnimation(track);
      const progressAnimation = progress && getAnimation(progress.firstElementChild);
      const duration = Math.max(28000, testimonials.length * 7000);
      const offset = group.children[index].offsetLeft;
      const phase = (offset / cycleDistance) * duration;
      if (animation) animation.currentTime = phase;
      if (progressAnimation) progressAnimation.currentTime = phase;
    }

    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      testimonials.forEach((testimonial, dotIndex) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        const label = document.documentElement.lang === "en"
          ? `Go to testimonial ${dotIndex + 1}`
          : `Ir para depoimento ${dotIndex + 1}`;
        dot.setAttribute("aria-label", label);
        dot.setAttribute("role", "tab");
        dot.addEventListener("click", () => seekToCard(dotIndex));
        dotsContainer.appendChild(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", () => seekToCard(index - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => seekToCard(index + 1));

    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") seekToCard(index - 1);
      else if (e.key === "ArrowRight") seekToCard(index + 1);
    });

    if (viewport) {
      let touchStartX = 0;
      viewport.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
      }, { passive: true });
      viewport.addEventListener("touchend", (event) => {
        const delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) seekToCard(index + (delta < 0 ? 1 : -1));
      }, { passive: true });
    }

    reducedMotion.addEventListener("change", (event) => {
      track.classList.toggle("is-marquee", canMove && !event.matches);
      if (progress) progress.classList.toggle("is-marquee", canMove && !event.matches);
      track.style.removeProperty("transform");
      requestAnimationFrame(() => seekToCard(index));
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        buildMarquee();
        requestAnimationFrame(() => seekToCard(index));
      }, 150);
    });

    setActive(index);
    if (canMove && !reducedMotion.matches) {
      window.setInterval(() => {
        const animation = getAnimation(track);
        const duration = Math.max(28000, testimonials.length * 7000);
        if (!animation || typeof animation.currentTime !== "number") return;
        const phase = (animation.currentTime % duration) / duration;
        const groupWidth = group.getBoundingClientRect().width;
        const position = (phase * cycleDistance) % groupWidth;
        let closestIndex = 0;
        let closestDistance = Infinity;
        Array.from(group.children).forEach((card, cardIndex) => {
          const distance = Math.abs(card.offsetLeft - position);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = cardIndex;
          }
        });
        if (closestIndex !== index) setActive(closestIndex);
      }, 250);
    }
  }

  /* ---------- Perguntas frequentes ---------- */
  function initFaq() {
    const list = qs("#faq-list");
    if (!list) return;

    function render() {
      const isEnglish = document.documentElement.lang === "en";
      list.innerHTML = "";

      faqItems.forEach((item, index) => {
        const copy = isEnglish && item.en ? item.en : item;
        const questionId = `faq-question-${index}`;
        const answerId = `faq-answer-${index}`;
        const entry = createEl("article", "faq-item reveal");
        const question = createEl("button", "faq-question", copy.q);
        question.type = "button";
        question.id = questionId;
        question.setAttribute("aria-expanded", "false");
        question.setAttribute("aria-controls", answerId);

        const icon = createEl("span", "faq-icon", "+");
        icon.setAttribute("aria-hidden", "true");
        question.appendChild(icon);

        const answer = createEl("div", "faq-answer");
        answer.id = answerId;
        answer.setAttribute("role", "region");
        answer.setAttribute("aria-labelledby", questionId);
        answer.setAttribute("aria-hidden", "true");
        const answerInner = createEl("div", "faq-answer-inner");
        answerInner.appendChild(createEl("p", null, copy.a));
        answer.appendChild(answerInner);

        entry.append(question, answer);
        list.appendChild(entry);
      });

      list.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.add("is-visible");
      });
    }

    list.addEventListener("click", (event) => {
      const question = event.target.closest(".faq-question");
      if (!question) return;

      const item = question.closest(".faq-item");
      const isOpen = question.getAttribute("aria-expanded") === "true";
      list.querySelectorAll(".faq-question").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
        const faqItem = button.closest(".faq-item");
        faqItem.classList.remove("is-open");
        faqItem.querySelector(".faq-answer").setAttribute("aria-hidden", "true");
      });
      question.setAttribute("aria-expanded", isOpen ? "false" : "true");
      item.classList.toggle("is-open", !isOpen);
      item.querySelector(".faq-answer").setAttribute("aria-hidden", String(isOpen));
    });

    document.addEventListener("dyo:languagechange", render);
    render();
  }

  /* ---------- Contato ---------- */
  function initContact() {
    qsa("[data-contact]").forEach((el) => {
      const key = el.getAttribute("data-contact");
      const link = contactLinks[key];
      if (!link) return;

      el.setAttribute("href", link);

      // Abre em nova aba (menos o botão principal)
      if (key !== "primary") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    });

    qsa("[data-copy-value]").forEach((button) => {
      const label = button.querySelector("[data-copy-label]") || button;
      let timer;
      button.addEventListener("click", async () => {
        const value = button.dataset.copyValue;
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(value);
          } else {
            const input = document.createElement("textarea");
            input.value = value;
            input.style.position = "fixed";
            input.style.opacity = "0";
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            input.remove();
          }
          label.textContent = translated("contact.copied");
          clearTimeout(timer);
          timer = setTimeout(() => { label.textContent = translated("contact.copy"); }, 1600);
        } catch (_) {
          label.textContent = translated("contact.copy.error");
          clearTimeout(timer);
          timer = setTimeout(() => { label.textContent = translated("contact.copy"); }, 1600);
        }
      });
    });
  }

  /* ---------- Ano no rodapé ---------- */
  function initFooter() {
    const yearEl = qs("#footer-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Inicia tudo ---------- */
  function init() {
    initNavigation();
    initKxPortfolio();
    document.dispatchEvent(new CustomEvent("dyo:contentready"));
    initProfileDetails();
    initTestimonials();
    initFaq();
    initContact();
    initFooter();
    initRevealAnimations();
  }

  // Espera o HTML carregar antes de rodar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
