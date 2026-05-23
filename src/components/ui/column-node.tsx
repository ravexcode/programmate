import { Handle, Position } from '@xyflow/react';

export default function ColumnNode() {
  return (
    <div className="w-65 h-9 relative flex items-center justify-between pointer-events-none">
      <Handle
        type="target"
        position={Position.Left}
        className="bg-neutral-700! w-2.5! h-2.5! border-neutral-700! pointer-events-auto"
      />
      
      <div className="w-full h-full" />
      
      <Handle
        type="source"
        position={Position.Right}
        className="bg-neutral-700! w-2.5! h-2.5! border-neutral-700! pointer-events-auto"
      />
    </div>
  );
}