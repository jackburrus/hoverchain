import React from 'react';

export function ReadMethods({ content }: { content: any }) {
  const readMethods = content.mantleData.abi.filter(
    method => method.type === 'function' && (method.stateMutability === 'view' || method.stateMutability === 'pure'),
  );

  return (
    <div className="max-h-[300px] overflow-y-scroll">
      {readMethods.map((method, index) => (
        <div key={index} className="p-2 border-b border-gray-200">
          <h3 className="font-bold">{method.name}</h3>
          {method.inputs.map((input, idx) => (
            <p className="m-2" key={idx}>
              - {input.name || `input${idx + 1}`}: {input.type}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
