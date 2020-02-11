import { LeafletMouseEvent } from 'leaflet';

export interface IStyle {
  weight?: number;
  opacity?: number;
  color?: string;
  fillOpacity?: number;
  fillColor?: string;

  setFeature?(e: LeafletMouseEvent): void;
}
