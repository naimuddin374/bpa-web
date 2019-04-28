import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Domain } from '../common';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';

export class User {
  private id: number;
  private code: string;
  private userName: string; // email
  private employeeId: number; // employee_id
  private departmentId: number; // department_id
  private department: string;
  private designationId: number; // designation_id
  private designation: string;
  private roleId: number; // role_id
  private role: string;
  private firstName: string; // first_name
  private lastName: string; // last_name
  private email: string; // employee_email
  private contact: string;
  private dob: string;
  private address: string;
  private bloodGroup: string; // blood_group
  private employeeCategory: string; // category
  private employeeType: string; // type
  private employeeStatus: string; // employee_status
  private userStatus: boolean; // status
  private image: string;
  private joining: string;
  private salary: boolean;
  private provisionPeriodEnd: string;
  private casualLeave: string;
  private sickLeave: string;

  constructor(
    id: number,
    code: string,
    userName: string,
    employeeId: number,
    departmentId: number,
    department: string,
    designationId: number,
    designation: string,
    roleId: number,
    role: string,
    firstName: string,
    lastName: string,
    email: string,
    contact: string,
    dob: string,
    address: string,
    bloodGroup: string,
    employeeCategory: string,
    employeeType: string,
    employeeStatus: string,
    userStatus: boolean,
    image: string,
    joining: string,
    salary: boolean,
    provisionPeriodEnd: string,
    casualLeave: string,
    sickLeave: string
  ) {
    this.id = id;
    this.code = code;
    this.userName = userName;
    this.employeeId = employeeId;
    this.departmentId = departmentId;
    this.department = department;
    this.designationId = designationId;
    this.designation = designation;
    this.roleId = roleId;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.contact = contact;
    this.dob = dob;
    this.address = address;
    this.bloodGroup = bloodGroup;
    this.employeeCategory = employeeCategory;
    this.employeeType = employeeType;
    this.employeeStatus = employeeStatus;
    this.userStatus = userStatus;
    this.image = image;
    this.joining = joining;
    this.salary = salary;
    this.provisionPeriodEnd = provisionPeriodEnd;
    this.casualLeave = casualLeave;
    this.sickLeave = sickLeave;
  }
}

@Injectable()
export class AuthenticationService {
  private user: User;
  private isLoggedIn: boolean;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.isLoggedIn = false;
    if (localStorage.getItem('currentUser')) {
      this.init().subscribe(
        isLoggedIn => {
          if (isLoggedIn) {
            this.isLoggedIn = isLoggedIn;
          }
        },
        error => {
          console.log(error);
          this.isLoggedIn = false;
        }
      );
    }
  }

  private init() {
    return Observable.create(observer => {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        this.setUser(
          new User(
            user['user_id'],
            user['code'],
            user['email'],
            user['id'],
            user['department_id'],
            user['department'],
            user['designation_id'],
            user['designation'],
            user['role_id'],
            user['role'],
            user['first_name'],
            user['last_name'],
            user['email'],
            user['contact'],
            user['dob'],
            user['address'],
            user['blood_group'],
            user['category'],
            user['type'],
            user['status'],
            user['user_status'],
            user['image'],
            user['joining'],
            user['salary'],
            user['provision_period_end'],
            user['casual_leave'],
            user['sick_leave']
          )
        );
        observer.next(true);
        observer.complete();
      } catch (error) {
        observer.next(false);
      }
    });
  }

  isAuthorized(): boolean {
    return this.isLoggedIn;
  }

  setUser(user: User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

  login(data, url) {
    return this.http.post<any>(`${Domain + url}`, data).pipe(
      map(res => {
        if (res['user'] && res['token']) {
          localStorage.setItem('currentUser', JSON.stringify(res['user'][0]));
          localStorage.setItem('token', JSON.stringify(res['token']));

          this.setUser(
            new User(
              res['user'][0]['user_id'],
              res['user'][0]['code'],
              res['user'][0]['email'],
              res['user'][0]['id'],
              res['user'][0]['department_id'],
              res['user'][0]['department'],
              res['user'][0]['designation_id'],
              res['user'][0]['designation'],
              res['user'][0]['role_id'],
              res['user'][0]['role'],
              res['user'][0]['first_name'],
              res['user'][0]['last_name'],
              res['user'][0]['email'],
              res['user'][0]['contact'],
              res['user'][0]['dob'],
              res['user'][0]['address'],
              res['user'][0]['blood_group'],
              res['user'][0]['category'],
              res['user'][0]['type'],
              res['user'][0]['status'],
              res['user'][0]['user_status'],
              res['user'][0]['image'],
              res['user'][0]['joining'],
              res['user'][0]['salary'],
              res['user'][0]['provision_period_end'],
              res['user'][0]['casual_leave'],
              res['user'][0]['sick_leave']
            )
          );
        }
        return this.user;
      })
    );
  }

  logout() {
    return this.http.get<any>(`${Domain}user/logout`).pipe(
      map(res => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        return res;
      })
    );
  }

  showSnackBar(msg, style) {
    if (msg) {
      this.snackBar.open(msg, 'x', {
        duration: 3000,
        panelClass: [style]
      });
    }
  }
}
