import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AUDIO_TRACKS, DEFAULT_TRACK_KEY } from "../audioTracks"
import {
  APP_STORAGE_KEY,
  DEFAULT_SELECTED,
  DEFAULT_SETTINGS,
} from "../constants/gameData"
import { sanitizeSelectedRoles, sanitizeSettings } from "../utils/gameHelpers"

const STORAGE_AVAILABLE =
  !!AsyncStorage &&
  typeof AsyncStorage.getItem === "function" &&
  typeof AsyncStorage.setItem === "function"

export function usePersistedGameState() {
  const [selectedRoles, setSelectedRoles] = useState(DEFAULT_SELECTED)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [selectedTrackKey, setSelectedTrackKey] = useState(DEFAULT_TRACK_KEY)
  const [selectedNarratorVoiceId, setSelectedNarratorVoiceId] = useState("auto")
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    let mounted = true

    const hydrateAppState = async () => {
      if (!STORAGE_AVAILABLE) {
        if (mounted) {
          setIsHydrated(true)
        }
        return
      }
      try {
        const raw = await AsyncStorage.getItem(APP_STORAGE_KEY)
        if (!raw) {
          return
        }
        const parsed = JSON.parse(raw)
        if (!mounted) {
          return
        }

        if (parsed?.settings) {
          setSettings(sanitizeSettings(parsed.settings))
        }
        if (parsed?.selectedRoles) {
          setSelectedRoles(sanitizeSelectedRoles(parsed.selectedRoles))
        }
        if (
          parsed?.selectedTrackKey &&
          AUDIO_TRACKS.some((track) => track.key === parsed.selectedTrackKey)
        ) {
          setSelectedTrackKey(parsed.selectedTrackKey)
        }
        if (typeof parsed?.selectedNarratorVoiceId === "string") {
          setSelectedNarratorVoiceId(parsed.selectedNarratorVoiceId || "auto")
        }
      } catch {
        // Ignora falha ao restaurar estado.
      } finally {
        if (mounted) {
          setIsHydrated(true)
        }
      }
    }

    hydrateAppState()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!isHydrated || !STORAGE_AVAILABLE) {
      return
    }

    const payload = {
      settings,
      selectedRoles,
      selectedTrackKey,
      selectedNarratorVoiceId,
    }

    AsyncStorage.setItem(APP_STORAGE_KEY, JSON.stringify(payload)).catch(() => {
      // Ignora falha ao persistir estado.
    })
  }, [
    isHydrated,
    settings,
    selectedRoles,
    selectedTrackKey,
    selectedNarratorVoiceId,
  ])

  return {
    selectedRoles,
    setSelectedRoles,
    settings,
    setSettings,
    selectedTrackKey,
    setSelectedTrackKey,
    selectedNarratorVoiceId,
    setSelectedNarratorVoiceId,
    isHydrated,
  }
}
