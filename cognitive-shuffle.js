// Word bank: concrete, visualizable nouns grouped by starting letter
const WORDS = {
    a: ['airplane', 'apple', 'anchor', 'acorn', 'alligator', 'apricot', 'arrow', 'astronaut', 'avocado', 'antelope'],
    b: ['balloon', 'basket', 'bridge', 'butterfly', 'blanket', 'bicycle', 'banana', 'barn', 'beetle', 'boat'],
    c: ['candle', 'castle', 'cloud', 'cactus', 'carousel', 'cherry', 'compass', 'cottage', 'crane', 'cushion'],
    d: ['daisy', 'dolphin', 'drum', 'diamond', 'dragonfly', 'doorbell', 'dune', 'duckling', 'dewdrop', 'donkey'],
    e: ['elephant', 'envelope', 'eagle', 'emerald', 'elm', 'eel', 'eskimo', 'easel', 'eggplant', 'eyebrow'],
    f: ['feather', 'fountain', 'firefly', 'flamingo', 'forest', 'fossil', 'frog', 'flute', 'fig', 'falcon'],
    g: ['garden', 'glacier', 'giraffe', 'globe', 'grape', 'guitar', 'goldfish', 'gazelle', 'glove', 'gondola'],
    h: ['hammock', 'harbor', 'hedgehog', 'horizon', 'hummingbird', 'haystack', 'heron', 'hibiscus', 'horseshoe', 'hilltop'],
    i: ['igloo', 'island', 'icicle', 'ivy', 'iris', 'ibis', 'inkwell', 'iceberg', 'iguana', 'ivory'],
    j: ['jellyfish', 'jungle', 'jasmine', 'jay', 'jigsaw', 'jade', 'jacket', 'juniper', 'jar', 'jewel'],
    k: ['kite', 'kettle', 'kayak', 'kitten', 'kingfisher', 'kaleidoscope', 'knapsack', 'koala', 'kernel', 'key'],
    l: ['lantern', 'lighthouse', 'leaf', 'llama', 'lemon', 'lily', 'lobster', 'locket', 'lagoon', 'lark'],
    m: ['mountain', 'meadow', 'marble', 'mushroom', 'maple', 'moon', 'mantis', 'mitten', 'mango', 'magpie'],
    n: ['nest', 'narwhal', 'nebula', 'nectarine', 'nightingale', 'nutmeg', 'newt', 'napkin', 'notebook', 'nettle'],
    o: ['ocean', 'orchid', 'owl', 'olive', 'otter', 'opal', 'origami', 'osprey', 'oak', 'orange'],
    p: ['pebble', 'penguin', 'piano', 'pinecone', 'parrot', 'peach', 'pumpkin', 'pearl', 'pond', 'panther'],
    q: ['quilt', 'quail', 'quarry', 'quarter', 'quartz', 'queen', 'quince', 'quiver', 'quokka', 'quartet'],
    r: ['rainbow', 'rabbit', 'river', 'rosemary', 'robin', 'raindrop', 'rowboat', 'reef', 'raccoon', 'raspberry'],
    s: ['starfish', 'sandcastle', 'sunflower', 'sparrow', 'seashell', 'snowflake', 'sailboat', 'swan', 'strawberry', 'stream'],
    t: ['telescope', 'turtle', 'tulip', 'treehouse', 'tiger', 'teapot', 'tangerine', 'thistle', 'thimble', 'toucan'],
    u: ['umbrella', 'unicorn', 'urchin', 'ukulele', 'uniform', 'urn', 'utensil', 'universe', 'uphill', 'undergrowth'],
    v: ['violin', 'valley', 'vine', 'volcano', 'violet', 'velvet', 'vulture', 'village', 'vase', 'vapor'],
    w: ['waterfall', 'walrus', 'willow', 'windmill', 'whale', 'wagon', 'wren', 'walnut', 'woodland', 'wave'],
    x: ['xylophone', 'x-ray', 'xenon', 'xerus', 'xylem', 'xylophone', 'xenops', 'x-ray', 'xerus', 'xylophone'],
    y: ['yacht', 'yarn', 'yak', 'yellowtail', 'yarrow', 'yew', 'yogi', 'yucca', 'yearling', 'yurt'],
    z: ['zebra', 'zeppelin', 'zinnia', 'zephyr', 'zenith', 'zigzag', 'zodiac', 'zucchini', 'zoo', 'zinc']
};

// Seed words: short, common words with diverse letters
const SEED_WORDS = [
    'bedtime', 'castle', 'dreamy', 'forest', 'garden',
    'harbor', 'island', 'jungle', 'knight', 'lantern',
    'meadow', 'nebula', 'ocean', 'pillow', 'quartz',
    'river', 'sunset', 'temple', 'voyage', 'walnut',
    'breeze', 'clouds', 'dusk', 'fable', 'glow',
    'haven', 'lake', 'mist', 'night', 'petal',
    'shade', 'trail', 'willow', 'drift', 'ember',
    'frost', 'grain', 'haze', 'ivory', 'jewel'
];

// Game state
let state = {
    seedWord: '',
    currentIndex: 0,
    pace: 8000,
    timer: null,
    usedWords: {}
};

// DOM elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    seed: document.getElementById('seed-screen'),
    shuffle: document.getElementById('shuffle-screen'),
    complete: document.getElementById('complete-screen')
};

const els = {
    paceSelect: document.getElementById('pace-select'),
    startBtn: document.getElementById('start-btn'),
    seedWord: document.getElementById('seed-word'),
    seedContinueBtn: document.getElementById('seed-continue-btn'),
    letterTrack: document.getElementById('letter-track'),
    currentLetter: document.getElementById('current-letter'),
    shuffleWord: document.getElementById('shuffle-word'),
    progressFill: document.getElementById('progress-fill'),
    nextBtn: document.getElementById('next-btn'),
    againBtn: document.getElementById('again-btn'),
    homeBtn: document.getElementById('home-btn')
};

// Utility functions
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

function getRandomWord(letter) {
    const key = letter.toLowerCase();
    const available = WORDS[key];
    if (!available) return letter + '...';

    // Try to avoid repeats within a session
    if (!state.usedWords[key]) state.usedWords[key] = [];
    const unused = available.filter(w => !state.usedWords[key].includes(w));
    const pool = unused.length > 0 ? unused : available;
    const word = pickRandom(pool);
    state.usedWords[key].push(word);
    return word;
}

function buildLetterTrack() {
    els.letterTrack.innerHTML = '';
    const letters = state.seedWord.split('');
    letters.forEach((letter, i) => {
        const dot = document.createElement('span');
        dot.className = 'letter-dot';
        dot.textContent = letter;
        dot.dataset.index = i;
        els.letterTrack.appendChild(dot);
    });
}

function updateLetterTrack(index) {
    const dots = els.letterTrack.querySelectorAll('.letter-dot');
    dots.forEach((dot, i) => {
        dot.classList.remove('active', 'done');
        if (i < index) dot.classList.add('done');
        if (i === index) dot.classList.add('active');
    });
}

function updateProgress() {
    const pct = ((state.currentIndex + 1) / state.seedWord.length) * 100;
    els.progressFill.style.width = pct + '%';
}

function showCurrentWord() {
    const letter = state.seedWord[state.currentIndex];
    const word = getRandomWord(letter);

    els.currentLetter.textContent = letter;
    els.shuffleWord.style.animation = 'none';
    // Trigger reflow to restart animation
    void els.shuffleWord.offsetWidth;
    els.shuffleWord.style.animation = '';
    els.shuffleWord.textContent = word;

    updateLetterTrack(state.currentIndex);
    updateProgress();

    // Auto-advance if pace is set
    clearTimeout(state.timer);
    if (state.pace > 0) {
        state.timer = setTimeout(advance, state.pace);
    }
}

function advance() {
    clearTimeout(state.timer);
    state.currentIndex++;
    if (state.currentIndex >= state.seedWord.length) {
        showScreen('complete');
    } else {
        showCurrentWord();
    }
}

function startGame() {
    state.pace = Number(els.paceSelect.value);
    state.seedWord = pickRandom(SEED_WORDS);
    state.currentIndex = 0;
    state.usedWords = {};

    els.seedWord.textContent = state.seedWord;
    showScreen('seed');
}

function beginShuffle() {
    buildLetterTrack();
    showScreen('shuffle');
    showCurrentWord();
}

// Event listeners
els.startBtn.addEventListener('click', startGame);
els.seedContinueBtn.addEventListener('click', beginShuffle);
els.nextBtn.addEventListener('click', advance);
els.againBtn.addEventListener('click', startGame);
els.homeBtn.addEventListener('click', () => showScreen('welcome'));

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (screens.welcome.classList.contains('active')) {
            startGame();
        } else if (screens.seed.classList.contains('active')) {
            beginShuffle();
        } else if (screens.shuffle.classList.contains('active')) {
            advance();
        } else if (screens.complete.classList.contains('active')) {
            startGame();
        }
    }
});
