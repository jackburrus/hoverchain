export default function NFTList({ content }: { content: any }) {
  console.log('content from nft section', content);
  const allImages = content?.nfts?.ownedNfts?.map((nft: any) => nft.metadata?.image);

  // Function to handle image load failure
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.style.display = 'none'; // Hides the image if it fails to load
  };

  return (
    <div className="grid grid-cols-3 gap-5 items-center">
      {allImages.length
        ? allImages.slice(0, 10).map((imageUrl: string, index: number) => (
            <img
              className="w-20 h-20"
              key={index}
              src={imageUrl}
              alt={`NFT ${index}`}
              onError={handleImageError} // Add onError handler here
            />
          ))
        : 'No NFTs found'}
    </div>
  );
}
