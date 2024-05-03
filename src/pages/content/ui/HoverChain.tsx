import { useMachine } from '@xstate/react';
import { getPositionOnScreen } from './utils/getPositionOnScreen';
import { getSelectionNodeRect, getSelectionText } from '@pages/content/ui/utils/selection';
import dragStateMachine from './xState/dragStateMachine';
import delayPromise from './utils/delayPromise';
import { useEffect } from 'react';
import DataRequestButton from './components/DataRequestButton';
import DataResponseBox from './components/DataResponseBox';
const skipLoopCycleOnce = async () => await delayPromise(1);

async function getAlchemyResponseAsStream({ input, onFinish }: { input: string; onFinish: (result: string) => void }) {
  // Do Fetch here!
  // const response = await fetch("https://alchemyapi.io/api/1/text/TextGetTextSentiment?apikey=YOUR_API")
  console.log('fetching', input);
}

export default function HoverChain() {
  const [state, send] = useMachine(dragStateMachine, {
    actions: {
      setPositionOnScreen: context => {
        const { left, width, height, top } = context.selectedTextNodeRect;
        const verticalCenter = left + width / 2;
        const horizontalCenter = top + height / 2;
        context.positionOnScreen = getPositionOnScreen({
          horizontalCenter,
          verticalCenter,
        });
        console.log(context.positionOnScreen, 'positionOnScreen');
      },
    },
    services: {
      getAlchemyResponse: context => getAlchemyResponseAsStream({ input: context.selectedText, onFinish: console.log }),
    },
  });
  console.log('state', state);
  useEffect(() => {
    const onMouseUp = async (event: MouseEvent) => {
      /** Selection 이벤트 호출을 기다리는 해키한 코드 */
      await skipLoopCycleOnce();
      send({
        type: 'TEXT_SELECTED',
        data: {
          selectedText: getSelectionText(),
          selectedNodeRect: getSelectionNodeRect(),
          requestButtonPosition: {
            top: event.clientY + window.scrollY,
            left: event.clientX + window.scrollX,
          },
        },
      });
    };
    window.document.addEventListener('mouseup', onMouseUp);
    return () => {
      window.document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);
  const requestAlchemy = () => {
    send('REQUEST');
  };

  console.log('This is the current state,', state.matches('temp_response_message_box'));
  return (
    <>
      {state.hasTag('showRequestButton') && (
        <DataRequestButton
          onClick={requestAlchemy}
          loading={state.matches('loading')}
          top={state.context.requestButtonPosition.top}
          left={state.context.requestButtonPosition.left}
        />
      )}
      {state.matches('temp_response_message_box') && (
        <DataResponseBox
          content={'Hello World!'}
          width={200}
          isOutsideClickDisabled={true}
          onClose={() => send('RECEIVE_CANCEL')}
          anchorTop={state.context.anchorNodePosition.top}
          anchorCenter={state.context.anchorNodePosition.center}
          anchorBottom={state.context.anchorNodePosition.bottom}
          positionOnScreen={state.context.positionOnScreen}
        />
      )}
    </>
  );
}
