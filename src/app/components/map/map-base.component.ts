import { AfterViewInit, Component, OnInit } from '@angular/core';

import { LatLngExpression, LatLngTuple, Layer, LeafletMouseEvent, Map, Marker, TileLayer } from 'leaflet';

import { concat, Observable } from 'rxjs';

import { MarkersService } from '../../services/markers/markers.service';
import { MapService } from '../../services/map/map.service';
import { ShapesService } from '../../services/shapeExtended/shapes.service';
import { DataSourceService } from '../../models/dataSource/data-source.service';
import { InfoPanelService } from '../../services/infoPanel/info-panel.service';
import { RepositoryService } from '../../models/repository/repository.service';

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
  private readonly subjectsOfRussiaList: string;
  private subjectsOfRussiaListResult: string[];

  constructor(
    private marker: MarkersService,
    private mapService: MapService,
    private shapesService: ShapesService,
    private ds: DataSourceService,
    private repo: RepositoryService,
    private infoPanel: InfoPanelService
  ) {
    this.moscowCoords = [55.751244, 37.618423];
    this.centerOfRussia = [67.58290340170387, 105.2480033085533];
    this.baseZoom = 4;
    this.maxZoom = 19;
    this.clickZoom = 11;
    this.subjectsOfRussiaShapes = '../../assets/geoData/Regions.geojson';
    // this.subjectsOfRussiaShapes = '../../assets/geoData/admin_level_6.geojson';
    this.subjectsOfRussiaList = '../../assets/constituentEntities/subjectsOfRussia.json';
    this.subjectsOfRussiaListResult = [];
    this.RussiaBoundLeftTop = [82.04574006217713, 17.402343750000004];
    this.RussiaBoundRightBottom = [39.095962936305476, 187.73437500000003];
  }

  ngOnInit() {
    this.infoPanel.changeTitle(`<h4>Россия</h4>`);
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
      //   const shapeLayer = this.shapeExtended.initShapes(shape);
      //   this.map.addLayer(shapeLayer);
      // });


      // Добавляем инфо панель на карту
    const info: object = this.infoPanel.initInfoPanel();
    // @ts-ignore
    info.addTo(this.map);

    /**
     * Рисуем субъекты РФ
     */
    const result: Observable<any> = concat(
      this.repo.getDataResult(this.subjectsOfRussiaList),
      this.repo.getDataResult(this.subjectsOfRussiaShapes)
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
            this.infoPanel.changeTitle(`<h4>${ e.layer.feature.properties.NAME || e.layer.feature.properties.name }</h4>`);
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
