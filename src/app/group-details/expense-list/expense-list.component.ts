import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Observable, Subscription } from 'rxjs';
import { ExpenseService } from 'src/app/expense.service';
import { Expense, ExpenseChange } from 'src/app/model/expense';
import { Member } from 'src/app/model/member';
import { WarningDialogComponent } from 'src/app/warning-dialog/warning-dialog.component';
import { NewExpenseDialogComponent } from './new-expense-dialog/new-expense-dialog.component';
import { MemberService } from 'src/app/member.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit, OnDestroy { 
  expenses$: Observable<Expense[]>;
  members: Member[];
  expenseChanges$: Observable<ExpenseChange[]>;
  displayedColumns: string[] = ['description', 'amount', 'payer', 'payees', 'timestamp', 'actions'];  

  private membersSubscription: Subscription;

  constructor(
    private expenseService: ExpenseService,
    private memberService: MemberService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.expenses$ = this.expenseService.expenses$;
    this.expenseChanges$ = this.expenseService.expenseChanges$;
    this.membersSubscription = this.memberService.members$.subscribe(
      members => this.members = members
    )
  }

  ngOnDestroy(): void {
    this.membersSubscription.unsubscribe();
  }

  getPayeesNamesConcat(expense: Expense): string {
    const weighted = expense.involvements.some(i => i.weight !== 1);
    return expense.involvements.map(p => p.payee.name + (weighted ? ' (' + p.weight + ')' : '')).sort((a, b) => a.localeCompare(b)).join(', ');
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

  onRevertLastChange(expense: Expense, panel: MatExpansionPanel): void {
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Cofanie zmiany',
        content: `Czy na pewno chcesz przywrócić wydatek "${expense.description}" do stanu sprzed ostatniej zmiany?`,
        action: 'Cofnij zmianę'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.revertLastChange(expense);
        panel.close();
      }
    });    
  }

  onEditExpense(expense: Expense, panel: MatExpansionPanel): void {
    const dialogRef = this.dialog.open(NewExpenseDialogComponent, {
      data: {
        title: "Edytuj wydatek",
        members: this.members,
        editedExpense: expense
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.editExpense(result);
        panel.close();
      }
    });

  }

  onDeleteExpense(expense: Expense): void {
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Usuwanie wydatku',
        content: expense.description 
          ? `Czy na pewno chcesz usunąć wydatek "${expense.description}"?`
          : "Czy na pewno chcesz usunąć spłatę długu?",
        action: 'Usuń wydatek'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.deleteExpense(expense);
      }
    });    
  }

  onClickExpensePanel(panel: MatExpansionPanel, expense: Expense) {
    if (panel.expanded) {
      this.expenseService.downloadExpenseHistory(expense);
    }
  }
}
