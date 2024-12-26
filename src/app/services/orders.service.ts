import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  getProducts(access:any){
    return this.http.get<any>(`${ environment.domain.protocol }://${ environment.domain.host }/produccion/get-menu`, { 'headers':{ 'ContentType':'application/json', 'access':access }, observe:'response' });
  }
}
