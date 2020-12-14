import { Member } from './member';

export interface Debt {
  creditor: Member;
  debtor: Member;
  amount: number;
}