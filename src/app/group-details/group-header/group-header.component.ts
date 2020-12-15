import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { ExpenseService } from 'src/app/expense.service';
import { NewGroupDialogComponent } from 'src/app/group-list/new-group-dialog/new-group-dialog.component';
import { GroupService } from 'src/app/group.service';
import { MemberService } from 'src/app/member.service';
import { Group } from 'src/app/model/group';
import { GroupDetails } from 'src/app/model/group';
import { UserService } from 'src/app/user.service';
import { WarningDialogComponent } from 'src/app/warning-dialog/warning-dialog.component';
import { NewExpenseDialogComponent } from '../expense-list/new-expense-dialog/new-expense-dialog.component';
import { InviteUserDialogComponent } from '../member-list/invite-user-dialog/invite-user-dialog.component';

@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.css']
})
export class GroupHeaderComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  group: GroupDetails;
  isAuth$: Observable<boolean>;

  constructor(
    private groupService: GroupService,
    private expenseService: ExpenseService,
    private memberService: MemberService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isAuth$ = this.userService.isAuthenticated$;
    this.subscription = this.groupService.groupDetails$.subscribe(
      group => this.group = group
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  optionsVisible(): boolean {
    return this.userService.currentUsername === this.group?.creatorName;
  }

  isGroupMember(): boolean {
    const name = this.userService.currentUsername;
    return this.memberService.isCurrentGroupMember(name);
  }

  onJoinGroup(group: Group) {
    const name = this.userService.currentUsername;
    this.memberService.addMember(name, name);
  }

  onEditGroup(group: Group) {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      data: {
        title: 'Edytuj grupę',
        group
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.editGroup(result).subscribe(
            _ => this.snackbar.open(`Dane grupy zostały zaktualizowane`, "OK")
          );
        }
      }
    );
  }

  onArchiveGroup(group: Group) {
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Archiwizowanie grupy',
        content: `Czy na pewno chcesz zarchiwizować grupę "${group.name}"? Stanie się ona dostępna tylko do odczytu`,
        action: 'Zarchiwizuj grupę'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.archiveGroup(group.id).subscribe(
          _ => this.snackbar.open(`Grupa została zarchiwizowana`, "OK")
        );
      }
    });
  }

  onDeleteGroup(group: Group) {
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Usuwanie grupy',
        content: `Czy na pewno chcesz usunąć grupę "${group.name}" wraz ze wszystkimi jej członkami i wydatkami? Tej operacji nie można cofnąć.`,
        action: 'Usuń grupę mimo to'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.deleteGroup(group.id).subscribe(
          _ => this.snackbar.open(`Grupa "${group.name}" została usunięta`, "OK")
        );
      }
    });
  }

  onAddExpense(): void {
    const dialogRef = this.dialog.open(NewExpenseDialogComponent, {
      data: {
        title: "Dodaj wydatek",
        members: this.group.members
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.addExpense(result.description, result.amount, result.timestamp, result.payer, result.involvements);
      }
    });
  }

  onAddMember(): void {
    this.dialog.open(InviteUserDialogComponent, {
      data: this.group.members.map(m => m.relatedUserName).filter(m => m !== null)
    });
  }

}
