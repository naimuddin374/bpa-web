import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { RoleComponent } from './role/role.component';
import { DepartmentComponent } from './department/department.component';
import { EmployeeComponent } from './employee/employee.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { UserComponent } from './user/user.component';
import { DesignationComponent } from './designation/designation.component';
import { ProfileComponent } from './profile/profile.component';
import { CategoryComponent } from './category/category.component';
import { LeaveComponent } from './leave/leave.component';
import { Role } from './_models/role';
import { LeaveReportComponent } from './leave-report/leave-report.component';
import { AssetComponent } from './asset/asset.component';
import { AssignAssetComponent } from './assign-asset/assign-asset.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  /* All */
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'leave', component: LeaveComponent, canActivate: [AuthGuard] },

  {
    path: 'department',
    component: DepartmentComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.HR] }
  },
  {
    path: 'designation',
    component: DesignationComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.HR] }
  },
  {
    path: 'role',
    component: RoleComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.HR] }
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.HR] }
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.HR] }
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.HR] }
  },
  {
    path: 'leave-report',
    component: LeaveReportComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.HR] }
  },
  {
    path: 'asset',
    component: AssetComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.HR] }
  },
  {
    path: 'assign-asset',
    component: AssignAssetComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.HR] }
  },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })], // , enableTracing: true
  exports: [RouterModule]
})
export class AppRoutingModule {}
