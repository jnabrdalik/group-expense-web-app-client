import { User } from './user';

export interface Debt {
  creditor: User;
  debtor: User;
  amount: number;
}