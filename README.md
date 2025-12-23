# Samsung Emojis

A complete library of Samsung One UI emoji images with JavaScript/TypeScript API, CSS support, and React components. Use Samsung emojis as a skin/replacement for native emojis anywhere.

## Features

- **3,226 Samsung One UI emojis** in WebP format
- **JavaScript/TypeScript API** for emoji lookup by codepoint, character, or name
- **CSS stylesheet** with emoji classes for easy web usage
- **React components** including EmojiPicker, EmojiText, and SamsungEmoji
- **Full TypeScript support** with type definitions
- **Tree-shakeable** ESM and CommonJS builds

## Installation

```bash
npm install samsung-emojis
# or
yarn add samsung-emojis
# or
pnpm add samsung-emojis
```

## Usage

### Basic JavaScript/TypeScript

```typescript
import samsungEmojis from 'samsung-emojis';

// Get emoji by character
const grinning = samsungEmojis.getByEmoji('😀');
console.log(grinning);
// { emoji: '😀', name: 'Grinning Face', codepoint: '1f600', file: 'samsung_emojis/grinning-face_1f600.webp', ... }

// Get emoji by codepoint
const heart = samsungEmojis.getByCodepoint('2764-fe0f');

// Get emoji by slug/name
const fire = samsungEmojis.getBySlug('fire');

// Search emojis
const smileys = samsungEmojis.search('smile');

// Get by category
const foods = samsungEmojis.getByCategory('Food & Drink');

// Get all categories
const categories = samsungEmojis.getCategories();

// Get image URL
const url = samsungEmojis.getImageUrl(grinning, {
  baseUrl: 'https://cdn.example.com/'
});
```

### Replace native emojis in HTML

```typescript
import { replaceEmojis } from 'samsung-emojis';

const text = 'Hello 😀 World 🎉';
const html = replaceEmojis(text, {
  baseUrl: '/node_modules/samsung-emojis/'
});
// Returns: 'Hello <img src="/node_modules/samsung-emojis/samsung_emojis/grinning-face_1f600.webp" ... /> World ...'
```

### CSS Usage

Include the stylesheet in your HTML:

```html
<link rel="stylesheet" href="node_modules/samsung-emojis/dist/samsung-emojis.css">
```

Then use emoji images directly:

```html
<img src="node_modules/samsung-emojis/samsung_emojis/grinning-face_1f600.webp"
     alt="Grinning Face"
     class="samsung-emoji">

<!-- Size variants -->
<img src="..." class="samsung-emoji samsung-emoji--sm"> <!-- Small -->
<img src="..." class="samsung-emoji samsung-emoji--md"> <!-- Medium -->
<img src="..." class="samsung-emoji samsung-emoji--lg"> <!-- Large -->
<img src="..." class="samsung-emoji samsung-emoji--xl"> <!-- Extra Large -->
```

Or use CSS background classes (no JS required):

```html
<span class="samsung-emoji-bg samsung-emoji-bg--1f600"></span>
```

### React Components

```tsx
import { SamsungEmoji, EmojiText, EmojiPicker, getByEmoji } from 'samsung-emojis/react';

// Render a single emoji
function MyComponent() {
  const emoji = getByEmoji('😀');
  return <SamsungEmoji emoji={emoji} size="lg" />;
}

// Replace emojis in text
function Message({ text }) {
  return <EmojiText>{text}</EmojiText>;
}
// <EmojiText>{"Hello 😀"}</EmojiText> renders "Hello" + Samsung grinning face image

// Emoji picker
function ChatInput() {
  const [showPicker, setShowPicker] = useState(false);

  const handleSelect = (emoji) => {
    console.log('Selected:', emoji.emoji, emoji.name);
    setShowPicker(false);
  };

  return (
    <div>
      <button onClick={() => setShowPicker(!showPicker)}>😀</button>
      {showPicker && (
        <EmojiPicker
          onSelect={handleSelect}
          searchable
          categories={['Smileys & Emotion', 'People & Body']}
        />
      )}
    </div>
  );
}
```

### Direct Image Access

Images are located in `samsung_emojis/` directory with naming format:
```
{emoji-name}_{unicode-codepoint}.webp
```

Examples:
- `samsung_emojis/grinning-face_1f600.webp` → 😀
- `samsung_emojis/red-heart_2764-fe0f.webp` → ❤️
- `samsung_emojis/family-man-woman-girl_1f468-200d-1f469-200d-1f467.webp` → 👨‍👩‍👧

### Using with CDN (jsDelivr)

After publishing to npm:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/samsung-emojis/dist/samsung-emojis.css">

<!-- Direct image access -->
<img src="https://cdn.jsdelivr.net/npm/samsung-emojis/samsung_emojis/grinning-face_1f600.webp"
     class="samsung-emoji"
     alt="Grinning Face">
```

```javascript
// With JavaScript
import samsungEmojis from 'https://cdn.jsdelivr.net/npm/samsung-emojis/dist/index.mjs';

const emoji = samsungEmojis.getByEmoji('😀');
const url = samsungEmojis.getImageUrl(emoji, {
  baseUrl: 'https://cdn.jsdelivr.net/npm/samsung-emojis/'
});
```

## API Reference

### Functions

| Function | Description |
|----------|-------------|
| `getAllEmojis()` | Returns array of all emoji objects |
| `getByCodepoint(codepoint)` | Find emoji by Unicode codepoint (e.g., "1f600") |
| `getByEmoji(char)` | Find emoji by character (e.g., "😀") |
| `getBySlug(slug)` | Find emoji by slug (e.g., "grinning-face") |
| `getByCategory(category)` | Get all emojis in a category |
| `getCategories()` | Get list of all categories |
| `search(query)` | Search emojis by name |
| `getImageUrl(emoji, options)` | Get image URL for an emoji |
| `replaceEmojis(text, options)` | Replace native emojis with Samsung images |
| `codepointToEmoji(codepoint)` | Convert codepoint to emoji character |
| `emojiToCodepoint(emoji)` | Convert emoji character to codepoint |
| `getCount()` | Get total emoji count (3226) |
| `getVersion()` | Get library version |

### Emoji Object

```typescript
interface Emoji {
  emoji: string;      // The emoji character: "😀"
  name: string;       // Display name: "Grinning Face"
  slug: string;       // URL-friendly: "grinning-face"
  codepoint: string;  // Unicode: "1f600"
  category: string;   // Category: "Smileys & Emotion"
  file: string;       // Path: "samsung_emojis/grinning-face_1f600.webp"
  filename: string;   // Just filename: "grinning-face_1f600.webp"
}
```

### Categories

- Smileys & Emotion
- People & Body
- Animals & Nature
- Food & Drink
- Travel & Places
- Activities
- Objects
- Symbols
- Flags

## Building from Source

```bash
# Install dependencies
npm install

# Build the library
npm run build

# This generates:
# - dist/emojis.json (emoji manifest)
# - dist/samsung-emojis.css (stylesheet)
# - dist/index.js, index.mjs, index.d.ts (main library)
# - dist/react.js, react.mjs, react.d.ts (React components)
```

## License

MIT

## Credits

Samsung emoji images are property of Samsung Electronics. This library packages them for convenient use in web development.
