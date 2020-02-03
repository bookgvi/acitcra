import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-base',
  templateUrl: './map-base.component.html',
  styleUrls: ['./map-base.component.css']
})
export class MapBaseComponent implements OnInit {
  private map;
  private moscowCoords: Array<number>;

  constructor() {
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
    this.initMap();
    this.addTiles();
  }

}
