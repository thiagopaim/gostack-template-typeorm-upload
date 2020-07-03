import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private transactions: Transaction[];

  constructor() {
    super();
    this.transactions = [];
  }

  public async all(): Promise<Transaction[]> {
    this.transactions = await this.find();

    return this.transactions;
  }

  public async getBalance(): Promise<Balance> {
    const transactions = await this.all();

    // outcome items
    const outcomePattern = /outcome/;
    const outcomeItems = transactions.filter(item =>
      outcomePattern.test(item.type),
    );

    const outcomeItemsFiltered = outcomeItems.map(item =>
      Math.floor(item.value),
    );

    const outcome = outcomeItemsFiltered.reduce((a, b) => a + b, 0);
    // ---------------------------------------------------

    // income items
    const incomePattern = /income/;
    const incomeItems = transactions.filter(item =>
      incomePattern.test(item.type),
    );

    const incomeItemsFiltered = incomeItems.map(item => Math.floor(item.value));

    const income = incomeItemsFiltered.reduce((a, b) => a + b, 0);
    // ---------------------------------------------------

    const total = income - outcome;

    const balance = { income, outcome, total };

    return balance;
  }
}

export default TransactionsRepository;
