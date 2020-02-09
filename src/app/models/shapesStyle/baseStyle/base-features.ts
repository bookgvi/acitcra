import { IStyle } from '../style.interface';
import { LeafletMouseEvent } from 'leaflet';

export class BaseFeatures {
  public style: IStyle;

  constructor() {
    this.style = {
      weight: 2,
      opacity: 0.5,
      color: '#30363D',
      fillOpacity: 0.8,
      fillColor: '#7BC9E9'
    };
  }
  public setFeature(e: LeafletMouseEvent)  {
    const layer = e.target;
    layer.setStyle(this.style);
  }
}
