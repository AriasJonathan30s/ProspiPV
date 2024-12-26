import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { OrdersService } from '../../services/orders.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: '../../app.component.css'
})
export class MenuComponent {
  menuGroups:any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private message : MessageService,
    private admins : AdminService,
    private orders : OrdersService
  ){}

  ngOnInit(){
    this.getProducts();
  }

  getProducts(){
    this.orders.getProducts(this.admins.getSessionAdmin())
    .subscribe(
      resp=>{
        const gotMenu:any[] = resp.body.message
        if (gotMenu.length <= 3) {
          const group:any[] = []
          gotMenu.map((prod)=>{
            group.push(prod);
          })
          this.menuGroups.push(group);
        } else {
          let group:any[] = [];
          let groupLength = 3;
          for (let i = 0; i < gotMenu.length; i++) {
            if (i < groupLength) {
              group.push(gotMenu[i]);
            } else {
              this.menuGroups.push(group);
              group = [];
              groupLength+=3;
              group.push(gotMenu[i]);
            }
          }
          this.menuGroups.push(group);
        }
        console.log(this.menuGroups)
      },
      e=>{
        console.log(e);
        this.launchMessage('error','Error',e.body.message);
      }
    )
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
