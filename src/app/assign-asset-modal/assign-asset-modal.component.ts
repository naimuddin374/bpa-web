import { OnInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { AssignAssetComponent } from '../assign-asset/assign-asset.component';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: 'app-assign-asset-modal',
  templateUrl: './assign-asset-modal.component.html',
  styleUrls: ['./assign-asset-modal.component.scss']
})
export class AssignAssetModalComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  form: FormGroup;
  isReadyToSave: boolean;
  isDone: boolean;
  employees: Array<Object> = [];
  categories: Array<Object> = [];
  assets: Array<Object> = [];
  departments: Array<Object> = [];

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<AssignAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private auth: AuthenticationService
  ) {
    this.isReadyToSave = false;
    this.isDone = true;

    this.form = formBuilder.group({
      catId: ['', Validators.required],
      empId: ['', Validators.required],
      assetCode: [''],
      dptId: ['', Validators.required],
      assetId: ['', Validators.required]
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

  setData(data: any) {
    this.getAssetList();
    this.getEmployees(data['department_id']);
    this.form.get('catId').setValue(data['asset_cat']);
    this.form.get('assetId').setValue(data['asset_id']);
    this.form.get('assetCode').setValue(data['asset_code']);
    this.form.get('dptId').setValue(data['department_id']);
    this.form.get('empId').setValue(data['emp_id']);
  }

  getCategory() {
    this.api
      ._get('category/list')
      .then(result => {
        this.categories = result['list'];
        this.getDepartments();
      })
      .catch(error => {
        console.log(error);
      });
  }

  changeCategory(value) {
    this.getAsset(value);
  }

  getAsset(catId) {
    this.api
      ._get('asset/list-cat/' + catId)
      .then(result => {
        this.assets = result['list'];
      })
      .catch(error => {
        console.log(error);
      });
  }

  getAssetList() {
    this.api
      ._get('asset/list')
      .then(result => {
        this.assets = result['list'];
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
        console.error(error);
      });
  }

  changeDepartment(value) {
    this.getEmployees(value);
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

  changeAsset(assetId) {
    this.api
      ._get('asset/details/' + assetId)
      .then(result => {
        this.form.get('assetCode').setValue(result['list'][0]['code']);
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
    formData.append('empId', this.form.value.empId);
    formData.append('assetId', this.form.value.assetId);
    this.api._submit(formData, 'assign-asset/add').then(
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
    formData.append('assetId', this.form.value.assetId);
    this.api._submit(formData, 'assign-asset/edit/' + this.data.data.id).then(
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
