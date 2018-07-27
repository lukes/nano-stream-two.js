import Two from 'two.js';

import two from './two';

export default class Gradient extends Two.Rectangle {
  constructor() {
    super(two.width / 2, two.height / 2, two.width, two.height);

    const colors = [
      'rgb(0, 40, 102)',
      'rgb(5, 20, 43)',
    ];

    colors.index = 0;

    const linearGradient = two.makeLinearGradient(
      two.width / 2, -two.height / 2,
      two.width / 2, two.height / 2,
      new Two.Stop(0, colors[0]),
      new Two.Stop(1, colors[1]),
    );

    this.noStroke();
    this.fill = linearGradient;
  }
}
