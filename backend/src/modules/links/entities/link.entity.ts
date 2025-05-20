export interface Link {
  id: number;
  originalUrl: string;
  originDomain: string;
  shortSlug: string;
  createdAt: Date;
  updatedAt: Date;
  visitCount: number;
  userId?: string;
}
