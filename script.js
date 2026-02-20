const allMoves = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];

const beatsThese = {
  Rock: ["Scissors", "Lizard"],
  Paper: ["Rock", "Spock"],
  Scissors: ["Paper", "Lizard"],
  Lizard: ["Spock", "Paper"],
  Spock: ["Scissors", "Rock"]
};

//bottom message
const ruleLines = {
  "Scissors>Paper": "Scissors cuts Paper",
  "Paper>Rock": "Paper covers Rock",
  "Rock>Lizard": "Rock crushes Lizard",
  "Lizard>Spock": "Lizard poisons Spock",
  "Spock>Scissors": "Spock smashes Scissors",
  "Scissors>Lizard": "Scissors decapitates Lizard",
  "Lizard>Paper": "Lizard eats Paper",
  "Paper>Spock": "Paper disproves Spock",
  "Spock>Rock": "Spock vaporizes Rock",
  "Rock>Scissors": "Rock crushes Scissors"
};

//html elements
const buttonsBox = document.getElementById("choices");

const playerPickText = document.getElementById("playerPick");
const cpuPickText = document.getElementById("cpuPick");

const messageText = document.getElementById("message");
const ruleText = document.getElementById("ruleLine");

const playerScoreText = document.getElementById("playerScore");
const cpuScoreText = document.getElementById("cpuScore");
const roundText = document.getElementById("roundNum");

const resetBtn = document.getElementById("resetBtn");
const winTargetSelect = document.getElementById("winTarget");
const winTargetText = document.getElementById("winTargetText");

const playerCard = document.getElementById("playerPickCard");
const cpuCard = document.getElementById("cpuPickCard");

//game vars
let playerScore = 0;
let cpuScore = 0;
let round = 0;

//no spam clicking
let locked = false;

//win number to win overall
let winTarget = Number(winTargetSelect.value);

//buttons
function makeButtons() {
  buttonsBox.innerHTML = "";

  // loop through the move list and make a button for each one
  for (let i = 0; i < allMoves.length; i++) {
    const moveName = allMoves[i];

    const btn = document.createElement("button");
    btn.className = "choiceBtn";
    btn.textContent = moveName;

    btn.addEventListener("click", function () {
      play(moveName);
    });

    buttonsBox.appendChild(btn);
  }
}

//random cpu move
function getRandomMove() {
  const index = Math.floor(Math.random() * allMoves.length);
  return allMoves[index];
}

//game logic
function checkWinner(playerMove, cpuMove) {
  if (playerMove === cpuMove) {
    return "tie";
  }

  // if the CPU move is inside the list of things the player beats, player wins
  if (beatsThese[playerMove].includes(cpuMove)) {
    return "player";
  }

  return "cpu";
}

//scoreboard
function refreshScores() {
  playerScoreText.textContent = playerScore;
  cpuScoreText.textContent = cpuScore;
  roundText.textContent = round;

  winTargetText.textContent = String(winTarget);
}

//animations
function clearAnimations() {
  playerCard.classList.remove("winGlow", "loseShake", "tiePulse", "revealPop");
  cpuCard.classList.remove("winGlow", "loseShake", "tiePulse", "revealPop");
}

//shuffling
function cpuShuffle(finalMove) {
  return new Promise(function (resolve) {
    let count = 0;
    const totalSpins = 10;

    const timer = setInterval(function () {
      cpuPickText.textContent = getRandomMove();
      cpuCard.classList.add("revealPop");

      count++;

      if (count >= totalSpins) {
        clearInterval(timer);
        cpuPickText.textContent = finalMove;
        resolve();
      }
    }, 60);
  });
}

//rules
function showRuleLine(winner, playerMove, cpuMove) {
  if (winner === "tie") {
    ruleText.textContent = "Tie round — no rule triggered.";
    return;
  }

//rock>scissors key
  const key =
    winner === "player"
      ? `${playerMove}>${cpuMove}`
      : `${cpuMove}>${playerMove}`;

  if (ruleLines[key]) {
    ruleText.textContent = `Rule: ${ruleLines[key]}`;
  } else {
    ruleText.textContent = "Rule: (unknown)";
  }
}

//game funcitonality
async function play(playerMove) {
  if (locked) return;

  // if match already ended, dontt keep playing
  if (playerScore >= winTarget || cpuScore >= winTarget) {
    messageText.textContent = "Game over! Hit Reset to play again.";
    return;
  }

  locked = true;
  clearAnimations();

  // show player move right away
  playerPickText.textContent = playerMove;
  playerCard.classList.add("revealPop");


//cpu move picked, shuffled
  const cpuMove = getRandomMove();
  await cpuShuffle(cpuMove);

  round++;

  const winner = checkWinner(playerMove, cpuMove);

  // update scores
  if (winner === "player") {
    playerScore++;
  } else if (winner === "cpu") {
    cpuScore++;
  }

  // show result message + do some animations
  if (winner === "player") {
    messageText.textContent = `You win! ${playerMove} beats ${cpuMove}.`;
    playerCard.classList.add("winGlow");
    cpuCard.classList.add("loseShake");
  } else if (winner === "cpu") {
    messageText.textContent = `You lose! ${cpuMove} beats ${playerMove}.`;
    cpuCard.classList.add("winGlow");
    playerCard.classList.add("loseShake");
  } else {
    messageText.textContent = `Tie! You both picked ${playerMove}.`;
    playerCard.classList.add("tiePulse");
    cpuCard.classList.add("tiePulse");
  }

  showRuleLine(winner, playerMove, cpuMove);
  refreshScores();

  // match win check
  if (playerScore >= winTarget) {
    messageText.textContent = `🏆 You reached ${winTarget}! You WIN the match!`;
  } else if (cpuScore >= winTarget) {
    messageText.textContent = `💻 Computer reached ${winTarget}! You LOST the match!`;
  }

  locked = false;
}

//reset
function resetGame() {
  playerScore = 0;
  cpuScore = 0;
  round = 0;
  locked = false;

  playerPickText.textContent = "—";
  cpuPickText.textContent = "—";

  messageText.textContent = "Pick a move to start!";
  ruleText.textContent = "Tip: Scissors cuts Paper… you know the drill";

  clearAnimations();
  refreshScores();
}

//win target
winTargetSelect.addEventListener("change", function () {
  winTarget = Number(winTargetSelect.value);
  refreshScores();
});

//start
makeButtons();
refreshScores();
resetBtn.addEventListener("click", resetGame);