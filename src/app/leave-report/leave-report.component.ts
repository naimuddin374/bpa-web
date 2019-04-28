import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDatepicker
} from '@angular/material';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';

import * as moment from 'moment';
import { Moment } from 'moment';
import { ExcelService } from '../_services/excel.service';
import { ReportDetailModalComponent } from '../report-detail-modal/report-detail-modal.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY'
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

export interface Data {
  id: number;
  categories: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-leave-report',
  templateUrl: './leave-report.component.html',
  styleUrls: ['./leave-report.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class LeaveReportComponent implements AfterViewInit, OnInit {
  form: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  date = new FormControl(moment());
  displayedColumns: string[] = [
    'id',
    'department',
    'empId',
    'firstName',
    'lastName',
    'total_day',
    'action'
  ];
  list: any = [];

  dialogRef: MatDialogRef<ReportDetailModalComponent>;
  isEmpty: boolean;
  isLoading: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialog: MatDialog,
    private auth: AuthenticationService,
    private excelService: ExcelService
  ) {
    this.isEmpty = false;
    this.isLoading = true;
    this.list = [];

    this.form = formBuilder.group({
      firstName: [''],
      lastName: ['']
    });
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normlizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normlizedMonth.month());
    this.date.setValue(ctrlValue);
    // tslint:disable-next-line:max-line-length
    this.getList(
      this.date.value._d.getFullYear() +
        '-' +
        (this.date.value._d.getMonth() < 10
          ? '0' + (this.date.value._d.getMonth() + 1)
          : this.date.value._d.getMonth() + 1)
    );
    datepicker.close();
  }

  ngOnInit() {}

  createPaginatedList() {
    return new Promise(resolve => {
      this.list = new MatTableDataSource<Data>(this.list);
      resolve(this.list);
    });
  }

  init() {
    this.createPaginatedList().then(value => {
      this.list.sort = this.sort;
      this.list.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.getList(
      this.date.value._d.getFullYear() +
        '-' +
        (this.date.value._d.getMonth() < 10
          ? '0' + (this.date.value._d.getMonth() + 1)
          : this.date.value._d.getMonth() + 1)
    );
  }

  getList(date) {
    this.isLoading = true;
    this.api
      ._get('leave/report/' + date)
      .then(result => {
        console.log(result);
        this.isLoading = false;
        this.list = result['list'];
        this.isEmpty = Object.keys(result['list']).length <= 0 ? true : false;
        this.init();
      })
      .catch(error => {
        console.log(error);
        this.isLoading = false;
      });
  }

  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.list.data, 'leave-report');
  }

  detail(data) {
    this.dialogRef = this.dialog.open(ReportDetailModalComponent, {
      hasBackdrop: true,
      width: '600px',
      data: { data: data }
    });

    this.dialogRef.afterClosed().subscribe(result => {});
  }

  onKey(event: any) {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('firstName', this.form.value.firstName.trim());
    formData.append('lastName', this.form.value.lastName.trim());
    this.api._submit(formData, 'leave/report/search/').then(
      result => {
        this.isLoading = false;
        // console.log(result);
        this.list = result['list'];
        this.isEmpty = Object.keys(result['list']).length <= 0 ? true : false;
        this.init();
      },
      err => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }
}
