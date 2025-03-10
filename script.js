// Import Wavesurfer.js in your HTML file
// Add this to your <head> or just before the closing </body> tag:
// <script src="https://unpkg.com/wavesurfer.js@7"></script>

// Get the necessary elements from the HTML
const recordButton = document.querySelector('#recordButton');
const uploadButton = document.querySelector('#uploadButton');
const uploadInput = document.querySelector('#uploadInput');
const playButton = document.querySelector('#playButton');
const transcriptionOutput = document.querySelector('#transcriptionOutput');
const languageSelect = document.querySelector('#languageSelect');
const submitTranscription = document.querySelector('#submitTranscription');
const darkModeToggle = document.querySelector('#darkModeToggle');
const prefersDarkMode = localStorage.getItem('theme') === 'dark';

let mediaRecorder;  // This will hold the MediaRecorder object
let audioChunks = [];  // This will store the recorded audio data
let isRecording = false;  // Keeps track of whether the recording is active
let currentAudioBlob = null; // Add this at the top with other state variables

// Initialize Wavesurfer
let wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#CBD2A4',
    progressColor: '#54473F',
    cursorColor: '#9A7E6F',
    height: 200,
    responsive: true,
    barWidth: 2,
});

if (prefersDarkMode) {
    document.body.classList.add('dark-mode');
}

// Event listener for dark mode toggle button
darkModeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

/* Ensure all relevant elements update when dark mode is toggled */
const darkModeElements = document.querySelectorAll('.navbar, .btn-primary, .tabs-container, .card, .footer');
darkModeToggle?.addEventListener('click', () => {
    darkModeElements.forEach(element => {
        element.classList.toggle('dark-mode');
    });
});

// Event listener for the record button
recordButton?.addEventListener('click', async () => {
    console.log('Record button clicked');
    if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        audioChunks = [];  // Clear any previous data

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            currentAudioBlob = audioBlob; // Store the blob
            const audioURL = URL.createObjectURL(audioBlob);
            wavesurfer.load(audioURL);

            wavesurfer.on('ready', () => {
                console.log('Waveform is ready for recorded audio.');
            });
        };

        mediaRecorder.start();
        isRecording = true;
        recordButton.innerText = 'Stop Recording';
    } else {
        mediaRecorder.stop();
        isRecording = false;
        recordButton.innerText = 'Record';
    }
});

// Event listener for the upload button
uploadButton?.addEventListener('click', () => {
    console.log('Upload button clicked');
    uploadInput.click();
});

// Event listener for uploading audio files
uploadInput?.addEventListener('change', (event) => {
    console.log('Upload input changed');
    const file = event.target.files[0];
    if (file) {
        currentAudioBlob = file; // Store the uploaded file as blob
        wavesurfer.load(URL.createObjectURL(file));

        wavesurfer.on('ready', () => {
            console.log('Waveform is ready for uploaded audio.');
        });
    }
});

// Play/Pause button functionality
playButton?.addEventListener('click', () => {
    console.log('Play/Pause button clicked');
    wavesurfer.playPause();
});

// Update the API URL configuration
const API_URL = 'http://localhost:5000';

// Update the transcription submission handler
submitTranscription?.addEventListener('click', async () => {
    try {
        // Disable submit button and show loading state
        submitTranscription.disabled = true;
        transcriptionOutput.value = 'Transcribing...';

        // Validate inputs
        if (!currentAudioBlob) {
            throw new Error('Please record or upload audio first.');
        }

        if (!languageSelect.value) {
            throw new Error('Please select a language.');
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('audio', currentAudioBlob);
        formData.append('language', languageSelect.value);

        // Make API call
        const response = await fetch(`${API_URL}/api/transcribe`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || `Server error: ${response.status}`);
        }

        // Update UI with transcription
        transcriptionOutput.value = data.transcription;

    } catch (error) {
        console.error('Transcription error:', error);
        transcriptionOutput.value = `Error: ${error.message}`;
    } finally {
        submitTranscription.disabled = false;
    }
});

// Add a function to clear the audio state
const clearAudioState = () => {
    currentAudioBlob = null;
    audioChunks = [];
    transcriptionOutput.value = '';
    wavesurfer.empty();
};

// Add clear button handler if you have one
clearTranscription?.addEventListener('click', clearAudioState);

// Add visual feedback for audio state
const updateUIState = (hasAudio) => {
    submitTranscription.disabled = !hasAudio || !languageSelect.value;
    // Optional: Add visual indication that audio is ready
    document.querySelector('.waveform-container')?.classList.toggle('has-audio', hasAudio);
};

// Update the event listeners
wavesurfer.on('ready', () => {
    updateUIState(true);
});

languageSelect?.addEventListener('change', () => {
    updateUIState(!!currentAudioBlob);
});