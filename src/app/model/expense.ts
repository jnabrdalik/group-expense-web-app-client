import { Member } from './member';
import { User } from './user';

export interface Expense {
  id: number;
  description: string;
  amount: number;
  payer: Member;
  involvements: Involvement[];
  timestamp: number;
}

export interface Involvement {
  payee: Member;
  weight: number;
}

export interface ExpenseChange {
  changedBy: User;
  changeTimestamp: number;
  changes: FieldChange[];  
}

interface FieldChange {
  fieldName: string;
  valueBefore: string;
  valueAfter: string;
}