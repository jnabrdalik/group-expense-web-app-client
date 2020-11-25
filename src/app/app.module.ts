import { BrowserModule } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { TokenInterceptor } from './token-interceptor';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module'
import { ToolbarComponent } from './toolbar/toolbar.component';
import { GroupListComponent } from './group-list/group-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { ExpenseListComponent } from './group-details/expense-list/expense-list.component';
import { PersonListComponent } from './group-details/person-list/person-list.component';
import { NewGroupDialogComponent } from './group-list/new-group-dialog/new-group-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DebtListComponent } from './group-details/debt-list/debt-list.component';
import { NewExpenseDialogComponent } from './group-details/expense-list/new-expense-dialog/new-expense-dialog.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { InviteUserDialogComponent } from './group-details/person-list/invite-user-dialog/invite-user-dialog.component';
import { GroupHeaderComponent } from './group-details/group-header/group-header.component';

import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { GroupsComponent } from './groups/groups.component';

registerLocaleData(localePl);

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
    NewExpenseDialogComponent,
    SignUpComponent,
    LoginComponent,
    InviteUserDialogComponent,
    GroupHeaderComponent,
    GroupsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'pl-PL'
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'zł'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
