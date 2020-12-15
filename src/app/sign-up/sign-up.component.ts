import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  username: string = '';
  password: string = '';
  email: string = '';
  repeatedPassword: string = '';

  private usernameSubject = new Subject<string>();

  isTaken$: Observable<boolean> = this.usernameSubject.asObservable().pipe(
    filter(u => u.length >= 5),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(u => this.userService.checkIfExists(u))
  );

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  onChange(): void {
    this.usernameSubject.next(this.username);
  }

  onSubmit(): void {
    this.userService.signUp(this.username, this.password, this.email);
  }



}
