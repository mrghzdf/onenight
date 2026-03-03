import React from "react"
import { Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import {
  ROLE_IMAGE_SOURCES,
  ROLE_MANUAL_DETAILS,
  ROLES,
  ROLE_SUBTITLES_PT,
} from "../constants/gameData"
import { styles } from "../styles"

export function GuideScreen({ selectedBackground, setScreen }) {
  const guideRoles = React.useMemo(
    () =>
      ROLES.map((role) => ({
        ...role,
        guide: ROLE_MANUAL_DETAILS[role.id],
      })),
    [],
  )

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
        <Text style={styles.subtitle}>Livro de Papeis</Text>
      </View>

      <ScrollView
        style={styles.guideScreenScroll}
        contentContainerStyle={styles.guideScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {guideRoles.map((role) => {
          const guide = role.guide
          if (!guide) {
            return null
          }

          return (
            <View key={role.id} style={styles.guideRoleCard}>
              <View style={styles.guideRoleHeader}>
                <Image
                  source={ROLE_IMAGE_SOURCES[role.id]}
                  style={styles.guideRoleImage}
                  resizeMode="contain"
                />
                <View style={styles.guideRoleHeaderText}>
                  <Text style={styles.guideRoleName}>{role.name}</Text>
                  <Text style={styles.guideRoleSubtitle}>
                    {ROLE_SUBTITLES_PT[role.id] ?? ""}
                  </Text>
                </View>
              </View>
              <Text style={styles.guideLabel}>Funcao</Text>
              <Text style={styles.guideBodyText}>{guide.role}</Text>
              <Text style={styles.guideLabel}>Acao</Text>
              <Text style={styles.guideBodyText}>{guide.action}</Text>
            </View>
          )
        })}
      </ScrollView>

      <Pressable
        style={[styles.secondaryButton, styles.guideBackButton]}
        onPress={() => setScreen("home")}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </Pressable>
    </SafeAreaView>
  )
}
