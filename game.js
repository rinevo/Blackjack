const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];

const newGameBtn = document.getElementById('newGameBtn');
const hitBtn = document.getElementById('hitBtn');
const standBtn = document.getElementById('standBtn');
const messageEl = document.getElementById('message');
const dealerHandEl = document.getElementById('dealerHand');
const playerHandEl = document.getElementById('playerHand');
const dealerScoreEl = document.getElementById('dealerScore');
const playerScoreEl = document.getElementById('playerScore');
const playerWinsEl = document.getElementById('playerWins');
const dealerWinsEl = document.getElementById('dealerWins');
const tiesEl = document.getElementById('ties');
const gamesPlayedEl = document.getElementById('gamesPlayed');

let deck = [];
let playerHand = [];
let dealerHand = [];
let dealerHidden = false;
let gameActive = false;
let playerWins = 0;
let dealerWins = 0;
let ties = 0;
let gamesPlayed = 0;

function createDeck() {
  const cards = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      cards.push({
        suit,
        rank,
        image: `cards/${suit}_${rank}.svg`,
        value: getCardValue(rank)
      });
    });
  });
  return cards;
}

function getCardValue(rank) {
  if (rank === 'a') return 11;
  if (['j', 'q', 'k'].includes(rank)) return 10;
  return Number(rank);
}

function calculateHandValue(hand) {
  let total = hand.reduce((sum, card) => sum + card.value, 0);
  let aces = hand.filter(card => card.rank === 'a').length;

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function drawCard() {
  return deck.pop();
}

function renderHands() {
  renderPlayerHand();
  renderDealerHand();
  updateScore();
}

function renderPlayerHand() {
  playerHandEl.innerHTML = '';
  playerHand.forEach(card => {
    const img = document.createElement('img');
    img.src = card.image;
    img.alt = `${card.suit} ${card.rank}`;
    img.className = 'card-image';
    playerHandEl.appendChild(img);
  });
}

function renderDealerHand() {
  dealerHandEl.innerHTML = '';
  dealerHand.forEach((card, index) => {
    const img = document.createElement('img');
    img.className = 'card-image';
    if (dealerHidden && index === 1) {
      img.src = 'cards/back_black.svg';
      img.alt = '裏面';
    } else {
      img.src = card.image;
      img.alt = `${card.suit} ${card.rank}`;
    }
    dealerHandEl.appendChild(img);
  });
}

function updateScore() {
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = dealerHidden ? '?' : calculateHandValue(dealerHand);
  playerScoreEl.textContent = `プレイヤー: ${playerValue}点`;
  dealerScoreEl.textContent = `ディーラー: ${dealerValue}点`;
}

function renderScoreboard() {
  playerWinsEl.textContent = playerWins;
  dealerWinsEl.textContent = dealerWins;
  tiesEl.textContent = ties;
  gamesPlayedEl.textContent = gamesPlayed;
}

function updateButtons() {
  hitBtn.disabled = !gameActive;
  standBtn.disabled = !gameActive;
}

function startGame() {
  deck = createDeck();
  shuffle(deck);
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  dealerHidden = true;
  gameActive = true;
  messageEl.textContent = 'プレイヤーのターンです。ヒットまたはスタンドを選択してください。';
  renderHands();
  renderScoreboard();
  updateButtons();

  if (calculateHandValue(playerHand) === 21) {
    finishRound();
  }
}

function hit() {
  if (!gameActive) return;
  playerHand.push(drawCard());
  renderHands();

  if (calculateHandValue(playerHand) > 21) {
    finishRound();
  }
}

function stand() {
  if (!gameActive) return;
  dealerHidden = false;
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
  renderHands();
  finishRound();
}

function finishRound() {
  gameActive = false;
  dealerHidden = false;
  renderHands();
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  gamesPlayed += 1;

  if (playerValue > 21) {
    dealerWins += 1;
    messageEl.textContent = 'バーストしました。ディーラーの勝ちです。';
  } else if (dealerValue > 21) {
    playerWins += 1;
    messageEl.textContent = 'ディーラーがバーストしました。プレイヤーの勝ちです。';
  } else if (playerValue > dealerValue) {
    playerWins += 1;
    messageEl.textContent = 'プレイヤーの勝ちです。';
  } else if (playerValue < dealerValue) {
    dealerWins += 1;
    messageEl.textContent = 'ディーラーの勝ちです。';
  } else {
    ties += 1;
    messageEl.textContent = '引き分けです。';
  }

  renderScoreboard();
  updateButtons();
}

newGameBtn.addEventListener('click', startGame);
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);

updateButtons();
updateScore();
renderScoreboard();
