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

    // Escurece o header quando rola a página
    if (header) {
      let scrollUpdatePending = false;
      const onScroll = () => {
        if (scrollUpdatePending) return;
        scrollUpdatePending = true;
        window.requestAnimationFrame(() => {
          header.classList.toggle("is-scrolled", window.scrollY > 10);
          scrollUpdatePending = false;
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (!toggle || !nav) return;

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
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
          `${Math.min(index, 4) * 90}ms`
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

  function getProjectThumbnail(item) {
    if (item.thumbnail) return item.thumbnail;
    if (item.poster) return item.poster;
    if (item.youtubeId) return `https://i.ytimg.com/vi/${encodeURIComponent(item.youtubeId)}/hqdefault.jpg`;
    return "";
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

    container.innerHTML = `
      <div class="kx-player-container">
        <div class="kx-player-header">
          <h2 class="kx-player-title">${title}</h2>
          <p class="kx-player-desc">${description}</p>
        </div>
        <div class="kx-filter-tabs" role="tablist"></div>
        <div class="kx-carousel-stage" tabindex="0">
          <button type="button" class="kx-nav-btn kx-nav-prev" aria-label="Vídeo anterior">
            ${KX_ICONS.caretLeft}
          </button>
          <button type="button" class="kx-nav-btn kx-nav-next" aria-label="Próximo vídeo">
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
    const prevBtn = qs(".kx-nav-prev", container);
    const nextBtn = qs(".kx-nav-next", container);

    let activeFilter = "Todos";
    let activeIndex = 0;
    let filteredItems = [...items];

    // Estados de reprodução
    let isPlaying = false;
    let isMuted = false;
    let volume = 0.4;
    let duration = 0;
    let currentTime = 0;
    let hideControlsTimer = null;
    let isDraggingProgress = false;
    let isHoveringVolume = false;
    let activeVideoEl = null;
    let activeIframeEl = null;

    // Categorias únicas
    const rawCategories = items.map((p) => p.category).filter(Boolean);
    const categories = ["Todos", ...Array.from(new Set(rawCategories))];

    // Renderiza tabs de filtro
    categories.forEach((cat) => {
      const btn = createEl("button", "kx-filter-tab", cat);
      btn.type = "button";
      if (cat === activeFilter) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        if (activeFilter === cat) return;
        activeFilter = cat;
        qsa(".kx-filter-tab", filterTabsContainer).forEach((t) =>
          t.classList.toggle("is-active", t.textContent === cat)
        );
        filteredItems =
          cat === "Todos"
            ? [...items]
            : items.filter((p) => p.category === cat);
        activeIndex = 0;
        resetPlayback();
        render();
      });
      filterTabsContainer.appendChild(btn);
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
      card.setAttribute("aria-label", `${item.title} — ${item.category || ""}`);

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
          <span class="kx-side-cat">${item.category || ""}</span>
        </div>
      `;

      card.addEventListener("click", () => {
        slideTo(direction);
      });

      return card;
    }

    function slideTo(direction) {
      resetPlayback();
      const count = filteredItems.length;
      activeIndex = (activeIndex + direction + count) % count;
      render();
    }

    function renderPagination() {
      paginationContainer.replaceChildren();
      paginationContainer.style.display = filteredItems.length > 1 ? "flex" : "none";
      if (prevBtn) prevBtn.style.display = filteredItems.length > 1 ? "flex" : "none";
      if (nextBtn) nextBtn.style.display = filteredItems.length > 1 ? "flex" : "none";

      filteredItems.forEach((item, idx) => {
        const dot = createEl("button", "kx-dot");
        dot.type = "button";
        dot.setAttribute("aria-label", `Ir para vídeo ${idx + 1}: ${item.title}`);
        if (idx === activeIndex) dot.classList.add("is-active");
        dot.addEventListener("click", () => {
          if (idx === activeIndex) return;
          const diff = idx - activeIndex;
          slideTo(diff);
        });
        paginationContainer.appendChild(dot);
      });
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
      mainCard.innerHTML = `
        <video class="kx-main-video" poster="${thumbUrl}" playsinline preload="metadata" loop></video>
        <div class="kx-play-center">
          <button type="button" class="kx-play-center-btn" aria-label="Reproduzir vídeo">
            ${KX_ICONS.play}
          </button>
        </div>
        <div class="kx-controls-bar">
          <div class="kx-controls-top">
            <div class="kx-controls-title-info">
              <p class="kx-controls-title">${currentItem.title}</p>
              <span class="kx-controls-cat">${currentItem.category || ""}</span>
            </div>
            <div class="kx-controls-time">00:00 / 00:00</div>
          </div>
          <div class="kx-progress-box">
            <input type="range" class="kx-progress-range" min="0" max="100" step="0.1" value="0" aria-label="Progresso do vídeo" />
          </div>
          <div class="kx-controls-bottom">
            <div class="kx-controls-left">
              <button type="button" class="kx-ctrl-btn kx-play-btn" aria-label="Reproduzir">
                ${KX_ICONS.play}
              </button>
              <div class="kx-volume-box">
                <button type="button" class="kx-ctrl-btn kx-vol-btn" aria-label="Silenciar">
                  ${KX_ICONS.volumeHigh}
                </button>
                <div class="kx-volume-popup">
                  <input type="range" class="kx-volume-range" min="0" max="1" step="0.05" value="${volume}" aria-label="Volume" />
                </div>
              </div>
            </div>
            <div class="kx-controls-right">
              <button type="button" class="kx-ctrl-btn kx-fullscreen-btn" aria-label="Tela cheia">
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

      const hasDirectVideo = Boolean(currentItem.video);

      if (hasDirectVideo) {
        video.src = currentItem.video;
        video.volume = volume;
        video.muted = isMuted;
      }

      function updateVolIcon() {
        if (isMuted || volume === 0) {
          volBtn.innerHTML = KX_ICONS.volumeMute;
          volBtn.setAttribute("aria-label", "Ativar som");
        } else if (volume < 0.5) {
          volBtn.innerHTML = KX_ICONS.volumeLow;
          volBtn.setAttribute("aria-label", "Silenciar");
        } else {
          volBtn.innerHTML = KX_ICONS.volumeHigh;
          volBtn.setAttribute("aria-label", "Silenciar");
        }
      }

      function updatePlayState(playing) {
        isPlaying = playing;
        if (playing) {
          playCenter.classList.add("is-hidden");
          playBtn.innerHTML = KX_ICONS.pause;
          playBtn.setAttribute("aria-label", "Pausar");
        } else {
          playCenter.classList.remove("is-hidden");
          playBtn.innerHTML = KX_ICONS.play;
          playBtn.setAttribute("aria-label", "Reproduzir");
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
        } else if (currentItem.youtubeId) {
          // Incorpora o YouTube dentro do próprio frame do player
          if (!activeIframeEl) {
            const iframe = document.createElement("iframe");
            iframe.className = "kx-main-iframe";
            iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(
              currentItem.youtubeId
            )}?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
            iframe.title = currentItem.title;
            iframe.referrerPolicy = "strict-origin-when-cross-origin";
            iframe.allow =
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            mainCard.prepend(iframe);
            activeIframeEl = iframe;
            video.style.display = "none";
            playCenter.classList.add("is-hidden");
            controlsBar.classList.add("is-hidden");
            isPlaying = true;
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
        togglePlay();
      });

      mainCard.addEventListener("click", () => {
        if (!activeIframeEl) togglePlay();
      });

      mainCard.addEventListener("mousemove", () => scheduleControlsHide(controlsBar));
      mainCard.addEventListener("mouseenter", () => scheduleControlsHide(controlsBar));
      mainCard.addEventListener("mouseleave", () => {
        if (isPlaying && !isDraggingProgress && !isHoveringVolume) {
          controlsBar.classList.add("is-hidden");
        }
      });

      perspectiveWrapper.appendChild(mainCard);

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

    // Touch / Swipe
    let touchStartX = 0;
    stage.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    stage.addEventListener(
      "touchend",
      (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) {
          slideTo(delta < 0 ? 1 : -1);
        }
      },
      { passive: true }
    );

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

    article.appendChild(createEl("p", "testimonial-quote", testimonial.quote));

    const author = createEl("div", "testimonial-author");
    const avatar = createEl("div", "testimonial-avatar");

    if (testimonial.avatar) {
      const img = document.createElement("img");
      img.src = testimonial.avatar;
      img.alt = `Foto de ${testimonial.name}`;
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
    if (testimonial.handle) {
      info.appendChild(createEl("span", "testimonial-handle", testimonial.handle));
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

    if (!track) return;

    testimonials.forEach((testimonial) => {
      track.appendChild(createTestimonialCard(testimonial));
    });

    if (!testimonials.length) {
      if (controls) controls.hidden = true;
      return;
    }

    let index = 0;

    function getMaxIndex() {
      return Math.max(0, testimonials.length - 1);
    }

    // Cria as bolinhas de navegação
    function renderDots() {
      const max = getMaxIndex();
      // Se todos os depoimentos cabem na tela, não precisa de controles
      track.classList.toggle("is-static", max === 0);
      if (controls) controls.hidden = max === 0;

      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      for (let i = 0; i <= max; i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Ir para depoimento ${i + 1}`);
        dot.setAttribute("role", "tab");
        dot.addEventListener("click", () => {
          index = i;
          update();
        });
        dotsContainer.appendChild(dot);
      }
    }

    // Move o carrossel pra posição certa
    function update() {
      const max = getMaxIndex();
      index = Math.min(Math.max(index, 0), max);

      const card = track.querySelector(".testimonial-card");
      if (!card) return;

      const cardWidth = card.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 20;
      track.style.transform = index ? `translateX(-${index * (cardWidth + gap)}px)` : "";

      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index >= max;

      if (dotsContainer) {
        qsa(".carousel-dot", dotsContainer).forEach((dot, i) => {
          const active = i === index;
          dot.classList.toggle("is-active", active);
          dot.setAttribute("aria-selected", active ? "true" : "false");
        });
      }
    }

    const move = (step) => {
      index += step;
      update();
    };

    if (prevBtn) prevBtn.addEventListener("click", () => move(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => move(1));

    // Navegação por teclado (acessibilidade)
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") move(-1);
      else if (e.key === "ArrowRight") move(1);
    });

    // Recalcula ao redimensionar a tela
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderDots();
        update();
      }, 150);
    });

    // Arrastar com o dedo no celular
    let touchStartX = 0;
    track.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      (event) => {
        const delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1);
      },
      { passive: true }
    );

    renderDots();
    update();
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
    initProfileDetails();
    initTestimonials();
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
