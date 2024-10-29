import tensorflow as tf
from wav2vec2 import Wav2Vec2Processor, Wav2Vec2ForCTC

processor = Wav2Vec2Processor(is_tokenizer=False)
tokenizer = Wav2Vec2Processor(is_tokenizer=True)
model = Wav2Vec2ForCTC.from_pretrained("vasudevgupta/finetuned-wav2vec2-960h")

import soundfile as sf

def read_sound(file_name: str):
    if file_name.endswith(".flac"):
      with open(file_name, "rb") as f:
          speech, sample_rate = sf.read(f)
    elif file_name.endswith(".wav"):
      speech, sample_rate = sf.read(file_name)
    else:
      raise NotImplementedError

    assert sample_rate == 16000, "Sound must have a sample rate of 16K"
    speech = tf.constant(speech, dtype=tf.float32)
    return tf.transpose(speech)

def forward(speech: tf.Tensor):
  speech = tf.expand_dims(processor(speech), axis=0)
  tf_out = model(speech, training=False)
  return tf.squeeze(tf.argmax(tf_out, axis=-1))

def recognize_text(speech: tf.Tensor):
  tf_out = forward(speech)
  return tokenizer.decode(tf_out.numpy().tolist())

from IPython.display import Audio

print(recognize_text(read_sound(FILE_PATH)))
Audio(filename=FILE_PATH)