import type { Emoji, EmojiCategory, EmojiManifest, SamsungEmojisOptions } from './types';
import manifestData from '../dist/emojis.json';

export type { Emoji, EmojiCategory, EmojiManifest, SamsungEmojisOptions };

const manifest = manifestData as EmojiManifest;

/**
 * Get all emojis in the library
 */
export function getAllEmojis(): Emoji[] {
  return manifest.emojis;
}

/**
 * Get emoji by its Unicode codepoint (e.g., "1f600")
 */
export function getByCodepoint(codepoint: string): Emoji | undefined {
  return manifest.indices.byCodepoint[codepoint.toLowerCase()];
}

/**
 * Get emoji by the actual emoji character (e.g., "😀")
 */
export function getByEmoji(emoji: string): Emoji | undefined {
  return manifest.indices.byEmoji[emoji];
}

/**
 * Get emoji by its slug (e.g., "grinning-face")
 */
export function getBySlug(slug: string): Emoji | undefined {
  return manifest.indices.bySlug[slug.toLowerCase()];
}

/**
 * Get all emojis in a category
 */
export function getByCategory(category: EmojiCategory): Emoji[] {
  return manifest.byCategory[category] || [];
}

/**
 * Get all available categories
 */
export function getCategories(): EmojiCategory[] {
  return manifest.categories as EmojiCategory[];
}

/**
 * Search emojis by name or slug
 */
export function search(query: string): Emoji[] {
  const lowerQuery = query.toLowerCase();
  return manifest.emojis.filter(
    (e) =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.slug.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get the image URL for an emoji
 */
export function getImageUrl(emoji: Emoji, options: SamsungEmojisOptions = {}): string {
  const baseUrl = options.baseUrl || '';
  return `${baseUrl}${emoji.file}`;
}

/**
 * Convert a codepoint string to the actual emoji character
 */
export function codepointToEmoji(codepoint: string): string {
  try {
    return codepoint
      .split('-')
      .map((cp) => String.fromCodePoint(parseInt(cp, 16)))
      .join('');
  } catch {
    return '';
  }
}

/**
 * Convert an emoji character to its codepoint string
 */
export function emojiToCodepoint(emoji: string): string {
  return [...emoji].map((char) => char.codePointAt(0)!.toString(16)).join('-');
}

/**
 * Replace native emojis in text with Samsung emoji images
 */
export function replaceEmojis(
  text: string,
  options: SamsungEmojisOptions & {
    /** Custom render function for the image tag */
    render?: (emoji: Emoji, url: string) => string;
  } = {}
): string {
  const emojiRegex =
    /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\u200D(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*/gu;

  return text.replace(emojiRegex, (match) => {
    const emojiData = getByEmoji(match);
    if (!emojiData) return match;

    const url = getImageUrl(emojiData, options);
    if (options.render) {
      return options.render(emojiData, url);
    }
    return `<img src="${url}" alt="${emojiData.name}" class="samsung-emoji" title="${emojiData.name}" />`;
  });
}

/**
 * Get the total count of emojis
 */
export function getCount(): number {
  return manifest.count;
}

/**
 * Get the manifest version
 */
export function getVersion(): string {
  return manifest.version;
}

// Default export with all functions
const samsungEmojis = {
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

export default samsungEmojis;
