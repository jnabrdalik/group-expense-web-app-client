import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (!req.url.endsWith('/user/sign-up') && !req.url.endsWith('/login')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
    }
    
    console.log(req)
    return next.handle(req);
  }
}
