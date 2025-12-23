export interface Emoji {
  /** The actual emoji character (e.g., "😀") */
  emoji: string;
  /** Human-readable name (e.g., "Grinning Face") */
  name: string;
  /** URL-friendly slug (e.g., "grinning-face") */
  slug: string;
  /** Unicode codepoint(s) in hex (e.g., "1f600" or "1f468-200d-1f469-200d-1f467") */
  codepoint: string;
  /** Category (e.g., "Smileys & Emotion") */
  category: EmojiCategory;
  /** Relative path to the image file */
  file: string;
  /** Just the filename */
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

export interface EmojiManifest {
  version: string;
  source: string;
  count: number;
  generated: string;
  emojis: Emoji[];
  indices: {
    byCodepoint: Record<string, Emoji>;
    byEmoji: Record<string, Emoji>;
    bySlug: Record<string, Emoji>;
  };
  categories: EmojiCategory[];
  byCategory: Record<EmojiCategory, Emoji[]>;
}

export interface SamsungEmojisOptions {
  /** Base URL for loading emoji images (default: relative path) */
  baseUrl?: string;
  /** Image format to use (default: 'webp') */
  format?: 'webp';
}
