import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApreciationsComponent } from './apreciations.component';

describe('ApreciationsComponent', () => {
  let component: ApreciationsComponent;
  let fixture: ComponentFixture<ApreciationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApreciationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApreciationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
