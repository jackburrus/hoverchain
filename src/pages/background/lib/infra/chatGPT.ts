import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai';
import { Network, Alchemy } from 'alchemy-sdk';
type Error = {
  error: {
    type: string;
    code: string | 'context_length_exceeded';
    message?: string;
  };
};
export async function chatGPT({
  input,
  chats,
  apiKey,
  onDelta,
}: {
  chats?: Chat[];
  input?: string;
  apiKey: string;
  onDelta?: (chunk: string) => unknown;
}): Promise<{ result: string }> {
  const messages: ChatCompletionRequestMessage[] = [];

  if (hasChats(chats)) {
    messages.push(...convertChatsToMessages(chats));
  }
  if (input) {
    messages.push({ role: 'user', content: input });
  }

  let response = await requestApi(apiKey, {
    id: 1,
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
  });

  await handleError(response, async () => {
    response = await requestApi(apiKey, {
      id: 1,
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
    });
    await handleError(response);
  });
  const result = await parseResult(response, onDelta);
  console.log(result.data, 'data returned');
  return { result };
}

async function handleError(response: Response, whenContextExceeded?: () => Promise<unknown>) {
  if (response.status !== 200) {
    const responseError: Error = await response.json();

    if (responseError.error.code === 'context_length_exceeded') {
      await whenContextExceeded?.();
      return;
    }

    const error = new Error();
    error.name = responseError.error.type;
    error.message = responseError.error.code + responseError.error.message ?? '';
    throw error;
  }
}

async function parseResult(response: Response, onDelta?: (chunk: string) => unknown) {
  const result = response.json();
  return result;
}

const parseToJSON = (line: string) => {
  try {
    return JSON.parse(line);
  } catch (e) {
    console.error(e);
    return;
  }
};

async function requestApi(apiKey: string, body: CreateChatCompletionRequest) {
  return fetch(`https://eth-mainnet.g.alchemy.com/v2/${apiKey}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function hasChats(chats?: Chat[]): chats is Chat[] {
  return chats !== undefined && chats.length > 0;
}

function convertChatsToMessages(chats: Chat[]): ChatCompletionRequestMessage[] {
  return chats
    .filter(chat => chat.role !== 'error')
    .map(chat => {
      return {
        role: chat.role === 'user' ? 'user' : 'assistant',
        content: chat.content,
      };
    });
}
