import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';;
import { Expense, ExpenseChange, Involvement } from './model/expense';
import { GroupService } from './group.service';
import { Member } from './model/member';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl: string;

  private currentGroupId: number;

  private expenses = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expenses.asObservable();

  private expenseChanges = new BehaviorSubject<ExpenseChange[]>([]);
  expenseChanges$ = this.expenseChanges.asObservable();

  constructor(private http: HttpClient, private groupService: GroupService) {
    this.apiUrl = environment.apiUrl;
    this.groupService.groupDetails$.subscribe(
      group=> {
        this.currentGroupId = group.id;
        this.expenses.next(group.expenses);
        this.sortExpenses();
      }
    );
    this.groupService.groupDetails$.subscribe(
      group => this.currentGroupId = group?.id
    );
  }

  addExpense(description: string, amount: number, timestamp: number, payer: Member, involvements: Involvement[]) {
    return this.http.post<Expense>(`${this.apiUrl}/expense/${this.currentGroupId}`, {
      description,
      amount,
      payerId: payer.id,
      involvements: involvements.map(i => {
        return {
          payeeId: i.payee.id,
          weight: i.weight
        }
      }),
      timestamp
    }).pipe(
      tap(
        response => this.expenses.value.push(response)
      )
    );
  }

  revertLastChange(expense: Expense) {
    this.http.post<Expense>(`${this.apiUrl}/expense/${expense.id}/revert`, {}).subscribe(
      response => {
        const expense = this.expenses.value.find(e => e.id === response.id);
        expense.amount = response.amount;
        expense.description = response.description;
        expense.involvements = response.involvements;
        expense.payer = response.payer;
        expense.timestamp = response.timestamp;
        this.sortExpenses();
      }
    );
  }

  editExpense(expense: Expense) {
    this.http.put<Expense>(`${this.apiUrl}/expense/${expense.id}`, {
      description: expense.description,
      amount: expense.amount,
      payerId: expense.payer.id,
      involvements: expense.involvements.map(i => {
        return {
          payeeId: i.payee.id,
          weight: i.weight
        }
      }),
      timestamp: expense.timestamp
    }).subscribe(
      response => {
        const expense = this.expenses.value.find(e => e.id === response.id);
        expense.amount = response.amount;
        expense.description = response.description;
        expense.involvements = response.involvements;
        expense.payer = response.payer;
        expense.timestamp = response.timestamp;
        this.sortExpenses();
      }
    );
  }

  deleteExpense(expense: Expense) {
    this.http.delete(`${this.apiUrl}/expense/${expense.id}`).subscribe(
      _ => {
        const expenses = this.expenses.value;
        const index = expenses.indexOf(expense);
        expenses.splice(index, 1);
        this.expenses.next(expenses);
      }
    )
  }

  downloadExpenseHistory(expense: Expense): void {
    this.http.get<ExpenseChange[]>(`${this.apiUrl}/expense/${expense.id}/history`).subscribe(
      response => {
        this.expenseChanges.next(response);
        this.sortChanges();
      }
    );
  }

  private sortExpenses(): void {
    this.expenses.value.sort((a, b) => b.timestamp - a.timestamp);
  }

  private sortChanges(): void {
    this.expenseChanges.value.sort((a, b) => a.changeTimestamp - b.changeTimestamp);
  }
}
