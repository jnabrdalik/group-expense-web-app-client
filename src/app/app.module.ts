import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module'
import { ToolbarComponent } from './toolbar/toolbar.component';
import { GroupListComponent } from './group-list/group-list.component';
import { HttpClientModule } from '@angular/common/http';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { ExpenseListComponent } from './group-details/expense-list/expense-list.component';
import { PersonListComponent } from './group-details/person-list/person-list.component';
import { NewGroupDialogComponent } from './group-list/new-group-dialog/new-group-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebtListComponent } from './group-details/debt-list/debt-list.component';
import { NewPersonDialogComponent } from './group-details/person-list/new-person-dialog/new-person-dialog.component';
import { NewExpenseDialogComponent } from './group-details/expense-list/new-expense-dialog/new-expense-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    GroupListComponent,
    GroupDetailsComponent,
    ExpenseListComponent,
    PersonListComponent,
    NewGroupDialogComponent,
    DebtListComponent,
    NewPersonDialogComponent,
    NewExpenseDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
