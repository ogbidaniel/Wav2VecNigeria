// ASR App Core Functionality

// Import WaveSurfer for waveform visualization
import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'

// Application State
const appState = {
    isRecording: false,
    isProcessing: false,
    audioBlob: null,
    wavesurfer: null,
    ws: null // WebSocket connection
};

// Initialize WaveSurfer
function initWaveSurfer() {
    appState.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        responsive: true,
        height: 100,
    });
}

// Audio Recording
let mediaRecorder;
const audioChunks = [];

function startRecording() {
    if (appState.isRecording) return;
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            appState.isRecording = true;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                appState.audioBlob = audioBlob;
                processAudio(audioBlob);
            };
            mediaRecorder.start();
            updateUI();
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
            showError('Unable to access microphone. Please check your permissions.');
        });
}

function stopRecording() {
    if (!appState.isRecording) return;
    
    appState.isRecording = false;
    mediaRecorder.stop();
    updateUI();
}

// File Upload Handling
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
        appState.audioBlob = file;
        processAudio(file);
    } else {
        showError('Please upload a valid audio file.');
    }
}

// Audio Processing
function processAudio(audioBlob) {
    appState.isProcessing = true;
    updateUI();

    // Display the audio waveform
    const audioUrl = URL.createObjectURL(audioBlob);
    appState.wavesurfer.load(audioUrl);

    // Send audio to ASR service (placeholder for actual API call)
    sendAudioToASR(audioBlob);
}

// Placeholder for ASR service API call
function sendAudioToASR(audioBlob) {
    // Simulating API call with setTimeout
    setTimeout(() => {
        const transcription = "This is a simulated transcription of your audio.";
        updateTranscript(transcription);
        appState.isProcessing = false;
        updateUI();
    }, 3000);
}

// WebSocket for real-time updates (placeholder implementation)
function initWebSocket() {
    appState.ws = new WebSocket('ws://your-websocket-url');
    appState.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'transcription') {
            updateTranscript(message.text);
        }
    };
}

// UI Updates
function updateUI() {
    const recordButton = document.querySelector('#recordButton');
    const uploadButton = document.querySelector('#uploadButton');
    const transcriptArea = document.querySelector('#transcript');

    recordButton.textContent = appState.isRecording ? 'Stop Recording' : 'Start Recording';
    recordButton.disabled = appState.isProcessing;
    uploadButton.disabled = appState.isRecording || appState.isProcessing;

    if (appState.isProcessing) {
        transcriptArea.textContent = 'Processing audio...';
    }
}

function updateTranscript(text) {
    const transcriptArea = document.querySelector('#transcript');
    transcriptArea.textContent = text;
}

function showError(message) {
    // Implement error display logic (e.g., show a toast notification)
    console.error(message);
    alert(message); // Replace with a more user-friendly notification in production
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initWaveSurfer();
    initWebSocket();

    const recordButton = document.querySelector('#recordButton');
    const uploadButton = document.querySelector('#uploadButton');

    recordButton.addEventListener('click', () => {
        if (appState.isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    uploadButton.addEventListener('change', handleFileUpload);
});

// Export functions for use in other scripts if needed
export {
    startRecording,
    stopRecording,
    handleFileUpload,
    updateTranscript
};