# Wav2VecNigeria: An ASR System for Nigerian Languages

This repository houses the development of **Wav2VecNigeria**, a web application designed to transcribe audio in multiple languages, with a particular focus on low-resource Nigerian languages. 

## System Overview

Wav2VecNigeria aims to bridge the language gap in speech recognition technology by providing accurate transcription services for Nigerian languages often overlooked by mainstream solutions. The application leverages the power of  Hugging Face's Wav2Vec2 models, known for their state-of-the-art performance in speech recognition. Firebase provides a robust backend for user management and data storage.

## Key Features

**Audio Transcription:**

* **Upload or Record:** Users can conveniently upload pre-recorded audio files or directly record audio through their device's microphone.
* **Multilingual Support:** The application supports transcription in English and a growing list of Nigerian languages, including Yoruba, Igbo, and Hausa.
* **Wav2Vec2 Integration:**  Cutting-edge Wav2Vec2 models from Hugging Face power the transcription engine, ensuring high accuracy and efficiency.

**User Authentication and Management:**

* **Firebase Authentication:** Secure user registration and login are handled seamlessly through Firebase Authentication.
* **Consent Management:**  The application prioritizes user privacy by obtaining explicit consent for data collection and usage.

**Data Collection and Consent:**

* **Dataset Building:** With user consent, transcribed audio is anonymized and added to a growing dataset used to train and improve models for low-resource Nigerian languages.
* **Metadata Annotation:**  Collected data includes valuable metadata such as language, speaker demographics, and audio characteristics, enriching the dataset for research and development purposes.

**Frontend Web Interface:**

* **Intuitive Design:** A user-friendly interface makes it easy for users to navigate, upload/record audio, select languages, and view transcription results.
* **Transparent Consent:** Clear and concise consent options empower users to make informed decisions about their data contributions.

**Backend Infrastructure:**

* **Flask API:** A Flask-based web service acts as the backbone, handling audio processing, transcription requests, and communication with the Wav2Vec2 model.
* **Docker Containerization:** The application is packaged within a Docker container, ensuring portability, scalability, and ease of deployment.
* **Cloud Storage:** User-uploaded audio files are securely stored in cloud storage solutions like AWS S3 or Firebase Storage.
* **Kubernetes Orchestration:** A Kubernetes cluster (e.g., AWS EKS) manages the deployment, scaling, and load balancing of the application, ensuring optimal performance and reliability.

## Step-by-Step Design

**1. User Interface (UI) Design:**

*   **Landing Page:** Create a clean and intuitive landing page using HTML, CSS, and JavaScript, providing the following functionalities:
    *   Audio file upload with drag-and-drop support.
    *   Direct audio recording using browser APIs.
    *   Language selection dropdown menu (English, Yoruba, Igbo, Hausa initially).
    *   Audio consent checkbox with clear explanations.
    *   Transcription results display area.

**2. Frontend Development:**

*   **Framework:** Utilize JavaScript (or a framework like React for enhanced scalability) to handle:
    *   File uploads and audio recording management.
    *   API requests to the Flask backend for transcription.
    *   Dynamic language switching functionality.
*   **Firebase Integration:** Implement Firebase Authentication for:
    *   User registration and login.
    *   Tracking and managing user consent for data usage.

**3. Backend Development:**

*   **Flask API:** Develop a Flask web service with the following endpoints:
    *   `/transcribe`: Receives audio data, language selection, and user consent information.
    *   Processes audio using the selected Wav2Vec2 model.
    *   Returns the generated transcription to the frontend.
*   **Audio Processing:**
    *   Utilize a pre-trained Hugging Face Wav2Vec2 model fine-tuned for each supported language (e.g., `wav2vec2-large-xlsr` for multilingual support).
    *   Implement audio pre-processing steps as needed (e.g., resampling, noise reduction).
*   **Data Collection:**
    *   If user consent is granted, store the audio file and associated metadata (language, timestamp, demographics) in cloud storage (AWS S3 or Firebase Storage).
*   **Authentication and User Management:**
    *   Integrate Firebase Authentication to handle user authentication and authorization.
    *   Securely store and manage user consent information.

**4. Data Storage:**

*   **Audio Storage:** Store audio files in a structured manner within cloud storage (Firebase or AWS S3), tagging each file with relevant metadata.
*   **Transcription Data:** Utilize a NoSQL database like Firebase Firestore or AWS DynamoDB to store transcription results for efficient retrieval.

**5. Deployment Infrastructure:**

*   **Docker:**
    *   Create a Dockerfile to containerize the Flask application and its dependencies (Wav2Vec2, Flask, etc.).
    *   Build and push the Docker image to a container registry (e.g., Docker Hub, AWS ECR).
*   **Kubernetes:**
    *   Deploy the containerized application to a Kubernetes cluster (e.g., AWS EKS).
    *   Configure load balancing to distribute traffic and ensure scalability.

**6. Data Collection and Annotation (Future Enhancement):**

*   **Feedback Mechanism:** Integrate a feature allowing users to provide feedback on transcription quality and manually edit or annotate their transcriptions.
*   **Dataset Enrichment:** Store this annotated data to further train and refine models for low-resource Nigerian languages.

## Example System Architecture Diagram

![System Architecture Diagram] (assets/Wav2VecNigeria_System_Architecture.png)

## Simplifying for MVP (Minimum Viable Product)

To expedite the launch of a functional MVP, consider focusing on these core features:

*   **Essential UI:** Implement audio upload/recording, language selection (English + 1-2 Nigerian languages), and transcription display.
*   **Streamlined Backend:** Develop a single Dockerized Flask API to handle audio processing, user authentication, and data storage (with consent).
*   **Firebase Integration:** Leverage Firebase for user authentication, audio storage (if consent is given), and potentially database services.

This simplified approach allows for a quicker launch, gathering user feedback and iterating on features and language support in future development phases.