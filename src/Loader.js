import Two from 'two.js';

import two from './two';
import { timeNow } from './utils';

export default class Loader extends Two.Group {
  constructor() {
    super();
    this.timestamp = timeNow();
    // this.visible = true;
  }

  get ageInSeconds() {
    return timeNow() - this.timestamp;
  }

  // Returns true while there are no Groups with block data in the scene
  get shouldRemainVisible() {
    return !this.parent.children.some(c => c.data);
  }

  didMount() {
    this.createText();

    two.bind('update', this.onUpdate.bind(this));
    two.bind('resize', this.onResize.bind(this));
  }

  // Creating text in a method allows it to be recreated when the scene is resized
  createText() {
    this.text = new Two.Text('Waiting to receive first block', two.width / 2, two.height / 2);
    this.text.fill = '#fff';
    this.add(this.text);
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate.bind(this)).unbind('resize', this.onResize.bind(this));
    delete this;
  }

  onUpdate(/* frameCount */) {
    if (this.opacity <= 0.05) return this.dispose();

    if (!this.shouldRemainVisible && this.ageInSeconds > 2) {
      this.opacity -= 0.02;
    }

    return null;
  }

  onResize() {
    this.remove(this.text);
    this.createText();
  }
}
