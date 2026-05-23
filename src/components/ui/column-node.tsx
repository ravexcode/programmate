import { Handle, Position } from '@xyflow/react';

export default function ColumnNode() {
  return (
    <div className="w-65 h-9 relative flex items-center justify-between pointer-events-none">
      {/* Target (Izquierda) */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-slate-600! w-2.5! h-2.5! border-slate-900! pointer-events-auto"
      />
      
      {/* Espaciador transparente intermedio */}
      <div className="w-full h-full" />
      
      {/* Source (Derecha) */}
      <Handle
        type="source"
        position={Position.Right}
        className="bg-amber-500! w-2.5! h-2.5! border-slate-900! pointer-events-auto"
      />
    </div>
  );
}