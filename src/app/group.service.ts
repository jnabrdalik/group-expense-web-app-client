import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from './model/group';
import { GroupDetails } from './model/group';
import { Debt } from './model/debt';
import { Router } from '@angular/router';
import { Expense, ExpenseChange } from './model/expense';
import { UserService } from './user.service';
import { User } from './model/user';


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiUrl: string;
  private groups = new BehaviorSubject<Group[]>([]);
  groups$ = this.groups.asObservable();
  private groupDetails = new BehaviorSubject<GroupDetails>(null);
  groupDetails$: Observable<GroupDetails> = this.groupDetails.asObservable();
  private debts = new BehaviorSubject<Debt[]>([]);
  private currentGroupId: number;

  private expenseHistory = new BehaviorSubject<ExpenseChange[]>([]);
  expenseChanges$ = this.expenseHistory.asObservable();

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) { 
    this.apiUrl = environment.apiUrl;

    this.userService.isAuthenticated$.subscribe(
      auth => {
        if (auth) {
          this.http.get<Group[]>(`${this.apiUrl}/group`).subscribe(
            response => {this.groups.next(response); console.log(response)}
          );
        }
      }
    );
    
  }

  downloadGroupDetails(id: number) {
    if (this.currentGroupId !== id) {
      this.currentGroupId = id;
      this.http.get<GroupDetails>(`${this.apiUrl}/group/${id}`).subscribe(
        response => {
          this.groupDetails.next(response);
          this.sortExpenses();
        }
      );
    }
  }

  private sortExpenses(): void {
    this.groupDetails.value.expenses.sort((a, b) => b.timestamp - a.timestamp);
  }

  getCurrentGroupId(): number {
    return this.currentGroupId;
  }

  addGroup(name: string, registeredOnly: boolean): void {
    this.http.post<Group>(`${this.apiUrl}/group`, {
      name, registeredOnly
    }).subscribe(
      response => {
        const groups = this.groups.value;
        groups.push(response);
        this.groups.next(groups);
        this.router.navigate(['/groups/'+ response.id]);
      }
    )
  }

  editGroup(group: Group): void {
    this.http.put<Group>(`${this.apiUrl}/group/${group.id}`, {
      name: group.name,
      registeredOnly: group.registeredOnly
    }).subscribe(
      response => {
        const groups = this.groups.value;
        const groupIndex = groups.findIndex(g => g.id === response.id);
        groups[groupIndex] = response;
        this.groups.next(groups);

        const group = this.groupDetails.value;
        group.name = response.name;
        group.registeredOnly = response.registeredOnly;
        this.groupDetails.next(group);
      }
    )
  }
  
  deleteGroup(groupId: number) {
    this.http.delete(`${this.apiUrl}/group/${groupId}`).subscribe(
      _ => {
        const groups = this.groups.value;
        const index = groups.findIndex(g => g.id === groupId);
        groups.splice(index, 1);
        this.groups.next(groups);
        this.router.navigate(groups.length > 0 ? ['/groups/'+ groups[0].id] : ['']);
      }
    )
  }

  addUserToGroup(user: User) {
    this.http.put<User>(`${this.apiUrl}/group/${this.currentGroupId}/${user.id}`, {}).subscribe(
      response => {
        const group = this.groupDetails.value;
        group.users.push(response);
        this.groupDetails.next(group);
      }
    )
  }

  deleteUserFromGroup(user: User) {
    this.http.delete<any>(`${this.apiUrl}/group/${this.currentGroupId}/${user.id}`).subscribe(
          _ => {
        const group = this.groupDetails.value;
        const users = group.users;
        const index = users.indexOf(user);
        users.splice(index, 1);
        this.groupDetails.next(group);
      }
    )
  }

   canDeleteUserFromGroup(user: User): boolean {
    // return this.groupDetails.value.creatorUserName !== person.relatedUserName &&
    //  (!this.groupDetails.value.expenses.some(e => e.payer.id === person.id || e.payees.some(p => p.id === person.id)));
    //temp
    return false;
  }

  addExpense(description: string, amount: number, timestamp: number, payer: User, payees: User[]) {
    this.http.post<Expense>(`${this.apiUrl}/expense`, {
      groupId: this.currentGroupId,
      description,
      amount,
      payerId: payer.id,
      payeesIds: payees.map(p => p.id),
      timestamp
    }).subscribe(
      response => {
        const group = this.groupDetails.value;
        group.expenses.push(response);        
        this.groupDetails.value.users.find(u => u.id === payer.id).balance += response.amount;
        payees.forEach(payee => this.groupDetails.value.users.find(p => p.id === payee.id).balance -= response.amount / payees.length);
        this.groupDetails.next(group);
        this.sortExpenses();
      }
    );
  }

  revertLastChange(expense: Expense) {
    this.http.patch<Expense>(`${this.apiUrl}/expense/${expense.id}/revert`, {}).subscribe(
      response => {
        const group = this.groupDetails.value;
        const index = group.expenses.findIndex(e => e.id === response.id);
        const expense = group.expenses[index];
        expense.description = response.description;
        expense.amount = response.amount;
        expense.payer = response.payer;
        expense.timestamp = response.timestamp;
        expense.payees = response.payees;
        this.groupDetails.next(group);
        this.sortExpenses();
      }
    )
  }
  
  editExpense(expense: Expense) {
    this.http.put<Expense>(`${this.apiUrl}/expense/${expense.id}`, {
      description: expense.description,
      amount: expense.amount,
      payerId: expense.payer.id,
      payeesIds: expense.payees.map(p => p.id),
      timestamp: expense.timestamp
    }).subscribe(
      response => {
        const group = this.groupDetails.value;
        const index = group.expenses.findIndex(e => e.id === response.id);
        const expense = group.expenses[index];
        expense.description = response.description;
        expense.amount = response.amount;
        expense.payer = response.payer;
        expense.timestamp = response.timestamp;
        expense.payees = response.payees;
        this.groupDetails.next(group);
        this.sortExpenses();
        
      }
    );
  }

  deleteExpense(expense: Expense) {
    this.http.delete(`${this.apiUrl}/expense/${expense.id}`).subscribe(
      _ => {
        const group = this.groupDetails.value;
        const expenses = group.expenses;
        const index = expenses.indexOf(expense);
        expenses.splice(index, 1);
        this.groupDetails.next(group);
      }
    )
  }

  downloadExpenseHistory(expense: Expense): void {
    // if (this.currentExpenseId !== expense.id) {
      this.expenseHistory.next([]);
      // this.currentExpenseId = expense.id;
      this.http.get<ExpenseChange[]>(`${this.apiUrl}/expense/${expense.id}/history`).subscribe(
        result => {
          this.expenseHistory.next(result);
          console.log(result);
        }
      );
    // }    
  }

  getDebts(id: number): Observable<Debt[]> {
    this.http.get<Debt[]>(`${this.apiUrl}/group/${id}/debts`).subscribe(
      result => this.debts.next(result)
    );

    return this.debts.asObservable();
  }

  markDebtAsPaid(debt: Debt) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    this.addExpense('Spłata długu', debt.amount, (new Date()).getTime(), debt.debtor, [debt.creditor]);
    const debts = this.debts.value;
    const index = debts.indexOf(debt);
    debts.splice(index, 1);
    this.debts.next(debts);
  }
   
}
