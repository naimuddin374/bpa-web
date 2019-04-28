import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { RoleModalComponent } from '../role-modal/role-modal.component';
import {
  MatDialog,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import { ApiService } from '../_services/api.service';

export interface Role {
  id: number;
  role: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'role',
    'created_at',
    'updated_at',
    'action'
  ];
  list: any = [];

  dialogRef: MatDialogRef<RoleModalComponent>;
  isEmpty: boolean;
  isLoading: boolean;

  constructor(public api: ApiService, public dialog: MatDialog) {
    this.isEmpty = false;
    this.isLoading = true;
    this.list = [];
  }

  ngOnInit() {
    this.getList();
  }

  add(): void {
    this.dialogRef = this.dialog.open(RoleModalComponent, {
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
      this.list = new MatTableDataSource<Role>(this.list);
      resolve(this.list);
    });
  }

  init() {
    this.createPaginatedList().then(value => {
      this.list.sort = this.sort;
      this.list.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {}

  getList() {
    this.isLoading = true;
    this.api
      ._get('role/list')
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
    this.dialogRef = this.dialog.open(RoleModalComponent, {
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
        ._get('role/delete/' + id)
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
