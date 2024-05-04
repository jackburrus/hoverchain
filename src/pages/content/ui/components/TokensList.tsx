export default function TokensList({ content }: { content: any }) {
  // filter out the token balances that are zero or greater than 1000
  const filteredTokens = content?.tokens?.filter(token => token?.tokenBalance > 0 && token?.tokenBalance < 1000);
  return (
    <div>
      <div className="gap-y-4 max-h-[300px] overflow-y-scroll">
        {filteredTokens?.map((token, index) => (
          <div key={index} className="p-2 border-b border-gray-200">
            <p className="my-2">
              <strong>Name:</strong> {token?.tokenMetadata?.result?.name}
            </p>
            <p className="my-2">
              <strong>Symbol</strong> {token?.tokenMetadata?.result?.symbol}
            </p>
            <p className="my-2">
              <strong>Amount:</strong> {token?.tokenBalance}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
