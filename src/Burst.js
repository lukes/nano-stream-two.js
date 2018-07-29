import Two from 'two.js';
import TWEEN from '@tweenjs/tween.js';

import two from './two';

export default class Burst extends Two.Rectangle {
  constructor() {
    super(two.width / 2, two.height / 2, two.width, two.height);

    this.isWaitingForBlock = true;
    this.hasStarted = false;
    this.hasFinished = false;
    this.radius = Math.max(two.width, two.height);
    this.visible = false;
    this.noStroke();

    this.fadeInTween = new TWEEN.Tween(this).to({ opacity: 1 }, 150).easing(TWEEN.Easing.Sinusoidal.InOut);
    this.fadeOutTween = new TWEEN.Tween(this).to({ opacity: 0 }, 3500).easing(TWEEN.Easing.Sinusoidal.InOut);
  }

  didMount() {
    two.bind('update', this.onUpdate.bind(this));
  }

  notifyOfNewBlock(block) {
    if (this.isWaitingForBlock) { // Only have one burst at a time
      this.isWaitingForBlock = false;
      this.visible = true;
      this.opacity = 0.01;

      const { circle } = block;
      const color = circle.colorFromBlockHash;

      const x = circle.translation.x - (two.width / 2);
      const y = circle.translation.y - (two.height / 2);

      const radialGradient = two.makeRadialGradient(
        x, y,
        this.radius,
        new Two.Stop(0, color.fade(0.2).string(), 1),
        new Two.Stop(0.5, color.fade(1).string(), 0),
      );

      this.fill = radialGradient;
    }
  }

  onUpdate(/* frameCount */) {
    if (this.isWaitingForBlock) {
      return;
    }

    if (!this.hasStarted) {
      this.fadeInTween.start();
      this.hasStarted = true;
    } else if (this.opacity === 1 && !this.hasFinished) {
      this.hasFinished = true;
      this.fadeOutTween.start();
    } else if (this.opacity === 0) {
      this.isWaitingForBlock = true;
      this.hasFinished = false;
      this.hasStarted = false;
    }
  }
}
