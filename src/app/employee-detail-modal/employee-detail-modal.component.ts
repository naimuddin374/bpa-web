import { OnInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { EmployeeComponent } from '../employee/employee.component';
import { EmployeeImageUrl } from '../common';

export interface DialogData {
  data: any;
  action: string;
}
@Component({
  selector: 'app-employee-detail-modal',
  templateUrl: './employee-detail-modal.component.html',
  styleUrls: ['./employee-detail-modal.component.scss']
})
export class EmployeeDetailModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  isDone: boolean;
  public empData: any = [];
  public files: any = [];

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<EmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.empData = this.data.data;
    this.files = EmployeeImageUrl + this.empData['image'];
    console.log(this.empData);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
