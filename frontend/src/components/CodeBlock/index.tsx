import { FC, memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface MessageCodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock: FC<MessageCodeBlockProps> = memo(
  ({ language, value }) => {
    return (
      <div className="relative overflow-hidden bg-[#282C34] font-sans rounded-xl">
        {language && (
          <div className="flex items-center justify-between bg-[#21252B] px-3 py-1.5 text-foreground">
            <div className="text-xs lowercase">{language}</div>
            <div className="flex items-center space-x-1"></div>
          </div>
        )}
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            background: 'transparent',
          }}
          codeTagProps={{
            style: {
              fontSize: '14px',
              fontFamily: 'var(--font-mono)',
            },
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    );
  }
);
