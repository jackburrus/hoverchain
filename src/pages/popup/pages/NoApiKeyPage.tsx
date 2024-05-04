import { useState } from 'react';
type NoApiKeyPageProps = {
  checkApiKey: (key: string) => void;
  apiKeyError?: Error;
  loading: boolean;
};
export const NoApiKeyPage = ({ loading, checkApiKey, apiKeyError }: NoApiKeyPageProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    setApiKey(event.target.value);
  };

  const onClickSaveButton = () => {
    checkApiKey(apiKey);
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className="m-4 flex-col"
      style={{
        backgroundColor: '#ECE1D9',
      }}>
      <p>Enter Alchemy API Key:</p>
      <div className="w-full justify-evenly mt-1">
        <input className="border" type="password" value={apiKey} onChange={handleChange} />
        <button className="px-3 py-2 rounded-md ml-4" onClick={onClickSaveButton}>
          Save
        </button>
      </div>
      {apiKeyError && (
        <>
          <h3 className="text-red-500">{apiKeyError.name}</h3>
          <h3 className="text-red-500">{apiKeyError.message}</h3>
        </>
      )}
    </div>
  );
};
