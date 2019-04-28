import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';
import {
  MatDialog,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import { ApiService } from '../_services/api.service';
import { EmployeeImageUrl } from '../common';
import { EmployeeDetailModalComponent } from '../employee-detail-modal/employee-detail-modal.component';

export interface Employee {
  id: number;
  employee: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  employeeImageUrl: string = EmployeeImageUrl;

  displayedColumns: string[] = [
    'id',
    'code',
    'image',
    'firstName',
    'lastName',
    'department',
    'supervisor',
    'email',
    'contact',
    'status',
    'action'
  ];
  list: any = [];

  dialogRef: MatDialogRef<EmployeeModalComponent>;
  detailDialogRef: MatDialogRef<EmployeeDetailModalComponent>;
  isEmpty: boolean;
  isLoading: boolean;

  constructor(public api: ApiService, public dialog: MatDialog) {
    this.isEmpty = false;
    this.isLoading = true;
    this.list = [];
  }

  ngOnInit() {}

  add(): void {
    this.dialogRef = this.dialog.open(EmployeeModalComponent, {
      hasBackdrop: true,
      width: '600px',
      data: { action: 'Add', data: {} }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getList();
      }
    });
  }

  createPaginatedList() {
    return new Promise(resolve => {
      this.list = new MatTableDataSource<Employee>(this.list);
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
    this.getList();
  }

  getList() {
    this.isLoading = true;
    this.api
      ._get('employee/list')
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

  edit(data) {
    this.dialogRef = this.dialog.open(EmployeeModalComponent, {
      hasBackdrop: true,
      width: '600px',
      data: { action: 'Edit', data: data }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getList();
      }
    });
  }

  delete(id) {
    if (confirm('Are you sure to delete this item?')) {
      this.api
        ._get('employee/delete/' + id)
        .then(result => {
          this.api.showSnackBar(result['message'], '');
          this.getList();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  detail(data) {
    // console.log(data)
    this.detailDialogRef = this.dialog.open(EmployeeDetailModalComponent, {
      hasBackdrop: true,
      width: '900px',
      data: { data: data }
    });

    this.detailDialogRef.afterClosed().subscribe(result => { });
  }
}
