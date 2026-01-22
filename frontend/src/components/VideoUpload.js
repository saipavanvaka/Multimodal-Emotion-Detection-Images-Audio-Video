import React, { useState } from "react";
import axios from "axios";

const VideoUpload = ({ setPrediction }) => {
  const [frames, setFrames] = useState([]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/predict/video",
        formData
      );
      setPrediction(response.data.predictions.join(", ")); // Show all detected emotions
      setFrames(response.data.frames); // Store frames for display
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div>
      <h5>Upload Video</h5>
      <input
        type="file"
        accept="video/*"
        onChange={handleUpload}
        className="form-control"
      />

      {frames.length > 0 && (
        <div className="frame-container mt-3">
          <h6>Processed Frames:</h6>
          {frames.map((frame, index) => (
            <img
              key={index}
              src={`data:image/jpeg;base64,${frame}`}
              alt={`Frame ${index}`}
              className="img-thumbnail m-1"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
