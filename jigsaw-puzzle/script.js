const canvas = document.getElementById('puzzle');
const ctx = canvas.getContext('2d');

const rows = 4;
const cols = 4;
const pieceSize = canvas.width / cols;

let pieces = [];
let shuffledPieces = [];
let img = new Image();
img.src = 'puzzle-image.png';

img.onload = () => {
  createPieces();
  shufflePieces();
  drawPuzzle();
  canvas.addEventListener('click', handleClick);
};

function createPieces() {
  pieces = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      pieces.push({ x, y, correctX: x, correctY: y });
    }
  }
}

function shufflePieces() {
  shuffledPieces = [...pieces];
  for (let i = shuffledPieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPieces[i], shuffledPieces[j]] = [shuffledPieces[j], shuffledPieces[i]];
  }
}

function drawPuzzle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shuffledPieces.forEach((piece, i) => {
    const dx = (i % cols) * pieceSize;
    const dy = Math.floor(i / cols) * pieceSize;
    ctx.drawImage(
      img,
      piece.x * pieceSize, piece.y * pieceSize, pieceSize, pieceSize,
      dx, dy, pieceSize, pieceSize
    );
  });
}

let firstClick = null;

function handleClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pieceSize);
  const y = Math.floor((e.clientY - rect.top) / pieceSize);
  const index = y * cols + x;

  if (firstClick === null) {
    firstClick = index;
  } else {
    [shuffledPieces[firstClick], shuffledPieces[index]] = [shuffledPieces[index], shuffledPieces[firstClick]];
    firstClick = null;
    drawPuzzle();
    checkWin();
  }
}

function checkWin() {
  for (let i = 0; i < shuffledPieces.length; i++) {
    const correct = pieces[i];
    const current = shuffledPieces[i];
    if (correct.x !== current.x || correct.y !== current.y) return;
  }
  document.getElementById('win-message').style.display = 'block';
}