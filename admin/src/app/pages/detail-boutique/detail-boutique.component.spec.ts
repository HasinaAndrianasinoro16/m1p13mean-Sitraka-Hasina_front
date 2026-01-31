import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBoutiqueComponent } from './detail-boutique.component';

describe('DetailBoutiqueComponent', () => {
  let component: DetailBoutiqueComponent;
  let fixture: ComponentFixture<DetailBoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailBoutiqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
