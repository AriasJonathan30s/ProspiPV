import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OrderInterfaceComponent } from './components/order-interface/order-interface.component';
import { AvailabilityComponent } from './components/availability/availability.component';

const routes: Routes = [
  { path: 'inventario', component: AvailabilityComponent/*, canActivate: [authenticateGuard, authorizeGuard] */ },
  { path: 'ordenes', component:OrderInterfaceComponent /*, canActivate: [authenticateGuard] */},
  { path: 'ordenes/:id/:type', component:OrderInterfaceComponent /*, canActivate: [authenticateGuard] */},
  { path: 'menu', component:MenuComponent/*, canActivate: [authenticateGuard, authorizeGuard]*/ },
  { path: 'login', component:LoginComponent /*, canActivate: [authenticateGuard]*/ },
  { path: '', component: HomeComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
