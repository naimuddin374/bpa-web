import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { first } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { ForgotPasswordModalComponent } from '../forgot-password-modal/forgot-password-modal.component';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  returnUrl: string;
  isReadyToSave: boolean;
  dialogRef: MatDialogRef<ForgotPasswordModalComponent>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private api: ApiService,
    public dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.isReadyToSave = false;

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });

    if (this.auth.isAuthorized()) {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    const formData = new FormData();
    formData.append('email', this.form.value.email);
    formData.append('password', this.form.value.password);
    this.auth
      .login(formData, 'user/login')
      .pipe(first())
      .subscribe(
        data => {
          this.api.showSnackBar('Successfully logged in', '');
          // localStorage.setItem('msg', 'Successfully Logged in');
          setTimeout(() => {
            location.reload(true);
            this.router.navigate([this.returnUrl]);
          }, 1000);
        },
        err => {
          this.api.showSnackBar(err || 'Something went wrong!', '');
          this.loading = false;
        }
      );
  }

  forgotPassword(): void {
    this.dialogRef = this.dialog.open(ForgotPasswordModalComponent, {
      hasBackdrop: true,
      width: '600px',
      data: { action: 'Edit', data: {} }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   this.getList();
      // }
    });
  }
}
