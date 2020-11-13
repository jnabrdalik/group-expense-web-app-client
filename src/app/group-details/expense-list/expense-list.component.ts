import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupService } from 'src/app/group.service';
import { Expense } from 'src/app/model/expense';
import { GroupDetails } from 'src/app/model/group-details';
import { NewExpenseDialogComponent } from './new-expense-dialog/new-expense-dialog.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {

  @Input() group: GroupDetails;
  displayedColumns: string[] = ['description', 'amount', 'payer', 'payees', 'timestamp', 'actions']

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  getPayeesNames(expense: Expense) {
    return expense.payees.map(p => p.name).sort((a, b) => a.localeCompare(b)).join(', ')
  }

  haveDifferentDate(e1: Expense, e2: Expense): boolean {
    const d1 = new Date(e1.timestamp);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date(e2.timestamp);
    d2.setHours(0, 0, 0, 0);

    return d1.getTime() !== d2.getTime();
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
          this.groupService.addExpense(result.description, result.amount, result.timestamp, result.payer, result.payees);
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
