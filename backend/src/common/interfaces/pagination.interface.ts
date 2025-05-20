
export interface OffsetPaginationParams {
  page?: number;
  limit?: number;
  includePageCount?: boolean;
}

export interface CursorPaginationParams {
  // after?: string;
  // before?: string;
  // size?: number;
  // getCursor?: (item: any) => string;
  // parseCursor?: (cursor: string) => any;
}

export type PaginationParams = OffsetPaginationParams & CursorPaginationParams;
