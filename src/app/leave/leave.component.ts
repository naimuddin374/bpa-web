import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import { ApiService } from '../_services/api.service';
import { LeaveModalComponent } from '../leave-modal/leave-modal.component';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/role';

export interface Data {
  id: number;
  categories: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'fullName',
    'empId',
    'department',
    'leave_type',
    'purpose',
    'leave_from',
    'leave_to',
    'total_day',
    'supervisor_approval',
    'hr_approval',
    'created_at',
    'action'
  ];
  list: any = [];

  dialogRef: MatDialogRef<LeaveModalComponent>;
  isEmpty: boolean;
  isLoading: boolean;
  isDelete: boolean;
  leavePending: boolean;

  constructor(
    public api: ApiService,
    public dialog: MatDialog,
    private auth: AuthenticationService
  ) {
    this.isEmpty = false;
    this.isLoading = true;
    this.list = [];
    this.isDelete = false;
    this.leavePending = true;
  }

  ngOnInit() {
    this.getList();
  }

  add(): void {
    this.dialogRef = this.dialog.open(LeaveModalComponent, {
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
  }

  getList() {
    this.isLoading = true;
    this.api
      ._get('leave/list-byid/' + this.auth.getUser()['id'])
      .then(result => {
        this.isLoading = false;
        this.list = result['list'];
        if (this.auth.getUser()['employeeId'] === result['list'][0].emp_id) {
          this.isDelete = true;
        }
        for (let i = 0; i < result['list'].length; i++) {
          if ((this.list[i]['supervisor_approval'] === 0) || (this.list[i]['hr_approval'] === 0)) {
            this.leavePending = false;
          }
        }
        this.isEmpty = Object.keys(result['list']).length <= 0 ? true : false;
        this.init();
      })
      .catch(error => {
        console.log(error);
        this.isLoading = false;
      });
  }

  edit(data) {
    if (this.auth.getUser()['role'] === Role.Supervisor) {
      if (data['supervisor_approval'] === 2) {
        this.api.showSnackBar('You have already give approval.', '');
        return;
      }
    } else if (this.auth.getUser()['role'] === Role.HR) {
      if (data['hr_approval'] === 2) {
        this.api.showSnackBar('You have already give approval.', '');
        return;
      }
    } else if (this.auth.getUser()['employeeId'] === data['emp_id']) {
      if (data['supervisor_approval'] === 1 || data['hr_approval'] === 1) {
        // console.log(data['supervisor_approval'], data['hr_approval']);
        // console.log(this.auth.getUser()['employeeId'], data['emp_id']);
      } else {
        this.api.showSnackBar('You can\'t edit.', '');
        return;
      }
    }

    this.dialogRef = this.dialog.open(LeaveModalComponent, {
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
        ._get('leave/delete/' + id)
        .then(result => {
          this.api.showSnackBar(result['message'], '');
          this.getList();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
}
