import Two from 'two.js';

import two from './two';

export default class Circle extends Two.Circle {
  constructor(data) {
    super();

    this.data = data;

    this.radius = Math.min(Math.max(data.amount, 3), 250);;

    const x = this.randomX();
    const y = this.randomY();
    this.translation.set(x, y);

    this.fill = `#${data.hash.slice(0, 6)}`;
    this.noStroke();

    console.log(this);
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

  randomX() {
    return this.randomXOrY(document.body.clientWidth);
  }

  randomY() {
    return this.randomXOrY(document.body.clientHeight);
  }

  randomXOrY(clientDimension) {
    return this.radius + Math.trunc(Math.random() * (clientDimension - (this.radius * 2)));
  }
}
