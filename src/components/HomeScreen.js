import React from "react"
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import {
  APP_THUMB,
  ROLE_IMAGE_SOURCES,
  ROLE_MAX_COPIES,
  ROLE_SUBTITLES_PT,
  ROLE_TEAM_SHORT,
} from "../constants/gameData"
import { styles } from "../styles"

export function HomeScreen({
  selectedBackground,
  setupValidation,
  roleGridData,
  selectedRoles,
  countById,
  canAddRole,
  removeRole,
  addRole,
  toggleRole,
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
      <View style={[styles.header, styles.homeHeader]}>
        <View style={styles.homeTitleRow}>
          <Text style={[styles.title, styles.homeTitle]}>ONE NIGHT</Text>
          <Image
            source={APP_THUMB}
            style={styles.homeHeaderThumb}
            resizeMode="cover"
          />
        </View>
        <View style={styles.homeSubtitleRow}>
          <Text style={styles.homeSubtitle}>Ultimate Werewolf PT-BR</Text>
          <Pressable
            style={styles.bookButton}
            onPress={() => setScreen("guide")}
            accessibilityRole="button"
            accessibilityLabel="Abrir guia dos personagens"
          >
            <Text style={styles.bookButtonIcon}>📖</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          Papéis selecionados:{" "}
          <Text style={styles.infoNumber}>{setupValidation.totalRoles}</Text>
        </Text>
        <Text style={styles.infoText}>
          Jogadores recomendados:{" "}
          <Text style={styles.infoNumber}>
            {setupValidation.recommendedPlayers}
          </Text>
        </Text>
        {!setupValidation.isValid ? (
          <View style={styles.setupWarningBox}>
            <Text style={styles.setupWarningTitle}>Ajuste necessário:</Text>
            {setupValidation.errors.map((message) => (
              <Text key={message} style={styles.setupWarningText}>
                • {message}
              </Text>
            ))}
          </View>
        ) : null}
        {setupValidation.warnings.length > 0 ? (
          <View style={styles.setupHintBox}>
            <Text style={styles.setupHintTitle}>Sugestões de equilíbrio:</Text>
            {setupValidation.warnings.map((message) => (
              <Text key={message} style={styles.setupHintText}>
                • {message}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      <FlatList
        style={styles.roleListView}
        data={roleGridData}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.roleList}
        columnWrapperStyle={styles.roleRow}
        renderItem={({ item: role }) => {
          if (role.isSpacer) {
            return <View style={styles.roleCardSpacer} />
          }

          const count = countById(selectedRoles, role.id)
          const selected = count > 0

          return (
            <View
              key={role.id}
              style={[styles.roleCard, selected ? styles.roleSelected : null]}
            >
              <Image
                source={ROLE_IMAGE_SOURCES[role.id]}
                style={styles.roleImage}
                resizeMode="contain"
              />
              <Text style={styles.roleName} numberOfLines={1}>
                {role.name}
              </Text>
              <Text style={styles.roleSubtitle} numberOfLines={1}>
                {ROLE_SUBTITLES_PT[role.id] ?? ""}
              </Text>
              <Text style={styles.roleTeam} numberOfLines={1}>
                {ROLE_TEAM_SHORT[role.id] ?? ""}
              </Text>
              <Text style={styles.roleCount}>
                Selecionado: {count}/{ROLE_MAX_COPIES[role.id] ?? 1}
              </Text>
              <View style={styles.roleActions}>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() => removeRole(role.id)}
                >
                  <Text style={styles.smallBtnText}>-</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.smallBtn,
                    !canAddRole(role.id) ? styles.smallBtnDisabled : null,
                  ]}
                  onPress={() => addRole(role.id)}
                  disabled={!canAddRole(role.id)}
                >
                  <Text style={styles.smallBtnText}>+</Text>
                </Pressable>
                <Pressable
                  style={styles.clearBtn}
                  onPress={() => toggleRole(role.id)}
                >
                  <Text
                    style={styles.clearBtnText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    Limpar
                  </Text>
                </Pressable>
              </View>
            </View>
          )
        }}
      />

      <View style={styles.homeActionsRow}>
        <Pressable
          style={styles.homeActionButton}
          onPress={() => setScreen("settings")}
        >
          <Text
            style={styles.homeButtonText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            Configurações
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.homeActionButton,
            styles.homePlayButton,
            !setupValidation.isValid ? styles.homeActionButtonDisabled : null,
          ]}
          onPress={() => {
            if (!setupValidation.isValid) {
              return
            }
            setScreen("play")
          }}
          disabled={!setupValidation.isValid}
        >
          <Text
            style={styles.homeButtonText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            Jogar
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
