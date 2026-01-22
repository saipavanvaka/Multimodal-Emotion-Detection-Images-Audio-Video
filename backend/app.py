from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from utils.image_emotion import predict_image_emotion
from utils.audio_emotion import predict_audio_emotion
from utils.video_emotion import predict_video_emotion

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
PROCESSED_FOLDER = "processed_videos"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# ✅ Home Route to Fix 404 Issue
@app.route("/", methods=["GET"])
def home():
    return "Welcome to the Emotion Detection API!", 200

# ✅ Image Emotion Prediction
@app.route("/predict/image", methods=["POST"])
def predict_image():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    prediction = predict_image_emotion(file_path)

    return jsonify({
        "prediction": prediction,
        "image_url": f"http://localhost:5000/uploads/{file.filename}"
    })

# ✅ Serve Uploaded Images
@app.route("/uploads/<filename>")
def serve_uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ✅ Audio Emotion Prediction
@app.route("/predict/audio", methods=["POST"])
def predict_audio():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # ✅ Verify file is readable
    if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
        return jsonify({"error": "File upload failed or is empty"}), 500

    prediction = predict_audio_emotion(file_path)
    return jsonify({"prediction": prediction})

# ✅ Video Emotion Prediction
@app.route("/predict/video", methods=["POST"])
def predict_video():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    result = predict_video_emotion(file_path)
    
    return jsonify(result)

# ✅ Serve Processed Videos
@app.route("/processed_videos/<filename>")
def serve_processed_video(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=False, port=5000)
