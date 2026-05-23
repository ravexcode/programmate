import { NodeProps, Node } from '@xyflow/react'; // Ajusta a 'reactflow' si usas versión previa
import { TableNodeData } from '@/types/table.types';

type TableContainerNodeProps = NodeProps<Node<any>>;

export function TableContainerNode({ data }: TableContainerNodeProps) {
  return (
    <div className="w-65 rounded-lg border border-slate-800 bg-slate-900 shadow-xl overflow-hidden text-sm font-sans">
      {/* Encabezado */}
      <div className="bg-slate-800 px-4 py-2.5 font-bold text-slate-200 border-b border-slate-700 text-center">
        {data.tableName}
      </div>

      {/* Estructura de Tabla Real */}
      <table className="w-full border-collapse">
        <tbody>
          {data.columns.map((col : any) => (
            <tr key={col.name} className="h-9 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
              <td className="pl-4 font-medium text-slate-300">
                {col.isPk && <span className="text-amber-400 mr-1">🔑</span>}
                {col.name}
              </td>
              <td className="pr-4 text-right text-xs text-slate-500 font-mono">
                {col.type}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}