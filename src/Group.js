import Two from 'two.js';
import Circle from './Circle';
import InfoText from './InfoText';

import two from './two';

export default class Group extends Two.Group {
  constructor(data) {
    super();

    this.data = data;
    this.isSelected = false;
    this.opacityCache = this.opacity;

    console.log(this);
  }

  didMount() {
    console.debug(`Added Group ${this.id}`);

    const circle = new Circle(this.data);
    this.add(circle);
    circle.didMount();

    const text = new InfoText(circle, this.data);
    this.add(text);
    text.didMount();

    two.bind('update', this.onUpdate.bind(this));
    two.update(); // Force update so we have an element to work with

    const { elem } = this._renderer;

    // TODO this listening will have to be bound to Circle
    // and the property still set on the Group, unless we can
    // check what the mouse if over here and ignore non-Circles
    elem.addEventListener('mouseover', () => {
      this.isSelected = true;
      console.log(this);
    }, false);

    elem.addEventListener('mouseout', () => {
      this.isSelected = false;
    }, false);
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate);
    // TODO call dispose on this.children if possible
    console.debug(`disposed ${this.id}`);
  }

  onUpdate(/* frameCount */) {
    if (this.opacity <= 0.05) return this.dispose();

    // maybe this could be a factor of age - so
    // when you focus the tab after a period of it not being focused
    // everything is opaque correctly
    this.opacityCache -= this.opacityCache * 0.0002;

    if (this.isSelected) {
      this.opacity = 1;
    } else {
      this.opacity = this.opacityCache;
    }

    return null;
  }
}
