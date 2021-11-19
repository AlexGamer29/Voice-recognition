import * as tf from "@tensorflow/tfjs";
import * as SpeechCommands from "@tensorflow-models/speech-commands";

import VoiceModel from "../models/voice_model/model.json";
import VoiceModelMetadata from "../models/voice_model/metadata.json";

export default class VoiceAssistant {
  constructor() {
    this.options = {
      includeSpectogram: true,
      overlapFactor: 0.5,
      invokeCallbackOnNoiseAndUnkown: false,
      probabilityThershold: 0.75,
    };
  }

  async buildModel() {
    const recognizer = SpeechCommands.create(
      "BROWSER_FFT",
      undefined,
      VoiceModel,
      VoiceModelMetadata
    );

    await recognizer.ensureModelLoaded();

    return recognizer;
  }

  async startAssistant(onListen) {
    this.recognizer = await this.buildModel();

    const classLabels = this.recognizer.wordLabels();

    this.recognizer.listen((result) => {
      const points = result.scores;

      const wordPoints = points.reduce((previousValue, value) => {
        if (previousValue) {
          if (previousValue > value) return previousValue;
        }
        return value;
      });

      const wordIndex = points.findIndex((v) => v === wordPoints);
      const word = classLabels[wordIndex];

      if (onListen) onListen(word);
    }, this.options);
  }

  async stopAssistant() {
    await this.recognizer.stopListening();
  }

  saySpeech(text) {
    const sentence = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(sentence);
  }
}
