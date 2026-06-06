import Markdown from "react-markdown"

interface Props {
  content: string;
}

export default function ReactMarkdown(props: Props){
  return (
    <Markdown
    children={props.content} />
  )
}