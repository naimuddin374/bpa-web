import { Component, OnInit, AfterViewInit } from '@angular/core';
import { EmployeeImageUrl } from '../common';
import { ApiService } from '../_services/api.service';
import {
  MatDialog,
  MatDialogRef,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements AfterViewInit, OnInit {
  profile: any = [];
  isEmpty: boolean;
  isLoading: boolean;
  employeeImageUrl: string = EmployeeImageUrl;
  image: any = '';

  dialogRef: MatDialogRef<ProfileModalComponent>;

  constructor(public api: ApiService, public dialog: MatDialog) {
    this.isEmpty = false;
    this.isLoading = true;
    this.profile = [];
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getList();
  }

  getList() {
    this.isLoading = true;
    this.api
      ._get('user/profile')
      .then(result => {
        this.profile = result['profile'][0];
        this.image = this.employeeImageUrl + result['profile'][0]['image'];
        this.isLoading = false;
        this.isEmpty = Object.keys(this.profile).length <= 0 ? true : false;
      })
      .catch(error => {
        console.log(error);
      });
  }

  edit() {
    this.dialogRef = this.dialog.open(ProfileModalComponent, {
      hasBackdrop: true,
      width: '600px',
      data: { },
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getList();
      }
    });
  }
}
