import React from "react"
import { ImageBackground, Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { styles } from "../styles"

export function PlayScreen({
  selectedBackground,
  currentStep,
  voiceResolved,
  activeNarratorVoice,
  allowPtBrFallback,
  remaining,
  formatTime,
  stepIndex,
  scriptLength,
  paused,
  setPaused,
  setStepIndex,
  onStop,
}) {
  const actionText = currentStep?.text ?? "Sem roteiro."
  const actionTextStyle =
    actionText.length > 150
      ? styles.bigTextXSmall
      : actionText.length > 110
        ? styles.bigTextSmall
        : actionText.length > 80
          ? styles.bigTextMedium
          : null

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={selectedBackground}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.backgroundOverlay} />
      <View style={[styles.header, styles.playHeader]}>
        <Text style={styles.title}>ONE NIGHT</Text>
        <Text style={styles.subtitle}>{currentStep?.title ?? "Narração"}</Text>
      </View>

      <View style={[styles.card, styles.playCard]}>
        <View style={styles.playTextArea}>
          <Text
            style={[styles.bigText, actionTextStyle]}
            numberOfLines={10}
            adjustsFontSizeToFit
            minimumFontScale={0.46}
          >
            {actionText}
          </Text>
        </View>
        {voiceResolved && !activeNarratorVoice && !allowPtBrFallback ? (
          <Text style={styles.warningText}>
            Narração desativada: nenhuma voz pt-BR foi encontrada no aparelho.
          </Text>
        ) : null}
        <View style={styles.playFooter}>
          <Text style={styles.timer}>{formatTime(remaining)}</Text>
          <Text style={styles.muted}>
            Etapa {Math.min(stepIndex + 1, scriptLength)} de {scriptLength}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.actionButton} onPress={() => setPaused((prev) => !prev)}>
          <Text style={styles.buttonText}>{paused ? "Continuar" : "Pausar"}</Text>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => {
            if (stepIndex < scriptLength - 1) {
              setStepIndex((prev) => prev + 1)
            }
          }}
        >
          <Text style={styles.buttonText}>Próximo</Text>
        </Pressable>
      </View>

      <Pressable style={styles.stopButton} onPress={onStop}>
        <Text style={styles.buttonText}>Parar</Text>
      </Pressable>
    </SafeAreaView>
  )
}
