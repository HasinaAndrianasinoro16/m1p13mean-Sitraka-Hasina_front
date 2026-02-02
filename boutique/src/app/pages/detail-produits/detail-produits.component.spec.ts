import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProduitsComponent } from './detail-produits.component';

describe('DetailProduitsComponent', () => {
  let component: DetailProduitsComponent;
  let fixture: ComponentFixture<DetailProduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailProduitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
