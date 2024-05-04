import { ReactNode, useState } from 'react';
import { PositionOnScreen } from '../utils/getPositionOnScreen';
import UserInformation from './UserInformation';
import NFTList from './NFTList';
import TransferList from './TransferList';

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
  const [activeTab, setActiveTab] = useState('nfts'); // Initial state for tabs

  return (
    <div
      style={{
        position: 'absolute',
        top: anchorTop,
        left: positionOnScreen === 'topLeft' ? anchorCenter - width : anchorCenter,
        width: width,
        backgroundColor: '#c0c0c0',
        border: '2px solid black',
        borderRadius: 0,
        zIndex: 1000,
      }}
      {...restProps}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 10px',
          backgroundColor: '#000080',
          color: 'white',
        }}>
        {header}
        <button
          style={{ color: 'white', fontWeight: 'bold', backgroundColor: 'transparent', border: 'none' }}
          onClick={onClose}>
          X
        </button>
      </div>
      <UserInformation content={content} />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
        <button
          onClick={() => setActiveTab('nfts')}
          className={activeTab === 'nfts' ? 'underline' : 'normal'}
          style={{ marginRight: 20, fontWeight: activeTab === 'nfts' ? 'bold underline' : 'normal' }}>
          NFTs
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={activeTab === 'transfers' ? 'underline' : 'normal'}
          style={{ fontWeight: activeTab === 'transfers' ? 'bold underline' : 'normal' }}>
          Transfers
        </button>
      </div>
      <div style={{ padding: '10px', fontFamily: 'Courier', fontSize: '12px' }}>
        {activeTab === 'nfts' ? <NFTList content={content} /> : <TransferList content={content} />}
      </div>
      {footer && <div style={{ borderTop: '1px solid black', padding: '10px' }}>{footer}</div>}
    </div>
  );
}
