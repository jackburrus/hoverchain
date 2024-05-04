export default function TransferList({ content }: { content: any }) {
  console.log(content, 'content for transfer list');
  return (
    <div>
      <h2>Transfer List hear!!</h2>
      {/* <div>
                {content?.transfers?.map((transfer: any, index: number) => (
                    <div key={index}>
                        <p>From: {transfer.from}</p>
                        <p>To: {transfer.to}</p>
                        <p>Amount: {transfer.amount}</p>
                    </div>
                ))}
            </div> */}
    </div>
  );
}
