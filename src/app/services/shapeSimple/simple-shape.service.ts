import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Layer, LeafletMouseEvent } from 'leaflet';

import { InfoPanelService } from '../infoPanel/info-panel.service';

import { IStyle } from '../../models/interfaces/style.interface';

import { BaseFeatures } from '../../models/shapesStyle/baseStyle/base-features';
import { HighlightFeatures } from '../../models/shapesStyle/highlight/highlight-features';
import { AzrfStyle } from '../../models/shapesStyle/azrfStyle/azrf-style';

@Injectable()
export class SimpleShapeService {
  protected baseStyle: BaseFeatures;
  protected highlight: BaseFeatures;
  protected azrfStyle: BaseFeatures;

  constructor(
    protected infoPanel: InfoPanelService
  ) {
    this.baseStyle = new BaseFeatures();
    this.highlight = new HighlightFeatures();
    this.azrfStyle = new AzrfStyle();
  }

  /**
   *
   * Метод для инициализации данных из geoJSON
   *
   * @param shape - данные в формате geoJSON
   * @param subject - Название текущего субъекта РФ, для отображения в инфопанеле
   * @return - стилизованый слой, готовый для добавления на карту
   *
   */
  protected initShapes(shape, subject: string = 'Россия'): Layer {
    return L.geoJSON(shape, {
      style: (feature: any): IStyle => {
        return this.azrfStyle.style;
      },
      onEachFeature: (feature: any, layer: Layer): void => {
        layer.on({
          mouseover: (e: LeafletMouseEvent): void => {
            this.infoPanel.changeSubTitle(subject, `
            ${ feature.name }
            `);
            this.highlight.setFeature(e);
          },
          mouseout: (e: LeafletMouseEvent): void => {
            this.azrfStyle.setFeature(e);
          }
        });
      }
    });
  }
}
