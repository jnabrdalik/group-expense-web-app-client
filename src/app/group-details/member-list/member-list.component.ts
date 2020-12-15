import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { GroupService } from 'src/app/group.service';
import { MemberService } from 'src/app/member.service';
import { GroupDetails } from 'src/app/model/group';
import { Member } from 'src/app/model/member';
import { EditMemberDialogComponent } from './edit-member-dialog/edit-member-dialog.component';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  members: Member[];

  constructor(
    private groupService: GroupService,
    private memberService: MemberService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.subscription = this.memberService.members$.subscribe(
      members => this.members = members
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onEditMember(member: Member) {
    const dialogRef = this.dialog.open(EditMemberDialogComponent, {
      data: {
        title: 'Edytuj osobę',
        editedMember: member,
        members: this.members
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.memberService.editMember(result);
        }
      }
    );
  }

  onDeleteMember(member: Member): void {
    this.memberService.deleteMember(member).subscribe(
      _ => this.snackbar.open('Członek grupy został usunięty.', "OK"),
      _ => this.snackbar.open('Nie można usunąć tego członka grupy!', "OK")
    );
  }

}
