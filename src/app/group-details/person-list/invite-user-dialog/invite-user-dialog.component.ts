import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { GroupService } from 'src/app/group.service';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-invite-user-dialog',
  templateUrl: './invite-user-dialog.component.html',
  styleUrls: ['./invite-user-dialog.component.css']
})
export class InviteUserDialogComponent implements OnInit {

  query: string;
  querySubject = new Subject<string>();

  private userNames: string[];

  results$: Observable<User[]> = this.querySubject.asObservable().pipe(
    debounceTime(500),
    filter(v => v.length >= 3),
    switchMap(v => this.userService.findUser(v))
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: User[],
    private userService: UserService,
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    this.userNames = this.input.filter(p => p.name !== null).map(p => p.name);
  }

  onChange() {
    this.querySubject.next(this.query);
  }

  inviteUser(user: User) {
    this.userNames.push(user.name);
    this.groupService.addUserToGroup(user);
  }

  userInGroup(user: User) {
    return this.userNames.includes(user.name);
  }

}
