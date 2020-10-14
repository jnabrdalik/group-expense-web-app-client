import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupListComponent } from './group-list/group-list.component';

const routes: Routes = [
  { path: 'groups', component: GroupListComponent, children: [
    { path: ':id', component: GroupDetailsComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
