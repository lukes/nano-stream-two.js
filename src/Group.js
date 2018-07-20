import Two from 'two.js';
import Circle from './Circle';
import Text from './Text';

import two from './two';

export default class Group extends Two.Group {
  constructor(data) {
    super();

    this.data = data;
    this.isFocused = false;
    this.opacityCache = this.opacity;
  }

  get isNewestGroup() {
    return this === this.parent && this.parent.children.slice(-1)[0];
  }

  didMount() {
    const circle = new Circle(this.data);
    this.add(circle);
    circle.didMount();

    const text = new Text(circle, this.data);
    this.add(text);
    text.didMount();

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
}
