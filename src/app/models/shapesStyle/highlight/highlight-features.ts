import { BaseFeatures } from '../baseStyle/base-features';

export class HighlightFeatures extends BaseFeatures {
  public style: object;

  constructor() {
    super();
    this.style = {
      weight: 5,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: 'rgba(250,224,66,0.54)'
    };
  }
}
