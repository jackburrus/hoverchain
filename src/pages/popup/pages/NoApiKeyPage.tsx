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
    <div>
      <input className="border" type="text" value={apiKey} onChange={handleChange} />
      <button onClick={onClickSaveButton}>Save</button>
      {apiKeyError && (
        <>
          <h3 className="text-red-500">{apiKeyError.name}</h3>
          <h3 className="text-red-500">{apiKeyError.message}</h3>
        </>
      )}
    </div>
  );
};
