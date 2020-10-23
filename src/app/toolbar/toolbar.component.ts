import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  
  isAuthenticated$: Observable<boolean>;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated$ = this.userService.isAuthenticated$;
  }

  logout(): void {
    this.userService.logout();
  }

}
