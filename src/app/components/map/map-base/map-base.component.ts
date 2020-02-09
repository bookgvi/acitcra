import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { MarkersService } from '../../../services/markers/markers.service';
import { MapService } from '../../../services/map/map.service';
import { ShapesService } from '../../../services/subjectsShapes/shapes.service';
import { DataSourceService } from '../../../models/dataSource/data-source.service';
import { InfoPanelService } from '../../../services/infoPanel/info-panel.service';

@Component({
  selector: 'app-map-base',
  templateUrl: './map-base.component.html',
  styleUrls: ['./map-base.component.css']
})
export class MapBaseComponent implements OnInit, AfterViewInit {
  private map;
  private clickZoom: number;
  private readonly baseZoom: number;
  private readonly maxZoom: number;
  private readonly moscowCoords: number[];
  private readonly centerOfRussia: number[];
  private readonly RussiaBoundLeftTop: number[];
  private readonly RussiaBoundRightBottom: number[];
  private readonly _div: HTMLDivElement;
  private subjectsOfRussiaShapes: string;
  private subjectsOfRussiaList: string;

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
    this.RussiaBoundLeftTop = [82.04574006217713, 17.402343750000004];
    this.RussiaBoundRightBottom = [39.095962936305476, 187.73437500000003];
    this._div = L.DomUtil.create('div', 'info');
    this._div.innerHTML = `<h4>Россия</h4>`;
  }

  private initMap(): void {
    return L.map('map', {
      center: this.centerOfRussia,
      zoom: this.baseZoom
    });
  }

  private addTiles(): void {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: this.maxZoom
    });

    tiles.addTo(this.map);
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

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.map = this.initMap();
    this.map.fitBounds([this.RussiaBoundLeftTop, this.RussiaBoundRightBottom]);
    // this.addTiles();
    const mosCenterMarker = this.marker.initMarker(this.moscowCoords, false);
    this.marker.setStartingMarker(mosCenterMarker, this.map);


    /**
     * Вспомогательные методы, периодически используются
     *
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
      //
    const info = this.infoPanel.initInfoPanel(this._div);
    // @ts-ignore
    info.addTo(this.map);

    // Рисуем субъекты РФ
    this.ds.getData(this.subjectsOfRussiaList).subscribe((subjectsOfRussia: string[]) => {
      this.ds.getData(this.subjectsOfRussiaShapes).subscribe((shape: object) => {
        const shapeLayer = this.shapesService.initClickableShapes(shape, this.map, subjectsOfRussia);
        // @ts-ignore
        shapeLayer.on('mouseover', (e: Event): void => {
          // @ts-ignore
          this._div.innerHTML = `<h4>${ e.layer.feature.properties.NAME }</h4>`;
        })
        this.map.addLayer(shapeLayer);
      });
    });
  }
}
