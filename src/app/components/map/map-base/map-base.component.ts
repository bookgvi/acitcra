import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { MarkersService } from '../../../services/markers/markers.service';
import { MapService } from '../../../services/map/map.service';
import { ShapesService } from '../../../services/subjectsShapes/shapes.service';
import { DataSourceService } from '../../../models/dataSource/data-source.service';

@Component({
  selector: 'app-map-base',
  templateUrl: './map-base.component.html',
  styleUrls: ['./map-base.component.css']
})
export class MapBaseComponent implements OnInit, AfterViewInit {
  private map;
  private moscowCoords: number[];
  private centerOfRussia: number[];
  private baseZoom: number;
  private maxZoom: number;
  private clickZoom: number;
  private RussiaBoundLeftTop: number[];
  private RussiaBoundRightBottom: number[];
  private subjectsOfRussiaShapes: string;
  private subjectsOfRussiaList: string;

  constructor(
    private marker: MarkersService,
    private mapService: MapService,
    private shapesService: ShapesService,
    private ds: DataSourceService
  ) {
    this.moscowCoords = [55.751244, 37.618423];
    this.centerOfRussia = [67.58290340170387, 105.2480033085533];
    this.baseZoom = 4;
    this.maxZoom = 19;
    this.clickZoom = 11;
    this.subjectsOfRussiaShapes = '../../assets/data/Regions.geojson';
    this.subjectsOfRussiaList = '../../assets/constituentEntities/subjectsOfRussia.json';
    this.RussiaBoundLeftTop = [82.04574006217713, 17.402343750000004];
    this.RussiaBoundRightBottom = [39.095962936305476, 187.73437500000003];
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
    this.ds.getData(this.subjectsOfRussiaList).subscribe((subjectsOfRussia: string[]) => {
      this.shapesService.initInfoPanel(this.map);
      // Рисуем субъекты РФ
      this.ds.getData(this.subjectsOfRussiaShapes).subscribe(shape => {
        const shapeLayer = this.shapesService.initClickableShapes(shape, this.map, subjectsOfRussia);
        this.map.addLayer(shapeLayer);
      });
    })
  }
}
