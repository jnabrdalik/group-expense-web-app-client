import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string;

  private isAuthenticated = new BehaviorSubject<boolean>(localStorage.getItem("jwt") !== null);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.apiUrl = environment.apiUrl;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      username, password
    }).pipe(tap(
      response => {
        console.log(response.token);
        localStorage.setItem('jwt', response.token);
        this.isAuthenticated.next(true);
        this.router.navigate(['groups']);
      }
    ));
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.isAuthenticated.next(false);
    this.router.navigate(['login']);
  }

  signUp(username: string, password: string) {
    this.http.post(`${this.apiUrl}/user/sign-up`, {
      username, password
    }).subscribe(
      _ => this.login(username, password).subscribe()
    )
  }
}
