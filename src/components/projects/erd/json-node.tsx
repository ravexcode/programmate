//React flow imports
import { NodeProps, Node, Handle, Position } from '@xyflow/react';

//Props type
type JNProps = NodeProps<Node<Record<string, unknown>>>;

export function JsonNode({ data }: JNProps) {
  return (
    <div
    className="text-text p-2 w-50 h-15 rounded-lg border border-neutral-700 bg-neutral-900 flex justify-center items-center">
      <Handle
        type="target"
        position={Position.Left}
        className="bg-neutral-700! w-2! h-2! border-neutral-700! pointer-events-auto"
      />

      {String(data.content)}

      <Handle
        type="source"
        position={Position.Right}
        className="bg-neutral-700! w-2! h-2! border-neutral-700! pointer-events-auto"
      />
    </div>
  )
}