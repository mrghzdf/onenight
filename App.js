import React, { useEffect, useMemo, useRef, useState } from "react"
import * as Speech from "expo-speech"
import { useFonts } from "expo-font"
import { AUDIO_TRACKS } from "./src/audioTracks"
import { HomeScreen } from "./src/components/HomeScreen"
import { GuideScreen } from "./src/components/GuideScreen"
import { PlayScreen } from "./src/components/PlayScreen"
import { SettingsScreen } from "./src/components/SettingsScreen"
import { useAudioControls } from "./src/hooks/useAudioControls"
import { usePersistedGameState } from "./src/hooks/usePersistedGameState"
import { useVoiceManager } from "./src/hooks/useVoiceManager"
import {
  APP_BACKGROUND,
  BACKGROUND_OPTIONS,
  ROLE_MAX_COPIES,
  ROLES,
} from "./src/constants/gameData"
import {
  buildNightScript,
  buildRoleGridData,
  buildSetupValidation,
  countById,
  formatTime,
  formatVoiceOption,
} from "./src/utils/gameHelpers"
import {
  addRoleSelection,
  canAddRole as canAddRoleSelection,
  removeRoleSelection,
  toggleRoleSelection,
} from "./src/utils/roleSelection"
import packageJson from "./package.json"

const APP_VERSION = packageJson.version || "1.0.0"

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    "Butcherman-Regular": require("./assets/fonts/Butcherman-Regular.ttf"),
  })

  const [screen, setScreen] = useState("home")
  const [stepIndex, setStepIndex] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [paused, setPaused] = useState(false)
  const hasLoggedFontErrorRef = useRef(false)

  const {
    selectedRoles,
    setSelectedRoles,
    settings,
    setSettings,
    selectedTrackKey,
    setSelectedTrackKey,
    selectedNarratorVoiceId,
    setSelectedNarratorVoiceId,
  } = usePersistedGameState()

  const script = useMemo(
    () => buildNightScript(selectedRoles, settings),
    [selectedRoles, settings],
  )

  const currentStep = script[stepIndex]

  const selectedTrack = useMemo(
    () =>
      AUDIO_TRACKS.find((track) => track.key === selectedTrackKey) ||
      AUDIO_TRACKS[0] ||
      null,
    [selectedTrackKey],
  )

  const selectedBackground = useMemo(
    () =>
      BACKGROUND_OPTIONS.find((bg) => bg.key === settings.backgroundKey)
        ?.source || APP_BACKGROUND,
    [settings.backgroundKey],
  )

  const roleGridData = useMemo(() => buildRoleGridData(ROLES), [])
  const setupValidation = useMemo(
    () => buildSetupValidation(selectedRoles),
    [selectedRoles],
  )

  const {
    narratorVoice,
    availableNarratorVoices,
    voiceResolved,
    allowPtBrFallback,
    activeNarratorVoice,
    testNarratorVoice,
  } = useVoiceManager(selectedNarratorVoiceId, setSelectedNarratorVoiceId)

  const {
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
  } = useAudioControls({
    screen,
    paused,
    selectedTrack,
    selectedTrackKey,
    settings,
    setSettings,
  })

  useEffect(() => {
    if (screen !== "play") {
      Speech.stop()
      return
    }

    setStepIndex(0)
    setPaused(false)
    setRemaining(script[0]?.duration ?? 0)
  }, [screen, script])

  useEffect(() => {
    if (screen !== "play" || !currentStep) {
      return
    }

    setRemaining(currentStep.duration)

    if (!voiceResolved) {
      return
    }

    const canNarrate = activeNarratorVoice || allowPtBrFallback
    if (settings.narrationEnabled && currentStep.speak && canNarrate) {
      Speech.stop()
      if (ambienceRef.current) {
        ambienceRef.current.setVolumeAsync(
          Math.max(0.04, settings.ambienceVolume * settings.narrationDucking),
        )
      }
      Speech.speak(currentStep.text, {
        language: "pt-BR",
        voice: activeNarratorVoice || undefined,
        pitch: 1,
        rate: 0.95,
        onDone: () =>
          ambienceRef.current?.setVolumeAsync(settings.ambienceVolume),
        onStopped: () =>
          ambienceRef.current?.setVolumeAsync(settings.ambienceVolume),
        onError: () =>
          ambienceRef.current?.setVolumeAsync(settings.ambienceVolume),
      })
    }
  }, [
    stepIndex,
    screen,
    currentStep,
    settings.narrationEnabled,
    settings.ambienceVolume,
    settings.narrationDucking,
    activeNarratorVoice,
    voiceResolved,
    allowPtBrFallback,
    ambienceRef,
  ])

  useEffect(() => {
    if (screen !== "play" || paused || !currentStep) {
      return
    }

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev > 0) {
          return prev - 1
        }

        if (prev === 0) {
          return -1
        }

        if (prev === -1) {
          setStepIndex((idx) => {
            if (idx >= script.length - 1) {
              setPaused(true)
              return idx
            }
            return idx + 1
          })
          return 0
        }

        return 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [screen, paused, currentStep, script.length])

  const toggleRole = (id) =>
    setSelectedRoles((prev) => toggleRoleSelection(prev, id))

  const canAddRole = (id) =>
    canAddRoleSelection(selectedRoles, id, ROLE_MAX_COPIES)

  const addRole = (id) =>
    setSelectedRoles((prev) => addRoleSelection(prev, id, ROLE_MAX_COPIES))

  const removeRole = (id) =>
    setSelectedRoles((prev) => removeRoleSelection(prev, id))

  if (!fontsLoaded && fontError && !hasLoggedFontErrorRef.current) {
    hasLoggedFontErrorRef.current = true
    console.warn("Falha ao carregar fonte Butcherman:", fontError)
  }

  if (screen === "settings") {
    return (
      <SettingsScreen
        selectedBackground={selectedBackground}
        settings={settings}
        setSettings={setSettings}
        selectedNarratorVoiceId={selectedNarratorVoiceId}
        setSelectedNarratorVoiceId={setSelectedNarratorVoiceId}
        availableNarratorVoices={availableNarratorVoices}
        formatVoiceOption={formatVoiceOption}
        voiceResolved={voiceResolved}
        allowPtBrFallback={allowPtBrFallback}
        testNarratorVoice={testNarratorVoice}
        selectedTrackKey={selectedTrackKey}
        setSelectedTrackKey={setSelectedTrackKey}
        prepareAudioSession={prepareAudioSession}
        ambiencePreviewRef={ambiencePreviewRef}
        ambienceRef={ambienceRef}
        createTrackSoundAsync={createTrackSoundAsync}
        setIsTestingAmbience={setIsTestingAmbience}
        setTrackAudioMessage={setTrackAudioMessage}
        setAmbienceVolume={setAmbienceVolume}
        setNarrationDucking={setNarrationDucking}
        toggleAmbiencePreview={toggleAmbiencePreview}
        isTestingAmbience={isTestingAmbience}
        trackAudioMessage={trackAudioMessage}
        appVersion={APP_VERSION}
        setScreen={setScreen}
      />
    )
  }

  if (screen === "play") {
    return (
      <PlayScreen
        selectedBackground={selectedBackground}
        currentStep={currentStep}
        voiceResolved={voiceResolved}
        activeNarratorVoice={activeNarratorVoice || narratorVoice}
        allowPtBrFallback={allowPtBrFallback}
        remaining={remaining}
        formatTime={formatTime}
        stepIndex={stepIndex}
        scriptLength={script.length}
        paused={paused}
        setPaused={setPaused}
        setStepIndex={setStepIndex}
        onStop={() => {
          Speech.stop()
          setScreen("home")
        }}
      />
    )
  }

  if (screen === "guide") {
    return (
      <GuideScreen
        selectedBackground={selectedBackground}
        setScreen={setScreen}
      />
    )
  }

  return (
    <HomeScreen
      selectedBackground={selectedBackground}
      setupValidation={setupValidation}
      roleGridData={roleGridData}
      selectedRoles={selectedRoles}
      countById={countById}
      canAddRole={canAddRole}
      removeRole={removeRole}
      addRole={addRole}
      toggleRole={toggleRole}
      setScreen={setScreen}
    />
  )
}
