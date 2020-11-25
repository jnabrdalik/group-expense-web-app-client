import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { GroupService } from 'src/app/group.service';
import { Expense, ExpenseChange } from 'src/app/model/expense';
import { GroupDetails } from 'src/app/model/group';
import { NewExpenseDialogComponent } from './new-expense-dialog/new-expense-dialog.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit {

  @Input() group: GroupDetails;
  displayedColumns: string[] = ['description', 'amount', 'payer', 'payees', 'timestamp', 'actions'];

  expenseChanges$: Observable<ExpenseChange[]>;

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.expenseChanges$ = this.groupService.expenseChanges$;
  }

  getPayeesNames(expense: Expense): string {
    // if (expense.payees.length === this.group.persons.length) {
    //   return " wszystkich";
    // }
    // else if (expense.payees.length >= this.group.persons.length / 2) {
    //   return " wszystkich poza: " +
    //     this.group.persons.filter(p1 => expense.payees.every(p2 => p1.name !== p2.name)).map(p => p.name).sort((a, b) => a.localeCompare(b)).join(', ');
    // }

    return expense.payees.map(p => p.name).sort((a, b) => a.localeCompare(b)).join(', ')
  }

  getFieldName(field: string): string {
    var fieldName: string;

    switch (field) {
      case 'amount':
        fieldName = 'Kwotę ';
        break;
      case 'description':
        fieldName = 'Opis ';
        break;
      case 'timestamp':
        fieldName = 'Datę ';
        break;
      case 'payer':
        fieldName = 'Płatnika ';
        break;
      case 'payees':
        fieldName = 'Listę dłużników ';
        break;     
    }

    return fieldName;
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
        users: this.group.users
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

  revertLastChange(expense: Expense, panel: MatExpansionPanel): void {
    this.groupService.revertLastChange(expense);
    panel.close();
  }

  editExpense(expense: Expense, panel: MatExpansionPanel): void {
    const dialogRef = this.dialog.open(NewExpenseDialogComponent, {
      data: {
        title: "Edytuj wydatek",
        users: this.group.users,
        editedExpense: expense
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.groupService.editExpense(result);
          panel.close();
        }
      }
    );

  }

  deleteExpense(expense: Expense): void {
    // warning TODO

    this.groupService.deleteExpense(expense);
  }

  downloadExpenseHistory(expense: Expense) {
    this.groupService.downloadExpenseHistory(expense);
  }

}
