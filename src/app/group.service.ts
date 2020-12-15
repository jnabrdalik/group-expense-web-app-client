import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from './model/group';
import { GroupDetails } from './model/group';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl: string;

  private groups = new BehaviorSubject<Group[]>([]);
  groups$ = this.groups.asObservable();

  private groupDetails = new BehaviorSubject<GroupDetails>(null);
  groupDetails$: Observable<GroupDetails> = this.groupDetails.asObservable();

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) {
    this.apiUrl = environment.apiUrl;
    this.userService.isAuthenticated$.subscribe(
      auth => {
        if (auth) {
          this.http.get<Group[]>(`${this.apiUrl}/group`).subscribe(
            response => this.groups.next(response)
          );
        }
      }
    );
  }

  downloadGroupDetails(groupId: number) {
    this.http.get<GroupDetails>(`${this.apiUrl}/group/${groupId}`).subscribe(
      response => this.groupDetails.next(response),
      _ => this.router.navigate([''])
    );
  }

  addGroup(name: string, forRegisteredOnly: boolean): void {
    this.http.post<Group>(`${this.apiUrl}/group`, {
      name, forRegisteredOnly
    }).subscribe(
      response => {
        this.groups.value.push(response);
        this.router.navigate(['/groups/' + response.id]);
      }
    )
  }

  editGroup(group: Group) {
    return this.http.put<Group>(`${this.apiUrl}/group/${group.id}`, {
      name: group.name,
      forRegisteredOnly: group.forRegisteredOnly
    }).pipe(
      tap(
        response => {
          const groups = this.groups.value;
          const groupIndex = groups.findIndex(g => g.id === response.id);
          groups[groupIndex] = response;
          this.groups.next(groups);

          const group = this.groupDetails.value;
          group.name = response.name;
          group.forRegisteredOnly = response.forRegisteredOnly;
          this.groupDetails.next(group);
        }
      )
    );
  }

  archiveGroup(groupId: number) {
    return this.http.put(`${this.apiUrl}/group/${groupId}/archive`, {}).pipe(
      tap(
        _ => {
          this.groups.value.find(g => g.id === groupId).archived = true;
          this.groupDetails.value.archived = true;
        }
      ));
  }

  deleteGroup(groupId: number) {
    return this.http.delete(`${this.apiUrl}/group/${groupId}`).pipe(
      tap(
        _ => {
          const groups = this.groups.value;
          const index = groups.findIndex(g => g.id === groupId);
          groups.splice(index, 1);
          this.groups.next(groups);
          this.router.navigate(groups.length > 0 ? ['/groups/' + groups[0].id] : ['']);
        }
      ));
  }
}
