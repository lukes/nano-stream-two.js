import Two from 'two.js';

import two from './two';

export default class Circle extends Two.Circle {
  constructor(data) {
    const radius = Math.min(Math.max(data.amount, 3), 250);
    const x = radius + Math.trunc(Math.random() * (document.body.clientWidth - (radius * 2)));
    const y = radius + Math.trunc(Math.random() * (document.body.clientHeight - (radius * 2)));

    super(x, y, radius);

    this.data = data;
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
    if (this.opacity <= 0.05) return this.dispose();

    // maybe this could be a factor of age - so
    // when you focus the tab after a period of it not being focused
    // everything is opaque correctly
    this.opacity -= this.opacity * 0.0002;

    return null;
  }
}
