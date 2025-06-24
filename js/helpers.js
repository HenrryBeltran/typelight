export async function getData() {
  const res = await fetch("/words.json");
  return await res.json();
}

export function saveTypingStats(stat) {
  const maxRecords = 10_000;
  const stats = JSON.parse(localStorage.getItem("typingStats") || "[]");

  if (stats.length >= maxRecords) {
    stats.shift();
  }

  stats.push(stat);
  localStorage.setItem("typingStats", JSON.stringify(stats));
}

export async function displayCounter(testState, counter) {
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

export function restartTest(cursorState, testState, listOfWords, words, counter, inputElement, generateNewWords) {
  testState.timeoutId = null;
  testState.startTime = null;
  testState.endTime = null;
  testState.isRunning = false;
  testState.isFinished = false;

  cursorState.numberOfLines = 0;
  cursorState.lineIndex = 0;
  cursorState.lastLineIndex = 0;
  cursorState.numberOfWords = 0;
  cursorState.numberOfNewWords = 0;
  cursorState.wordIndex = 0;
  cursorState.charIndex = 0;
  cursorState.totalIndex = 0;
  cursorState.correctWords = 0;
  cursorState.incorrectCharacters = 0;

  listOfWords.length = 0;
  words.innerHTML = "";
  counter.innerText = "60";
  inputElement.focus();

  generateNewWords();
}

export function getWPM(endTime, startTime, correctWords) {
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;
  return (correctWords / elapsedTimeInSeconds) * 60;
}

export function getRawWPM(endTime, startTime, totalIndex) {
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;
  return totalIndex / 5 / (elapsedTimeInSeconds / 60);
}

export function getAccuracy(totalIndex, incorrectCharacters) {
  const correctCharacters = totalIndex - incorrectCharacters;
  const accuracy = (correctCharacters / totalIndex) * 100;
  return accuracy.toFixed(2);
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const options = {
    month: "short",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);

  const map = {};
  for (let i = 0; i < parts.length; i++) {
    map[parts[i].type] = parts[i].value;
  }

  return `${map.month} ${map.day}, ${map.weekday} - ${map.hour}:${map.minute}`;
}

export function getCombo(event) {
  let combo = "";

  if (event.ctrlKey) combo += "control";
  if (event.metaKey) combo += "meta";
  if (event.shiftKey) combo += "shift";
  if (event.altKey) combo += "alt";
  if (event.key === "ArrowLeft") event.preventDefault();
  if (event.key === "ArrowRight") event.preventDefault();
  if (event.key === "Backspace") {
    if (combo.length > 1) {
      event.preventDefault();
      return combo + "Backspace";
    }
    return combo + "backspace";
  }
  if (event.key === " ") {
    event.preventDefault();
    return "space";
  }

  return combo + event.key;
}

export function getCorrectWords(words, wordsLength) {
  let correctWords = 0;
  for (let i = 0; i < wordsLength; i++) {
    const word = words.children[i];
    const classes = word.classList;
    if (classes.contains("completed") && !classes.contains("wrong")) {
      correctWords++;
    }
  }
  return correctWords;
}

// Timestamp formatter - DEBUGGING PORPOSES
export function formatClockTimeFromPerf(perfNow) {
  const baseTime = Date.now();
  const estimatedTime = new Date(baseTime - performance.now() + perfNow);

  const hours = String(estimatedTime.getHours()).padStart(2, "0");
  const minutes = String(estimatedTime.getMinutes()).padStart(2, "0");
  const seconds = String(estimatedTime.getSeconds()).padStart(2, "0");
  const millis = String(estimatedTime.getMilliseconds()).padStart(3, "0");

  return `${hours}:${minutes}:${seconds}.${millis}`;
}
