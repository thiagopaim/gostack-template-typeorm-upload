import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Type {
  title: string;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getBalance(): Promise<Type[]> {
    const categories = await this.find();

    return categories;
  }
}

export default CategoriesRepository;
