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
  modalTypes:any[] = ['Nueva Orden','Agrega a Orden','Modifica Orden','Realiza pago'];
  type:any;
  selectedModal:String = '';
  getIngredients:any;
  newOrder:any = { cxName: '', products: [], status: 1 };
  rmvIngr:any[] = [];
  otherIngr:any[] = [];
  getProduct:any;
  product:any;
  editORder:any;
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
    this.getParams();
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
          this.getOrdersGrps = orders;
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
        console.log(this.getOrdersGrps)
      },
      e=>{
        this.launchMessage('error', 'Error', e.error.message)
      }
    )
  }

  submit(){
    if (this.newOrder.cxName && ((this.product.conTodo === 'No' && this.product.noLleva.length != 0) || (this.product.conTodo === 'Si' && !this.product.noLleva))) {
      this.spinner.show();
      this.setOrder();
      this.orders.setNewOrder(this.admins.getSessionAdmin(), this.newOrder)
      .subscribe(
        resp=>{
          this.spinner.hide();
          location.reload()
          this.launchMessage('success','Exito', resp.body.message)
        },
        e=>{
          this.spinner.hide();
          this.launchMessage('error','Error', e.error.message)
        }
      )
    } else {
      this.launchMessage('warn','Atencion','Uno o mas elementos vacios')
    }
  }

  isOtherIngr(index:number, ingrd:string){
    if (this.otherIngr.includes(ingrd)) {
      const condIndex = this.otherIngr.indexOf(ingrd);
      this.otherIngr.splice(condIndex, 1);
    } else {
      this.otherIngr.push(ingrd);
    }
  }

  disableRmv(){
    if (this.rmvDisabled === 0) {
      this.rmvDisabled = 1;
      this.chngElmnState('isrmvDisabled', 'btn btn-outline-success', `<i class="bi bi-check-circle"></i>`, 'Con todo');
      this.rmvIngr = [];
    } else {
      this.rmvDisabled = 0;
      this.chngElmnState('isrmvDisabled', 'btn btn-outline-danger', `<i class="bi bi-dash-circle"></i>`, 'Quita alguno');
    }
  }

  isRmvIngr(index:number, ingrd:string){
    if (this.rmvIngr.includes(ingrd)) {
      const condIndex = this.rmvIngr.indexOf(ingrd);
      this.rmvIngr.splice(condIndex, 1);
    } else {
      this.rmvIngr.push(ingrd);
    }
  }

  chngQuant(){
    const qntyElmnt = (document.getElementById('prodQuant') as HTMLInputElement).value;
    if (qntyElmnt > this.product.quant) {
      this.product.quant = qntyElmnt;
      console.log(this.product)
    } else {
      this.launchMessage('warn','Atencion','Dejarlo en default 1, o elija 2 o mas')
    }
  }

  loadProductnIngrs(){
    this.spinner.show();
    this.orders.getProdNIngrs(this.admins.getSessionAdmin(), this.product)
    .subscribe(
      resp=>{
        this.getProduct = resp.body.message.prod;
        this.getIngredients = resp.body.message.cond;
        this.spinner.hide();
      },
      e=>{
        console.warn(e)
        this.launchMessage('error','Error',e.error.message);
        this.spinner.hide();
      }
    )
  }

  orderProd(){
    if (this.rmvDisabled === 0) {
      this.product.conTodo = 'Si';
      delete this.product.noLleva;
    } else {
      this.product.conTodo = 'No';
      this.product.noLleva = this.rmvIngr;
    }
    if (this.otherIngr.length != 0) {
      this.product.addlIngr = this.otherIngr;
    } else {
      delete this.product.addlIngr;
    }
  }

  setOrder(){
    this.newOrder.products.push(this.product);
  }

  build(){
    switch (this.type) {
      case 0:
        this.orderProd();
        break;
      case 1:
        
        break;
      case 2:
        
        break;
      case 3:
        
        break;
    }
  }

  modalType(type:number){
    this.type = type;
    this.selectedModal = this.modalTypes[type];
    switch (type) {
      case 0:
        this.loadProductnIngrs();
        break;
      case 1:
        
        break;
      case 2:
        
        break;
      case 3:
        
        break;
    }
  }

  getParams(){
    this.route.params
    .subscribe((params:Params)=>{
      if (params['id'] && params['type']) {
        this.product = { id: params['id'], type: params['type'], quant: 1 };
        document.getElementById('hasParams')?.removeAttribute('disabled');
      }
    })
  }

  chngElmnState(id:string, clase:string, icon:string, value:string){
    (document.getElementById(id) as HTMLElement).innerHTML = `${icon} ${value}`;
    document.getElementById(id)?.removeAttribute('class');
    document.getElementById(id)?.setAttribute('class', clase);
  }

  direcciona(ruta:string){
    this.admins.direcciona(ruta);
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
