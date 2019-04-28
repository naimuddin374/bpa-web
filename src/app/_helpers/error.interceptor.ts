import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        const error = err.error.message || err.statusText;
        console.error(err);
        if ([401, 403].indexOf(err.status) !== -1) {
          if (localStorage.getItem('token')) {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            setTimeout(() => {
              location.reload(true);
            }, 3000);
          }
        }

        this.showSnackBar(error, '');
        return throwError(error);
      })
    );
  }

  showSnackBar(msg, style) {
    this.snackBar.open(msg, 'x', {
      duration: 3000,
      panelClass: ['danger-snackbar']
      // panelClass: ['success-snackbar']
    });
  }
}
