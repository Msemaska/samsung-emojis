import React, { useMemo, useState, useCallback } from 'react';
import type { Emoji, EmojiCategory, SamsungEmojisOptions } from './types';
import {
  getAllEmojis,
  getByEmoji,
  getByCategory,
  getCategories,
  search,
  getImageUrl,
} from './index';

export type { Emoji, EmojiCategory, SamsungEmojisOptions };

export interface SamsungEmojiProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** The emoji data object */
  emoji: Emoji;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Base URL for images */
  baseUrl?: string;
}

/**
 * Render a single Samsung emoji
 */
export function SamsungEmoji({
  emoji,
  size,
  baseUrl,
  className = '',
  ...props
}: SamsungEmojiProps) {
  const sizeClass = size ? `samsung-emoji--${size}` : '';
  const url = getImageUrl(emoji, { baseUrl });

  return (
    <img
      src={url}
      alt={emoji.name}
      title={emoji.name}
      className={`samsung-emoji ${sizeClass} ${className}`.trim()}
      loading="lazy"
      {...props}
    />
  );
}

export interface EmojiTextProps {
  /** Text containing native emojis to replace */
  children: string;
  /** Base URL for images */
  baseUrl?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Render text with native emojis replaced by Samsung emojis
 */
export function EmojiText({ children, baseUrl, size }: EmojiTextProps) {
  const parts = useMemo(() => {
    const emojiRegex =
      /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\u200D(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*/gu;
    const result: (string | Emoji)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = emojiRegex.exec(children)) !== null) {
      if (match.index > lastIndex) {
        result.push(children.slice(lastIndex, match.index));
      }
      const emojiData = getByEmoji(match[0]);
      if (emojiData) {
        result.push(emojiData);
      } else {
        result.push(match[0]);
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < children.length) {
      result.push(children.slice(lastIndex));
    }

    return result;
  }, [children]);

  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <React.Fragment key={i}>{part}</React.Fragment>
        ) : (
          <SamsungEmoji key={i} emoji={part} size={size} baseUrl={baseUrl} />
        )
      )}
    </>
  );
}

export interface EmojiPickerProps {
  /** Called when an emoji is selected */
  onSelect: (emoji: Emoji) => void;
  /** Base URL for images */
  baseUrl?: string;
  /** Categories to show (default: all) */
  categories?: EmojiCategory[];
  /** Custom class name */
  className?: string;
  /** Enable search */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
}

/**
 * A simple emoji picker component
 */
export function EmojiPicker({
  onSelect,
  baseUrl,
  categories: allowedCategories,
  className = '',
  searchable = true,
  searchPlaceholder = 'Search emojis...',
}: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<EmojiCategory | null>(null);

  const categories = useMemo(
    () => allowedCategories || getCategories(),
    [allowedCategories]
  );

  const filteredEmojis = useMemo(() => {
    if (searchQuery) {
      return search(searchQuery);
    }
    if (activeCategory) {
      return getByCategory(activeCategory);
    }
    return getAllEmojis();
  }, [searchQuery, activeCategory]);

  const handleEmojiClick = useCallback(
    (emoji: Emoji) => {
      onSelect(emoji);
    },
    [onSelect]
  );

  return (
    <div className={`samsung-emoji-picker ${className}`}>
      {searchable && (
        <div className="samsung-emoji-picker__search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="samsung-emoji-picker__search-input"
          />
        </div>
      )}

      <div className="samsung-emoji-picker__categories">
        <button
          className={`samsung-emoji-picker__category-btn ${
            !activeCategory && !searchQuery ? 'active' : ''
          }`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`samsung-emoji-picker__category-btn ${
              activeCategory === cat ? 'active' : ''
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="samsung-emoji-picker__grid samsung-emoji-grid">
        {filteredEmojis.map((emoji) => (
          <button
            key={emoji.codepoint}
            onClick={() => handleEmojiClick(emoji)}
            className="samsung-emoji-picker__emoji-btn"
            title={emoji.name}
          >
            <SamsungEmoji emoji={emoji} baseUrl={baseUrl} />
          </button>
        ))}
      </div>
    </div>
  );
}

// Re-export utility functions for convenience
export {
  getAllEmojis,
  getByEmoji,
  getByCategory,
  getCategories,
  search,
  getImageUrl,
} from './index';
