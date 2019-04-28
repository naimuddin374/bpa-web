import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CustomMaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { ApiService } from './_services/api.service';
import { NavComponent } from './nav/nav.component';
import { RoleComponent } from './role/role.component';
import { RoleModalComponent } from './role-modal/role-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DepartmentComponent } from './department/department.component';
import { DepartmentModalComponent } from './department-modal/department-modal.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './_services/authentication.service';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { AuthGuard } from './_guards/auth.guard';
import { UserComponent } from './user/user.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { DesignationComponent } from './designation/designation.component';
import { DesignationModalComponent } from './designation-modal/designation-modal.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordModalComponent } from './forgot-password-modal/forgot-password-modal.component';
import { CategoryComponent } from './category/category.component';
import { CategoryModalComponent } from './category-modal/category-modal.component';
import { LeaveComponent } from './leave/leave.component';
import { LeaveModalComponent } from './leave-modal/leave-modal.component';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { ExcelService } from './_services/excel.service';
import { ReportDetailModalComponent } from './report-detail-modal/report-detail-modal.component';
import { EmployeeDetailModalComponent } from './employee-detail-modal/employee-detail-modal.component';
import { AssetComponent } from './asset/asset.component';
import { AssetModalComponent } from './asset-modal/asset-modal.component';
import { AssignAssetComponent } from './assign-asset/assign-asset.component';
import { AssignAssetModalComponent } from './assign-asset-modal/assign-asset-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HomeComponent,
    NavComponent,
    RoleComponent,
    RoleModalComponent,
    DepartmentComponent,
    DepartmentModalComponent,
    EmployeeComponent,
    EmployeeModalComponent,
    LoginComponent,
    UserComponent,
    UserModalComponent,
    DesignationComponent,
    DesignationModalComponent,
    ChangePasswordModalComponent,
    ProfileComponent,
    ForgotPasswordModalComponent,
    CategoryComponent,
    CategoryModalComponent,
    LeaveComponent,
    LeaveModalComponent,
    ProfileModalComponent,
    LeaveReportComponent,
    ReportDetailModalComponent,
    EmployeeDetailModalComponent,
    AssetComponent,
    AssetModalComponent,
    AssignAssetComponent,
    AssignAssetModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  entryComponents: [
    RoleModalComponent,
    DepartmentModalComponent,
    EmployeeModalComponent,
    UserModalComponent,
    DesignationModalComponent,
    ChangePasswordModalComponent,
    ForgotPasswordModalComponent,
    CategoryModalComponent,
    LeaveModalComponent,
    ProfileModalComponent,
    ReportDetailModalComponent,
    EmployeeDetailModalComponent,
    AssetModalComponent,
    AssignAssetModalComponent
  ],
  providers: [
    ApiService,
    DatePipe,
    AuthGuard,
    AuthenticationService,
    ExcelService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
