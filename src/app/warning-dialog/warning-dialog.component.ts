import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  template: `
    <div mat-dialog-title>{{data.title}}</div>
    <div mat-dialog-content>{{data.content}}</div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">Anuluj</button>
      <button mat-button [mat-dialog-close]="true" color="warn">{{data.action}}</button>
    </div>
    `
})
export class WarningDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      content: string,
      action: string
    }
  ) { }

}
