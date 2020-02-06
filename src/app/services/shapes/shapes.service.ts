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

  constructor(private http: HttpClient) {
    this.url = '../../assets/data/admin_level_2.geojson';
    this.baseStyle = new BaseFeatures();
    this.highlight = new HighlightFeatures();
  }

  getShape(url: string = this.url): Observable<any> {
    return this.http.get(url);
  }

  initShapes(shape) {
    return L.geoJSON(shape, {
      // @ts-ignore
      style: feature => this.baseStyle.style
    });
  }
  initClickableShapes(shape) {
    return L.geoJSON(shape, {
      // @ts-ignore
      style: feature => this.baseStyle.style,
      onEachFeature: (feature, layer) => (
        layer.on({
          // @ts-ignore
          mouseover: (e) => (this.highlight.setFeature(e)),
          // @ts-ignore
          mouseout: (e) => (this.baseStyle.setFeature(e))
        })
      )
    });
  }
}
