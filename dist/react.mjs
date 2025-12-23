import React, { useState, useMemo, useCallback, Fragment, createElement } from 'react';
import samsungEmojis from './index.mjs';

export function SamsungEmoji({ emoji, size, baseUrl, className = '', ...props }) {
  const sizeClass = size ? `samsung-emoji--${size}` : '';
  const url = samsungEmojis.getImageUrl(emoji, { baseUrl });

  return createElement('img', {
    src: url,
    alt: emoji.name,
    title: emoji.name,
    className: `samsung-emoji ${sizeClass} ${className}`.trim(),
    loading: 'lazy',
    ...props
  });
}

export function EmojiText({ children, baseUrl, size }) {
  const emojiRegex =
    /(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(?:\u200D(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*/gu;
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
    { className: `samsung-emoji-picker ${className}` },
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
          className: `samsung-emoji-picker__category-btn ${
            !activeCategory && !searchQuery ? 'active' : ''
          }`,
          onClick: () => setActiveCategory(null),
        },
        'All'
      ),
      categories.map((cat) =>
        createElement(
          'button',
          {
            key: cat,
            className: `samsung-emoji-picker__category-btn ${
              activeCategory === cat ? 'active' : ''
            }`,
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
