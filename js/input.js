import {
  increaseIncorrectCharacters,
  isCursorInsideBoundary,
  jumpCursorAtWordStart,
  jumpCursorToNextWord,
  moveCursorNextCharacter,
  moveCursorPreviousCharacter,
  setCurrentLineIndex,
  simulateWordsFromSpace,
} from "./cursor.js";
import { getCombo, restartTest } from "./helpers.js";
import {
  checkWordSpelling,
  generateNewWords,
  renderCursor,
  renderNewCharacter,
  renderOnDeleteCharacter,
  renderOnDeleteWord,
  renderWordsLineHeight,
  repositionInputElement,
} from "./render.js";

export function setInputListeners(
  data,
  wordsAmount,
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
) {
  words.addEventListener("click", () => {
    inputElement.focus();
    caretElement.classList.add("focus");
  });

  window.addEventListener("resize", () => {
    repositionInputElement(words, inputElement);
    simulateWordsFromSpace(cursorState, listOfWords, words, true);
    setCurrentLineIndex(cursorState, listOfWords, true, true);
    renderWordsLineHeight(cursorState, words);
    renderCursor(caretElement, cursorState, words);
  });

  inputElement.addEventListener("focus", () => {
    caretElement.classList.add("focus");
  });

  inputElement.addEventListener("blur", () => {
    caretElement.classList.remove("focus");
  });

  if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    inputElement.addEventListener("beforeinput", (event) => {
      if (event.inputType === "deleteContentBackward") {
        event.preventDefault();
        const handler = inputHandlers.backspace || inputHandlers.default;
        handler("backspace");

        renderCursor(caretElement, cursorState, words);
        checkWordSpelling(cursorState, words);
        return;
      }
    });

    inputElement.addEventListener("input", () => {
      const currentValue = inputElement.value;
      const lastChar = currentValue.slice(-1);

      let key = lastChar;
      if (lastChar === " ") {
        key = "space";
      }

      const handler = inputHandlers[key] || inputHandlers.default;
      handler(key);

      inputElement.value = "";

      if (!testState.isRunning && key.length === 1 && key !== " ") {
        testState.isRunning = true;
        testState.startTime = performance.now();
        testState.startTest();
      }

      renderCursor(caretElement, cursorState, words);
      checkWordSpelling(cursorState, words);
    });
  } else {
    inputElement.addEventListener("keydown", (event) => {
      lastKey.key = event.key;
      lastKey.keyCode = event.keyCode;
      lastKey.ctrl = event.ctrlKey;
      lastKey.shift = event.shiftKey;
      lastKey.alt = event.altKey;

      const combo = getCombo(event);
      const handler = inputHandlers[combo] || inputHandlers.default;

      handler(event.key);
      renderCursor(caretElement, cursorState, words);
      checkWordSpelling(cursorState, words);

      if (!testState.isRunning && event.key.length === 1 && event.key !== " ") {
        testState.isRunning = true;
        testState.startTime = performance.now();
        testState.startTest();
      }
    });
  }

  restartButton.addEventListener("click", () => {
    restartTest(cursorState, testState, listOfWords, words, counter, inputElement, () => {
      generateNewWords(data, wordsAmount, cursorState, words, true);
      repositionInputElement(words, inputElement);
      simulateWordsFromSpace(cursorState, listOfWords, words, true);
      setCurrentLineIndex(cursorState, listOfWords, true, true);
      renderWordsLineHeight(cursorState, words);
      renderCursor(caretElement, cursorState, words);
    });
  });
}

export function setInputHandlers(data, inputHandlers, words, inputElement, listOfWords, cursorState, increaseWordsBy) {
  inputHandlers.default = (value) => {
    if (value.length !== 1) return;

    moveCursorNextCharacter(cursorState);

    renderNewCharacter(value, cursorState, words);

    increaseIncorrectCharacters(cursorState, words);
  };

  inputHandlers.space = () => {
    jumpCursorToNextWord(cursorState, words);
    setCurrentLineIndex(cursorState, listOfWords, true);

    renderWordsLineHeight(cursorState, words);

    const wordsDistance = cursorState.numberOfWords * 0.5;
    if (cursorState.wordIndex >= wordsDistance) {
      generateNewWords(data, increaseWordsBy, cursorState, words, false);
      simulateWordsFromSpace(cursorState, listOfWords, words);
    }
  };

  inputHandlers.backspace = () => {
    if (isCursorInsideBoundary(cursorState, listOfWords, words)) {
      moveCursorPreviousCharacter(cursorState, words);
      setCurrentLineIndex(cursorState, listOfWords);

      renderOnDeleteCharacter(cursorState, words);
    }
  };

  inputHandlers.altBackspace = () => {
    if (isCursorInsideBoundary(cursorState, listOfWords, words)) {
      jumpCursorAtWordStart(cursorState, words);

      renderOnDeleteWord(cursorState, words, inputElement);
    }
  };

  inputHandlers.controlBackspace = inputHandlers.altBackspace;

  inputHandlers.metaBackspace = inputHandlers.altBackspace;
}
