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

// Event listener for submitting transcription
submitTranscription?.addEventListener('click', async () => {
    console.log('Submit button clicked');
    const formData = new FormData();
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    formData.append('audio', audioBlob);
    formData.append('language', languageSelect.value);

    try {
        const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        transcriptionOutput.value = result.transcription || 'Transcription failed.';
    } catch (error) {
        console.error('Error uploading audio:', error);
        transcriptionOutput.value = 'Transcription failed.';
    }
});