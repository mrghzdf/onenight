import { useEffect, useMemo, useState } from "react"
import * as Speech from "expo-speech"
import {
  getDeviceLocaleTag,
  listBrazilianVoices,
  pickBrazilianVoice,
} from "../utils/gameHelpers"
import { speakNarratorTest } from "../utils/speechHelpers"

export function useVoiceManager(selectedNarratorVoiceId, setSelectedNarratorVoiceId) {
  const [narratorVoice, setNarratorVoice] = useState(null)
  const [availableNarratorVoices, setAvailableNarratorVoices] = useState([])
  const [voiceResolved, setVoiceResolved] = useState(false)
  const [allowPtBrFallback, setAllowPtBrFallback] = useState(false)

  const activeNarratorVoice = useMemo(
    () =>
      selectedNarratorVoiceId === "auto"
        ? narratorVoice
        : selectedNarratorVoiceId,
    [selectedNarratorVoiceId, narratorVoice],
  )

  const testNarratorVoice = () =>
    speakNarratorTest(activeNarratorVoice, allowPtBrFallback)

  useEffect(() => {
    let mounted = true

    const loadVoices = async () => {
      try {
        const voices = await Speech.getAvailableVoicesAsync()
        const localeTag = getDeviceLocaleTag()
        const deviceIsPtBr = /^pt[-_]?br/i.test(localeTag)
        const ptBrVoices = listBrazilianVoices(voices, localeTag)
        const ptBrVoice = pickBrazilianVoice(voices, localeTag)

        if (mounted) {
          setAvailableNarratorVoices(ptBrVoices)
          setNarratorVoice(ptBrVoice?.identifier ?? null)
          setSelectedNarratorVoiceId((prev) => {
            if (prev === "auto") return prev
            return ptBrVoices.some((voice) => voice.identifier === prev)
              ? prev
              : "auto"
          })
          setAllowPtBrFallback(!ptBrVoice && deviceIsPtBr)
          setVoiceResolved(true)
        }
      } catch {
        if (mounted) {
          setAvailableNarratorVoices([])
          setNarratorVoice(null)
          setSelectedNarratorVoiceId("auto")
          setAllowPtBrFallback(/^pt[-_]?br/i.test(getDeviceLocaleTag()))
          setVoiceResolved(true)
        }
      }
    }

    loadVoices()

    return () => {
      mounted = false
    }
  }, [setSelectedNarratorVoiceId])

  return {
    narratorVoice,
    availableNarratorVoices,
    voiceResolved,
    allowPtBrFallback,
    activeNarratorVoice,
    testNarratorVoice,
  }
}
