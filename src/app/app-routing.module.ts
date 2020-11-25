import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth-guard';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupsComponent } from './groups/groups.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], redirectTo: 'groups', pathMatch: 'full'},
  { path: 'groups', component: GroupsComponent, canActivate: [AuthGuard] }, 
  { path: 'groups/:id', component: GroupDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
