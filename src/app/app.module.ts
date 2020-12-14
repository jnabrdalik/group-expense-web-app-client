import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { TokenInterceptor } from './token-interceptor';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { GroupListComponent } from './group-list/group-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { ExpenseListComponent } from './group-details/expense-list/expense-list.component';
import { MemberListComponent } from './group-details/member-list/member-list.component';
import { NewGroupDialogComponent } from './group-list/new-group-dialog/new-group-dialog.component';
import { DebtListComponent } from './group-details/debt-list/debt-list.component';
import { NewExpenseDialogComponent } from './group-details/expense-list/new-expense-dialog/new-expense-dialog.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { InviteUserDialogComponent } from './group-details/member-list/invite-user-dialog/invite-user-dialog.component';
import { GroupHeaderComponent } from './group-details/group-header/group-header.component';
import { GroupsComponent } from './groups/groups.component';
import { EditMemberDialogComponent } from './group-details/member-list/edit-member-dialog/edit-member-dialog.component';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';

registerLocaleData(localePl);

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    GroupListComponent,
    GroupDetailsComponent,
    ExpenseListComponent,
    MemberListComponent,
    NewGroupDialogComponent,
    DebtListComponent,
    NewExpenseDialogComponent,
    SignUpComponent,
    LoginComponent,
    EditMemberDialogComponent,
    InviteUserDialogComponent,
    GroupHeaderComponent,
    GroupsComponent,
    WarningDialogComponent
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
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {
        ...new MatDialogConfig(),
        width: '500px'
      }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
        duration: 4000
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
