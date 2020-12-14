import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MemberService } from 'src/app/member.service';
import { GroupDetails } from 'src/app/model/group';
import { Member } from 'src/app/model/member';
import { EditMemberDialogComponent } from './edit-member-dialog/edit-member-dialog.component';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  @Input() group: GroupDetails;

  constructor(
    private memberService: MemberService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  editMember(member: Member) {
    const dialogRef = this.dialog.open(EditMemberDialogComponent, {
      data: {
        title: 'Edytuj osobę',
        editedMember: member,
        members: this.group.members
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

  deleteMemberFromGroup(member: Member): void {
    this.memberService.deleteMember(member).subscribe(
      _ => this.snackbar.open('Członek grupy został usunięty.', "OK"),
      _ => this.snackbar.open('Nie można usunąć tego członka grupy!', "OK")
    );
  }

}
