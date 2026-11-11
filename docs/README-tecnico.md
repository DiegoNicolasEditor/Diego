# Estrutura técnica

Site estático do Diego Nicolas, feito em HTML, CSS e JavaScript puro. Não
usa framework, pacotes ou etapa de compilação. O GitHub Pages publica
os arquivos da raiz pela branch `main`.

## Pastas do site

- `index.html`, `404.html` e `robots.txt` ficam na raiz porque o
  GitHub Pages procura esses arquivos ali.
- `css/` contém as folhas de estilo carregadas diretamente pelo HTML.
- `js/content.js` guarda projetos, depoimentos e contatos; `js/app.js`
  cuida da navegação e renderização.
- `img/` guarda imagens, fotos, logos e ícones. Os caminhos são relativos
  para funcionar no endereço `/dyooo/`.
- `docs/backups/` guarda uma cópia antiga apenas no computador. Essa
  pasta é ignorada pelo Git e não é enviada ao GitHub nem publicada.

Não mover a raiz, `css/`, `js/` ou `img/` sem atualizar todos os
caminhos e a configuração de publicação. O passo a passo de edição fica
em `LEIA-ME.txt`, na raiz.
