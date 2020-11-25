import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  
  @Input() drawer: MatSidenav;
  isAuthenticated$: Observable<boolean>;
  isHandset$: Observable<boolean>;  

  constructor(
    private userService: UserService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.isAuthenticated$ = this.userService.isAuthenticated$;
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Small])
    .pipe(
      map(result => result.matches)
    );    
  }

  logout(): void {
    this.userService.logout();
  }

}
