import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { BaseFeatures } from '../../models/shapesStyle/baseStyle/base-features';
import { HighlightFeatures } from '../../models/shapesStyle/highlight/highlight-features';
import { AzrfStyle } from '../../models/shapesStyle/azrfStyle/azrf-style';
import { DataSourceService } from '../datasource/data-source.service';

@Injectable()
export class ShapesService {
  private baseStyle: object;
  private highlight: object;
  private azrfStyle: object;
  private readonly _div: HTMLDivElement;
  private constituentEntity: string[];
  private clickedLayer: object;

  constructor(
    private ds: DataSourceService
  ) {
    this.baseStyle = new BaseFeatures();
    this.highlight = new HighlightFeatures();
    this.azrfStyle = new AzrfStyle();
    this._div = L.DomUtil.create('div', 'info');
    this._div.textContent = 'Россия';
    this.constituentEntity = [
      'Мурманская область',
      'Ненецкий автономный округ',
      'Чукотский автономный округ',
      'Ямало-Ненецкий автономный округ',
      'Республика Карелия',
      'Республика Коми',
      'Республика Саха (Якутия)',
      'Красноярский край',
      'Архангельская область'
    ];
  }

  public initShapes(shape) {
    return L.geoJSON(shape, {
      // @ts-ignore
      style: feature => this.baseStyle.style
    });
  }

  public initInfoPanel(map): void {
    const info = L.control();
    info.onAdd = () => this._div;
    info.addTo(map);
  }

  private restoreDeletedLayer(map): void {
    // @ts-ignore
    if (this.clickedLayer?.feature?.type) {
      map.addLayer(this.clickedLayer)
    } else {
      this.clickedLayer = undefined;
    }
  }

  private styleForAZRF(feature, e?): boolean {
    if (this.constituentEntity.indexOf(feature.properties.NAME) !== -1) {
      // @ts-ignore
      e ? this.azrfStyle.setFeature(e) : '';
      return true;
    }
    return false;
  }

  public initClickableShapes(shape, map) {
    return L.geoJSON(shape, {
      style: feature => {
        // @ts-ignore
        return this.styleForAZRF(feature) ? this.azrfStyle.style : this.baseStyle.style;
      },
      /**
       * Методы обработки событий мыши
       */
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => {
            // @ts-ignore
            this.styleForAZRF(feature) ? this.highlight.setFeature(e) : '';
            this._div.innerHTML = `<h4>${ feature.properties.NAME || feature.properties.name }</h4>`;
          },
          mouseout: (e) => {
            this.styleForAZRF(feature, e);
          },
          click: (e) => {
            if (this.styleForAZRF(feature)) {
              map.fitBounds(e.target.getBounds()); // Отображаем регион с макс зумом

              // @ts-ignore
              this.clickedLayer?.feature ? map.addLayer(this.clickedLayer) : ''; // Восстанавливаем удаленный регион
              this.ds.saveShapeToSS( { isClicked: true, subject: feature }) // Сохраняем на всяк случай в сессион сторадж

              /**
               * Определяем стиль, сохраняем регион с нужным стилем и удаляем его с карты
               * Последовательность вызова методов ВАЖНА
               */
              // @ts-ignore
              this.highlight.setFeature(e);
              this.styleForAZRF(feature, e);
              this.clickedLayer = layer;
              layer.remove();
            }
          }
        })
      )
    });
  }
}
