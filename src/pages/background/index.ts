import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';
import { ApiKeyStorage } from './lib/storage/apiKeyStorage';
import Logger from './lib/utils/logger';
import { sendMessageToClient } from '../chrome/message';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

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
    try {
      switch (message.type) {
        case 'GetAPIKey': {
          const apiKey = await ApiKeyStorage.getApiKey();
          sendResponse({ type: 'GetAPIKey', data: apiKey });
          break;
        }
        case 'SaveAPIKey':
          // await chatGPT({
          //   input: "hello",
          //   apiKey: message.input,
          //   slot: { type: "ChatGPT" },
          // }).catch((error) => {
          //   ApiKeyStorage.setApiKey(null);
          //   throw error;
          // });
          await ApiKeyStorage.setApiKey(message.input);
          sendResponse({ type: 'SaveAPIKey', data: 'success' });
          break;
        case 'ResetAPIKey':
          await ApiKeyStorage.setApiKey(null);
          sendResponse({ type: 'ResetAPIKey', data: 'success' });
          break;
      }
    } catch (error) {
      Logger.error(error);
      sendResponse({ type: message.type, error });
    }
  });
});
