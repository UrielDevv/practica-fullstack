import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProductos } from './detalle-productos';

describe('DetalleProductos', () => {
  let component: DetalleProductos;
  let fixture: ComponentFixture<DetalleProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
