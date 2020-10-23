import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  username: string;
  password: string;
  repeatedPassword: string;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.userService.signUp(this.username, this.password);
  }

}
