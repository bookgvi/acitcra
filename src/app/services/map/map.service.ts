import { Injectable } from '@angular/core';
import { LatLngExpression, LeafletMouseEvent } from 'leaflet';

@Injectable()
export class MapService {
  private coordsOfClick: LatLngExpression;

  constructor() {
  }

  /**
   *
   * Центрирование карты по клику (неиспользуется)
   *
   * @param map
   * @param zoom
   *
  */
  public centerMapOnClick(map, zoom: number): void {
    map.on('click', (e: LeafletMouseEvent) => {
      this.coordsOfClick = [e.latlng.lat, e.latlng.lng];
      map.setView(this.coordsOfClick, zoom);
    });
  }
}
