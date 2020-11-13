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

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { title: string, group?: Group }
  ) { }

  ngOnInit(): void {
    if (this.input.group) {
      this.name = this.input.group.name.slice();
    }
  }

  isAddButtonDisabled() {
    return this.name.trim().length === 0 ||
    this.input.group &&
    this.name.trim() === this.input.group.name;
  }

  getResult() {
    return {
      id: this.input.group?.id,
      name: this.name
    }
  }

}
