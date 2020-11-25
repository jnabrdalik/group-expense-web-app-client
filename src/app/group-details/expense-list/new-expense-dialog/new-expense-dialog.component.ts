import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expense } from 'src/app/model/expense';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-new-expense-dialog',
  templateUrl: './new-expense-dialog.component.html',
  styleUrls: ['./new-expense-dialog.component.css']
})
export class NewExpenseDialogComponent implements OnInit {
  
  description: string = '';
  amount: number;
  payer: User;
  peopleSelected: boolean[];
  date: Date

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { title: string, editedExpense?: Expense, users: User[] } 
    ) {}

  ngOnInit() {
    console.log(this.input);
    if (this.input.editedExpense) {
      const expense = this.input.editedExpense;
      this.description = expense.description.slice();
      this.amount = expense.amount / 100;
      this.date = new Date(expense.timestamp);
      this.payer = this.input.users.find(e => e.id === expense.payer.id);
      this.peopleSelected = this.input.users.map(p1 => expense.payees.some(p2 => p1.id === p2.id))
    }
    else {
      this.date = new Date();
      this.date.setHours(0, 0, 0, 0);
      this.peopleSelected = this.input.users.map(_ => false);
    }
    
  }

  isAddButtonDisabled(): boolean {
    return this.description.trim().length === 0 ||
      !this.amount ||
      !this.payer ||
      !this.peopleSelected.some(p => p) ||
      (this.input.editedExpense && this.noChanges());
  }

  private noChanges(): boolean {    
    const expense = this.input.editedExpense;
  
    return this.description.trim() === expense.description &&
    Math.round(this.amount * 100) === expense.amount &&
    this.date.getTime() === expense.timestamp &&
    this.payer.id === expense.payer.id &&
    this.peopleSelected.every((v, i) => v === this.input.users.map(p1 => expense.payees.some(p2 => p1.id === p2.id))[i])
  }

  getResult() {
    return {
      id: this.input.editedExpense?.id,
      amount: Math.round(this.amount * 100),
      description: this.description,
      timestamp: this.date.getTime(),
      payer: this.payer,
      payees: this.peopleSelected.map((selected, i) => selected ? this.input.users[i] : null).filter(p => p),
    }
  }

}
