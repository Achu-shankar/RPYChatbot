import {
    type UIMessage,
    appendResponseMessages,
    createDataStreamResponse,
    smoothStream,
    streamText,
  } from 'ai';
  import { openai } from '@ai-sdk/openai';
//   import { auth } from '@/app/(auth)/auth';
  import { systemPrompt } from '@/app/chat/lib/prompt';
//   import {
//     deleteChatById,
//     getChatById,
//     saveChat,
//     saveMessages,
//   } from '@/app/chat/lib/db/queries';
  import {
    generateUUID,
    getMostRecentUserMessage,
    getTrailingMessageId,
  } from '@/app/chat/lib/utils';
  import { generateTitleFromUserMessage } from '@/app/chat/lib/actions';
//   import { createDocument } from '@/lib/ai/tools/create-document';
//   import { updateDocument } from '@/lib/ai/tools/update-document';
//   import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
//   import { getWeather } from '@/lib/ai/tools/get-weather';
//   import { isProductionEnvironment } from '@/lib/constants';
//   import { myProvider } from '@/lib/ai/providers';

import { createClient } from '@/utils/supabase/server';
import { saveOrUpdateChatMessages } from '@/app/chat/lib/db/queries';
  
  export const maxDuration = 60;
  
  export async function POST(request: Request) {
    try {
      const {
        id,
        messages,
        selectedChatModel,
      }: {
        id: string;
        messages: Array<UIMessage>;
        selectedChatModel: string;
      } = await request.json();

      
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
  
      if (!user?.id) {
        return new Response('Unauthorized', { status: 401 });
      }
  
      const userMessage = getMostRecentUserMessage(messages);
  
      if (!userMessage) {
        return new Response('No user message found', { status: 400 });
      }
      
  
    //   const chat = await getChatById({ id });
  
    //   if (!chat) {
    //     const title = await generateTitleFromUserMessage({
    //       message: userMessage,
    //     });
  
    //     await saveChat({ id, userId: session.user.id, title });
    //   } else {
    //     if (chat.userId !== session.user.id) {
    //       return new Response('Forbidden', { status: 403 });
    //     }
    //   }

    await saveOrUpdateChatMessages(user.id, id, [userMessage]);
  


  
      return createDataStreamResponse({
        execute: (dataStream) => {
          const result = streamText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            messages,
            maxSteps: 5,
            // experimental_activeTools:
            //   selectedChatModel === 'chat-model-reasoning'
            //     ? []
            //     : [
            //         'getWeather',
            //         'createDocument',
            //         'updateDocument',
            //         'requestSuggestions',
            //       ],
            experimental_transform: smoothStream({ chunking: 'word' }),
            experimental_generateMessageId: generateUUID,
            // tools: {
            //   getWeather,
            //   createDocument: createDocument({ session, dataStream }),
            //   updateDocument: updateDocument({ session, dataStream }),
            //   requestSuggestions: requestSuggestions({
            //     session,
            //     dataStream,
            //   }),
            // },
            onFinish: async ({ response }) => {
              if (user?.id) {
                try {
                  const assistantId = getTrailingMessageId({
                    messages: response.messages.filter(
                      (message) => message.role === 'assistant',
                    ),
                  });
  
                  if (!assistantId) {
                    throw new Error('No assistant message found!');
                  }
  
                  const [, assistantMessage] = appendResponseMessages({
                    messages: [userMessage],
                    responseMessages: response.messages,
                  });

                  await saveOrUpdateChatMessages(
                    user.id,
                    id,
                    [assistantMessage]
                  );
                } catch (_) {
                  console.error('Failed to save chat');
                }
              }
            },
            // experimental_telemetry: {
            //   isEnabled: isProductionEnvironment,
            //   functionId: 'stream-text',
            // },
          });
  
          result.consumeStream();
  
          result.mergeIntoDataStream(dataStream, {
            sendReasoning: true,
          });
        },
        onError: () => {
          return 'Oops, an error occurred!';
        },
      });
    } catch (error) {
      return new Response('An error occurred while processing your request!', {
        status: 500,
      });
    }
  }
  