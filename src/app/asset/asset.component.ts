import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import { ApiService } from '../_services/api.service';
import { AssetModalComponent } from '../asset-modal/asset-modal.component';

export interface Asset {
  id: number;
  role: string;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'company_name',
    'employee_name',
    'category_name',
    'code',
    'title',
    'description',
    'from_buy',
    'price',
    'purchase_date',
    'warranty',
    'note',
    'status',
    'action'
  ];
  list: any = [];

  dialogRef: MatDialogRef<AssetModalComponent>;
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
    this.dialogRef = this.dialog.open(AssetModalComponent, {
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
      this.list = new MatTableDataSource<Asset>(this.list);
      resolve(this.list);
    });
  }

  init() {
    this.createPaginatedList().then(value => {
      this.list.sort = this.sort;
      this.list.paginator = this.paginator;
    });
  }

  ngAfterViewInit() { }

  getList() {
    this.isLoading = true;
    this.api
      ._get('asset/list')
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
    this.dialogRef = this.dialog.open(AssetModalComponent, {
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
        ._get('asset/delete/' + id)
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
