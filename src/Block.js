import Two from 'two.js';

import Circle from './Circle';
import Line from './Line';
import Text from './Text';

import two from './two';

export default class Block extends Two.Group {
  constructor(data) {
    super();

    this.data = data;
    this.isFocused = false;
    this.opacityCache = this.opacity;
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

    two.bind('update', this.onUpdate.bind(this));
  }

  dispose() {
    this.children.forEach(child => child.dispose());
    two.remove(this).unbind('update', this.onUpdate.bind(this));
    console.debug(`disposed ${this.id}`);
    delete this;
  }

  onUpdate(/* frameCount */) {
    if (this.opacity <= 0.05) return this.dispose();

    if (this.isFocused) {
      this.opacity = 1;
    } else {
      // maybe this could be a factor of age - so
      // when you focus the tab after a period of it not being focused
      // everything is opaque correctly
      // TODO use tween for this too, to control timing.
      this.opacityCache -= this.opacityCache * 0.0002;
      this.opacity = this.opacityCache;
    }

    return null;
  }

  // Returns the Block that represents that send block for this Block's receive
  findMatchingSendBlock() {
    if (this.data.is_send) return false;
    return this.parent.children.find(c => c.data && c.data.hash === this.data.link);
  }
}
