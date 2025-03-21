let circles;
let img;
let originalPositions = [];
let positions = [];
let scaleFactor;
let baseWidth, baseHeight;

function preload() {
  img = loadImage('https://raw.githubusercontent.com/kitsunehai/soil-particles-p5js/main/assets/gc1.png');
}

function setup() {
  baseWidth = img.width;
  baseHeight = img.height;
  calculateCanvasSize();

  pixelDensity(1);
  img.loadPixels();
  circles = [];

  // Store original positions from white pixels
  originalPositions = findPositions(img, 255, 255, 255);
  scalePositions(); // scale according to canvas size
}

function draw() {
  background(245, 245, 220);

  // Draw waves (scaled)
  fill(0, 255, 255);
  noStroke();
  beginShape();
  vertex(0, height / 2);
  for (let x = 0; x <= width; x += 10) {
    let y = height - frameCount * 0.5 + 20 * sin(TWO_PI * x / 10 + frameCount * 0.1);
    vertex(x, y);
  }
  vertex(width, height / 2);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  let total = 6;
  let count = 0;
  let attempts = 0;

  while (count < total) {
    let newC = newCircle();
    if (newC !== null) {
      circles.push(newC);
      count++;
    }
    attempts++;
    if (attempts > 100) {
      noLoop();
      break;
    }
  }

  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];

    if (!circle.growing) {
      circle.show();
      circle.grow();
      continue;
    }

    if (circle.edges()) {
      circle.growing = false;
    } else {
      for (let j = 0; j < circles.length; j++) {
        let other = circles[j];
        if (circle !== other) {
          let d = dist(circle.x, circle.y, other.x, other.y);
          let distance = circle.r + other.r;

          if (d < distance) {
            circle.growing = false;
            break;
          }
        }
      }
    }

    circle.show();
    circle.grow();
  }
}

function calculateCanvasSize() {
  let w = windowWidth;
  let h = windowHeight;
  let aspectRatio = baseWidth / baseHeight;

  if (w / h > aspectRatio) {
    scaleFactor = h / baseHeight;
  } else {
    scaleFactor = w / baseWidth;
  }

  createCanvas(baseWidth * scaleFactor, baseHeight * scaleFactor);
}

function scalePositions() {
  positions = originalPositions.map(pos => ({
    x: pos.x * scaleFactor,
    y: pos.y * scaleFactor
  }));
}

function newCircle() {
  if (positions.length === 0) {
    return null;
  }

  let pos = random(positions);
  let x = pos.x;
  let y = pos.y;

  let valid = true;
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    let d = dist(x, y, circle.x, circle.y);
    if (d < circle.r) {
      valid = false;
      break;
    }
  }

  if (valid) {
    let c = color(random(255), random(255), random(0, 150));
    return new Circle(x, y, c, random(2, 6) * scaleFactor);
  } else {
    return null;
  }
}

function findPositions(img, r, g, b) {
  let pos = [];
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let red = img.pixels[index];
      let green = img.pixels[index + 1];
      let blue = img.pixels[index + 2];
      if (red === r && green === g && blue === b) {
        pos.push({ x: x, y: y });
      }
    }
  }
  return pos;
}

function windowResized() {
  calculateCanvasSize();
  scalePositions();
  // Clear circles to restart with new dimensions
  circles = [];
}

class Circle {
  constructor(x, y, col, r = 1) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;
    this.growing = true;
  }

  grow() {
    if (this.growing) {
      this.r += 0.5 * scaleFactor;
    }
  }

  edges() {
    return (
      this.x + this.r > width ||
      this.x - this.r < 0 ||
      this.y + this.r > height ||
      this.y - this.r < 0
    );
  }

  show() {
    stroke(0);
    fill(this.col);
    ellipse(this.x, this.y, this.r * 2);
  }
}
