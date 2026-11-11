# AGENTS.md

Static one-page portfolio site for "Diego" (video editor). Plain HTML/CSS/JS, no build step, deployed on GitHub Pages from the `main` branch. The site owner is not a programmer and edits files by hand following `LEIA-ME.txt` (Portuguese) — keep that guide in sync with any structural change.

## Structure

- `index.html` — all sections, in order: hero (`#top`), about (`#sobre`), portfolio (`#portfolio`), testimonials (`#depoimentos`), contact (`#contato`). Each section has a comment naming its CSS file and images.
- `js/content.js` — the only data source: `window.SITE_CONTENT = { profileDetails, projects, testimonials, contactLinks }`. Loaded before `app.js`.
- `js/app.js` — IIFE that renders cards from `SITE_CONTENT`, plus nav toggle, portfolio filters, testimonial carousel, contact link wiring, reveal animations and image fallbacks.
- `css/variables.css` — every color/font/size token, plus the `.theme-dark` / `.theme-light` section themes, which set local vars (`--bg`, `--surface`, `--line`, `--text`, `--text-muted`, `--emphasis`, `--tag`). Components use only these local vars, so they work on either background.
- `css/base.css` (reset, buttons, icons, `.accent`/`.marker` emphasis, `.tag`, reveal), `css/layout.css` (header/nav and footer), `css/sections/*.css` (one per section). They're loaded as separate `<link>`s in index.html; there is no bundler.
- `img/` — `brand/` (`foto-dyo.webp`, the owner's photo — keep it, it's their brand), `backgrounds/`, `sections/`, `testimonials/` (real client photos — don't replace them with generated images), `social/og-image.jpg`, `icons/*.svg` (used as CSS masks via `.icon .icon-<name>`).

## Conventions

- Code comments and all UI copy are in Brazilian Portuguese and written for a non-programmer.
- Color system: dark ink + cream paper sections alternate. White and neutral tones = primary buttons and emphasis; red = portfolio details. Use accents sparingly.
- Never hard-code colors in section files; add a token to `variables.css`.
- Image paths are local and relative so they work on GitHub Pages, including when the site is served from `/dyooo/`.
- Breakpoints: 1024 / 900 / 860 (nav collapses) / 768 / 560 / 480.
- The og:image meta uses an absolute URL on the GitHub Pages domain — update it if the domain changes.

## Tipografia

Montserrat 700/800/900 nos títulos e botões; itálico 900 apenas na palavra marcada do subtítulo principal. Literata 400/500 nos depoimentos e em `.type-editorial`; DM Sans 400–700 na leitura e navegação. As fontes são carregadas no head de index.html e 404.html com display=swap. Os tokens ficam em variables.css. A assimetria de cabeçalhos em base.css aplica-se a partir de 900px, preservando os grids, as cores e as animações. Não aplicar serifa ou itálico globalmente.
