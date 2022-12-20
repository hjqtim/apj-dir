import React, { useState } from 'react';

export default function ExternalNetworkInterfaceCoverage() {
  const [img, setImg] = useState('externalnetworkcoverage1.png');
  const handleChangeImage = () => {
    console.log('handleChangeImage');
    setImg('externalnetworkcoverage1.png');
  };
  return (
    <>
      <div onClick={handleChangeImage}>
        <img src={`/static/img/temp/${img}`} alt="Case" style={{ width: '100%' }} />
      </div>
    </>
  );
}
