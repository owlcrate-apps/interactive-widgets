const canvas = document.getElementById('puzzleCanvas');
const ctx = canvas.getContext('2d');

const rows = 4, cols = 4;
const pieceWidth = canvas.width / cols;
const pieceHeight = canvas.height / rows;

let pieces = [];
let selectedPiece = null;
let offsetX, offsetY;
let img = new Image();
img.src = 'puzzle-image.png';

img.onload = () => {
  initPuzzle();
  draw();
};

function initPuzzle() {
  pieces = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      pieces.push({
        correctX: x,
        correctY: y,
        x: Math.random() * (canvas.width - pieceWidth),
        y: Math.random() * (canvas.height - pieceHeight),
        edgeOffset: {
          top: Math.random() * 10 - 5,
          right: Math.random() * 10 - 5,
          bottom: Math.random() * 10 - 5,
          left: Math.random() * 10 - 5
        }
      });
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let piece of pieces) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(piece.x, piece.y, pieceWidth, pieceHeight);
    ctx.clip();
    ctx.drawImage(
      img,
      piece.correctX * pieceWidth, piece.correctY * pieceHeight,
      pieceWidth, pieceHeight,
      piece.x, piece.y,
      pieceWidth, pieceHeight
    );
    ctx.strokeStyle = '#333';
    ctx.strokeRect(piece.x, piece.y, pieceWidth, pieceHeight);
    ctx.restore();
  }
}

canvas.addEventListener('mousedown', (e) => {
  const mouseX = e.offsetX, mouseY = e.offsetY;
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i];
    if (mouseX > p.x && mouseX < p.x + pieceWidth &&
        mouseY > p.y && mouseY < p.y + pieceHeight) {
      selectedPiece = p;
      offsetX = mouseX - p.x;
      offsetY = mouseY - p.y;
      pieces.push(pieces.splice(i, 1)[0]); // bring to top
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (selectedPiece) {
    selectedPiece.x = e.offsetX - offsetX;
    selectedPiece.y = e.offsetY - offsetY;
    draw();
  }
});

canvas.addEventListener('mouseup', () => {
  if (selectedPiece) {
    const snapX = selectedPiece.correctX * pieceWidth;
    const snapY = selectedPiece.correctY * pieceHeight;
    const dx = selectedPiece.x - snapX;
    const dy = selectedPiece.y - snapY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 20) {
      selectedPiece.x = snapX;
      selectedPiece.y = snapY;
    }
    selectedPiece = null;
    draw();
    checkWin();
  }
});

function checkWin() {
  for (let p of pieces) {
    if (Math.abs(p.x - p.correctX * pieceWidth) > 1 ||
        Math.abs(p.y - p.correctY * pieceHeight) > 1) {
      return;
    }
  }
  document.getElementById('win-message').style.display = 'block';
}