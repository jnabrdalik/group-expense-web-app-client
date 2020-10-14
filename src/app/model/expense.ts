import { Person } from './person';

export class Expense {
  id: number;
  description: string;
  amount: number;
  timeAdded: number;
  payer: Person;
  peopleInvolved: Person[]
}