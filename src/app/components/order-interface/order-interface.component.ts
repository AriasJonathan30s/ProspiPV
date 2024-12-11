import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-order-interface',
  templateUrl: './order-interface.component.html',
  styleUrl: '../../app.component.css'
})
export class OrderInterfaceComponent {
  modalTypes:any[] = ['Genera Orden','Agrega Orden','Modifica Orden','Realiza pago'];
  type:any;
  selectedModal:String = '';
  newOrder:any[] = [];

  order:any = {};
  foods:any[] = [ 'Hamburguesa', 'Hot dogs', 'Alitas' ];

  foodAdds:any[] = [ 'Verduras', 'Aderezos', 'Quesos', 'Salsas', 'Otros' ];
  selectAllAdds:number = 0;
  addsInclude:any = { verduras:0, aderezos:0, quesos:0, salsas:0, otros:0 };
  
  verduras:any[] = [ 'Lechuga', 'Jitomate', 'Cebolla', 'Picante' ];
  selectAllVerds:number = 0;
  verdurasIncl:any = { lechuga: 0, jitomate: 0, cebolla: 0, picante: 0 };

  aderezos:any[] = [ 'Mostaza', 'Mayonesa', 'Ranch', 'Especial' ];
  quesos:any[] = [ 'Manchego', 'Oaxaca', 'Amarillo' ];
  salsas: any[] = [ 'Catzup', 'Habanero', 'BBQ' ];
  otros: any[] = ['Tocino'];

  foodCompanion: any[] = ['Papas','Aros cebolla',''];


  constructor(
    private spinner: NgxSpinnerService,
    private message: MessageService,
    private orders: OrdersService
  ){}

  ngOnInit(){}

  showAdds(){

  }

  verdClicker(enaDisa:number){
    const verds:any[] = [ 'lechuga', 'jitomate', 'cebolla', 'picante' ];
    verds.map(verd=>{
      if (this.verdurasIncl[verd] === enaDisa) {
        document.getElementById(verd)?.click();
      }
    })
  }

  isVerdDisabled(allVerds:number){
    if (allVerds === 0) {
      this.selectAllVerds = 1;
      this.verdClicker(0);
    } else {
      this.selectAllVerds = 0;
      this.verdClicker(1);
    }
  }

  isVerdEnabled(verdVal:string){
    if (this.verdurasIncl[verdVal] === 0) {
      this.verdurasIncl[verdVal] = 1;
    } else if (this.verdurasIncl[verdVal] === 1) {
      this.verdurasIncl[verdVal] = 0;
    }
  }

  isAddDisabled(allAdds:number){
    if (allAdds === 0) {
      this.selectAllAdds = 1;
      this.addClicker(0);
    } else {
      this.selectAllAdds = 0;
      this.addClicker(1);
    }
  }

  addClicker(enaDisa:number){
    const adds:any[] = [ 'verduras', 'aderezos', 'quesos', 'salsas', 'otros' ];
    adds.map(addon=>{
      if (this.addsInclude[addon] === enaDisa) {
        document.getElementById(addon)?.click();
      }
    })
  }

  isAddEnabled(addsVal:string){
    if (this.addsInclude[addsVal] === 0) {
      this.addsInclude[addsVal] = 1;
    } else if (this.addsInclude[addsVal] === 1) {
      this.addsInclude[addsVal] = 0;
    }
  }

  modalType(type:number){
    this.type = type;
    this.selectedModal = this.modalTypes[type];
  }

  submit(){
    console.log(this.order)
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
