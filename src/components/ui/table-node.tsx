import { NodeProps, Node } from '@xyflow/react';

type TableContainerNodeProps = NodeProps<Node<any>>;

export function TableContainerNode({ data }: TableContainerNodeProps) {
  return (
    <div className="w-65 rounded-lg border bg-neutral-900 border-neutral-700 shadow-xl overflow-hidden text-sm font-sans text-text">
      <div className="bg-neutral-950 px-4 py-2.5 font-medium tracking-wide border-b border-neutral-700 text-center uppercase">
        {data.tableName}
      </div>

      <table className="w-full">
        <tbody>
          {data.columns.map((col : any) => (
            <tr key={col.name} className="h-9 border-b border-neutral-700 last:border-0 hover:bg-neutral-900">
              <td className="text-slate-300 lowercase pl-4">
                {col.name}
              </td>
              <td className="text-right text-xs text-neutral-500 font-mono uppercase pr-4">
                {col.type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}