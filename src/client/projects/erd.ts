import { getUser } from "@/modules/user.module";
import { getTeam } from "@/modules/project/main.module";
import { saveERD } from "@/modules/erd.module";

import type { Node, Edge } from "@xyflow/react";
import { arrayMove } from "@dnd-kit/sortable";

import type { UserData } from "@/types/user.types";
import type Team from "@/types/team.types";
import { ParentNode } from "@/types/table.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

//-------- Constants --------
export const ROW_HEIGHT = 36;
export const HEADER_HEIGHT = 38;

//-------- Types --------
export interface Column {
  key: string;
  name: string;
  type: string;
}

type TableData = {
  tableName: string;
  columns: Column[];
};

export type Translator = (table: TableData) => string;

//-------- Data loading --------
type LoadResult = {
  user: UserData;
  team: Team;
  nodes: Node[];
  edges: Edge[];
};

export async function loadErdPage(
  id: number,
  router: AppRouterInstance,
  snackbar: React.RefObject<null>
): Promise<LoadResult | null> {
  const user = await getUser(router);

  if(!user) return null;

  const team = await getTeam({ id, router, snackbar });

  if(!team) return null;

  return {
    user,
    team,
    nodes: team.ERD || [],
    edges: team.ERD_connections || [],
  };
}

//-------- Table creation --------
export function buildTableNodes(name: string, rows: Column[]): Node[] {
  const nodes: Node[] = [];

  const columns = rows.map((row, i) => ({
    ...row,
    key: `row-${name}-${i}`,
  }));

  const table: ParentNode = {
    id: `${name}-table`,
    type: "tableContainer",
    position: { x: 0, y: 0 },
    data: { tableName: name, columns },
  };

  nodes.push(table);

  for(let index = 0; index < columns.length; index++) {
    nodes.push({
      id: `col-${name}-${index + 1}`,
      type: "columnHandle",
      parentId: `${name}-table`,
      extent: "parent",
      position: { x: 0, y: HEADER_HEIGHT + ROW_HEIGHT * index },
      draggable: false,
      data: {},
    });
  }

  return nodes;
}

//-------- Column mutations (pure, operate on nodes array) --------
export function appendColumn(nodes: Node[], table: Node): Node[] {
  const columns = (table.data.columns as Column[]) || [];
  const tableName = table.data.tableName as string;
  const nextIndex = columns.length;

  const updated = nodes.map((node) =>
    node.id === table.id
      ? {
          ...node,
          data: {
            ...node.data,
            columns: [
              ...columns,
              {
                key: `row-${tableName}-${nextIndex}`,
                name: "",
                type: "",
              },
            ],
          },
        }
      : node
  );

  return [
    ...updated,
    {
      id: `col-${tableName}-${nextIndex + 1}`,
      type: "columnHandle",
      parentId: `${tableName}-table`,
      extent: "parent",
      position: { x: 0, y: HEADER_HEIGHT + ROW_HEIGHT * nextIndex },
      draggable: false,
      data: {},
    },
  ];
}

export function removeColumnNode(
  nodes: Node[],
  tableId: string,
  columnKey: string
): Node[] {
  const tableNode = nodes.find((n) => n.id === tableId);
  if(!tableNode) return nodes;

  const columns = tableNode.data.columns as Column[];
  if(!columns.find((c) => c.key === columnKey)) return nodes;

  const tableName = tableNode.data.tableName as string;

  const withoutColumn = nodes.map((node) => {
    if(node.id !== tableId) return node;

    return {
      ...node,
      data: {
        ...node.data,
        columns: columns.filter((c) => c.key !== columnKey),
      },
    };
  });

  //Reposition remaining columnHandle nodes
  let rowIndex = 0;
  return withoutColumn.map((node) => {
    if(node.parentId === `${tableName}-table` && node.type === "columnHandle") {
      const pos = { x: 0, y: HEADER_HEIGHT + ROW_HEIGHT * rowIndex };
      rowIndex++;
      return { ...node, position: pos };
    }
    return node;
  });
}

export function updateColumnField(
  nodes: Node[],
  tableId: string,
  columnKey: string,
  field: "name" | "type",
  value: string
): Node[] {
  return nodes.map((node) => {
    if(node.id !== tableId) return node;

    return {
      ...node,
      data: {
        ...node.data,
        columns: (node.data.columns as Column[]).map((col) =>
          col.key === columnKey ? { ...col, [field]: value } : col
        ),
      },
    };
  });
}

export function reorderColumnNodes(
  nodes: Node[],
  tableId: string,
  oldIndex: number,
  newIndex: number
): Node[] {
  const tableNode = nodes.find((n) => n.id === tableId);
  if(!tableNode) return nodes;

  const columns = tableNode.data.columns as Column[];
  const tableName = tableNode.data.tableName as string;
  const reordered = arrayMove(columns, oldIndex, newIndex);

  let rowIndex = 0;
  return nodes.map((node) => {
    if(node.id === tableId) {
      return { ...node, data: { ...node.data, columns: reordered } };
    }
    if(node.parentId === `${tableName}-table` && node.type === "columnHandle") {
      const pos = { x: 0, y: HEADER_HEIGHT + ROW_HEIGHT * rowIndex };
      rowIndex++;
      return { ...node, position: pos };
    }
    return node;
  });
}

//-------- Translators --------
export function translateToSQL(table: TableData): string {
  const columns = table.columns
    .map((col) => `${col.name.toLowerCase()} ${col.type.toUpperCase()}`)
    .join(",\n    ");

  return `CREATE TABLE ${table.tableName} (\n    ${columns}\n);`;
}

export function translateToJson(table: TableData): string {
  return JSON.stringify(
    {
      name: table.tableName,
      columns: table.columns.map((col) => ({
        name: col.name,
        type: col.type,
      })),
    },
    null,
    2
  );
}

export function translateAll(nodes: Node[], translator: Translator): string {
  const tables = nodes
    .filter((node) => node.type === "tableContainer")
    .map((node) => node.data as TableData);

  return tables.map(translator).join("\n\n");
}

//-------- Save --------
export async function saveErdData(
  teamId: number,
  nodes: Node[],
  edges: Edge[],
  snackbar: React.RefObject<null>
) {
  await saveERD(
    { teamId, erd: nodes || [], connections: edges || [] },
    snackbar
  );
}
