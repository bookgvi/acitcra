import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MapBaseComponent } from '../../components/map/map-base.component';

import { MarkersService } from '../../services/markers/markers.service';
import { MapService } from '../../services/map/map.service';
import { ShapesService } from '../../services/subjectsShapes/shapes.service';
import { DataSourceService } from '../../models/dataSource/data-source.service';
import { StorageService } from '../../models/storage/storage.service';
import { InfoPanelService } from '../../services/infoPanel/info-panel.service';
import { IsElemInArrayService } from '../../services/utils/isElemInArray/is-elem-in-array.service';

@NgModule({
  declarations: [
    MapBaseComponent
  ],
  providers: [
    MarkersService,
    MapService,
    ShapesService,
    DataSourceService,
    StorageService,
    InfoPanelService,
    IsElemInArrayService
  ],
  imports: [
    HttpClientModule
  ]
})
export class MapsModule {
}
