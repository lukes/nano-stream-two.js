import Two from 'two.js';

import two from './two';

const formatTime = (seconds) => {
  if (seconds < 91) {
    return `${Math.trunc(seconds)}s ago`;
  }

  return `${Math.trunc(seconds / 60)}m ago`;
}

export default class InfoText extends Two.Text {
  constructor(circle, data) {
    super();

    this.circle = circle;
    this.data = data;
    this.data.seen = (new Date).getTime() / 1000;

    // const message = 'My message';
    // TODO logic to keep in view
    const x = circle.translation.x + circle.radius + InfoText.spacing;
    const y = circle.translation.y + circle.radius + InfoText.spacing;

    this.value = this.message;
    this.translation.set(x, y);

    console.log(this);
  }

  get message() {
    const now = (new Date).getTime() / 1000;
    const seen = this.data.seen;
    const sentOrReceived = this.data.is_send ? 'sent' : 'received';

    return `${formatTime(now - seen)} ${this.data.amount} ${sentOrReceived}`;
  }

  didMount() {
    two.bind('update', this.onUpdate.bind(this));
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate);
  }

  onUpdate(/* frameCount */) {
    if (this.opacity <= 0.05) return this.dispose();

    this.value = this.message;
    this.opacity -= this.opacity * 0.0002;

    return null;
  }
}

InfoText.spacing = 20;
