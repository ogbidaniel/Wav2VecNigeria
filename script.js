// Get the necessary elements from the HTML
const recordButton = document.getElementById('recordButton'); // The button to start/stop recording
const uploadInput = document.getElementById('uploadInput');   // The hidden file input for uploading audio files
const transcript = document.getElementById('transcript');     // The area where the transcript will be displayed

let mediaRecorder;  // This will hold the MediaRecorder object
let audioChunks = [];  // This will store the recorded audio data
let isRecording = false;  // Keeps track of whether the recording is active

// Event listener for the record button
recordButton.addEventListener('click', async () => {
    // If not recording, start recording
    if (!isRecording) {
        // Request access to the microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create a new MediaRecorder to handle recording
        mediaRecorder = new MediaRecorder(stream);
        
        // This event is fired when there's audio data available
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data); // Store each chunk of audio data
        };

        // When recording stops, send the audio to the server for transcription
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); // Combine the audio chunks into a single file
            
            // Clear the audio chunks array for the next recording
            audioChunks = [];

            // Send the audio to the server and get the transcription
            const transcriptText = await uploadAudio(audioBlob);

            // Display the transcription in the transcript area
            transcript.innerText = transcriptText || 'Transcription failed.';
        };

        // Start recording
        mediaRecorder.start();
        isRecording = true;
        recordButton.innerText = 'Stop Recording';  // Change button text to indicate recording is active
    } 
    // If already recording, stop recording
    else {
        mediaRecorder.stop();  // Stop recording
        isRecording = false;
        recordButton.innerText = 'Record';  // Change button text back to "Record"
    }
});

// Function to send audio to the server and get transcription
async function uploadAudio(audioBlob) {
    const formData = new FormData();  // Create form data to send the audio
    formData.append('audio', audioBlob);  // Attach the audio file

    try {
        // Send the form data to the backend
        const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
        });

        // Convert the server's response to JSON
        const result = await response.json();

        // Return the transcription text
        return result.transcription;
    } catch (error) {
        console.error('Error uploading audio:', error);
        return null;  // Return null if there's an error
    }
}

// Event listener for uploading audio files
uploadInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];  // Get the selected audio file
    if (file) {
        // Send the audio file to the server and get the transcription
        const transcriptText = await uploadAudio(file);

        // Display the transcription in the transcript area
        transcript.innerText = transcriptText || 'Transcription failed.';
    }
});
