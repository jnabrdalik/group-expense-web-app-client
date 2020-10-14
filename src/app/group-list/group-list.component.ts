import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { GroupService } from '../group.service';
import { Group } from '../model/group'
import { NewGroupDialogComponent } from './new-group-dialog/new-group-dialog.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

  currentId: number;
  groups$: Observable<Group[]>;

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.groups$ = this.groupService.getGroupList();
  }

  addNewGroup() {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      data: {
        title: 'Dodaj grupę'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.addGroup(result.name, result.description)
        }
      }
    );
  }

  editGroup(group: Group) {
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
          this.groupService.editGroup(result)
        }
      }
    );
  }

  deleteGroup(group: Group) {
    // warning TODO

    this.groupService.deleteGroup(group);
  }

}
