import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOfProduct } from './details-of-product';

describe('DetailsOfProduct', () => {
  let component: DetailsOfProduct;
  let fixture: ComponentFixture<DetailsOfProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsOfProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsOfProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
