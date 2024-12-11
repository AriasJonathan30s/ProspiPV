import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { LoginValues } from '../interfaces/login-values';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  direcciona(ruta:String){
    this.router.navigate([ruta]);
  }

  setSessionAdmin(tkn:string){
    sessionStorage.setItem(environment.sessionValues.info,tkn);
  }

  getSessionAdmin(){
    return sessionStorage.getItem(environment.sessionValues.info);
  }

  deleteSessionAdmin(){
    sessionStorage.removeItem(environment.sessionValues.info);
  }

  getpersonelType(){
    return sessionStorage.getItem(environment.sessionValues.personelType);
  }

  loadBusiness(access:any){
    return this.http.get<any>(`${ environment.domain.protocol }://${ environment.domain.host }/administracion/load-business`, { 'headers':{ 'ContentType':'application/json', 'access':access }, observe:'response' });
  }

  login(loginVals:LoginValues){
    return this.http.get<any>(`${ environment.domain.protocol }://${ environment.domain.host }/administracion/login`, { 'headers':{ 'ContentType':'application/json', 'user':JSON.stringify(loginVals) }, observe:'response' });
  }
}
