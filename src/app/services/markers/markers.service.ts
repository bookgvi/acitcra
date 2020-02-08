import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class MarkersService {
  private moscowIcon: object;

  constructor() {
    // Избавляемся от ошибки загрузки png с тенью для стандартного маркера
    Object.defineProperty(L.Icon.Default.prototype.options, 'shadowUrl', {
      value: ''
    });
  }

  /**
   *
   * Инициализация маркера
   *
   * @param coords - массив с координатами [longitude, latitude]
   * @isDraggable - true/false - задание возможности перемещать маркер по карте
   *
   */
  initMarker(coords: number[], isDraggable: boolean): object {
    const marker = new L.Marker(coords, {
      draggable: isDraggable
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
