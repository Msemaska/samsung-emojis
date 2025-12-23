const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const SRC_DIR = path.join(__dirname, '..', 'src');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

console.log('Building Samsung Emojis library...\n');

// Step 1: Generate manifest
console.log('1. Generating emoji manifest...');
const { generateManifest } = require('./generate-manifest');
const manifest = generateManifest();

// Step 2: Generate CSS
console.log('\n2. Generating CSS stylesheet...');
const { generateCSS } = require('./generate-css');
generateCSS();

// Step 3: Bundle JavaScript/TypeScript
console.log('\n3. Bundling JavaScript modules...');

// Read the manifest for embedding
const manifestJson = fs.readFileSync(path.join(DIST_DIR, 'emojis.json'), 'utf-8');

// Create CommonJS bundle
const cjsBundle = `"use strict";

const manifest = ${manifestJson};

function getAllEmojis() {
  return manifest.emojis;
}

function getByCodepoint(codepoint) {
  return manifest.indices.byCodepoint[codepoint.toLowerCase()];
}

function getByEmoji(emoji) {
  return manifest.indices.byEmoji[emoji];
}

function getBySlug(slug) {
  return manifest.indices.bySlug[slug.toLowerCase()];
}

function getByCategory(category) {
  return manifest.byCategory[category] || [];
}

function getCategories() {
  return manifest.categories;
}

function search(query) {
  const lowerQuery = query.toLowerCase();
  return manifest.emojis.filter(
    (e) =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.slug.toLowerCase().includes(lowerQuery)
  );
}

function getImageUrl(emoji, options = {}) {
  const baseUrl = options.baseUrl || '';
  return \`\${baseUrl}\${emoji.file}\`;
}

function codepointToEmoji(codepoint) {
  try {
    return codepoint
      .split('-')
      .map((cp) => String.fromCodePoint(parseInt(cp, 16)))
      .join('');
  } catch {
    return '';
  }
}

function emojiToCodepoint(emoji) {
  return [...emoji].map((char) => char.codePointAt(0).toString(16)).join('-');
}

function replaceEmojis(text, options = {}) {
  const emojiRegex =
    /(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F)(?:\\u200D(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F))*/gu;

  return text.replace(emojiRegex, (match) => {
    const emojiData = getByEmoji(match);
    if (!emojiData) return match;

    const url = getImageUrl(emojiData, options);
    if (options.render) {
      return options.render(emojiData, url);
    }
    return \`<img src="\${url}" alt="\${emojiData.name}" class="samsung-emoji" title="\${emojiData.name}" />\`;
  });
}

function getCount() {
  return manifest.count;
}

function getVersion() {
  return manifest.version;
}

module.exports = {
  getAllEmojis,
  getByCodepoint,
  getByEmoji,
  getBySlug,
  getByCategory,
  getCategories,
  search,
  getImageUrl,
  codepointToEmoji,
  emojiToCodepoint,
  replaceEmojis,
  getCount,
  getVersion,
  default: {
    getAllEmojis,
    getByCodepoint,
    getByEmoji,
    getBySlug,
    getByCategory,
    getCategories,
    search,
    getImageUrl,
    codepointToEmoji,
    emojiToCodepoint,
    replaceEmojis,
    getCount,
    getVersion,
  }
};
`;

// Create ESM bundle
const esmBundle = `const manifest = ${manifestJson};

export function getAllEmojis() {
  return manifest.emojis;
}

export function getByCodepoint(codepoint) {
  return manifest.indices.byCodepoint[codepoint.toLowerCase()];
}

export function getByEmoji(emoji) {
  return manifest.indices.byEmoji[emoji];
}

export function getBySlug(slug) {
  return manifest.indices.bySlug[slug.toLowerCase()];
}

export function getByCategory(category) {
  return manifest.byCategory[category] || [];
}

export function getCategories() {
  return manifest.categories;
}

export function search(query) {
  const lowerQuery = query.toLowerCase();
  return manifest.emojis.filter(
    (e) =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.slug.toLowerCase().includes(lowerQuery)
  );
}

export function getImageUrl(emoji, options = {}) {
  const baseUrl = options.baseUrl || '';
  return \`\${baseUrl}\${emoji.file}\`;
}

export function codepointToEmoji(codepoint) {
  try {
    return codepoint
      .split('-')
      .map((cp) => String.fromCodePoint(parseInt(cp, 16)))
      .join('');
  } catch {
    return '';
  }
}

export function emojiToCodepoint(emoji) {
  return [...emoji].map((char) => char.codePointAt(0).toString(16)).join('-');
}

export function replaceEmojis(text, options = {}) {
  const emojiRegex =
    /(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F)(?:\\u200D(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F))*/gu;

  return text.replace(emojiRegex, (match) => {
    const emojiData = getByEmoji(match);
    if (!emojiData) return match;

    const url = getImageUrl(emojiData, options);
    if (options.render) {
      return options.render(emojiData, url);
    }
    return \`<img src="\${url}" alt="\${emojiData.name}" class="samsung-emoji" title="\${emojiData.name}" />\`;
  });
}

export function getCount() {
  return manifest.count;
}

export function getVersion() {
  return manifest.version;
}

export default {
  getAllEmojis,
  getByCodepoint,
  getByEmoji,
  getBySlug,
  getByCategory,
  getCategories,
  search,
  getImageUrl,
  codepointToEmoji,
  emojiToCodepoint,
  replaceEmojis,
  getCount,
  getVersion,
};
`;

// Create TypeScript declaration file
const dtsContent = `export interface Emoji {
  emoji: string;
  name: string;
  slug: string;
  codepoint: string;
  category: EmojiCategory;
  file: string;
  filename: string;
}

export type EmojiCategory =
  | 'Smileys & Emotion'
  | 'People & Body'
  | 'Animals & Nature'
  | 'Food & Drink'
  | 'Travel & Places'
  | 'Activities'
  | 'Objects'
  | 'Symbols'
  | 'Flags';

export interface SamsungEmojisOptions {
  baseUrl?: string;
  format?: 'webp';
}

export interface ReplaceOptions extends SamsungEmojisOptions {
  render?: (emoji: Emoji, url: string) => string;
}

export function getAllEmojis(): Emoji[];
export function getByCodepoint(codepoint: string): Emoji | undefined;
export function getByEmoji(emoji: string): Emoji | undefined;
export function getBySlug(slug: string): Emoji | undefined;
export function getByCategory(category: EmojiCategory): Emoji[];
export function getCategories(): EmojiCategory[];
export function search(query: string): Emoji[];
export function getImageUrl(emoji: Emoji, options?: SamsungEmojisOptions): string;
export function codepointToEmoji(codepoint: string): string;
export function emojiToCodepoint(emoji: string): string;
export function replaceEmojis(text: string, options?: ReplaceOptions): string;
export function getCount(): number;
export function getVersion(): string;

declare const samsungEmojis: {
  getAllEmojis: typeof getAllEmojis;
  getByCodepoint: typeof getByCodepoint;
  getByEmoji: typeof getByEmoji;
  getBySlug: typeof getBySlug;
  getByCategory: typeof getByCategory;
  getCategories: typeof getCategories;
  search: typeof search;
  getImageUrl: typeof getImageUrl;
  codepointToEmoji: typeof codepointToEmoji;
  emojiToCodepoint: typeof emojiToCodepoint;
  replaceEmojis: typeof replaceEmojis;
  getCount: typeof getCount;
  getVersion: typeof getVersion;
};

export default samsungEmojis;
`;

// Create React bundle (CommonJS)
const reactCjsBundle = `"use strict";

const React = require('react');
const samsungEmojis = require('./index.js');

function SamsungEmoji({ emoji, size, baseUrl, className = '', ...props }) {
  const sizeClass = size ? \`samsung-emoji--\${size}\` : '';
  const url = samsungEmojis.getImageUrl(emoji, { baseUrl });

  return React.createElement('img', {
    src: url,
    alt: emoji.name,
    title: emoji.name,
    className: \`samsung-emoji \${sizeClass} \${className}\`.trim(),
    loading: 'lazy',
    ...props
  });
}

function EmojiText({ children, baseUrl, size }) {
  const emojiRegex =
    /(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F)(?:\\u200D(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F))*/gu;
  const result = [];
  let lastIndex = 0;
  let match;
  const text = children;

  while ((match = emojiRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    const emojiData = samsungEmojis.getByEmoji(match[0]);
    if (emojiData) {
      result.push(emojiData);
    } else {
      result.push(match[0]);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return React.createElement(
    React.Fragment,
    null,
    result.map((part, i) =>
      typeof part === 'string'
        ? React.createElement(React.Fragment, { key: i }, part)
        : React.createElement(SamsungEmoji, { key: i, emoji: part, size, baseUrl })
    )
  );
}

function EmojiPicker({
  onSelect,
  baseUrl,
  categories: allowedCategories,
  className = '',
  searchable = true,
  searchPlaceholder = 'Search emojis...',
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState(null);

  const categories = React.useMemo(
    () => allowedCategories || samsungEmojis.getCategories(),
    [allowedCategories]
  );

  const filteredEmojis = React.useMemo(() => {
    if (searchQuery) {
      return samsungEmojis.search(searchQuery);
    }
    if (activeCategory) {
      return samsungEmojis.getByCategory(activeCategory);
    }
    return samsungEmojis.getAllEmojis();
  }, [searchQuery, activeCategory]);

  const handleEmojiClick = React.useCallback(
    (emoji) => {
      onSelect(emoji);
    },
    [onSelect]
  );

  return React.createElement(
    'div',
    { className: \`samsung-emoji-picker \${className}\` },
    searchable &&
      React.createElement(
        'div',
        { className: 'samsung-emoji-picker__search' },
        React.createElement('input', {
          type: 'text',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          placeholder: searchPlaceholder,
          className: 'samsung-emoji-picker__search-input',
        })
      ),
    React.createElement(
      'div',
      { className: 'samsung-emoji-picker__categories' },
      React.createElement(
        'button',
        {
          className: \`samsung-emoji-picker__category-btn \${
            !activeCategory && !searchQuery ? 'active' : ''
          }\`,
          onClick: () => setActiveCategory(null),
        },
        'All'
      ),
      categories.map((cat) =>
        React.createElement(
          'button',
          {
            key: cat,
            className: \`samsung-emoji-picker__category-btn \${
              activeCategory === cat ? 'active' : ''
            }\`,
            onClick: () => setActiveCategory(cat),
          },
          cat
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'samsung-emoji-picker__grid samsung-emoji-grid' },
      filteredEmojis.map((emoji) =>
        React.createElement(
          'button',
          {
            key: emoji.codepoint,
            onClick: () => handleEmojiClick(emoji),
            className: 'samsung-emoji-picker__emoji-btn',
            title: emoji.name,
          },
          React.createElement(SamsungEmoji, { emoji, baseUrl })
        )
      )
    )
  );
}

module.exports = {
  SamsungEmoji,
  EmojiText,
  EmojiPicker,
  getAllEmojis: samsungEmojis.getAllEmojis,
  getByEmoji: samsungEmojis.getByEmoji,
  getByCategory: samsungEmojis.getByCategory,
  getCategories: samsungEmojis.getCategories,
  search: samsungEmojis.search,
  getImageUrl: samsungEmojis.getImageUrl,
};
`;

// Create React bundle (ESM)
const reactEsmBundle = `import React, { useState, useMemo, useCallback, Fragment, createElement } from 'react';
import samsungEmojis from './index.mjs';

export function SamsungEmoji({ emoji, size, baseUrl, className = '', ...props }) {
  const sizeClass = size ? \`samsung-emoji--\${size}\` : '';
  const url = samsungEmojis.getImageUrl(emoji, { baseUrl });

  return createElement('img', {
    src: url,
    alt: emoji.name,
    title: emoji.name,
    className: \`samsung-emoji \${sizeClass} \${className}\`.trim(),
    loading: 'lazy',
    ...props
  });
}

export function EmojiText({ children, baseUrl, size }) {
  const emojiRegex =
    /(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F)(?:\\u200D(?:\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F))*/gu;
  const result = [];
  let lastIndex = 0;
  let match;
  const text = children;

  while ((match = emojiRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    const emojiData = samsungEmojis.getByEmoji(match[0]);
    if (emojiData) {
      result.push(emojiData);
    } else {
      result.push(match[0]);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return createElement(
    Fragment,
    null,
    result.map((part, i) =>
      typeof part === 'string'
        ? createElement(Fragment, { key: i }, part)
        : createElement(SamsungEmoji, { key: i, emoji: part, size, baseUrl })
    )
  );
}

export function EmojiPicker({
  onSelect,
  baseUrl,
  categories: allowedCategories,
  className = '',
  searchable = true,
  searchPlaceholder = 'Search emojis...',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = useMemo(
    () => allowedCategories || samsungEmojis.getCategories(),
    [allowedCategories]
  );

  const filteredEmojis = useMemo(() => {
    if (searchQuery) {
      return samsungEmojis.search(searchQuery);
    }
    if (activeCategory) {
      return samsungEmojis.getByCategory(activeCategory);
    }
    return samsungEmojis.getAllEmojis();
  }, [searchQuery, activeCategory]);

  const handleEmojiClick = useCallback(
    (emoji) => {
      onSelect(emoji);
    },
    [onSelect]
  );

  return createElement(
    'div',
    { className: \`samsung-emoji-picker \${className}\` },
    searchable &&
      createElement(
        'div',
        { className: 'samsung-emoji-picker__search' },
        createElement('input', {
          type: 'text',
          value: searchQuery,
          onChange: (e) => setSearchQuery(e.target.value),
          placeholder: searchPlaceholder,
          className: 'samsung-emoji-picker__search-input',
        })
      ),
    createElement(
      'div',
      { className: 'samsung-emoji-picker__categories' },
      createElement(
        'button',
        {
          className: \`samsung-emoji-picker__category-btn \${
            !activeCategory && !searchQuery ? 'active' : ''
          }\`,
          onClick: () => setActiveCategory(null),
        },
        'All'
      ),
      categories.map((cat) =>
        createElement(
          'button',
          {
            key: cat,
            className: \`samsung-emoji-picker__category-btn \${
              activeCategory === cat ? 'active' : ''
            }\`,
            onClick: () => setActiveCategory(cat),
          },
          cat
        )
      )
    ),
    createElement(
      'div',
      { className: 'samsung-emoji-picker__grid samsung-emoji-grid' },
      filteredEmojis.map((emoji) =>
        createElement(
          'button',
          {
            key: emoji.codepoint,
            onClick: () => handleEmojiClick(emoji),
            className: 'samsung-emoji-picker__emoji-btn',
            title: emoji.name,
          },
          createElement(SamsungEmoji, { emoji, baseUrl })
        )
      )
    )
  );
}

export const getAllEmojis = samsungEmojis.getAllEmojis;
export const getByEmoji = samsungEmojis.getByEmoji;
export const getByCategory = samsungEmojis.getByCategory;
export const getCategories = samsungEmojis.getCategories;
export const search = samsungEmojis.search;
export const getImageUrl = samsungEmojis.getImageUrl;
`;

// React TypeScript declarations
const reactDtsContent = `import { ComponentProps, ReactNode } from 'react';
import { Emoji, EmojiCategory, SamsungEmojisOptions } from './index';

export { Emoji, EmojiCategory, SamsungEmojisOptions };

export interface SamsungEmojiProps extends Omit<ComponentProps<'img'>, 'src' | 'alt'> {
  emoji: Emoji;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  baseUrl?: string;
}

export function SamsungEmoji(props: SamsungEmojiProps): JSX.Element;

export interface EmojiTextProps {
  children: string;
  baseUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function EmojiText(props: EmojiTextProps): JSX.Element;

export interface EmojiPickerProps {
  onSelect: (emoji: Emoji) => void;
  baseUrl?: string;
  categories?: EmojiCategory[];
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function EmojiPicker(props: EmojiPickerProps): JSX.Element;

export function getAllEmojis(): Emoji[];
export function getByEmoji(emoji: string): Emoji | undefined;
export function getByCategory(category: EmojiCategory): Emoji[];
export function getCategories(): EmojiCategory[];
export function search(query: string): Emoji[];
export function getImageUrl(emoji: Emoji, options?: SamsungEmojisOptions): string;
`;

// Write all files
fs.writeFileSync(path.join(DIST_DIR, 'index.js'), cjsBundle);
fs.writeFileSync(path.join(DIST_DIR, 'index.mjs'), esmBundle);
fs.writeFileSync(path.join(DIST_DIR, 'index.d.ts'), dtsContent);
fs.writeFileSync(path.join(DIST_DIR, 'react.js'), reactCjsBundle);
fs.writeFileSync(path.join(DIST_DIR, 'react.mjs'), reactEsmBundle);
fs.writeFileSync(path.join(DIST_DIR, 'react.d.ts'), reactDtsContent);

console.log('   - dist/index.js (CommonJS)');
console.log('   - dist/index.mjs (ESM)');
console.log('   - dist/index.d.ts (TypeScript)');
console.log('   - dist/react.js (CommonJS)');
console.log('   - dist/react.mjs (ESM)');
console.log('   - dist/react.d.ts (TypeScript)');

console.log('\nBuild complete! ' + manifest.count + ' emojis ready.\n');
console.log('Files generated:');
console.log('  - dist/emojis.json (manifest)');
console.log('  - dist/samsung-emojis.css (stylesheet)');
console.log('  - dist/index.js, index.mjs, index.d.ts (main library)');
console.log('  - dist/react.js, react.mjs, react.d.ts (React components)');
