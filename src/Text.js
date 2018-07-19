import Two from 'two.js';
import TWEEN from '@tweenjs/tween.js';

import two from './two';

const formatTime = (seconds) => {
  if (seconds < 91) {
    return `${Math.trunc(seconds)}s ago`;
  }

  return `${Math.trunc(seconds / 60)}m ago`;
};

const timeNow = () => (new Date()).getTime() / 1000;

export default class Text extends Two.Text {
  constructor(circle, data) {
    super();

    this.circle = circle;
    this.data = data;
    this.timestamp = timeNow();

    this.fadeOutTween = new TWEEN.Tween(this).to({ opacity: 0 }).easing(TWEEN.Easing.Quadratic.In);

    // TODO logic to keep in view
    const x = circle.translation.x + circle.radius + Text.SPACING;
    const y = circle.translation.y + circle.radius + Text.SPACING;

    this.value = this.message;
    this.translation.set(x, y);
  }

  get message() {
    const sentOrReceived = this.data.is_send ? 'sent' : 'received';

    return `${formatTime(this.ageInSeconds)} ${this.data.amount} ${sentOrReceived}`; // TODO handle formatting e- values.
  }

  get shouldBeOpaque() {
    return this.parent.isNewestGroup || this.parent.isFocused;
  }

  get ageInSeconds() {
    return timeNow() - this.timestamp;
  }

  didMount() {
    two.bind('update', this.onUpdate.bind(this));
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate);
  }

  onUpdate(/* frameCount */) {
    if (this.shouldBeOpaque) {
      this.opacity = 1;
      this.value = this.message;

      if (this.fadeOutTween.isPlaying()) {
        this.fadeOutTween.stop();
      }
    } else {
      if (!this.fadeOutTween.isPlaying() && this.opacity === 1 && this.ageInSeconds > 3) {
        this.fadeOutTween.start();
      }

      TWEEN.update();
    }
    return this;
  }
}

Text.SPACING = 20;
