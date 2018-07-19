import Two from 'two.js';
import Color from 'color';

import two from './two';

const hex = string => `#${string.slice(0, 6)}`;

export default class Circle extends Two.Circle {
  constructor(data) {
    super();

    this.colorFromBlockHash = Color(hex(data.hash));
    this.colorFromWork = Color(hex(data.work));
    this.rgbArrayFromWork = this.colorFromWork.rgb().array();

    this.data = data;
    this.radius = this.calculateRadius();
    this.translation.set(this.deterministicX(), this.deterministicY());
    this.fill = this.colorFromBlockHash.string();
    this.stroke = this.colorFromBlockHash.lighten(0.4).saturate(1).string();
    this.lineWidth = 1;
  }

  get diameter() {
    return this.radius * 2;
  }

  didMount() {
    two.bind('update', this.onUpdate.bind(this));
    two.update(); // Force update so we have an element to work with

    const { elem } = this._renderer;

    elem.style = 'cursor:pointer';

    elem.addEventListener('mousedown', () => {
      console.log(this);
    }, false);

    elem.addEventListener('mouseover', () => {
      this.parent.isFocused = true;
    }, false);

    elem.addEventListener('mouseout', () => {
      this.parent.isFocused = false;
    }, false);
  }

  dispose() {
    two.remove(this).unbind('update', this.onUpdate.bind(this));
    delete this;
  }

  onUpdate(/* frameCount */) {
    // No-op for now
    return this;
  }

  // Returns a radius determined by the amount of NANO in the data,
  // boxed within a min and max size
  calculateRadius() {
    const radius = Circle.radiusFromArea(this.data.amount * 200);
    return Math.min(Math.max(radius, Circle.MIN_RADIUS), Circle.maxRadius);
  }

  static radiusFromArea(area) {
    return Math.sqrt(area / Math.PI);
  }

  // Returns the largest size a radius can be, based on being 1/3rd of the available screen
  static get maxRadius() {
    const smallestClientDimension = Math.min(window.innerWidth, window.innerHeight);
    const maxDiameter = smallestClientDimension * (1 / 3);

    return Math.trunc(maxDiameter / 2);
  }

  // TODO these will need to be reevaluated on body resize
  deterministicX() {
    const rgbArray = this.colorFromWork.rgb().array();
    const ratio = (rgbArray[0] + rgbArray[2]) / (255 + 255);

    return this.radius + Math.trunc((ratio * document.body.clientWidth) - this.diameter);
  }

  deterministicY() {
    const rgbArray = this.colorFromWork.rgb().array();
    const ratio = (rgbArray[1] + rgbArray[2]) / (255 + 255);

    return this.radius + Math.trunc((ratio * document.body.clientHeight) - this.diameter);
  }
}

Circle.MIN_RADIUS = 3;
