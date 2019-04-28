import {
  OnInit,
  Component,
  Inject,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { DatePipe } from '@angular/common';
import {
  AuthenticationService
} from '../_services/authentication.service';
import { LeaveComponent } from '../leave/leave.component';
import { Role } from '../_models/role';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: 'app-leave-modal',
  templateUrl: './leave-modal.component.html',
  styleUrls: ['./leave-modal.component.scss']
})
export class LeaveModalComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  private files: any = [];
  isReadyToSave: boolean;
  isDone: boolean;
  designations: Array<Object> = [];
  leave: any;
  isShowApprove: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<LeaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public datepipe: DatePipe,
    private auth: AuthenticationService
  ) {
    this.isReadyToSave = false;
    this.isDone = true;
    this.isShowApprove = false;

    this.form = formBuilder.group({
      leaveType: ['', Validators.required],
      purpose: ['', Validators.required],
      leaveFrom: ['', Validators.required],
      leaveTo: ['', Validators.required],
      totalDay: ['', Validators.required],
      isApproved: ['']
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });

    if (this.data.action === 'Add') {
      this.getLeaveStatus('leave/remain/' + this.auth.getUser()['employeeId']);
    }

    if (this.data.action === 'Edit') {
      this.setData(this.data.data);
      this.getLeaveStatus('leave/remain/' + this.data.data.emp_id);
    }
  }

  ngOnInit() {
    this.getDesignations();
  }

  ngAfterViewInit() {}

  getDesignations() {
    this.api
      ._get('designation/list')
      .then(result => {
        this.designations = result['list'];
      })
      .catch(error => {
        console.error(error);
      });
  }

  getLeaveStatus(url) {
    this.api
      ._get(url)
      .then(result => {
        console.log(result);
        this.leave = result['remain'];
      })
      .catch(error => {
        console.error(error);
      });
  }

  setData(data: any) {
    console.log(data);
    this.form.get('leaveType').setValue(data['leave_type']);
    this.form.get('purpose').setValue(data['purpose']);
    this.form.get('leaveFrom').setValue(data['leave_from']);
    this.form.get('leaveTo').setValue(data['leave_to']);
    this.form.get('totalDay').setValue(data['total_day']);

    if (this.auth.getUser()['role'] === Role.Supervisor) {
      this.isShowApprove = true;
      this.form.get('isApproved').setValue(data['supervisor_approval'].toString());
    } else if (this.auth.getUser()['role'] === Role.HR) {
      this.isShowApprove = true;
      this.form.get('isApproved').setValue(data['hr_approval'].toString());
    } else {
      this.isShowApprove = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  dateDiffInDays(date1, date2) {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    return Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  }

  setTotalDay() {
    const total = this.dateDiffInDays(
      this.datepipe.transform(this.form.value.leaveFrom, 'MM/dd/yyyy'),
      this.datepipe.transform(this.form.value.leaveTo, 'MM/dd/yyyy')
    );
    if (total === 0) {
      this.form.get('totalDay').setValue(0.5);
    } else {
      this.form.get('totalDay').setValue(total);
    }
  }

  add() {
    console.log(this.form.value.totalDay);
    if (
      this.form.value.leaveType === 'Casual' &&
      this.leave.casual_leave_remain < this.form.value.totalDay
    ) {
      this.api.showSnackBar('Your casual leave will exceed.', '');
      return;
    } else if (
      this.form.value.leaveType === 'Sick' &&
      this.leave.sick_leave_remain < this.form.value.totalDay
    ) {
      this.api.showSnackBar('Your sick leave will exceed.', '');
      return;
    } else if (
      this.form.value.leaveType === 'Other' &&
      this.leave.other_leave_remain < this.form.value.totalDay
    ) {
      this.api.showSnackBar('Your sick leave will exceed.', '');
      return;
    }

    this.isDone = false;
    const formData = new FormData();
    formData.append('empId', this.auth.getUser()['employeeId'].toString());
    formData.append('degId', this.auth.getUser()['designationId'].toString());
    formData.append('leaveType', this.form.value.leaveType);
    formData.append('purpose', this.form.value.purpose.trim());
    formData.append('totalDay', this.form.value.totalDay);
    formData.append('supervisorApproval', '0');
    formData.append('hrApproval', '0');
    formData.append(
      'leaveFrom',
      this.datepipe.transform(this.form.value.leaveFrom, 'yyyy-MM-dd')
    );
    formData.append(
      'leaveTo',
      this.datepipe.transform(this.form.value.leaveTo, 'yyyy-MM-dd')
    );

    this.api._submit(formData, 'leave/add').then(
      result => {
        this.isDone = true;
        console.log(result);
        this.form.reset();
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      },
      err => {
        this.isDone = true;
        console.log(err);
      }
    );
  }

  edit() {
    this.isDone = false;
    const formData = new FormData();
    if (this.auth.getUser()['role'] === Role.Supervisor) {
      formData.append('role', Role.Supervisor);
      formData.append('isApproved', this.form.value.isApproved);
    } else if (this.auth.getUser()['role'] === Role.HR) {
      formData.append('role', Role.HR);
      formData.append('isApproved', this.form.value.isApproved);
    } else {
      formData.append('role', this.auth.getUser()['role']);
    }
    formData.append('leaveType', this.form.value.leaveType);
    formData.append('empId', this.data.data.emp_id);
    formData.append('updatedBy', this.auth.getUser()['employeeId'].toString());
    this.api._submit(formData, 'leave/edit/' + this.data.data.id).then(
      result => {
        this.isDone = true;
        console.log(result);
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      },
      err => {
        this.isDone = true;
        this.api.showSnackBar(err, '');
        console.log(err);
      }
    );
  }
}
