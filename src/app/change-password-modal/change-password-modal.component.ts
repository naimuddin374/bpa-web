import { OnInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { NavComponent } from '../nav/nav.component';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  isDone: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<NavComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private auth: AuthenticationService
  ) {
    this.isReadyToSave = false;
    this.isDone = true;

    this.form = formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      lastPassword: ['', Validators.required]
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onKey(event: any) {
    if (event.target.value !== '') {
      if (this.form.value.newPassword === '') {
        this.isReadyToSave = false;
        this.api.showSnackBar('Password required!', '');
      } else if (this.form.value.newPassword !== event.target.value) {
        this.isReadyToSave = false;
        this.api.showSnackBar('Confirm password doesn\'t match!', '');
      } else {
        this.isReadyToSave = true;
        this.api.showSnackBar('Password match', '');
      }
    }
  }

  edit() {
    this.isDone = false;
    const formData = new FormData();
    formData.append('userId', this.auth.getUser()['id'].toString());
    formData.append('currentPassword', this.form.value.currentPassword);
    formData.append('password', this.form.value.lastPassword);
    this.api._submit(formData, 'user/change/password/').then(
      result => {
        console.log(result);
        this.api.showSnackBar('Password Changed Successfully.', '');
        this.isDone = true;
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      },
      err => {
        this.isDone = false;
        this.api.showSnackBar('Cureent password doesn\'t match!', '');
        console.error(err);
      }
    );
  }
}
