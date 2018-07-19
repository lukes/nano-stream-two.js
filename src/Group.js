import Two from 'two.js';
import Circle from './Circle';
import Text from './Text';

import two from './two';

export default class Group extends Two.Group {
  constructor(data) {
    super();

    this.data = data;
    this.isSelected = false;
    this.opacityCache = this.opacity;

    console.debug(this);
  }

  get isNewestGroup() {
    return this === this.parent.children.slice(-1)[0];
  }

  didMount() {
    console.debug(`Added Group ${this.id}`);

    const circle = new Circle(this.data);
    this.add(circle);
    circle.didMount();

    const text = new Text(circle, this.data);
    this.add(text);
    text.didMount();

    two.bind('update', this.onUpdate.bind(this));
    two.update(); // Force update so we have an element to work with

    const { elem } = this._renderer;

    elem.addEventListener('mouseover', () => {
      this.isSelected = true;
    }, false);

    elem.addEventListener('mouseout', () => {
      this.isSelected = false;
    }, false);
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate);
    // TODO call dispose on this.children
    console.debug(`disposed ${this.id}`);
  }

  onUpdate(/* frameCount */) {
    if (this.opacity <= 0.05) return this.dispose();

    if (this.isSelected) {
      this.opacity = 1;
    } else {
      // maybe this could be a factor of age - so
      // when you focus the tab after a period of it not being focused
      // everything is opaque correctly
      this.opacityCache -= this.opacityCache * 0.0002;
      this.opacity = this.opacityCache;
    }

    return null;
  }
}
