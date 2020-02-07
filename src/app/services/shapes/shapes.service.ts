import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

import { BaseFeatures } from '../../models/shapesStyle/baseStyle/base-features';
import { HighlightFeatures } from '../../models/shapesStyle/highlight/highlight-features';

@Injectable()
export class ShapesService {
  private url: string;
  private baseStyle: object;
  private highlight: object;
  private readonly _div: HTMLDivElement;

  constructor(private http: HttpClient) {
    this.url = '../../assets/data/admin_level_2.geojson';
    this.baseStyle = new BaseFeatures();
    this.highlight = new HighlightFeatures();
    this._div = L.DomUtil.create('div', 'info');
    this._div.textContent = 'Россия';
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
      // @ts-ignore
      style: feature => this.baseStyle.style,
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => {
            // @ts-ignore
            this.highlight.setFeature(e)
            this._div.innerHTML = `<h4>${feature.properties.NAME}</h4>`;
          },
          // @ts-ignore
          mouseout: (e) => (this.baseStyle.setFeature(e)),
          // @ts-ignore
          click: (e) => {
            map.fitBounds(e.target.getBounds());
          }
        })
      )
    });
  }
}
