import {
  OnInit,
  Component,
  Inject,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmployeeComponent } from '../employee/employee.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { DatePipe } from '@angular/common';
import { EmployeeImageUrl } from '../common';
import {
  AuthenticationService,
  User
} from '../_services/authentication.service';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: 'app-employee-modal',
  templateUrl: './employee-modal.component.html',
  styleUrls: ['./employee-modal.component.scss']
})
export class EmployeeModalComponent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  private files: any = [];
  isReadyToSave: boolean;
  isDone: boolean;
  departments: Array<Object> = [];
  supervisor: Array<Object> = [];
  designations: Array<Object> = [];

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<EmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public datepipe: DatePipe,
    private auth: AuthenticationService
  ) {
    this.isReadyToSave = false;
    this.isDone = true;

    this.form = formBuilder.group({
      departmentId: ['', Validators.required],
      supervisorId: [''],
      designationId: ['', Validators.required],
      category: ['', Validators.required],
      code: [''],
      type: ['', Validators.required],
      status: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      contact: ['', Validators.required],
      address: ['', Validators.required],
      joining: ['', Validators.required],
      sickLeave: ['', Validators.required],
      casualLeave: ['', Validators.required],
      otherLeave: [''],
      dob: ['', Validators.required],
      salary: ['', Validators.required],
      image: [''],
      provisionPeriodEnd: [''],
      bloodGroup: [''],
      emrCntName: [''],
      emrCntPhone: [''],
      emrCntRelation: ['']
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
    if (this.data.action === 'Edit') {
      this.setData(this.data.data);
    }
  }

  ngOnInit() {
    this.getDepartments();
  }

  ngAfterViewInit() {}

  getDepartments() {
    this.api
      ._get('department/list')
      .then(result => {
        this.departments = result['list'];
        this.getSupervisor();
      })
      .catch(error => {
        console.error(error);
      });
  }

  getSupervisor() {
    this.api
      ._get('employee/supervisor/list')
      .then(result => {
        this.supervisor = result['list'];
        this.getDesignations();
      })
      .catch(error => {
        console.error(error);
      });
  }

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

  setData(data: any) {
    this.form.get('departmentId').setValue(data['department_id']);
    this.form.get('supervisorId').setValue(data['supervisor_id']);
    this.form.get('designationId').setValue(data['designation_id']);
    this.form.get('category').setValue(data['category']);
    this.form.get('type').setValue(data['type']);
    this.form.get('status').setValue(data['status']);
    this.form.get('firstName').setValue(data['first_name']);
    this.form.get('lastName').setValue(data['last_name']);
    this.form.get('contact').setValue(data['contact']);
    this.form.get('email').setValue(data['email']);
    this.form.get('address').setValue(data['address']);
    this.form.get('joining').setValue(data['joining']);
    this.form.get('provisionPeriodEnd').setValue(data['provision_period_end']);
    this.form.get('sickLeave').setValue(data['sick_leave']);
    this.form.get('casualLeave').setValue(data['casual_leave']);
    this.form.get('otherLeave').setValue(data['other_leave']);
    this.form.get('dob').setValue(data['dob']);
    this.form.get('bloodGroup').setValue(data['blood_group']);
    this.form.get('code').setValue(data['code']);
    this.form.get('salary').setValue(data['salary']);
    this.form.get('image').setValue(EmployeeImageUrl + data['image']);
    this.form.get('emrCntName').setValue(data['emr_cnt_name']);
    this.form.get('emrCntPhone').setValue(data['emr_cnt_phone']);
    this.form.get('emrCntRelation').setValue(data['emr_cnt_relation']);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  add() {
    this.isDone = false;
    const formData = new FormData();
    formData.append('userId', this.auth.getUser()['id'].toString());
    formData.append('departmentId', this.form.value.departmentId);
    formData.append('supervisorId', this.form.value.supervisorId);
    formData.append('designationId', this.form.value.designationId);
    formData.append('category', this.form.value.category);
    formData.append('type', this.form.value.type);
    formData.append('salary', this.form.value.salary);
    formData.append('status', this.form.value.status);
    formData.append('firstName', this.form.value.firstName.trim());
    formData.append('lastName', this.form.value.lastName.trim());
    formData.append('contact', this.form.value.contact);
    formData.append('email', this.form.value.email.trim());
    formData.append('address', this.form.value.address.trim());
    formData.append(
      'joining',
      this.datepipe.transform(this.form.value.joining, 'yyyy-MM-dd')
    );
    formData.append(
      'provisionPeriodEnd',
      this.datepipe.transform(this.form.value.provisionPeriodEnd, 'yyyy-MM-dd')
    );
    formData.append('sickLeave', this.form.value.sickLeave);
    formData.append('casualLeave', this.form.value.casualLeave);
    formData.append('otherLeave', this.form.value.otherLeave);
    formData.append(
      'dob',
      this.datepipe.transform(this.form.value.dob, 'yyyy-MM-dd')
    );
    formData.append('bloodGroup', this.form.value.bloodGroup);
    formData.append('code', this.form.value.code.trim());
    formData.append('emrCntName', this.form.value.emrCntName);
    formData.append('emrCntPhone', this.form.value.emrCntPhone);
    formData.append('emrCntRelation', this.form.value.emrCntRelation);
    formData.append('image', this.files);
    this.api._submit(formData, 'employee/add').then(
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
    formData.append('userId', this.auth.getUser()['id'].toString());
    formData.append('departmentId', this.form.value.departmentId);
    formData.append('supervisorId', this.form.value.supervisorId);
    formData.append('designationId', this.form.value.designationId);
    formData.append('category', this.form.value.category);
    formData.append('type', this.form.value.type);
    formData.append('salary', this.form.value.salary);
    formData.append('status', this.form.value.status);
    formData.append('firstName', this.form.value.firstName.trim());
    formData.append('lastName', this.form.value.lastName.trim());
    formData.append('contact', this.form.value.contact);
    formData.append('email', this.form.value.email.trim());
    formData.append('address', this.form.value.address.trim());
    formData.append(
      'joining',
      this.datepipe.transform(this.form.value.joining, 'yyyy-MM-dd')
    );
    formData.append(
      'provisionPeriodEnd',
      this.datepipe.transform(this.form.value.provisionPeriodEnd, 'yyyy-MM-dd')
    );

    if (
      this.data.data['sick_leave'] < this.form.value.sickLeave ||
      this.data.data['sick_leave'] > this.form.value.sickLeave
    ) {
      let totalSick = this.data.data['sick_leave'] || 0;
      let totalSickRemain = this.data.data['sick_leave_remain'] || 0;

      totalSick += this.form.value.sickLeave - this.data.data['sick_leave'];
      totalSickRemain +=
        this.form.value.sickLeave - this.data.data['sick_leave'];

      formData.append('sickLeave', totalSick);
      formData.append('sickLeaveRemain', totalSickRemain); // sick_leave_remain
    } else {
      formData.append('sickLeaveRemain', this.data.data['sick_leave_remain']);
      formData.append('sickLeave', this.form.value.sickLeave);
    }

    if (
      this.data.data['casual_leave'] < this.form.value.casualLeave ||
      this.data.data['casual_leave'] > this.form.value.casualLeave
    ) {
      let totalCasual = this.data.data['casual_leave'] || 0;
      let totalCasualRemain = this.data.data['casual_leave_remain'] || 0;

      totalCasual +=
        this.form.value.casualLeave - this.data.data['casual_leave'];
      totalCasualRemain +=
        this.form.value.casualLeave - this.data.data['casual_leave'];

      formData.append('casualLeave', totalCasual);
      formData.append('casualLeaveRemain', totalCasualRemain); // casual_leave_remain
    } else {
      formData.append(
        'casualLeaveRemain',
        this.data.data['casual_leave_remain']
      );
      formData.append('casualLeave', this.form.value.casualLeave);
    }

    if (
      this.data.data['other_leave'] < this.form.value.otherLeave ||
      this.data.data['other_leave'] > this.form.value.otherLeave
    ) {
      let totalOther = this.data.data['other_leave'] || 0;
      let totalOtherRemain = this.data.data['other_leave_remain'] || 0;

      totalOther += this.form.value.otherLeave - this.data.data['other_leave'];
      totalOtherRemain +=
        this.form.value.otherLeave - this.data.data['other_leave'];

      formData.append('otherLeave', totalOther);
      formData.append('otherLeaveRemain', totalOtherRemain); // other_leave_remain
    } else {
      formData.append('otherLeaveRemain', this.data.data['other_leave_remain']);
      formData.append('otherLeave', this.form.value.otherLeave);
    }

    formData.append(
      'dob',
      this.datepipe.transform(this.form.value.dob, 'yyyy-MM-dd')
    );
    formData.append('bloodGroup', this.form.value.bloodGroup);
    formData.append('code', this.form.value.code.trim());
    formData.append('emrCntName', this.form.value.emrCntName);
    formData.append('emrCntPhone', this.form.value.emrCntPhone);
    formData.append('emrCntRelation', this.form.value.emrCntRelation);
    formData.append('image', this.files);
    this.api._submit(formData, 'employee/edit/' + this.data.data.id).then(
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

  getImage() {
    this.fileInput.nativeElement.click();
  }

  processWebImage(event) {
    if (event.target.value) {
      try {
        if (event.target.files[0].size / 1024 > 300) {
          this.api.showSnackBar('Too big image', '');
          return;
        }

        const reader = new FileReader();
        reader.onload = readerEvent => {
          const imageData = (readerEvent.target as any).result;
          this.form.patchValue({ image: imageData });
        };
        this.files = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
      } catch (e) {
        console.log(e);
      }
    }
  }

  getImageStyle() {
    return 'url(' + this.form.controls['image'].value + ')';
  }
}
