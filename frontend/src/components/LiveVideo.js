import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const LiveVideo = ({ setPrediction }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [mostCommonEmotion, setMostCommonEmotion] = useState("");
  const intervalRef = useRef(null);

  // Start webcam
  const startWebcam = async () => {
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsRunning(true);
      setLoading(false);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setLoading(false);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setIsRunning(false);
      clearInterval(intervalRef.current);
      setEmotions([]);
      setMostCommonEmotion("");
    }
  };

  // Capture frame and send for prediction
  const captureAndPredict = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      async (blob) => {
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
          const response = await axios.post(
            "http://localhost:5000/predict/image",
            formData
          );

          if (response.data.prediction) {
            const newEmotion = response.data.prediction;
            setEmotions((prev) => [...prev, newEmotion].slice(-10)); // Keep last 10 emotions
            setPrediction(newEmotion);
          }
        } catch (error) {
          console.error("Prediction error:", error);
        }
      },
      "image/jpeg",
      0.8
    );
  };

  // Calculate most common emotion
  useEffect(() => {
    if (emotions.length > 0) {
      const emotionCounts = emotions.reduce((acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {});

      const mostCommon = Object.keys(emotionCounts).reduce((a, b) =>
        emotionCounts[a] > emotionCounts[b] ? a : b
      );
      setMostCommonEmotion(mostCommon);
    }
  }, [emotions]);

  // Start/stop interval for capturing frames
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(captureAndPredict, 3000); // Capture every 3 seconds
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return (
    <div className="live-video-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-element"
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <div className="controls mt-3">
        {!isRunning ? (
          <button
            className="btn btn-primary"
            onClick={startWebcam}
            disabled={loading}
          >
            {loading ? "Starting..." : "Start Webcam"}
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopWebcam}>
            Stop Webcam
          </button>
        )}
      </div>

      {mostCommonEmotion && (
        <div className="results mt-3">
          <div className="alert alert-info">
            <h5>Current Emotion: {mostCommonEmotion}</h5>
          </div>
          <div className="emotion-history">
            <h6>Recent Emotions:</h6>
            <p>{emotions.join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveVideo;
