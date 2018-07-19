import Two from 'two.js';

import two from './two';

const formatTime = (seconds) => {
  if (seconds < 91) {
    return `${Math.trunc(seconds)}s ago`;
  }

  return `${Math.trunc(seconds / 60)}m ago`;
};

export default class InfoText extends Two.Text {
  constructor(circle, data) {
    super();

    this.circle = circle;
    this.data = data;
    this.data.seen = (new Date()).getTime() / 1000;

    // TODO logic to keep in view
    const x = circle.translation.x + circle.radius + InfoText.spacing;
    const y = circle.translation.y + circle.radius + InfoText.spacing;

    this.value = this.message;
    this.translation.set(x, y);

    console.debug(this);
  }

  get message() {
    const now = (new Date()).getTime() / 1000;
    const { seen } = this.data;
    const sentOrReceived = this.data.is_send ? 'sent' : 'received';

    return `${formatTime(now - seen)} ${this.data.amount} ${sentOrReceived}`; // TODO handle formatting e- values.
  }

  get visible() {
    return this.parent.isNewestGroup || this.parent.isSelected;
  }

  didMount() {
    two.bind('update', this.onUpdate.bind(this));
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate);
  }

  onUpdate(/* frameCount */) {
    if (!this.visible) {
      this.opacity = 0;
    } else {
      this.opacity = 1;
      this.value = this.message;
    }

    return this;
  }
}

InfoText.spacing = 20;
