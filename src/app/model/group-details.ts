import { Expense } from "./expense";
import { Person } from './person';

export class GroupDetails {
  id: number;
  name: string;
  timeCreated: number;
  creatorUserName: string;
  expenses: Expense[];
  persons: Person[];
}