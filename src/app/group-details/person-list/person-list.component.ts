import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from 'src/app/group.service';
import { GroupDetails } from 'src/app/model/group-details';
import { Person } from 'src/app/model/person';
import { InviteUserDialogComponent } from './invite-user-dialog/invite-user-dialog.component';
import { NewPersonDialogComponent } from './new-person-dialog/new-person-dialog.component';

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

  getDisplayedName(person: Person) {
    if (person.relatedUserName && person.relatedUserName !== person.name) {
      return `${person.name} (${person.relatedUserName})`;
    }
    return person.name;

  }

  invite(): void {
    this.dialog.open(InviteUserDialogComponent, {
      width: '400px',
      data: this.group.persons
    });
  }

  addNewPerson(): void {
    const dialogRef = this.dialog.open(NewPersonDialogComponent, {
      data: {
        title: 'Dodaj osobę do grupy',
        persons: this.group.persons
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.addPerson(result.name);
        }
      }
    );
  }

  editPerson(person: Person) {
    const dialogRef = this.dialog.open(NewPersonDialogComponent, {
      data: {
        title: 'Edytuj osobę',
        editedPerson: person,
        persons: this.group.persons
      }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.editPerson(result);
        }
      }
    );
  }

  canDeletePerson(person: Person): boolean {
    return this.groupService.canDeletePerson(person);
  }

  deletePerson(person: Person): void {
    this.groupService.deletePerson(person);
  }

}
