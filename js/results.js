import { formatTimestamp } from "./helpers.js";

const ul = document.querySelector(".results section ul");
const tryAgain = document.querySelector(".results section>div>a");

const li = (WPM, rawWPM, accuracy, date) => `
  <li class="list-group-item">
    <div class="wpm-container">
      <div class="wpm"><span class="property">WPM</span><span class="number">${WPM}</span></div>
      <div class="raw-wpm"><span class="property">Raw WPM</span><span class="number">${rawWPM}</span></div>
      <div class="accuracy"><span class="property">Accuracy</span><span class="number">${accuracy}%</span></div>
    </div>
    <span class="date">${date}</span>
  </li>
`;

const emptyLi = () => `
  <li class="list-group-item">
    <div class="empty">
      <span>You didn't made any test yet.</span>
      <a href="/test">Make a test</a>
    </div>
  </li>
`;

const stats = JSON.parse(localStorage.getItem("typingStats"));

if (!stats || stats.length === 0) {
  ul.innerHTML = emptyLi();
  tryAgain.setAttribute("hidden", "");
} else {
  for (let i = stats.length - 1; i >= 0; i--) {
    const { wpm, rawWPM, accuracy, timestamp } = stats[i];
    ul.innerHTML += li(wpm, rawWPM, accuracy, formatTimestamp(timestamp));
  }
}
