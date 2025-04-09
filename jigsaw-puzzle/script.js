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
  createPieces();
  shufflePieces();
  draw();
};

function createPieces() {
  pieces = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      pieces.push({
        correctX: x,
        correctY: y,
        x: x * pieceWidth,
        y: y * pieceHeight,
        currentX: Math.random() * (canvas.width - pieceWidth),
        currentY: Math.random() * (canvas.height - pieceHeight),
        tab: {
          top: y > 0 ? -pieces[(y - 1) * cols + x].tab.bottom : Math.round(Math.random()) * 2 - 1,
          right: x < cols - 1 ? Math.round(Math.random()) * 2 - 1 : 0,
          bottom: y < rows - 1 ? Math.round(Math.random()) * 2 - 1 : 0,
          left: x > 0 ? -pieces[y * cols + (x - 1)].tab.right : Math.round(Math.random()) * 2 - 1,
        }
      });
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of pieces) {
    ctx.save();
    ctx.beginPath();
    drawCurvyPiecePath(p.currentX, p.currentY, p.tab);
    ctx.clip();
    ctx.drawImage(
      img,
      p.correctX * pieceWidth, p.correctY * pieceHeight,
      pieceWidth, pieceHeight,
      p.currentX, p.currentY,
      pieceWidth, pieceHeight
    );
    ctx.strokeStyle = '#444';
    ctx.stroke();
    ctx.restore();
  }
}

function drawCurvyPiecePath(x, y, tab) {
  const size = Math.min(pieceWidth, pieceHeight);
  const tabSize = size * 0.2;
  ctx.moveTo(x, y);
  drawSide(x, y, pieceWidth, 0, tab.top, 'horizontal');
  drawSide(x + pieceWidth, y, pieceHeight, 0, tab.right, 'vertical');
  drawSide(x + pieceWidth, y + pieceHeight, pieceWidth, 0, -tab.bottom, 'horizontal', true);
  drawSide(x, y + pieceHeight, pieceHeight, 0, -tab.left, 'vertical', true);
  ctx.closePath();
}

function drawSide(x, y, length, shift, tab, orientation, reverse = false) {
  const tabSize = length * 0.2;
  const mid = length / 2;
  ctx.lineTo(x, y);
  if (tab === 0) {
    if (orientation === 'horizontal') ctx.lineTo(x + length * (reverse ? -1 : 1), y);
    else ctx.lineTo(x, y + length * (reverse ? -1 : 1));
  } else {
    const dir = reverse ? -1 : 1;
    if (orientation === 'horizontal') {
      ctx.lineTo(x + mid - tabSize * dir, y);
      ctx.bezierCurveTo(x + mid - tabSize * 0.5 * dir, y - tabSize * tab, x + mid + tabSize * 0.5 * dir, y - tabSize * tab, x + mid + tabSize * dir, y);
      ctx.lineTo(x + length * dir, y);
    } else {
      ctx.lineTo(x, y + mid - tabSize * dir);
      ctx.bezierCurveTo(x - tabSize * tab, y + mid - tabSize * 0.5 * dir, x - tabSize * tab, y + mid + tabSize * 0.5 * dir, x, y + mid + tabSize * dir);
      ctx.lineTo(x, y + length * dir);
    }
  }
}

canvas.addEventListener('mousedown', (e) => {
  const mx = e.offsetX, my = e.offsetY;
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i];
    if (mx > p.currentX && mx < p.currentX + pieceWidth &&
        my > p.currentY && my < p.currentY + pieceHeight) {
      selectedPiece = p;
      offsetX = mx - p.currentX;
      offsetY = my - p.currentY;
      pieces.push(pieces.splice(i, 1)[0]); // bring to front
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (selectedPiece) {
    selectedPiece.currentX = e.offsetX - offsetX;
    selectedPiece.currentY = e.offsetY - offsetY;
    draw();
  }
});

canvas.addEventListener('mouseup', () => {
  if (selectedPiece) {
    const snapX = selectedPiece.correctX * pieceWidth;
    const snapY = selectedPiece.correctY * pieceHeight;
    const dx = selectedPiece.currentX - snapX;
    const dy = selectedPiece.currentY - snapY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 20) {
      selectedPiece.currentX = snapX;
      selectedPiece.currentY = snapY;
    }
    selectedPiece = null;
    draw();
    checkWin();
  }
});

function checkWin() {
  for (let p of pieces) {
    if (Math.abs(p.currentX - p.correctX * pieceWidth) > 1 ||
        Math.abs(p.currentY - p.correctY * pieceHeight) > 1) {
      return;
    }
  }
  document.getElementById('win-message').style.display = 'block';
}