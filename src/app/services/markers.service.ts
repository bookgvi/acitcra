import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class MarkersService {
  constructor() {
  }

  initMarker(coords: Number[]) {
    const marker = new L.Marker(coords, {
      draggable: true
    });
    return marker;
  }

  setStartingMarker(marker, map) {
    marker.bindPopup().openPopup();
    marker.addTo(map);
    marker.on('contextmenu', e => {
      marker.remove();
    });
  }

  setMarkerOnClick(map) {
    map.on('click', (e) => {
      const marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      marker.on('contextmenu', e => {
        marker.remove();
      });
    });
  }
}
