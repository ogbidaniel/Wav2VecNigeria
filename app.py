from fasthtml.common import *
import requests
import json

app, rt = fast_app()

# read styles.css
with open('styles.css', 'r') as f:
    css_styles = f.read()

styles = Style(css_styles)

# Header component
def header():
    return Div(
        Div(
            Div(
                P("Daniel Ogbuigwe"),
                P("ASR Demo"),
                cls="header-text"
            ),
            A("Contact", href="#", cls="btn header-btn"),
            cls="header-content"
        )
    )

# Footer component
def footer():
    return Div(
        P("© 2024 Daniel Ogbuigwe | ",
          A("Privacy Policy", href="#"), " | ",
          A("Terms of Service", href="#"))
    )

# Main page route
@rt("/")
def get():
    return Title("ASR Demo"), Main(
        header(),
        Div(
            H1("Automatic Speech Recognition for the Ika Language", cls="gradient-text"),
            P("Try an experimental demo using a custom Wav2vec 2.0 model"),
            Div(
                Img(src="./assets/ika.png", alt="ASR_demo_thumbnail"),
                Div(
                    H3("MMS Ika ASR models"),
                    P("Transcribe spoken Ika with my custom Wav2vec2 model"),
                    P("Audio AI"),
                    A("Try it", href="demo", cls="btn"),
                    cls="card-content"
                ),
                cls="card"
            ),
            Div(
                Div(
                    Img(src="./assets/ASR4ikk.png", alt="Research Paper"),
                    H3("Research Paper"),
                    P("Read about the methodology and results of our Ika ASR project."),
                    P("Documentation"),
                    A("Read More", href="#", cls="btn"),
                    cls="card-small"
                ),
                Div(
                    Img(src="./assets/contributions.jpg", alt="Contribute your audio data"),
                    H3("Contribute Data"),
                    P("Help improve our model by contributing your Ika audio recordings."),
                    P("Community"),
                    A("Contribute", href="contribution", cls="btn"),
                    cls="card-small"
                ),
                Div(
                    Img(src="./assets/finetuning.png", alt="Contact Me"),
                    H3("Fine-tune your own model"),
                    P("Follow this jupyter notebook to fine tune your own speech recognition model."),
                    P("Learn"),
                    A("Huggingface🤗", href="#", cls="btn"),
                    cls="card-small"
                ),
                cls="card-grid"
            ),
            cls="container"
        ),
        footer(),
        styles
    )

# Demo page route
@rt("/demo")
def get():
    return Title("ASR Demo"), Main(
        header(),
        Div(
            H1("ASR for the Ika language", cls="gradient-text"),
            P("Record or upload your speech audio."),
            Div(
                Div(
                    H3("Transcript"),
                    P("Placeholder for transcript", id="transcript-output"),
                    cls="card-content"
                ),
                cls="card",
                id="transcript"
            ),
            Div(
                Button(
                    Img(src="./assets/microphone.svg", alt="microphone icon"),
                    "Record",
                    cls="action-button",
                    onclick="recordAudio()"
                ),
                Button(
                    Img(src="./assets/upload.svg", alt="upload icon"),
                    "Upload",
                    cls="action-button",
                    onclick="uploadAudio()"
                ),
                cls="button-container"
            ),
            cls="container"
        ),
        footer(),
        styles,
        Script("""
            function recordAudio() {
                // ... (Implement audio recording logic)
                // ... (Send recorded audio to inference endpoint)
            }

            function uploadAudio() {
                // ... (Implement audio upload logic)
                // ... (Send uploaded audio to inference endpoint)
            }
        """)
    )

# Inference endpoint
@rt("/inference", method="POST")
def inference():
    try:
        audio_data = request.body
        # ... (Process audio data)
        # ... (Perform inference using your model)
        # ... (Return transcript)
        transcript = "This is a placeholder for the returned transcript"
        return json.dumps({"transcript": transcript})
    except Exception as e:
        return json.dumps({"error": str(e)}), 500

serve()
