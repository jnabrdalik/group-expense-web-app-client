import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from 'src/app/group.service';
import { Expense } from 'src/app/model/expense';
import { GroupDetails } from 'src/app/model/group-details';
import { Person } from 'src/app/model/person';
import { NewExpenseDialogComponent } from './new-expense-dialog/new-expense-dialog.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {

  @Input() group: GroupDetails;

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  getPeopleInvolvedNames(expense: Expense) {
    return expense.peopleInvolved.map(p => p.name).sort((a, b) => a.localeCompare(b)).join(', ')
  }

  addNewExpense(): void {
    const dialogRef = this.dialog.open(NewExpenseDialogComponent, {
      data: {
        title: "Dodaj wydatek",
        persons: this.group.persons
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.addExpense(result.description, result.amount, result.payer, result.peopleInvolved);
        }
      }
    )
  }

  editExpense(expense: Expense): void {
    const dialogRef = this.dialog.open(NewExpenseDialogComponent, {
      data: {
        title: "Edytuj wydatek",
        persons: this.group.persons,
        editedExpense: expense
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.editExpense(result)
        }
      }
    )
  }

  deleteExpense(expense: Expense): void {
    // warning TODO

    this.groupService.deleteExpense(expense);
  }

}
