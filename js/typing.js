import { simulateWordsFromSpace } from "./cursor.js";
import {
  displayCounter,
  getAccuracy,
  getCorrectWords,
  getData,
  getRawWPM,
  getWPM,
  saveTypingStats,
} from "./helpers.js";
import { setInputHandlers, setInputListeners } from "./input.js";
import { generateNewWords, renderCursor, repositionInputElement } from "./render.js";
import { removeSkeleton, setSkeleton } from "./skeleton.js";

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

// Set some ui feedback
setSkeleton(words);

const data = await getData().finally(removeSkeleton);

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
