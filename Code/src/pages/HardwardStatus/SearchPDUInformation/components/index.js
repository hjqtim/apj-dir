import React, { useState } from 'react';

export default function SearchPDUInformation() {
  const imgArr = ['pdu1.png', 'pdu2.png'];
  const [img, setImg] = useState('pdu1.png');
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
