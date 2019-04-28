import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Domain } from '../common';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  /* {
  headers: new HttpHeaders().set(
    'Authorization', 'Bearer token'
  )
  } */

  _submit(data, url) {
    return new Promise((resolve, reject) => {
      this.http.post(Domain + url, data).subscribe(
        res => {
          if (res) {
            this.showSnackBar(res['message'], '');
          }
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  _get(url) {
    return new Promise((resolve, reject) => {
      this.http.get(Domain + url).subscribe(
        res => {
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  showSnackBar(msg, style) {
    this.snackBar.open(msg, 'x', {
      duration: 3000
      // panelClass: ['danger-snackbar']
      // panelClass: ['success-snackbar']
    });
  }
}
