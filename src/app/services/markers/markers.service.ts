import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class MarkersService {
  constructor() {
  }

  /**
   *
   * Инициализация маркера
   *
   * @param coords - массив с координатами [longitude, latitude]
   *
   */
  initMarker(coords: number[]): object {
    const marker = new L.Marker(coords, {
      draggable: true
    });
    return marker;
  }

  /**
   *
   * Установка маркера в центре Москвы (по нажатию подсказка "Москва")
   *
   * @param marker
   * @param map
   *
   */
  setStartingMarker(marker, map): void {
    marker.bindPopup('Moscow').openPopup();
    marker.addTo(map);
    marker.on('contextmenu', e => {
      marker.remove();
    });
  }

  /**
   *
   * Установка маркера на карте и вывод в консоль координат при нажатии левой кнопкой мыши
   * Удаление маркера с карты по нажатию на нем правой кнопкой мыши
   *
   * @param map
   */
  setMarkerOnClick(map) {
    map.on('click', (e) => {
      console.log([e.latlng.lat, e.latlng.lng]);
      const marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      marker.on('contextmenu', () => {
        marker.remove();
      });
    });
  }
}
