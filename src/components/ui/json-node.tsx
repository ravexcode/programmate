//React flow imports
import { NodeProps, Node, Handle, Position } from '@xyflow/react';

//Props type
type JNProps = NodeProps<Node<any>>;

export function JsonNode({ data }: JNProps) {
  return (
    <div
    className="text-text p-3 w-50 h-20 rounded-lg border border-neutral-700 bg-neutral-900">
      <Handle
        type="target"
        position={Position.Left}
        className="bg-neutral-700! w-2! h-2! border-neutral-700! pointer-events-auto"
      />

      {data.content}

      <Handle
        type="target"
        position={Position.Right}
        className="bg-neutral-700! w-2! h-2! border-neutral-700! pointer-events-auto"
      />
    </div>
  )
}