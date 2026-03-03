import * as Speech from "expo-speech"

export function speakNarratorTest(activeNarratorVoice, allowPtBrFallback) {
  const canNarrate = activeNarratorVoice || allowPtBrFallback
  if (!canNarrate) {
    return
  }

  Speech.stop()
  Speech.speak("Teste de narração em português do Brasil.", {
    language: "pt-BR",
    voice: activeNarratorVoice || undefined,
    pitch: 1,
    rate: 0.95,
  })
}
