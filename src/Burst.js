import Two from 'two.js';
import TWEEN from '@tweenjs/tween.js';

import two from './two';

export default class Burst extends Two.Rectangle {
  constructor() {
    super(two.width / 2, two.height / 2, two.width, two.height);

    this.disposeWhenTransparent = false;

    const radius = Math.max(two.width, two.height);

    const radialGradient = two.makeRadialGradient(
      0, 0,
      radius,
      new Two.Stop(0, 'rgba(14, 124, 44, 1)', 1),
      new Two.Stop(0.5, 'rgba(14, 124, 44, 0)', 0),
    );

    this.noStroke();
    this.fill = radialGradient;

    this.opacity = 0.1;
    this.fadeInTween = new TWEEN.Tween(this).to({ opacity: 1 }, 150).easing(TWEEN.Easing.Quadratic.In);
    this.fadeOutTween = new TWEEN.Tween(this).to({ opacity: 0 }, 3500).easing(TWEEN.Easing.Quadratic.Out);
  }

  didMount() {
    two.bind('update', this.onUpdate.bind(this));
    // two.bind('resize', () => {
    //   // TODO redraw the background
    //   // See view-source:https://two.js.org/examples/gradients.html
    // });
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate.bind(this));
    delete this;
  }

  onUpdate(/* frameCount */) {
    if (this.opacity < 1 && !this.fadeInTween.isPlaying() && !this.disposeWhenTransparent) {
      this.fadeInTween.start();
    }

    if (this.opacity === 1 && !this.fadeOutTween.isPlaying()) {
      this.disposeWhenTransparent = true;
      this.fadeOutTween.start();
    }

    if (this.opacity === 0 && this.disposeWhenTransparent) {
      this.dispose();
    }

    TWEEN.update();

    return this;
  }
}
