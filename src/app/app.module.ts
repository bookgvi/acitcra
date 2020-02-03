import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './router/app-routing.module';

import { MapModule } from './modules/map/map.module'; // My module for maps (for base map)

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
