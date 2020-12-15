import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Debt } from './model/debt';
import { ExpenseService } from './expense.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private apiUrl: string;

  private debts = new BehaviorSubject<Debt[]>([]);
  private currentGroupId: number;

  constructor(private http: HttpClient, private expenseService: ExpenseService) {
    this.apiUrl = environment.apiUrl;
  }

  getDebtsForGroup(groupId: number): Observable<Debt[]> {
    this.currentGroupId = groupId;
    this.http.get<Debt[]>(`${this.apiUrl}/group/${groupId}/debts`).subscribe(
      result => this.debts.next(result)
    );

    return this.debts.asObservable();
  }

  sendDebtNotification(debt: Debt) {
    return this.http.post<any>(`${this.apiUrl}/mail/debt-notification`, {
      recipientUsername: debt.debtor.relatedUserName,
      groupId: this.currentGroupId,
      amount: debt.amount
    });
  }

  markDebtAsPaid(debt: Debt): Observable<boolean> {
    return this.expenseService.addExpense(
      null,
      debt.amount,
      Date.now(),
      debt.debtor,
      [{ payee: debt.creditor, weight: 1 }]).pipe(map(
        _ => {
          const debts = this.debts.value;
          const index = debts.indexOf(debt);
          debts.splice(index, 1);
          this.debts.next(debts);
          return true;
        }
      ));
  }
}
