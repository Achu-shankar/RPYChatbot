# SOCR DSPA Assistant

## Markdown Rendering System

This project implements an optimized markdown rendering system for a chat application, with special focus on code block rendering and execution.

### Key Features

#### Phase 1: Optimized Markdown Rendering
- **Memoized Markdown**: The application now uses a block-level memoization strategy based on Vercel AI SDK recommendations
- **Robust Code Highlighting**: Properly displays syntax highlighting for various programming languages
- **Enhanced Parsing**: Fixed issues with code blocks and inline code formatting
- **Performance Optimization**: Only re-renders blocks that actually change during streaming responses

#### Phase 2: Code Execution (Planned)
- **In-browser Code Execution**: Execute Python, JavaScript and other code directly in the browser
- **Interactive Code Blocks**: Copy, edit, and execute code blocks with visual feedback
- **Rich Output Display**: Support for plots, tables, and other rich output formats

### Implementation Details

#### MemoizedMarkdown Component
The core of the system is a memoized markdown renderer that:
1. Splits markdown content into discrete blocks using the `marked` tokenizer
2. Wraps each block in a memoized component to prevent unnecessary re-renders
3. Pre-processes markdown to fix common formatting issues

```tsx
// Usage example:
<MemoizedMarkdown content={markdownString} id="unique-id" />
```

#### EnhancedCodeBlock Component
The code block renderer provides:
1. Syntax highlighting with line numbers
2. Language detection and display
3. Copy code functionality
4. Future support for code execution

### Getting Started

1. Install dependencies:
```
npm install
```

2. Run the development server:
```
npm run dev
```

3. For code execution features, refer to the implementation plan in `docs/code-execution-plan.md`

### Next Steps

See the [Code Execution Implementation Plan](docs/code-execution-plan.md) for details on upcoming features.

### Dependencies

- marked: For markdown tokenization
- react-markdown: For rendering markdown
- react-syntax-highlighter: For code syntax highlighting
- rehype-raw: For handling HTML in markdown

### Contributing

1. Review the code execution plan before making changes
2. Ensure new components follow the memoization pattern
3. Test with long conversations to verify performance
