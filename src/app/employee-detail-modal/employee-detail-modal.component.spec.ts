import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailModalComponent } from './employee-detail-modal.component';

describe('EmployeeDetailModalComponent', () => {
  let component: EmployeeDetailModalComponent;
  let fixture: ComponentFixture<EmployeeDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
