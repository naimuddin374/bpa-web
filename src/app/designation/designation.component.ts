import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DesignationModalComponent } from '../designation-modal/designation-modal.component';
import {
  MatDialog,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import { ApiService } from '../_services/api.service';

export interface Designation {
  id: number;
  designation: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'designation',
    'created_at',
    'updated_at',
    'action'
  ];
  list: any = [];

  dialogRef: MatDialogRef<DesignationModalComponent>;
  isEmpty: boolean;
  isLoading: boolean;

  constructor(public api: ApiService, public dialog: MatDialog) {
    this.isEmpty = false;
    this.isLoading = true;
    this.list = [];
  }

  ngOnInit() { }

  add(): void {
    this.dialogRef = this.dialog.open(DesignationModalComponent, {
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
      this.list = new MatTableDataSource<Designation>(this.list);
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
      ._get('designation/list')
      .then(result => {
        this.isLoading = false;
        this.list = result['list'];
        this.isEmpty = Object.keys(result['list']).length <= 0 ? true : false;
        this.init();
        console.log(this.list);
      })
      .catch(error => {
        console.log(error);
        this.isLoading = false;
      });
  }

  edit(data) {
    this.dialogRef = this.dialog.open(DesignationModalComponent, {
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
        ._get('designation/delete/' + id)
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
