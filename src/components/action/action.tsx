import React from 'react';

type ActionProps = {
  src: string
};

const Action = ({ src }: ActionProps) => {
  return (
    <button type="button">
      <img src={src} alt="Action icon" />
    </button>
  );
};

export default Action;
