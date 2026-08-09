js = r'''const ANSWER = "COLE";
const MAX_GUESSES = 6;

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const resetButton = document.getElementById("reset");

let currentGuess = "";
let currentRow = 0;
let gameOver = false;
let keyStates = {};

const keyboardRows = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACKSPACE"]
];

function makeBoard() {
  board.innerHTML = "";

  for (let i = 0; i < MAX_GUESSES * ANSWER.length; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    board.appendChild(tile);
  }
}

function makeKeyboard() {
  keyboard.innerHTML = "";

  keyboardRows.forEach(row => {
    const rowElement = document.createElement("div");
    rowElement.className = "key-row";

    row.forEach(letter => {
      const button = document.createElement("button");
      button.className = "key";
      if (letter === "ENTER" || letter === "BACKSPACE") {
        button.classList.add("wide");
      }

      button.textContent = letter === "BACKSPACE" ? "⌫" : letter;
      button.type = "button";
      button.dataset.key = letter;
      button.addEventListener("click", () => handleKey(letter));

      rowElement.appendChild(button);
    });

    keyboard.appendChild(rowElement);
  });
}

function updateBoard() {
  const tiles = board.querySelectorAll(".tile");

  for (let i = 0; i < tiles.length; i++) {
    const row = Math.floor(i / ANSWER.length);
    const col = i % ANSWER.length;
    const tile = tiles[i];

    if (row === currentRow && col < currentGuess.length) {
      tile.textContent = currentGuess[col];
      tile.classList.add("filled");
    } else if (row !== currentRow) {
      // Keep completed rows untouched.
    } else {
      tile.textContent = "";
      tile.classList.remove("filled");
    }
  }
}

function handleKey(key) {
  if (gameOver) return;

  if (key === "ENTER") {
    submitGuess();
    return;
  }

  if (key === "BACKSPACE") {
    currentGuess = currentGuess.slice(0, -1);
    updateBoard();
    return;
  }

  if (/^[A-Z]$/.test(key) && currentGuess.length < ANSWER.length) {
    currentGuess += key;
    updateBoard();
  }
}

function submitGuess() {
  if (currentGuess.length !== ANSWER.length) {
    showMessage("Need 4 letters, genius 😭");
    return;
  }

  const guess = currentGuess;
  const tiles = board.querySelectorAll(".tile");

  for (let i = 0; i < ANSWER.length; i++) {
    const tile = tiles[currentRow * ANSWER.length + i];
    const letter = guess[i];

    tile.classList.remove("filled");

    if (letter === ANSWER[i]) {
      tile.classList.add("correct");
      updateKey(letter, "correct");
    } else {
      tile.classList.add("wrong");
      updateKey(letter, "wrong");
    }
  }

  if (guess === ANSWER) {
    gameOver = true;
    showMessage(getWinMessage());
    return;
  }

  currentRow++;

  if (currentRow >= MAX_GUESSES) {
    gameOver = true;
    showMessage("HOW DID YOU MISS COLE SIX TIMES 💀");
    return;
  }

  currentGuess = "";
  updateBoard();
}

function updateKey(letter, state) {
  const priority = { correct: 3, wrong: 1 };

  if (!keyStates[letter] || priority[state] > priority[keyStates[letter]]) {
    keyStates[letter] = state;
    const button = keyboard.querySelector(`[data-key="${letter}"]`);

    if (button) {
      button.classList.remove("correct", "wrong");
      button.classList.add(state);
    }
  }
}

function getWinMessage() {
  const messages = [
    "COLE HAS BEEN LOCATED 🗿",
    "Correct. Obviously.",
    "You found Cole. Incredible.",
    "The prophecy is fulfilled.",
    "COLELELELELE 🔥",
    "Only took you " + (currentRow + 1) + " guess" + (currentRow === 0 ? "" : "es") + "."
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

function showMessage(text) {
  message.textContent = text;
}

function resetGame() {
  currentGuess = "";
  currentRow = 0;
  gameOver = false;
  keyStates = {};
  message.textContent = "";
  makeBoard();
  makeKeyboard();
}

document.addEventListener("keydown", event => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (event.key === "Enter") {
    handleKey("ENTER");
  } else if (event.key === "Backspace") {
    handleKey("BACKSPACE");
  } else {
    handleKey(event.key.toUpperCase());
  }
});

resetButton.addEventListener("click", resetGame);

resetGame();
'''
