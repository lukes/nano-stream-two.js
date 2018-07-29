import Two from 'two.js';
import TWEEN from '@tweenjs/tween.js';

import two from './two';
import { timeNow } from './utils';

export default class Loader extends Two.Group {
  constructor() {
    super();
    this.hasReceivedFirstBlock = false;
    this.timestamp = timeNow();
    this.fadeOutTween = new TWEEN.Tween(this).to({ opacity: 0 });
  }

  didMount() {
    this.createText();

    two.bind('resize', this.onResize.bind(this));
  }

  notifyOfNewBlock(/* block */) {
    if (!this.hasReceivedFirstBlock) {
      this.hasReceivedFirstBlock = true;
      this.fadeOutTween.start();
    }
  }

  // Creating text in a method allows it to be recreated when the scene is resized
  createText() {
    this.text = new Two.Text('Waiting to receive first block', two.width / 2, two.height / 2);
    this.text.fill = '#fff';
    this.add(this.text);
  }

  onResize() {
    // Perhaps another method of doing this can be seen here // See view-source:https://two.js.org/examples/gradients.html
    this.remove(this.text);
    this.createText();
  }
}
