// src/QRCodeGenerator.js
import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import './QRCodeGenerator.css'; // Import the CSS file

const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [bgColor, setBGColor] = useState('#ffffff');
  const [fgColor, setFGColor] = useState('#000000');
  const qrCodeRef = useRef(null);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleBGColorChange = (e) => {
    setBGColor(e.target.value);
  };

  const handleFGColorChange = (e) => {
    setFGColor(e.target.value);
  };

  const handleGenerateQRCode = () => {
    const isURL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(text);

    if (isURL) {
      setText(text);
    } else {
      alert('Please enter a valid URL');
    }
  };

  const handleDownloadQRCode = (format) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const qrCodeImage = new Image();
    qrCodeImage.src = qrCodeRef.current.children[0].toDataURL('image/png');

    qrCodeImage.onload = () => {
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
    <div className="qrcode-container">
      <div className="qrcode-header">
        <h1>QR Code Generator</h1>
      </div>
      <div className="qrcode-inputs">
      <label>
            Enter text or URL:
            <input
              type="text"
              value={text}
              onChange={handleInputChange}
              className="text-input"
            />
          </label>
        <div className="color-inputs">
          <label>
            Background Color:
            <input type="color" value={bgColor} onChange={handleBGColorChange} />
          </label>
          <label>
            Foreground Color:
            <input type="color" value={fgColor} onChange={handleFGColorChange} />
          </label>
        </div>
      </div>
      <div className="qrcode-buttons">
        <button onClick={handleGenerateQRCode} className="generate-btn">
          Generate QR Code
        </button>
        <button onClick={() => handleDownloadQRCode('png')} className="download-btn">
          Download PNG
        </button>
        <button onClick={() => handleDownloadQRCode('jpg')} className="download-btn">
          Download JPG
        </button>
        <button onClick={() => handleDownloadQRCode('svg')} className="download-btn">
          Download SVG
        </button>
      </div>
      {text && (
        <div className="qrcode-preview" ref={qrCodeRef}>
          <QRCode value={text} size={256} bgColor={bgColor} fgColor={fgColor} />
        </div>
      )}
      {!text && <p className="qrcode-instruction">Enter text or URL to generate a QR code.</p>}
    </div>
  );
};

export default QRCodeGenerator;
