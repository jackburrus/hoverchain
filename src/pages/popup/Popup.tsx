import React from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/popup/Popup.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useMachine } from '@xstate/react';
import popupStateMachine from './xState/popupStateMachine';
import { sendMessageToBackground, sendMessageToBackgroundAsync } from '../chrome/message';
import { NoApiKeyPage } from './pages/NoApiKeyPage';
const saveApiKeyToBackground = async (apiKey: string) => {
  await sendMessageToBackgroundAsync({
    type: 'SaveAPIKey',
    input: apiKey,
  });
};

const getApiKeyFromBackground = async () => {
  const message = await sendMessageToBackgroundAsync({
    type: 'GetAPIKey',
  });
  return message;
};

const resetApiKeyFromBackground = () => {
  sendMessageToBackground({
    message: {
      type: 'ResetAPIKey',
    },
  });
};
const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const [state, send] = useMachine(popupStateMachine, {
    services: {
      saveApiKeyToBackground: context => {
        return saveApiKeyToBackground(context.alchemyApiKey ?? '');
      },
      getApiKeyFromBackground,
    },
    actions: {
      resetApiKeyFromBackground,
    },
  });

  const checkApiKey = (apiKey: string) => {
    send({ type: 'CHECK_API_KEY', data: apiKey });
  };

  console.log('this is the new state!!', state);
  return (
    <div
      className="App"
      style={{
        backgroundColor: '#ECE1D9',
        border: '2px solid black',
      }}>
      <h1 className="text-lg underline mb-4">Welcome to HoverChain</h1>

      <ul className="flex items-start flex-col">
        <li className="font-bold">Getting Started:</li>
        <li>1. Get your API key from Alchemy</li>
        <li>2. Enter your API key</li>
        <li>3. Click Save</li>
        <li>4. Select an Ethereum address</li>
        <li>5. Choose which chain to search.</li>
        <li>6. Browse Ethereum!</li>
      </ul>
      {state.hasTag('noApiKeyPage') && (
        <NoApiKeyPage
          apiKeyError={state.context.apiKeyCheckError}
          loading={state.matches('checking_api_key')}
          checkApiKey={checkApiKey}
        />
      )}
      <div className="m-4">{!state.hasTag('noApiKeyPage') && <p>API Key: ✅ All Set!</p>}</div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
