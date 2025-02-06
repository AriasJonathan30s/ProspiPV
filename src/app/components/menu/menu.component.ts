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
  filters:any[] = [''];
  menuGroups:any[] = [];
  order:any;
  modalOpts:any[] = ['Preferencia de pedido','Edita orden','Elimina orden', 'Revisa orden'];
  modalSel:any;
  selectedMod:any;
  orderProds:any[] = [];
  prodPref:any;
  prodPrefDtlArr:any[] = [];
  delIngr:any[] = [];
  editDelIngr:any[] = [];
  orderProd:any = { id:'', name: '', type: '', inclAll: 'Si', unitPrice: 0.00, quant: 1, totPrice: 0.00 };;
  prodSel:any;
  prodIngrs:any[] = [];
  prodEdit:any = { quant: 1};
  disable:boolean = true;
  frenchFries:number = 0;
  frnFriesOpts:any[] = ['No','Si'];
  gotAddlConds:any[] = [];
  showAddlConds:any[] = [];
  addAddlIngr:any[] = [];

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

  menuClean(){
    this.menuGroups = [];
  }

  filter(name:string){
    this.menuClean();
    let fulteredMenu:any[] = [];
    if (!name) {
      this.grouper(this.menu);
    } else {
      this.menu.forEach(product=>{
        if (product.name === name) {
          fulteredMenu.push(product)
        }
      })
      this.grouper(fulteredMenu);
    }
    this.unactiveFlt(name);
  }

  unactiveFlt(name:string){
    this.filters.forEach(fltsNm=>{
      if (fltsNm === name) {
        document.getElementById(fltsNm+'filter')?.setAttribute('class','btn btn-outline-primary active');
      } else {
        document.getElementById(fltsNm+'filter')?.setAttribute('class','btn btn-outline-primary');
      }
    })
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

  alert(turn:number){
    if (turn) {
      const alertClass = "position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle";
      document.getElementById('alertClass')?.setAttribute('class', alertClass);
    } else {
      document.getElementById('alertClass')?.removeAttribute('class');
    }
  }

  rmvRlFrmOrder(){
    this.orderProds.splice(this.prodSel.index ,1);
  }

  scrollTop(){
    document.documentElement.scrollTop = 0;
  }

  submit(){
    switch (this.selectedMod) {
      case this.modalOpts[0]:
        this.addProd(this.orderProd);
        this.alert(1);
        this.lClean();
        this.scrollTop();
        break;
      case this.modalOpts[1]:
        this.modifOrder();
        this.lEClean();
        this.scrollTop();
        break;
      case this.modalOpts[2]:
        this.rmvRlFrmOrder();
        if (this.orderProds.length === 0) {
          this.alert(0);
        }
        this.scrollTop();
        break;
        case this.modalOpts[3]:
          this.alert(0);
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

  addAddls(){
      this.orderProd.adds = this.frenchFries;
      this.orderProd.extraConds = this.addAddlIngr;
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
    }
  }

  build(option:number){
    switch (option) {
      case 0:
        this.rmvConds();
        this.addAddls();
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
        this.launchMessage('success','Atención','Cantidad agregada.');
      }
    } else {
      this.orderProd.totPrice = this.orderProd.unitPrice * this.orderProd.quant;
    }
  }

  iclFrFrieds(){
    if (this.frenchFries === 0) {
      this.frenchFries = 1;
    } else {
      this.frenchFries = 0;
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

  filterAddlCond(){
    const filterVal:string = (document.getElementById('filterAddlCond') as HTMLInputElement).value;
    if (filterVal === '') {
      this.showAddlConds = this.gotAddlConds;
    } else {
      const conds:any[] = [];
      this.gotAddlConds.forEach(group=>{
        let condim:any[] = group;
        condim.forEach(cond=>{
          conds.push(cond);
        })
      })
      const filteredConds:any[] = [];
      conds.forEach(cond=>{
        if (cond.includes(filterVal)) {
          filteredConds.push(cond);
        }
      })
      const grpsCnds:any[] = [];
      let grpCnds:any[] = [];
      let grpQnt:number = 2;
      if (filteredConds.length <= 3) {
        this.showAddlConds = [filteredConds];
      } else {
        filteredConds.forEach((cond,index)=>{
          if (index <= grpQnt) {
            grpCnds.push(cond);
            if (filteredConds.length === index+1) {
              grpsCnds.push(grpCnds);
            }
          } else {
            grpsCnds.push(grpCnds);
            grpCnds = [];
            grpQnt += 3;
            grpCnds.push(cond);
          }
        })
        this.showAddlConds = grpsCnds;
      }
    }
  }

  addlCond(cond:string){
    if (this.addAddlIngr.includes(cond) === false) {
      this.addAddlIngr.push(cond);
    } else {
      const i = this.addAddlIngr.indexOf(cond);
      this.addAddlIngr.splice(i,1);
    }
  }

  delCond(cond:string){
    document.getElementById('flexRadioDefault2')?.click();
    this.isIngrDel(cond);
  }

  editMenuProd(attr:any){
    this.prodEdit[attr] = (document.getElementById(attr) as HTMLInputElement).value;
  }

  returnBtn(option:number){
    switch (option) {
      case 0:
        document.getElementById('returnBtn')?.removeAttribute('data-bs-toggle');
        document.getElementById('returnBtn')?.removeAttribute('data-bs-target');
        document.getElementById('returnBtn')?.setAttribute('data-bs-dismiss','modal')
        break;
      case 1:
        document.getElementById('returnBtn')?.removeAttribute('data-bs-dismiss');
        document.getElementById('returnBtn')?.setAttribute('data-bs-toggle','modal')
        document.getElementById('returnBtn')?.setAttribute('data-bs-target','#actionModal')
        break;
      default:
        break;
    }
  }

  dtlGrouper(){
    const prodPrefDtlArr:any[] = this.prodPref.detailArr;
    const grpedProds:any[] = []
    let grpQnt = 2;
    if (this.prodPref.detailArr.length <= 3) {
      this.prodPrefDtlArr = this.prodPref.detailArr;
    } else {
      let grpProds:any[] = [];
      prodPrefDtlArr.forEach((cond,index)=>{
        if (index <= grpQnt) {
          grpProds.push(cond)
          if (this.prodPref.detailArr.length === index+1) {
            grpedProds.push(grpProds)
          }
        } else {
          grpQnt += 3;
          grpedProds.push(grpProds)
          grpProds = [];
          grpProds.push(cond)
        }
      })
      this.prodPrefDtlArr = grpedProds;
    }
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
        this.dtlGrouper();
        this.returnBtn(1);
        break;
      case 1:
        this.prodSel = val;
        this.prodSel.index = index;
        this.menu.forEach(prod=>{
          if (this.prodSel.id === prod.id && this.prodSel.name === prod.name && this.prodSel.type === prod.type) {
            this.prodIngrs = prod.detailArr;
          }
        })
        this.returnBtn(1);
        break;
      case 2:
        this.prodSel =  this.orderProds[index];
        this.prodSel.index = index;
        this.returnBtn(0);
        break;
      case 3:
        this.returnBtn(0);
        break;
      default:
      break;
    }
  }

  grouper(gotMenu:any[]){
    if (gotMenu.length <= 3) {
      const group:any[] = []
      gotMenu.map((prod)=>{
        group.push(prod);
      })
      this.menuGroups.push(group);
      this.spinner.hide();
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
      this.spinner.hide();
    }
  }

  getMenu(){
    this.spinner.show();
    this.orders.getMenu(this.admins.getSessionAdmin())
    .subscribe(
      resp=>{
        this.gotAddlConds = resp.body.message[1];
        this.showAddlConds = resp.body.message[1];
        const filters:any[] = resp.body.message[0][1];
        filters.forEach(name=>{
          this.filters.push(name)
        })
        this.menu = resp.body.message[0][0];
        this.grouper(resp.body.message[0][0]);
        document.getElementById(this.filters[0]+'filter')?.setAttribute('class','btn btn-outline-primary active');
      },
      e=>{
        console.warn(e);
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
        if (this.order) {
          this.disable = false;
        }
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
