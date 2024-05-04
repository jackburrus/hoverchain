import ethlogo from '@assets/img/eth.png';
import MantleIcon from './MantleIcon';
type GPTRequestButtonProps = {
  top: number;
  left: number;
  loading: boolean;
  onClick: () => void;
};
export default function DataRequestButton({ top, left, loading, onClick, ...restProps }: GPTRequestButtonProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: top,
        left: left,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 50,
        backgroundColor: 'white',
        border: '1px solid black',
        borderRadius: 5,
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
      }}
      {...restProps}>
      <div className="flex justify-start w-full mx-4 gap-4">
        <button onClick={onClick}>
          {loading ? 'Loading...' : <img src={ethlogo} className="w-6 h-6" alt="eth-logo" />}
        </button>
        <button onClick={onClick}>{loading ? 'Loading...' : <MantleIcon />}</button>
      </div>
    </div>
  );
}
