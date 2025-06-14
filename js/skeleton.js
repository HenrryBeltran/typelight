export function setSkeleton(words) {
  const skeleton = () => `
    <div id="skeleton" style="position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-wrap: wrap; gap: 0.875rem; padding: 0.5rem 0.5rem 0;">
      ${getWords(100)}
    </div>
  `;

  words.innerHTML += skeleton();
}

export function removeSkeleton() {
  document.querySelector("#skeleton").remove();
}

function getWords(n) {
  let words = "";
  for (let i = 0; i < n; i++) {
    words += `
      <div style="background-color: var(--color-neutral-200); width: ${getWidth()}px; height: 28px; border-radius: 999px; animation: var(--animate-pulse)"></div>
    `;
  }
  return words;
}

function getWidth() {
  return Math.floor(Math.random() * (120 - 48 + 1)) + 48;
}
