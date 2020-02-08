import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MarkersService } from '../../services/markers/markers.service';
import { MapService } from '../../services/map/map.service';
import { ShapesService } from '../../services/subjectsShapes/shapes.service';
import { DataSourceService } from '../../models/dataSource/data-source.service';

import { MapBaseComponent } from '../../components/map/map-base/map-base.component';

@NgModule({
  declarations: [
    MapBaseComponent
  ],
  providers: [
    MarkersService,
    MapService,
    ShapesService,
    DataSourceService
  ],
  imports: [
    HttpClientModule
  ]
})
export class MapsModule {
}
