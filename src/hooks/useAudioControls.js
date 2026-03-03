import { useEffect, useRef, useState } from "react"
import { Audio } from "expo-av"
import { Asset } from "expo-asset"

export function useAudioControls({
  screen,
  paused,
  selectedTrack,
  selectedTrackKey,
  settings,
  setSettings,
}) {
  const ambienceRef = useRef(null)
  const ambiencePreviewRef = useRef(null)
  const [isTestingAmbience, setIsTestingAmbience] = useState(false)
  const [trackAudioMessage, setTrackAudioMessage] = useState("")
  const [audioReady, setAudioReady] = useState(false)

  const setAmbienceVolume = (volume) => {
    const clamped = Math.max(0, Math.min(1, volume))
    setSettings((prev) => ({ ...prev, ambienceVolume: clamped }))
  }

  const setNarrationDucking = (factor) => {
    const clamped = Math.max(0.1, Math.min(1, factor))
    setSettings((prev) => ({ ...prev, narrationDucking: clamped }))
  }

  const prepareAudioSession = async () => {
    const interruptionModeIOS =
      Audio?.InterruptionModeIOS?.DuckOthers ??
      Audio?.InterruptionModeIOS?.MixWithOthers ??
      2
    const interruptionModeAndroid =
      Audio?.InterruptionModeAndroid?.DuckOthers ??
      Audio?.InterruptionModeAndroid?.DoNotMix ??
      2

    await Audio.setIsEnabledAsync(true)
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
      interruptionModeIOS,
      interruptionModeAndroid,
    })
    if (!audioReady) {
      setAudioReady(true)
    }
  }

  const createTrackSoundAsync = async (
    track,
    { shouldPlay = false, isLooping = true } = {},
  ) => {
    const playbackStatus = {
      isLooping,
      isMuted: false,
      volume: settings.ambienceVolume,
      shouldPlay,
    }

    try {
      return await Audio.Sound.createAsync(track.source, playbackStatus)
    } catch (moduleError) {
      const asset = Asset.fromModule(track.source)
      const uri = asset.localUri || asset.uri
      if (!uri) {
        throw moduleError
      }
      try {
        return await Audio.Sound.createAsync({ uri }, playbackStatus)
      } catch {
        throw moduleError
      }
    }
  }

  const toggleAmbiencePreview = async () => {
    const stopAmbiencePreview = async () => {
      if (!ambiencePreviewRef.current) {
        setIsTestingAmbience(false)
        setTrackAudioMessage("Trilha pausada.")
        return
      }
      await ambiencePreviewRef.current.stopAsync()
      await ambiencePreviewRef.current.unloadAsync()
      ambiencePreviewRef.current = null
      setIsTestingAmbience(false)
      setTrackAudioMessage("Trilha pausada.")
    }

    const startAmbiencePreview = async (trackOverride = selectedTrack) => {
      if (!trackOverride) {
        setIsTestingAmbience(false)
        return
      }
      await prepareAudioSession()
      if (ambiencePreviewRef.current) {
        await ambiencePreviewRef.current.stopAsync()
        await ambiencePreviewRef.current.unloadAsync()
        ambiencePreviewRef.current = null
      }
      if (ambienceRef.current) {
        await ambienceRef.current.pauseAsync()
      }
      const { sound } = await createTrackSoundAsync(trackOverride, {
        shouldPlay: true,
        isLooping: true,
      })
      ambiencePreviewRef.current = sound
      setIsTestingAmbience(true)
      setTrackAudioMessage("Trilha em reprodução.")
    }

    try {
      if (!selectedTrack) {
        setIsTestingAmbience(false)
        setTrackAudioMessage("Nenhuma trilha selecionada.")
        return
      }
      if (settings.ambienceVolume <= 0) {
        setIsTestingAmbience(false)
        setTrackAudioMessage("Volume da trilha está em 0%.")
        return
      }

      if (isTestingAmbience) {
        await stopAmbiencePreview()
        return
      }

      await startAmbiencePreview(selectedTrack)
    } catch (error) {
      const errorMessage = error?.message
        ? ` (${String(error.message).slice(0, 90)})`
        : ""
      console.error("Falha ao tocar trilha (preview):", error)
      setIsTestingAmbience(false)
      setTrackAudioMessage(`Não foi possível tocar a trilha${errorMessage}`)
    }
  }

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await prepareAudioSession()
      } catch {
        // Ignora falha de configuracao de audio.
      }
    }

    setupAudio()

    return () => {
      if (ambienceRef.current) {
        ambienceRef.current.unloadAsync()
        ambienceRef.current = null
      }
      if (ambiencePreviewRef.current) {
        ambiencePreviewRef.current.unloadAsync()
        ambiencePreviewRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (screen !== "settings" && ambiencePreviewRef.current) {
      const stopPreview = async () => {
        try {
          await ambiencePreviewRef.current.stopAsync()
          await ambiencePreviewRef.current.unloadAsync()
        } catch {
          // Ignora falha ao fechar teste de trilha.
        } finally {
          ambiencePreviewRef.current = null
          setIsTestingAmbience(false)
        }
      }
      stopPreview()
    }
  }, [screen])

  useEffect(() => {
    const applyPreviewVolume = async () => {
      try {
        if (ambiencePreviewRef.current) {
          await ambiencePreviewRef.current.setVolumeAsync(settings.ambienceVolume)
        }
      } catch {
        // Ignora falha ao atualizar volume da trilha de teste.
      }
    }

    applyPreviewVolume()
  }, [settings.ambienceVolume])

  useEffect(() => {
    const syncAmbience = async () => {
      try {
        if (!selectedTrack) {
          return
        }

        if (screen !== "play") {
          if (ambienceRef.current) {
            await ambienceRef.current.stopAsync()
            await ambienceRef.current.unloadAsync()
            ambienceRef.current = null
          }
          return
        }

        if (!ambienceRef.current) {
          await prepareAudioSession()
          const { sound } = await createTrackSoundAsync(selectedTrack, {
            shouldPlay: !paused,
            isLooping: true,
          })
          ambienceRef.current = sound
        }

        if (paused) {
          await ambienceRef.current.pauseAsync()
        } else {
          await ambienceRef.current.setVolumeAsync(settings.ambienceVolume)
          await ambienceRef.current.playAsync()
          setTrackAudioMessage("")
        }
      } catch (error) {
        const errorMessage = error?.message
          ? ` (${String(error.message).slice(0, 90)})`
          : ""
        console.error("Falha ao reproduzir trilha durante o jogo:", error)
        setTrackAudioMessage(
          `Falha ao reproduzir trilha durante o jogo${errorMessage}`,
        )
      }
    }

    syncAmbience()
  }, [screen, paused, selectedTrackKey, settings.ambienceVolume, selectedTrack])

  return {
    ambienceRef,
    ambiencePreviewRef,
    isTestingAmbience,
    setIsTestingAmbience,
    trackAudioMessage,
    setTrackAudioMessage,
    setAmbienceVolume,
    setNarrationDucking,
    prepareAudioSession,
    createTrackSoundAsync,
    toggleAmbiencePreview,
  }
}
