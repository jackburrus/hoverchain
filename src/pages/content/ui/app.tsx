import { useEffect } from 'react';
import HoverChain from './HoverChain';

export default function App() {
  useEffect(() => {
    console.log('content view loaded');
  }, []);

  return <HoverChain />;
}
