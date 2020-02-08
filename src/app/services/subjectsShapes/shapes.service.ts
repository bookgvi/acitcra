import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { BaseFeatures } from '../../models/shapesStyle/baseStyle/base-features';
import { HighlightFeatures } from '../../models/shapesStyle/highlight/highlight-features';
import { AzrfStyle } from '../../models/shapesStyle/azrfStyle/azrf-style';

import { DataSourceService } from '../../models/dataSource/data-source.service';

@Injectable()
export class ShapesService {
  private baseStyle: object;
  private highlight: object;
  private azrfStyle: object;
  private readonly _div: HTMLDivElement;
  private clickedLayer: object;

  constructor(
    private ds: DataSourceService
  ) {
    this.baseStyle = new BaseFeatures();
    this.highlight = new HighlightFeatures();
    this.azrfStyle = new AzrfStyle();
    this._div = L.DomUtil.create('div', 'info');
    this._div.textContent = 'Россия';
  }

  /**
   *
   * Создание панели с информацией о названии региона, по наведению мыши. Расположен в правом верхнем углу карты
   *
   * @param MAP
   *
   */
  public initInfoPanel(map): void {
    const info = L.control();
    info.onAdd = () => this._div;
    info.addTo(map);
  }

  /**
   *
   * Стилизация слоя, который содержит субъект РФ, входящие в состав АЗРФ
   *
   * @param feature - Блок feature из geoJSON, содержащий кроме всего прочего название слоя
   * @param constituentEntities - Массив с названиями субъектов РФ
   * @param e - Событие (mouseover, mouseout etc...); необязательный параметр
   *
   * @return - возвращает true, если название слоя в features содержится в массиве constituentEntities
   *
   */
  private styleForAZRF(feature, constituentEntities: string[], e?): boolean {
    if (constituentEntities.indexOf(feature?.properties?.NAME) !== -1) {
      // @ts-ignore
      e ? this.azrfStyle.setFeature(e) : '';
      return true;
    }
    return false;
  }

  /**
   *
   * Метод для инициализации данных из geoJSON без обработки событий
   *
   * @param shap -  - данные в формате geoJSON
   *
   * @return - стилизованый слой, готовый для добавления на карту
   *
   */
  public initShapes(shape): object {
    return L.geoJSON(shape, {
      // @ts-ignore
      style: feature => this.baseStyle.style
    });
  }

  /**
   *
   * Метод для инициализации слоя с данными из geoJSON с обработчиками событий
   *
   * @param shape - данные в формате geoJSON
   * @param map - карта, куда нужно добавить слой
   *
   * @return - стилизованый слой, с обработкой событий, готовый для добавления на карту
   *
   */
  public initClickableShapes(shape, map, constituentEntities): object {
    return L.geoJSON(shape, {
      style: feature => {
        // @ts-ignore
        return this.styleForAZRF(feature, constituentEntities) ? this.azrfStyle.style : this.baseStyle.style;
      },
      /**
       * Методы обработки событий мыши
       */
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => {
            // @ts-ignore
            this.styleForAZRF(feature, constituentEntities) ? this.highlight.setFeature(e) : '';
            this._div.innerHTML = `<h4>${ feature.properties.NAME || feature.properties.name }</h4>`;
          },
          mouseout: (e) => {
            this.styleForAZRF(feature, constituentEntities, e);
          },
          click: (e) => {
            if (this.styleForAZRF(feature, constituentEntities)) {
              map.fitBounds(e.target.getBounds()); // Отображаем регион с макс зумом

              // @ts-ignore
              this.clickedLayer?.feature ? map.addLayer(this.clickedLayer) : ''; // Восстанавливаем удаленный регион
              this.ds.saveToStorage('shape',{ isClicked: true, subject: feature }) // Сохраняем на всяк случай в сессион сторадж

              /**
               * Определяем стиль, сохраняем регион с нужным стилем и удаляем его с карты
               * Последовательность вызова методов ВАЖНА
               */
              // @ts-ignore
              this.highlight.setFeature(e);
              this.styleForAZRF(feature, constituentEntities, e);
              this.clickedLayer = layer;
              layer.remove();
            }
          }
        })
      )
    });
  }
}
