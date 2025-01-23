import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Params } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: '../../app.component.css'
})
export class MenuComponent {
  menu:any[] = [];
  menuGroups:any[] = [];
  order:any;
  modalOpts:any[] = ['Preferencia de pedido','Edita orden'];
  modalSel:any;
  selectedMod:any;
  orderProds:any[] = [];
  prodPref:any;
  delIngr:any[] = [];
  editDelIngr:any[] = [];
  orderProd:any = { id:'', name: '', type: '', inclAll: 'Si', unitPrice: 0.00, quant: 1, totPrice: 0.00 };;
  prodSel:any;
  prodIngrs:any[] = [];
  prodEdit:any = { quant: 1};

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private message : MessageService,
    private admins : AdminService,
    private orders : OrdersService
  ){}

  ngOnInit(){
    this.getMenu();
    this.getParams();
  }

  edtOrderedProd(prod:any){

  }

  rmvOrderedProd(index:any){
    this.orderProds.splice(index, 1)
  }

  modifOrder(){
    this.orderProds[this.prodSel.index] = this.prodEdit;
  }

  addProd(prod:any){
    this.orderProds.push(prod);
  }

  submitReq(){
    console.log('Envia')
    this.orders.addToOrder(this.admins.getSessionAdmin(), this.order, this.orderProds)
    .subscribe(
      req=>{
        this.admins.direcciona('ordenes');
        this.launchMessage('success', 'Exito', req.body.message)
      },
      e=>{
        console.warn(e.error)
        this.launchMessage('Error','Error','Error de sistema')
      }
    )
  }

  submit(){
    console.log()
    switch (this.selectedMod) {
      case this.modalOpts[0]:
        this.addProd(this.orderProd);
        this.lClean();
        break;
      case this.modalOpts[1]:
        this.modifOrder();
        this.lEClean();
        break;
      case this.modalOpts[2]:
        this.submitReq();
        break;
      default:
        break;
    }

  }

  rmvConds(){
    if (this.orderProd.inclAll === 'No') {
      this.orderProd.rmvCond = this.delIngr;
    }
  }

  buildEdit(){
    let isingrsSame = 1;
    if (this.prodEdit.inclAll === 'No') {
      this.prodEdit.rmvCond = this.editDelIngr;
      let compare:any[]
      if (this.prodSel.inclAll === 'No') {
        compare = (this.prodSel.rmvCond).length > this.editDelIngr.length ? [this.prodSel.rmvCond, this.editDelIngr] : [this.editDelIngr, this.prodSel.rmvCond];  
        const toCompare:any[] = compare[0];
        const compared:any[] = compare[1];
        toCompare.map(ingr=>{
          if (compared.includes(ingr) === false) {
            isingrsSame = 0;
          }
        })
      } else {
        isingrsSame = 0;
      }
      
    } else {
      this.prodEdit.inclAll = this.prodSel.inclAll;
    }
    if (!this.prodEdit.quant) {
      this.prodEdit.quant = this.prodSel.quant;
    }
    this.prodEdit.id = this.prodSel.id;
    this.prodEdit.name = this.prodSel.name;
    this.prodEdit.type = this.prodSel.type;
    this.prodEdit.unitPrice = this.prodSel.unitPrice;
    if (this.prodEdit.id === this.prodSel.id && this.prodEdit.name === this.prodSel.name && this.prodEdit.type === this.prodSel.type
      && this.prodEdit.unitPrice === this.prodSel.unitPrice && this.prodEdit.inclAll === this.prodSel.inclAll && isingrsSame
      && this.prodEdit.quant === this.prodSel.quant) {
      this.launchMessage('warn','Atencion','No hay cambios')
    } else {
      console.log(this.prodEdit)
    }
  }

  build(option:number){
    console.log(option)
    switch (option) {
      case 0:
        this.rmvConds();
        break;
      case 1:
        this.buildEdit();
        break;
      default:
        break;
    }
  }

  chngQuant(){
    if ((document.getElementById('quant') as HTMLInputElement).value) {
      const value:number = parseInt((document.getElementById('quant') as HTMLInputElement).value);
      if (value > 1) {
        this.orderProd.quant = value;
        this.orderProd.totPrice = this.orderProd.unitPrice * value;
      }
    } else {
      this.orderProd.totPrice = this.orderProd.unitPrice * this.orderProd.quant;
    }
  }

  InclAll(val:string){
    if (val === 'Si') {
      this.orderProd.inclAll = val;
      delete this.orderProd.rmvCond;
    } else {
      this.orderProd.inclAll = val;
      this.orderProd.rmvCond = [];
    }
  }

  editInclAll(val:string){
    if (val === 'Si') {
      this.prodEdit.inclAll = val;
      delete this.prodEdit.rmvCond;
    } else {
      this.prodEdit.inclAll = val;
      this.prodEdit.rmvCond = [];
    }
  }

  isIngrDel(cond:string){
    if (this.delIngr.includes(cond) === false) {
      this.delIngr.push(cond);
    } else {
      const i = this.delIngr.indexOf(cond);
      this.delIngr.splice(i,1);
    }
  }

  editIsIngrDel(cond:string){
    if (this.editDelIngr.includes(cond) === false) {
      this.editDelIngr.push(cond);
    } else {
      const i = this.editDelIngr.indexOf(cond);
      this.editDelIngr.splice(i, 1);
    }
  }

  editDelCond(cond:string){
    document.getElementById('flexRadioDefaultDos')?.click();
    this.editIsIngrDel(cond);
  }

  delCond(cond:string){
    document.getElementById('flexRadioDefault2')?.click();
    this.isIngrDel(cond);
  }

  editMenuProd(attr:any){
    this.prodEdit[attr] = (document.getElementById(attr) as HTMLInputElement).value;
  }

  selectModal(modalSel:number, val?:any, index?:any){
    this.modalSel = modalSel;
    this.selectedMod = this.modalOpts[modalSel]
    switch (modalSel) {
      case 0:
        this.prodPref = val;
        this.orderProd.id = val.id;
        this.orderProd.name = val.name;
        this.orderProd.type = val.type;
        this.orderProd.unitPrice = val.price;
        break;
      case 1:
        this.prodSel = val;
        this.prodSel.index = index;
        this.menu.forEach(prod=>{
          if (this.prodSel.id === prod.id && this.prodSel.name === prod.name && this.prodSel.type === prod.type) {
            this.prodIngrs = prod.detailArr;
          }
        })
        break;
      default:
      break;
    }
  }

  getMenu(){
    this.spinner.show();
    this.orders.getMenu(this.admins.getSessionAdmin())
    .subscribe(
      resp=>{
        const gotMenu:any[] = resp.body.message;
        this.menu = gotMenu;
        if (gotMenu.length <= 2) {
          const group:any[] = []
          gotMenu.map((prod)=>{
            group.push(prod);
          })
          this.menuGroups.push(group);
          this.spinner.hide();
        } else {
          let group:any[] = [];
          let groupLength = 2;
          for (let i = 0; i < gotMenu.length; i++) {
            if (i < groupLength) {
              group.push(gotMenu[i]);
            } else {
              this.menuGroups.push(group);
              group = [];
              groupLength+=2;
              group.push(gotMenu[i]);
            }
          }
          this.menuGroups.push(group);
          this.spinner.hide();
        }
      },
      e=>{
        console.log(e);
        this.launchMessage('error','Error',e.body.message);
      }
    )
  }

  lEClean(){
    this.prodSel = {};
    this.prodEdit = { quant: 1};
    this.editDelIngr = [];
    (document.getElementById('quant') as HTMLInputElement).value = '';
  }

  lClean(){
    this.orderProd = { id:'', name: '', type: '', inclAll: 'Si', unitPrice: 0.00, quant: 1, totPrice: 0.00 };
    this.prodPref = '';
    this.delIngr = [];
  }

  getParams(){
    this.spinner.show();
    this.route.params
    .subscribe((params:Params)=>{
      if (params['order']) {
        this.order = params['order'];
      }
      this.spinner.hide();
    })
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
