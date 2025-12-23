const fs = require('fs');
const path = require('path');

const EMOJI_DIR = path.join(__dirname, '..', 'samsung_emojis');
const OUTPUT_PATH = path.join(__dirname, '..', 'dist', 'emojis.json');

// Emoji categories based on Unicode standard groupings
const CATEGORY_KEYWORDS = {
  'Smileys & Emotion': [
    'face', 'grinning', 'smiling', 'tears', 'joy', 'laughing', 'winking', 'kissing',
    'heart-eyes', 'star-struck', 'savoring', 'tongue', 'zany', 'money-mouth', 'hugging',
    'thinking', 'shushing', 'lying', 'relieved', 'pensive', 'sleepy', 'sleeping',
    'drooling', 'mask', 'thermometer', 'bandage', 'nauseated', 'vomiting', 'sneezing',
    'hot', 'cold', 'woozy', 'dizzy', 'exploding', 'cowboy', 'partying', 'disguised',
    'sunglasses', 'nerd', 'monocle', 'confused', 'worried', 'frowning', 'anguished',
    'fearful', 'anxious', 'crying', 'screaming', 'confounded', 'persevering', 'disappointed',
    'downcast', 'weary', 'pleading', 'pouting', 'angry', 'rage', 'cursing', 'skull',
    'pile-of-poo', 'clown', 'ogre', 'goblin', 'ghost', 'alien', 'robot', 'cat', 'monkey',
    'kiss', 'love', 'couple', 'heart', 'anger', 'boom', 'sweat', 'hole', 'speech',
    'thought', 'zzz', 'hundred', 'fire'
  ],
  'People & Body': [
    'person', 'man', 'woman', 'boy', 'girl', 'child', 'adult', 'older', 'baby',
    'hand', 'finger', 'thumb', 'fist', 'palm', 'wave', 'clap', 'shake', 'writing',
    'nail', 'selfie', 'muscle', 'leg', 'foot', 'ear', 'nose', 'brain', 'tooth',
    'bone', 'eyes', 'eye', 'tongue', 'mouth', 'lip', 'biting', 'anatomical',
    'lungs', 'hair', 'beard', 'bald', 'blond', 'curly', 'white-hair', 'red-hair',
    'walking', 'standing', 'kneeling', 'running', 'dancing', 'levitating', 'bath',
    'bed', 'superhero', 'supervillain', 'mage', 'fairy', 'vampire', 'mermaid',
    'elf', 'genie', 'zombie', 'troll', 'pregnant', 'breast-feeding', 'ninja',
    'family', 'people', 'bust', 'silhouette', 'footprints'
  ],
  'Animals & Nature': [
    'dog', 'cat', 'mouse', 'hamster', 'rabbit', 'fox', 'bear', 'panda', 'koala',
    'tiger', 'lion', 'cow', 'pig', 'frog', 'monkey', 'chicken', 'penguin', 'bird',
    'eagle', 'duck', 'swan', 'owl', 'dodo', 'feather', 'flamingo', 'peacock',
    'parrot', 'bat', 'wolf', 'boar', 'horse', 'unicorn', 'zebra', 'deer', 'bison',
    'ox', 'water-buffalo', 'goat', 'sheep', 'llama', 'giraffe', 'elephant',
    'mammoth', 'rhino', 'hippo', 'camel', 'kangaroo', 'badger', 'skunk', 'otter',
    'sloth', 'gorilla', 'orangutan', 'chipmunk', 'beaver', 'hedgehog', 'rat',
    'whale', 'dolphin', 'seal', 'fish', 'shark', 'octopus', 'shell', 'coral',
    'jellyfish', 'snail', 'butterfly', 'bug', 'ant', 'bee', 'beetle', 'cricket',
    'cockroach', 'spider', 'scorpion', 'mosquito', 'fly', 'worm', 'microbe',
    'bouquet', 'flower', 'rose', 'tulip', 'blossom', 'sunflower', 'seedling',
    'tree', 'plant', 'leaf', 'clover', 'shamrock', 'herb', 'grass', 'cactus',
    'mushroom', 'chestnut', 'nest', 'empty-nest', 'hyacinth', 'lotus', 'potted'
  ],
  'Food & Drink': [
    'grape', 'melon', 'watermelon', 'tangerine', 'lemon', 'lime', 'banana', 'pineapple',
    'mango', 'apple', 'pear', 'peach', 'cherry', 'strawberry', 'blueberry', 'kiwi',
    'tomato', 'olive', 'coconut', 'avocado', 'eggplant', 'potato', 'carrot', 'corn',
    'pepper', 'cucumber', 'leafy', 'broccoli', 'garlic', 'onion', 'peanut', 'beans',
    'bread', 'croissant', 'baguette', 'flatbread', 'pretzel', 'bagel', 'pancake',
    'waffle', 'cheese', 'meat', 'poultry', 'bacon', 'burger', 'fries', 'pizza',
    'hotdog', 'sandwich', 'taco', 'burrito', 'tamale', 'falafel', 'egg', 'cooking',
    'pot', 'fondue', 'bowl', 'salad', 'popcorn', 'butter', 'salt', 'canned', 'jar',
    'bento', 'rice', 'curry', 'ramen', 'spaghetti', 'sweet-potato', 'oden', 'sushi',
    'dumpling', 'oyster', 'shrimp', 'squid', 'lobster', 'crab', 'takeout', 'moon-cake',
    'dango', 'fortune', 'fish-cake', 'ice', 'shaved', 'dessert', 'doughnut', 'cookie',
    'birthday', 'cake', 'cupcake', 'pie', 'chocolate', 'candy', 'lollipop', 'custard',
    'honey', 'milk', 'tea', 'coffee', 'teacup', 'sake', 'champagne', 'wine', 'cocktail',
    'beer', 'tumbler', 'glass', 'cup', 'straw', 'beverage', 'mate', 'bubble', 'juice',
    'chopstick', 'fork', 'knife', 'spoon', 'plate'
  ],
  'Travel & Places': [
    'car', 'taxi', 'bus', 'trolley', 'racing', 'police', 'ambulance', 'fire-engine',
    'truck', 'tractor', 'motorcycle', 'bicycle', 'scooter', 'skateboard', 'roller',
    'train', 'railway', 'metro', 'tram', 'station', 'monorail', 'bullet', 'locomotive',
    'ship', 'boat', 'canoe', 'sailboat', 'speedboat', 'ferry', 'cruise', 'anchor',
    'airplane', 'helicopter', 'rocket', 'satellite', 'flying', 'parachute', 'seat',
    'mountain', 'volcano', 'fuji', 'camping', 'beach', 'desert', 'island', 'park',
    'stadium', 'building', 'house', 'home', 'office', 'hospital', 'bank', 'hotel',
    'store', 'school', 'factory', 'castle', 'wedding', 'tower', 'statue', 'church',
    'mosque', 'synagogue', 'temple', 'kaaba', 'shrine', 'fountain', 'tent', 'hut',
    'cityscape', 'sunrise', 'sunset', 'dusk', 'night', 'bridge', 'milky-way',
    'carousel', 'ferris', 'roller-coaster', 'barber', 'circus', 'stop', 'traffic',
    'construction', 'fuel', 'map', 'globe', 'compass', 'world', 'busstop'
  ],
  'Activities': [
    'soccer', 'baseball', 'softball', 'basketball', 'volleyball', 'football',
    'rugby', 'tennis', 'badminton', 'lacrosse', 'cricket', 'hockey', 'golf',
    'ping-pong', 'boxing', 'martial', 'goal', 'ice-skate', 'fishing', 'diving',
    'running-shirt', 'ski', 'sled', 'curling', 'dart', 'yo-yo', 'kite', 'pool',
    'swimming', 'surfing', 'rowing', 'climbing', 'cycling', 'mountain-biking',
    'horse-racing', 'snowboard', 'gymnast', 'wrestler', 'water-polo', 'handball',
    'juggling', 'lotus-position', 'circus', 'performing', 'trophy', 'medal',
    'ticket', 'admission', 'artist', 'palette', 'thread', 'sewing', 'yarn', 'knot',
    'game', 'puzzle', 'chess', 'dice', 'slot', 'bowling', 'video', 'joystick',
    'teddy', 'pinata', 'nesting', 'spade', 'mahjong', 'flower-playing'
  ],
  'Objects': [
    'watch', 'phone', 'mobile', 'telephone', 'computer', 'laptop', 'keyboard',
    'printer', 'mouse', 'trackball', 'disk', 'floppy', 'dvd', 'abacus', 'camera',
    'projector', 'film', 'clapper', 'television', 'radio', 'microphone', 'headphone',
    'speaker', 'battery', 'plug', 'flashlight', 'candle', 'lamp', 'diya', 'bulb',
    'book', 'notebook', 'ledger', 'scroll', 'page', 'newspaper', 'bookmark', 'label',
    'money', 'coin', 'dollar', 'euro', 'pound', 'yen', 'credit', 'receipt', 'chart',
    'envelope', 'email', 'inbox', 'outbox', 'mailbox', 'postbox', 'ballot', 'pencil',
    'pen', 'paintbrush', 'crayon', 'memo', 'briefcase', 'folder', 'clipboard', 'pushpin',
    'paperclip', 'ruler', 'scissors', 'wastebasket', 'lock', 'key', 'hammer', 'axe',
    'pick', 'wrench', 'screwdriver', 'nut', 'bolt', 'gear', 'clamp', 'scale', 'link',
    'chain', 'hook', 'toolbox', 'magnet', 'ladder', 'petri', 'dna', 'microscope',
    'telescope', 'antenna', 'syringe', 'drop', 'pill', 'stethoscope', 'x-ray',
    'bandage', 'crutch', 'door', 'elevator', 'mirror', 'window', 'bed', 'couch',
    'chair', 'toilet', 'plunger', 'shower', 'bathtub', 'razor', 'lotion', 'toothbrush',
    'soap', 'sponge', 'bucket', 'basket', 'roll', 'thread', 'yarn', 'safety', 'glasses',
    'goggles', 'lab', 'ring', 'umbrella', 'coat', 'shirt', 'pants', 'jeans', 'scarf',
    'gloves', 'socks', 'dress', 'kimono', 'sari', 'bikini', 'shorts', 'shoe', 'sneaker',
    'boot', 'sandal', 'heel', 'flip-flop', 'thong', 'ballet', 'crown', 'hat', 'cap',
    'helmet', 'military', 'top', 'graduation', 'billed', 'rescue', 'prayer', 'lipstick',
    'gem', 'muted', 'speaker', 'bell', 'musical', 'notes', 'saxophone', 'accordion',
    'guitar', 'banjo', 'violin', 'drum', 'maracas', 'flute', 'trumpet', 'harp'
  ],
  'Symbols': [
    'heart', 'broken', 'exclamation', 'anger', 'hundred', 'collision', 'sweat',
    'dash', 'hole', 'speech', 'thought', 'zzz', 'peace', 'cross', 'star', 'sparkle',
    'dizzy', 'plus', 'minus', 'division', 'multiplication', 'infinity', 'loop',
    'question', 'exclamation', 'bangbang', 'interrobang', 'warning', 'children',
    'fleur', 'trident', 'name', 'badge', 'beginner', 'check', 'ballot', 'heavy',
    'curly', 'wavy', 'copyright', 'registered', 'trademark', 'hash', 'keycap',
    'asterisk', 'input', 'capital', 'small', 'letters', 'symbols', 'numbers',
    'alphanumeric', 'symbols', 'word', 'button', 'abc', 'atm', 'sign', 'wheelchair',
    'restroom', 'passport', 'customs', 'baggage', 'parking', 'mens', 'womens',
    'baby-symbol', 'water-closet', 'arrow', 'back', 'end', 'soon', 'top', 'free',
    'new', 'up', 'cool', 'cinema', 'wireless', 'vibration', 'mobile-phone-off',
    'female', 'male', 'transgender', 'medical', 'recycling', 'aries', 'taurus',
    'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius',
    'capricorn', 'aquarius', 'pisces', 'ophiuchus', 'shuffle', 'repeat', 'play',
    'pause', 'stop', 'record', 'eject', 'fast', 'rewind', 'next', 'previous',
    'geometric', 'circle', 'square', 'triangle', 'diamond', 'radio-button',
    'checkered', 'flag', 'triangular', 'rainbow', 'pirate'
  ],
  'Flags': [
    'flag', 'flags', 'chequered', 'triangular', 'crossed', 'black', 'white',
    'rainbow', 'transgender', 'pirate', 'ascension', 'andorra', 'emirates',
    'afghanistan', 'antigua', 'anguilla', 'albania', 'armenia', 'angola',
    'antarctica', 'argentina', 'samoa', 'austria', 'australia', 'aruba',
    'aland', 'azerbaijan', 'bosnia', 'barbados', 'bangladesh', 'belgium',
    'burkina', 'bulgaria', 'bahrain', 'burundi', 'benin', 'barthelemy',
    'bermuda', 'brunei', 'bolivia', 'caribbean', 'brazil', 'bahamas',
    'bhutan', 'bouvet', 'botswana', 'belarus', 'belize', 'canada', 'cocos',
    'congo', 'african', 'switzerland', 'ivoire', 'cook', 'chile', 'cameroon',
    'china', 'colombia', 'clipperton', 'costa', 'cuba', 'verde', 'curacao',
    'christmas', 'cyprus', 'czechia', 'germany', 'diego', 'djibouti', 'denmark',
    'dominica', 'dominican', 'algeria', 'ceuta', 'ecuador', 'estonia', 'egypt',
    'sahara', 'eritrea', 'spain', 'ethiopia', 'union', 'finland', 'fiji',
    'falkland', 'micronesia', 'faroe', 'france', 'gabon', 'kingdom', 'grenada',
    'georgia', 'guiana', 'guernsey', 'ghana', 'gibraltar', 'greenland', 'gambia',
    'guinea', 'guadeloupe', 'equatorial', 'greece', 'georgia', 'guatemala',
    'guam', 'guinea-bissau', 'guyana', 'hong', 'heard', 'honduras', 'croatia',
    'haiti', 'hungary', 'canary', 'indonesia', 'ireland', 'israel', 'isle',
    'india', 'indian', 'iraq', 'iran', 'iceland', 'italy', 'jersey', 'jamaica',
    'jordan', 'japan', 'kenya', 'kyrgyzstan', 'cambodia', 'kiribati', 'comoros',
    'kitts', 'korea', 'kuwait', 'cayman', 'kazakhstan', 'laos', 'lebanon',
    'lucia', 'liechtenstein', 'lanka', 'liberia', 'lesotho', 'lithuania',
    'luxembourg', 'latvia', 'libya', 'morocco', 'monaco', 'moldova', 'montenegro',
    'martin', 'madagascar', 'marshall', 'macedonia', 'mali', 'myanmar', 'mongolia',
    'macao', 'mariana', 'martinique', 'mauritania', 'montserrat', 'malta',
    'mauritius', 'maldives', 'malawi', 'mexico', 'malaysia', 'mozambique',
    'namibia', 'caledonia', 'niger', 'norfolk', 'nigeria', 'nicaragua', 'netherlands',
    'norway', 'nepal', 'nauru', 'niue', 'zealand', 'oman', 'panama', 'peru',
    'polynesia', 'papua', 'philippines', 'pakistan', 'poland', 'miquelon',
    'pitcairn', 'puerto', 'palestinian', 'portugal', 'palau', 'paraguay', 'qatar',
    'reunion', 'romania', 'serbia', 'russia', 'rwanda', 'arabia', 'solomon',
    'seychelles', 'sudan', 'sweden', 'singapore', 'helena', 'slovenia', 'svalbard',
    'slovakia', 'leone', 'marino', 'senegal', 'somalia', 'suriname', 'south',
    'principe', 'salvador', 'maarten', 'syria', 'eswatini', 'tristan', 'turks',
    'chad', 'territories', 'togo', 'thailand', 'tajikistan', 'tokelau', 'timor',
    'turkmenistan', 'tunisia', 'tonga', 'turkey', 'trinidad', 'tuvalu', 'taiwan',
    'tanzania', 'ukraine', 'uganda', 'islands', 'nations', 'states', 'uruguay',
    'uzbekistan', 'vatican', 'vincent', 'venezuela', 'virgin', 'vietnam', 'vanuatu',
    'wallis', 'yemen', 'mayotte', 'africa', 'zambia', 'zimbabwe', 'england',
    'scotland', 'wales'
  ]
};

function categorizeEmoji(name) {
  const lowerName = name.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        return category;
      }
    }
  }

  return 'Symbols';
}

function unicodeToEmoji(codepoints) {
  try {
    return codepoints
      .split('-')
      .map(cp => String.fromCodePoint(parseInt(cp, 16)))
      .join('');
  } catch {
    return '';
  }
}

function generateManifest() {
  const files = fs.readdirSync(EMOJI_DIR).filter(f => f.endsWith('.webp'));
  const emojis = [];

  for (const file of files) {
    // Parse filename: emoji-name_codepoint.webp
    const match = file.match(/^(.+)_([0-9a-f-]+)\.webp$/i);
    if (!match) {
      console.warn(`Skipping unrecognized file: ${file}`);
      continue;
    }

    const [, slug, codepoint] = match;
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const emoji = unicodeToEmoji(codepoint);
    const category = categorizeEmoji(slug);

    emojis.push({
      emoji,
      name,
      slug,
      codepoint,
      category,
      file: `samsung_emojis/${file}`,
      filename: file
    });
  }

  // Sort by category then name
  emojis.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  // Create indices for fast lookup
  const byCodepoint = {};
  const byEmoji = {};
  const bySlug = {};
  const byCategory = {};

  for (const e of emojis) {
    byCodepoint[e.codepoint] = e;
    if (e.emoji) byEmoji[e.emoji] = e;
    bySlug[e.slug] = e;

    if (!byCategory[e.category]) {
      byCategory[e.category] = [];
    }
    byCategory[e.category].push(e);
  }

  const manifest = {
    version: '1.0.0',
    source: 'Samsung One UI',
    count: emojis.length,
    generated: new Date().toISOString(),
    emojis,
    indices: {
      byCodepoint,
      byEmoji,
      bySlug
    },
    categories: Object.keys(byCategory),
    byCategory
  };

  // Ensure dist directory exists
  const distDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Generated manifest with ${emojis.length} emojis -> ${OUTPUT_PATH}`);

  return manifest;
}

module.exports = { generateManifest };

if (require.main === module) {
  generateManifest();
}
