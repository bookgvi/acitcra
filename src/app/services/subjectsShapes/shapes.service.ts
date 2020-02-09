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
import { IsElemInArrayService } from '../utils/isElemInArray/is-elem-in-array.service';

@Injectable()
export class ShapesService {
  private baseStyle: BaseFeatures;
  private highlight: BaseFeatures;
  private azrfStyle: BaseFeatures;
  private clickedLayer: Layer;

  constructor(
    private storage: StorageService,
    private isElemInArray: IsElemInArrayService
  ) {
    this.baseStyle = new BaseFeatures();
    this.highlight = new HighlightFeatures();
    this.azrfStyle = new AzrfStyle();
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
  public initShapes(shape): Layer {
    return L.geoJSON(shape, {
      style: (feature: any): IStyle => {
        return this.azrfStyle.style
      }
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
        return this.isElemInArray.check(feature?.properties?.NAME, constituentEntities) ? this.azrfStyle.style : this.baseStyle.style;
      },
      /**
       * Методы обработки событий мыши
       */
      onEachFeature: (feature: any, layer: Layer) => {
        const isPresent: boolean = this.isElemInArray.check(feature?.properties?.NAME, constituentEntities)
        layer.on({
          mouseover: (e: LeafletMouseEvent): void => {
            isPresent ? this.highlight.setFeature(e) : ''; // подсвечиваем элемент под курсором
          },
          mouseout: (e: LeafletMouseEvent): void => {
            isPresent ? this.azrfStyle.setFeature(e) : ''; // возвращаем начальный стиль
            ;
          },
          click: (e: LeafletMouseEvent): void => {
            if (isPresent) {
              map.fitBounds(e.target.getBounds()); // Отображаем элемент с макс зумом

              // @ts-ignore
              this.clickedLayer?.feature ? map.addLayer(this.clickedLayer) : ''; // Восстанавливаем удаленный регион
              this.storage.saveToStorage('shape', { isClicked: true, subject: feature }) // Сохраняем на всяк случай в сторадж

              /**
               * Перед удалением устанавливаем основной стиль для АЗРФ, сохраняем этот элемент(layer) и удаляем его
               */
              // this.azrfStyle.setFeature(e);
              // this.clickedLayer = layer;
              // layer.remove();
            }
          }
        })
      }
    });
  }
}
