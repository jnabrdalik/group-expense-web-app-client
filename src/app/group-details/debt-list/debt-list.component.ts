import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Debt } from 'src/app/model/debt';
import { UserService } from 'src/app/user.service';
import { DebtService } from 'src/app/debt.service';

@Component({
  selector: 'app-debt-list',
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.css']
})
export class DebtListComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;

  debts$: Observable<Debt[]>;
  isAuth$: Observable<boolean>;
  debtorsNotifiedIds: number[];
  displayedColumns: string[] = ['creditor', 'debtor', 'amount', 'actions'];  

  constructor(
    private userService: UserService,
    private debtService: DebtService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.debtorsNotifiedIds = [];
    this.routeSubscription = this.route.paramMap.subscribe(
      params => {
        const groupId = +params.get('id');
        this.debts$ = this.debtService.getDebtsForGroup(groupId);
      }
    );

    this.isAuth$ = this.userService.isAuthenticated$;
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  onMarkAsPaid(debt: Debt) {
    this.debtService.markDebtAsPaid(debt).subscribe(
      _ => this.snackbar.open(`Dług został oznaczony jako zapłacony.` , 'OK')
    );
  }

  onSendNotification(debt: Debt) {
    this.debtorsNotifiedIds.push(debt.debtor.id);
    this.debtService.sendDebtNotification(debt).subscribe(
      _ => this.snackbar.open(`Powiadomienie o długu zostało wysłane do: ${debt.debtor.name}.` , 'OK')
    );
  }

  notifyButtonDisabled(debt: Debt): boolean {
    return this.debtorsNotifiedIds.includes(debt?.debtor.id) || debt?.debtor.relatedUserName === null;
  }
}
