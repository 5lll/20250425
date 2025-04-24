let speedMod = 1;
let draggedLava = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let darkMode = false;
let lavas = [];
let blue, black;

class Lava {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.d = r * 2;
    this.maxSize = this.d * 2;
    this.xSpeed = random(-0.5, 0.5);
    this.ySpeed = random(-0.5, -2);
    this.res = r < 25 ? 5 : 8;
    this.resF = this.res + 2;
    this.offsets = Array.from({ length: this.res }, () => random(-5, 5));
    this.noiseOffsets = Array.from({ length: this.res }, () => random(1000));
    this.layer = round(random(1, 4));
    this.dragging = false; // 是否正在被拖曳
    this.hovered = false; // 滑鼠是否在圖案上
  }

  move() {
    if (!this.dragging) {
      this.x += this.xSpeed;
      this.y += this.ySpeed * speedMod;
      if (this.y < -this.maxSize) {
        this.x = random(width);
        this.y = height + this.d;
      }
    }

    for (let i = 0; i < this.offsets.length; i++) {
      this.offsets[i] = map(noise(this.noiseOffsets[i]), 0, 1, 0, this.d);
      this.noiseOffsets[i] += this.hovered ? 0.025 : 0.005;
    }
  }

  show() {
    push();
    fill(color(189, 224, 254, 128)); // 設定移動物品顏色為 #bde0fe 並加入透明度 128

    if (this.hovered) strokeWeight(2);
    else strokeWeight(1);

    translate(this.x, this.y);

    beginShape();
    for (let i = 0; i <= this.resF; i++) {
      let rad = (i * TAU) / this.res;
      let r = this.r + this.offsets[i % this.offsets.length];
      curveVertex(r * cos(rad), r * sin(rad));
    }
    endShape();

    pop();
  }

  isMouseOver() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.r;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 指定畫布大小
  let amount = floor(width / 40);
  for (let i = 0; i < amount; i++) {
    let l = new Lava(random(width), random(height), random(10, 100));
    lavas.push(l);
  }
  blue = color(183, 235, 255, 64);
  black = color(0, 64);
}

function draw() {
  background(color('#ffcad4')); // 設定背景顏色為 #ffcad4

  for (let l of lavas) {
    l.hovered = l.isMouseOver();
    l.move();
    l.show();
  }
}

function mousePressed() {
  for (let l of lavas) {
    if (l.isMouseOver()) {
      draggedLava = l;
      draggedLava.dragging = true;
      dragOffsetX = mouseX - l.x;
      dragOffsetY = mouseY - l.y;
      break;
    }
  }
}

function mouseDragged() {
  if (draggedLava) {
    draggedLava.x = mouseX - dragOffsetX;
    draggedLava.y = mouseY - dragOffsetY;
  }
}

function mouseReleased() {
  if (draggedLava) {
    draggedLava.dragging = false;
    draggedLava = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 更新畫布大小
}