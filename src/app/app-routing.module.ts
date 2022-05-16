import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./core/guards/auth.guard";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";

const routes: Routes = [
  { path: '', canActivate: [AuthGuard],
    loadChildren: () => import('./pages/NDVI/NDVI.module').then(m => m.NDVIModule)  },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'account', canActivate: [AuthGuard],
    loadChildren: () => import('./pages/NDVI/NDVI.module').then(m => m.NDVIModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
