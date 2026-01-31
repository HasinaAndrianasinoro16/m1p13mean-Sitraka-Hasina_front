import { TestBed } from '@angular/core/testing';

import { BoutiquesService } from './boutiques.service';

describe('BoutiquesService', () => {
  let service: BoutiquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoutiquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
