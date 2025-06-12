export function moveCursorNextCharacter(cursorState) {
  cursorState.charIndex++;
  cursorState.totalIndex++;
}

export function moveCursorPreviousCharacter(cursorState, words) {
  if (cursorState.wordIndex === 0 && cursorState.charIndex === 0) return;

  if (cursorState.charIndex === 0) {
    cursorState.wordIndex--;
    cursorState.totalIndex--;
    cursorState.charIndex = words.children[cursorState.wordIndex].children.length;
    return;
  }

  cursorState.totalIndex--;
  cursorState.charIndex--;
}

export function jumpCursorToNextWord(cursorState, words) {
  if (cursorState.charIndex === 0) return;

  const currentLetter = words.children[cursorState.wordIndex].children[cursorState.charIndex];
  if (currentLetter !== undefined) {
    cursorState.incorrectCharacters++;
  }

  cursorState.wordIndex++;
  cursorState.totalIndex++;
  cursorState.charIndex = 0;
}

export function jumpCursorAtWordStart(cursorState, words) {
  if (cursorState.wordIndex === 0 && cursorState.charIndex === 0) return;

  if (cursorState.charIndex !== 0) {
    cursorState.totalIndex -= words.children[cursorState.wordIndex].children.length;
    cursorState.charIndex = 0;
    return;
  }

  cursorState.wordIndex--;
  cursorState.charIndex = 0;
}

export function increaseIncorrectCharacters(cursorState, words) {
  const letter = words.children[cursorState.wordIndex].children[cursorState.charIndex - 1];
  if (letter.classList.contains("wrong")) {
    cursorState.incorrectCharacters++;
  }
}

export function setCurrentLineIndex(cursorState, listOfWords, setLastIndex = false, allowDecreaseOnLastIndex = false) {
  const newLineIndex = listOfWords[cursorState.wordIndex].lineIndex;
  cursorState.lineIndex = newLineIndex;
  if (setLastIndex && allowDecreaseOnLastIndex) {
    cursorState.lastLineIndex = newLineIndex;
    return;
  }
  if (setLastIndex && newLineIndex > cursorState.lastLineIndex) {
    cursorState.lastLineIndex = newLineIndex;
  }
}

export function isCursorInsideBoundary(cursorState, listOfWords, words) {
  const curretWord = words.children[cursorState.wordIndex];
  const cursorOffset = cursorState.lastLineIndex - cursorState.lineIndex;
  const previousLineIndex = cursorState.lastLineIndex - 1;
  const firstWordLine = listOfWords.find((wordObj) => wordObj.lineIndex === cursorState.lineIndex)?.word || null;
  const firstWordOfPreviousLine = listOfWords.find((wordObj) => wordObj.lineIndex === previousLineIndex)?.word || null;

  if (firstWordLine === null || firstWordOfPreviousLine === null) {
    return true;
  }

  if (cursorOffset < 2 && cursorState.charIndex === 0 && curretWord === firstWordOfPreviousLine) {
    return false;
  }

  return true;
}

let currentLineWidth = 0;

export function simulateWordsFromSpace(cursorState, listOfWords, wordsElement, hardSimulation = false) {
  const wordsParentWidth = wordsElement.parentElement.getBoundingClientRect().width;
  const words = wordsElement.children;
  const wordsLength = words.length;

  const startIndex = hardSimulation ? 0 : listOfWords.length;

  if (hardSimulation) {
    listOfWords.length = 0;
    cursorState.numberOfLines = 0;
    currentLineWidth = 0;
  }

  let currentLineIndex = cursorState.numberOfLines;

  for (let i = startIndex; i < wordsLength; i++) {
    const word = words[i];
    const wordRect = word.getBoundingClientRect();
    const willFit = currentLineWidth + wordRect.width < wordsParentWidth;

    if (willFit) {
      currentLineWidth += wordRect.width;
    } else {
      currentLineIndex++;
      currentLineWidth = wordRect.width;
    }

    listOfWords.push({ lineIndex: currentLineIndex, word });
  }

  cursorState.numberOfLines = currentLineIndex;
}
