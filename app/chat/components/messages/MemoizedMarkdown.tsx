import { marked } from 'marked';
import { memo, useMemo, useCallback } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Recommended plugin for tables, etc.
import rehypeRaw from 'rehype-raw';
import { EnhancedCodeBlock } from './enhanced-code-block';
import Link from 'next/link';

// Avoid expensive operations on every render
const remarkPlugins = [remarkGfm];
const rehypePlugins = [rehypeRaw];

// Helper to preprocess markdown content
const preprocessMarkdown = (markdown: string): string => {
  // Fix triple backtick code blocks that don't have proper newlines
  // Previous regex was causing problems by splitting language identifiers
  
  // First, find code blocks with no newline after language tag
  const codeBlockPattern = /```(\w+)/g;
  
  // Replace with proper spacing (keeping language intact)
  return markdown.replace(codeBlockPattern, '```$1\n');
};

// Helper function to parse markdown into discrete blocks
function parseMarkdownIntoBlocks(markdown: string): string[] {
  // Use marked lexer to split content into meaningful blocks
  const tokens = marked.lexer(markdown);
  return tokens.map(token => token.raw);
}

// Components for ReactMarkdown
// @ts-ignore - We need to ignore type checking for components due to ReactMarkdown's type limitations
const markdownComponents: Partial<Components> = {
  // @ts-ignore - The inline prop is passed by ReactMarkdown but not in type defs
  code: EnhancedCodeBlock,
  
  // Custom link handling
  // Keep all other component renderers the same
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-ignore - Link props are incompatible with the expected type
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  }
};

// Optimized deeply memoized component for rendering a single markdown block
const MemoizedMarkdownBlock = memo(
  ({ content, blockId }: { content: string, blockId: string }) => {
    return (
      <ReactMarkdown 
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins} 
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    );
  },
  // Strict equality comparison for props
  (prevProps, nextProps) => prevProps.content === nextProps.content && prevProps.blockId === nextProps.blockId
);

MemoizedMarkdownBlock.displayName = 'MemoizedMarkdownBlock';

// Main component that splits content and renders memoized blocks
export const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    // Split content into blocks using marked tokenizer - memoized to prevent recalculation
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);
    
    // Create a memoized callback for creating block IDs
    const getBlockId = useCallback((index: number) => `${id}-block-${index}`, [id]);
    
    return (
      <div className="markdown-body">
        {blocks.map((block, index) => (
          <MemoizedMarkdownBlock 
            content={block} 
            blockId={getBlockId(index)}
            key={getBlockId(index)} 
          />
        ))}
      </div>
    );
  },
  // Custom comparison: only re-render if content or id changes
  (prevProps, nextProps) => 
    prevProps.content === nextProps.content && prevProps.id === nextProps.id
);

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

// Also export the block component for direct use
export { MemoizedMarkdownBlock };
