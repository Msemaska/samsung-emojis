"use strict";

const React = require('react');
const samsungEmojis = require('./index.js');

function SamsungEmoji({ emoji, size, baseUrl, className = '', ...props }) {
  const sizeClass = size ? `samsung-emoji--${size}` : '';
  const url = samsungEmojis.getImageUrl(emoji, { baseUrl });

  return React.createElement('img', {
    src: url,
    alt: emoji.name,
    title: emoji.name,
    className: `samsung-emoji ${sizeClass} ${className}`.trim(),
    loading: 'lazy',
    ...props
  });
}

function EmojiText({ children, baseUrl, size }) {
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
    { className: `samsung-emoji-picker ${className}` },
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
          className: `samsung-emoji-picker__category-btn ${
            !activeCategory && !searchQuery ? 'active' : ''
          }`,
          onClick: () => setActiveCategory(null),
        },
        'All'
      ),
      categories.map((cat) =>
        React.createElement(
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
