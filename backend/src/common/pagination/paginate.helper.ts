
import { OffsetPaginationParams } from '../../common/interfaces/pagination.interface';

export const SORT_FIELD_MAP: Record<string, string> = {
  originalUrl: 'originDomain',
  originDomain: 'originDomain',
  shortUrl: 'shortSlug',
  visitCount: 'visitCount',
  createdAt: 'createdAt',
};

export async function paginate<T = any>(
  model: any,
  where: Record<string, any>,
  orderBy: Record<string, any>,
  params: OffsetPaginationParams,
): Promise<{ data: T[]; meta: any }> {
  // if (params.after || params.before) {
  //   const [data, meta] = await model
  //     .paginate({ where, orderBy })
  //     .withCursor(params);
  //   return { data, meta };
  // } else {
    const [data, meta] = await model
      .paginate({ where, orderBy })
      .withPages({
        page: params.page,
        limit: params.limit,
        includePageCount: params.includePageCount ?? true,
      });
    return { data, meta };
  // }
}
