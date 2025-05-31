export type ITableRows<T> = {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => React.ReactNode;
}[];
