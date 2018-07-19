import Two from 'two.js';

import two from './two';

export default class Circle extends Two.Circle {
  constructor(data) {
    super();

    this.data = data;

    this.radius = this.calculateRadius();
    this.translation.set(this.randomX(), this.randomY());
    this.fill = `#${data.hash.slice(0, 6)}`;
    this.noStroke();
  }

  didMount() {
    console.debug(`Added ${this.id}`);

    two.bind('update', this.onUpdate.bind(this));
    two.update(); // Force update so we have an element to work with

    const { elem } = this._renderer;

    elem.style = 'cursor:pointer';

    elem.addEventListener('mousedown', () => {
      console.log(this);
      console.log(this.data);
    }, false);
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate);
    console.debug(`disposed ${this.id}`);
  }

  onUpdate(/* frameCount */) {
    // No-op for now
    return this;
  }

  // Returns a radius determined by the amount of NANO in the data,
  // boxed within a min and max size
  calculateRadius() {
    const radius = Circle.radiusFromArea(this.data.amount * 200);
    return Math.min(Math.max(radius, Circle.MinRadius), Circle.maxRadius());
  }

  static radiusFromArea(area) {
    return Math.sqrt(area / Math.PI);
  }

  // Returns the largest size a radius can be, based on being 2/3rds of the available screen
  static maxRadius() {
    const smallestClientDimension = Math.min(window.innerWidth, window.innerHeight);
    const maxDiameter = smallestClientDimension * (1 / 6);

    return Math.trunc(maxDiameter / 2);
  }

  randomX() {
    return this.randomCoord(document.body.clientWidth);
  }

  randomY() {
    return this.randomCoord(document.body.clientHeight);
  }

  randomCoord(clientDimension) {
    return this.radius + Math.trunc(Math.random() * (clientDimension - (this.radius * 2)));
  }
}

Circle.MinRadius = 3;
