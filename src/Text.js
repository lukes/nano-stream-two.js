import Two from 'two.js';
import TWEEN from '@tweenjs/tween.js';

import two from './two';
import { timeNow } from './utils';

const formatTime = (seconds) => {
  if (seconds < 91) {
    return `${Math.trunc(seconds)}s ago`;
  }

  return `${Math.trunc(seconds / 60)}m ago`;
};

export default class Text extends Two.Text {
  constructor(circle, data) {
    super();

    this.circle = circle;
    this.data = data;
    this.timestamp = timeNow();

    this.opacity = 0.01;
    this.fadeInTween = new TWEEN.Tween(this).to({ opacity: 1 }, 500).easing(TWEEN.Easing.Quadratic.In);
    this.fadeOutTween = new TWEEN.Tween(this).to({ opacity: 0 }).easing(TWEEN.Easing.Quadratic.In);

    // TODO logic to keep in view
    const { x } = circle.translation;
    const y = circle.translation.y + circle.radius + Text.SPACING;

    this.value = this.message;
    this.fill = '#FFF';
    this.translation.set(x, y);
  }

  get message() {
    const sentOrReceived = this.data.is_send ? 'sent' : 'received';

    return `${formatTime(this.ageInSeconds)} ${this.data.amount} ${sentOrReceived}`; // TODO handle formatting e- values.
  }

  get shouldBeOpaque() {
    return this.parent.isNewestBlock || this.parent.isFocused;
  }

  get ageInSeconds() {
    return timeNow() - this.timestamp;
  }

  didMount() {
    two.bind('update', this.onUpdate.bind(this));
    this.fadeInTween.start();
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate.bind(this));
    delete this;
  }

  onUpdate(/* frameCount */) {
    // Fade in
    if (this.shouldBeOpaque) {
      if (!this.fadeInTween.isPlaying() && this.opacity === 0) {
        if (this.fadeOutTween.isPlaying()) {
          this.fadeOutTween.stop();
        }
        this.fadeInTween.start();
      }

      if (this.opacity < 1) {
        TWEEN.update();
      }
    // Fade out
    } else {
      if (!this.fadeOutTween.isPlaying() && this.opacity === 1 && this.ageInSeconds > 5) {
        if (this.fadeInTween.isPlaying()) {
          this.fadeInTween.stop();
        }
        this.fadeOutTween.start();
      }

      if (this.opacity > 0) {
        TWEEN.update();
      }
    }

    if (this.opacity > 0) this.value = this.message;

    return this;
  }
}

Text.SPACING = 20;
