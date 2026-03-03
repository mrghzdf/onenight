# APK - Build e Instalação

## Fluxo recomendado (sem depender de EAS login)

Gera APK release e instala no Android conectado via USB:

```bash
npm run build:apk:release-install
```

Saída esperada na raiz do projeto:

`./one-night-ptbr-release.apk`

## Apenas gerar APK debug local

```bash
npm run build:apk:debug-local
```

Saída esperada:

`./one-night-ptbr-debug.apk`

## Instalar APK manualmente

```bash
adb install -r one-night-ptbr-release.apk
```

## Verificar dispositivo ADB

```bash
adb devices
```

## Observações

1. O script `build:apk:release-install` já faz:
- `expo prebuild`
- `gradlew assembleRelease`
- cópia do APK para a raiz
- `adb install -r` (quando disponível)

2. Se tiver versão antiga com cache ruim, reinstale limpo:

```bash
adb uninstall com.anonymous.onenightptbr
npm run build:apk:release-install
```

3. Build com EAS continua disponível (opcional):

```bash
npm run build:apk
```
