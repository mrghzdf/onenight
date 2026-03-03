import * as Localization from "expo-localization"
import {
  BACKGROUND_OPTIONS,
  DEFAULT_SELECTED,
  DEFAULT_SETTINGS,
  ROLE_CALL_NAMES,
  ROLE_LINES,
  ROLE_MAX_COPIES,
  ROLES,
  ROLE_PT_NAMES,
} from "../constants/gameData"

export function buildNightScript(selectedRoles, settings) {
  const selectedSet = new Set(selectedRoles)
  const ordered = [...ROLES]
    .filter((role) => role.order && selectedSet.has(role.id))
    .sort((a, b) => a.order - b.order)

  const script = [
    {
      id: "start",
      title: "Início da noite",
      text: "Todo mundo, fechem os olhos.",
      duration: settings.roleSeconds,
      speak: true,
    },
  ]

  ordered.forEach((role) => {
    script.push({
      id: `${role.id}-open`,
      title: role.name,
      text: ROLE_LINES[role.id],
      duration: settings.roleSeconds,
      speak: true,
    })

    if (settings.pauseBetweenRoles) {
      script.push({
        id: `${role.id}-pause`,
        title: "Pausa",
        text: `(Pausa de ${settings.pauseSeconds} segundos)`,
        duration: settings.pauseSeconds,
        speak: false,
      })
    }

    script.push({
      id: `${role.id}-close`,
      title: role.name,
      text: `${ROLE_CALL_NAMES[role.id] ?? `${role.name}, ${ROLE_PT_NAMES[role.id] ?? role.name}`}, fechem os olhos.`,
      duration: 2,
      speak: settings.verbose,
    })
  })

  script.push(
    {
      id: "wake-all",
      title: "Fim da noite",
      text: "Todo mundo, acordem!",
      duration: 4,
      speak: true,
    },
    {
      id: "discussion",
      title: "Discussão",
      text: `Tempo de discussão: ${settings.gameMinutes} minutos.`,
      duration: settings.gameMinutes * 60,
      speak: true,
    },
  )

  return script
}

export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds)
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0")
  const seconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0")
  return `${minutes}:${seconds}`
}

export function countById(items, id) {
  return items.filter((item) => item === id).length
}

export function getDeviceLocaleTag() {
  const locales = Localization.getLocales?.()
  if (Array.isArray(locales) && locales.length > 0) {
    const primary = locales[0]
    return primary?.languageTag || `${primary?.languageCode || ""}-${primary?.regionCode || ""}`
  }

  const fallbackLocale = Localization.locale || ""
  if (fallbackLocale) {
    return fallbackLocale
  }

  return "pt-BR"
}

export function pickBrazilianVoice(voices, locale) {
  if (!Array.isArray(voices)) {
    return null
  }

  const localeCandidates = [locale, locale?.replace("_", "-")].filter(Boolean)

  const isPtBrVoice = (voice) => {
    const voiceLocale = (voice.language || "").replace("_", "-").toLowerCase()
    const voiceName = `${voice.name || ""} ${voice.identifier || ""}`.toLowerCase()
    return (
      voiceLocale.includes("pt-br") ||
      voiceLocale === "pt-br" ||
      (/^pt-?br/.test(voiceLocale) && !voiceLocale.includes("pt-pt")) ||
      voiceName.includes("pt-br") ||
      voiceName.includes("brazil") ||
      voiceName.includes("brasil")
    )
  }

  const sameLocale = voices.find((voice) =>
    localeCandidates.some((candidate) => {
      const normalizedCandidate = candidate.replace("_", "-").toLowerCase()
      const normalizedVoice = (voice.language || "").replace("_", "-").toLowerCase()
      return normalizedVoice === normalizedCandidate
    }),
  )

  const byPtBr = voices.find(isPtBrVoice)
  const byPt = voices.find((voice) =>
    (voice.language || "").toLowerCase().startsWith("pt"),
  )

  return sameLocale || byPtBr || byPt || null
}

export function listBrazilianVoices(voices, locale) {
  if (!Array.isArray(voices)) {
    return []
  }

  const localeCandidates = [locale, locale?.replace("_", "-")]
    .filter(Boolean)
    .map((item) => item.toLowerCase())

  const filtered = voices.filter((voice) => {
    const voiceLocale = (voice.language || "").replace("_", "-").toLowerCase()
    const voiceName = `${voice.name || ""} ${voice.identifier || ""}`.toLowerCase()

    if (voiceLocale.includes("pt-pt")) {
      return false
    }

    return (
      localeCandidates.includes(voiceLocale) ||
      voiceLocale === "pt-br" ||
      voiceLocale.startsWith("pt") ||
      voiceName.includes("pt-br") ||
      voiceName.includes("brazil") ||
      voiceName.includes("brasil")
    )
  })

  const uniqueById = new Map()
  filtered.forEach((voice) => {
    if (voice?.identifier) {
      uniqueById.set(voice.identifier, voice)
    }
  })

  return [...uniqueById.values()].sort((a, b) => {
    const aLabel = `${a.name || ""} ${a.language || ""}`.toLowerCase()
    const bLabel = `${b.name || ""} ${b.language || ""}`.toLowerCase()
    return aLabel.localeCompare(bLabel)
  })
}

export function formatVoiceOption(voice) {
  const name = voice?.name || "Voz"
  const language = (voice?.language || "pt-BR").replace("_", "-")
  return `${name} (${language})`
}

export function sanitizeSelectedRoles(rawRoles) {
  if (!Array.isArray(rawRoles)) {
    return DEFAULT_SELECTED
  }

  const sanitized = []
  rawRoles.forEach((roleId) => {
    if (!ROLE_MAX_COPIES[roleId]) {
      return
    }
    const currentCount = countById(sanitized, roleId)
    if (currentCount < ROLE_MAX_COPIES[roleId]) {
      sanitized.push(roleId)
    }
  })

  if (sanitized.length === 0) {
    return DEFAULT_SELECTED
  }

  return sanitized
}

export function sanitizeSettings(rawSettings) {
  if (!rawSettings || typeof rawSettings !== "object") {
    return DEFAULT_SETTINGS
  }

  return {
    gameMinutes: Number.isFinite(rawSettings.gameMinutes)
      ? Math.max(1, Math.floor(rawSettings.gameMinutes))
      : DEFAULT_SETTINGS.gameMinutes,
    roleSeconds: Number.isFinite(rawSettings.roleSeconds)
      ? Math.max(3, Math.floor(rawSettings.roleSeconds))
      : DEFAULT_SETTINGS.roleSeconds,
    pauseBetweenRoles:
      typeof rawSettings.pauseBetweenRoles === "boolean"
        ? rawSettings.pauseBetweenRoles
        : DEFAULT_SETTINGS.pauseBetweenRoles,
    pauseSeconds: Number.isFinite(rawSettings.pauseSeconds)
      ? Math.max(1, Math.floor(rawSettings.pauseSeconds))
      : DEFAULT_SETTINGS.pauseSeconds,
    verbose:
      typeof rawSettings.verbose === "boolean"
        ? rawSettings.verbose
        : DEFAULT_SETTINGS.verbose,
    narrationEnabled:
      typeof rawSettings.narrationEnabled === "boolean"
        ? rawSettings.narrationEnabled
        : DEFAULT_SETTINGS.narrationEnabled,
    ambienceVolume: Number.isFinite(rawSettings.ambienceVolume)
      ? Math.max(0, Math.min(1, rawSettings.ambienceVolume))
      : DEFAULT_SETTINGS.ambienceVolume,
    narrationDucking: Number.isFinite(rawSettings.narrationDucking)
      ? Math.max(0.1, Math.min(1, rawSettings.narrationDucking))
      : DEFAULT_SETTINGS.narrationDucking,
    backgroundKey: BACKGROUND_OPTIONS.some(
      (bg) => bg.key === rawSettings.backgroundKey,
    )
      ? rawSettings.backgroundKey
      : DEFAULT_SETTINGS.backgroundKey,
  }
}

export function buildRoleGridData(roles) {
  const data = [...roles]
  if (data.length % 2 !== 0) {
    data.push({ id: "__spacer__", isSpacer: true })
  }
  return data
}

export function buildSetupValidation(selectedRoles) {
  const totalRoles = selectedRoles.length
  const recommendedPlayers = Math.max(0, totalRoles - 3)
  const werewolfCount = countById(selectedRoles, "werewolf")
  const minionCount = countById(selectedRoles, "minion")
  const villagerCount = countById(selectedRoles, "villager")
  const infoRolesCount =
    countById(selectedRoles, "seer") +
    countById(selectedRoles, "robber") +
    countById(selectedRoles, "troublemaker") +
    countById(selectedRoles, "drunk") +
    countById(selectedRoles, "insomniac") +
    countById(selectedRoles, "doppelganger")

  const errors = []
  const warnings = []

  if (totalRoles < 6) {
    errors.push("Selecione no mínimo 6 papéis para jogar com 3+ jogadores.")
  }
  if (totalRoles > 13) {
    errors.push(
      "Selecione no máximo 13 papéis para manter 3 cartas no centro e 10 jogadores.",
    )
  }
  if (werewolfCount === 0) {
    errors.push("Inclua pelo menos 1 Lobisomem na partida.")
  }
  if (recommendedPlayers < 3 || recommendedPlayers > 10) {
    errors.push("Total de jogadores recomendado deve ficar entre 3 e 10.")
  }

  if (infoRolesCount === 0) {
    warnings.push(
      "Sem papéis de informação (Seer/Robber/Troublemaker etc.), a partida fica muito aleatória.",
    )
  }
  if (werewolfCount === 1 && minionCount === 0) {
    warnings.push("Com apenas 1 Lobisomem, incluir Minion costuma equilibrar melhor.")
  }
  if (villagerCount >= 3) {
    warnings.push(
      "Muitos Villagers reduzem habilidades noturnas e deixam a rodada menos dinâmica.",
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalRoles,
    recommendedPlayers,
  }
}
