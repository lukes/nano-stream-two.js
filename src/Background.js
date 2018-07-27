import Two from 'two.js';

import Burst from './Burst';
import Gradient from './Gradient';
import Loader from './Loader';

import two from './two';

export default class Background extends Two.Group {
  constructor() {
    super();

    this.gradient = new Gradient();
    this.add(this.gradient);

    this.burst = new Burst();
    this.add(this.burst);

    this.loader = new Loader();
    this.add(this.loader);
  }

  didMount() {
    this.burst.didMount();
    this.loader.didMount();

    two.bind('resize', () => {
      // TODO redraw the background
    });
  }
}
