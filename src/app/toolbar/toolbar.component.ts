import { Component, OnInit } from '@angular/core';

import { Link } from './link'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  links: Link[] = [
    {
      route: 'groups',
      label: 'MOJE GRUPY'
    },
    {
      route: 'account',
      label: 'KONTO'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
