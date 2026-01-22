# Multimodal-Emotion-Detection-Images-Audio-Video

An end-to-end Deep Learning solution that detects human emotions by fusing data from **Images, Audio, and Video**. 

## 🌟 Project Highlights
- **Backend:** Flask (Python)
- **Frontend:** React.js
- **ML Models:** CNN (Images), LSTM/Transformers (Audio/Temporal Video)
- **Multi-channel Fusion:** Combines facial expressions and vocal patterns for higher accuracy.

## 📁 Repository Structure
- `app.py`: Flask server handling API requests.
- `audio_emotion.py`: Feature extraction and classification for speech.
- `image_emotion.py`: Facial expression recognition module.
- `video_emotion.py`: Temporal analysis of emotion in video streams.

## 🛠️ Setup Instructions
1. **Backend:**
   - Install dependencies: `pip install -r requirements.txt`
   - Start the server: `python app.py`
2. **Frontend:**
   - Install modules: `npm install`
   - Run the app: `npm start`

## 🎯 Future Enhancements
- Real-time deployment via WebSockets.
- Integration of more diverse datasets to reduce bias.
