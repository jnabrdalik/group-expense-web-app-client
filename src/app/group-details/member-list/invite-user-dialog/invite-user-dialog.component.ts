import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { GroupService } from 'src/app/group.service';
import { MemberService } from 'src/app/member.service';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-invite-user-dialog',
  templateUrl: './invite-user-dialog.component.html',
  styleUrls: ['./invite-user-dialog.component.css']
})
export class InviteUserDialogComponent implements OnInit {

  query: string;
  private querySubject = new Subject<string>();

  private userNames: string[];

  results$: Observable<User[]> = this.querySubject.asObservable().pipe(
    filter(v => v.length >= 3),
    debounceTime(500),    
    distinctUntilChanged(),
    switchMap(v => this.userService.findUser(v))
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: string[],
    private userService: UserService,
    private groupService: GroupService,
    private memberService: MemberService
  ) { }

  ngOnInit(): void {
    this.userNames = [...this.input];
  }

  onChange() {
    this.querySubject.next(this.query);
  }

  inviteUser(user: User) {
    this.userNames.push(user.name);
    this.memberService.addMember(user.name, user.name);
  }

  addUnregisteredMember() {
    this.memberService.addMember(this.query);
  }

  userInGroup(user: User): boolean {
    return this.userNames.includes(user.name);
  }

}
