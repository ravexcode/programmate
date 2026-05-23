export interface ColumnData {
  name: string;
  type: string;
  isPk?: boolean;
}

export interface TableNodeData {
  tableName: string;
  columns: ColumnData[];
}