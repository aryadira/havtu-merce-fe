export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  previousPage?: number | null;
  nextPage?: number | null;
  offset?: number;
  startIndex?: number;
  endIndex?: number;
  links?: PaginationLinks;
}

export interface PaginationLinks {
  first?: string | null;
  last?: string | null;
  previous?: string | null;
  next?: string | null;
}
