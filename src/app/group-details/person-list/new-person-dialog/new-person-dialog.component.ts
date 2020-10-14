import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person } from 'src/app/model/person';

@Component({
  selector: 'app-new-person-dialog',
  templateUrl: './new-person-dialog.component.html',
  styleUrls: ['./new-person-dialog.component.css']
})
export class NewPersonDialogComponent implements OnInit {

  data: { name: string } = { name: '' };

  constructor(@Inject(MAT_DIALOG_DATA) private input: Person[]) { }

  ngOnInit(): void {
  }

  isAddButtonDisabled() {
    return this.data.name.trim() === '' || this.input.some(p => p.name === this.data.name);
  }

}
