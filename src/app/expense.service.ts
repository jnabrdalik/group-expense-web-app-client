import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';;
import { Expense, ExpenseChange, Involvement } from './model/expense';
import { GroupService } from './group.service';
import { Member } from './model/member';
import { tap } from 'rxjs/operators';
import { Debt } from './model/debt';

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
      groupDetails => this.expenses.next(groupDetails.expenses)
    );
    this.groupService.currentGroupId$.subscribe(
      groupId => {this.currentGroupId = groupId; console.log(this.currentGroupId)}
    );
  }

  addExpense(description: string, amount: number, timestamp: number, payer: Member, involvements: Involvement[]) {
    this.http.post<Expense>(`${this.apiUrl}/expense/${this.currentGroupId}`, {
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
    }).subscribe(
      response => this.expenses.value.push(response)
    );
  }

  addDebtPayment(debt: Debt) {
    return this.http.post<Expense>(`${this.apiUrl}/expense/${this.currentGroupId}`, {
      description: null,
      amount: debt.amount,
      timestamp: Date.now(),
      payerId: debt.debtor.id,
      involvements: [{
        payeeId: debt.creditor.id,
        weight: 1
      }]
    }).pipe(tap(
      response => {
        this.expenses.value.push(response);
      }));
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

  setCurrentExpense(expense: Expense): void {
    this.http.get<ExpenseChange[]>(`${this.apiUrl}/expense/${expense.id}/history`).subscribe(
      response => this.expenseChanges.next(response)
    );    
  }
}
