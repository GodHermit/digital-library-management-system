export interface IPaginate<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, string][];
  };
  links: {
    current: string;
  };
}

export type IFilters<T, FilterableKeys extends keyof T = keyof T> = {
  [key in `filter.${string & keyof Pick<T, FilterableKeys>}`]?:
    | string
    | number
    | boolean;
};

export type IPaginateParams<
  T extends object,
  FilterableKeys extends keyof T = keyof T,
  SortableKeys extends keyof T = keyof T,
  SearchableKeys extends keyof T = keyof T,
> = {
  page?: number;
  limit?: number;
  sortBy?: `${string & keyof Pick<T, SortableKeys>}:${'ASC' | 'DESC'}`[];
  search?: string;
  searchBy?: keyof Pick<T, SearchableKeys>[];
} & IFilters<T, FilterableKeys>;
