import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupService } from '../group.service';
import { GroupDetails } from '../model/group';
import { UserService } from '../user.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  groupDetails: GroupDetails;
  isHandset$: Observable<boolean>;
  isAuthenticated$: Observable<boolean>;
  currentTabIndex: number;

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.isAuthenticated$ = this.userService.isAuthenticated$;

    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.groupService.downloadGroupDetails(id);
      }
    );

    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Small])
    .pipe(
      map(result => result.matches)
    );

    this.groupService.groupDetails$.subscribe(
      result => {
        this.groupDetails = result;
        if (result?.members.length < 2) {
          this.currentTabIndex = 1;
        }

        else if (this.currentTabIndex === 2 && result?.expenses.length === 0) {
          this.currentTabIndex = 0;
        }
      }
    )
  }

}
