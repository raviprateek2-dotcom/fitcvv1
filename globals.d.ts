
// This file can be used to declare global types for the application.

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// This empty export is needed to treat this file as a module.
export {};
