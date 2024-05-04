import { ReactNode, useEffect } from 'react';

export default function FontProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const linkNode = document.createElement('link');
    linkNode.type = 'text/css';
    linkNode.rel = 'stylesheet';
    linkNode.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    document.head.appendChild(linkNode);
  }, []);

  return (
    <>
      <style>{`
  * {
    font-family: "Press Start 2P", system-ui;
    font-weight: 400;
    font-style: normal;
  }
      `}</style>
      {children}
    </>
  );
}
