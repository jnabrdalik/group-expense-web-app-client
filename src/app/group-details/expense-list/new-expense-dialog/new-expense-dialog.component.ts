import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expense, Involvement } from 'src/app/model/expense';
import { Member } from 'src/app/model/member';

@Component({
  selector: 'app-new-expense-dialog',
  templateUrl: './new-expense-dialog.component.html',
  styleUrls: ['./new-expense-dialog.component.css']
})
export class NewExpenseDialogComponent implements OnInit {
  
  description: string = '';
  amount: number;
  payer: Member;
  involvements: { selected: boolean, weight: number }[];
  date: Date

  constructor(
    @Inject(MAT_DIALOG_DATA) public input: { title: string, editedExpense?: Expense, members: Member[] } 
    ) {}

  ngOnInit() {
    console.log(this.input);
    if (this.input.editedExpense) {
      const expense = this.input.editedExpense;
      this.description = expense.description.slice();
      this.amount = expense.amount / 100;
      this.date = new Date(expense.timestamp);
      this.payer = this.input.members.find(e => e.id === expense.payer.id);
      this.involvements = this.input.members.map(m => {
        const involvement = expense.involvements.find(i => i.payee.id === m.id);

        return {
          selected: involvement !== undefined,
          weight: involvement ? involvement.weight : 1
        }
      });
    }
    else {
      this.date = new Date();
      this.date.setHours(0, 0, 0, 0);
      this.involvements = this.input.members.map(_ => {
        return {
          selected: false,
          weight: 1
        }
      });
    }
    
  }

  isAddButtonDisabled(): boolean {
    return this.description.trim().length === 0 ||
      !this.amount ||
      !this.payer ||
      !this.involvements.some(i => i.selected) ||
      (this.input.editedExpense && this.noChanges());
  }

  onCheckChange(index: number) {
    if (!this.involvements[index].selected) {
      this.involvements[index].weight = 1;
    }
  }

  onAddWeight(index: number) {
    this.involvements[index].weight++;
  }

  onSubtractWeight(index: number) {
    if (this.involvements[index].weight > 1) {
      this.involvements[index].weight--;
    }
  }

  private noChanges(): boolean {    
    const expense = this.input.editedExpense;
    
    const newMapping = this.input.members.map(m => {
      const involvement = expense.involvements.find(i => i.payee.id === m.id);

      return {
        selected: involvement !== undefined,
        weight: involvement ? involvement.weight : 1
      }
    });
  
    return this.description.trim() === expense.description &&
    Math.round(this.amount * 100) === expense.amount &&
    this.date.getTime() === expense.timestamp &&
    this.payer.id === expense.payer.id &&
    this.involvements.every((involvement, index) =>
      newMapping[index].selected === involvement.selected && newMapping[index].weight === involvement.weight);
  
  }

  getResult() {
    return {
      id: this.input.editedExpense?.id,
      amount: Math.round(this.amount * 100),
      description: this.description,
      timestamp: this.date.getTime(),
      payer: this.payer,
      involvements: this.involvements.map((involvement, i) => {
        if (involvement.selected) {
          return {
            payee: this.input.members[i],
            weight: involvement.weight
          }
        }
        
        return null;        
      }).filter(i => i !== null)
    }
  }

}
