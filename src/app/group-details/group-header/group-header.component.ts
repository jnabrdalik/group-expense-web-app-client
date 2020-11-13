import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewGroupDialogComponent } from 'src/app/group-list/new-group-dialog/new-group-dialog.component';
import { GroupService } from 'src/app/group.service';
import { Group } from 'src/app/model/group';
import { GroupDetails } from 'src/app/model/group-details';

@Component({
  selector: 'app-group-header',
  templateUrl: './group-header.component.html',
  styleUrls: ['./group-header.component.css']
})
export class GroupHeaderComponent implements OnInit {

  @Input() group: GroupDetails;

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
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

    this.groupService.deleteGroup(group.id);
  }

}
