import { OnInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RoleComponent } from '../role/role.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss']
})
export class RoleModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  isDone: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<RoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private auth: AuthenticationService
  ) {
    this.isReadyToSave = false;
    this.isDone = true;

    this.form = formBuilder.group({
      role: ['', Validators.required]
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });

    if (this.data.action === 'Edit') {
      this.setData(this.data.data);
    }
  }

  ngOnInit() {}

  setData(data: any) {
    this.form.get('role').setValue(data['role']);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  add() {
    this.isDone = false;
    const formData = new FormData();
    formData.append('userId', this.auth.getUser()['id'].toString());
    formData.append('role', this.form.value.role.trim());
    this.api._submit(formData, 'role/add').then(
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
    formData.append('role', this.form.value.role.trim());
    this.api._submit(formData, 'role/edit/' + this.data.data.id).then(
      result => {
        this.isDone = true;
        console.log(result);
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
