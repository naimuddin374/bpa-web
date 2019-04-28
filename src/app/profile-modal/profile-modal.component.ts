import { OnInit, Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileComponent } from '../profile/profile.component';
import { EmployeeImageUrl } from '../common';

export interface DialogData {
  data: any;
  action: string;
}

@Component({
  selector: "app-profile-modal",
  templateUrl: "./profile-modal.component.html",
  styleUrls: ["./profile-modal.component.scss"]
})
export class ProfileModalComponent implements OnInit {
  @ViewChild("fileInput") fileInput;

  form: FormGroup;
  private files: any = [];
  profile: any = [];
  isReadyToSave: boolean;
  isDone: boolean;
  employeeImageUrl: string = EmployeeImageUrl;
  image: any = "";

  constructor(
    public formBuilder: FormBuilder,
    public api: ApiService,
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private auth: AuthenticationService
  ) {
    this.isReadyToSave = false;
    this.isDone = true;

    this.form = formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", Validators.required],
      contact: ["", Validators.required],
      address: ["", Validators.required],
      blood_group: [""],
      dob: [""],
      image: [""]
    });

    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.api
      ._get("user/profile")
      .then(result => {
        this.profile = result["profile"][0];
        this.image = this.employeeImageUrl + result["profile"][0]["image"];
        this.setData(this.profile);
        console.log(this.profile);
      })
      .catch(error => {
        console.log(error);
      });
  }

  setData(data: any) {
    this.form.get("firstName").setValue(data["first_name"]);
    this.form.get("lastName").setValue(data["last_name"]);
    this.form.get("email").setValue(data["email"]);
    this.form.get('contact').setValue(data['contact']);
    this.form.get('address').setValue(data['address']);
    this.form.get('blood_group').setValue(data['blood_group']);
    this.form.get('dob').setValue(data['dob']);
    this.form.get('image').setValue(EmployeeImageUrl + data['image']);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  edit() {
    // console.log(this.profile.id);
    this.isDone = false;
    const formData = new FormData();
    formData.append('userId', this.auth.getUser()['id'].toString());
    formData.append('firstName', this.form.value.firstName.trim());
    formData.append('lastName', this.form.value.lastName.trim());
    formData.append('email', this.form.value.email.trim());
    formData.append('contact', this.form.value.contact);
    formData.append('address', this.form.value.address.trim());
    formData.append('image', this.files);
    this.api
      ._submit(formData, 'employee/profile/update/' + this.profile.id)
      .then(
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

  getImage() {
    this.fileInput.nativeElement.click();
  }

  processWebImage(event) {
    if (event.target.value) {
      try {
        if (event.target.files[0].size / 1024 > 120) {
          this.api.showSnackBar('Too big image', '');
          return;
        }

        const reader = new FileReader();
        reader.onload = readerEvent => {
          const imageData = (readerEvent.target as any).result;
          this.form.patchValue({ image: imageData });
        };
        this.files = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
      } catch (e) {
        console.log(e);
      }
    }
  }

  getImageStyle() {
    return 'url(' + this.form.controls['image'].value + ')';
  }
}
