import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import { ApiKeyStorage } from '@pages/background/lib/storage/apiKeyStorage';
import { chatGPT } from '@pages/background/lib/infra/chatGPT';
import Logger from '@pages/background/lib/utils/logger';
import { sendErrorMessageToClient, sendMessageToClient } from '@src/pages/chrome/message';

import { Network, Alchemy } from 'alchemy-sdk';

reloadOnUpdate('pages/background');

type RequiredDataNullableInput<T extends Message> = {
  type: T['type'];
  input?: unknown;
  data: Exclude<T['data'], undefined>;
};

chrome.runtime.onConnect.addListener(port => {
  port.onDisconnect.addListener(() => {
    console.log('Port disconnected');
  });
  port.onMessage.addListener(async (message: Message) => {
    Logger.receive(message);

    const sendResponse = <M extends Message>(message: RequiredDataNullableInput<M>) => {
      Logger.send(message);
      sendMessageToClient(port, message);
    };

    console.log('This is the message from background', message);

    try {
      switch (message.type) {
        case 'GetSlots': {
          const slots = await SlotStorage.getAllSlots();
          /** add default slot when initialize */
          if (slots.length === 0) {
            const defaultSlot = createNewChatGPTSlot({ isSelected: true });
            await SlotStorage.addSlot(defaultSlot);
            slots.push(defaultSlot);
          }
          sendResponse({ type: 'GetSlots', data: slots });
          break;
        }
        case 'AddNewSlot': {
          await SlotStorage.addSlot(message.input);
          sendResponse({ type: 'AddNewSlot', data: 'success' });
          break;
        }
        case 'SelectSlot': {
          const slots = await SlotStorage.getAllSlots();
          const updatedSlots = slots.map(slot => ({
            ...slot,
            isSelected: message.input === slot.id,
          }));
          await SlotStorage.setAllSlots(updatedSlots);
          sendResponse({ type: 'SelectSlot', data: updatedSlots });
          break;
        }
        case 'UpdateSlot': {
          const slots = await SlotStorage.updateSlot(message.input);
          sendResponse({ type: 'UpdateSlot', data: slots });
          break;
        }
        case 'DeleteSlot': {
          const slots = await SlotStorage.deleteSlot(message.input);
          sendResponse({ type: 'DeleteSlot', data: slots });
          break;
        }
        case 'GetAPIKey': {
          const apiKey = await ApiKeyStorage.getApiKey();
          sendResponse({ type: 'GetAPIKey', data: apiKey });
          break;
        }
        case 'SaveAPIKey':
          await chatGPT({
            input: 'hello',
            apiKey: message.input,
            slot: { type: 'ChatGPT' },
          }).catch(error => {
            ApiKeyStorage.setApiKey(null);
            throw error;
          });
          await ApiKeyStorage.setApiKey(message.input);
          sendResponse({ type: 'SaveAPIKey', data: 'success' });
          break;
        case 'ResetAPIKey':
          await ApiKeyStorage.setApiKey(null);
          sendResponse({ type: 'ResetAPIKey', data: 'success' });
          break;
        case 'RequestInitialDragGPTStream': {
          try {
            const apiKey = await ApiKeyStorage.getApiKey();

            // Define the API URLs
            const nftUrl = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs?owner=${message.input}&withMetadata=true&pageSize=100`;
            const transferUrl = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
            const mantleExplorerUrl = `https://explorer.sepolia.mantle.xyz/api/v2/smart-contracts/${message.input}`;

            const headers = {
              'Content-Type': 'application/json',
            };

            // Perform API requests
            const mantleExplorerRequest = fetch(mantleExplorerUrl, { method: 'GET', headers });
            const nftRequest = fetch(nftUrl, { method: 'GET' });
            const transferRequest = fetch(transferUrl, {
              headers,
              method: 'POST',
              body: JSON.stringify({
                id: 1,
                jsonrpc: '2.0',
                method: 'alchemy_getAssetTransfers',
                params: [
                  {
                    fromBlock: '0x0',
                    toBlock: 'latest',
                    toAddress: message.input,
                    withMetadata: false,
                    excludeZeroValue: true,
                    maxCount: '0x3e8',
                    category: ['external'],
                  },
                ],
              }),
            });

            // handle them one at a time
            const mantleResponse = await mantleExplorerRequest;
            const nftResponse = await nftRequest;
            const transferResponse = await transferRequest;

            const mantleData = await mantleResponse.json();

            if (mantleResponse.status === 404) {
              // Handle if it's a wallet
              const nftData = await nftResponse.json();
              const transferData = await transferResponse.json();

              const walletResponseData = {
                originalAddress: { address: message.input },
                nfts: nftData,
                transfers: transferData,
              };

              sendResponse({
                type: 'RequestInitialDragGPTStream',
                data: {
                  result: walletResponseData,
                  isDone: true,
                },
              });
            } else {
              // Handle if it's a contract
              const contractResponseData = {
                originalAddress: { address: message.input },
                mantleData,
              };

              sendResponse({
                type: 'RequestInitialDragGPTStream',
                data: {
                  result: contractResponseData,
                  isDone: true,
                },
              });
            }
          } catch (error) {
            console.log('Catched error in RequestInitialDragGPTStream', error);
            Logger.warn(error);
            sendErrorMessageToClient(port, error.message || 'An error occurred');
          }
          break;
        }

        case 'RequestOnetimeChatGPT': {
          const selectedSlot = await SlotStorage.getSelectedSlot();
          const apiKey = await ApiKeyStorage.getApiKey();
          const response = await chatGPT({
            input: message.input,
            slot: selectedSlot,
            apiKey,
          });
          sendResponse({
            type: 'RequestOnetimeChatGPT',
            data: response,
          });
          break;
        }
        case 'RequestQuickChatGPTStream': {
          await QuickChatHistoryStorage.pushChatHistories({
            role: 'user',
            content: message.input?.messages.at(-1)?.content ?? '',
          });
          const apiKey = await ApiKeyStorage.getApiKey();
          const response = await chatGPT({
            chats: message.input?.messages,
            slot: { type: message.input?.isGpt4 ? 'ChatGPT4' : 'ChatGPT' },
            apiKey,
            onDelta: chunk => {
              sendResponse({
                type: 'RequestQuickChatGPTStream',
                data: {
                  result: '',
                  chunk,
                },
              });
            },
          });
          await QuickChatHistoryStorage.pushChatHistories({
            role: 'assistant',
            content: response.result,
          });
          sendResponse({
            type: 'RequestQuickChatGPTStream',
            data: { result: response.result, isDone: true },
          });
          break;
        }
        case 'RequestDragGPTStream': {
          const apiKey = await ApiKeyStorage.getApiKey();
          const slot = await SlotStorage.getSelectedSlot();
          const response = await chatGPT({
            chats: message.input?.chats,
            slot: { type: slot.type },
            apiKey,
            onDelta: chunk => {
              sendResponse({
                type: 'RequestDragGPTStream',
                data: {
                  result: '',
                  chunk,
                },
              });
            },
          });
          sendResponse({
            type: 'RequestDragGPTStream',
            data: { result: response.result, isDone: true },
          });
          break;
        }
        case 'RequestOngoingChatGPT': {
          const selectedSlot = await SlotStorage.getSelectedSlot();
          const apiKey = await ApiKeyStorage.getApiKey();
          const response = await chatGPT({
            chats: message.input,
            slot: selectedSlot,
            apiKey,
          });
          sendResponse({ type: 'RequestOngoingChatGPT', data: response });
          break;
        }
        case 'RequestGenerateChatGPTPrompt': {
          const apiKey = await ApiKeyStorage.getApiKey();
          const response = await chatGPT({
            input: message.input,
            slot: {
              type: 'ChatGPT',
              system: PROMPT_GENERATE_PROMPT,
            },
            apiKey,
          });
          sendResponse({
            type: 'RequestGenerateChatGPTPrompt',
            data: response,
          });
          break;
        }
        case 'GetQuickChatHistory': {
          const chats = await QuickChatHistoryStorage.getChatHistories();
          sendResponse({ type: 'GetQuickChatHistory', data: chats });
          break;
        }
        case 'ResetQuickChatHistory': {
          await QuickChatHistoryStorage.resetChatHistories();
          sendResponse({ type: 'ResetQuickChatHistory', data: 'success' });
          break;
        }
        case 'PushChatHistory': {
          await ChatHistoryStorage.pushChatHistories(message.input.sessionId, message.input.chats);
          sendResponse({ type: 'PushChatHistory', data: 'success' });
          break;
        }
        case 'SaveChatHistory': {
          await ChatHistoryStorage.saveChatHistories(message.input.sessionId, message.input.chats, message.input.type);
          sendResponse({ type: 'SaveChatHistory', data: 'success' });
          break;
        }
        case 'DeleteChatHistorySession': {
          await ChatHistoryStorage.deleteChatHistory(message.input);
          sendResponse({ type: 'DeleteChatHistorySession', data: 'success' });
          break;
        }
        case 'DeleteAllChatHistory': {
          await ChatHistoryStorage.resetChatHistories();
          sendResponse({ type: 'DeleteAllChatHistory', data: 'success' });
          break;
        }
        case 'GetAllChatHistory': {
          sendResponse({
            type: 'GetAllChatHistory',
            data: await ChatHistoryStorage.getChatHistories(),
          });
          break;
        }
        case 'GetChatSessionHistory': {
          sendResponse({
            type: 'GetChatSessionHistory',
            data: await ChatHistoryStorage.getChatHistory(message.input),
          });
          break;
        }
        default: {
          exhaustiveMatchingGuard(message);
        }
      }
    } catch (error) {
      Logger.warn(error);
      sendErrorMessageToClient(port, error);
    }
  });
});
