import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string;

  private isAuthenticated = new BehaviorSubject<boolean>(localStorage.getItem('jwt') !== null);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  currentUsername: string = this.getUsernameFromToken(localStorage.getItem('jwt'));

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.apiUrl = environment.apiUrl;
  }

  login(name: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      name, password
    }).pipe(tap(
      response => {
        console.log(response.token);
        localStorage.setItem('jwt', response.token);
        this.isAuthenticated.next(true);
        this.currentUsername = this.getUsernameFromToken(response.token);
      }
    ));
  }

  private getUsernameFromToken(token: string): string {
    return token ? JSON.parse(atob(token.split('.')[1])).sub : null;
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.isAuthenticated.next(false);
    this.router.navigate(['login']);
  }

  signUp(name: string, password: string, email: string) {
    this.http.post(`${this.apiUrl}/user/sign-up`, {
      name, password, email
    }).subscribe(
      _ => this.login(name, password).subscribe()
    )
  }

  findUser(query: string): Observable<User[]> {
    console.log(query)
    return this.http.get<User[]>(`${this.apiUrl}/user/${query}/find`);
  }

  checkIfExists(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/user/${username}/exists`);
  }
}
