#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APK_RELEASE_PATH="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
APK_ROOT_PATH="$PROJECT_ROOT/one-night-ptbr-release.apk"

setup_node20() {
  local nvm_script="${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  if [[ -s "$nvm_script" ]]; then
    # shellcheck source=/dev/null
    . "$nvm_script"
    if command -v nvm >/dev/null 2>&1; then
      echo "==> Usando Node 20 via nvm"
      nvm use 20 >/dev/null || nvm install 20 >/dev/null
      node -v
      npm -v
      return 0
    fi
  fi

  echo "==> nvm não encontrado. Continuando com Node atual: $(node -v)"
}

find_adb() {
  if command -v adb >/dev/null 2>&1; then
    command -v adb
    return 0
  fi

  local candidates=(
    "${ANDROID_HOME:-}/platform-tools/adb"
    "${ANDROID_SDK_ROOT:-}/platform-tools/adb"
    "$HOME/Library/Android/sdk/platform-tools/adb"
  )

  for candidate in "${candidates[@]}"; do
    if [[ -n "$candidate" && -x "$candidate" ]]; then
      echo "$candidate"
      return 0
    fi
  done

  return 1
}

setup_node20

export NODE_ENV=production
echo "==> NODE_ENV=$NODE_ENV"

echo "==> Prebuild Android (Expo)"
npx expo prebuild -p android --no-install

echo "==> Build APK release (Gradle)"
(
  cd "$PROJECT_ROOT/android"
  ./gradlew assembleRelease
)

if [[ ! -f "$APK_RELEASE_PATH" ]]; then
  echo "ERRO: APK release não encontrado em: $APK_RELEASE_PATH" >&2
  exit 1
fi

echo "==> Copiando APK para raiz"
cp "$APK_RELEASE_PATH" "$APK_ROOT_PATH"

echo "==> Instalando no dispositivo via ADB"
ADB_BIN="$(find_adb || true)"
if [[ -z "${ADB_BIN:-}" ]]; then
  echo "AVISO: adb não encontrado no PATH/SDK. APK gerado em: $APK_ROOT_PATH"
  echo "Instale manualmente no celular ou configure o Android SDK no PATH."
  exit 0
fi
"$ADB_BIN" install -r "$APK_ROOT_PATH"

echo "==> Concluído: $APK_ROOT_PATH"
