import { OnInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { LoginComponent } from '../login/login.component';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.scss']
})
export class ForgotPasswordModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  isDone: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private auth: AuthenticationService
  ) {
    this.isReadyToSave = false;
    this.isDone = true;

    this.form = formBuilder.group({
      email: ['', Validators.required],
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  edit() {
    this.isDone = false;
    const formData = new FormData();
    formData.append('email', this.form.value.email);
    this.api._submit(formData, 'forgot').then(
      result => {
        console.log(result);
        this.api.showSnackBar('Please check your email.', '');
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1000);
      },
      err => {
        this.isDone = true;
        this.api.showSnackBar('Email doesn\'t match!', '');
        console.error(err);
      }
    );
  }
}
