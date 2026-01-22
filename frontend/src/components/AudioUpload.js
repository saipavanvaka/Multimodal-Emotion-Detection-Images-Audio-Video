import React, { useState } from "react";
import axios from "axios";

const AudioUpload = ({ setPrediction }) => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ✅ Reset state
    setPrediction("");
    setFileUploaded(false);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Uploading:", file.name);

      const response = await axios.post(
        "http://localhost:5000/predict/audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setPrediction(response.data.prediction);
        setFileUploaded(true);
      } else {
        setPrediction("Error processing audio file");
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setPrediction("Failed to upload audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <input
        type="file"
        accept="audio/*"
        onChange={handleUpload}
        className="form-control"
      />
      {loading && <p>Processing audio...</p>}
      {fileUploaded && (
        <p className="text-success">✅ File uploaded successfully!</p>
      )}
    </div>
  );
};

export default AudioUpload;
