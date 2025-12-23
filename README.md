# Samsung Emojis

A complete collection of **3,226 Samsung One UI emoji images** with JavaScript utilities for lookup and replacement.

## Quick Usage

### Direct Image URLs (via jsDelivr CDN)

```html
<img src="https://cdn.jsdelivr.net/gh/Msemaska/samsung-emojis@main/samsung_emojis/grinning-face_1f600.webp" alt="Grinning Face" width="32">
```

### File Naming Convention

All images follow the pattern: `{emoji-name}_{unicode-codepoint}.webp`

Examples:
- `grinning-face_1f600.webp` → 😀
- `red-heart_2764-fe0f.webp` → ❤️
- `fire_1f525.webp` → 🔥

## Using in Your Project

### Option 1: Clone/Download

```bash
git clone https://github.com/Msemaska/samsung-emojis.git
```

### Option 2: Git Submodule

```bash
git submodule add https://github.com/Msemaska/samsung-emojis.git
```

### Option 3: CDN Links

Use jsDelivr to load directly from GitHub:

```
https://cdn.jsdelivr.net/gh/Msemaska/samsung-emojis@main/samsung_emojis/{filename}
```

## JavaScript API

The `dist/` folder contains ready-to-use JavaScript utilities.

### Load via CDN

```html
<script type="module">
  import samsungEmojis from 'https://cdn.jsdelivr.net/gh/Msemaska/samsung-emojis@main/dist/index.mjs';

  // Get emoji by character
  const emoji = samsungEmojis.getByEmoji('😀');
  console.log(emoji.file); // "samsung_emojis/grinning-face_1f600.webp"

  // Search emojis
  const results = samsungEmojis.search('heart');

  // Get by category
  const foods = samsungEmojis.getByCategory('Food & Drink');
</script>
```

### Available Functions

| Function | Description |
|----------|-------------|
| `getAllEmojis()` | Get all 3,226 emojis |
| `getByEmoji('😀')` | Find by emoji character |
| `getByCodepoint('1f600')` | Find by Unicode codepoint |
| `getBySlug('grinning-face')` | Find by slug name |
| `getByCategory(category)` | Get emojis in a category |
| `getCategories()` | List all categories |
| `search('smile')` | Search by name |
| `getImageUrl(emoji, {baseUrl})` | Get full image URL |

### Replace Native Emojis with Samsung Emojis

```javascript
import { replaceEmojis } from 'https://cdn.jsdelivr.net/gh/Msemaska/samsung-emojis@main/dist/index.mjs';

const text = 'Hello 😀 World 🎉';
const html = replaceEmojis(text, {
  baseUrl: 'https://cdn.jsdelivr.net/gh/Msemaska/samsung-emojis@main/'
});
// Returns HTML with <img> tags replacing each emoji
```

## CSS Styling

Include the stylesheet for consistent emoji sizing:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Msemaska/samsung-emojis@main/dist/samsung-emojis.css">

<img src="..." class="samsung-emoji">           <!-- Default size -->
<img src="..." class="samsung-emoji samsung-emoji--lg">  <!-- Large -->
<img src="..." class="samsung-emoji samsung-emoji--xl">  <!-- Extra large -->
```

## Data

The full emoji manifest is available at:
```
dist/emojis.json
```

Contains metadata for all emojis: name, slug, codepoint, category, and file path.

## Categories

- Smileys & Emotion
- People & Body
- Animals & Nature
- Food & Drink
- Travel & Places
- Activities
- Objects
- Symbols
- Flags

## Disclaimer

Samsung emoji images are the property of Samsung Electronics. This repository is for personal and educational use. Samsung may request removal of this content at any time.

## License

Code: MIT | Images: Samsung Electronics
