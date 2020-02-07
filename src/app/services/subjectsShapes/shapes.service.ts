import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { BaseFeatures } from '../../models/shapesStyle/baseStyle/base-features';
import { HighlightFeatures } from '../../models/shapesStyle/highlight/highlight-features';
import { AzrfStyle } from '../../models/shapesStyle/azrfStyle/azrf-style';

@Injectable()
export class ShapesService {
  private url: string;
  private baseStyle: object;
  private highlight: object;
  private azrfStyle: object;
  private readonly _div: HTMLDivElement;
  private constituentEntity: string[];

  constructor(private http: HttpClient) {
    this.url = '../../assets/data/admin_level_2.geojson';
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

  public getShape(url: string = this.url): Observable<any> {
    return this.http.get(url);
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

  public initClickableShapes(shape, map) {
    return L.geoJSON(shape, {
      style: feature => {
        if (this.constituentEntity.indexOf(feature.properties.NAME) !== -1) {
          // @ts-ignore
          return this.azrfStyle.style;
        }
        // @ts-ignore
        return this.baseStyle.style;
      },
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => {
            if (this.constituentEntity.indexOf(feature.properties.NAME) !== -1) {
              // @ts-ignore
              this.highlight.setFeature(e);
            }
            this._div.innerHTML = `<h4>${feature.properties.NAME}</h4>`;
          },
          mouseout: (e) => {
            if (this.constituentEntity.indexOf(feature.properties.NAME) !== -1) {
              // @ts-ignore
              this.azrfStyle.setFeature(e);
            } else {
              // @ts-ignore
              this.baseStyle.setFeature(e);
            }
          },
          click: (e) => {
            if (this.constituentEntity.indexOf(feature.properties.NAME) !== -1) {
              map.fitBounds(e.target.getBounds());
            }
          }
        })
      )
    });
  }
}
