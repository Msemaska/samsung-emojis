export interface Emoji {
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
