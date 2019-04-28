import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAssetComponent } from './assign-asset.component';

describe('AssignAssetComponent', () => {
  let component: AssignAssetComponent;
  let fixture: ComponentFixture<AssignAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
