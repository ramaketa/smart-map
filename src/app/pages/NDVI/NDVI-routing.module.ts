import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NDVIComponent } from './NDVI.component';

const routes: Routes = [
  { path: '', component: NDVIComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NDVIRoutingModule { }
