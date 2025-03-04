import cv2
import numpy as np
import tensorflow as tf
import base64
from tensorflow.keras.models import load_model

# Load pre-trained model
model = load_model("models/emotion_model.hdf5", compile=False)
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), loss="categorical_crossentropy", metrics=["accuracy"])

# Emotion labels
emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def predict_video_emotion(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Could not open video file"}

    fps = int(cap.get(cv2.CAP_PROP_FPS))  # Frames per second
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))  # Total frames in video
    video_duration = total_frames / fps  # Video duration in seconds

    frame_interval = 3 * fps  # Extract a frame every 3 seconds
    frames_data = []
    predictions = []
    
    frame_count = 0
    while cap.isOpened():
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_count * frame_interval)
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            face = gray[y:y+h, x:x+w]
            face = cv2.resize(face, (64, 64))
            face = face.astype("float32") / 255.0
            face = np.expand_dims(face, axis=0)
            face = np.expand_dims(face, axis=-1)

            emotion_prediction = model.predict(face)
            predicted_emotion = np.argmax(emotion_prediction)
            predictions.append(emotion_labels[predicted_emotion])

            # Draw bounding box & label on frame
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
            cv2.putText(frame, emotion_labels[predicted_emotion], (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

        # Convert frame to Base64
        _, buffer = cv2.imencode(".jpg", frame)
        frame_base64 = base64.b64encode(buffer).decode("utf-8")
        frames_data.append(frame_base64)

        frame_count += 1
        if frame_count * frame_interval >= total_frames:
            break

    cap.release()

    return {"predictions": predictions, "frames": frames_data}
