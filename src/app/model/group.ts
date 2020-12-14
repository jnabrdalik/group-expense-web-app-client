import { Expense } from './expense';
import { Member } from './member';

export interface Group {
  id: number;
  name: string;
  timeCreated: number;
  creatorName: string;
  forRegisteredOnly: boolean;
  archived: boolean;
}

export interface GroupDetails extends Group {
  expenses: Expense[];
  members: Member[];
}