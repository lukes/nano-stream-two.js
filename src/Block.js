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

    this.circle = new Circle(this.data);
    this.text = new Text(this.circle, this.data);

    this.fadeOutTween = new TWEEN.Tween(this).to({ opacity: 0 }, Block.TTL);
  }

  get isNewestBlock() {
    if (!this.parent) return false;

    return this === this.parent.children.slice(-1)[0];
  }

  didMount() {
    // Draw the line first, so the other elements
    // are drawn overtop
    const matchingBlock = this.findMatchingBlock();
    if (matchingBlock) {
      this.line = new Line(this.circle, matchingBlock.circle);
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
    this.visible = false;
    this.children.forEach((child) => {
      this.remove(child);
      child.visible = false;
    });
    two.remove(this).unbind('update', this.onUpdate.bind(this));
    console.debug(`disposed ${this.id}`);
  }

  onUpdate(/* frameCount */) {
    if (!this.visible) return;

    if (this.opacity === 0) {
      this.dispose();
      return;
    }

    if (this.isFocused) {
      if (this.fadeOutTween.isPlaying()) {
        this.fadeOutTween.stop();
      }
      this.opacity = 1;
    } else if (!this.fadeOutTween.isPlaying()) {
      this.fadeOutTween.start();
    }
  }

  // Returns any Block in the scene that is either the matching
  // 'send' to this 'receive' block, or 'receive' to this 'send' block.
  //
  // A 'receive' block will have the 'send' block's hash in its link property.
  findMatchingBlock() {
    if (this.data.is_send) {
      return this.parent.children.find(c => c.data && c.data.link === this.data.hash);
    }

    return this.parent.children.find(c => c.data && c.data.hash === this.data.link);
  }
}

Block.TTL = 1000 * 60 * 1; // ms
