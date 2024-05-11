import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { srcery as editorTheme } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ts from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript';

SyntaxHighlighter.registerLanguage('typescript', ts);

// export const CodeBlock = ({ ...props }) => {
//   const match = /language-(\w+)/.exec(props.className || '');

//   return match ? (
//     <SyntaxHighlighter
//       language={props.className?.replace(/(?:lang(?:uage)?-)/, '')}
//       style={editorTheme}
//       wrapLines={true}
//       className="not-prose"
//       PreTag="div"
//     >
//       {props.children}
//     </SyntaxHighlighter>
//   ) : (
//     <code className={props.className}>{props.children}</code>
//   );
// };

export const CodeBlock = ({ ...props }) => {
  return (
    <SyntaxHighlighter language="typescript" style={editorTheme} wrapLines={true} className="not-prose" PreTag="div">
      {props.children}
    </SyntaxHighlighter>
  );
};
