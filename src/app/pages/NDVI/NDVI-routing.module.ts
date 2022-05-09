import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NDVIComponent } from './NDVI.component';
import { FieldComponent } from "./field/field.component";
import { CreateComponent } from "./create/create.component";

const routes: Routes = [
  { path: '', component: NDVIComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'field' },
      { path: 'field', component: FieldComponent },
      { path: 'create', component: CreateComponent },
      { path: 'field/:id', component: FieldComponent },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NDVIRoutingModule { }
