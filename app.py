from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from werkzeug.utils import secure_filename
import tempfile
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client with API key from environment
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Add this language mapping dictionary at the top of the file after imports
LANGUAGE_MAPPING = {
    'en': 'en',  # English
    'ikk': 'en'  # Ika (fallback to English since Whisper doesn't support Ika directly)
}

@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({'success': False, 'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        language_code = request.form.get('language', '')
        
        # Validate and map language code
        if language_code not in LANGUAGE_MAPPING:
            return jsonify({
                'success': False, 
                'error': f'Unsupported language code: {language_code}'
            }), 400
            
        whisper_language = LANGUAGE_MAPPING[language_code]
        
        # Create temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
            audio_file.save(temp_audio.name)
            
            # Call OpenAI API
            try:
                with open(temp_audio.name, 'rb') as audio:
                    transcript = client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio,
                        language=whisper_language
                    )
                
                return jsonify({
                    'success': True,
                    'transcription': transcript.text
                })
            
            except Exception as e:
                return jsonify({
                    'success': False,
                    'error': f'OpenAI API Error: {str(e)}'
                }), 500
            
            finally:
                # Clean up temp file
                os.unlink(temp_audio.name)
                
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server Error: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)