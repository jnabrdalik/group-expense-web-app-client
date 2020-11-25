import { Expense } from './expense';
import { User } from './user';

export interface Group {
  id: number;
  name: string;
  timeCreated: number;
  creatorUserName: string;
  registeredOnly: boolean;
}

export interface GroupDetails extends Group {
  expenses: Expense[];
  users: User[];
}