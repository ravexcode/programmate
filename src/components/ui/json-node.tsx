//React imports
import { useState } from "react"

interface JNProps {
  data :{
    content: string
  }
}

export default function JsonNode({ data }: JNProps) {
  const [ content, setContent ] = useState<string>(data.content)

  return (
    <input
    value={content}
    onChange={(e) => {
      setContent(data.content)
    }}
    type="text"
    className="text-text p-3 w-50 h-20 rounded-lg border border-neutral-700 bg-neutral-900"
    placeholder="Insert your text here" />
  )
}