import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from 'src/app/group.service';
import { GroupDetails } from 'src/app/model/group-details';
import { Person } from 'src/app/model/person';
import { PersonService } from '../../person.service';
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

  addNewPerson(): void {
    const dialogRef = this.dialog.open(NewPersonDialogComponent, {
      data: this.group.persons
    })

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.addPerson(result.name);
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
