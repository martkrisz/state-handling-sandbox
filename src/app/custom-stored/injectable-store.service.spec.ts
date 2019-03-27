import { TestBed } from '@angular/core/testing';

import { InjectableStoreService } from './injectable-store.service';

describe('InjectableStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InjectableStoreService = TestBed.get(InjectableStoreService);
    expect(service).toBeTruthy();
  });
});
