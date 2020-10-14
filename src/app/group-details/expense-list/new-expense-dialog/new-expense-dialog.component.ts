import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expense } from 'src/app/model/expense';
import { Person } from 'src/app/model/person';

@Component({
  selector: 'app-new-expense-dialog',
  templateUrl: './new-expense-dialog.component.html',
  styleUrls: ['./new-expense-dialog.component.css']
})
export class NewExpenseDialogComponent implements OnInit {
  
  description: string = '';
  amount: number;
  payer: Person;
  peopleSelected: boolean[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { title: string, editedExpense?: Expense, persons: Person[] } 
    ) {}

  ngOnInit() {
    console.log(this.input);
    if (this.input.editedExpense) {
      const expense = this.input.editedExpense;
      this.description = expense.description.slice();
      this.amount = expense.amount / 100;
      this.payer = this.input.persons.find(e => e.id === expense.payer.id);
      this.peopleSelected = this.input.persons.map(p1 => expense.peopleInvolved.some(p2 => p1.id === p2.id))
    }
    else {
      this.peopleSelected = this.input.persons.map(_ => false);
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
    this.payer.id === expense.payer.id &&
    this.peopleSelected.every((v, i) => v === this.input.persons.map(p1 => expense.peopleInvolved.some(p2 => p1.id === p2.id))[i])
  }

  getResult() {
    return {
      id: this.input.editedExpense?.id,
      amount: Math.round(this.amount * 100),
      description: this.description,
      payer: this.payer,
      peopleInvolved: this.peopleSelected.map((selected, i) => selected ? this.input.persons[i] : null).filter(p => p)
    }
  }

}
