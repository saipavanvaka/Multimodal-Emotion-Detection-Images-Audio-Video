import torch
import torchaudio
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2FeatureExtractor

# ✅ Use GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"

# ✅ Load Model & Feature Extractor
def load_model():
    model_name = "facebook/wav2vec2-large-robust-ft-swbd-300h"
    model = Wav2Vec2ForSequenceClassification.from_pretrained(model_name, num_labels=7)
    feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_name)

    # ✅ Ensure model weights are initialized properly
    model.to(device)
    return model, feature_extractor

# ✅ Load the model globally
model, feature_extractor = load_model()

# ✅ Emotion Labels
emotion_labels = {
    0: "Angry",
    1: "Disgust",
    2: "Fear",
    3: "Happy",
    4: "Neutral",
    5: "Sad",
    6: "Surprise"
}

# ✅ Preprocess the Audio File
def preprocess_audio(audio_file):
    try:
        waveform, sample_rate = torchaudio.load(audio_file)

        # ✅ Normalize Audio Input
        waveform = waveform - waveform.mean()
        waveform = waveform / (waveform.abs().max() + 1e-6)

        # ✅ Resample to 16kHz if Necessary
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
            waveform = resampler(waveform)

        # ✅ Extract Features
        inputs = feature_extractor(
            waveform.squeeze().numpy(force=True),
            sampling_rate=16000,
            return_tensors="pt",
            padding=True
        )

        # ✅ Move to GPU if Available
        inputs = {k: v.to(device) for k, v in inputs.items()}
        return inputs

    except Exception as e:
        print(f"Error processing audio file: {e}")
        return None

# ✅ Predict Emotion from Audio
def predict_audio_emotion(audio_file):
    inputs = preprocess_audio(audio_file)
    if inputs is None:
        return "Error in processing audio"

    with torch.no_grad():
        logits = model(**inputs).logits

    # ✅ Print Logits for Debugging
    print("Logits:", logits)

    predicted_class = torch.argmax(logits, dim=-1).item()
    return emotion_labels.get(predicted_class, "Unknown")
