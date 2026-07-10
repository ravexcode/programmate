'use client';

import type { ReactNode } from 'react';

type CodeTextProps = {
  text?: string;
  className?: string;
  language?: string;
};

const TOKEN_PATTERN = /(`[^`]*`|"[^"]*"|'[^']*'|\/\/.*|\/\*[\s\S]*?\*\/|\b(?:const|let|var|function|return|if|else|for|while|import|export|from|class|new|try|catch|async|await|true|false|null|undefined|interface|type|extends|implements|public|private|protected|readonly|switch|case|default)\b|\b\d+(?:\.\d+)?\b|[{}()[\];,.:<>+=\-*/%&|!?.])/g;

function getTokenClassName(token: string) {
  if (token.startsWith('//')) {
    return 'text-zinc-500';
  }

  if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
    return 'text-emerald-400';
  }

  if (/^\d+(?:\.\d+)?$/.test(token)) {
    return 'text-amber-400';
  }

  if (/^(const|let|var|function|return|if|else|for|while|import|export|from|class|new|try|catch|async|await|true|false|null|undefined|interface|type|extends|implements|public|private|protected|readonly|switch|case|default)$/i.test(token)) {
    return 'text-sky-400';
  }

  return 'text-slate-200';
}

function highlightText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const token = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    parts.push(
      <span key={`${start}-${token.length}`} className={getTokenClassName(token)}>
        {token}
      </span>,
    );

    lastIndex = start + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function CodeText({ text = '', className = '', language = 'tsx' }: CodeTextProps) {
  const lines = text.split('\n');

  return (
    <div className={["font-mono text-[13px] leading-6 whitespace-pre-wrap", className].filter(Boolean).join(' ')}>
      {lines.map((line, index) => (
        <div key={`${line}-${index}`} className="min-h-6">
          {highlightText(line)}
        </div>
      ))}
    </div>
  );
}
