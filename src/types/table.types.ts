export interface RowData {
  name: string;
  type: string;
  is_pk?: boolean;
}

export interface ParentNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    tableName: string;
    columns: Array<RowData>
  };
}

export interface RowNode {
  id: string;
  type: string;
  parentId: string;
  extent: string;
  draggable: false;
  position: {
    x: number;
    y: number;
  };
}