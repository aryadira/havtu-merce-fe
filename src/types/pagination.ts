export interface Pagination {
    page: number;
    limit: number;
}

export const DEFAULT_PAGINATION: Pagination = {
    page: 1,
    limit: 10,
};
