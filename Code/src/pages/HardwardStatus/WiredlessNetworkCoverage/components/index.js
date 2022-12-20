import React, { useState } from 'react';

export default function WiredlessNetworkCoverage() {
  const [img, setImg] = useState('wiredlessnetworkcoverage1.png');
  const handleChangeImage = () => {
    console.log('handleChangeImage');
    setImg('wiredlessnetworkcoverage1.png');
  };

  return (
    <>
      <div onClick={handleChangeImage}>
        <img src={`/static/img/temp/${img}`} alt="Case" style={{ width: '100%' }} />
      </div>
    </>
  );
}
