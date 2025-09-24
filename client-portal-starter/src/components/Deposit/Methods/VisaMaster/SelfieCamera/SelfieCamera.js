/* eslint-disable indent */
/* eslint-disable object-curly-newline */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable semi */
/* eslint-disable quotes */
import React, { useRef, useState, useEffect } from "react";
import "./SelfieCamera.css";
import { Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import { fetchDocsStart } from "store/general/documents/actions";

export default function SelfieCamera({ onCapture, toggleTab, activeStep }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");


  const { t } = useTranslation();

  useEffect(() => {
    fetchDocsStart();

    return () => {
      stopCamera();
    };
  }, []);

  // Start the camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setHasPermission(true);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(err.message || "Could not access camera");
      setHasPermission(false);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Toggle between front and rear camera
  const toggleCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Take a photo
  const takePhoto = () => {
    if (!videoRef.current || !stream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    photoDataUrl == "data:," ? setPhoto(null) : setPhoto(photoDataUrl);

    stopCamera();

    if (onCapture) {
      onCapture(photoDataUrl);
    }
  };

  // Save photo to localStorage and proceed
  const handleContinue = () => {
    if (photo) {
      console.log("Saving photo:", photo);

      try {
        localStorage.setItem("selfiePhoto", photo);
        setSaveStatus("Photo saved successfully!");
        toggleTab(activeStep + 1);
        stopCamera();
      } catch (error) {
        setSaveStatus("Error saving photo: " + error.message);
      }
    } else {
      setSaveStatus("Please take a photo first");
    }
    toggleTab(activeStep + 1);
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start/stop camera when facingMode changes
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  return (
    <>
      <div className="selfie-camera-container">
        <h2>Take a Selfie</h2>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please ensure you've granted camera permissions.</p>
          </div>
        )}

        <div className="camera-preview">
          {hasPermission && !photo ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-element"
            />
          ) : (
            <div className="camera-placeholder">
              {photo ? (
                <img
                  src={photo}
                  alt="Captured selfie"
                  className="captured-photo-preview"
                />
              ) : (
                <p>Camera not available</p>
              )}
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <div className="camera-controls">
          <button
            onClick={takePhoto}
            className="capture-btn"
            disabled={!hasPermission}
          >
            Take Photo
          </button>

          <button
            onClick={toggleCamera}
            className="switch-camera-btn"
            disabled={!hasPermission}
          >
            {facingMode === "user"
              ? "Switch to Rear Camera"
              : "Switch to Front Camera"}
          </button>
        </div>

        {saveStatus && (
          <div
            className={`save-status ${
              saveStatus.includes("success") ? "success" : "error"
            }`}
          >
            {saveStatus}
          </div>
        )}
      </div>
      <div className="my-4 text-center">
        <Button
          className="btn btn-primary m-2 btn-sm w-lg"
          onClick={() => {
            toggleTab(activeStep - 1);
            stopCamera();
          }}
        >
          {t("Back")}
        </Button>
        <Button
          className="btn btn-success m-2 btn-sm w-lg"
          type="submit"
          onClick={handleContinue}
          disabled={!photo || photo === "data:,"}
        >
          {t("Continue")}
        </Button>
      </div>
    </>
  );
}