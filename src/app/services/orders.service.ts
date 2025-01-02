import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductSearch } from '../interfaces/product-search';
import { NewOrderVals } from '../interfaces/new-order-vals';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  dirWParams(ruta:string, id:any, type:any){
    this.router.navigate([ruta, id, type])
  }

  getOrders(access:any, showActive:any, opts:any){
    return this.http.get<any>(`${ environment.domain.protocol }://${ environment.domain.host }/produccion/get-orders`, { 'headers':{ 'ContentType':'application/json', 'access':access , 'show': JSON.stringify(showActive), 'opts': JSON.stringify(opts) }, observe:'response' });
  }

  setNewOrder(access:any, newOrder:NewOrderVals){
    return this.http.get<any>(`${ environment.domain.protocol }://${ environment.domain.host }/produccion/set-new-order`, { 'headers':{ 'ContentType':'application/json', 'access':access, 'order': JSON.stringify(newOrder) }, observe:'response' });
  }

  getProdNIngrs(access:any, product:ProductSearch){
    return this.http.get<any>(`${ environment.domain.protocol }://${ environment.domain.host }/produccion/get-product-and-ingredients`, { 'headers':{ 'ContentType':'application/json', 'access':access, 'prod': JSON.stringify(product) }, observe:'response' });
  }

  getMenu(access:any){
    return this.http.get<any>(`${ environment.domain.protocol }://${ environment.domain.host }/produccion/get-menu`, { 'headers':{ 'ContentType':'application/json', 'access':access }, observe:'response' });
  }
}
