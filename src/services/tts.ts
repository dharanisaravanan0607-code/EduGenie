import { synthesizeSpeech } from './api';

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking = false;
  private onStateChangeListeners: Array<(speaking: boolean) => void> = [];

  public subscribe(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.onStateChangeListeners.forEach((fn) => fn(this.isSpeaking));
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.notify();
  }

  public async speak(text: string, voice = 'Kore'): Promise<void> {
    this.stop();
    this.isSpeaking = true;
    this.notify();

    // Try Gemini TTS first
    try {
      const base64Audio = await synthesizeSpeech(text, voice);
      if (base64Audio) {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        this.currentAudio = audio;
        audio.onended = () => {
          this.isSpeaking = false;
          this.currentAudio = null;
          this.notify();
        };
        audio.onerror = () => {
          this.speakWithBrowserFallback(text);
        };
        await audio.play();
        return;
      }
    } catch {
      // Fallback seamlessly to native browser speech synthesis
      this.speakWithBrowserFallback(text);
    }
  }

  private speakWithBrowserFallback(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isSpeaking = false;
      this.notify();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => {
      this.isSpeaking = false;
      this.notify();
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
      this.notify();
    };
    window.speechSynthesis.speak(utterance);
  }
}

export const audioPlayer = new AudioService();
