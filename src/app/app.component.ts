import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { AdminService } from './services/admin.service';
import { OrdersService } from './services/orders.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sistemaProspiPV';
  loginVals:any = {};
  logOptions:any[] = ['Cuenta','Entra','Salir'];
  logStatus:String;
  bsns:any;

  constructor(
    private message: MessageService,
    private spinner: NgxSpinnerService,
    private admin: AdminService,
    private orders: OrdersService
  ){
    this.logStatus = this.logOptions[1];
  }

  ngOnInit(){
    this.isLoged();
    this.getBusiness();
  }

  getBusiness(){
    const accessTool = this.admin.getSessionAdmin();
    this.admin.loadBusiness(accessTool)
    .subscribe(
      resp=>{
        this.bsns = resp.body.message;
      },
      e=>{
        console.log(e);
        this.spinner.hide();
      }
    )
  }

  log(option:String){
    if (option === this.logOptions[1]) {
      this.login();
    } else {
      this.logout();
    }
  }

  logout(){
    this.admin.deleteSessionAdmin();
    this.isLoged();
    this.direcciona('');
    this.attrChanger('danger', 'primary');
  }

  attrChanger(config:string, newConfig:string){
    let btn = document.getElementById('logBtn');
    if (btn) {
      const btnAttr = btn.getAttribute('class');
      if (btnAttr?.split(' ')) {
        const  attrClass = btnAttr?.split(' ');
        const i = attrClass?.indexOf(`btn-outline-${config}`);
        attrClass[i] = `btn-outline-${newConfig}`;
        let newAttr:string = '';
        for (let index = 0; index < attrClass.length; index++) {
          newAttr = newAttr.concat(attrClass[index]+' ');
        }
        btn.setAttribute('class', newAttr);
      }
    }
  }

  login(){
    if (this.loginVals.user && this.loginVals.pass) {
      this.spinner.show();
      this.admin.login(this.loginVals)
      .subscribe(
        resp=>{
          const body = resp.body;
          this.admin.setSessionAdmin(body.token);
          this.isLoged();
          this.direcciona('ordenes');
          this.cleaner();
          this.spinner.hide();
          this.launchMessage('success', 'Login', body.message);
        },
        e=>{
          console.log(e);
          this.spinner.hide();
        }
      )
    } else {
      if (!this.loginVals.user) {
        this.launchMessage('error','Error','Campo usuario vacio');
      }
      if (!this.loginVals.pass) {
        this.launchMessage('error','Error','Campo password vacio');
      }
    }
  }

  direcciona(address:String){
    this.admin.direcciona(address);
  }

  isLoged(){
    this.logStatus = this.admin.getSessionAdmin() ? this.logOptions[2] : this.logOptions[1];
    if (this.logStatus === this.logOptions[2]) {
      this.attrChanger('primary','danger');
    } else {
      this.attrChanger('danger','primary');
    }
  }

  cleaner(){
    this.loginVals = {};
  }

  launchMessage(severity:string,summary:string,detail:string){
    this.message
    .add({
      severity: severity, // error, warn, success, info
      summary: summary,
      detail: detail,
      life: 5000
    });
  }
}
