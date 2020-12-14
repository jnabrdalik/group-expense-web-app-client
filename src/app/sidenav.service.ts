import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidenav: MatSidenav

  constructor() { }

  setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  close() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }
}
