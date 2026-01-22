import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import ImageUpload from "./components/ImageUpload";
import AudioUpload from "./components/AudioUpload";
import VideoUpload from "./components/VideoUpload";
import LiveVideo from "./components/LiveVideo";
import "./components/App.css";

function App() {
  const [activeTab, setActiveTab] = useState("image");
  const [prediction, setPrediction] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [useWebcam, setUseWebcam] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  // ✅ Reset state when switching between tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPrediction(""); // Clear previous detected emotions
    setImageUrl(""); // Clear uploaded images
    setFileUploaded(false); // Reset file upload state
  };

  return (
    <div className="container text-center mt-5">
      <Navbar setActiveTab={handleTabChange} activeTab={activeTab} />
      <h2 className="mt-4">🎭 {activeTab.toUpperCase()} Emotion Detection</h2>

      <div className="content-section mt-4">
        {activeTab === "image" && (
          <ImageUpload
            setPrediction={setPrediction}
            setImageUrl={setImageUrl}
            setFileUploaded={setFileUploaded}
          />
        )}
        {activeTab === "audio" && <AudioUpload setPrediction={setPrediction} />}
        {activeTab === "video" && (
          <>
            <div className="mt-3">
              <button
                className={`btn btn-secondary m-2 ${
                  !useWebcam ? "active" : ""
                }`}
                onClick={() => setUseWebcam(false)}
              >
                File Upload
              </button>
              <button
                className={`btn btn-secondary m-2 ${useWebcam ? "active" : ""}`}
                onClick={() => setUseWebcam(true)}
              >
                Real-Time Processing
              </button>
            </div>
            {useWebcam ? (
              <LiveVideo />
            ) : (
              <VideoUpload setPrediction={setPrediction} />
            )}
          </>
        )}
      </div>

      {/* ✅ Display uploaded image only when available */}
      {imageUrl && activeTab === "image" && (
        <div className="mt-4">
          <h6>Uploaded Image:</h6>
          <img
            src={imageUrl}
            alt="Uploaded"
            className="img-fluid uploaded-image border rounded shadow-lg"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}

      {/* ✅ Display emotion prediction only when available */}
      {prediction && (
        <div className="alert alert-success mt-4">
          <h5>Predicted Emotion:</h5>
          <p className="text-large font-weight-bold">{prediction}</p>
        </div>
      )}
    </div>
  );
}

export default App;
