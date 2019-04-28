import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailModalComponent } from './report-detail-modal.component';

describe('ReportDetailModalComponent', () => {
  let component: ReportDetailModalComponent;
  let fixture: ComponentFixture<ReportDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
