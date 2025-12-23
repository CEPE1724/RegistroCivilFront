import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@mui/material";

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: "user",
};

export default function CapturarCamara({ onCapture }) {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    if (onCapture) onCapture(imageSrc);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!capturedImage ? (
        <>
          <div className="relative w-[400px] h-[300px] rounded-lg overflow-hidden shadow-lg">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              mirrored={true}
              className="w-full h-full object-cover"
            />
            {/* Cuadro de guía */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div
                className="border-4 border-white"
                style={{
                  width: "220px",
                  height: "260px",
                }}
              />
            </div>
          </div>

          <p className="text-sm text-gray-600 text-center max-w-sm">
            Alinea tu rostro dentro del marco blanco. Mira de frente con buena iluminación.
          </p>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCapture}
          >
            Tomar Foto
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <img
            src={capturedImage}
            alt="Captura"
            className="rounded-lg shadow-lg w-64 h-64 object-cover"
          />
          <Button
            variant="outlined"
            onClick={() => {
              setCapturedImage(null);
              onCapture(null);
            }}
          >
            Volver a tomar
          </Button>
        </div>
      )}
    </div>
  );
}
