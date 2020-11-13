import { Person } from './person';

export class Expense {
  id: number;
  description: string;
  amount: number;
  payer: Person;
  payees: Person[];
  timestamp: number;
}