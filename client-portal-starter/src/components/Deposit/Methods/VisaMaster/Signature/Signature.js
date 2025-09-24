/* eslint-disable no-multiple-empty-lines */
/* eslint-disable indent */
/* eslint-disable object-curly-newline */
/* eslint-disable semi */
/* eslint-disable quotes */
import React, { useRef, useState, useEffect } from 'react';
import './Signature.css';
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

export default function Signature({
    activeStep,
    toggleTab,
}) {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(0.05); 
  const [saveStatus, setSaveStatus] = useState('');
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSignatureEnabled, setIsSignatureEnabled] = useState(false);

  // Check if both checkboxes are checked to enable signature
  useEffect(() => {
    setIsSignatureEnabled(termsAccepted && privacyAccepted);
    if (!termsAccepted || !privacyAccepted) {
      clearSignature();
    }
  }, [termsAccepted, privacyAccepted]);

  // Initialize canvas with smooth drawing settings
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set higher quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    clearSignature();

    // Load saved signature if exists
    // const savedSignature = localStorage.getItem('savedSignature');
    // if (savedSignature) {
    //   setTermsAccepted(true);
    //   setPrivacyAccepted(true);
    //   const img = new Image();
    //   img.onload = () => {
    //     ctx.drawImage(img, 0, 0);
    //     setSignatureData(savedSignature);
    //     setIsCanvasEmpty(false);
    //   };
    //   img.src = savedSignature;
    // }
    console.log("this is normal use effect");
    
  }, []);

  const startDrawing = (e) => {
    if (!isSignatureEnabled) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set smoother drawing properties
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    setIsDrawing(true);
    setIsCanvasEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawing || !isSignatureEnabled) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Continue with smooth line
    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL();
      setSignatureData(dataUrl);
      setIsDrawing(false);
      
      // Check if canvas is empty
      checkCanvasEmpty();
    }
  };

  const checkCanvasEmpty = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(
      ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    const isEmpty = !pixelBuffer.some(color => color !== 0);
    setIsCanvasEmpty(isEmpty);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
    setSaveStatus('');
    setIsCanvasEmpty(true);
  };

  const saveSignature = () => {
    if (!isCanvasEmpty && signatureData && isSignatureEnabled) {
      try {
        localStorage.setItem('savedSignature', signatureData);
        setSaveStatus('Signature saved successfully!');
        toggleTab(activeStep + 1);
      } catch (error) {
        setSaveStatus('Error saving signature: ' + error.message);
      }
    } else {
      setSaveStatus('Please accept terms and create a signature');
    }
  };

  const downloadSignature = () => {
    if (!isCanvasEmpty && signatureData) {
      const link = document.createElement('a');
      link.href = signatureData;
      link.download = `signature_${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
<>
    <div className="terms-checkboxes">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="termsCheckbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="termsCheckbox">I accept the Terms and Conditions</label>
        </div>
        
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="privacyCheckbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
          />
          <label htmlFor="privacyCheckbox">I accept the Privacy Policy</label>
        </div>
      </div>

    <div className="signature-container">
      <h2>Sign Below</h2>
      
      
      
      {/* <div className="signature-controls">
        <div className="color-picker">
          <label>Color : </label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
          />
        </div>
      </div> */}
      
      <div className="signature-pad">
        <canvas
          ref={canvasRef}
          width={250}
          height={75}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e.touches[0]);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e.touches[0]);
          }}
          onTouchEnd={stopDrawing}
          className={`signature-pad-canvas ${!isSignatureEnabled ? 'disabled' : ''}`}
          style={{ cursor: isSignatureEnabled ? 'crosshair' : 'not-allowed' }}
        />
      </div>
      
      <div className="signature-actions">
        {/* <button onClick={() => toggleTab(0)} className="clear-btn">
          Back
        </button> */}
        <button onClick={clearSignature} className="clear-btn">
          Clear
        </button>
        {/* <button 
          onClick={saveSignature} 
          className="save-btn"
          disabled={isCanvasEmpty || !isSignatureEnabled}
        >
          Continue
        </button> */}
        {/* <button 
          onClick={downloadSignature} 
          className="download-btn"
          disabled={isCanvasEmpty || !isSignatureEnabled}
        >
          Download
        </button> */}
      </div>
      
      {saveStatus && (
        <div className={`save-status ${saveStatus.includes('success') ? 'success' : 'error'}`}>
          {saveStatus}
        </div>
      )}
    </div>
    <div className="my-4 text-center">
        <Button
          className="btn btn-primary m-2 btn-sm w-lg"
          onClick={() => toggleTab(activeStep - 1)}
        >
          {t("Back")}
        </Button>
        <Button
          className="btn btn-success m-2 btn-sm w-lg"
          type="submit"
          onClick={saveSignature}
          disabled={isCanvasEmpty || !isSignatureEnabled}
        >
          {t("Continue")}
        </Button>
      </div>
    </>
  );
}