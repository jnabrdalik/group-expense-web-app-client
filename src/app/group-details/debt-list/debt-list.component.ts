import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { GroupService } from 'src/app/group.service';
import { Debt } from 'src/app/model/debt';

@Component({
  selector: 'app-debt-list',
  templateUrl: './debt-list.component.html',
  styleUrls: ['./debt-list.component.css']
})
export class DebtListComponent implements OnInit {

  private groupId: number;
  debts$: Observable<Debt[]>;

  displayedColumns: string[] = ['creditor', 'debtor', 'amount', 'actions']

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        this.groupId = +params.get('id');
        this.debts$ = this.groupService.getDebts(this.groupId);
      }
    );    
  }

  markAsPaid(debt: Debt) {
    this.groupService.markDebtAsPaid(debt);
  }

}
