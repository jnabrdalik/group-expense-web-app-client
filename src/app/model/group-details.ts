import { Expense } from "./expense";
import { Person } from './person';

export class GroupDetails {
  id: number;
  name: string;
  description: string;
  timeCreated: number;
  expenses: Expense[];
  persons: Person[];
}