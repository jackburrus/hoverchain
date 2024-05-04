import { ReactNode } from 'react';
import { PositionOnScreen } from '../utils/getPositionOnScreen';
import UserInformation from './UserInformation';

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

export default function DataResponseBox({
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
  console.log(content, 'content');
  return (
    <div
      style={{
        position: 'absolute',
        top: anchorTop,
        left: positionOnScreen === 'topLeft' ? anchorCenter - width : anchorCenter,
        width: width,
        backgroundColor: '#c0c0c0', // Classic gray background
        border: '2px solid black', // Solid black border
        borderRadius: 0, // No rounded corners
        zIndex: 1000,
      }}
      {...restProps}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 10px',
          backgroundColor: '#000080', // Dark blue header
          color: 'white', // White text for contrast
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}>
        {header}
        <button
          style={{ color: 'white', fontWeight: 'bold', backgroundColor: 'transparent', border: 'none' }}
          onClick={onClose}>
          X
        </button>
      </div>
      <div className="flex flex-col" style={{ padding: '10px', fontFamily: 'Courier', fontSize: '12px' }}>
        <UserInformation content={content} />
      </div>
      {footer && <div style={{ padding: '10px', borderTop: '1px solid black' }}>{footer}</div>}
    </div>
  );
}
