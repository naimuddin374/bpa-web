import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAssetModalComponent } from './assign-asset-modal.component';

describe('AssignAssetModalComponent', () => {
  let component: AssignAssetModalComponent;
  let fixture: ComponentFixture<AssignAssetModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignAssetModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignAssetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
