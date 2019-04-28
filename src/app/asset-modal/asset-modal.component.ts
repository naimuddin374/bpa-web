import { OnInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AssetComponent } from '../asset/asset.component';
import { DatePipe } from '@angular/common';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: 'app-asset-modal',
  templateUrl: './asset-modal.component.html',
  styleUrls: ['./asset-modal.component.scss']
})
export class AssetModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  isDone: boolean;
  categoreris: Array<Object> = [];
  employees: Array<Object> = [];
  departments: Array<Object> = [];

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<AssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public datepipe: DatePipe,
    private auth: AuthenticationService
  ) {
    this.isReadyToSave = false;
    this.isDone = true;

    this.form = formBuilder.group({
      categoryId: ['', Validators.required],
      companyName: [''],
      code: [''],
      title: ['', Validators.required],
      description: [''],
      price: [''],
      fromBuy: [''],
      purchaseDate: [''],
      warranty: [''],
      note: [''],
      status: [''],
      empId: [''],
      departmentName: [''],
      designationName: [''],
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });

    if (this.data.action === 'Edit') {
      this.setData(this.data.data);
    }
  }

  ngOnInit() {
    this.getCategory();
  }
  getCategory() {
    this.api
      ._get('category/list')
      .then(result => {
        this.categoreris = result['list'];
        this.getEmployees();
      })
      .catch(error => {
        console.error(error);
      });
  }
  setData(data: any) {
    this.form.get('categoryId').setValue(data['category_id']);
    this.form.get('companyName').setValue(data['company_name']);
    this.form.get('code').setValue(data['code']);
    this.form.get('title').setValue(data['title']);
    this.form.get('description').setValue(data['description']);
    this.form.get('fromBuy').setValue(data['from_buy']);
    this.form.get('price').setValue(data['price']);
    this.form.get('purchaseDate').setValue(data['purchase_date']);
    this.form.get('warranty').setValue(data['warranty']);
    this.form.get('note').setValue(data['note']);
    this.form.get('status').setValue(data['status']);
    this.form.get('empId').setValue(data['employee_id']);
    this.changeEmployee(data['employee_id']);
  }

  getEmployees() {
    this.api
      ._get('employee/list/')
      .then(result => {
        this.employees = result['list'];
      })
      .catch(error => {
        console.log(error);
      });
  }

  changeEmployee(empId) {
    this.api
      ._get('employee/details/' + empId)
      .then(result => {
        this.form.get('departmentName').setValue(result['details'][0]['department']);
        this.form.get('designationName').setValue(result['details'][0]['designation']);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  add() {
    this.isDone = false;
    const formData = new FormData();
    formData.append('userId', this.auth.getUser()['id'].toString());
    formData.append('categoryId', this.form.value.categoryId);
    formData.append('companyName', this.form.value.companyName);
    formData.append('code', this.form.value.code);
    formData.append('title', this.form.value.title.trim());
    formData.append('description', this.form.value.description);
    formData.append('fromBuy', this.form.value.fromBuy);
    formData.append('price', this.form.value.price);
    formData.append('purchaseDate', this.datepipe.transform(this.form.value.purchaseDate, 'yyyy-MM-dd'));
    formData.append('warranty', this.datepipe.transform(this.form.value.warranty, 'yyyy-MM-dd'));
    formData.append('note', this.form.value.note);
    formData.append('status', this.form.value.status);
    formData.append('employeeId', this.form.value.empId);
    this.api._submit(formData, 'asset/add').then(
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
    formData.append('categoryId', this.form.value.categoryId);
    formData.append('companyName', this.form.value.companyName);
    formData.append('code', this.form.value.code);
    formData.append('title', this.form.value.title.trim());
    formData.append('description', this.form.value.description);
    formData.append('fromBuy', this.form.value.fromBuy);
    formData.append('price', this.form.value.price);
    formData.append('purchaseDate', this.datepipe.transform(this.form.value.purchaseDate, 'yyyy-MM-dd'));
    formData.append('warranty', this.datepipe.transform(this.form.value.warranty, 'yyyy-MM-dd'));
    formData.append('note', this.form.value.note);
    formData.append('status', this.form.value.status);
    formData.append('employeeId', this.form.value.empId);
    this.api._submit(formData, 'asset/edit/' + this.data.data.id).then(
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
