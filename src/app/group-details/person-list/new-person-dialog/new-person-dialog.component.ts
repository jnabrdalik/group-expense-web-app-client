import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person } from 'src/app/model/person';

@Component({
  selector: 'app-new-person-dialog',
  templateUrl: './new-person-dialog.component.html',
  styleUrls: ['./new-person-dialog.component.css']
})
export class NewPersonDialogComponent implements OnInit {

  name: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public input: { title: string, editedPerson?: Person, persons: Person[] }) { }

  ngOnInit(): void {
    if (this.input.editedPerson) {
      this.name = this.input.editedPerson.name.slice();
    }
  }

  isAddButtonDisabled() {
    return this.name.trim() === '' || this.input.persons.some(p => p.name === this.name.trim());
  }

  getResult() {
    return {
      id: this.input.editedPerson?.id,
      name: this.name.trim()
    }
  }

}
