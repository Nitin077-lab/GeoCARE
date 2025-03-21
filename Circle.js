
function Circle(x, y, color) {
    this.x = x;
    this.y = y;
    this.r = 1;
    this.growing = true;
    // this.color = color(random(255), random(255), random(255), 180);
    this.color = color;

    this.grow = function () {
        if (this.growing) {
            this.r += 1;
        }
    };

    this.show = function () {
        stroke(0);
        // noFill();
        fill(this.color);
        strokeWeight(1);
        // noStroke();
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    };

    this.edges = function () {
        return (
            this.x + this.r >= width ||
            this.x - this.r <= 0 ||
            this.y + this.r >= height ||
            this.y - this.r <= 0
        );
    };
}