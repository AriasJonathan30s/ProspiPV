import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Params } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { AdminService } from '../../services/admin.service';


@Component({
  selector: 'app-order-interface',
  templateUrl: './order-interface.component.html',
  styleUrl: '../../app.component.css'
})
export class OrderInterfaceComponent {
  modalTypes:any[] = ['Nuevo pedido','Ver cuenta'];
  type:any;
  selectedModal:String = '';
  getIngredients:any;
  newOrder:any = { cxName: '', status: 1 };
  orderSel:any;
  orderEd:any = {};
  getOrdersGrps:any;
  rmvDisabled:number = 1;

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private message: MessageService,
    private orders: OrdersService,
    private admins: AdminService
  ){}
  
  ngOnInit(){
    this.loadOrders();
  }

  loadOrders(){
    this.orders.getOrders(this.admins.getSessionAdmin(), { status: 1 }, { id: 1, status: 1, cxName: 1, products: 1, requesDateHour: 1 })
    .subscribe(
      resp=>{
        this.getOrdersGrps = [];
        const orders:any[] = resp.body.message;
        let ordGrp:any[] = [];
        if (orders.length <= 3) {
          this.getOrdersGrps[0] = orders;
        } else {
          let iLimit = 3;
          orders.map((order, index)=>{
            if (index < iLimit) {
              ordGrp.push(order)
            } else {
           
              this.getOrdersGrps.push(ordGrp)
              iLimit = iLimit + 3;
              ordGrp = [];
              ordGrp.push(order)
            }
            if ((orders.length)-1 === index) {
              this.getOrdersGrps.push(ordGrp)
            }
          })
        }
      },
      e=>{
        this.launchMessage('error', 'Error', e.error.message)
      }
    )
  }

  dirWParams(ruta:string, id:string){
    this.orders.dirWParams(ruta, id);
  }

  submit(){}

  createOrder(){
    if (this.newOrder.cxName && this.newOrder.status === 1) {
      this.orders.setNewOrder(this.admins.getSessionAdmin(), this.newOrder)
      .subscribe(
        resp=>{
          this.launchMessage('success','Exito', resp.body.message)
          console.log(resp.body.id)
          this.dirWParams('menu', resp.body.id)
        },
        e=>{
          this.launchMessage('error','Error', e.error.message)
        }
      )
    } else {
      this.launchMessage('warn','Atencion','Uno o mas elementos vacios')
    }
  }

  clear(option:number){
    switch(option){
      case 0:

        break;
      default:
        break;
    }
  }

  build(){
    switch (this.type) {
      case 0:
        this.createOrder();
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  getOrder(id:string){
    this.orders.getOrder(this.admins.getSessionAdmin() ,id)
    // this.admins.getSessionAdmin() ,
  }

  modalType(type:number, orderId?:any){
    this.type = type;
    this.selectedModal = this.modalTypes[type];
    switch (type) {
      case 0:
        const attrs = ['data-bs-toggle', 'data-bs-target',"data-bs-dismiss","modal"];
        attrs.forEach(attr=> document.getElementById('builder')?.removeAttribute(attr));
        document.getElementById('builder')?.setAttribute(attrs[2], attrs[3])
        break;
      case 1:
        // this.orderSel = orderId;
        this.getOrder(orderId);
        break;
        default:
        break
    }
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
