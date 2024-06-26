import { ReactNode, useState, ComponentPropsWithRef } from 'react';
import NFTList from './NFTList';
import TransferList from './TransferList';
import UserInformation from './UserInformation';
import { PositionOnScreen } from '../utils/getPositionOnScreen';
import { ReadMethods } from './ReadMethods';
import { WriteMethods } from './WriteMethods';
import TokensList from './TokensList';

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
  isContract: boolean;
} & ComponentPropsWithRef<'div'>;

export default function DataResponseBox({
  anchorCenter,
  isContract,
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
  const [activeTab, setActiveTab] = useState('read'); // Default active tab for contract
  const [nonContractActiveTab, setNonContractActiveTab] = useState('nfts'); // Default active tab for non-contract
  console.log('content in data response box', content);
  // Conditional rendering based on contract
  if (isContract) {
    return (
      <div
        style={{
          position: 'absolute',
          top: anchorTop,
          left: positionOnScreen === 'topLeft' ? anchorCenter - width : anchorCenter,
          width: width,
          backgroundColor: '#ECE1D9',
          border: '2px solid black',
          borderRadius: 0,
          zIndex: 1000,
          color: '#110E1B',
        }}
        {...restProps}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '5px 10px',
            backgroundColor: '#F87A1B',
            color: '#110E1B',
          }}>
          {header}
          <button style={{ fontWeight: 'bold', backgroundColor: 'transparent', border: 'none' }} onClick={onClose}>
            X
          </button>
        </div>
        <UserInformation isContract={isContract} content={content} />
        <div style={{ display: 'flex', justifyContent: 'start', padding: '10px 0' }}>
          <button
            onClick={() => setActiveTab('read')}
            className={`${activeTab === 'read' && 'shadow-[5px_5px_0px_0px_rgba(109,40,217)]'} border border-black rounded-md py-2 px-3 ml-2 text-black`}
            style={{ marginRight: 20, fontWeight: activeTab === 'read' ? 'bold underline' : 'normal' }}>
            Read
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`${activeTab === 'write' && 'shadow-[5px_5px_0px_0px_rgba(109,40,217)]'} border border-black rounded-md py-2 px-3 ml-4`}
            style={{ fontWeight: activeTab === 'write' ? 'bold underline' : 'normal' }}>
            Write
          </button>
        </div>
        <div style={{ padding: '10px', fontFamily: 'Courier', fontSize: '12px' }}>
          {activeTab === 'read' ? <ReadMethods content={content} /> : <WriteMethods content={content} />}
        </div>
        {footer && <div style={{ borderTop: '1px solid black', padding: '10px' }}>{footer}</div>}
      </div>
    );
  }

  // Non-contract UI
  return (
    <div
      className="text-black"
      style={{
        position: 'absolute',
        top: anchorTop,
        left: positionOnScreen === 'topLeft' ? anchorCenter - width : anchorCenter,
        width: width,
        backgroundColor: '#ECE1D9',
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
          backgroundColor: '#F87A1B',
          color: '#110E1B',
        }}>
        {header}
        <button style={{ fontWeight: 'bold', backgroundColor: 'transparent', border: 'none' }} onClick={onClose}>
          X
        </button>
      </div>
      <UserInformation isContract={false} content={content} />
      <div className="text-sm justify-evenly flex mx-2 border gap-4">
        <button
          onClick={() => setNonContractActiveTab('nfts')}
          className={`${nonContractActiveTab === 'nfts' && 'shadow-[5px_5px_0px_0px_rgba(109,40,217)]'} border border-black rounded-md py-2 px-3`}
          style={{ marginRight: 20, fontWeight: nonContractActiveTab === 'nfts' ? 'bold underline' : 'normal' }}>
          NFTs
        </button>
        <button
          onClick={() => setNonContractActiveTab('transfers')}
          className={`${nonContractActiveTab === 'transfers' && 'shadow-[5px_5px_0px_0px_rgba(109,40,217)]'} border border-black rounded-md py-2 px-3`}
          style={{ fontWeight: nonContractActiveTab === 'transfers' ? 'bold underline' : 'normal' }}>
          Transfers
        </button>
        <button
          onClick={() => setNonContractActiveTab('tokens')}
          className={`${nonContractActiveTab === 'tokens' && 'shadow-[5px_5px_0px_0px_rgba(109,40,217)]'} border border-black rounded-md py-2 px-3`}
          style={{ marginRight: 20, fontWeight: nonContractActiveTab === 'tokens' ? 'bold underline' : 'normal' }}>
          Tokens
        </button>
      </div>
      <div style={{ padding: '10px', fontFamily: 'Courier', fontSize: '12px' }}>
        {nonContractActiveTab === 'nfts' ? (
          <NFTList content={content} />
        ) : nonContractActiveTab === 'transfers' ? (
          <TransferList content={content} />
        ) : (
          <TokensList content={content} />
        )}
      </div>
      {footer && <div style={{ borderTop: '1px solid black', padding: '10px' }}>{footer}</div>}
    </div>
  );
}
