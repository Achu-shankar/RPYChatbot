'use client';
import { notFound } from "next/navigation";
import ChatArea from "../components/ChatArea";
import { useFetchInitialMessages } from "../lib/hooks";

export default function ChatPage({ params }: { params: { id: string } }) {
    const sessionId = params.id;
     // 1. Fetch initial messages using the custom hook
    const { initialMessages, isLoading: isLoadingMessages, error: fetchError } = useFetchInitialMessages(
        sessionId
    );

  // TODO: Handle fetchError appropriately (e.g., show a toast notification)
  // 3. Show loading state while fetching initial messages
  if (isLoadingMessages) {
    return (
      <div className="flex-1 h-full flex items-center justify-center p-4 bg-background ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
}

  if (fetchError) {
    return (
        <div className="flex-1 flex items-center justify-center p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
          <p>Error loading chat history: {fetchError.message}</p>
        </div>
      );
  }
    

    return (
        <div className="h-full w-full flex">
            <ChatArea 
                activeSessionId={sessionId} 
                initialMessages={initialMessages}
            />
        </div>
    );
}
