import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from 'src/app/group.service';
import { GroupDetails } from 'src/app/model/group';
import { User } from 'src/app/model/user';
import { InviteUserDialogComponent } from './invite-user-dialog/invite-user-dialog.component';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {

  @Input() group: GroupDetails;

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  invite(): void {
    this.dialog.open(InviteUserDialogComponent, {
      width: '400px',
      data: this.group.users
    });
  }

  // addNewPerson(): void {
  //   const dialogRef = this.dialog.open(NewPersonDialogComponent, {
  //     data: {
  //       title: 'Dodaj osobę do grupy',
  //       persons: this.group.users
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(
  //     result => {
  //       if (result) {
  //         this.groupService.addPerson(result.name);
  //       }
  //     }
  //   );
  // }

  // editPerson(person: Person) {
  //   const dialogRef = this.dialog.open(NewPersonDialogComponent, {
  //     data: {
  //       title: 'Edytuj osobę',
  //       editedPerson: person,
  //       persons: this.group.users
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(
  //     result => {
  //       if (result) {
  //         this.groupService.editPerson(result);
  //       }
  //     }
  //   );
  // }

  canDeleteUserFromGroup(user: User): boolean {
    return this.groupService.canDeleteUserFromGroup(user);
  }

  deleteUserFromGroup(user: User): void {
    this.groupService.deleteUserFromGroup(user);
  }

}
