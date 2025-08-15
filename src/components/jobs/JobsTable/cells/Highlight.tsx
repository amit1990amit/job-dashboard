import React from 'react';

const Highlight = ({ text, query }: { text: string; query?: string }) => {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  const before = text.slice(0, idx);
  const hit = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return (
    <>
      {before}
      <mark>{hit}</mark>
      {after}
    </>
  );
};

export default Highlight;
