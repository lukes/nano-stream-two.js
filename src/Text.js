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

export default class Text extends Two.Group {
  constructor(circle, data) {
    super();

    this.circle = circle;
    this.data = data;
    this.timestamp = timeNow();

    this.opacity = 0.01;
    // TODO logic to keep in view
    const { x } = circle.translation;
    const y = circle.translation.y + circle.radius + Text.SPACING;

    this.textTimeAgo = new Two.Text(this.textTimeAgoMessage, x, y);
    this.textTimeAgo.fill = '#FFF';
    this.add(this.textTimeAgo);

    this.textAmount = new Two.Text(this.textAmountMessage, x, y + Text.SPACING + 5);
    this.textAmount.fill = '#FFF';
    this.add(this.textAmount);

    const easing = TWEEN.Easing.Quadratic.In;
    this.fadeInTween = new TWEEN.Tween(this).to({ opacity: 1 }, 500).easing(easing);
    this.fadeOutTween = new TWEEN.Tween(this).to({ opacity: 0 }).easing(easing);
  }

  get textTimeAgoMessage() {
    return formatTime(this.ageInSeconds);
  }

  get textAmountMessage() {
    const sentOrReceived = this.data.is_send ? 'sent' : 'received';

    return `${this.data.amount} ${sentOrReceived}`;
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
        this.fadeInTween.start();
      }
    // Fade out
    } else if (!this.fadeOutTween.isPlaying() && this.opacity === 1 && this.ageInSeconds > 5) {
      this.fadeOutTween.start();
    }

    if (this.opacity > 0) this.textTimeAgo.value = this.textTimeAgoMessage;

    return this;
  }
}

Text.SPACING = 15;
