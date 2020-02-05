import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { MarkersService } from '../../../services/markers.service';

@Component({
  selector: 'app-map-base',
  templateUrl: './map-base.component.html',
  styleUrls: ['./map-base.component.css']
})
export class MapBaseComponent implements OnInit, AfterViewInit {
  private map;
  private moscowCoords: Number[];

  constructor(
    private marker: MarkersService
  ) {
    this.moscowCoords = [55.751244, 37.618423];
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.moscowCoords,
      zoom: 4
    });
  }

  private addTiles(): void {
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    tiles.addTo(this.map);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addTiles();
    const mosCenterMarker = this.marker.initMarker(this.moscowCoords);
    this.marker.setStartingMarker(mosCenterMarker, this.map);
    this.marker.setMarkerOnClick(this.map);

  }

}
