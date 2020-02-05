import { NgModule } from '@angular/core';

import { MarkersService } from '../../services/markers.service';

import { MapBaseComponent } from '../../components/map/map-base/map-base.component';

@NgModule({
  declarations: [
    MapBaseComponent
  ],
  providers: [
    MarkersService
  ],
  imports: []
})
export class MapModule {
}
