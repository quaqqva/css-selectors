import DOMComponent, { ElementParameters } from '../../components/base-component';
import SVGComponent from '../../components/svg-component';
import { AnimationFillMode, Tags, TransformOrigin } from '../../types/dom-types';
import trackSprite from '../../assets/img/track_sprite.svg';

enum CarElements {
  Wrapper = 'car-wrapper',
  SVG = 'car',
  EffectPlaceholder = 'car__effect',
  WheelSmokeEffect = 'car__effect_wheel-smoke',
  BreakSmokeEffect = 'car__effect_break-smoke',
}

export default class CarImage extends DOMComponent<HTMLDivElement> {
  private static WRAPPER_PARAMS: ElementParameters = {
    classes: [CarElements.Wrapper],
  };

  private static PLACEHOLDER_PARAMS: ElementParameters = {
    tag: Tags.Image,
    classes: [CarElements.EffectPlaceholder],
  };

  private static MAX_FAST_TIME = 3500;

  private static CAR_DRIVE_ANIMATION = 'car-drive';

  private static CAR_DRIVE_FAST_ANIMATION = 'car-drive-fast';

  private static CAR_STOP_ANIMATION = 'car-stop';

  private static CAR_STOP_COORDS = '--car-stop-at'; // for CSS

  private static STOP_DURATION = 500;

  private static RESET_DURATION = 300;

  private carSVG: SVGComponent;

  private effectPlaceholder: DOMComponent<HTMLImageElement>;

  public constructor() {
    super(CarImage.WRAPPER_PARAMS);

    this.carSVG = new SVGComponent({
      pathToSprite: trackSprite,
      id: 'car',
      parent: this,
    });
    this.carSVG.addClass(CarElements.SVG);

    this.effectPlaceholder = new DOMComponent<HTMLImageElement>(CarImage.PLACEHOLDER_PARAMS);
    this.append(this.effectPlaceholder);
  }

  public setColor(color: string): void {
    this.carSVG.setColor(color);
  }

  public launchCar(travelTime: number): void {
    const isFast = travelTime <= CarImage.MAX_FAST_TIME;
    const animationName = isFast ? CarImage.CAR_DRIVE_FAST_ANIMATION : CarImage.CAR_DRIVE_ANIMATION;
    const transformOrigin = isFast ? TransformOrigin.BottomLeft : TransformOrigin.Center;

    if (isFast) {
      this.effectPlaceholder.addClass(CarElements.WheelSmokeEffect);
      setTimeout(() => {
        this.effectPlaceholder.removeClass(CarElements.WheelSmokeEffect);
      }, travelTime / 5);
    }

    this.showAnimation(
      {
        name: animationName,
        duration: travelTime,
        fillMode: AnimationFillMode.Forwards,
      },
      transformOrigin
    );
  }

  public stop(): void {
    const left = this.getCSSProperty('left');
    this.setCSSProperty('animation', '');

    this.setCSSProperty(CarImage.CAR_STOP_COORDS, left);
    this.showAnimation({
      name: CarImage.CAR_STOP_ANIMATION,
      duration: CarImage.STOP_DURATION,
      fillMode: AnimationFillMode.Forwards,
    });

    setTimeout(() => {
      this.effectPlaceholder.addClass(CarElements.BreakSmokeEffect);
    }, CarImage.STOP_DURATION);
  }

  public reset(): void {
    this.setCSSProperty('opacity', '0');

    setTimeout(() => {
      this.setCSSProperty('animation', '');
      this.setCSSProperty(CarImage.CAR_STOP_COORDS, '');
      this.setCSSProperty('opacity', '');
      this.effectPlaceholder.removeClass(CarElements.BreakSmokeEffect);
    }, CarImage.RESET_DURATION);
  }
}
