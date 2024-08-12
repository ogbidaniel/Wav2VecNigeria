from fasthtml.common import *

app, rt = fast_app()

# CSS Styles
styles = Style("""
body {
    font-family: Helvetica, Arial, sans-serif;
    background-color: #000000;
    color: #ffffff;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header-text {
    display: flex;
    flex-direction: column;
}

.gradient-text {
    font-size: 2em;
    background: linear-gradient(45deg, #ff00ff, #00ffff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
}

.card {
    background-color: #2c2c2c;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
}

.card img {
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
}

.card-content {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
}

.card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.card-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
}

.card-small {
    background-color: #2c2c2c;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 30px;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
}

.card-small img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
}

.card-small::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 12px;
    background: linear-gradient(45deg, #cf1da3, #00ffff);
    z-index: -1;
    transition: opacity 0.3s ease;
    opacity: 0;
    box-sizing: border-box;
}

.card-small:hover::before {
    opacity: 1;
}

.card-small:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}


.btn {
    background-color: #000000;
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 20px;
    text-decoration: none;
    display: inline-block;
    margin-top: auto;
    width: 90px;
    text-align: center;
    transition: background-color 0.3s ease;
    font-size: 0.8em;
}

.btn:hover {
    background-color: #333333;
}

.button-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #20a8ba;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    border-radius: 5px;
    cursor: pointer;
    width: 150px;
}

#transcript {
    background-color: #2c2c2c;
    color: #fff;
    padding: 20px;
    border-radius: 10px;
    font-size: 1.5em;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    height: 150px;
    overflow-y: auto;
    text-align: center;
}

""")

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
                    cls="card-content"
                ),
                cls="card",
                id="transcript"
            ),
            Div(
                Button(
                    Img(src="./assets/microphone.svg", alt="microphone icon"),
                    "Record",
                    cls="action-button"
                ),
                Button(
                    Img(src="./assets/upload.svg", alt="upload icon"),
                    "Upload",
                    cls="action-button"
                ),
                cls="button-container"
            ),
            cls="container"
        ),
        footer(),
        styles
    )

serve()
