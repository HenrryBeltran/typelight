export function renderCursor(caretElement, cursorState, words) {
  const currentWord = words.children[cursorState.wordIndex];
  const currentLetterElement = currentWord.children[cursorState.charIndex];
  const wordsParentRect = words.parentElement.getBoundingClientRect();

  if (!currentLetterElement) {
    const previousLetterElement = currentWord.children[cursorState.charIndex - 1];

    if (!previousLetterElement) return;
    const prevRect = previousLetterElement.getBoundingClientRect();
    caretElement.style.transform = `translate(${prevRect.x + prevRect.width - wordsParentRect.x}px, ${prevRect.y - wordsParentRect.y}px)`;
    return;
  }

  const rect = currentLetterElement.getBoundingClientRect();
  caretElement.style.transform = `translate(${rect.x - wordsParentRect.x}px, ${rect.y - wordsParentRect.y}px)`;

  if (cursorState.totalIndex === 1) {
    caretElement.classList.add("typing");
  }
}

export function renderNewCharacter(value, cursorState, words) {
  const currentWord = words.children[cursorState.wordIndex];
  const previousLetterElement = currentWord.children[cursorState.charIndex - 1];

  if (previousLetterElement) {
    if (previousLetterElement.textContent === value) {
      previousLetterElement.classList.add("typed");
      if (cursorState.charIndex === currentWord.children.length) {
        currentWord.classList.add("completed");
      }
    } else {
      previousLetterElement.classList.add("wrong");
      currentWord.classList.add("wrong");
    }
  } else {
    const newLetterElement = document.createElement("letter");
    newLetterElement.innerText = value;
    newLetterElement.classList.add("extra", "wrong");
    currentWord.classList.add("wrong");

    currentWord.appendChild(newLetterElement);
  }
}

export function renderOnDeleteCharacter(cursorState, words) {
  const currentWord = words.children[cursorState.wordIndex];
  const letterElement = currentWord.children[cursorState.charIndex];
  if (!letterElement) return;

  if (letterElement.classList.contains("extra")) {
    letterElement.remove();
    return;
  }
  currentWord.classList.remove("completed");
  letterElement.classList.remove("typed", "wrong");
}

export function renderOnDeleteWord(cursorState, words, inputElement) {
  const currentWord = words.children[cursorState.wordIndex];
  const lastWordLength = inputElement.value.length - currentWord.children.length;
  inputElement.value = inputElement.value.slice(0, lastWordLength); // Delete word, new behaviour

  const letters = words.children[cursorState.wordIndex].children;

  for (let i = letters.length - 1; i >= 0; i--) {
    const letterElement = letters[i];
    if (letterElement.classList.contains("extra")) {
      letterElement.remove();
      continue;
    }
    letterElement.classList.remove("typed", "wrong");
  }
}

export function checkWordSpelling(cursorState, words) {
  const currentWord = words.children[cursorState.wordIndex];
  const letters = currentWord.children;
  const lettersLength = letters.length;
  let hasWrong = false;

  for (let i = 0; i < lettersLength; i++) {
    if (letters[i].classList.contains("wrong")) {
      hasWrong = true;
      break;
    }
  }

  if (!hasWrong) {
    currentWord.classList.remove("wrong");
  }
}

export function renderWordsLineHeight(cursorState, words) {
  const wordHeight = words.children[0].getBoundingClientRect().height;

  if (cursorState.lastLineIndex > 1) {
    words.style.transform = `translateY(-${wordHeight * (cursorState.lastLineIndex - 1)}px)`;
  }
}

export function repositionInputElement(words, inputElement) {
  const wordsRect = words.getBoundingClientRect();
  inputElement.style.transform = `translate(${wordsRect.x}px, ${wordsRect.y}px)`;
}

export function generateNewWords(data, wordsAmount, cursorState, words, isInitial = true) {
  for (let i = 0; i < wordsAmount; i++) {
    const randomIndex = Math.floor(Math.random() * 250);
    const word = data[randomIndex];
    const newWordElement = document.createElement("div");
    newWordElement.classList.add("word");
    const letters = word.split("");
    const lettersLength = letters.length;

    for (let j = 0; j < lettersLength; j++) {
      const letter = letters[j];
      const letterElement = document.createElement("letter");
      letterElement.innerText = letter;
      newWordElement.append(letterElement);
    }

    cursorState.numberOfWords++;
    words.append(newWordElement);
  }

  if (!isInitial) {
    cursorState.numberOfNewWords += wordsAmount;
  }
}

export function removeSkeleton() {
  document.querySelector("#skeleton").remove();
}
