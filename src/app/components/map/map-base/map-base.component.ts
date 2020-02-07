import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { MarkersService } from '../../../services/markers/markers.service';
import { MapService } from '../../../services/map/map.service';
import { ShapesService } from '../../../services/subjectsShapes/shapes.service';
import { DataSourceService } from '../../../services/datasource/data-source.service';

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
  private subjectsOfRussia: string;
  private RussiaBoundsLeftTop: number[];
  private RussiaBoundsRightBottom: number[];

  constructor(
    private marker: MarkersService,
    private mapService: MapService,
    private shapes: ShapesService,
    private ds: DataSourceService
  ) {
    this.moscowCoords = [55.751244, 37.618423];
    this.centerOfRussia = [67.58290340170387, 105.2480033085533];
    this.baseZoom = 4;
    this.maxZoom = 19;
    this.clickZoom = 11;
    this.subjectsOfRussia = '../../assets/data/Regions.geojson';
    this.RussiaBoundsLeftTop = [82.04574006217713, 17.402343750000004];
    this.RussiaBoundsRightBottom = [39.095962936305476, 187.73437500000003];
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
    this.map.fitBounds([this.RussiaBoundsLeftTop, this.RussiaBoundsRightBottom]);
    // this.addTiles();
    const mosCenterMarker = this.marker.initMarker(this.moscowCoords);
    this.marker.setStartingMarker(mosCenterMarker, this.map);


    /**
     * Вспомогательные методы, периодически используются
     *
     */
    // this.marker.setMarkerOnClick(this.map);
    // this.mapService.centerMapOnClick(this.map, this.baseZoom);
    //
    // // Рисуем границу РФ
    // this.shapes.getShape().subscribe(shape => {
    //   const shapeLayer = this.shapes.initShapes(shape);
    //   this.map.addLayer(shapeLayer);
    // });

    this.shapes.initInfoPanel(this.map);
    // Рисуем субъекты РФ
    this.ds.getShape(this.subjectsOfRussia).subscribe(shape => {
      const shapeLayer = this.shapes.initClickableShapes(shape, this.map);
      this.map.addLayer(shapeLayer);
    });
  }
}
