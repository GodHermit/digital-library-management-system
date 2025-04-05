import { CodeBlock } from '@/components/CodeBlock';
import { Image, ImageProps, Link, LinkProps } from "@heroui/react";
import { Children, isValidElement } from 'react';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';
import remarkFrontmatter from 'remark-frontmatter';
import { remarkAlert } from 'remark-github-blockquote-alert';
import 'remark-github-blockquote-alert/alert.css';

export function Book() {
  const book = {
    name: 'Book',
    description: `# Book 📚`
  };

  return (
    <>
      <Helmet>
        <title>{book.name}</title>
      </Helmet>
      <ReactMarkdown
        className="prose prose-neutral dark:prose-invert prose-pre:bg-transparent prose-pre:p-0"
        remarkPlugins={[remarkFrontmatter, remarkAlert]}
        components={{
          a({ children, href, ...props }) {
            const isExternal = !href?.startsWith(window.location.origin);
            return (
              <Link
                {...(props as LinkProps)}
                href={href}
                className="underline"
                target={isExternal ? '_blank' : undefined}
                color="foreground"
                showAnchorIcon={isExternal}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              >
                {children}
              </Link>
            );
          },

          code({ className, children, ...props }) {
            const childArray = Children.toArray(children);
            const firstChild = childArray[0] as React.ReactElement;
            const firstChildAsString = isValidElement(firstChild)
              ? (firstChild as React.ReactElement).props.children
              : firstChild;

            if (firstChildAsString === '▍') {
              return (
                <span className="mt-1 animate-pulse cursor-default">▍</span>
              );
            }

            if (typeof firstChildAsString === 'string') {
              childArray[0] = firstChildAsString.replace('`▍`', '▍');
            }

            const match = /language-(\w+)/.exec(className || '');

            if (
              typeof firstChildAsString === 'string' &&
              !firstChildAsString.includes('\n')
            ) {
              return (
                <code className={className} {...props}>
                  {childArray}
                </code>
              );
            }

            return (
              <CodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(childArray).replace(/\n$/, '')}
                {...props}
              />
            );
          },
          img({ ...props }) {
            return (
              <Image
                removeWrapper
                loading="lazy"
                className="block max-h-[50vh]"
                {...(props as ImageProps)}
              />
            );
          },
        }}
      >
        {book.description}
      </ReactMarkdown>
    </>
  );
}
