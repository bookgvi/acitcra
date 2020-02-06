import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MarkersService } from '../../services/markers/markers.service';
import { MapService } from '../../services/map/map.service';
import { ShapesService } from '../../services/shapes/shapes.service';

import { MapBaseComponent } from '../../components/map/map-base/map-base.component';

@NgModule({
  declarations: [
    MapBaseComponent
  ],
  providers: [
    MarkersService,
    MapService,
    ShapesService
  ],
  imports: [
    HttpClientModule
  ]
})
export class MapModule {
}
