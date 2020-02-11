import { AfterViewInit, Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import { LatLngExpression, LatLngTuple, Layer, LeafletMouseEvent, Map, Marker } from 'leaflet';

import { concat, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { MarkersService } from '../../services/markers/markers.service';
import { MapService } from '../../services/map/map.service';
import { ShapesService } from '../../services/shapes/shapes.service';
import { DataSourceService } from '../../models/dataSource/data-source.service';
import { InfoPanelService } from '../../services/infoPanel/info-panel.service';

@Component({
  selector: 'app-map-base',
  templateUrl: './map-base.component.html',
  styleUrls: ['./map-base.component.css']
})
export class MapBaseComponent implements OnInit, AfterViewInit {
  private map: Map;
  private clickZoom: number;
  private readonly baseZoom: number;
  private readonly maxZoom: number;
  private readonly moscowCoords: LatLngExpression;
  private readonly centerOfRussia: LatLngExpression;
  private readonly RussiaBoundLeftTop: LatLngTuple;
  private readonly RussiaBoundRightBottom: LatLngTuple;
  private readonly subjectsOfRussiaShapes: string;
  private readonly div: HTMLElement;
  private subjectsOfRussiaList: string;
  private subjectsOfRussiaListResult: string[];

  constructor(
    private marker: MarkersService,
    private mapService: MapService,
    private shapesService: ShapesService,
    private ds: DataSourceService,
    private infoPanel: InfoPanelService
  ) {
    this.moscowCoords = [55.751244, 37.618423];
    this.centerOfRussia = [67.58290340170387, 105.2480033085533];
    this.baseZoom = 4;
    this.maxZoom = 19;
    this.clickZoom = 11;
    this.subjectsOfRussiaShapes = '../../assets/geoData/Regions.geojson';
    this.subjectsOfRussiaList = '../../assets/constituentEntities/subjectsOfRussia.json';
    this.subjectsOfRussiaListResult = [];
    this.RussiaBoundLeftTop = [82.04574006217713, 17.402343750000004];
    this.RussiaBoundRightBottom = [39.095962936305476, 187.73437500000003];
    this.div = L.DomUtil.create('div', 'info');
    this.div.innerHTML = `<h4>Россия</h4>`;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.map = this.mapService.initMap({
      center: this.centerOfRussia,
      zoom: this.baseZoom
    });
    // Масштабируем карту на максимум
    this.map.fitBounds([this.RussiaBoundLeftTop, this.RussiaBoundRightBottom]);

    /**
     * Тайлы - возможно понадобятся
     */
      // const tiles: TileLayer = this.mapService.getTiles({
      //   maxZoom: this.maxZoom
      // });
      // tiles.addTo(this.map);

      // Отмечаем маркером Москву
    const mosCenterMarker: object = this.marker.initMarker(this.moscowCoords, false);
    this.marker.setStartingMarker(mosCenterMarker as Marker, this.map);


    /**
     * Вспомогательные методы, могут быть использованы впоследствии
     */
      // this.marker.setMarkerOnClick(this.map);
      // this.mapService.centerMapOnClick(this.map, this.baseZoom);
      //
      // Рисуем границу РФ
      // this.ds.getShape().subscribe(shape => {
      //   const shapeLayer = this.shapes.initShapes(shape);
      //   this.map.addLayer(shapeLayer);
      // });


      // Добавляем инфо панель на карту
    const info: object = this.infoPanel.initInfoPanel(this.div);
    // @ts-ignore
    info.addTo(this.map);

    /**
     * Рисуем субъекты РФ
     */
    const result = concat(
      this.ds.getData(this.subjectsOfRussiaList).pipe(
        retry(3),
        catchError(err => {
            console.warn('...Error catcher: ', err.statusText);
            return of([]);
          }
        )),
      this.ds.getData(this.subjectsOfRussiaShapes).pipe(
        retry(5),
        catchError(err => {
          this.div.innerHTML = `<h2>Ошибка отрисовки карты</h2>`;
          console.warn('...Map error catcher: ', err.statusText);
          return of([]);
        })
      )
    );
    result.subscribe({
      next: value => {
        /**
         * Если это массив, то внутри список с названиями субъектов, сохраняем на будущее
         * иначе - geoJSON - инициализируем слой
         */
        if (Array.isArray(value)) {
          this.subjectsOfRussiaListResult = value;
        } else {
          const shapeLayer: Layer = this.shapesService.initClickableShapes(value, this.map, this.subjectsOfRussiaListResult);

          /**
           * Показываем название региона под курсором в инфо окне
           */
          shapeLayer.on('mouseover', (e: LeafletMouseEvent): void => {
            // @ts-ignore
            this.div.innerHTML = `<h4>${ e.layer.feature.properties.NAME }</h4>`;
          });

          // Отображаем слой с шэйпами
          this.map.addLayer(shapeLayer);
        }
      },
      error: err => {},
      complete: () => console.log('...and it is done!')
    });
  }
}
