import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { MarkersService } from '../../../services/markers/markers.service';
import { MapService } from '../../../services/map/map.service';
import { ShapesService } from '../../../services/shapes/shapes.service';

@Component({
  selector: 'app-map-base',
  templateUrl: './map-base.component.html',
  styleUrls: ['./map-base.component.css']
})
export class MapBaseComponent implements OnInit, AfterViewInit {
  private map;
  private moscowCoords: number[];
  private baseZoom: number;
  private maxZoom: number;

  constructor(
    private marker: MarkersService,
    private mapService: MapService,
    private shapes: ShapesService
  ) {
    this.moscowCoords = [55.751244, 37.618423];
    this.baseZoom = 5;
    this.maxZoom = 19;
  }

  private initMap(): void {
    return L.map('map', {
      center: this.moscowCoords,
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
    this.addTiles();
    const mosCenterMarker = this.marker.initMarker(this.moscowCoords);
    this.marker.setStartingMarker(mosCenterMarker, this.map);
    // this.marker.setMarkerOnClick(this.map);
    this.mapService.centerMapOnClick(this.map, this.baseZoom);
    this.shapes.getShape().subscribe(shape => {
      L.geoJSON(shape).addTo(this.map);
    });
  }

}
