import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewGroupDialogComponent } from '../group-list/new-group-dialog/new-group-dialog.component';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private groupService: GroupService,
    private router: Router,
    private dialog: MatDialog
  ) { }  

  ngOnInit(): void {
    this.subscription = this.groupService.groups$.subscribe(
      response => {
        if (response.length > 0) {
          this.router.navigate(['groups', response[0].id]);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddGroup() {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      data: {
        title: 'Dodaj grupę'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.addGroup(result.name, result.forRegisteredOnly);
        }
      }
    );
  }

}
