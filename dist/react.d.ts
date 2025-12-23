import { ComponentProps, ReactNode } from 'react';
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
