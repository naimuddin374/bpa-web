import { OnInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserComponent } from '../user/user.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  isDone: boolean;
  employees: Array<Object> = [];
  departments: Array<Object> = [];
  roles: Array<Object> = [];

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<UserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private auth: AuthenticationService
  ) {
    this.isReadyToSave = false;
    this.isDone = true;

    this.form = formBuilder.group({
      dptId: ['', Validators.required],
      empId: ['', Validators.required],
      roleId: ['', Validators.required],
      email: ['', Validators.required],
      password1: [''],
      password2: [''],
      status: ['', Validators.required]
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });

    if (this.data.action === 'Edit') {
      this.setData(this.data.data);
    }
  }

  ngOnInit() {
    this.getRoles();
    this.getDepartments();
  }

  changeDepartment(value) {
    this.getEmployees(value);
  }

  onKey(event: any) {
    if (event.target.value.length > 2) {
      if (this.form.value.password1 === '') {
        this.isReadyToSave = false;
        this.api.showSnackBar('Password required!', '');
      } else if (this.form.value.password1 !== event.target.value) {
        this.isReadyToSave = false;
        this.api.showSnackBar('Confirm password doesn\'t match!', '');
      } else {
        this.isReadyToSave = true;
        this.api.showSnackBar('Password match', '');
      }
    }
  }

  getEmployees(dptId) {
    this.api
      ._get('employee/list/' + dptId)
      .then(result => {
        this.employees = result['empListByDeptId'];
      })
      .catch(error => {
        console.log(error);
      });
  }

  getDepartments() {
    this.api
      ._get('department/list')
      .then(result => {
        this.departments = result['list'];
      })
      .catch(error => {
        console.log(error);
      });
  }

  getRoles() {
    this.api
      ._get('role/list')
      .then(result => {
        this.roles = result['list'];
      })
      .catch(error => {
        console.log(error);
      });
  }

  setData(data: any) {
    this.getEmployees(data['department_id']);
    this.form.get('dptId').setValue(data['department_id']);
    this.form.get('email').setValue(data['email']);
    this.form.get('roleId').setValue(data['role_id']);
    this.form.get('empId').setValue(data['emp_id']);
    this.form.get('status').setValue(data['status'].toString());
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  add() {
    if (this.form.value.password1 !== this.form.value.password2) {
      this.api.showSnackBar('Confirm password doesn\'t match!', '');
      return;
    }

    this.isDone = false;
    const formData = new FormData();
    formData.append('userId', this.auth.getUser()['id'].toString());
    formData.append('empId', this.form.value.empId);
    formData.append('roleId', this.form.value.roleId);
    formData.append('email', this.form.value.email);
    formData.append('password', this.form.value.password2);
    formData.append('status', this.form.value.status);
    this.api._submit(formData, 'user/add').then(
      result => {
        this.isDone = true;
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
    formData.append('empId', this.form.value.empId);
    formData.append('roleId', this.form.value.roleId);
    formData.append('email', this.form.value.email);
    formData.append('status', this.form.value.status);
    this.api._submit(formData, 'user/edit/' + this.data.data.id).then(
      result => {
        this.isDone = true;
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
}
