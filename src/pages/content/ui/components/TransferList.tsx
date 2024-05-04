import { formatEthereumAddress, formatEtherValue } from './UserInformation';

export default function TransferList({ content }: { content: any }) {
  const slicedTransfers = content?.transfers?.result?.transfers?.reverse().slice(0, 10);
  return (
    <div>
      <div className="gap-y-4 max-h-[300px] overflow-y-scroll">
        {slicedTransfers?.map((transfer, index) => (
          <div key={index} className="p-2 border-b border-gray-200">
            <p className="my-2">
              <strong>From:</strong> {formatEthereumAddress(transfer?.from)}
            </p>
            <p className="my-2">
              <strong>To:</strong> {formatEthereumAddress(transfer?.to)}
            </p>
            <p className="my-2">
              <strong>Amount:</strong> {transfer?.value}
            </p>

            <a
              href={`https://etherscan.io/tx/${transfer?.hash}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline">
              View on Etherscan
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// Assuming the formatEtherValue function converts Wei to ETH and formats it suitably.
