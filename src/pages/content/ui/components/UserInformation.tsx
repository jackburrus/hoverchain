import React from 'react';
import noun1 from '@assets/img/nouns/noun-1.png';
// import Noun2 from './nouns/Noun2';
// import Noun3 from './nouns/Noun3';
// import Noun4 from './nouns/Noun4';
// import Noun5 from './nouns/Noun5';

export default function UserInformation({ content }) {
  console.log('content', content);
  return (
    <div className=" p-4 flex items-center">
      <div className="w-20 h-20 mr-4">
        {' '}
        {/* Fixed size container for the avatar */}
        <img src={noun1} alt="avatar" className="w-full h-full" />
        {/* Set width and height of the wrapper span */}
      </div>
      <div>
        <h2 className="text-lg font-semibold">
          {content?.originalAddress?.address ? formatEthereumAddress(content?.originalAddress?.address) : ''}
        </h2>
      </div>
    </div>
  );
}

function formatEthereumAddress(address: string): string {
  if (!address || address.length < 5) {
    throw new Error('Invalid address');
  }
  const firstPart = address.slice(0, 5); // Gets '0x123'
  const lastPart = address.slice(-3); // Gets last three characters
  return `${firstPart}...${lastPart}`;
}
