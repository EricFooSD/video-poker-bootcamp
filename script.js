﻿/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
// .....................................
// GLOBAL VARIABLES
// .....................................

let deck;
let playerHand = [];

// .... to identify which cards user select .... //
// 0 = not selected
// 1 = selected
let selectedHand = [0, 0, 0, 0, 0];
let arrangedHand = [];
let points = 100;

// .... GAME MODES .... //
const GAME_INFO_MODE = 'Game Info Mode';
const DEAL_CARD_MODE = 'Deal Card Mode';
const SWAP_CARD_MODE = 'Swap Card Mode';
let currentGameMode = GAME_INFO_MODE;
let cardNameTally = {};
let musicOn = false;

// .... Payout table values .... //
const payTable = [
  { combo: 'Royal Flush', image: './images/ROYAL_FLUSH.png', points: 250 },
  { combo: 'Straight Flush', image: './images/STRAIGHT_FLUSH.png', points: 50 },
  { combo: 'Four of a Kind', image: './images/FOUR_OF_A_KIND.png', points: 25 },
  { combo: 'Full House', image: './images/FULL_HOUSE.png', points: 9 },
  { combo: 'Flush', image: './images/FLUSH.png', points: 6 },
  { combo: 'Straight', image: './images/STRAIGHT.png', points: 4 },
  {
    combo: 'Three of a Kind',
    image: './images/THREE_OF_A_KIND.png',
    points: 3,
  },
  { combo: 'Two Pairs', image: './images/TWO_PAIR.png', points: 2 },
  { combo: 'One Pair', image: './images/ONE_PAIR.png', points: 1 },
  { combo: 'Empty', image: './images/EMPTY.png', points: -1 },
];

// .....................................
// DEFINING SOUND VARIABLES
// .....................................

const openCardSound = new Audio('./sounds/cardPlace4.wav');
const swapCardSound = new Audio('./sounds/cardSlide7.wav');
const selectCardSound = new Audio('./sounds/cardPlace1.wav');
const rejectSound = new Audio('./sounds/reject.wav');
const backgroundSound = new Audio('./sounds/Harmonies.mp3');
backgroundSound.volume = 0.2;
backgroundSound.loop = true;

// .....................................
// HELPER FUNCTIONS
// .....................................

/**
 * @desc to get DOM element by ID
 * @param {string} a ID of DOM element
 */
const getElement = (a) => document.getElementById(`${a}`);

/**
 * @desc when called function will toggle global variable musicOn
 */
const playMusic = () => {
  if (musicOn === false) {
    backgroundSound.play();
    musicOn = true;
    getElement('music').src = './images/music.png';
  } else if (musicOn === true) {
    backgroundSound.pause();
    musicOn = false;
    getElement('music').src = './images/musicOff.png';
  }
};

/**
 * @desc to create a new deck of poker cards
 * @returns an array of 52 card objecs
 * @example of 1 card object {
  suitSymbol: '♣️', suit: 'clubs', name: 'Ace', displayName: 'A', colour: 'black', rank: 14, }
 */
const makeDeck = () => {
  // Initialise an empty deck array
  const newDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];

    // Loop from 1 to 13 to create all cards for a given suit
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      if (cardName === '1') {
        cardName = 'Ace';
      } else if (cardName === '11') {
        cardName = 'Jack';
      } else if (cardName === '12') {
        cardName = 'Queen';
      } else if (cardName === '13') {
        cardName = 'King';
      }
      let icon = suitIndex;
      if (suitIndex === 0) {
        icon = '♥️';
      } else if (suitIndex === 1) {
        icon = '♦️';
      } else if (suitIndex === 2) {
        icon = '♣️';
      } else if (suitIndex === 3) {
        icon = '♠️';
      }

      let cardDisplayName = `${rankCounter}`;
      if (cardDisplayName === '1') {
        cardDisplayName = 'A';
      } else if (cardDisplayName === '11') {
        cardDisplayName = 'J';
      } else if (cardDisplayName === '12') {
        cardDisplayName = 'Q';
      } else if (cardDisplayName === '13') {
        cardDisplayName = 'K';
      }

      let cardColor = suitIndex;
      if (suitIndex === 0 || suitIndex === 1) {
        cardColor = 'red';
      } else {
        cardColor = 'black';
      }

      let trueRank = rankCounter;
      if (trueRank === 1) {
        trueRank = 14;
      }

      const card = {
        suitSymbol: icon,
        suit: currentSuit,
        name: cardName,
        displayName: cardDisplayName,
        colour: cardColor,
        rank: trueRank,
      };

      // Add the new card to the deck
      newDeck.push(card);
    }
  }

  // Return the completed card deck
  return newDeck;
};

/**
 * @desc generates a random whole number from 0
 * @param {Integer} max The maximum possible number to be generated
 */
const getRandomIndex = (max) => Math.floor(Math.random() * max);

/**
 * @desc function to shuffle a deck of cards
 * @param {array} cards is an array of card objects
 * @returns the shuffled deck
 */
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

/**
 * @desc function to run through the player's hand and display in UI
 * @param {array} array is player's hand which is an array of 5 card objects
 * @returns display the Name and Suit image with for each of the card in Player's Hand
 */
const createCard = (array) => {
  for (let i = 0; i < 5; i += 1) {
    getElement(`card${i}name`).innerHTML = array[i].displayName;
    if (array[i].suit === 'clubs') {
      getElement(`card${i}suit`).src = './images/1clubs.png';
    }
    if (array[i].suit === 'hearts') {
      getElement(`card${i}suit`).src = './images/1hearts.png';
    }
    if (array[i].suit === 'spades') {
      getElement(`card${i}suit`).src = './images/1spades.png';
    }
    if (array[i].suit === 'diamonds') {
      getElement(`card${i}suit`).src = './images/1diamonds.png';
    }
    if (array[i].colour === 'red') {
      getElement(`card${i}name`).classList.remove('black');
      getElement(`card${i}name`).classList.add('red');
    } else {
      getElement(`card${i}name`).classList.remove('red');
      getElement(`card${i}name`).classList.add('black');
    }
  }
};

/**
 * @desc callback function to be triggered when user clicks to select a card to be swapped
 * @param {array} card card object
 * @param {Integer} i index of card in player's hand array
 * @returns red border in UI, changed global variable selectedHand
 */
const squareClick = (card, i) => {
  // validation check, if not play error sound and message
  if (currentGameMode === DEAL_CARD_MODE) {
    getElement('info').innerHTML = 'Deal your cards first';
    rejectSound.play();
  } else if (currentGameMode === SWAP_CARD_MODE) {
    // if to select, change the corresponding value in selectedHand array to 1(selected)
    const clickedCard = playerHand[i];
    if (selectedHand[i] === 0) {
      selectedHand[i] = 1;
      getElement(`card${i}`).classList.add('cardSelected');
    }

    // if un-select, change the corresponding value in selectedHand array to 0(not selected)
    else if (selectedHand[i] === 1) {
      selectedHand[i] = 0;
      getElement(`card${i}`).classList.remove('cardSelected');
    }
    selectCardSound.play();
    return clickedCard;
  }
};

/**
 * @desc function to calculate the combination of player's hand based various payout conditions
 * @returns wonCondition as an object in payout table array
 */
const calcHandScore = () => {
  // set wonCondition to empty hand by default
  let wonCondition = payTable[9];
  // if functions to check if each boolean is true
  if (isOnePair()) {
    console.log('One Pair');
    wonCondition = payTable[8];
  }
  if (isTwoPair()) {
    console.log('Two Pairs');
    wonCondition = payTable[7];
  }
  if (isThreeOfAKind() && !isOnePair()) {
    console.log('Three of a Kind');
    wonCondition = payTable[6];
  }
  if (isStraight() && !isflush()) {
    console.log('Straight');
    wonCondition = payTable[5];
  }
  if (!isStraight() && isflush()) {
    console.log('Flush');
    wonCondition = payTable[4];
  }
  if (isThreeOfAKind() && isOnePair()) {
    console.log('Full House');
    wonCondition = payTable[3];
  }
  if (isFourOfAKind()) {
    console.log('Four of a Kind');
    wonCondition = payTable[2];
  }
  // to differentiate if it royal flush, check that last card is not a Ace
  if (isStraight() && isflush() && arrangedHand[4].rank !== 14) {
    console.log('Straight Flush');
    wonCondition = payTable[1];
  }
  if (isStraight() && isflush() && arrangedHand[4].rank === 14) {
    console.log('Royal Flush');
    wonCondition = payTable[0];
  }
  return wonCondition;
};

/**
 * @desc callback function to run out when user clicks on deal button
 * @returns reset some global variable, game state and render new player hand in UI
 */
const deal = () => {
  // validation check, if not play error sound and message
  if (currentGameMode === SWAP_CARD_MODE) {
    getElement('info').innerHTML = 'Select the cards to swap';
    rejectSound.play();
  }
  if (currentGameMode === DEAL_CARD_MODE) {
    deck = shuffleCards(makeDeck());
    // reset players hand
    playerHand = [];
    // pick 5 cards
    for (let i = 0; i < 5; i += 1) {
      playerHand.push(deck.pop());
    }
    // remove border in UI
    for (let i = 0; i < 5; i += 1) {
      getElement(`card${i}`).classList.remove('cardLocked');
    }
    // playerHand = FOUR_OF_A_KIND;
    // arrange cards from small to big
    playerHand.sort((a, b) => a.rank - b.rank);
    // display cards in UI with createCard function
    createCard(playerHand);
    // reset the selectedHand array
    selectedHand = [0, 0, 0, 0, 0];
    // reset cardNametally
    cardNameTally = {};
    currentGameMode = SWAP_CARD_MODE;
    openCardSound.play();
    getElement('info').innerHTML = 'Select the cards to swap';
    for (let i = 0; i < 5; i += 1) {
      getElement(`card${i}`).classList.remove('cardSelected');
    }
  }
};

/**
 * @desc callback function to run when user swaps cards
 * @returns display message and update points of user
 */
const swap = () => {
  // validation check, if not play error sound and message
  if (currentGameMode === DEAL_CARD_MODE) {
    getElement('info').innerHTML = 'Deal your cards first';
    rejectSound.play();
  }
  // iterate through the selectedHand array and change playerHand accordingly
  else if (currentGameMode === SWAP_CARD_MODE) {
    for (let i = 0; i < 5; i += 1) {
      if (selectedHand[i] === 1) {
        // splice out the card and insert in card from deck
        playerHand.splice(i, 1, deck.pop());
        getElement(`card${i}`).classList.remove('cardSelected');
      }
      for (let i = 0; i < 5; i += 1) {
        getElement(`card${i}`).classList.add('cardLocked');
      }
      currentGameMode = DEAL_CARD_MODE;
    }
    swapCardSound.play();
    createCard(playerHand);
    // tallyCards to faciliate calcHandScore
    tallyCards(playerHand);
    // create new variable winnings
    const winnings = calcHandScore();
    // pull combo points from key value
    points += winnings.points;
    getElement(
      'info',
    ).innerHTML = `Your Hand : ${winnings.combo} <br><br> Points : ${winnings.points}`;
    getElement('yourPoints').innerHTML = `Your Wallet: ${points}`;
  }
};

/**
 * @desc tally player's hand to help in checking payout
 * @param {array} hand player's current hand
 * @returns update global variable cardNameTally
 */
const tallyCards = (hand) => {
  for (let i = 0; i < hand.length; i += 1) {
    const cardName = hand[i].rank;
    // If we have seen the card name before, increment its count
    if (cardName in cardNameTally) {
      cardNameTally[cardName] += 1;
    }
    // Else, initialise count of this card name to 1
    else {
      cardNameTally[cardName] = 1;
    }
  }
};

// .....................................
// booleans to check the various card combinations
// .....................................

/**
 * @desc function to check if hand is a flush
 * @example all 5 cards have the same suit
 * @returns true or false
 */
const isflush = () => {
  // eslint-disable-next-line max-len
  if (
    playerHand[0].suit === playerHand[1].suit
    && playerHand[1].suit === playerHand[2].suit
    && playerHand[2].suit === playerHand[3].suit
    && playerHand[3].suit === playerHand[4].suit
  ) {
    return true;
  }
  return false;
};

/**
 * @desc function to check if hand has 1 pair
 * @example 2 of hearts, 2 of diamonds
 * @returns true or false
 */
const isOnePair = () => {
  let pair = 0;
  for (let i = 0; i < 15; i += 1) {
    if (cardNameTally[i] === 2) {
      pair += 1;
    }
  }
  if (pair === 1) {
    return true;
  }
  return false;
};

/**
 * @desc function to check if hand has 2 pairs
 * @example 4 of hearts, 4 of diamonds and 6 of spades, 6 of diamonds
 * @returns true or false
 */
const isTwoPair = () => {
  let pair = 0;
  for (let i = 0; i < 15; i += 1) {
    if (cardNameTally[i] === 2) {
      pair += 1;
    }
  }
  if (pair === 2) {
    return true;
  }
  return false;
};

/**
 * @desc function to check if hand has 3 of a kind
 * @example 2 of hearts, 2 of diamonds, 2 of spades
 * @returns true or false
 */
const isThreeOfAKind = () => {
  let triple = 0;
  for (let i = 0; i < 15; i += 1) {
    if (cardNameTally[i] === 3) {
      triple += 1;
    }
  }
  if (triple === 1) {
    return true;
  }
  return false;
};

/**
 * @desc function to check if hand has 4 of a kind
 * @example 4 cards with the same number
 * @returns true or false
 */
const isFourOfAKind = () => {
  let four = 0;
  for (let i = 0; i < 15; i += 1) {
    if (cardNameTally[i] === 4) {
      four += 1;
    }
  }
  if (four === 1) {
    return true;
  }
  return false;
};

/**
 * @desc function to check if hand is a straight
 * @example 3, 4, 5, 6, 7 or 9, 10, J, Q, K
 * @returns true or false
 */
const isStraight = () => {
  arrangedHand = playerHand;
  arrangedHand.sort((a, b) => a.rank - b.rank);
  let testCard = arrangedHand[0];
  let consecutive = 1;
  for (let i = 1; i < 5; i += 1) {
    // works for all cases + big straight [10, J , Q , K, A]
    if (arrangedHand[i].rank - testCard.rank === 1) {
      consecutive += 1;
      testCard = arrangedHand[i];
    }
  }
  // check if it is small straight [2, 3, 4, 5, A]
  if (
    arrangedHand[0].rank === 2
    && consecutive === 4
    && arrangedHand[4].rank === 14
  ) {
    consecutive += 1;
  }
  if (consecutive === 5) {
    return true;
  }
  return false;
};

/**
 * @desc function to start the game and change game mode
 */
const initGame = () => {
  startGame.innerHTML = '';
  buildBoard();
  currentGameMode = DEAL_CARD_MODE;
  playMusic();
};

// .....................................
// DOM FUNCTIONS
// .....................................

/**
 * @desc function to render HTML elements for video-poker game
 */
const buildBoard = () => {
  // start with an empty container
  const main = document.createElement('div');
  main.classList.add('main');
  main.setAttribute('id', 'main');
  document.body.appendChild(main);

  const header1 = document.createElement('h1');
  header1.innerHTML = 'Video Poker';
  main.appendChild(header1);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('board');
  main.appendChild(cardContainer);

  for (let i = 0; i < 5; i += 1) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('id', `card${i}`);

    const name = document.createElement('div');
    name.classList.add('name');
    name.setAttribute('id', `card${i}name`);

    const suit = document.createElement('img');
    suit.classList.add('suit');
    suit.setAttribute('id', `card${i}suit`);

    card.appendChild(name);
    card.appendChild(suit);
    cardContainer.appendChild(card);

    card.addEventListener('click', (event) => {
      squareClick(event.currentTarget, i);
    });
  }

  const controlsContainer = document.createElement('div');
  controlsContainer.classList.add('board');
  main.appendChild(controlsContainer);

  const dealButton = document.createElement('button');
  dealButton.classList.add('button-81');
  dealButton.innerHTML = 'Deal';
  controlsContainer.appendChild(dealButton);

  const swapButton = document.createElement('button');
  swapButton.classList.add('button-81');
  swapButton.innerHTML = 'Swap/Done';
  controlsContainer.appendChild(swapButton);

  const musicButton = document.createElement('img');
  musicButton.setAttribute('id', 'music');
  musicButton.src = './images/musicOff.png';
  controlsContainer.appendChild(musicButton);

  dealButton.addEventListener('click', deal);
  swapButton.addEventListener('click', swap);
  musicButton.addEventListener('click', playMusic);

  const messageContainer = document.createElement('div');
  messageContainer.classList.add('board');
  messageContainer.setAttribute('id', 'infoContainer');
  main.appendChild(messageContainer);

  const gameMessage = document.createElement('div');
  gameMessage.classList.add('info');
  gameMessage.classList.add('board');
  gameMessage.setAttribute('id', 'info');
  gameMessage.innerHTML = 'Your starting wallet is 100';
  messageContainer.appendChild(gameMessage);

  const pointsTracker = document.createElement('div');
  pointsTracker.classList.add('pointsContainer');
  main.appendChild(pointsTracker);

  const yourPoints = document.createElement('div');
  yourPoints.setAttribute('id', 'yourPoints');
  yourPoints.innerHTML = 'Your Wallet:    100';
  pointsTracker.appendChild(yourPoints);

  const header2 = document.createElement('h2');
  header2.innerHTML = 'Payout Table';
  main.appendChild(header2);

  const table = document.createElement('table');
  table.classList.add('rwd-table');
  main.appendChild(table);

  const tableBody = document.createElement('tbody');
  table.appendChild(tableBody);

  const row1 = document.createElement('tr');
  tableBody.appendChild(row1);

  const item1 = document.createElement('th');
  row1.appendChild(item1);
  item1.innerHTML = 'Name';

  const item2 = document.createElement('th');
  row1.appendChild(item2);
  item2.innerHTML = 'Example';

  const item3 = document.createElement('th');
  row1.appendChild(item3);
  item3.innerHTML = 'Payout';

  for (let i = 0; i < payTable.length; i += 1) {
    const row = document.createElement('tr');
    tableBody.appendChild(row);

    const col1 = document.createElement('td');
    row.appendChild(col1);
    col1.innerHTML = `${payTable[i].combo}`;

    const col2 = document.createElement('td');
    row.appendChild(col2);
    const img = document.createElement('img');
    img.classList.add('payoutExampleImg');
    img.src = `${payTable[i].image}`;
    col2.appendChild(img);

    const col3 = document.createElement('td');
    row.appendChild(col3);
    col3.innerHTML = `${payTable[i].points}`;
    col3.setAttribute('style', 'text-align: center');
  }
};

/**
 * @desc function to render HTML elements welcome page
 */
const buildIntro = () => {
  const startGame = document.createElement('div');
  startGame.setAttribute('id', 'startGame');
  document.body.appendChild(startGame);

  const header1 = document.createElement('h1');
  header1.innerHTML = 'Video Poker';
  startGame.appendChild(header1);

  const hello = document.createElement('div');
  hello.classList.add('welcome');
  hello.innerHTML = "Welcome to Eric's Video Poker";
  startGame.appendChild(hello);

  const housegif = document.createElement('div');
  housegif.setAttribute('style', 'text-align: center');
  startGame.appendChild(housegif);

  const gif = document.createElement('img');
  gif.setAttribute('id', 'whale');
  gif.src = './images/whale.gif';
  housegif.appendChild(gif);
  gif.addEventListener('click', initGame);

  const container = document.createElement('div');
  container.setAttribute('style', 'text-align: center');
  startGame.appendChild(container);

  const gamePlay = document.createElement('div');
  gamePlay.classList.add('gamePlay');
  gamePlay.innerHTML = `♤ You start with 100 points. <br><br>
♤ When you click the "Deal" button, you will be dealt a hand of 5 cards. <br><br>♤ You can choose any number of your cards to replace with new, random cards.<br><br>♤ Once the cards are swapped, you will be assigned a payout based on the resulting hand. <br><br>♤  Click on the Whale to start the game!`;
  container.appendChild(gamePlay);
};

buildIntro();
