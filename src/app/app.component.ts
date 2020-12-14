import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from './sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('drawer') sidenav: MatSidenav

  title = 'group-expense-web-app-client';

  constructor(
    private sidenavService: SidenavService
  ) {}
  
  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }  

}
