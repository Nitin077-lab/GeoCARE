
let circles;
let img;
positions = [];

function preload() {
  img = loadImage('https://raw.githubusercontent.com/kitsunehai/soil-particles-p5js/main/assets/gc1.png');
}

function setup() {
  // createCanvas(1640, 1160);
  createCanvas(img.width, img.height);
  var density = displayDensity();
  pixelDensity(1);
  img.loadPixels();
  circles = [];

  console.log(img.width);
  console.log(img.height);
  console.log('pixels', img.pixels.length);
  console.log(density);

  positions = findPositions(img, 255, 255, 255);
  console.log('Positions:', positions);
}

function draw() {
  background(245, 245, 220);

  // Fill the lower half with cyan color
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

  // frameRate(20);

  let total = 50;
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
      console.log('finished');
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
    }
    else {
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

function newCircle() {

  console.log('positions size', positions.length);
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
      console.log('invalid');
      valid = false;
      break;
    }
  }

  if (valid) {
    var c = color(random(255), random(255), random(0, 150));
    console.log('color', c);
    return new Circle(x, y, c);
  } else {
    return null;
  }
}

function findPositions(img, r, g, b) {
  let positions = [];
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let red = img.pixels[index];
      let green = img.pixels[index + 1];
      let blue = img.pixels[index + 2];
      if (red === r && green === g && blue === b) {
        positions.push({ x: x, y: y });
      }
    }
  }
  return positions;
}
