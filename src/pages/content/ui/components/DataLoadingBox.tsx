import { ReactNode, useState, useEffect } from 'react';
import { PositionOnScreen } from '../utils/getPositionOnScreen';
import Noun1 from './nouns/Noun1';
import Noun2 from './nouns/Noun2';
import Noun3 from './nouns/Noun3';
import Noun4 from './nouns/Noun4';
import Noun5 from './nouns/Noun5';

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

const nounImages = [<Noun1 />, <Noun2 />, <Noun3 />, <Noun4 />, <Noun5 />];

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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % nounImages.length);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="p-10"
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
        }}>
        {header}
        <button
          style={{ color: 'white', fontWeight: 'bold', backgroundColor: 'transparent', border: 'none' }}
          onClick={onClose}>
          X
        </button>
      </div>
      <div style={{ color: 'black', fontFamily: 'System', fontSize: '14px', textAlign: 'center', marginTop: '10px' }}>
        <h1>Loading...</h1>
        {nounImages[currentIndex]}
      </div>
      {footer && <div style={{ borderTop: '1px solid black', padding: '10px' }}>{footer}</div>}
    </div>
  );
}
