import { Component, OnInit } from '@angular/core';

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
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  submit() {
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
