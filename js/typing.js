import { simulateWordsFromSpace } from "./cursor.js";
import { getAccuracy, getCorrectWords, getRawWPM, getWPM } from "./helpers.js";
import { setInputHandlers, setInputListeners } from "./input.js";
import { generateNewWords, renderCursor, repositionInputElement } from "./render.js";

// Init data
const counter = document.querySelector("#counter");
const words = document.querySelector(".words");
const inputElement = document.querySelector("#typing-input");
const caretElement = document.querySelector("#caret");
const restartButton = document.querySelector("#restart-test");

const listOfWords = [];
const cursorState = {
  numberOfLines: 0,
  lineIndex: 0,
  lastLineIndex: 0,
  numberOfWords: 0,
  numberOfNewWords: 0,
  wordIndex: 0,
  charIndex: 0,
  totalIndex: 0,
  correctWords: 0,
  incorrectCharacters: 0,
};
const testState = {
  timeoutId: null,
  startTime: null,
  endTime: null,
  startTest: (_) => { },
  isRunning: false,
  isFinished: false,
};
const inputHandlers = {
  controlBackspace: (_) => { },
  metaBackspace: (_) => { },
  altBackspace: (_) => { },
  space: (_) => { },
  backspace: (_) => { },
  default: (_) => { },
};
const lastKey = {
  key: "",
  keyCode: "",
  ctrl: "",
  shift: "",
  alt: "",
};
const initialAmountOfWords = 150;
const increaseWordsBy = 150;

const res = await fetch("/words.json");
const data = await res.json();

// Setup the test
generateNewWords(data, initialAmountOfWords, cursorState, words);
repositionInputElement(words, inputElement);
simulateWordsFromSpace(cursorState, listOfWords, words, true);

// Set Input
setInputListeners(
  data,
  initialAmountOfWords,
  words,
  counter,
  inputElement,
  caretElement,
  restartButton,
  inputHandlers,
  listOfWords,
  cursorState,
  testState,
  lastKey,
);
setInputHandlers(data, inputHandlers, words, inputElement, listOfWords, cursorState, increaseWordsBy);

// Initial caret rendering - calls one time to position the caret
renderCursor(caretElement, cursorState, words);

// Logic when the test starts
testState.startTest = () => {
  displayCounter();

  testState.timeoutId = setTimeout(() => {
    testState.endTime = performance.now();
    testState.isFinished = true;
    inputElement.blur();
    cursorState.correctWords = getCorrectWords(words, cursorState.numberOfWords);

    const wpm = Math.round(getWPM(testState.endTime, testState.startTime, cursorState.correctWords));
    const rawWPM = Math.round(getRawWPM(testState.endTime, testState.startTime, cursorState.totalIndex));
    const accuracy = getAccuracy(cursorState.totalIndex, cursorState.incorrectCharacters);
    const stat = {
      wpm,
      rawWPM,
      accuracy,
      timestamp: Date.now(),
    };

    saveTypingStats(stat);
    window.location.href = `${window.location.origin}/results`;
  }, 60_000);
};

function saveTypingStats(stat) {
  const maxRecords = 10_000;
  const stats = JSON.parse(localStorage.getItem("typingStats") || "[]");

  if (stats.length >= maxRecords) {
    stats.shift();
  }

  stats.push(stat);
  localStorage.setItem("typingStats", JSON.stringify(stats));
}

async function displayCounter() {
  for (let i = 60; i > 0; i--) {
    if (testState.isRunning) {
      counter.innerText = i.toString();
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    } else {
      return;
    }
  }
  counter.innerText = "0";
}
