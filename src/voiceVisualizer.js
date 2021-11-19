import Wave from "wave-visualizer";

export default class VoiceVisualizer {
  constructor() {}

  async openAudioStream() {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    } catch (err) {
      console.error("Cannot open Audio Stream ", err);
    }
  }

  async startVisualization() {
    await this.openAudioStream();

    let waveSpeech = new Wave();

    waveSpeech.fromStream(this.audioStream, "output", {
      type: "bars",
      colors: ["blue", "3498db"],
      stroke: 2.5,
    });
  }

  stopVisualization() {
    this.audioStream.getTracks().forEach((track) => {
      track.stop();
    });
  }
}
