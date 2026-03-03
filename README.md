# One Night PT-BR

App mobile (React Native + Expo) para conduzir partidas de **One Night Ultimate Werewolf** com narração em português do Brasil, seleção de papéis e trilha de fundo.

## Requisitos

- Node.js 18+
- npm 9+
- Expo CLI (via `npx`)
- Android Studio (para build/execução Android local)
- EAS CLI (para build na nuvem): `npm i -g eas-cli` (opcional)

## Instalação

```bash
npm install
```

## Rodando o projeto

```bash
npm start
```

Comandos úteis:

- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Build

- APK (EAS cloud): `npm run build:apk`
- APK local (EAS local): `npm run build:apk:local`
- APK debug local (Gradle): `npm run build:apk:debug-local`
- AAB (Play Store): `npm run build:aab`

## Scripts principais

- `npm run gen:tracks`: gera/atualiza as trilhas em `src/audioTracks.js`
- `npm run build:apk:release-install`: script de build e instalação local de release

## Estrutura

```text
src/
  components/     # telas (Home, Settings, Play)
  constants/      # dados de papéis, textos e configurações padrão
  hooks/          # áudio, persistência e gerenciamento de voz
  utils/          # helpers de jogo, script de narração e validações
assets/           # imagens, fontes e áudios
scripts/          # scripts utilitários de build e geração
```

## Observações

- O app usa `expo-speech` com preferência por voz `pt-BR`.
- Antes de `start/android/ios/web`, as trilhas são geradas automaticamente via `pre*` scripts.
- Existe documentação complementar em `README_APK.md` e `RELEASE_CHECKLIST.md`.
