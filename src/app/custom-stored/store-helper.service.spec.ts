import { TestBed, inject } from '@angular/core/testing';

import { StoreHelperService } from './store-helper.service';

describe('StoreHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StoreHelperService]
    });
  });

  it('should be created', inject([StoreHelperService], (service: StoreHelperService) => {
    expect(service).toBeTruthy();
  }));
});
