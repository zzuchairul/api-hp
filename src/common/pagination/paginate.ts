import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';
import {
  PaginateOptions,
  PaginateResult,
  type PaginationInput,
} from './paginate.interface';

export function paginate<T>(
  data: T,
  total: number,
  options: PaginateOptions = {},
): PaginateResult<T> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, options.limit || 10);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export function getPaginationClause<T>(options: PaginationInput<T>) {
  const { searchBy, searchVal, orderBy, orderVal } = options;

  const where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {};
  if (searchVal && searchBy) {
    where[searchBy] = ILike(`%${searchVal.trim()}%`);
  }

  const order: FindOptionsOrder<T> = {};
  order[orderBy] = orderVal.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return { where, order };
}

export function getPaginationParams(options: PaginateOptions) {
  const take = Math.max(1, options.limit || 10);
  const skip = (Math.max(1, options.page || 1) - 1) * take;
  return { take, skip };
}
