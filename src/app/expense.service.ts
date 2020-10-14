import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GroupService } from './group.service';
import { Expense } from './model/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private expenses = new BehaviorSubject<Expense[]>([]);

  constructor(
  ) { }


}
