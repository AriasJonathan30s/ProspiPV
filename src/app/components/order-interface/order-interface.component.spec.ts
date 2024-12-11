import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderInterfaceComponent } from './order-interface.component';

describe('OrderInterfaceComponent', () => {
  let component: OrderInterfaceComponent;
  let fixture: ComponentFixture<OrderInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderInterfaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
