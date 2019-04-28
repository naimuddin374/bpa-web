import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild
} from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { first } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('drawer') drawer: any;

  paths: any = {
    Admin: [
      'home',
      'profile',
      'leave-report',
      'category',
      'subcategory',
      'user',
      'role',
      'department',
      'designation',
      'leave',
      'employee',
      'asset',
      'assign-asset'
    ],
    HR: [
      'home',
      'profile',
      'leave-report',
      'category',
      'subcategory',
      'user',
      'role',
      'department',
      'designation',
      'leave',
      'employee',
      'asset',
      'assign-asset'
    ],
    User: ['home', 'profile', 'leave'],
    Accounts: ['home', 'profile', 'leave', 'category', 'subcategory'],
    Supervisor: ['home', 'profile', 'leave'],
    Client: ['home', 'profile']
  };

  public isLoggedIn: boolean;

  dialogRef: MatDialogRef<ChangePasswordModalComponent>;
  isEmpty: boolean;
  isLoading: boolean;
  full_name: string;

  constructor(
    private auth: AuthenticationService,
    private api: ApiService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isAuthorized();
    if (this.auth.getUser()) {
      this.full_name =
        this.auth.getUser()['firstName'] +
        ' ' +
        this.auth.getUser()['lastName'];
    }
  }

  ngOnChanges() {
    this.isLoggedIn = this.auth.isAuthorized();
  }

  ngOnDestroy() {
    this.isLoggedIn = this.auth.isAuthorized();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleDrawer() {
    this.drawer.toggle();
  }

  logout() {
    this.auth
      .logout()
      .pipe(first())
      .subscribe(
        data => {
          this.api.showSnackBar('Successfully logged out', '');
          // localStorage.setItem('msg', 'Successfully Logged out');
          setTimeout(() => {
            location.reload(true);
          }, 1000);
        },
        error => {
          console.error(error);
        }
      );
  }

  changePassword(): void {
    this.dialogRef = this.dialog.open(ChangePasswordModalComponent, {
      hasBackdrop: true,
      width: '600px',
      data: { action: 'Edit', data: {} }
    });

    this.dialogRef.afterClosed().subscribe(result => {});
  }

  isAuthorized(path) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      return false;
    }

    if (currentUser.role === 'Admin') {
      if (this.paths['Admin'].indexOf(path) === -1) {
        return false;
      }
      return true;
    } else if (currentUser.role === 'HR') {
      if (this.paths['HR'].indexOf(path) === -1) {
        return false;
      }
      return true;
    } else if (currentUser.role === 'User') {
      if (this.paths['User'].indexOf(path) === -1) {
        return false;
      }
      return true;
    } else if (currentUser.role === 'Accounts') {
      if (this.paths['Accounts'].indexOf(path) === -1) {
        return false;
      }
      return true;
    } else if (currentUser.role === 'Supervisor') {
      if (this.paths['Supervisor'].indexOf(path) === -1) {
        return false;
      }
      return true;
    } else if (currentUser.role === 'Client') {
      if (this.paths['Client'].indexOf(path) === -1) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

}
