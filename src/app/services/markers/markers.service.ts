import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { LatLngExpression, LeafletMouseEvent, Marker } from 'leaflet';

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
   * @return marker
   *
   */
  initMarker(coords: LatLngExpression, isDraggable: boolean): object {
    const marker: Marker<any> = new L.Marker(coords, {
      draggable: isDraggable
    });
    return marker;
  }

  /**
   *
   * Установка маркера в центре Москвы (по нажатию подсказка "Москва")
   * Клик правой кнопкой мыши - маркер удаляется с карты
   *
   * @param marker - маркер на карте
   * @param map - карта
   *
   */
  setStartingMarker(marker: Marker<any>, map): void {
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
   * @param map - карта
   */
  setMarkerOnClick(map) {
    map.on('click', (e: LeafletMouseEvent) => {
      console.log([e.latlng.lat, e.latlng.lng]);
      const marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      marker.on('contextmenu', () => {
        marker.remove();
      });
    });
  }
}
