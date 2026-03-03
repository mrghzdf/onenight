import React from "react"
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { AUDIO_TRACKS } from "../audioTracks"
import { BACKGROUND_OPTIONS } from "../constants/gameData"
import { styles } from "../styles"

export function SettingsScreen({
  selectedBackground,
  settings,
  setSettings,
  selectedNarratorVoiceId,
  setSelectedNarratorVoiceId,
  availableNarratorVoices,
  formatVoiceOption,
  voiceResolved,
  allowPtBrFallback,
  testNarratorVoice,
  selectedTrackKey,
  setSelectedTrackKey,
  prepareAudioSession,
  ambiencePreviewRef,
  ambienceRef,
  createTrackSoundAsync,
  setIsTestingAmbience,
  setTrackAudioMessage,
  setAmbienceVolume,
  setNarrationDucking,
  toggleAmbiencePreview,
  isTestingAmbience,
  trackAudioMessage,
  appVersion,
  setScreen,
}) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={selectedBackground}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.backgroundOverlay} />
      <ScrollView
        style={styles.settingsScroll}
        contentContainerStyle={styles.settingsContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>ONE NIGHT</Text>
          <Text style={styles.subtitle}>Configurações</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tempo de discussão</Text>
          <View style={styles.counterRow}>
            <Pressable
              style={styles.counterBtn}
              onPress={() =>
                setSettings((prev) => ({
                  ...prev,
                  gameMinutes: Math.max(1, prev.gameMinutes - 1),
                }))
              }
            >
              <Text style={styles.counterText}>-</Text>
            </Pressable>
            <Text style={styles.counterValue}>{settings.gameMinutes} min</Text>
            <Pressable
              style={styles.counterBtn}
              onPress={() =>
                setSettings((prev) => ({
                  ...prev,
                  gameMinutes: prev.gameMinutes + 1,
                }))
              }
            >
              <Text style={styles.counterText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tempo por papel</Text>
          <View style={styles.counterRow}>
            <Pressable
              style={styles.counterBtn}
              onPress={() =>
                setSettings((prev) => ({
                  ...prev,
                  roleSeconds: Math.max(3, prev.roleSeconds - 1),
                }))
              }
            >
              <Text style={styles.counterText}>-</Text>
            </Pressable>
            <Text style={styles.counterValue}>{settings.roleSeconds} seg</Text>
            <Pressable
              style={styles.counterBtn}
              onPress={() =>
                setSettings((prev) => ({
                  ...prev,
                  roleSeconds: prev.roleSeconds + 1,
                }))
              }
            >
              <Text style={styles.counterText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.cardLabel}>Pausa entre papéis</Text>
            <Switch
              value={settings.pauseBetweenRoles}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, pauseBetweenRoles: value }))
              }
            />
          </View>
          <View style={styles.counterRow}>
            <Pressable
              style={styles.counterBtn}
              onPress={() =>
                setSettings((prev) => ({
                  ...prev,
                  pauseSeconds: Math.max(1, prev.pauseSeconds - 1),
                }))
              }
            >
              <Text style={styles.counterText}>-</Text>
            </Pressable>
            <Text style={styles.counterValue}>{settings.pauseSeconds} seg</Text>
            <Pressable
              style={styles.counterBtn}
              onPress={() =>
                setSettings((prev) => ({
                  ...prev,
                  pauseSeconds: prev.pauseSeconds + 1,
                }))
              }
            >
              <Text style={styles.counterText}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.cardLabel}>Narração por voz</Text>
            <Switch
              value={settings.narrationEnabled}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, narrationEnabled: value }))
              }
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.cardLabel}>Modo verboso</Text>
            <Switch
              value={settings.verbose}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, verbose: value }))
              }
            />
          </View>
          <Text style={styles.helperText}>
            Quando ativado, o narrador fala instruções extras (ex.: "fechem os
            olhos"). Quando desativado, a narração fica mais direta e curta.
          </Text>
          <Text style={styles.voicePickerLabel}>Narrador PT-BR</Text>
          <View style={styles.voiceOptionsRow}>
            <Pressable
              style={[
                styles.voiceOptionButton,
                selectedNarratorVoiceId === "auto"
                  ? styles.voiceOptionButtonActive
                  : null,
              ]}
              onPress={() => setSelectedNarratorVoiceId("auto")}
            >
              <Text
                style={[
                  styles.voiceOptionText,
                  selectedNarratorVoiceId === "auto"
                    ? styles.voiceOptionTextActive
                    : null,
                ]}
              >
                Automático
              </Text>
            </Pressable>
            {availableNarratorVoices.map((voice) => {
              const isActive = selectedNarratorVoiceId === voice.identifier
              return (
                <Pressable
                  key={voice.identifier}
                  style={[
                    styles.voiceOptionButton,
                    isActive ? styles.voiceOptionButtonActive : null,
                  ]}
                  onPress={() => setSelectedNarratorVoiceId(voice.identifier)}
                >
                  <Text
                    style={[
                      styles.voiceOptionText,
                      isActive ? styles.voiceOptionTextActive : null,
                    ]}
                  >
                    {formatVoiceOption(voice)}
                  </Text>
                </Pressable>
              )
            })}
          </View>
          {voiceResolved &&
          availableNarratorVoices.length === 0 &&
          !allowPtBrFallback ? (
            <Text style={styles.voiceHintText}>
              Nenhuma voz PT-BR listada no sistema.
            </Text>
          ) : null}
          <Pressable style={styles.voiceTestButton} onPress={testNarratorVoice}>
            <Text style={styles.voiceTestButtonText}>Testar voz</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Trilha de fundo</Text>
          <View style={styles.trackRow}>
            {AUDIO_TRACKS.map((track) => {
              const isActive = track.key === selectedTrackKey
              return (
                <Pressable
                  key={track.key}
                  style={[styles.trackButton, isActive ? styles.trackButtonActive : null]}
                  onPress={() => {
                    setSelectedTrackKey(track.key)
                    void (async () => {
                      try {
                        await prepareAudioSession()
                        if (ambiencePreviewRef.current) {
                          await ambiencePreviewRef.current.stopAsync()
                          await ambiencePreviewRef.current.unloadAsync()
                          ambiencePreviewRef.current = null
                        }
                        if (ambienceRef.current) {
                          await ambienceRef.current.pauseAsync()
                        }
                        const { sound } = await createTrackSoundAsync(track, {
                          shouldPlay: true,
                          isLooping: true,
                        })
                        ambiencePreviewRef.current = sound
                        setIsTestingAmbience(true)
                        setTrackAudioMessage(
                          settings.ambienceVolume <= 0
                            ? "Volume da trilha está em 0%."
                            : "Trilha em reprodução.",
                        )
                      } catch (error) {
                        const errorMessage = error?.message
                          ? ` (${String(error.message).slice(0, 90)})`
                          : ""
                        console.error("Falha ao trocar/testar trilha:", error)
                        setTrackAudioMessage(
                          `Não foi possível tocar esta trilha${errorMessage}`,
                        )
                        setIsTestingAmbience(false)
                      }
                    })()
                  }}
                >
                  <Text
                    style={[
                      styles.trackButtonText,
                      isActive ? styles.trackButtonTextActive : null,
                    ]}
                  >
                    {track.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
          <View style={styles.counterRow}>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setAmbienceVolume(settings.ambienceVolume - 0.05)}
            >
              <Text style={styles.counterText}>-</Text>
            </Pressable>
            <Text style={styles.counterValue}>
              Volume: {Math.round(settings.ambienceVolume * 100)}%
            </Text>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setAmbienceVolume(settings.ambienceVolume + 0.05)}
            >
              <Text style={styles.counterText}>+</Text>
            </Pressable>
          </View>
          <View style={styles.counterRow}>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setNarrationDucking(settings.narrationDucking - 0.05)}
            >
              <Text style={styles.counterText}>-</Text>
            </Pressable>
            <Text style={styles.duckingValueText}>
              Trilha na narração: {Math.round(settings.narrationDucking * 100)}%
            </Text>
            <Pressable
              style={styles.counterBtn}
              onPress={() => setNarrationDucking(settings.narrationDucking + 0.05)}
            >
              <Text style={styles.counterText}>+</Text>
            </Pressable>
          </View>
          <Pressable style={styles.trackTestButton} onPress={toggleAmbiencePreview}>
            <Text style={styles.trackTestButtonText}>
              {isTestingAmbience ? "Parar trilha" : "Testar trilha"}
            </Text>
          </Pressable>
          {trackAudioMessage ? (
            <Text style={styles.trackAudioMessage}>{trackAudioMessage}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Imagem de fundo</Text>
          <View style={styles.trackRow}>
            {BACKGROUND_OPTIONS.map((bg) => {
              const isActive = bg.key === settings.backgroundKey
              return (
                <Pressable
                  key={bg.key}
                  style={[styles.trackButton, isActive ? styles.trackButtonActive : null]}
                  onPress={() =>
                    setSettings((prev) => ({
                      ...prev,
                      backgroundKey: bg.key,
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.trackButtonText,
                      isActive ? styles.trackButtonTextActive : null,
                    ]}
                  >
                    {bg.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Sobre</Text>
          <Text style={styles.aboutText}>One Night Ultimate Werewolf - PT-BR</Text>
          <Text style={styles.aboutSubtext}>Desenvolvido por Djalma Rodrigues</Text>
          <Text style={styles.aboutSubtext}>Versão {appVersion}</Text>
        </View>

        <Pressable
          style={[styles.secondaryButton, styles.settingsActionSecondary]}
          onPress={() => setScreen("home")}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}
