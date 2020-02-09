import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import {
  Layer,
  LeafletMouseEvent
} from 'leaflet';

import { IStyle } from '../../models/shapesStyle/style.interface';

import { BaseFeatures } from '../../models/shapesStyle/baseStyle/base-features';
import { HighlightFeatures } from '../../models/shapesStyle/highlight/highlight-features';
import { AzrfStyle } from '../../models/shapesStyle/azrfStyle/azrf-style';

import { StorageService } from '../../models/storage/storage.service';

@Injectable()
export class ShapesService {
  private baseStyle: BaseFeatures;
  private highlight: BaseFeatures;
  private azrfStyle: BaseFeatures;
  private clickedLayer: Layer;

  constructor(
    private storage: StorageService
  ) {
    this.baseStyle = new BaseFeatures();
    this.highlight = new HighlightFeatures();
    this.azrfStyle = new AzrfStyle();
  }

  /**
   *
   * Стилизация слоя, который содержит субъект РФ, входящие в состав АЗРФ
   *
   * @param feature - Блок feature из geoJSON, содержащий кроме всего прочего название слоя
   * @param constituentEntities - Массив с названиями субъектов РФ
   *
   * @return - возвращает true, если название слоя в features содержится в массиве constituentEntities
   *
   */
  private styleForAZRF(feature: { properties: { NAME: string; }; }, constituentEntities: string[]): boolean {
    return constituentEntities.indexOf(feature?.properties?.NAME) !== -1 ? true : false
  }

  /**
   *
   * Метод для инициализации данных из geoJSON без обработки событий
   *
   * @param shape - данные в формате geoJSON
   *
   * @return - стилизованый слой, готовый для добавления на карту
   *
   */
  public initShapes(shape): object {
    return L.geoJSON(shape, {
      style: () => this.baseStyle.style
    });
  }

  /**
   *
   * Метод для инициализации слоя с данными из geoJSON с обработчиками событий
   *
   * @param shape - данные в формате geoJSON
   * @param map - карта, куда нужно добавить слой
   * @param constituentEntities - массив с субъектами РФ для стилизации
   *
   * @return - стилизованый слой, с обработкой событий, готовый для добавления на карту
   *
   */
  public initClickableShapes(shape, map, constituentEntities: string[]): Layer {
    return L.geoJSON(shape, {
      style: (feature: any): IStyle => {
        return this.styleForAZRF(feature, constituentEntities) ? this.azrfStyle.style : this.baseStyle.style;
      },
      /**
       * Методы обработки событий мыши
       */
      onEachFeature: (feature: any, layer: Layer) => (
        layer.on({
          mouseover: (e: LeafletMouseEvent): void => {
            this.styleForAZRF(feature, constituentEntities) ? this.highlight.setFeature(e) : '';
          },
          mouseout: (e: LeafletMouseEvent): void => {
            this.styleForAZRF(feature, constituentEntities) ? this.azrfStyle.setFeature(e) : '';
            ;
          },
          click: (e: LeafletMouseEvent): void => {
            if (this.styleForAZRF(feature, constituentEntities)) {
              map.fitBounds(e.target.getBounds()); // Отображаем регион с макс зумом

              // @ts-ignore
              this.clickedLayer?.feature ? map.addLayer(this.clickedLayer) : ''; // Восстанавливаем удаленный регион
              this.storage.saveToStorage('shape', { isClicked: true, subject: feature }) // Сохраняем на всяк случай в сторадж

              /**
               * Перед удалением устанавливаем основной стиль для АЗРФ, сохраняем этот элемент(layer) и удаляем его
               */
              this.azrfStyle.setFeature(e);
              this.clickedLayer = layer;
              layer.remove();
            }
          }
        })
      )
    });
  }
}
