import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula as editorTheme } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// export const CodeBlock = ({ children, className, node, ...rest }: SyntaxHighlighterProps) => {
//   const match = /language-(\w+)/.exec(className || '');
//   return match ? (
//     <SyntaxHighlighter
//       {...rest}
//       PreTag="div"
//       children={String(children).replace(/\n$/, '')}
//       language={match[1]}
//       wrapLines={true}
//       style={editorTheme}
//       className="not-prose"
//     />
//   ) : (
//     <code {...rest} className={className}>
//       {children}
//     </code>
//   );
// };

export const CodeBlock = ({ ...props }) => {
  const match = /language-(\w+)/.exec(props.className || '');
  return match ? (
    <SyntaxHighlighter
      language={props.className?.replace(/(?:lang(?:uage)?-)/, '')}
      style={editorTheme}
      wrapLines={true}
      className="not-prose"
      PreTag="div"
    >
      {props.children}
    </SyntaxHighlighter>
  ) : (
    <code className={props.className}>{props.children}</code>
  );
};
