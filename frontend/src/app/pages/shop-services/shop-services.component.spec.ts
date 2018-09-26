import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopServicesComponent } from './shop-services.component';

describe('ShopServicesComponent', () => {
  let component: ShopServicesComponent;
  let fixture: ComponentFixture<ShopServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
