import React from 'react';
import noun1 from '@assets/img/nouns/noun-1.png';
import noun2 from '@assets/img/nouns/noun-2.png';
import noun3 from '@assets/img/nouns/noun-3.png';
import noun4 from '@assets/img/nouns/noun-4.png';
import noun5 from '@assets/img/nouns/noun-5.png';

export default function UserInformation({ content, isContract }: { content: any; isContract: boolean }) {
  console.log(content, 'contract content in user information');
  const isVerifiedContract = content?.mantleData?.is_verified;
  const contractName = content?.mantleData?.name;
  return (
    <div className=" p-4 flex items-center">
      <div className="w-20 h-20 mr-4">
        {' '}
        <img src={noun1} alt="avatar" className="w-full h-full" />
      </div>
      <div className="flex-row items-start">
        {contractName && <h3 className="text-md">{contractName}</h3>}

        <div className="flex flex-row">
          <h2 className="text-sm font-semibold">
            {content?.originalAddress?.address ? formatEthereumAddress(content?.originalAddress?.address) : ''}
          </h2>
          {isVerifiedContract && <h3 className=" w-6 h-6 text-sm ml-2">✅</h3>}
        </div>
      </div>
    </div>
  );
}

export function formatEthereumAddress(address: string): string {
  if (!address || address.length < 5) {
    throw new Error('Invalid address');
  }
  const firstPart = address.slice(0, 5); // Gets '0x123'
  const lastPart = address.slice(-3); // Gets last three characters
  return `${firstPart}...${lastPart}`;
}
