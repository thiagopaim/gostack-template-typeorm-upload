import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // check balance health
    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome' && value > balance.total)
      throw new AppError('You don`t have money enough', 400);
    // ------------------------------------------------------

    // check category
    const createCategory = new CreateCategoryService();
    const theCategory = await createCategory.execute({ title: category });
    // ------------------------------------------------------

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: theCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
