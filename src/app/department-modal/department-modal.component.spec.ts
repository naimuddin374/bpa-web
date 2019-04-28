import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentModalComponent } from './department-modal.component';

describe('DepartmentModalComponent', () => {
  let component: DepartmentModalComponent;
  let fixture: ComponentFixture<DepartmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
