import { ReactNode } from 'react';
import { PositionOnScreen } from '../utils/getPositionOnScreen';

export type MessageBoxProps = {
  isOutsideClickDisabled?: boolean;
  anchorTop: number;
  anchorCenter: number;
  anchorBottom: number;
  header: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
  width: number;
  onClose: () => void;
  positionOnScreen: PositionOnScreen;
} & ComponentPropsWithRef<'div'>;

export default function DataLoadingBox({
  anchorCenter,
  anchorTop,
  anchorBottom,
  header,
  width,
  content,
  onClose,
  positionOnScreen,
  footer,
  isOutsideClickDisabled,
  ...restProps
}: MessageBoxProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: anchorTop,
        left: positionOnScreen === 'topLeft' ? anchorCenter - width : anchorCenter,
        width: width,
        backgroundColor: 'white',
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
        borderRadius: 5,
        zIndex: 1000,
      }}
      {...restProps}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 10px',
          backgroundColor: 'lightgray',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}>
        {header}
        <button onClick={onClose}>X</button>
      </div>
      <div style={{ padding: '10px' }}>{content}</div>
      {footer && <div style={{ padding: '10px' }}>{footer}</div>}
    </div>
  );
}
