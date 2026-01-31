import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBoutiqueComponent } from './register-boutique.component';

describe('RegisterBoutiqueComponent', () => {
  let component: RegisterBoutiqueComponent;
  let fixture: ComponentFixture<RegisterBoutiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterBoutiqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterBoutiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
