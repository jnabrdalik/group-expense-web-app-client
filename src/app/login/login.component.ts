import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  usernameOrPasswordIncorrect: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.isAuthenticated$.subscribe(
      auth => {
        if (auth) {          
          this.router.navigate(['groups']);
        }
      }
    )
  }

  onSubmit() {
    this.usernameOrPasswordIncorrect = false;
    this.userService.login(this.username, this.password).subscribe(
      _ => this.usernameOrPasswordIncorrect = false,
      _ => {
        this.usernameOrPasswordIncorrect = true;
        console.log("error")
      }
    );
  }

}
