import { User } from './user';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  payer: User;
  payees: User[];
  timestamp: number;
}

export interface ExpenseChange {
  changedBy: User;
  changeTimestamp: number;
  changes: {
    fieldName: string;
    valueBefore: string;
    valueAfter: string;
  }[]

  
}