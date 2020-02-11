import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { LatLngExpression, LeafletMouseEvent, Map, TileLayer } from 'leaflet';

@Injectable()
export class MapService {
  private coordsOfClick: LatLngExpression;

  constructor() {
  }

  /**
   * Создание инстанса карты
   * @param options - опции для создания карты
   */
  public initMap(options: object): Map {
    return L.map('map', options);
  }

  /**
   * Инициализация тайлов
   * @param options - опции для карты
   */
  public getTiles(options: object): TileLayer {
    return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options);
  }

  /**
   * Центрирование карты по клику (неиспользуется)
   * @param map - карта
   * @param zoom - масштаб(зум)
   */
  public centerMapOnClick(map: Map, zoom: number): void {
    map.on('click', (e: LeafletMouseEvent) => {
      const coordsOfClick: LatLngExpression = [e.latlng.lat, e.latlng.lng];
      map.setView(coordsOfClick, zoom);
    });
  }
}
