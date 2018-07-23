import Two from 'two.js';

import two from './two';

export default class Line extends Two.Line {
  constructor(circle1, circle2) {
    super(circle1.translation.x, circle1.translation.y, circle2.translation.x, circle2.translation.y);

    this.stroke = '#fff';
    this.opacity = 0.6;
  }

  didMount() {
    two.bind('resize', () => {
      // TODO redraw the background
    });
  }
}
