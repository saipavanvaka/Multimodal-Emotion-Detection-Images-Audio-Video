import React from "react";
import axios from "axios";

const ImageUpload = ({ setPrediction, setImageUrl, setFileUploaded }) => {
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/predict/image",
        formData
      );

      if (response.data.image_url) {
        setImageUrl(response.data.image_url); // ✅ Set correct image URL
      }
      setPrediction(response.data.prediction);
      setFileUploaded(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mt-3">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="form-control"
      />
    </div>
  );
};

export default ImageUpload;
