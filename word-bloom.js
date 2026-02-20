// Nature-themed words grouped by length for gentle progression
const WORD_POOLS = {
    4: [
        'leaf', 'fern', 'moss', 'dusk', 'dawn', 'haze', 'mist', 'pine',
        'lake', 'cove', 'glow', 'dune', 'tide', 'vale', 'nest', 'bark',
        'reed', 'pond', 'calm', 'rain', 'pear', 'plum', 'rose', 'vine',
        'lark', 'wren', 'deer', 'hare', 'swan', 'dove', 'sage', 'mint'
    ],
    5: [
        'brook', 'cedar', 'cloud', 'coral', 'creek', 'daisy', 'ember',
        'field', 'flora', 'frost', 'grove', 'haven', 'heron', 'honey',
        'lilac', 'maple', 'marsh', 'ocean', 'olive', 'peach', 'petal',
        'river', 'shore', 'stone', 'thyme', 'tulip', 'water', 'wheat',
        'crane', 'birch', 'bloom', 'bliss', 'drift', 'gleam', 'shade'
    ],
    6: [
        'autumn', 'blossom', 'breeze', 'canopy', 'clover', 'desert',
        'falcon', 'forest', 'garden', 'harbor', 'island', 'lagoon',
        'laurel', 'meadow', 'nebula', 'orchid', 'prairie', 'quartz',
        'ripple', 'stream', 'sunset', 'timber', 'tundra', 'valley',
        'violet', 'willow', 'zephyr', 'serene', 'gentle', 'wander'
    ],
    7: [
        'blossom', 'cascade', 'crystal', 'feather', 'firefly', 'glacier',
        'harvest', 'horizon', 'jasmine', 'juniper', 'lantern', 'morning',
        'orchard', 'panther', 'rainbow', 'redwood', 'seaside', 'sparrow',
        'sunbeam', 'thistle', 'whisper', 'evening', 'rosebud', 'dewdrop'
    ]
};

// Flower colors for bloom animation
const FLOWER_COLORS = [
    '#e8a0bf', '#a8c686', '#8bb8d0', '#d4a574', '#c9a0dc',
    '#e8c170', '#7fc8a8', '#d48a8a', '#8fafd4', '#c4d47a'
];

// Flower emojis for the garden
const FLOWER_EMOJIS = ['&#10047;', '&#10048;', '&#9880;', '&#9752;', '&#10038;'];

// Game state
const game = {
    currentWord: '',
    scrambled: [],
    selected: [],
    score: 0,
    solvedWords: [],
    hintRevealed: 0,
    difficulty: 4
};

// DOM references
const $ = (id) => document.getElementById(id);

const screens = {
    welcome: $('welcome-screen'),
    game: $('game-screen'),
    garden: $('garden-screen')
};

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Determine difficulty based on score
function getDifficulty() {
    if (game.score < 3) return 4;
    if (game.score < 7) return 5;
    if (game.score < 12) return 6;
    return 7;
}

function pickWord() {
    const len = getDifficulty();
    const pool = WORD_POOLS[len] || WORD_POOLS[5];
    // Avoid recently solved words
    const available = pool.filter(w => !game.solvedWords.includes(w));
    return pickRandom(available.length > 0 ? available : pool);
}

function scrambleWord(word) {
    const letters = word.split('');
    let scrambled = shuffle(letters);
    // Make sure it's actually scrambled
    let attempts = 0;
    while (scrambled.join('') === word && attempts < 10) {
        scrambled = shuffle(letters);
        attempts++;
    }
    return scrambled;
}

// Position petals in a circle
function positionPetals() {
    const ring = $('petal-ring');
    ring.innerHTML = '';

    const count = game.scrambled.length;
    const ringSize = ring.offsetWidth || 260;
    const radius = (ringSize / 2) - 32;
    const centerX = ringSize / 2;
    const centerY = ringSize / 2;

    game.scrambled.forEach((letter, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle) - 28;
        const y = centerY + radius * Math.sin(angle) - 28;

        const petal = document.createElement('button');
        petal.className = 'petal';
        petal.textContent = letter;
        petal.style.left = x + 'px';
        petal.style.top = y + 'px';
        petal.dataset.index = i;
        petal.addEventListener('click', () => selectPetal(i));
        ring.appendChild(petal);
    });
}

// Render word slots
function renderSlots() {
    const slotsEl = $('word-slots');
    slotsEl.innerHTML = '';

    for (let i = 0; i < game.currentWord.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';

        // Show hint letters
        if (i < game.hintRevealed) {
            slot.textContent = game.currentWord[i];
            slot.classList.add('hint-slot');
        } else if (i < game.hintRevealed + game.selected.length) {
            const selIdx = i - game.hintRevealed;
            slot.textContent = game.scrambled[game.selected[selIdx]];
            slot.classList.add('filled');
        }

        slotsEl.appendChild(slot);
    }
}

function selectPetal(index) {
    if (game.selected.includes(index)) return;

    game.selected.push(index);

    // Mark petal as selected
    const petals = document.querySelectorAll('.petal');
    petals[index].classList.add('selected');

    renderSlots();

    // Check if word is complete
    if (game.hintRevealed + game.selected.length === game.currentWord.length) {
        checkWord();
    }
}

function checkWord() {
    const attempt = game.currentWord.slice(0, game.hintRevealed) +
        game.selected.map(i => game.scrambled[i]).join('');

    if (attempt === game.currentWord) {
        wordSolved();
    } else {
        wordWrong();
    }
}

function wordSolved() {
    // Animate slots
    const slots = document.querySelectorAll('.slot');
    slots.forEach(s => s.classList.add('correct'));

    game.score++;
    game.solvedWords.push(game.currentWord);
    $('score').textContent = game.score;

    // Show bloom animation
    setTimeout(() => showBloom(), 400);
}

function wordWrong() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(s => s.classList.add('wrong'));

    setTimeout(() => {
        clearSelection();
    }, 500);
}

function clearSelection() {
    game.selected = [];
    const petals = document.querySelectorAll('.petal');
    petals.forEach(p => p.classList.remove('selected'));
    renderSlots();
}

function shufflePetals() {
    // Only shuffle non-hint letters
    game.scrambled = scrambleWord(game.currentWord.slice(game.hintRevealed));
    clearSelection();
    positionPetals();
}

function revealHint() {
    if (game.hintRevealed >= game.currentWord.length - 1) return;
    game.hintRevealed++;

    // Remove the hint letter from scrambled letters and rebuild
    const remaining = game.currentWord.slice(game.hintRevealed);
    game.scrambled = scrambleWord(remaining);
    clearSelection();
    positionPetals();
    renderSlots();
}

// Bloom animation
function showBloom() {
    const overlay = $('bloom-overlay');
    const petalsEl = $('bloom-petals');
    const wordEl = $('bloom-word');

    // Generate random flower petals
    petalsEl.innerHTML = '';
    const color = pickRandom(FLOWER_COLORS);
    const petalCount = 8;
    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'bloom-petal';
        const angle = (i / petalCount) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = 36;
        const x = Math.cos(rad) * dist - 16;
        const y = Math.sin(rad) * dist - 16;
        petal.style.cssText = `
            background: ${color};
            transform: translate(${x}px, ${y}px);
            opacity: 0.8;
        `;
        petalsEl.appendChild(petal);
    }

    wordEl.textContent = game.currentWord;
    overlay.classList.add('active');

    setTimeout(() => {
        overlay.classList.remove('active');
        // Show garden every 5 words
        if (game.score % 5 === 0) {
            showGarden();
        } else {
            nextWord();
        }
    }, 1800);
}

function showGarden() {
    const flowersEl = $('garden-flowers');
    flowersEl.innerHTML = '';

    game.solvedWords.forEach((word, i) => {
        const flower = document.createElement('div');
        flower.className = 'garden-flower';
        flower.style.animationDelay = (i * 0.08) + 's';
        flower.innerHTML = `
            <span class="garden-flower-icon">${pickRandom(FLOWER_EMOJIS)}</span>
            <span class="garden-flower-word">${word}</span>
        `;
        flowersEl.appendChild(flower);
    });

    showScreen('garden');
}

function nextWord() {
    game.currentWord = pickWord();
    game.scrambled = scrambleWord(game.currentWord);
    game.selected = [];
    game.hintRevealed = 0;

    renderSlots();
    positionPetals();
    showScreen('game');
}

function startGame() {
    game.score = 0;
    game.solvedWords = [];
    $('score').textContent = '0';
    nextWord();
}

// Event listeners
$('start-btn').addEventListener('click', startGame);
$('clear-btn').addEventListener('click', clearSelection);
$('shuffle-btn').addEventListener('click', shufflePetals);
$('hint-btn').addEventListener('click', revealHint);
$('keep-going-btn').addEventListener('click', nextWord);
$('menu-btn').addEventListener('click', () => showScreen('welcome'));

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (!screens.game.classList.contains('active')) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (screens.welcome.classList.contains('active')) startGame();
            else if (screens.garden.classList.contains('active')) nextWord();
        }
        return;
    }

    if (e.key === 'Backspace') {
        e.preventDefault();
        if (game.selected.length > 0) {
            const lastIdx = game.selected.pop();
            const petals = document.querySelectorAll('.petal');
            petals[lastIdx].classList.remove('selected');
            renderSlots();
        }
        return;
    }

    if (e.key === 'Escape') {
        e.preventDefault();
        clearSelection();
        return;
    }

    // Type a letter to select matching petal
    const key = e.key.toLowerCase();
    if (/^[a-z]$/.test(key)) {
        const petals = document.querySelectorAll('.petal');
        for (let i = 0; i < game.scrambled.length; i++) {
            if (game.scrambled[i] === key && !game.selected.includes(i)) {
                selectPetal(i);
                break;
            }
        }
    }
});
