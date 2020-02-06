import { Injectable } from '@angular/core';

@Injectable()
export class MapService {
  private coordsOfClick: number[];
  constructor() { }

  public centerMapOnClick(map, zoom): void {
    map.on('click', e => {
      this.coordsOfClick = [e.latlng.lat, e.latlng.lng];
      map.flyTo(this.coordsOfClick, zoom);
    });
    //
  }
}
