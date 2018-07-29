import Two from 'two.js';
import TWEEN from '@tweenjs/tween.js';

import Circle from './Circle';
import Line from './Line';
import Text from './Text';

import two from './two';

export default class Block extends Two.Group {
  constructor(data) {
    super();

    this.data = data;
    this.isFocused = false;
    this.fadeOutTween = new TWEEN.Tween(this).to({ opacity: 0 }, Block.TTL);
  }

  get isNewestBlock() {
    return this === this.parent && this.parent.children.slice(-1)[0];
  }

  didMount() {
    this.circle = new Circle(this.data);
    this.text = new Text(this.circle, this.data);

    // Draw the line first, so the other elements
    // are drawn overtop
    const matchingSendBlock = this.findMatchingSendBlock();
    if (matchingSendBlock) {
      this.line = new Line(this.circle, matchingSendBlock.circle);
      this.add(this.line);
      this.line.didMount();
    }

    this.add(this.circle);
    this.circle.didMount();

    this.add(this.text);
    this.text.didMount();

    this.fadeOutTween.start();
    two.bind('update', this.onUpdate.bind(this));
  }

  dispose() {
    this.children.forEach(child => child.dispose());
    two.remove(this).unbind('update', this.onUpdate.bind(this));
    console.debug(`disposed ${this.id}`);
    delete this;
  }

  onUpdate(/* frameCount */) {
    if (this.opacity === 0) return this.dispose();

    if (this.isFocused) {
      if (this.fadeOutTween.isPlaying()) this.fadeOutTween.stop();
      this.opacity = 1;
    } else if (!this.fadeOutTween.isPlaying()) {
      this.fadeOutTween.start();
    }

    return null;
  }

  // Returns the Block that represents that send block for this Block's receive
  findMatchingSendBlock() {
    if (this.data.is_send) return false;
    return this.parent.children.find(c => c.data && c.data.hash === this.data.link);
  }
}

Block.TTL = 1000 * 60 * 3; // ms
