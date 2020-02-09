import { IStyle } from '../style.interface';
import { LeafletMouseEvent } from 'leaflet';

export class BaseFeatures implements IStyle {
  public style: IStyle;
  weight: number;
  opacity: number;
  color: string;
  fillOpacity: number;
  fillColor: string;

  constructor() {
    this.style = {
      weight: 2,
      opacity: 0.5,
      color: '#30363D',
      fillOpacity: 0.8,
      fillColor: '#7BC9E9'
    };
  }

  public setFeature(e: LeafletMouseEvent): void {
    const layer = e.target;
    layer.setStyle(this.style);
  }
}
