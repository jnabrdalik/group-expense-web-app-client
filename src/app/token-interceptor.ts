import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem('jwt')
    if (!req.url.endsWith('/user/sign-up') && !req.url.endsWith('/login') && jwt) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
    }
    
    return next.handle(req);
  }
}
