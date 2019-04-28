import { OnInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { LeaveReportComponent } from '../leave-report/leave-report.component';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: 'app-report-detail-modal',
  templateUrl: './report-detail-modal.component.html',
  styleUrls: ['./report-detail-modal.component.scss']
})
export class ReportDetailModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  isDone: boolean;
  leaveData: Array<object> = [];

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<LeaveReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.api
      ._get('leave/report-detail/' + this.data.data.id)
      .then(result => {
        this.leaveData = result['list'];
        // console.log(this.leaveData);
      })
      .catch(error => {
        console.log(error);
      });
  }

  setData(data: any) {
    // this.form.get('catId').setValue(data['category_id']);
    // this.form.get('subCategory').setValue(data['sub_category']);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
