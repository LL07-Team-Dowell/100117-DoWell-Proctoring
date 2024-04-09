/* eslint-disable react/prop-types */
import { useRef } from "react";
import html2canvas from "html2canvas";

const ScreenCapture = ({ children, captureScreen }) => {
  const captureRef = useRef(null);

  const handleCapture = () => {
    if (!captureRef.current) return;

    html2canvas(captureRef.current)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        console.log(imgData);
      })
      .catch((error) => {
        console.error("Error while capturingg:", error);
      });
  };

  return (
    <>
      <div ref={captureRef}>{children}</div>
      {captureScreen ? <button onClick={handleCapture}>Capture</button> : null}
    </>
  );
};

export default ScreenCapture;
