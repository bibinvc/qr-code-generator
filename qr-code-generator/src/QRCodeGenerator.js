// src/QRCodeGenerator.js
import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrColor, setQRColor] = useState('#000000'); // Default color is black
  const qrCodeRef = useRef(null);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleColorChange = (e) => {
    setQRColor(e.target.value);
  };

  const handleGenerateQRCode = () => {
    // Check if the entered text looks like a URL
    const isURL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(text);

    if (isURL) {
      setText(text); // Update state to trigger re-render
    } else {
      alert('Please enter a valid URL');
    }
  };

  const handleDownloadQRCode = (format) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white'; // Set background color to white
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const qrCodeImage = new Image();
    qrCodeImage.src = qrCodeRef.current.children[0].toDataURL('image/png');

    qrCodeImage.onload = () => {
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(qrCodeImage, 0, 0, canvas.width, canvas.height);

      if (format === 'png') {
        const imageDataUrl = canvas.toDataURL('image/png');
        downloadImage(imageDataUrl, 'qrcode_1000x1000.png');
      } else if (format === 'jpg') {
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        downloadImage(imageDataUrl, 'qrcode_1000x1000.jpg');
      } else if (format === 'svg') {
        const svgString = qrCodeRef.current.children[0].outerHTML;
        downloadSVG(svgString, 'qrcode_1000x1000.svg');
      }
    };
  };

  const downloadImage = (url, fileName) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const downloadSVG = (content, fileName) => {
    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <label>
        Enter text or URL:
        <input type="text" value={text} onChange={handleInputChange} />
      </label>

      <label>
        QR Code Color:
        <input type="color" value={qrColor} onChange={handleColorChange} />
      </label>

      <button onClick={handleGenerateQRCode}>Generate QR Code</button>
      <button onClick={() => handleDownloadQRCode('png')}>Download PNG</button>
      <button onClick={() => handleDownloadQRCode('jpg')}>Download JPG</button>
      <button onClick={() => handleDownloadQRCode('svg')}>Download SVG</button>

      {text && (
        <div ref={qrCodeRef}>
          <QRCode value={text} size={256} fgColor={qrColor} />
        </div>
      )}

      {!text && <p>Enter text or URL to generate a QR code.</p>}
    </div>
  );
};

export default QRCodeGenerator;
