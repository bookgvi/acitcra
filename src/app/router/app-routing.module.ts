import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapBaseComponent } from '../components/map/map-base.component';


const routes: Routes = [
  { path: 'map', component: MapBaseComponent },
  { path: '**', redirectTo: '/map' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
