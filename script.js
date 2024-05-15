let selectedWord = "";
let guessedLetters = [];
let wrongGuesses = [];
let maxWrongGuesses = 6;

const wordDisplay = document.getElementById("wordDisplay");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const wrongGuessesDisplay = document.getElementById("wrongGuesses");
const resetButton = document.getElementById("resetButton");
const hangmanCanvas = document.getElementById("hangmanCanvas");
const ctx = hangmanCanvas.getContext("2d");

function fetchRandomWord() {
    fetch('https://random-word-api.herokuapp.com/word')
        .then(response => response.json())
        .then(data => {
            selectedWord = data[0];
            resetGame();
        })
        .catch(error => {
            console.error('Error fetching word:', error);
            message.textContent = 'Error fetching word. Please try again.';
        });
}

function displayWord() {
    let display = selectedWord.split("").map(letter => guessedLetters.includes(letter) ? letter : "_").join(" ");
    wordDisplay.textContent = display;
}

function displayKeyboard() {
    keyboard.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        let letter = String.fromCharCode(i).toLowerCase();
        let button = document.createElement("span");
        button.textContent = letter;
        button.classList.add("letter");
        button.addEventListener("click", () => handleGuess(letter));
        keyboard.appendChild(button);
    }
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter) || wrongGuesses.includes(letter)) return;
    if (selectedWord.includes(letter)) {
        guessedLetters.push(letter);
        if (selectedWord.split("").every(letter => guessedLetters.includes(letter))) {
            message.textContent = "Congratulations! You've won!";
            disableKeyboard();
        }
    } else {
        wrongGuesses.push(letter);
        drawHangman(wrongGuesses.length);
        if (wrongGuesses.length >= maxWrongGuesses) {
            message.textContent = `Game over! The word was "${selectedWord}".`;
            disableKeyboard();
        }
    }
    updateGameState();
}

function updateGameState() {
    displayWord();
    wrongGuessesDisplay.textContent = `Wrong guesses: ${wrongGuesses.join(", ")}`;
    Array.from(keyboard.children).forEach(button => {
        if (guessedLetters.includes(button.textContent)) {
            button.classList.add("correct");
        }
        if (wrongGuesses.includes(button.textContent)) {
            button.classList.add("incorrect");
        }
    });
}

function disableKeyboard() {
    Array.from(keyboard.children).forEach(button => {
        button.classList.add("correct");
        button.style.cursor = "default";
        button.removeEventListener("click", handleGuess);
    });
}

resetButton.addEventListener("click", fetchRandomWord);

function resetGame() {
    guessedLetters = [];
    wrongGuesses = [];
    message.textContent = "";
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    displayWord();
    displayKeyboard();
    updateGameState();
    drawHangman(0); // Draw the initial state of the gallows
}

function drawHangman(stage) {
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height); // Clear the canvas before redrawing

    // Draw the gallows
    ctx.beginPath();
    ctx.moveTo(10, 190);
    ctx.lineTo(190, 190);
    ctx.moveTo(50, 190);
    ctx.lineTo(50, 10);
    ctx.lineTo(130, 10);
    ctx.lineTo(130, 30);
    ctx.stroke();

    if (stage > 0) {
        // Draw the head
        ctx.beginPath();
        ctx.arc(130, 50, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (stage > 1) {
        // Draw the body
        ctx.moveTo(130, 70);
        ctx.lineTo(130, 130);
        ctx.stroke();
    }
    if (stage > 2) {
        // Draw the left arm
        ctx.moveTo(130, 90);
        ctx.lineTo(100, 110);
        ctx.stroke();
    }
    if (stage > 3) {
        // Draw the right arm
        ctx.moveTo(130, 90);
        ctx.lineTo(160, 110);
        ctx.stroke();
    }
    if (stage > 4) {
        // Draw the left leg
        ctx.moveTo(130, 130);
        ctx.lineTo(100, 170);
        ctx.stroke();
    }
    if (stage > 5) {
        // Draw the right leg
        ctx.moveTo(130, 130);
        ctx.lineTo(160, 170);
        ctx.stroke();
    }
}

// Initialize game with a random word
fetchRandomWord();
