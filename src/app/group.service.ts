import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group } from './model/group';
import { GroupDetails } from './model/group-details';
import { Debt } from './model/debt';
import { Router } from '@angular/router';
import { Person } from './model/person';
import { Expense } from './model/expense';


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private apiUrl: string;
  private groups = new BehaviorSubject<Group[]>([]);
  private groupDetails = new BehaviorSubject<GroupDetails>(null);
  private debts = new BehaviorSubject<Debt[]>([]);
  private currentGroupId: number;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    this.apiUrl = environment.apiUrl;
  }

  getGroupList(): Observable<Group[]> {    
    this.http.get<Group[]>(`${this.apiUrl}/group`).subscribe(
      response => this.groups.next(response));    

    return this.groups.asObservable();
  }

  getGroupDetails(id: number): Observable<GroupDetails> {
    if (this.currentGroupId !== id) {
      this.currentGroupId = id;
      this.http.get<GroupDetails>(`${this.apiUrl}/group/${id}`).subscribe(
        response => {
          this.groupDetails.next(response);
          this.sortExpenses();
        }
      );
    }
    
    return this.groupDetails.asObservable();
  }

  private sortExpenses(): void {
    this.groupDetails.value.expenses.sort((a, b) => b.timestamp - a.timestamp);
  }

  getCurrentGroupId(): number {
    return this.currentGroupId;
  }

  addGroup(name: string): void {
    this.http.post<Group>(`${this.apiUrl}/group`, {
      name
    }).subscribe(
      response => {
        const groups = this.groups.value;
        groups.push(response);
        this.groups.next(groups);
        this.router.navigate(['groups', response.id]);
      }
    )
  }

  editGroup(group: Group): void {
    this.http.put<Group>(`${this.apiUrl}/group/${group.id}`, {
      name: group.name
    }).subscribe(
      response => {
        const groups = this.groups.value;
        const groupIndex = groups.findIndex(g => g.id === response.id);
        groups[groupIndex] = response;
        this.groups.next(groups);

        const group = this.groupDetails.value;
        group.name = response.name;
        this.groupDetails.next(group);
      }
    )
  }
  
  deleteGroup(groupId: number) {
    this.http.delete(`${this.apiUrl}/group/${groupId}`).subscribe(
      _ => {
        const groups = this.groups.value;
        const index = groups.findIndex(g => g.id = groupId);
        groups.splice(index, 1);
        this.groups.next(groups);
        this.router.navigate(groups.length > 0 ? ['groups', groups[0].id] : ['']);
      }
    )
  }

  addPerson(name: string, relatedUserId: number = 0): void {
    this.http.post<Person>(`${this.apiUrl}/person`, {
      groupId: this.currentGroupId,
      name,
      relatedUserId
    }).subscribe(
      response => {
        const group = this.groupDetails.value;
        group.persons.push(response);
        this.groupDetails.next(group);
      }
    );
  }

  editPerson(person: Person): void {
    this.http.put<Person>(`${this.apiUrl}/person/${person.id}`, {
      name: person.name
    }).subscribe(
      response => {
        const group = this.groupDetails.value;
        const persons = group.persons;
        const index = persons.findIndex(p => p.id === response.id);
        persons[index] = response;
        this.groupDetails.next(group);
      }
    )
  }

  canDeletePerson(person: Person): boolean {
    return this.groupDetails.value.creatorUserName !== person.relatedUserName &&
     (!this.groupDetails.value.expenses.some(e => e.payer.id === person.id || e.payees.some(p => p.id === person.id)));
  }

  deletePerson(person: Person): void {
    this.http.delete<Person>(`${this.apiUrl}/person/${person.id}`).subscribe(
      _ => {
        const group = this.groupDetails.value;
        const persons = group.persons;
        const index = persons.indexOf(person);
        persons.splice(index, 1);
        this.groupDetails.next(group);
      }
    )
  }

  addExpense(description: string, amount: number, timestamp: number, payer: Person, payees: Person[]) {
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
        this.groupDetails.next(group);
        this.sortExpenses();
      }
    );
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
        group.expenses[index] = response;
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

  getDebts(id: number): Observable<Debt[]> {
    this.http.get<Debt[]>(`${this.apiUrl}/group/${id}/debts`).subscribe(
      result => this.debts.next(result)
    );

    return this.debts.asObservable();
  }

  markDebtAsPaid(debt: Debt) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    this.addExpense('SPŁATA', debt.amount, (new Date()).getTime(), debt.debtor, [debt.creditor]);
    const debts = this.debts.value;
    const index = debts.indexOf(debt);
    debts.splice(index, 1);
    this.debts.next(debts);
  }
   
}
