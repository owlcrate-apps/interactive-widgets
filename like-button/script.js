const countEl = document.getElementById('like-count');
const button = document.getElementById('like-button');

let count = parseInt(localStorage.getItem('like-count') || '0');
countEl.textContent = count;

button.addEventListener('click', () => {
  count++;
  localStorage.setItem('like-count', count);
  countEl.textContent = count;
});