import React, { useState } from 'react';

export default function WiredNetworkCoverage() {
  const imgArr = ['wirednetworkcoverage1.png', 'wirednetworkcoverage2.png'];
  const [img, setImg] = useState('wirednetworkcoverage1.png');
  const handleChangeImage = () => {
    console.log('handleChangeImage');
    if (img === imgArr[0]) {
      setImg(imgArr[1]);
    } else {
      setImg(imgArr[0]);
    }
  };

  return (
    <>
      <div onClick={handleChangeImage}>
        <img src={`/static/img/temp/${img}`} alt="Case" style={{ width: '100%' }} />
      </div>
    </>
  );
}
