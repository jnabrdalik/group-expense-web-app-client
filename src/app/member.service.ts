import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';import { GroupService } from './group.service';;
import { Member } from './model/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl: string;

  private currentGroupId: number;

  private members = new BehaviorSubject<Member[]>([]);
  members$ = this.members.asObservable();

  constructor(private http: HttpClient, private groupService: GroupService) {
    this.apiUrl = environment.apiUrl;
    this.groupService.groupDetails$.subscribe(
      group => {
        this.currentGroupId = group.id;
        this.members.next(group.members);
        this.sortMembers();
      }
    );
  }

  addMember(name: string, relatedUserName?: string) {
    this.http.post<Member>(`${this.apiUrl}/member/${this.currentGroupId}`, { name, relatedUserName }).subscribe(
      response => {
        this.members.value.push(response);
        this.sortMembers();
      }
    );
  }

  editMember(member: Member) {
    this.http.put<Member>(`${this.apiUrl}/member/${member.id}`, { name: member.name }).subscribe(
      response => {
        const member = this.members.value.find(m => m.id === response.id);
        member.name = response.name;
        this.sortMembers();      
      }
    );
  }

  deleteMember(member: Member) {
    return this.http.delete(`${this.apiUrl}/member/${member.id}`).pipe(tap(
      _ => {
        const members = this.members.value;
        const index = members.indexOf(member);
        members.splice(index, 1);
        this.members.next(members);
      }
    ));
  }

  isCurrentGroupMember(name: string): boolean {
    return this.members.value.some(m => m.relatedUserName === name);
  } 

  private sortMembers(): void {
    this.members.value.sort((a, b) => a.name.localeCompare(b.name));
  }
}
