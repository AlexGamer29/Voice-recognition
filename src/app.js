import { getWeather } from "./apiWeather";
import { wait } from "./utils";
import VoiceAssistant from "./voiceAssistant";
import VoiceVisualizer from "./voiceVisualizer";

const startButton = document.getElementById("start-astn-btn");

let isStarted = false;
let processingWord = null;

const voiceAssistant = new VoiceAssistant();
const voiceVisualizer = new VoiceVisualizer();

async function processWord(word) {
  switch (word) {
    case "Hello":
      voiceAssistant.saySpeech("Hello my friend, I'm Ohmni Robot");
      await wait(6000);
      break;
    case "Weather":
      const location = "Da Nang";
      const weather = await getWeather(location);
      voiceAssistant.saySpeech(
        `The weather for today in ${location} is ${weather} degrees`
      );
      await wait(5000);
      break;
    case "Good Morning":
      voiceAssistant.saySpeech(
        "Good Morning, my friends. How can I help you?"
      );
      await wait(5000);
      break;
    case "Time":
      const time = new Date().toLocaleTimeString();
      voiceAssistant.saySpeech(`The time is ${time}`);
      console.log(time);
      await wait(5000);
      break;
    case "Stop":
      voiceAssistant.saySpeech("Good bye my friend");
      // Click on start button to stop assistant
      startButton.click();
      await wait(5000);
      break;
  }

  processingWord = null;
}

function onListen(word) {
  if (processingWord) return;

  console.log("Word: ", word);
  processingWord = word;
  processWord(word);
}

startButton.onclick = async () => {
  if (!isStarted) {
    //Start assistant
    startButton.innerText = "Listening...";
    await voiceAssistant.startAssistant(onListen);
    await voiceVisualizer.startVisualization();
    isStarted = true;
    startButton.innerText = "Stop Ohmni";
  } else {
    //Stop assistant
    startButton.innerText = "Stopping...";
    await voiceAssistant.stopAssistant();
    voiceVisualizer.stopVisualization();
    isStarted = false;
    startButton.innerText = "Start Ohmni";
  }
};
