import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/model/group';

@Component({
  selector: 'app-new-group-dialog',
  templateUrl: './new-group-dialog.component.html',
  styleUrls: ['./new-group-dialog.component.css']
})
export class NewGroupDialogComponent implements OnInit {
  name: string = '';
  registeredOnly: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { title: string, group?: Group }
  ) { }

  ngOnInit(): void {
    if (this.input.group) {
      this.name = this.input.group.name.slice();
      this.registeredOnly = this.input.group.registeredOnly;
    }
  }

  isAddButtonDisabled() {
    return this.name.trim().length === 0 ||
    this.input.group && this.name.trim() === this.input.group.name && this.registeredOnly === this.input.group.registeredOnly;
  }

  getResult() {
    return {
      id: this.input.group?.id,
      name: this.name,
      registeredOnly: this.registeredOnly
    }
  }

}
