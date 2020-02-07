import { BaseFeatures } from '../baseStyle/base-features';

export class AzrfStyle extends BaseFeatures {
  public style: object;

  constructor() {
    super();
    this.style = {
      weight: 2,
      opacity: 0.5,
      color: '#30363D',
      fillOpacity: 0.8,
      fillColor: '#FFFFFF'
    };
  }
}
