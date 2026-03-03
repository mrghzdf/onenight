export const ROLES = [
  { id: "doppelganger", name: "Doppelganger", order: 1 },
  { id: "werewolf", name: "Werewolf", order: 2 },
  { id: "minion", name: "Minion", order: 3 },
  { id: "mason", name: "Mason", order: 4 },
  { id: "seer", name: "Sser", order: 5 },
  { id: "robber", name: "Robber", order: 6 },
  { id: "troublemaker", name: "Troublemaker", order: 7 },
  { id: "drunk", name: "Drunk", order: 8 },
  { id: "insomniac", name: "Insomniac", order: 9 },
  { id: "villager", name: "Villager", order: null },
  { id: "hunter", name: "Hunter", order: null },
  { id: "tanner", name: "Tanner", order: null },
]

export const ROLE_SUBTITLES_PT = {
  doppelganger: "Sosia",
  werewolf: "Lobisomem",
  minion: "Favorito",
  mason: "Pedreiro",
  seer: "Vidente",
  robber: "Ladrao",
  troublemaker: "Encrenqueira",
  drunk: "Bebâdo",
  insomniac: "Insone",
  villager: "Aldeão",
  hunter: "Caçador",
  tanner: "Curtidor",
}

export const ROLE_IMAGE_SOURCES = {
  doppelganger: require("../../assets/characters/Doppelganger.webp"),
  werewolf: require("../../assets/characters/Werewolf.webp"),
  minion: require("../../assets/characters/Minion.webp"),
  mason: require("../../assets/characters/Mason.webp"),
  seer: require("../../assets/characters/Seer.webp"),
  robber: require("../../assets/characters/Robber.webp"),
  troublemaker: require("../../assets/characters/Troublemaker.webp"),
  drunk: require("../../assets/characters/Drunk.webp"),
  insomniac: require("../../assets/characters/Insomniac.webp"),
  villager: require("../../assets/characters/Villager.webp"),
  hunter: require("../../assets/characters/Hunter.webp"),
  tanner: require("../../assets/characters/Tanner.webp"),
}

export const APP_BACKGROUND = require("../../assets/images/background.jpg")
export const APP_THUMB = require("../../assets/images/thumbmail_jogo.png")

export const BACKGROUND_OPTIONS = [
  {
    key: "bg1",
    label: "Fundo 1",
    source: require("../../assets/images/background.jpg"),
  },
  {
    key: "bg2",
    label: "Fundo 2",
    source: require("../../assets/images/background2.png"),
  },
]

export const DEFAULT_SELECTED = [
  "werewolf",
  "werewolf",
  "minion",
  "mason",
  "mason",
  "seer",
  "troublemaker",
  "insomniac",
  "villager",
  "hunter",
]

export const DEFAULT_SETTINGS = {
  gameMinutes: 5,
  roleSeconds: 5,
  pauseBetweenRoles: true,
  pauseSeconds: 5,
  verbose: true,
  narrationEnabled: true,
  ambienceVolume: 0.45,
  narrationDucking: 0.35,
  backgroundKey: "bg1",
}

export const APP_STORAGE_KEY = "@one-night-ptbr:v1"

export const ROLE_MAX_COPIES = {
  doppelganger: 1,
  werewolf: 2,
  minion: 1,
  mason: 2,
  seer: 1,
  robber: 1,
  troublemaker: 1,
  drunk: 1,
  insomniac: 1,
  villager: 3,
  hunter: 1,
  tanner: 1,
}

export const ROLE_PT_NAMES = {
  doppelganger: "Sósia",
  werewolf: "Lobisomens",
  minion: "Favorito",
  mason: "Pedreiros",
  seer: "Vidente",
  robber: "Ladrão",
  troublemaker: "Encrenqueiro",
  drunk: "Bêbado",
  insomniac: "Insone",
}

export const ROLE_TEAM_SHORT = {
  doppelganger: "Time: Vilarejo",
  werewolf: "Time: Lobisomens",
  minion: "Time: Lobisomens",
  mason: "Time: Vilarejo",
  seer: "Time: Vilarejo",
  robber: "Time: Vilarejo",
  troublemaker: "Time: Vilarejo",
  drunk: "Time: Vilarejo",
  insomniac: "Time: Vilarejo",
  villager: "Time: Vilarejo",
  hunter: "Time: Vilarejo",
  tanner: "Time: Solo",
}

export const ROLE_CALL_NAMES = {
  doppelganger: "Doppelganger, Sósia",
  werewolf: "Lobisomens",
  minion: "Minion",
  mason: "Masons",
  seer: "Seer, Vidente",
  robber: "Robber, Ladrão",
  troublemaker: "Troublemaker, Encrenqueiro",
  drunk: "Drunk, Bêbado",
  insomniac: "Insomniac",
}

export const ROLE_LINES = {
  doppelganger: `${ROLE_CALL_NAMES.doppelganger}, acorde e olhe a carta de outro jogador.`,
  werewolf: `${ROLE_CALL_NAMES.werewolf}, acordem e procurem outros Lobisomens.`,
  minion: `${ROLE_CALL_NAMES.minion}, acorde. ${ROLE_CALL_NAMES.werewolf}, levantem o dedo para o ${ROLE_CALL_NAMES.minion} ver quem vocês são.`,
  mason: `${ROLE_CALL_NAMES.mason}, acordem e procurem outros Masons.`,
  seer: `${ROLE_CALL_NAMES.seer}, acorde. Você pode olhar a carta de outro jogador ou duas cartas do centro.`,
  robber: `${ROLE_CALL_NAMES.robber}, acorde. Você pode trocar sua carta com a de outro jogador e ver sua nova carta.`,
  troublemaker: `${ROLE_CALL_NAMES.troublemaker}, acorde. Você pode trocar as cartas de dois outros jogadores.`,
  drunk: `${ROLE_CALL_NAMES.drunk}, acorde e troque sua carta por uma carta do centro, sem olhar.`,
  insomniac: `${ROLE_CALL_NAMES.insomniac}, acorde e olhe sua carta para ver se ela mudou.`,
}
