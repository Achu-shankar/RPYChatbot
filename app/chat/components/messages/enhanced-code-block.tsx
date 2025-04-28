'use client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import React, { useEffect, useState, useCallback, useRef, useMemo, memo } from 'react';
import { ClipboardIcon, CheckIcon, PlayIcon, SquareIcon, Loader2Icon, DownloadIcon } from 'lucide-react';
import { useCodeRuntimes, ExecutionResult } from '../../lib/useCodeRuntimes';

type CodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

interface CodeOutputProps {
  result: ExecutionResult | null;
}

// Memoize CodeOutput component to prevent re-renders when props haven't changed
const CodeOutput = memo(({ result }: CodeOutputProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (result?.plotData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          canvas.width = result.plotData.width;
          canvas.height = result.plotData.height;
          ctx.drawImage(result.plotData, 0, 0);
        } catch (drawError: any) {
          console.error('Error during canvas draw:', drawError);
        }
      }
    } else if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [result?.plotData]);

  if (!result) return null;

  const hasOutput = result.stdout || result.stderr || result.error || result.returnValue !== undefined || result.plotData;
  if (!hasOutput) return null;

  return (
    <div className="mt-2 text-xs border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50/50 dark:bg-zinc-800/50 overflow-hidden">
      {result.stdout && (
        <div className="p-2 border-b  border-gray-200 dark:border-gray-700">
          <strong className="font-medium text-gray-600 dark:text-gray-400">Output (stdout):</strong>
          <pre className="mt-1 max-h-80 overflow-y-auto whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">{result.stdout}</pre>
        </div>
      )}
      {result.stderr && (
        <div className="p-2 border-b   border-gray-200 dark:border-gray-700 bg-red-50/30 dark:bg-red-900/10">
          <strong className="font-medium text-red-600 dark:text-red-400">Messages / Logs (stderr):</strong>
          <pre className="mt-1 max-h-80 overflow-y-auto whitespace-pre-wrap break-words text-red-700 dark:text-red-300">{result.stderr}</pre>
        </div>
      )}
      {result.error && (
        <div className="p-2 border-b   border-gray-200 dark:border-gray-700 bg-red-50/50 dark:bg-red-900/20">
          <strong className="font-medium text-red-700 dark:text-red-500">Execution Error:</strong>
          <pre className="mt-1 max-h-80 overflow-y-auto whitespace-pre-wrap break-words text-red-800 dark:text-red-400">{result.error}</pre>
        </div>
      )}
      {result.returnValue !== undefined && result.returnValue !== null && (
         <div className="p-2">
           <strong className="font-medium text-gray-600 dark:text-gray-400">Return Value:</strong>
           <pre className="mt-1 max-h-80 overflow-y-auto  whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
             {typeof result.returnValue === 'object' ? JSON.stringify(result.returnValue, null, 2) : String(result.returnValue)}
           </pre>
         </div>
      )}
      {result.plotData && (
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <strong className="font-medium text-gray-600 dark:text-gray-400">Plot Output:</strong>
              <div className="mt-1 flex justify-center items-center bg-white dark:bg-gray-900 p-1 rounded shadow-inner">
                  <canvas 
                      ref={canvasRef} 
                      className="max-w-full h-auto"
                  ></canvas>
              </div>
          </div>
      )}
    </div>
  );
});

// Set display name for debugging
CodeOutput.displayName = 'CodeOutput';

// Define a combined state type to reduce re-renders
interface CodeBlockState {
  content: string;
  copied: boolean;
  status: 'idle' | 'loading-runtime' | 'pending-execution' | 'executing' | 'error';
  executionResult: ExecutionResult | null;
  errorMessage: string | null;
  isExecutionPending: boolean;
  isDownloading: boolean;
}

export function EnhancedCodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeProps) {
  // Combine related state to reduce re-renders
  const [state, setState] = useState<CodeBlockState>({
    content: '',
    copied: false,
    status: 'idle',
    executionResult: null,
    errorMessage: null,
    isExecutionPending: false,
    isDownloading: false
  });

  // Destructure for easier access
  const { 
    content, 
    copied, 
    status: blockStatus, 
    executionResult, 
    errorMessage, 
    isExecutionPending, 
    isDownloading 
  } = state;

  // Memoize language detection to avoid recomputing on every render
  const { language, isExecutable } = useMemo(() => {
    const match = /language-(\w+)/.exec(className || '');
    let lang = match ? match[1].toLowerCase() : '';
    if (lang === 'js') lang = 'javascript';
    if (lang === 'py') lang = 'python';
    
    return {
      language: lang,
      isExecutable: ['python', 'javascript', 'r'].includes(lang)
    };
  }, [className]);

  const { python, r, loadRuntime, executeCode, readFileFromVFS } = useCodeRuntimes();

  // Parse content only when children changes
  useEffect(() => {
    if (children) {
      let childContent = '';
      if (typeof children === 'string') {
        childContent = children;
      } else if (Array.isArray(children)) {
        childContent = children.join('');
      } else {
        try {
          childContent = String(children);
        } catch (e) {
          console.error('Failed to stringify code content', e);
          childContent = '';
        }
      }
      
      setState(prev => ({
        ...prev,
        content: childContent.replace(/\n$/, '')
      }));
    }
  }, [children]);

  // Optimized copy handler
  const handleCopy = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(content);
      setState(prev => ({ ...prev, copied: true }));
      // Use setTimeout outside of setState to avoid stale closure issues
      setTimeout(() => {
        setState(prev => ({ ...prev, copied: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [content]);

  // Optimized execute handler
  const handleExecute = useCallback(async () => {
    if (!language || !isExecutable) return;
    
    // Reset state in a single update
    setState(prev => ({
      ...prev,
      executionResult: null,
      errorMessage: null, 
      status: 'idle',
      isExecutionPending: false
    }));

    const targetRuntime = language === 'python' ? python : r;
    const langKey = language as 'python' | 'r';

    try {
      if (language === 'javascript') {
        setState(prev => ({ ...prev, status: 'executing' }));
        const result = await executeCode('javascript', content);
        setState(prev => ({ 
          ...prev, 
          executionResult: result,
          status: 'idle'
        }));
        return;
      }

      if (targetRuntime.status === 'ready') {
        setState(prev => ({ ...prev, status: 'executing' }));
        const result = await executeCode(langKey, content);
        setState(prev => ({ 
          ...prev, 
          executionResult: result,
          status: 'idle'
        }));
      } else if (targetRuntime.status === 'loading' || targetRuntime.status === 'initializing') {
        setState(prev => ({ 
          ...prev, 
          status: 'loading-runtime',
          isExecutionPending: true 
        }));
        return; 
      } else if (targetRuntime.status === 'error') {
        setState(prev => ({ 
          ...prev, 
          errorMessage: `Cannot execute: ${language} runtime failed to load previously.`,
          status: 'error'
        }));
        return;
      } else {
        setState(prev => ({ 
          ...prev, 
          status: 'loading-runtime',
          isExecutionPending: true
        }));
        
        try {
          await loadRuntime(langKey);
        } catch (loadError: any) {
          setState(prev => ({ 
            ...prev, 
            errorMessage: loadError.message || `Failed to initiate runtime loading.`,
            status: 'error',
            isExecutionPending: false
          }));
        }
      }
    } catch (error: any) {
      const message = error.message || 'An unexpected error occurred';
      setState(prev => ({ 
        ...prev, 
        errorMessage: message,
        executionResult: { 
          stdout: '', 
          stderr: (error.stack || ''), 
          error: message 
        },
        status: 'error',
        isExecutionPending: false
      }));
    }
  }, [language, isExecutable, content, python, r, loadRuntime, executeCode]);

  // Effect to handle pending execution state
  useEffect(() => {
    if (!isExecutionPending || !language || language === 'javascript') return;

    const targetRuntime = language === 'python' ? python : r;
    const langKey = language as 'python' | 'r';

    if (targetRuntime.status === 'ready') {
      setState(prev => ({ ...prev, status: 'executing', isExecutionPending: false }));

      executeCode(langKey, content)
        .then(result => {
          setState(prev => ({ ...prev, executionResult: result, status: 'idle' }));
        })
        .catch(execError => {
          const message = execError.message || 'An unexpected error occurred during execution.';
          setState(prev => ({ 
            ...prev,
            errorMessage: message,
            executionResult: { 
              stdout: '', 
              stderr: (execError.stack || ''), 
              error: message, 
              plotData: null, 
              generatedFilename: null 
            },
            status: 'error'
          }));
        });
    } else if (targetRuntime.status === 'error') {
      setState(prev => ({ 
        ...prev,
        errorMessage: targetRuntime.error?.message || `Runtime failed to load.`,
        status: 'error',
        isExecutionPending: false
      }));
    }
  }, [language, python.status, r.status, isExecutionPending, content, executeCode]);

  // Optimized download handler
  const handleDownload = useCallback(async (filename: string | null | undefined) => {
    if (!filename || isDownloading) return;

    setState(prev => ({ ...prev, isDownloading: true, errorMessage: null }));

    try {
      const fileData = await readFileFromVFS(filename);
      if (!fileData) {
        throw new Error(`File not found or could not be read.`);
      }

      let mimeType = 'application/octet-stream';
      const extension = filename.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') mimeType = 'application/pdf';
      else if (extension === 'csv') mimeType = 'text/csv';
      else if (extension === 'png') mimeType = 'image/png';
      else if (extension === 'jpg' || extension === 'jpeg') mimeType = 'image/jpeg';
      else if (extension === 'txt') mimeType = 'text/plain';

      const blob = new Blob([fileData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        errorMessage: error.message || 'Failed to download file.'
      }));
    } finally {
      setState(prev => ({ ...prev, isDownloading: false }));
    }
  }, [readFileFromVFS, isDownloading]);

  // Early return for inline code
  if (inline === true) {
    return (
      <code
        className="text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md"
        {...props}
      >
        {content}
      </code>
    );
  }
  
  // Only calculate these values when needed and their dependencies change
  const isLoadingRuntime = useMemo(() => {
    return blockStatus === 'loading-runtime' || 
      (language !== 'javascript' && (language === 'python' ? python.status : r.status) === 'loading') || 
      (language !== 'javascript' && (language === 'python' ? python.status : r.status) === 'initializing');
  }, [blockStatus, language, python.status, r.status]);

  const isExecutingCode = blockStatus === 'executing';
  const showRunButton = useMemo(() => 
    isExecutable && blockStatus !== 'loading-runtime' && blockStatus !== 'executing',
    [isExecutable, blockStatus]
  );
  const showStopButton = useMemo(() => 
    isExecutable && blockStatus === 'executing',
    [isExecutable, blockStatus]
  );
  const showLoadingIcon = useMemo(() => 
    isExecutable && (blockStatus === 'loading-runtime' || blockStatus === 'pending-execution'),
    [isExecutable, blockStatus]
  );

  const canDownload = useMemo(() => 
    !!executionResult?.generatedFilename && !isDownloading,
    [executionResult?.generatedFilename, isDownloading]
  );
  const downloadFilename = executionResult?.generatedFilename;

  // Only render full code block if there's a language or multiline content
  if (language || content.includes('\n')) {
    return (
      <div className="my-4 not-prose flex flex-col group relative">
        <div className="flex justify-between items-center text-xs text-gray-500 border-t border-l border-r border-gray-200 dark:border-gray-700 px-3 py-1 rounded-t-md bg-gray-50 dark:bg-zinc-800">
          <div>{language || 'text'}</div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={handleCopy}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Copy code"
              title="Copy code"
            >
              {copied ? <CheckIcon size={14} className="text-green-500" /> : <ClipboardIcon size={14} />}
            </button>
            
            <div className="relative w-5 h-5 flex items-center justify-center">
              {showLoadingIcon && <Loader2Icon size={14} className="animate-spin" />}
              {showRunButton && (
                <button 
                  onClick={handleExecute}
                  className={'p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors'}
                  aria-label={`Execute ${language} code`}
                  title={`Execute ${language} code`}
                  disabled={isLoadingRuntime || isExecutingCode}
                >
                  <PlayIcon size={14} />
                </button>
              )}
              {showStopButton && (
                <button 
                  className={'p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors'}
                  aria-label={`Stop execution`}
                  title={`Stop execution`}
                  disabled={!isExecutingCode}
                >
                  <SquareIcon size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        <SyntaxHighlighter
          style={oneDark}
          language={language || 'text'}
          PreTag="div" 
          className="text-sm w-full overflow-x-auto !my-0"
          wrapLines={true}
          showLineNumbers={content.split('\n').length > 5}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.5rem 0.5rem',
          }}
        >
          {content}
        </SyntaxHighlighter>
        
        {(blockStatus === 'loading-runtime' || blockStatus === 'executing' || blockStatus === 'error' || blockStatus === 'pending-execution' || isDownloading || errorMessage) && (
           <div className="mt-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-zinc-800 text-xs text-gray-600 dark:text-gray-400">
              {blockStatus === 'loading-runtime' && <span className="flex items-center gap-1"><Loader2Icon size={12} className="animate-spin"/>Loading {language} runtime...</span>}
              {blockStatus === 'pending-execution' && <span className="flex items-center gap-1"><Loader2Icon size={12} className="animate-spin"/>Waiting for {language} runtime...</span>}
              {blockStatus === 'executing' && <span className="flex items-center gap-1"><Loader2Icon size={12} className="animate-spin"/>Executing...</span>}
              {blockStatus === 'error' && <span className="text-red-600 dark:text-red-400">Error: {errorMessage || 'Failed to execute.'}</span>}
              {isDownloading && <span className="flex items-center gap-1"><Loader2Icon size={12} className="animate-spin"/>Downloading file...</span>}
              {errorMessage && blockStatus !== 'error' && <span className="text-red-600 dark:text-red-400">Error: {errorMessage}</span>}
           </div>
        )}
        
        {/* Memoized CodeOutput component */}
        <CodeOutput result={executionResult} />

        {downloadFilename && (
          <div className="mt-2 p-2 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-md bg-gray-50/50 dark:bg-zinc-800/50 flex items-center justify-start">
            <button 
              onClick={() => handleDownload(downloadFilename)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${canDownload ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900' : 'bg-gray-100 text-gray-500 opacity-70 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-400'}`}
              aria-label={`Download ${downloadFilename}`}
              title={`Download ${downloadFilename}`}
              disabled={!canDownload}
            >
              {isDownloading ? 
                <Loader2Icon size={14} className="animate-spin" /> :
                <DownloadIcon size={14} />
              }
              Download {downloadFilename}
            </button>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <code
      className="text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md"
      {...props}
    >
      {content}
    </code>
  );
} 