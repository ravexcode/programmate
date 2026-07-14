import Markdown from "react-markdown"

interface Props {
  content: string;
}

export default function ReactMarkdown(props: Props){
  return (
    <Markdown
    components={{
      hr: (props) => (
        <hr
          className="my-6 border-0 min-h-px bg-neutral-700 w-full"
          {...props}
        />
      ),

      h1: (props) => (
        <h1
          className="text-2xl font-bold text-white mb-4"
          {...props}
        />
      ),

      h2: (props) => (
        <h2
          className="text-xl font-semibold text-white mt-6 mb-3"
          {...props}
        />
      ),

      h3: (props) => (
        <h3
          className="text-lg font-medium text-white mt-5 mb-2"
          {...props}
        />
      ),

      p: (props) => (
        <p
          className="text-neutral-300 leading-relaxed mb-3"
          {...props}
        />
      ),

      ul: (props) => (
        <ul
          className="list-disc pl-6 space-y-1 text-neutral-300 mb-4"
          {...props}
        />
      ),

      ol: (props) => (
        <ol
          className="list-decimal pl-6 space-y-1 text-neutral-300 mb-4"
          {...props}
        />
      ),

      li: (props) => (
        <li
          className="marker:text-neutral-500"
          {...props}
        />
      ),

      strong: (props) => (
        <strong
          className="font-semibold text-white"
          {...props}
        />
      ),

      code: (props) => (
        <code
          className="bg-neutral-800 text-blue-400 px-1.5 py-0.5 rounded text-sm"
          {...props}
        />
      ),

      pre: (props) => (
        <pre
          className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto mb-4"
          {...props}
        />
      ),

      blockquote: (props) => (
        <blockquote
          className="border-l-4 border-blue-500 pl-4 italic text-neutral-400 my-4"
          {...props}
        />
      ),
    }}>
      { props.content }
    </Markdown>
  )
}