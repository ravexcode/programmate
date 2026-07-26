//React flow imports
import { NodeProps, Node } from '@xyflow/react';


//Props type
type TableContainerNodeProps = NodeProps<Node<Record<string, unknown>>>;

type Column = {
  name: string;
  type: string;
}

export function TableContainerNode({ data }: TableContainerNodeProps) {
  return (
    <div className="w-65 rounded-sm border bg-neutral-900 border-neutral-700 shadow-xl overflow-hidden text-sm font-sans text-text">

      <div className="bg-neutral-950 px-4 py-2.5 font-medium tracking-wide border-b border-neutral-700 text-center uppercase">
        {String(data.tableName)}
      </div>

      <table className="w-full">
        <tbody>
          {/* Colmuns render */}

          {(data.columns as Column[]).map((col : Column, index: number) => (
            <tr
            key={`${data.tableName}-${index}`}
            className="h-9 border-b border-neutral-700 last:border-0 hover:bg-neutral-900">
              <td
              className="text-slate-300 lowercase pl-4">
                {col.name || "Unnamed"}
              </td>
              <td
              className="text-right text-xs text-neutral-500 font-mono uppercase pr-4">
                {col.type || "Undefined"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}