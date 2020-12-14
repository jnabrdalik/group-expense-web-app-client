import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { Group } from './model/group';
import { GroupDetails } from './model/group';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl: string;

  private groups = new BehaviorSubject<Group[]>([]);
  groups$ = this.groups.asObservable();

  private groupDetails = new BehaviorSubject<GroupDetails>(null);
  groupDetails$: Observable<GroupDetails> = this.groupDetails.asObservable();

  // private debts = new BehaviorSubject<Debt[]>([]);

  private currentGroupId = new BehaviorSubject<number>(null);
  currentGroupId$ = this.currentGroupId.asObservable();

  // private expenseHistory = new BehaviorSubject<ExpenseChange[]>([]);
  // expenseChanges$ = this.expenseHistory.asObservable();

  constructor(private userService: UserService, private http: HttpClient, private router: Router
  ) { 
    this.apiUrl = environment.apiUrl;
    this.userService.isAuthenticated$.subscribe(
      auth => {
        if (auth) {
          this.http.get<Group[]>(`${this.apiUrl}/group`).subscribe(
            response => this.groups.next(response)
          );
        }
      }
    );    
  }

  downloadGroupDetails(groupId: number) {
    console.log(groupId);
    this.currentGroupId.next(groupId);
    this.http.get<GroupDetails>(`${this.apiUrl}/group/${groupId}`).subscribe(
      response => {
        this.groupDetails.next(response); console.log(response)
      },
      _ => this.router.navigate([''])
    );
  }

  addGroup(name: string, forRegisteredOnly: boolean): void {
    this.http.post<Group>(`${this.apiUrl}/group`, {
      name, forRegisteredOnly
    }).subscribe(
      response => {
        this.groups.value.push(response);
        this.router.navigate(['/groups/'+ response.id]);
      }
    )
  }

  editGroup(group: Group) {
    return this.http.put<Group>(`${this.apiUrl}/group/${group.id}`, {
      name: group.name,
      forRegisteredOnly: group.forRegisteredOnly
    }).pipe(tap(
      response => {
        const groups = this.groups.value;
        const groupIndex = groups.findIndex(g => g.id === response.id);
        groups[groupIndex] = response;
        this.groups.next(groups);

        const group = this.groupDetails.value;
        group.name = response.name;
        group.forRegisteredOnly = response.forRegisteredOnly;
        this.groupDetails.next(group);
      }
    ));
  }

  archiveGroup(groupId: number) {
    return this.http.put(`${this.apiUrl}/group/${groupId}/archive`, {}).pipe(tap(
      _ => {
        this.groups.value.find(g => g.id === groupId).archived = true;
        this.groupDetails.value.archived = true;
      }
    ));   
    
  }
  
  deleteGroup(groupId: number) {
    return this.http.delete(`${this.apiUrl}/group/${groupId}`).pipe(tap(
      _ => {
        const groups = this.groups.value;
        const index = groups.findIndex(g => g.id === groupId);
        groups.splice(index, 1);
        this.groups.next(groups);
        this.router.navigate(groups.length > 0 ? ['/groups/'+ groups[0].id] : ['']);
      }
    ));
  }

  // deleteMember(member: Member) {
  //   return this.http.delete<any>(`${this.apiUrl}/member/${member.id}`).pipe(tap(
  //       _ => {
  //       const group = this.groupDetails.value;
  //       const users = group.members;
  //       const index = users.indexOf(member);
  //       users.splice(index, 1);
  //       this.groupDetails.next(group);
  //     }
  //   ));
  // }   

  // addExpense(description: string, amount: number, timestamp: number, payer: Member, involvements: Involvement[]) {
  //   this.http.post<Expense>(`${this.apiUrl}/expense`, {
  //     groupId: this.currentGroupId,
  //     description,
  //     amount,
  //     payerId: payer.id,
  //     involvements: involvements.map(i => {
  //       return {
  //         payeeId: i.payee.id,
  //         weight: i.weight
  //       }        
  //     }),
  //     timestamp
  //   }).subscribe(
  //     response => {
  //       const group = this.groupDetails.value;
  //       group.expenses.push(response);
  //       this.groupDetails.next(group);
  //       this.sortExpenses();
  //     }
  //   );
  // }

  // revertLastChange(expense: Expense) {
  //   this.http.post<Expense>(`${this.apiUrl}/expense/${expense.id}/revert`, {}).subscribe(
  //     response => {
  //       const group = this.groupDetails.value;
  //       const index = group.expenses.findIndex(e => e.id === response.id);
  //       const expense = group.expenses[index];
  //       expense.description = response.description;
  //       expense.amount = response.amount;
  //       expense.payer = response.payer;
  //       expense.timestamp = response.timestamp;
  //       expense.involvements = response.involvements;
  //       this.groupDetails.next(group);
  //       this.sortExpenses();
  //     }
  //   )
  // }
  
  // editExpense(expense: Expense) {
  //   this.http.put<Expense>(`${this.apiUrl}/expense/${expense.id}`, {
  //     description: expense.description,
  //     amount: expense.amount,
  //     payerId: expense.payer.id,
  //     involvements: expense.involvements.map(i => {
  //       return {
  //         payeeId: i.payee.id,
  //         weight: i.weight
  //       }        
  //     }),
  //     timestamp: expense.timestamp
  //   }).subscribe(
  //     response => {
  //       const group = this.groupDetails.value;
  //       const index = group.expenses.findIndex(e => e.id === response.id);
  //       const expense = group.expenses[index];
  //       expense.description = response.description;
  //       expense.amount = response.amount;
  //       expense.payer = response.payer;
  //       expense.timestamp = response.timestamp;
  //       expense.involvements = response.involvements;
  //       this.groupDetails.next(group);
  //       this.sortExpenses();        
  //     }
  //   );
  // }

  // deleteExpense(expense: Expense) {
  //   this.http.delete(`${this.apiUrl}/expense/${expense.id}`).subscribe(
  //     _ => {
  //       const group = this.groupDetails.value;
  //       const expenses = group.expenses;
  //       const index = expenses.indexOf(expense);
  //       expenses.splice(index, 1);
  //       this.groupDetails.next(group);
  //     }
  //   )
  // }

  // downloadExpenseHistory(expense: Expense): void {
  //   // if (this.currentExpenseId !== expense.id) {
  //     this.expenseHistory.next([]);
  //     // this.currentExpenseId = expense.id;
  //     this.http.get<ExpenseChange[]>(`${this.apiUrl}/expense/${expense.id}/history`).subscribe(
  //       result => {
  //         this.expenseHistory.next(result);
  //         console.log(result);
  //       }
  //     );
  //   // }    
  // }

  // getDebts(id: number): Observable<Debt[]> {
  //   this.http.get<Debt[]>(`${this.apiUrl}/group/${id}/debts`).subscribe(
  //     result => this.debts.next(result)
  //   );
  //   console.log(this.debts.value)

  //   return this.debts.asObservable();
  // }

  // isGroupMember(username: string): boolean {
  //   return this.groupDetails.value.members.some(
  //     m => m.relatedUserName === username
  //   );
  // }

  // addGroupMember(name: string, relatedUserName?: string) {
  //   this.http.post<Member>(`${this.apiUrl}/member/`, {
  //     name, relatedUserName, groupId: this.currentGroupId
  //   }).subscribe(
  //     response => {
  //       const group = this.groupDetails.value;
  //       const members = group.members;
  //       members.push(response);
  //       this.groupDetails.next(group);
  //     }
  //   )
  // }

  // editMemberName(member: Member) {
  //   this.http.put<Member>(`${this.apiUrl}/member/${member.id}`, {
  //     name: member.name
  //   }).subscribe(
  //     response => {
  //       this.groupDetails.value.members.find(m => m.id === response.id).name = response.name;
  //       this.sortMembers();
  //     }
  //   )
  // }

  // addDebtPayment(debt: Debt) {
  //   return this.http.post<Expense>(`${this.apiUrl}/expense/payment`, {
  //     groupId: this.currentGroupId,
  //     payerId: debt.debtor.id,
  //     payeeId: debt.creditor.id,
  //     amount: debt.amount
  //   }).pipe(tap(
  //     response => {
  //       this.groupDetails.value.expenses.push(response);
  //       this.sortExpenses();

  //       const debts = this.debts.value;
  //       const index = debts.indexOf(debt);
  //       debts.splice(index, 1);
  //       this.debts.next(debts);
  //     }
  //   ));
  // }
  
  // sendDebtNotification(debt: Debt) {
  //   return this.http.post<any>(`${this.apiUrl}/mail/debt-notification`, {
  //     recipientUsername: debt.debtor.relatedUserName,
  //     groupId: this.currentGroupId,
  //     amount: debt.amount
  //   });
  // }

  // private sortExpenses(): void {
  //   this.groupDetails.value.expenses.sort((a, b) => b.timestamp - a.timestamp);
  // }

  // private sortMembers(): void {
  //   this.groupDetails.value.members.sort((a, b) => a.name.localeCompare(b.name));
  // }
   
}
