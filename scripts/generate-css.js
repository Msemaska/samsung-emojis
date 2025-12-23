const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'dist', 'emojis.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'dist', 'samsung-emojis.css');

function generateCSS() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

  let css = `/* Samsung Emojis CSS - Auto-generated */
/* Version: ${manifest.version} */
/* Count: ${manifest.count} emojis */

/* Base styles for Samsung emoji images */
.samsung-emoji {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.2em;
  object-fit: contain;
}

/* Size variants */
.samsung-emoji--sm { width: 1em; height: 1em; }
.samsung-emoji--md { width: 1.5em; height: 1.5em; vertical-align: -0.3em; }
.samsung-emoji--lg { width: 2em; height: 2em; vertical-align: -0.4em; }
.samsung-emoji--xl { width: 3em; height: 3em; vertical-align: -0.6em; }

/* For emoji picker grids */
.samsung-emoji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
  gap: 4px;
}

.samsung-emoji-grid .samsung-emoji {
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.samsung-emoji-grid .samsung-emoji:hover {
  transform: scale(1.2);
}

/* Category headers */
.samsung-emoji-category {
  font-weight: 600;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 8px;
}

/* CSS custom properties for theming */
:root {
  --samsung-emoji-size: 1.2em;
  --samsung-emoji-grid-size: 32px;
  --samsung-emoji-grid-gap: 4px;
}

`;

  // Generate CSS classes for each emoji (using codepoint as identifier)
  css += `/* Individual emoji background classes (for CSS-only usage) */\n`;
  css += `/* Usage: <span class="samsung-emoji-bg samsung-emoji-bg--1f600"></span> */\n\n`;

  css += `.samsung-emoji-bg {
  display: inline-block;
  width: var(--samsung-emoji-size, 1.2em);
  height: var(--samsung-emoji-size, 1.2em);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: -0.2em;
}\n\n`;

  for (const emoji of manifest.emojis) {
    const className = emoji.codepoint.replace(/-/g, '-');
    css += `.samsung-emoji-bg--${className} { background-image: url("../samsung_emojis/${emoji.filename}"); }\n`;
  }

  fs.writeFileSync(OUTPUT_PATH, css);
  console.log(`Generated CSS with ${manifest.count} emoji classes -> ${OUTPUT_PATH}`);
}

module.exports = { generateCSS };

if (require.main === module) {
  generateCSS();
}
