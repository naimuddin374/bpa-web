import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import { ApiService } from '../_services/api.service';
import { EmployeeImageUrl } from '../common';
import { AssignAssetModalComponent } from '../assign-asset-modal/assign-asset-modal.component';

export interface AssignAsset {
  id: number;
  employee: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-assign-asset',
  templateUrl: './assign-asset.component.html',
  styleUrls: ['./assign-asset.component.scss']
})
export class AssignAssetComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  employeeImageUrl: string = EmployeeImageUrl;

  displayedColumns: string[] = [
    'id',
    'title',
    'assetCode',
    'fullName',
    'empId',
    'action'
  ];
  list: any = [];

  dialogRef: MatDialogRef<AssignAssetModalComponent>;
  isEmpty: boolean;
  isLoading: boolean;

  constructor(public api: ApiService, public dialog: MatDialog) {
    this.isEmpty = false;
    this.isLoading = true;
    this.list = [];
  }

  ngOnInit() {}

  add(): void {
    this.dialogRef = this.dialog.open(AssignAssetModalComponent, {
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
      this.list = new MatTableDataSource<AssignAsset>(this.list);
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
      ._get('assign-asset/list')
      .then(result => {
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
    this.dialogRef = this.dialog.open(AssignAssetModalComponent, {
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
        ._get('assign-asset/delete/' + id)
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
