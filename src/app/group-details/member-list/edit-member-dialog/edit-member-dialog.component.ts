import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Member } from 'src/app/model/member';

@Component({
  selector: 'app-edit-member-dialog',
  templateUrl: './edit-member-dialog.component.html',
  styleUrls: ['./edit-member-dialog.component.css']
})
export class EditMemberDialogComponent implements OnInit {

  name: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public input: { title: string, editedMember?: Member, members: Member[] }) { }

  ngOnInit(): void {
    if (this.input.editedMember) {
      this.name = this.input.editedMember.name.slice();
    }
  }

  addButtonDisabled() {
    return this.name.trim() === '' || this.input.members.some(p => p.name === this.name.trim());
  }

  getResult() {
    return {
      id: this.input.editedMember?.id,
      name: this.name.trim()
    }
  }

}
